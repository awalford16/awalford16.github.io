This doc provides an overview on connecting an on-premise network to Azure cloud via a IPSec VPN Tunnel (not an express-route).

## Azure Resources

The Azure architecture side is built up of 5 main components: Virtual Network, Public IP, Local Network Gateway, Virtual Network Gateway and a Connection

### Virtual Network

The gateway will need to be tied to a virtual network. From this network, it is possible to connect resources or peer other VNets which can communicate with the on-premise network.

```
az network vnet create -g $RG \
    -n $VNET_NAME --address-prefix 10.1.0.0/24 \
    --subnet-name $SUBNET_NAME \
    --subnet-prefixes 10.1.0.0/24
```

Take note of the range used here, as this is what will need to be included in the routing table from the on-premise side of the tunnel.

### Public IP Address

The public IP address is required for the on-premise site to connect to. This IP will be assigned to the Virtual Network Gateway

```
az network public-ip create -g $RG -n $IP_NAME
```

### Virtual Network Gateway

The Virtual Network Gateway has the previously created public IP address assigned to it.

Different gateway SKUs will offer different bandwidth

```
az network vnet-gateway create -g $RG \
    -n vpn-gateway \
    --public-ip-address $PUBLIC_IP \
    --vnet $VNET_NAME --gateway-type Vpn \
    --sku VpnGw1 \
    --vpn-type RouteBased
```

### Local Network Gateway

The Local Network Gateway defines the routes for the local network at the other end of the tunnel. It's under this resource that all the IP ranges of the on-premise site are defined. Additionally, we need to set the on-premise public IP for Azure to connect to.

In the example below, we are creating a local network gateway for our on-premise network which has a local range of 192.168.1.0/24 and 172.21.21.0/24

```
az network local-gateway create -g $RG \
    -n local-gateway \
    --gateway-ip-address $ON_PREM_PUBLIC_IP \
    --local-address-prefixes 192.168.1.0/24 172.21.21.0/24
```

### Connection

The connection resource ties together both the Virtual and Local Network Gateways and specifies the encruyption algorithms to be used.

```
# Create the gateway connection
az network vpn-connection create \
    -g $RG -n vpn-connection \
    --vnet-gateway1 $VPN_GATEWAY \
    --local-gateway2 local-gateway \
    --shared-key $RANDOM_GENERATED_SHARED_KEY

# Add an IPSec policy defining the encryption algorithnm
az network vpn-gateway connection ipsec-policy add \
    --connection-name vpn-connection \
    --dh-group DHGroup14 \
    --ike-encryption AES256 \
    --ike-integrity SHA256 \
    --ipsec-encryption GCMAES256 \
    --ipsec-integrity GCMAES256 \
    --pfs-group ECP256 \
    --resource-group $RG
```

## On-Premise

From the on-premise firewall, configure an IPSec tunnel with the same encryption rules as specified above and set the same shared key that was specified on the connection resource.

This document doesn't specify how to implement any routing protocols to dynamically learn accessible routes in the cloud, so you will need to statically define a route to the cloud based on the virtual network range created earlier with the next hop set to the IPSec tunnel.