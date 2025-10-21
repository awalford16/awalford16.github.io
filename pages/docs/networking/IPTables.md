## What is iptables?

IP tables is an interface for managing netfilter, a firewall tool for linux machines

It can be used to filter incoming and outgoing packets but also routing puposes.

Many Linux distributions are packaged with a default firewall service. For instance, Rocky is packaged with `firewalld`. It is recommended to remove these installations and start again from scratch when working with `iptables`.

```
# remove from ubuntu
apt purge ufw

# remove from rocket
dnf remove firewalld
```

## How does it work?

A table in iptables is a collection of chains.

Chains are tags which match packets in their particular state. If a packet matches a particular chain condition, the rules within that chain will determine what happens to the packet.

Rules at the top of the chain will take preference.

### Filter Table

Filtering incoming and outgoing traffic.

**Chains**

| Chain         | Description                                                                  |
| ------------- | ---------------------------------------------------------------------------- |
| Input Chain   | Packets being received by the host                                           |
| Output Chain  | Packets being sent by the host                                               |
| Forward Chain | For packets where the host is only responsible for forwarding the packet on. |

### NAT Table

Redirect connections to other interfaces on the network.

**Chains**

| Chain             | Description                                         |
| ----------------- | --------------------------------------------------- |
| Output Chain      | Packets being sent by the host                      |
| Prerouting Chain  | Before the route of the packet is determined        |
| Postrouting Chain | Just before the packet leaves the network interface |

### Mangle Table

Modifies aspects of a packet or connection.

**Chains**

| Chain             | Description                                                                  |
| ----------------- | ---------------------------------------------------------------------------- |
| Input Chain       | Packets being received by the host                                           |
| Output Chain      | Packets being sent by the host                                               |
| Forward Chain     | For packets where the host is only responsible for forwarding the packet on. |
| Prerouting Chain  | Before the route of the packet is determined                                 |
| Postrouting Chain | Just before the packet leaves the network interface                          |

## Targets

Targets in iptables determines what will happen to a packet if it matches a particular rule.

Targets include:

- Accept
- Reject
- Drop

`Reject` and `Drop` will both prevent the host from receiving the packet, however the `Reject` rule will notify the sender, whereas `Drop` will behave as if the packet was never sent.

By default, iptables will accept everything.

## Commands

```
# List default tables (Defaults to filter table)
iptables -L

# show rules with order
iptables -L --line-numbers

# Set default policy for chain
iptables --policy INPUT ACCEPT

# Use -A to append to list, -I to insert at top
# Drop all incoming packets from 1.1.1.1
iptables -I INPUT -s 1.1.1.1 -j DROP

# Block specific protocols/ports
iptables -I INPUT -p tcp --dport 80 -j DROP

# Delete rule (Specify rule number)
iptables -D INPUT 1

# Clear all created rules
iptables -f

# Save rules to persist
/sbin/iptables-save
```
