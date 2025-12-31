## What is Firwalld

Firewalld is the default firewall management tool for RHEL and Fedora Linux distributions. It simplifies the IPTables tool by separating the firewall into "zones" and then assigning interfaces to specific zones. The rules themselves are then assigned to zones to specify which traffic can pass to which zone, and how to treat packets coming in and out of that zone.

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