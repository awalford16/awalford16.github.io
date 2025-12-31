## AWS Setup

### Resources

**Virtual Private Gateway**

This resource is the AWS-side of the VPN connection. Once the tunnel is up, to successfully get instances to talk down the tunnel, the subnet route tables will need to reference this VPN Gateway resource to route specific CIDR destinations down the VPN tunnel.

```
resource "aws_vpn_gateway" "vpn_gateway" {
  vpc_id = aws_vpc.main.id
}
```

**Customer Gateway**

The customer gateway resource defines the customer-side of the connection. This will simply specify the public IP address of the customer-side of the connection.

```
resource "aws_customer_gateway" "customer_gateway" {
  bgp_asn    = 65000
  ip_address = ONPREM_PUBLIC_IP
  type       = "ipsec.1"
}
```

**VPN Connection**

This resource ties the previous 2 resources together, and defines the encryption and phase settings for the tunnel connection which will need to be recipricated on the on-prem setup to successfully initialise the tunnel.

```
resource "aws_vpn_connection" "main" {
  vpn_gateway_id      = aws_vpn_gateway.vpn_gateway.id
  customer_gateway_id = aws_customer_gateway.customer_gateway.id

  type               = "ipsec.1"
  static_routes_only = true

  # Forcefully use ikev2 over v1
  tunnel1_ike_versions                 = ["ikev2"]
  tunnel1_phase1_dh_group_numbers      = [14]
  tunnel1_phase1_encryption_algorithms = ["AES128"]
  tunnel1_phase1_integrity_algorithms  = ["SHA1"]

  tunnel1_phase2_dh_group_numbers      = [14]
  tunnel1_phase2_encryption_algorithms = ["AES128"]
  tunnel1_phase2_integrity_algorithms  = ["SHA1"]
}
```

*Options*

It is best to explicitly define a DH group of 14 and IKE version of `v2`. This is because Libreswan does not support DH group 2 by default, and defaults to using ikev2 for more secure connections.

You need to define options for both phases of the tunnel setup. 

Definition of the phases from [Libreswan](https://libreswan.org/wiki/How_to_read_status_output):


> Fully working VPN connections consist of an IKE SA (phase1) and an IPsec SA (phase2). The IKE SA refers to the > userland state and describes the endpoints IKE negotiation state. The IPsec SA refers to the kernel state that > is actually responsible for encrypting and decrypting the IP packets.

*Static Routes*

The connection specifies the use of static routes only, meaning the routes that get sent down the tunnel need to be explicitly specified.

```
resource "aws_vpn_connection_route" "onprem_route" {
  destination_cidr_block = ONPREM_PRIVATE_CIDR
  vpn_connection_id      = aws_vpn_connection.main.id
}
```

**BGP Setup**

To have AWS share and learn routes dynamically, the VPN gateways can be configured to use BGP. This setup requires `static_routes_only = false` and the `bgp_asn` configured on the customer gateway.

## Libreswan Setup

Libreswan is an open-source IPSec VPN tunnel tool which can be used for setting up VPN tunnels using IKEv2.

On Linux, it can be installed with a simple `apt install` or `dnf install`.

### Policy Based Routing

By default, libreswan uses policy-based routing descisions to determine where to send the traffic. You can view policies on linux with `ip xfrm policy`

Running `ip xfrm state` will show something like this:

```
src 172.32.0.178 dst 18.132.182.97
	proto esp spi 0xc9367acb reqid 16393 mode tunnel
	replay-window 0 flag af-unspec
	auth-trunc hmac(sha1) ...
	enc cbc(aes) ...
	...
```

This shows the routing rules for the VPN setup, showing that if I need to get to 

### Setup

**Firewall Rules**

Use iptables to allow UPD connections to libreswan

```
sudo iptables -A INPUT -p udp --dport 500 -j ACCEPT
sudo iptables -A INPUT -p udp --dport 4500 -j ACCEPT
sudo iptables -A INPUT -p esp -j ACCEPT
sudo iptables -A INPUT -p ah -j ACCEPT
```

**Kernel Parameter Configuration**

You may be required to configure kernel parameters in `/etc/sysctl.conf`.

```
net.ipv4.ip_forward = 1
net.ipv4.conf.all.accept_redirects = 0
net.ipv4.conf.default.accept_redirects = 0
net.ipv4.conf.all.send_redirects = 0
net.ipv4.conf.default.send_redirects = 0
```

`ip_forward` enables packet forwarding allowing them to move between the different interfaces on the Libreswan host.

`accept_redirects=0` disables ICMP redirects due to the risk of dynamic route table changes on the host. The same applies for sending ICMP redirects.

Run `sysctl -p` to apply the changes

**Connection Key**

Add the connection secret key to `/etc/ipsec.d/aws.conf`

```
ONPREM_PUBLIC_IP AWS_PUBLIC_IP: PSK "SECRET_KEY"
```

**Connection Config File**

Define a connection configuration for a VPN in `/etc/ipsec.d/VPN_NAME.conf`.

```
conn aws
	authby=secret
	auto=start

	left=%defaultroute
	leftid=<ONPREM_PUBLIC_IP>
	leftsubnet=<LOCAL NETWORK>

	right=<AWS_PUBLIC_IP>
	rightsubnet=<REMOTE NETWORK>

	type=tunnel
	ikelifetime=8h
	keylife=1h
	phase2alg=aes128-sha1;modp2048
	ike=aes128-sha1;modp2048

	keyingtries=%forever
	keyexchange=ike
	dpddelay=10
	dpdtimeout=30
	dpdaction=restart_by_peer
```

"left" refers to the local/private network, where libreswan is running, while "right" represents the AWS network.


By default, libreswan does not support Diffie-Helman group 2, due to its weakness. Instead, we force the AWS VPN connection to use Diffie-Hellman group 14 (`modp2048`) to build a more secure tunnel which works with libreswan.

AWS does provide 2 tunnels per VPN connection to account for resiliency during maintenance, and failover tunnels. The second tunnel will come with a separate public IP and secret which can be added as a new ipsec connection in libreswan, the same way as the one above is setup.

**Bring Up the Tunnel**

You can verify ipsec config with `ipsec verify`. Providing all goes to plan the AWS connection can be added with:

```
ipsec addconn --config /etc/ipsec.conf aws
```

And then bring up the connection with:

```
ipsec auto --up aws
```


**IPSec Commands**

```
# Verify the ipsec setup
ipsec verify

# Add a connection
ipsec addconn --config /etc/ipsec.conf CONN_NAME

# View traffic status
ipsec trafficstatus

# Show routing policies
ip xfrm policy
```

## Glossary

Word | Description
---|---
ESP | Encapsulating Security Payload is a protocol part of the IPSec suite. ESP encrypts the entire IP packet and adds a new IP header to allow it be securely transferred through the network.
AH | Authentication Header is an authentication protocol used to provide data integrity, ensuring that data has not been chaned during transit.
Inside IP | The IP addresses that AWS and on-premise sites use to communicate BGP information and tunnel data
