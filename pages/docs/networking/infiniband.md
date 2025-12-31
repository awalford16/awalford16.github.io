## Subnet Manager (OpenSM)

A subnet manager is required on any Infiniband fabric to be able to operate host machines. The subnet manager is responsible for discovering, configuring and maintaining the infiniband fabric. Without it, no data in the network can flow.

During discovery the SM will send out Subnet Management Packets which will be responed to by the hosts, containing NodeInfo, PortInfo and GUIDs for SM to build a topology.

SM then assigns each port a Local Identifiers (LIDs). This is only for nodes, the switches will only get a LID for their management port.

Following the discovery, it will then run a routing algorithm to populate the forwarding tables on each of the switches. The tables are forwarded to the switches using SMPs.

### High Availability

It is possible to run multiple SMs in a master-slave setup. When two are visible on the same network, they negotiate with Subnet Management Packets to identify which becomes the master and which becomes standby. The standby will then promote itself automatically if it detects that the master is down.

The traffic between these hosts has its own dedicated virtual lane (15) which is separate from the rest of user traffic.

### OpenSM

OpenSM is the tool for running the subnet manager. It can be configured under `/etc/opensm/opensm.conf` to determine the routing algorithm, LMC, logging and where the partitions file lives.

### Routing Algorithms

| Algorithm  | Use Case                | Notes                                  |
| ---------- | ----------------------- | -------------------------------------- |
| **minhop** | Small/simple topologies | Fastest, deterministic                 |
| **updn**   | Irregular topologies    | Adds directionality to avoid deadlocks |
| **ftree**  | Large clusters (HPC)    | Builds deterministic fat-tree routes   |
| **lash**   | Adaptive routing        | Tries to balance load                  |
| **dfsssp** | Debug                   | Deterministic single shortest path     |

## PKeys

Partition Keys in an infiniband network are similar to how VLANs work in an ethernet network. It allows the network to be split into partitions so only specific hosts can receive traffic intended for them.

The 16-bit partition key is added to the infiniband header (Base Transport Header). An end node is considered to be part of the partition if the PKey exists in their PKey table.

The default partition `0x7fff` exists on all hosts.

**Full and Limited**

If the Most Significant Bit in the header is a 1, it is consdered to have full membership to the partition. Limited meembers will have an MSB of 0 and will not be able to accept traffic from other limited members. So limited members can only talk to full members, whereas full members can talk to any member in the partition.

### Adding PKeys

Update the `/etc/opensm/partitions.conf` file to add the partition key.

```
Default=0x7fff, full;
JobA=0x0001, full: node1,node2,node3;
JobB=0x0002, full: node4,node5,node6;
```

## Commands

```
# List switches in the fabric
ibswitches

# Check link status'
iplinkinfo

# Show active node connections
ibnodes

# Identify the assigned LIDs
ibhosts

# enable/disable ports
ipportstate -G $SWITCH_ID $PORT enable
ipportstate -G $SWITCH_ID $PORT disable

# View active/standby status of SMs
ibstat | grep SM
```
