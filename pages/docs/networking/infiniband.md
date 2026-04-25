## Introduction

Infiniband technology is a networking standard which is openly published along with the Open Fabrics Enterprise Distribution (OFED) software used for interacting with infiniband networks.

The standard can be applied with multiple data transmission types such as PCB, copper or fibre.

Infiniband benefits AI workloads by allowing significantly faster communication and data transfer between hosts. It achieves this with a protocol known as RDMA which can transfer data packets without involving the CPU. This becomes critical when dealing with multi-node workloads needing to share data and resources across the network.

Infiniband requires specialist hardware such as Nvidia NVLink and Mellanox ConnectX NICs to leverage RDMA.

While Infiniband has been popularised by Nvidia and Mellanox, there are alternatives such as RDMA over Converged Ethernet (RoCE) which also provides the benefits of RDMA without needing NVidia harware, but still requires specialty NICs and specific switch flow-control configurations.

The technology offers 4x and 12x links which refers to the number of links operating in parallel on the cable, and offers raw data speeds of up to 400Gbps depending on the encoding type used.


## GUIDs, LIDs & GIDs

Inifniband uses GUIDs to uniquely identify hosts on the network. They are assigned by the manufacturer and each device on the network will have a NodeGUID and a PortGUID. On a switch, the PortGUID is the same for all the switch ports. GUIDs are not used for addressing or data transmission, purely just for identifying devices on the fabric.

Instead LIDs and GIDs are used for addressing where LIDs are for transfers within the same subnet, and GIDs are used for cross-subnet data transfers. For switches, the LID is assigned to the switch as a whole and not each individual port.

LID Address | Purpose
---|---
0 | Reserved
1 - 0xBFF | Unicast
0xC000 - 0xFFFE | Multicast
0xFFFF | Permissive LID (Processed by first received port)

When a network fabric is first setup, no LIDs will be assigned to devices. This is where directed route addressing is used to communicate with devices on the fabric using subnet management packets (SMP). The packet lists switchports that the data must pass through and maintains a hop count for identifying the number of elements in the port list. The packet uses a hop pointer to indicate the port which should receive the packet.


## Subnet Manager (OpenSM)

Inifiniband switches do not form their own forwarding tables, they must be explictly configured externally. This is the responsibility of the subnet manager.

A subnet manager is required on any Infiniband fabric to be able to operate host machines. The subnet manager is responsible for discovering, configuring and maintaining the infiniband fabric. Without it, no data in the network can flow. It can be deployed on a server with an infiniband adapter or on an a supporting infiniband switch.

During discovery the SM will send out Subnet Management Packets which will be responed to by the hosts, containing NodeInfo, PortInfo and GUIDs for SM to build a topology.

SM then assigns each port their Local Identifiers (LIDs). This is only for nodes, the switches will only get a LID for their management port. Upon doing this it will send out it's own LID to inform hosts of where the subnet manager can be reached.

Following the discovery, it will then run a routing algorithm to populate the forwarding tables on each of the switches. The tables are forwarded to the switches using SMPs.

Once the subnet is running, any changes to the topology will be detected by the subnet manager and appropriately updated.

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

## Infiniband Communication

Unlike ethernet networks, infiniband does not send bytes or packets, it sends encoded symbols which can be represented as a light pulse pattern or a voltage level.

### Symbol Errors

These errors occur when a signal does not match a valid encoding pattern known by the receiver.

Errors can be viewed with `ibqueryerrors`

## IP over Infiniband

Quite often IPoIB is used to discover LIDs of hosts on the network and then continue to use the infiniband protocol with no TCP/IP stack involvement. Link layer addresses in IPoIB are 20 bytes long as opposed to the 6 byte mac addresses on an ethernet network. The link layer address contains the GID, Queue Pair Number and informations about IB protocols to use for the TCP layer.

## Queue Pairs

Most communication over RDMA make use of Queue Pairs (QPs) which have 2 modes: connected or datagram.

**Connected Mode**

QP can be used for one dedicated connection between 2 nodes

**Datagram Mode**

Data can be sent from many destinations to many sources.

**Reliable Connection**

Requires confirmation from all data sent

**Unreliable Connection**

No verification on whether data was received or dropped.

## Commands

```bash
# List switches in the fabric
ibswitches

# Check link status'
iplinkinfo

# Show active node connections
ibnodes

# Identify the assigned LIDs
ibhosts

# Check connectivity (requries server process on other side, like iperf: ibping -S)
ibping $LID

# Find all subnet components and the links between them
ibnetdiscover

# Same as above, but attempt to find configuration errors
ibdiagnet

# enable/disable ports
ipportstate -G $SWITCH_ID $PORT enable
ipportstate -G $SWITCH_ID $PORT disable

# Show the state of IB adadpters on host
# Shows 2 LIDs (Base: First assigned to port, SM: Subnet manager LID)
ibstat

# View active/standby status of SMs
ibstat | grep SM

# Show IB interfaces with corresponding network interfaces and status
ibdev2netdev

# Read performance counters from any point of the IB network
# Use ethtool for RoCE networks
perfquery -a $LID

# For Mellanox adapters - details about adapters and connections
mlxlink -d $ADAPTER -c

# Query information about a node from the subnet manager - alternatively use smpdump to get information from host
saquery $LID
```
