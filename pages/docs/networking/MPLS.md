## Multi-Protocol Label Switching

MPLS helps speed up network connections by pre-determining the path which the packets are sent down, meaning less processing time for routers determing the next hop. It makes use of labels in packet headers to help guide the packet along the pre-determined path.

## MPLS Routers

**Provider Edge Ingress**

The ingress provider edge router is responsible for adding the labels to the packet to define its route through the VPN, to the destination network.


**Provider Edge Egress**

The egress provider edge router sits at the entrance of the destination network. This router will strip the packet of the label headers to restore the original packet which can be forwarded to its destination living on that local network.


**Provider Routers**

Provider routers are any router which is part of the designated MPLS route. These routers do not need to be aware of the MPLS VPN itself, since all that configuration is handled by the provider edge routers, they just need to be able to handle the label which specifies the provider edge agress router. Other than that, they can operate as standard routers without needing to add/strip labels.


## Protocols

**Multiprotocol BGP (MBGP)**

This protocol is responsible for distributed the labels for the different VPNs used on the network. This allows PE routers to distinguish regular traffic from MPLS VPN traffic.
