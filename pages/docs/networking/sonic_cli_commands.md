```
# Show VLANs and respective interfaces
sudo show vlan brief

# Add interface member to vlan (-u for untagged)
sudo config vlan member add -u VLAN_ID INTERFACE

# Remove interface from VLAN
sudo config vlan member del VLAN_ID INTERFACE
```
