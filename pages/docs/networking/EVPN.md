## Overview

Ethernet VPN connects L2 network segments separated by L3 networks.

It works by extending BGP to enable the network to carry endpoint reachability information such as MAC and IP addresses.

The setup splits the data and control plane of the network where BGP manages the control plane, and VXLAN manages the data plane. In a spine leaf architecture, the spines run eBGP with each leaf and act as reflectors which propogate the EVPN routes so VXLAN tunnels are terminated at each of the leaves.

VXLAN allows for the traversal of an overlay layer 2 network through the underlay layer 3 network. It achieves this by setting up tunnels between layer 3 gateways and encapsulating frames with VXLAN identifiers for the layer 2 traffic to be passed through the network. EVPN adds a layer on top of this by allowing for discvoery of the VTEPs through BGP.

With EVPN there is no manual configuration of a VTEP required as each VTEP is automatically learned from routes received from remote VTEPs. The remove host MAC addresses are learned in the control plane using BGP EVPN type 2 routes.


## L2 Deployments

This setup is useful for networks which require connectivity between leaf devices but do not need inter-vlan routing. The spine layer of the network is simply responsible for connecting leaf devices and the leaf devices are responsible for establishing the VTEPs.

## L3 Deployments

For data centers with a lot of east west traffic, it is recommended to configure a distributed frouting setup where the VXLAN routing is handled on the directly connected leaf switch.

In this setup, spine devices are configured to handle IP traffic only, then the intersubnet routing can be handled in two possible ways.

**Symmetric IRB**

Routes for the bridges are configured on both the ingress and egress leaves to allow bidrirection traffic.

Leaf switches only need to host the VLANs and corresponding VNIs that are located on its rack as well as the l3VNI. The ingress leaf switch doesnt need to know the destination VNI.

**Asymmetric IRB**

Routing and bridging are enabled on the VXLAN tunnel ingress, but only bridging is enabled on the egress. This results in bidirectional traffic travelling on different VNIs in each direction.


## Setup

### IP Underlay

Each switch needs a loopback interface for the VTEP IP. This is what will be used for the VXLAN tunnels to communicate.

```bash
nv set interface lo ip address 10.0.0.1/32

# Configure point to point interface IPs
# Configure /31 address on each side of the connection (spine/leaf)
nv set interface swp1 ip address 192.168.1.0/31   # 192.168.1.1/31 on the leaf
```

### eBGP Underlay

The goal of the IP underlay is ensure that each switch can ping another, with routing handled by eBGP.

```bash
nv set router bgp autonomous-system 65000
nv set router bgp router-id 10.0.0.1

# configure ebgp
nv set vrf default router bgp neighbor swp1 remote-as external

# Advertise the loopback
nv set vrf default router bgp address-family ipv4-unicast network 10.0.0.1/32

# redistribute conncted routes
nv set vrf default router bgp address-famils ipv4-unicast redistribute connected

# Verify established peerings
nv show vrf default router bgp neighbor
```

### EVPN Address Family

Enable EVPN on the spine as a route reflector and on the leaves as a client.

```bash
# Spine
nv set vrf default router bgp neighbor swp1 address-family l2vpn-evpn enable on

# Leaf
nv set vrf default router bgp neighbor swp1 address-family l2vpn-evpn enable on
nv set evpn enable on
```

Leaf switches are configured to watch for VXLAN interfaces and configure EVPN routes for each VNI that it sees.


### VXLAN Interfaces

From the leaf switches, we can now configure VXLAN interfaces and assign an access vlan on the host port.

```bash
# Map VNI 10010 to VLAN 10 directly on the bridge
nv set bridge domain br_default vlan 10 vni 10010

# Set the local VTEP IP (your loopback) — this is global, not per-VNI
nv set nve vxlan source address 10.0.0.1

# Enable VXLAN
nv set nve vxlan enable on

# Create the SVI for VLAN 10
nv set interface vlan10 ip address 10.10.10.1/24
nv set interface vlan10 vlan 10

# Server-facing access port
nv set interface swp5 bridge domain br_default access 10
```

The `vxlan source address` sets the VTEP IP for all local VNIs on the switch. The VNI assignment identifies the tunnel and allows the network to know where the packet has come from originally.

When packets come into the leaf switch from a host, if the destination MAC address is on a different switch, it will be passed to the VXLAN layer. The issue now is that the leaf needs to know which VTEP owns a particular MAC address, and this is where EVPN comes in.


### EVPN MAC Learning

Traditionally L2 switches will learn mac addresses either through ARP requests or as packets come in from a particular port. It then maps that MAC address to a port to know where to send future packets.

