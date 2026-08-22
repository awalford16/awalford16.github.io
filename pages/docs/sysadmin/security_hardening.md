# Hardening Linux Servers

## Physical Security

Preventative measures for securing a machine where an attacker may have physical access.

### Single User Modes

It is possible to boot into a single user mode such as a rescue image which then allows a user privileged access to the machine. From here an attacker can mount the root file system with write permissions.

The attacker can configure the boot command in GRUB to boot into a bare shell where they wont be prompted for a root user password.

There are measures which can be taken to prevent an attacker being able to exploit the bootloader to gain privileged access to a machine.

**Bootloading**

GRUB can be secured to require a password when the system boots. This is done by adding a password hash (`grub-mkpasswx-pbkdf2`) to the GRUB configuration under `/etc/grub.d` in `40_custom`.

`password_pbkdf2 USERNAME PASSWORD_HASH`

This will prevent the system from booting until the credentials are provided. However, with physical access to the system, they could still potentially steal physical disks and load them in a separate machine.

**Disk Encryption**

Disk encryption protects the data at rest. Encryption can be applied at a disk, partition, volume or individual file level.

Disk encryption can protect physical disks, but this can require entering a password before the system is booted, which can become problematic for large-scale or remote systems.

LUKS is typically used on Linux to encrypt disks.

```bash
# Create a luks container for an encrypted partition
cryptsetup -v luksFormat /dev/sda1

# Create a block device container which can then have a file system created on top of it
cryptsetup -v luksOpen /dev/sda1 CONTAINER_NAME

# Close the encrypted device
cryptsetup -v luksClose CONTAINER_NAME
```

## SELinux

Security Enhanced Linux can run on any linux system. It can set contexts for file access.

SELinux can be enforced with `setenforce 1` or `0` to disable. It can be enabled permanently under `/etc/sysconfig/selinux`.


## Controller Sudo Access and Root Account

We can empower designated users to borrow superuser capabilities to perform specific tasks. This is controlled under `/etc/sudoers` and can be editted with `visudo`.

The spec is broken up into 4 parts: `WHO WHERE=(as WHOM) WHAT`, where ALL refers to anything. Use `%` to refer to user groups.

Specific cases can be defined for specific users:

### Disabling the Root Account

The root account can be disabled to prevent users logging in as the root user, but still allows privileged users to execute commands as `sudo`.

The account can be locked with `passwd -l root` or `usermod -L root`. Additionally, it can be done by setting the default sbin to `/sbin/nologin` with `usermod -s`. This prevents users from switching to the root user once logged in.

This does not protect the system when an attacker has physical access as they can bypass it by changing boot parameters.
