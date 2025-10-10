## Enroll Process

- Attempts PXE boot responded to by DHCP server running on controller nodes
- PXE deploys the IPA ramdisk image
- This talks to the Ironic API to determine the next state the node needs to run

### Ironic Python Agent (IPA)

As the baremetal machine transitions through the different states, the host is booted with an Ironic python agent deployed as a ramdisk on the server. This agent helps control how images are deployed to the server.

The ironic controller will make API calls to the agent to help the machine through the provisioning lifecycle.

It is possible to debug issues with the enroll stages by configuring a user on the IPA ramdisk image which can be SSH'd into during the boot process.

## States

When a new baremetal node is ingested into Ironic, it goes through a couple of states before it can be available for scheduling.

### Enroll

This is the very first stage of a baremetal host. It cannot yet be used for contacting the BMC or provisioning. From this state, the node must be explicitly promoted to a "manageable" state in order to start running inspections etc.

### Manageable

A baremetal node can be taken from the enroll state, to the manage state using `openstack baremetal node manage`.

This state ensures that Ironic can talk to the node's BMC, and allows for administrative tasks such as cleaning, inspection and updating hardware properties.

### Inspecting

There are 2 types of inspetion done by Ironic:

**In-Band**

This is run on the new baremetal node itself. It PXE boots a RAMDisk image which collects information about the host such as CPU cores, RAM, Disk storage etc.

While this approach is slower than out-of-band, it is able to gather much more accurate information about the host, and support a wider range of hardware information.

**Out-of-Band**

This runs from the Ironic Conductor service and collects hardware information about the host remotely via the BMC using IPMI or Redfish.

### Cleaning

Ironic will put a node into a state of cleaning before provisioning or after deletion. This is to ensure that it is fully clean before anything is run on the host. This will include wiping the disk so there is no left over state.

### Available

Before a node can be deployed, the baremetal host must first be placed in an "Available" state. It is not possible to deploy a node from the "manageable" state.

Baremetal nodes can be made available with `openstack baremetal node provide`
