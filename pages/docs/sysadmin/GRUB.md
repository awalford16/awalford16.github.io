## What is GRUB?

GRUB is activated after the initial BIOS boot. It is installed in a special place on disk and loads the kernel and root file system. Once complete, it will transfer control to the kernel.

## Configuration

Configuration files live under `/etc/default/grub` and `/etc/grub.d`

The generated GRUB config file is under `/boot/grub/grub.cfg`.

Typically Grub will get updated through packages, such as when installing a new kernel, the config will get updated to ensure that it gets booted with the new kernel.

## Kernel Boot

When the kernel is initially booted, GRUB is responsible for passing the parameters to the kernel. Some example parameters are `cachesize` or `clarcpuid` for disabling CPU features. Additionally `init` parameter can be sit to override what to be run instead of `sbin/init`.
