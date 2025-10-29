## What are host aggregates?

Openstack hosts can be assigned to aggregates which identify hosts using a key-value pair. It is a mechanism for partitioning hosts and restricting which tenants have access to them.

Hosts can be assigned to multiple aggregates which different ways of restricting access based on the properties assigned to the aggregate. [Compute Filters](https://docs.openstack.org/nova/queens/admin/configuration/schedulers.html) defines the different types of filters that can be placed to restrict access to specific hosts.

## Multi-Tenancy Isolation

Aggregates can be assigned a `filter_tenant_id` metadata key which restricts which openstack projects have access to the hosts in that aggregate. This requires `AggregateMultiTenancyIsolation` to be listed as an enabled filter in `nova.conf`.

```
# Filter aggregate to only permit certain projects access to hosts
openstack aggregate set compute-agg --property filter_tenant_id=$PROJECT_ID1,$PROJECT_ID2
```

If a project does not exist in the filter_tenant on the aggregate, it can only use hosts that are assigned to other aggregates without this filter.

Since hosts can belong in multiple aggregates, Nova uses a logical OR to determine if the host is schedulable. So if a host belongs to another aggregate which permits a project or is simply open to all projects, then the host can still be used despite another aggregate not permitting it.

## Commands

```
# Create an aggregate
openstack aggregate create --zone nova agg1

# Set a property on the aggregate
openstack aggregate set agg1 --property gpu=2

# Add a host to the aggregate
openstack aggregate add host agg1 $HOST_ID
```
