## Legacy BIOS Boot

A server can have multiple hard drives, each of which could store the all important operating system needed make the server functional. Servers will read the Master Boot Record, which is a small chunk of instructions at the start of memory that has a job of pointing to where the operating system lives.

BIOS boot is legacy, and can only understand disks up to 2TB. This reliance on the MBR makes it fragile due to it's dependency on a single small chunk of memory.

## UEFI Boot

UEFI relies on the EFI System Partition (ESP). This works similar to an organised table of contents, where multiple boot entries can be seen for the different available operating systems. In addition to a more stable boot process, UEFI supports Secure Boot which can check how trustworthy the image is before booting.


## What happens when you boot BIOS images on UEFI boot servers?

The firmware of the server can enumerate the boot entry, but fails to hand off control. The image will not have an EFI section so the UEFI boot mode will have no clue on how to read it, meaning the server will get stuck at the initial boot stage.
