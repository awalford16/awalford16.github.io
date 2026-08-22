## System Calls

The kernel provides an interface to applications via a set of functions. The functions are called system calls, which can be called from the user space.

Typically applications will call system calls through a library like the standard C library (clib).

Each system call has a unique number.

### Function Responses

System calls return a number to reflect the outcome of the function call. If the reponse is negative, then the library knows that there was an error when calling the function and sets a value to `errno`.

### strace

`strace` will show system calls that a process is making while it is running. You can also attached to an already running process with the `-p` option, and can even be used to see if a process is hung by checking to see if there are any system calls being made by the process.

```bash
# Get the number of syscalls
strace -c $CMD

# Trace a bash script
strace -o output_file.trace bash $SCRIPT
```

### printk + dmesg

`printk` is a function for printing messages. All messages are written to a RAM buffer and some messages could be stored by a logging daemon.

The `dmesg` command is used to see the current contents of the RAM buffer.

Kernel messages can be seen with `journalctl -k`.

### Virtual File Systems

`/proc` and `/sysfs` are virtual file systems which are generated on request from the user. Their contents are not stored on disk. Each file has an associated function in the kernel to produce the content on demand.

**/proc**

Mounted at boot time and contains lots of information about current processes. This can include memory usage, threads and the files that it has open.

**/sys**

Used for hardware information. 

`/sys/module` containers information on currently loadable modules.

`/sys/block` Shows inforamtion about block devices and similarly `/sys/class/net` shows network devices.

## Device Files

Device files are either `character` or a `block` device. 

Each file has a major and minor number as well as a type (`c` or `b`.) The kernel maintains a relationship between the three characteristics and what drvier to call. So essentially the major and minor numbers are used to identify the device driver.

Device files live under `/dev`

Depending on the driver associated with a device file, the kernel figures out which function to call depending on the user operation. A device driver will register it's set of functions with the kernel so it knows what to call when interacting with that device.


## Startup Services

### Initial Root FS

Typically GRUB will start by mounting a filesystem from RAM. The Initial RAM disk (initrd) can be used to provide drivers and support for mounting the real root file system.

### The First Process

The kernel looks for a process called `init`. Typically this is a link to the `systemd` program, which will then start up all other services. All services started by systemd can be seen under `/etc/systemd/system`.

Systemd is a user-space process. As the kernel boots, it's main job is to get to the point where it can run `init` or the `systemd` process and then the user space handles everything from there.


## Kernel Modules

A Loadable Kernel Module (LKM) is an object file with a `.ko` suffix. These contain code which can run in the kernel space. Modules are written for a particular kernel version, so there should be a copy of the module for each kernel installed on the system.

These modules allow the kernel to be relatively small and dynamically add functionality to it after boot.

LKMs live under `/lib/modules`, where each kernel version has it's own directory then the relevant modules live under there. There are also configuration files under these module files.

The `modprobe` command can be used to find LKMs.

### Writing Modules

To compile a Kernel module, it requires the Kernel Makefile. The Makefile will live alongside the code for the module. Additionally, the Kernel header files are required for the relevant running kernel. This can be achieved with pacakges like `linux-headers-$(uname -r)`.

Kernel modules need 2 special functions: init and cleanup.

```c
int init_NAME(void);
void cleanup_NAME(void);

int init_NAME(void)
{
  return 0;
}

void cleanup_NAME(void)
{

}

module_init(init_NAME)
module_exit(init_NAME)
```

The module can be compiled with: `make -C /lib/modules/$(uname -r)/build M=$PWD modules` which will compile the current module file into a `ko` file to live in the correct modules directory. The M parameter refers to the working directory of the module code, so it knows where to look for the Makefile.


## Useful Commands

Applications can call into the kernel. The standard C library is what knows how to invoke the kernel. The Kernel is then what controls devices.

```bash
# Show basic hardware information
lshw
lspci
lsusb
lsblk
lscpu

# Get information on disks
hdparm -I /dev/sda

# Handle PCI control
setpci

# Kernel module commands
lsmod # List loaded modules (shows in load order)
rmmod # Remove the module
modinfo # show module information (e.g. parameters, version)
depmod # Handles module dependencies
insmod # Inserts a module and run init functions
modprobe # Alternative to insmod which doesnt require the path
```


## Kernel Source

The official Linux Kernel source code can be found at `https://kernel.org`