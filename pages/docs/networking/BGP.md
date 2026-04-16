## Border Gateway Protocol

BGP is a way of sharing routing information between routers to determine the best path to a destination network, known as the ASPath.

## Autononous Systems (AS)

Autonomous Systems identify the group of IP prefixes and which routers/operators have control over them. Networked routers within an autonomous system share and trust routes between one another to dynamically build their routing tables.

The AS is identified by a number between 0-65535. 64512-65534 are reserved for private and reserved systems.

### iBGP

Interior BGP is used for routing within an AS.


### eBGP

Exterior BGP is used for routing externally between other Autonomous Systems.

In a BGP route table resonsible for routing between ASs may look like this:

Destination | ASPath
---|---
192.168.1.0/24 | 100 200 i

This table shows that to get to the CIDR range of `192.168.1.0/24` go to AS 100 and then go to AS 200; this is where that network lives.

## Influence Routing

In a well-meshed network where many autonomous systems are connected with one another, there can be multiple routes to the same destination. However, some of these routes may not be the preferred ones when link speed or geographic location is considered.

### ASPath Prepending

Prepending artificially lengthens the least preferred path by adding duplicating the AS numbers in the route table. It may look something like this:

Destination | ASPath
---|---
192.168.1.0/24 | 200 i
192.168.1.0/24 | 100 100 i

Here, there are 2 alternative ways to get to `192.168.1.0/24` but AS 100 appears to be a longer route in the routing table.

### Selection Attributes

There are other ways to manipulate preferred paths selected by BGP:

- Local Preference: Used within an AS where the highest local preference is preferred (default is 100)
- AS Path length: As discussed previously, more AS paths in the route make it appear longer
- Multi-Exit Discriminator (MED): Path with the lowest MED
- eBGP over iBGP: Prefer routing between autonomous systems


## BGP Unnumbered

BGP peering can be configured between 2 switches and exchange IPv4 prefixes without having to configure IP addresses on each switch.

This is achieved by BGP automatically assigning and IPv6 link local address as the next hop for each of the learned prefixes.

This simplifies configuration IP address sharing across a data center reliant on layer 3 connections.

```
nv set router bgp autonomous-system 65101
nv set router bgp router-id 10.10.10.1

# Here we are specifying a neighbour interface as opposed to an IP address
nv set vrf default router bgp neighbor swp51 remote-as external
nv set vrf default router bgp address-family ipv4-unicast network 10.10.10.1/32
nv set vrf default router bgp address-family ipv4-unicast network 10.1.10.0/24
```
