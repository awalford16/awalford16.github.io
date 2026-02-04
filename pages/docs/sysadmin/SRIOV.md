## What is SRIOV?

A hypervisor can have many VMs sharing a single network interface card. This physical function (PF) can be split into many mini Virtual Functions (VF). This splitting means that virtual machine network traffic does not need to pass through the hypervisor, but instead each virtual machine gets its own miniature NIC which talks directly to the hardware.

This functionality can provide near bare-metal speeds for VMs and containers and provide network traffic isolation.

SR-IOV must be enabled in the BIOS and kernel boot options before the OS starts.

The physical and virtual logic of SR-IOV can be applied to other physical devices such as GPUs or disk controllers which would typically need to be shared by virtual machines.
