## CRUSH

CRUSH controls where and how the data is stored in a Ceph cluster. It also enables mass scalability to distributing the work across the clients in the cluster.

A Ceph client will be running LIBRADOS which will run the object through CRUSH. This produces the destination OSDs for the data to be stored.

CRUSH rules are assigned to a pool so objects stored as part of that pool are allocated specific OSDs to be stored on.

The CRUSH rules assigned to specific OSDs can be viewed with one of the following commands:

```
ceph osd crush rule ls
ceph osd pool ls detail
ceph osd pool get POOL_NAME crush_rule
```

## Placement Groups

Ceph can allocate OSDs to a "pool" which can be allocated for specific types of data. When pools are created, it also creates a set of PGs.

PGs are identified with the format of `POOL_ID.PG_ID` where the PG ID is a hexidecimal number. Each of these PGs map to a random set of OSDs which can be viewed by running the command `ceph pg map $PG_ID`.

Data is always stored as an object, so the file is split into objects to be stored into placement groups.

The overall object is assigned to a pool of disks, whereas the split up objects are assigned placement groups which are assigned to specific disks. The placement group ensures that the replicated data is not stored on the same disk.

Further crush rules can be configured to ensure replicas are stored on different hosts in the cluster, or different racks in the datacenter.

It is possible to see th replicas of a placement group with the below command:

```
ceph pg map $PG_ID
```

Placement groups should preferably be in an active and clean state. The state can checked with:

```
ceph pg stat
```

## Protection Mechanisms

### Replication

Replication will replicate an object X times. It will be sent to 3 different placement groups on 3 different OSDs.

When sending the data, the object will only be sent once (to th primary OSD). The primary OSD will then replicate the file accordingly to other OSDs.

The maximum usable storage of a Ceph cluster will depend on the replication configuration. If replication is set to 3 on a 100TB cluster, only 33.3TB will be usable.

### Erasure Encoding

A file is split into X chunks and is appended with Y encoding chunks. Both of these sets of chunks are written to OSDs. The Y value is recommended to be 2 or more to prevent data loss, this provides redundancy in the event of a OSD failure.

There is a lot more overhead for writing and reading this type of data, but much more space efficient.

Pools can be configured with ECP with the following command:

```
ceph osd pool create NAME erasure
```

The Erasure code profile can be seen with:

```
ceph osd erasure-code-profile get default
```

To understand the overhead associated with the k/m values of the profile, see the ceph docs: https://docs.ceph.com/en/reef/rados/operations/erasure-code/#erasure-coded-pool-overhead

## Applications

Applications refer to the client usage of a Ceph pool. You can enable specific applications on pools such as object storage or block storage.

```
# Enable block storage on ceph pool
ceph osd pool application enable $POOL_NAME rbd
```

## CephFS and MDS

MDS is the filesystem daemon required to be running for `cephfs` to work. It stands for Metadata Server.

CephFS setups require a metadata pool and a data pool when being configured

## RGW

RGW stands for Rados Gateway.
