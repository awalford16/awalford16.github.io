## What is GRUB?

GRUB is activated after the initial BIOS boot. It is installed in a special place on disk and loads the kernel and root file system. Once complete, it will transfer control to the kernel.

## Configuration

Configuration files live under `/etc/default/grub` and `/etc/grub.d`

The generated GRUB config file is under `/boot/grub/grub.cfg`.

Typically Grub will get updated through packages, such as when installing a new kernel, the config will get updated to ensure that it gets booted with the new kernel.

## Kernel Boot

When the kernel is initially booted, GRUB is responsible for passing the parameters to the kernel. Some example parameters are `cachesize` or `clarcpuid` for disabling CPU features. Additionally `init` parameter can be sit to override what to be run instead of `sbin/init`.

## GRUB Intercept

The GRUB boot can be intercepted at different stages of it's boot cycle to support with debugging a node's startup process.

Break Point | Description
---|---
rd.break=pre-udev | Almost nothing accessible, no devices found yet
rd.break=pre-mout | Drivers are loaded but the disk is not open
rd.break | Has access to the OS files from the outside
init=/bin/bash | POST initramfs, but nothing is started
emergency.target | OS with RO disk and very few services
rescue.target | OS with basic services running
multi-user.target | Everything running except the desktop

For images which have no root user password, breaking in via GRUB will require entering through the initramfs. An administartor can then load the OS from the ramdisk with the following commands:

```
mount -o remount,rw /sysroot
chroot /sysroot
```
