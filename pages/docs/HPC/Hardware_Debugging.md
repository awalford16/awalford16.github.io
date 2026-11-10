## How to Identify Hardware Faults

### Getting PCI Information

The `lspci` command can print out hardware devices and provide detailed information on where they live in on the server.

An example NIC device may look like this:

```
0000:3b:00.0 Ethernet controller [0200]: Mellanox Technologies MT28908 Family [ConnectX-6] [15b3:XXXX]
```

The first chunk of information refers to the BDF address, made up of the PCI domain, bus, device and function. A function in this case could represent a different physical port on the NIC. The chunk of information at the end refers to the vendor and the device ID. The second value identifies the exact model.

`lspci -tv` prints out the PCI tree. This can help identify the parent port on the CPU that a PCIe device hangs off.

### Advanced Error Reporting (AER)

AER is how PCIe devices report link problems. These reports are tracked by the kernel and then reset on reboot. These error counts can be found in `/sys/bus/pci/devices/$DEVICE_ID/$FUNCTION`


### devlink

devlink is a tool that talks to the PCIe device drivers and exposes health reporters. A NIC firmware has a heartbeat and the driver polls it. `devlink dev show` can find these NIC devices and `devlink dev info $PCI_DEVICE` will show device information and FW versions.

`devlink health show` will report the health of the devices along with an error count.
