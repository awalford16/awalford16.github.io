## Neutron Processes

Process | Description
---|---
neutron-l3-agent | Manages router interfaces, iptables, floating IPs
neutron_dhcp_agent | Runs dnsmasq for DHCP
neutron_openvswitch_agent | Dataplane and port flow management

### Neutron Routers

Neutron routers are a logical implementation of a router which has internal interfaces which can bridge a connection to an external network. Each router is a linux network namespace which runs on the controller nodes (or dedicated networking nodes).

For docker deployments, the networking namespaces are created on the host network

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

**OpenFlow**

Where the OVS approach typically created networking namespaces on the neutron host to manage routers and DHCP for networks which manage stateful networking config. The OVN approaach no longer needs to run these processes since it relies on openflow flows being pushed to OVS switches from the controller, there is not state to manage. OpenFlow separates the control plane from the data plane, allowing an external controller (in this case OVN), push flow rules into a switch, providining instructions on how to handle packets.

OVN defines a pipeline with one rule table for ingress and one for egress. For processes like DHCP, OVN implements a lightweight DHCP responder within the pipeline which allows the OVS switch to reply without the traffic leaving the hypervisor. Logical constructs like NAT, routers and switches live in a database which get compiled into physical flow rules. An `ovn-controller` on each node reads the flow rules and applies them to OVS.

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
