## What is VXLAN?

VXLAN uses UDP port 4789

In a physical network (underlay network) setup, the network may be segmented by multiple subnets which require layer 3 routing to route between hosts. This is not ideal in cloud solutions when virtual machines are deployed in the same virtual network but deployed to hosts in separate underlay networks. Additionally, scaling an L2 network can be limited by spanning tree protocol and the blast radius of the broadcast domain.

VXLAN is an overlay network designed so that virtual machines on hosts in two different subnets can talk to each other from what appears to be layer 2. This is achieved with virtual switches running on the hypervisor which encapsulates the layer 2 packets with information that allows it to traverse the layer 3 network between hypervisor hosts.

## Overlay Networking

The only requirement for overlay networking, is that the 2 physical hosts can reach each other on the physical network.

Virtual switches need to build tables to associate the virtual machines mac address to a physical network address for the physical server. To start building these tables, ARP messages can be encapsulated into multicast packets to other VSwitch subscribers.

New Headers:

- Layer 3 outer header (dest/from IPs)
- UDP destination port
- UDP SRC (Dynaically calaculated)
- VNI (VXLAN Header - keeps separation of virtual networks)

VNIs have 24 bits reserved in the packet header which allows for more than 16M VXLAN identifiers.

the Vswitch will strip of the encapsulation on the original packet and forward it to the appropriate VM, meaning the VM will treat it as a standard layer 2 packet.


## Virtual Tunnel Endpoints (VTEPs)

VTEPs originate and terminate a VXLAN tunnel. They are typically formed on access switches or hypervistors closest to the source/destination device.

VXLAN is a point-multipoint tunnel allowing broadcast packets to be sent from a single VTEP to multiple VTEPs on the network.

## EVPN

VXLAN relies on EVPN as a control plan for exchaging MAC information through a BGP address instead of relying on broadcast packets flooding the network.

EVPN uses Multiprotocol BGP for MAC and IP address endpoint distribution to minimize flooding.

EVPN allows VXLAN tunnels to be controller-less since it has peer discovery.

Makes use of GBPs RDs and TRs to separate tenants within a data center.

### Multihoming

Standards-based replcaement for proprietary MLAG protocol

Removes the need for peer links between ToR switches

Makes use of EVPN type 1,2 and 4 routes to discover ethernet segments and forward traffic to them. An ES is a group of switch links that attach to the same server.