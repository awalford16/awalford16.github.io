There is a special /proc mounted file system in linux which allows you to alter Linux operational behaviour on the fly. Processes like `ps` and `top` make use of the /proc directory since it contains information about the system's current active processes and their PIDs.

## Sysctl

Under `/proc/sys` lives files which configure the behaviour of the Linux operating system, and the values for these configuration variables can be configured with `sysctl`.

```bash
sysctl -w net.ipv4.ip_forward=1
```

## Device Files

`/proc/udev` contains a file for each device known to the Linux operating system which allows linux to interact with the hardware components available to it.

Linux tracks the device with a Major and Minor number.

Linux also has a `/sys` directory which keeps track of all possible supported devices. Process can subscribe to changes that occur in the `/sys` directory which reflects devices being connected or disconnected from the system.

The `udev` service subscribes to devices in `/sys` and creates and deletes device files under /proc/udev. It is possible to define custom rules for how udev behaves on particular device events.
