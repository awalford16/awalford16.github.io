
Ceph can provide storage as block, object or file FileSystem

## Block

A Ceph block device can be created with 2 commands:

```
ceph osd pool create POOL_NAME
rbd pool init POOL_NAME
```

Block devices can be integrated with various tools such as Openstack and Kubernetes to provide backend block storage to VMs or PV storage via the Ceph CSI respectively.

## File System

Ceph storage can also be overlayed with a filesystem using CephFS which can then be mounted.
