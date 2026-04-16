## OpenStack Hardware

Openstack is built up of multiple hareware components. The core components are the controller and compute nodes. Optional additional hardware include a block and object storage node.

### Seed Host

The Seed host manages all the provisioning of the controller, compute, networking and storage hosts.

The seed host runs a bifros container which is used to provision the cloud hosts (controllers + compute etc.).

### Controller

The controller is responsible for running identity services, image services, placement services and management portions of compute and networking agents.

It can optionally run portions of the block storage, objects storage and orchestration.

### Networking

Network hosts run the neutron networking services and load balancers for API services.

### Compute

Compute hosts can be either hypervisors or baremetal hosts. Baremetal hosts will be managed by the Ironic service. Alternatively, hypervisor hosts will run additional compute, networking and storage services for managing Virtual Machines.

### Block storage

This node contains the disks

Traffic between this node and compute nodes uses the management network. It is recommended for production setups to have a dedicated storage network to increase performance and security.

## OpenStack services

### Nova

Nova is the service which manages machine instances in openstack, as well as their state and flavor. Under the hood there are for main components:

Component | Description
---|---
nova-api | Creates and updates instance records
nova-conductor | Central database broker for compute nodes
nova-scheduler | Sheduling decisions for instances
nova-compute | Updates the instacne stat on the host

**nova-api**

The `nova-api` service will handle requests for instance management and validate them based on users authorisation, quota, image/falvor availability. Once validated it will update the database with the new state of the instance.

**nova-conductor**

The `nova-conductor` receives the request from the API which will place a message on the RabbitMQ queue.

**nova-scheduler**

`nova-scheduler` identifies the appropriate hardware resource availability for the instance based on flavors, traits, aggregates, availability zones etc. Once identified, it claims the resource in Placement and then sends an RPC message to the chose `nova-compute` host via RabbitMQ.

**nova-compute**

The `nova-compute` service runs on each physical host for Nova hypervisor instances, or runs on a controller host for baremetal instances. For a hypervisor instance, the nova-compute service will talk to the relevant hypervisor driver on that host, whereas baremetal instances will rely on the nova-compute service on the controller talking to the ironic-driver to talk to the physical server over IPMI/Redfish.

For virtual machine images, the new instance requests will be passed to the relevent hypervisor driver (e.g. libvirt) to create the instance on the host.

For more resiliance in baremetal deployments, multiple nova-compute processes can be run which independently manage a subset of the Ironic nodes.

### Ironic

Ironic is the service which manages the baremetal hosts within Openstack. New baremetal hosts are registered with the Ironic service.

Ironic keeps track of the state of the host. See this diagram for more details: https://docs.openstack.org/ironic/latest/_images/states.svg. Detail of the states is also provided in [Openstack Ironic States](./openstack_baremetal_enroll.md)

You can manage baremetal nodes in Ironic with the `openstack baremetal node` CLI, which allows for a host to be transitioned through different states and be put into maintenance mode.

Once a host is managed by Ironic, it will be viewable by the openstack admin using the command below:

```
openstack baremetal node list
```

### Neutron

Neutron is the networking service which handles the configuration of network interfaces on the hosts and supporting tools like VXLAN.

The Neutron server routes API requests to the appropriate network plugins based on the request.

More detail can be found in [Openstack Networking](./openstack_networking.md).

### Storage

| Service | Description                                                                                                                   |
| ------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Cinder  | Block storage service responsible for integrating with block storage devices to provision volumes and mount volumes to hosts. |
| Swift   | Object storage for storing VM images and data.                                                                                |
| Manila  | Provides file shares to virtual machines                                                                                      |

### Glance

Manages images in Openstack which are used for VM provisioning.

### Octavia

Manages Loadbalancer resources.
