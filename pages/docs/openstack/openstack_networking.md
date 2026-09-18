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

Traditional network switches consist of a control plane to define the forwarding rules and a data plane for handling the packet forwarding. More modern networks rely on SDN networking where a centralised control plane determines traffic routing and the rules are forwarded to all devices on the network. This removes the need for manual switch configuration and allows a network to be more dynamic.

OVS and OVN are SDN technologies that implement the data and control plane respectively within Openstack Neutron.

### Open VSwitch (OVS)

Open VSwitch acts like a traffic manager. Neutron feeds OVS with traffic routing rules which define which packets should be sent where. It is built for more scalable environments, supports tunnel encapsulation (e.g. VXLAN) and integrate with many virtualisation technologies.

When deploying Openstack with Kolla, each host will get an `openvswitch-vswitchd` container deployed. This is responsible for running OpenVSwitch and handling bridge networking across the virtual machines deployed on the host.

The main drawback of OVS is that each time a VM moves or changes are made to the system, Neutron needs to notify all the OVS agents in the system with the updated routing rules. Additionally, it does not handle logical network abstrations like virtual routers so more complex flows need to be handled by Openstack Neutron.

Before OVN, there was no brain that compiled high-level network intent automatically. The Neutron server kept track of networks etc. in a database and a `neutron-ovs-agent` would poll Neutron for changes that are relevant to the node. Controllers or dedicated neutron router node would run `l3-agent`s and `dhcp-agent` which could be a bottleneck for northbound traffic. Each hypervisor agent was responsible for making it's own decisions from interpreting data from the Neutron database.

### Open Virtual Network (OVN)

OVN doesn't replace OVS, it supports it by providing logical networking like virtual switches and routers which get translated into OpenFlow rules. 

When a network is created in Openstack, Neutron calls the OVN driver which writes to it's database and then programs all the OVS instances on the hypervisors with the required flows.

The OVN controller has a Northbound and Southbound database. The Neutron OVN driver writes to the Northbound database where OVN then processes and translates the user's networking intents to a logical network state stored in the Southbound database. OVN agents on the hypervisor nodes then read from the Southbound database and configure the OpenFlow rules on the local OVS agent. Now, whenever there is a change to the network, the network rules only need to be updated in one place, making the setup much more scalable.

### OpenFlow

OpenFlow is the SDN implementation used by OVS and OVN to implement the control plane and the data plane. The `ovs-vswitchd` is a daemon which runs on hypervisors that can understand OpenFlow flows. This daemon is responsible for storing flow tables and forwarding packets for a host.

```bash
# if traffic comes in on port1, send it out on port 2
ovs-ofctl add-flow br0 "in_port=1,actions=output:2"
```

OpenFlow separates the control plane from the data plane, allowing an external controller (in this case OVN), push flow rules into a switch, providining instructions on how to handle packets.

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
