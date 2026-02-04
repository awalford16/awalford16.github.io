## What is LVM?

LVM sits between physical disks on a host and a Linux filesystem.

Typical linux filesystems are restricted by the disk size they are initially assigned. This causes issues when disks start to fill up as data needs to be moved around.

LVM allows for grouping physical disksgs into a Volume Group (VG). This VG can be split into Logical Volumne (LV) partitions which are assigned space from the VG.

LVM allows you to dynamically grow these LV sizes as needed without having to move data around. Disks can easily be added to existing Volume Groups to expand storage capacity as well as swapped out when there are issues.

### Commands

```
# Add a new physical disk
pvcreate /dev/sdc

# Extend the volume group with the new disk
vgextend vg_data /dev/sdc

# Increase the size of the LV
lvextend -l +100%FREE /dev/vg_data/data

resize2fs /dev/vg_data/data
```