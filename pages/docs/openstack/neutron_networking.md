## Neutron Routers

Routers created in openstack are essentially and independent networking namespace with a set of routing tables and iptables rules.

## NAT

When floating IPs are assigned to VMs, the IPs come from a `nat` table within the router namespace.

This table will store SNAT and DNAT rules to map traffic to and from the floating IP respectively.

```
1.2.3.4 (FIP) -> DNAT -> 10.10.10.0
10.10.10.0 -> SNAT -> 1.2.3.4 (FIP)
```

The router will also store a rule to apply SNAT to all private IPs in the subnet to a public IP so instances can have outbound connectivity without individual FIPs assigned.