EVPN shares an address book across the network. As traffic comes in from a host on a leaf switch, the leaf switch advertises that MAC with its associating VTEP IP across the network via BGP. Then when other hosts need to communicate with it, it already exists in the address book.


### L3 VNI

The current setup allows for hosts in the same VLAN to communicate across the network, despite being behind different physical switches.

L3 VNI is a special tunnel just for routed traffic which needs to traverse different VLANs. This is achieved by having independent VRFs on each leaf where multiple VLANs can be plugged into. The VRF configuration across the leaf switches need to be consistent, whereas the spine switches simply see this as traditional IP/VLAN traffic and dont need to know about VRFs and VNIs.

```bash
# for TENANT-A, isolated from everything else on the switch
nv set vrf TENANT-A evpn enable on

# Assign L3 VNI 9999 to this VRF
# This number MUST be the same on every leaf — it's how they recognise which VNI it belongs to
nv set vrf TENANT-A evpn vni 9999

# Pull the SVIs into the VRF — now VLAN 10 and VLAN 20 routing
# happens inside TENANT-A's isolated table, not the global one
nv set interface vlan10 ip vrf TENANT-A
nv set interface vlan20 ip vrf TENANT-A

# BGP inside the VRF — this is a separate BGP process just for TENANT-A
# It advertises the SVI subnets as EVPN type-5 (IP prefix) routes to allow remote leaves to access VLANs across VTEPs
# router-id can be anything unique, but useful to stick with loopback for simplicity
# The AS number must be consistent with what was originally set on the leaf to allow spines to propogate the traffic
nv set vrf TENANT-A router bgp autonomous-system 65001
nv set vrf TENANT-A router bgp router-id 10.0.0.3
nv set vrf TENANT-A router bgp address-family ipv4-unicast redistribute connected enable on
nv set vrf TENANT-A router bgp address-family l2vpn-evpn enable on
```


### Virtual Router Redundancy - Anycast Gateway

In the previous set, the VLAN interfaces were moved to a new VRF which breaks the existing routing. The final step is to add VRR. VRR also solves the issue of hosts being moved from one leaf switch to another, as routing will break until ARP refreshes since the cached MAC address will be incorrect. VRR instead ensures that each leaf represents the same MAC and IP for the gateway so the gateway is consistent for all hosts across the network.

```bash
# Set a system-wide virtual MAC — this is the MAC that all VRR interfaces use - must be consistent across leaves
nv set system global anycast-mac 44:38:39:FF:00:01

# VRR on VLAN 10 — servers use 10.10.10.1 as their default gateway
# The vrr address is the gateway IP servers point at
# The vrr mac-address is what they'll see when they ARP for it
# This MAC must be IDENTICAL on every leaf for the same VLAN
nv set interface vlan10 ip vrr address 10.10.10.1/24
nv set interface vlan10 ip vrr mac-address 44:38:39:FF:00:10
nv set interface vlan10 ip vrr state up

# Same for VLAN 20
nv set interface vlan20 ip vrr address 10.20.20.1/24
nv set interface vlan20 ip vrr mac-address 44:38:39:FF:00:20
nv set interface vlan20 ip vrr state up
```

### ARP Surpression

ARP requests from servers can still flood the multiple VTEPs in the network. EVPN ARP surpression has the leaf switch intercept ARP requests and lookup the address into its EVPN address book.

```bash
nv set bridge domain br_default vlan 10 vni 10010 arp-suppression on
```

## Multihoming

EVPN multihoming can scale beyond 2 leaf switches per host. It also eliminates any need for MLAG in server-to-leaf connectivity

Multihoming also relies on a standardised protocol and removes the vendor-specific protocols applied by MLAG.

The switch selects a designated forwarder for each Ethernet segment. The DF forwards flooded traffic received through the VXLAN overlay to the locally attached Ethernet segment

The VTEP with teh highest DF perference setting becomes the DF.

```bash
nv set evpn multihoming enable on

# Set segment IDs
nv set interface bond1 bond member swp1
nv set interface bond1 evpn multihoming segment local-id 1

# Set ethernet segment system mac
nv set interface bond1-3 evpn multihoming segment mac-address 11:22:33:44:55:66:77
nv set interface bond1 evpn multihoming segment df-preference 50000

# Configure multihoming uplinks
nv set interface sqp51 evpn multihoming uplink on
```

## References

https://docs.nvidia.com/networking-ethernet-software/cumulus-linux-37/Network-Virtualization/Ethernet-Virtual-Private-Network-EVPN/
