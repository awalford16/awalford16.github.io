#Understanding VXLAN

VXLAN uses UDP port 4789

In a physical network (underlay network) setup, the network may be segmented by multiple s"ubnets which require layer 3 routing to route between hosts. This is not ideal in cloud solutions when virtual machines are deployed in the same virtual network but deployed to hosts in separate underlay networks.

VXLAN is an overlay network designed so that virtual machines on hosts in two different subnets can talk to each other from what appears to be layer 2. This is achieved with virtual switches running on the hypervisor which encapsulates the layer 2 packets with information that allows it to traverse the layer 3 network between hypervisor hosts.

##Overlay Networking

The only requirement for overlay networking, is that the 2 physical hosts can reach each other on the physical network.

Virtual switches need to build tables to associate the virtual machines mac address to a physical network address for the physical server. To start building these tables, ARP messages can be encapsulated into multicast packets to other VSwitch subscribers.

New Headers:

- Layer 3 outer header (dest/from IPs)
- UDP destination port
- UDP SRC (Dynaically calaculated)
- VNI (VXLAN Header - keeps separation of virtual networks)

VNIs have 24 bits reserved in the packet header which allows for more than 16M VXLAN identifiers.

the Vswitch will strip of the encapsulation on the original packet and forward it to the appropriate VM, meaning the VM will treat it as a standard layer 2 packet.