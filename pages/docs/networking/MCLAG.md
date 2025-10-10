## What is MCLAG?

Link aggregation provides load balancing across two physical links between 2 devices.

Multi-Chassis Link Aggregation Groups allow for a single leaf switch to be connected to two spine switches via a single LAG connection, treating it as a single spine switch to prevent L2 loops, providing redundancy.

This eliminates the need for Spanning Tree protocol to block ports and make use of all connections between switches.

## How to configure MCLAG

The commands below are for Dell SONiC switches.

### Create a LAG

Firstly, a LAG needs to be setup on each of the spine switches which will go down to the leaf switch.

```
interface PortChannel X
switchport trunk allowed vlan $VLAN_ID
```

### Create an MCLAG Domain

For each member of the MCLAG, they need to be registered to the MCLAG domain. A switch can only support one MCLAG domain.

```
mclag domain $ID
peer-link $INTERFACE
```

The peer link refers to the interface port which links the 2 spine switches together. This can also be configured to be a port channel for extra redundancy.

A keepalive link connects MCLAG peer switches to carry out periodic heatbeat messages. This should be configured on each of the peer switches (e.g. spine switches) used.

```
source-ip $PEER1_IP
peer-ip $PEER2-IP
```

Finally, the port channel interface needs to be added to the MCLAG

```
interface PortChannel X
mclag $ID
```

## Gateway Mac

MCLAG will use the active switche's system mac address for handling L3 traffic. To have both switches in the pair be able to response on the same mac address, a gateway mac can be configured.

```
# Run on both sides of the mclag
mclag gateway-mc $MAC_ADDRESS
```

Running `show ip arp` will show all IP addresses configured on these switches will resolve to the gateway mac address. If the IP addresses need to explicitly respond from one of the switches in the pair, the SVI can be configured as a `mclag-separate-ip`

```
interface vlan X
mclag-separate-ip
```

## MCLAG Commands

```
# See status of mclag
show mclag brief

# See which southbound interfaces are up/down
show mclag interface $INTERFACE
```
