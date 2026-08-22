## Placement Service

The Openstack placement service is specifically designed to handle allocation of nova instances to hosts within an openstack cloud.

### Resource Providers

Resource providers are entities which can supply consumable resources.

Concept | Description
---|---
Inventory | What a provider has (CPU (total/reserved), CUSTOM_BM_...=1)
Allocations | A consumption record tying a consumer to a specific amount of inventory
Traits | Qualitative boolean tags (e.g. CUSTOM_GPU_H200)
Aggregates | Scope things like affinity or shared storage


### VM Instance Flow

`nova-compute` on each hypervisor runs a resource tracker to report its capacity to the placement service.

On creation of a VM, Nova translates the flavor into consumable resources. `nova-scheduler` is then responsible for calling the placement API to get every host which has capacity for the requested resources. After some filtering, the scheduler picks a host and writes a claim in placement tying the instance to the RP's consumed resources.

### BM Instance Flow

`nova-compute` running for Ironic nodes creates a RP per Ironic node with a single consumable resource. Typically this is in the form of `CUSTOM_FLAVOR_NAME` e.g. `CUSTOM_BAREMETAL_H200`. Baremetal flavors are designed to specifically target those resources classes as opposed to CPU and Memory.


## Commands

```bash
# Get a list of available resources for Inventory from placement
openstack allocation candidate list --resource CUSTOM_BM_...=1
```
