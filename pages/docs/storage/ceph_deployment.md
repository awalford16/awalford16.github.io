# Deploying a Ceph Cluster with cephadm

## Host Setup

For a Ceph cluster you require a minimum of 3 hosts. This setup was done using Rocky Linux 9 so commands used here will only work with a CentOS distro.

The primary host will need to have SSH access to all other hosts in the Ceph cluster.

All hosts need to have `podman` and `lvm2` installed:

```
dnf install -y podman lvm2
```

From the primary host, install cephadm

```
dnf search release-ceph
dnf install --assumeyes centos-release-ceph-squid
dnf install --assumeyes cephadm
```

## Bootstrap

From the primary monitor host, run the following commands to bootstrap the Ceph cluster. MONITOR_IP needs to be set to the IP address of the host.

```
cephadm bootstrap --mon-ip=MONITOR_IP
```

## Add Hosts to Cluster

Firstly, the public key generated for the Ceph cluster needs to be shared to the other cluster hosts:

```
ssh-copy-id -f -i /etc/ceph/ceph.pub root@$HOST_IP
```

From the primary host, run the following commands to add a new host to the Ceph cluster:

```
cephadm shell
ceph orch host add ceph-X $HOST_IP
```

You can verify that the host has been added with:

```
ceph status
```

Additionally, you can log onto the new host, and confirm that podman is running Ceph containers:

```
podman ps
```

This registers the hosts monitors and backup managers, but not OSD hosts. Without OSDs, Ceph will report no available storage.

## Object Storage Daemon

The Ceph OSD is deployed on Ceph cluster hosts to manage block storage devices.

The below command will show what devices are available from what hosts:

```
ceph orch device ls --refresh

##########################################################################################################################################################
HOST    PATH      TYPE  DEVICE ID                                                 SIZE  AVAILABLE  REFRESHED  REJECT REASONS
ceph-1  /dev/sdb  hdd   QEMU_QEMU_HARDDISK_6e7a5cd8-16de-43ef-a8c4-b737064e8f59  6144M  Yes        3m ago
ceph-1  /dev/sr0  ssd   QEMU_DVD-ROM_QM00003                                      474k  No         3m ago     Has a FileSystem, Insufficient space (<5GB)
ceph-2  /dev/sdb  hdd   QEMU_QEMU_HARDDISK_78d6c800-aad6-45a0-91ca-8ee23ac569ce  6144M  Yes        3m ago
ceph-2  /dev/sr0  hdd   QEMU_DVD-ROM_QM00003                                      474k  No         3m ago     Has a FileSystem, Insufficient space (<5GB)
ceph-3  /dev/sdb  hdd   QEMU_QEMU_HARDDISK_06803200-1fc8-4a10-8f33-e36b58145dee  6144M  Yes        111s ago
ceph-3  /dev/sr0  hdd   QEMU_DVD-ROM_QM00003                                      474k  No         111s ago   Has a FileSystem, Insufficient space (<5GB)
```

Providing a storage device is >5GB, has no partitions or LVM state, then it can be considered available.

We can then deploy OSDs onto these hosts to manage these devices with the command below:

```
ceph orch apply osd --all-available-devices

# Alternatively target specific device
ceph orch daemon add osd ceph-1:/dev/sdb
```

You can be even more granular with the OSD specifications using the Ceph orchestrator. Below is an example of a yaml file which specifies to use spinning disks for the OSD and the Bluestore database to be configured on SSD.

```yaml
service_type: osd
service_id: osd_all
placement:
  host_pattern: ceph-0
data_devices:
  rotational: 1
db_devices:
  rotational: 0
```

This will deploy a new orch service which

A new OSD daemon conatiner will be visible under the podman running containers. Once they have registered, the storage should be visible on the cluster:

```
[ceph: root@ceph-1 /]# ceph status
  cluster:
    id:     a1d4a086-502a-11f0-b3b0-fa163e27aeff
    health: HEALTH_OK

  services:
    mon: 3 daemons, quorum ceph-1,ceph-3,ceph-2 (age 87s)
    mgr: ceph-1.cksalp(active, since 10m), standbys: ceph-3.cjvulx
    osd: 3 osds: 3 up (since 16s), 3 in (since 52s)

  data:
    pools:   1 pools, 1 pgs
    objects: 2 objects, 577 KiB
    usage:   81 MiB used, 18 GiB / 18 GiB avail
    pgs:     1 active+clean
```
