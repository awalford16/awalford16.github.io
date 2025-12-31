## What is Firwalld

## Zones

Interfaces on a host can be assigned different zones which can help determine which side of the firewall they sit on. The default list of zones are:

- block
- dmz
- drop
- external
- home
- internal
- nm-shared
- public
- trusted
- work


## NAT

Firewalld can be used for both Source Network Address Translation (SNAT) and Destination Network Address Translation (DNAT).

### SNAT

SNAT is managed through `masquerade`, where `masquerade` is set to true on the external-facing interface, meaning all source addresses destined for the public-facing interface will have its source address translated to the public IP sat on that interface.

The NAT is applied as the packet leaves the external interface, equivalent to the POSTROUTING chain in IPTables.

## CLI Commands

```
# Show all zones
firewall-cmd --get-zones
```