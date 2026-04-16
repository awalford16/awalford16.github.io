## Ceph Maintenance

### Auto-Recovery

Ceph's natural behaviour is to attempt to ensure redundancy of data across available nodes in the even of OSD or node loss.

### Maintenance Options

Ceph can be put into a maintenance mode to not follow this behaviour if a node in the cluster needs some maintenance.

Flag | Description
---|---
`noout` | Prevents OSDs being marked as out of the cluster when they go down, which stops automatic rebalancing
`nobackfill` | Pause backfill operations
`norecover` | Pause all data recovery operations


Apply these flags with the `ceph osd set` command

```bash
ceph osd set noout
ceph osd set nobackfill
ceph osd set norecover
```

### Redundancy

It is important to take into consideration the redundancy of the cluster. Multiple nodes in a cluster may not be taken into maintenance at one time if the resiliency is only configured on a node level. 

OSDs going into readonly?

Unset maintenance flags