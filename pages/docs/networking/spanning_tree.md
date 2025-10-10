## Spanning Tree Protocol (STP)

STP is a protocol for preventing network loops. It does this by building a topology and blocks ports which are determined to be the slowest or lowest priority path.

Switches send out Bridge Protocol Data Units which will contain information about the switch, STP version, health-check intervals, type of BPDU etc.

### Types of BPDU

| BPDU Type       | Description                                            |
| --------------- | ------------------------------------------------------ |
| Configuration   | Determines the Root bridge and builds the STP topology |
| Topology Change | Notifies the Root bridge of a change in topology       |

This configuration BPDU information is used to identify the root bridge, which is based on the STP priority set on the switch, as well as the MAC address. This means that switches higher up the stack (core/spine switches), should be configured with a higher priority so none of their ports are blocked.

With a root bridge elected, the shortest path to the root is determined based on link speeds.

## Rapid Spanning Tree (RSTP)

RSTP strips out the Topology change BPDUs and replaces them with flags in the configuration BPDUs.

## Per-VLAN Spanning Tree (PVST)

PVST applies the same rules of STP but for each VLAN, so different VLANs can have different root bridges and preferred pathways. BPDUs are first encapsulated with 802.1Q VLAN tags so they are only received by ports listening on the same VLAN.

It is recommended to not run this version of STP if there are hundreds or thousands of VLANs on the network, as each VLAN will start a new ST process which can cause a lot of overhead on the network.

## Multiple Spanning Tree (MST)

Using a protocol like PVST can result in a lot of processing going on throughout the network when the network has a lot of VLANs. A protocol like RSTP can be better in that scenario, since there is only one tree to maintain. However, if there is still a requirement to have spanning-tree on a VLAN level, Multiple Spanning Tree (MST) can be used which allows defining spanning tree instances which are assigned for a group of VLANs. This way the network administrators have more control over the number of spanning tree processes happening on the switch.
