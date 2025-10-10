## Networking Options

Openstack provides 2 options for networking.

### Provider Networks

Openstack bridges virtual networks to physical networks and relies on physical network infrastructure for layer 3 routing. A DHCP service provides IP address information to instances.

This option lacks support for self-service networks as well as LBaaS and FWaaS

### Self-service Networks

Self-service networks use segmentation methods such as VXLAN and routes virtual networks to physical networks using NAT.

Using the benefits and dynamic approach of VXLAN, users can create their own virtual networks without needing to rely on changes to the underlying physical network.

## Network Architectures

### Open VSwitch (OVS)

Open VSwitch acts like a traffic manager. Neutron feeds OVS with traffic routing rules which define which packets should be sent where.

The main drawback of OVS is that each time a VM moves or changes are made to the system, Neutron needs to notify all the OVS agents in the system with the updated routing rules.

When deploying Openstack with Kolla, each host will get an `openvswitch-vswitchd` container deployed. This is responsible for running OpenVSwitch and handling bridge networking across the virtual machines deployed on the host.

### Open Virtual Network (OVN)

Instead of individual agents, there is a centralised controller with Northbound and Southbound databases. Every node will still be running Open VSwitch, but each OVS agent will download the data from the OVN controller. Now, whenever there is a change to the network, the network rules only need to be updated in one place, making the setup much more scalable.

## Network Automation during Enroll

As a baremetal host transitions through different states such as cleaning, inspection and provisioning, openstack can be configured to automatically configure the leaf switches to update switch ports to the appropriate VLAN required for PXE booting.

This is handled using Netmiko, a Python-based tool used for automating the configuration of switches. In particular, openstack [network-generic-switch](https://github.com/openstack/networking-generic-switch) which is a wrapping layer between Openstack and Netmiko.

## Network Types

When deploying with Kayobe, there are a few classes of networks which are defined by default:

Overcloud Out-of-band | Used by seed host to access the OOB mgmt controllers of the bare metal hosts
Overcloud Provisioning | Used by the seed host to provision cloud hosts
Workload Out-of-band | Used by overcloud hsots to access the PPB mgmt controllers of bare metal hosts
Workload Provisioning | Used by the cloud hosts to provision the baremetal compute hosts
Internal | For internal and admin API endpoints
Public | Public API endpoints
External | Provide external network access for hosts in the system
