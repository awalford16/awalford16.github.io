## Zero-Touch Provisioning

This walkthrogh goes through booting an SONiC switch through PXE, ONIE and ZTP.

### PXE

PXE booting involves leveraging a DHCP server to serve install images. When a server does a DHCP discover, the DHCP can configure additional options to tell the server where to find its boot image. To leverage these options, this will need to be set in the boot options from the servers BIOS settings.

The DHCP option `67` can specify the name of the boot file image, and point to a TFTP server which serves the image. Alternatively, ONIE booting will initially look for option 114 which will specify boot stripts over HTTP instead of TFTP. The option 114 can serve the actual image, or a script to install the operating system.

### Open Network Install Environment (ONIE)

ONIE is a tiny linux binary that lives on most network devices designed for installing network operating systems. It helps separate the boot loader from the installer, similar to the BIOS. Once a switch operating system is installed, it remains on the switch so new OS's can be swapped out easily in future.

By default, ONIE will do an auto-discovery which involves triggering a DHCP with PXE boot options. ONIE does not care about the configuration of the switch, just the OS installation. This is where ZTP comes in once the the OS is installed.

### ZTP

ZTP is the default behaviour when a new Sonic switch boots. When SONiC starts it initiates another DHCP request from ZTP looking for option 239 or 67.

This process runs on the management interface of the switch, so it will receive the IP address for the switch as well as a ztp.json file which specifies where to find the configuration file for that switch.

The example ZTP json file below tells the switch where it can find it's configuration file and further actions such as testing connectivity to it's default gateway. It sets `clear-config` to `false` to imply keeping the existing `config_db.json` settings that exist on the switch.

```json
{
  "ztp": {
    "01-configdb-json": {
      "dynamic-url": {
        "source": {
          "prefix": "http://ZTP_SERVER/",
          "identifier": "hostname",
          "suffix": "_config_db.json"
        }
      },
      "clear-config": false,
      "save-config": true,
      "reboot-on-success": true
    },
    "02-connectivity-check": {
      "ping-hosts": [ "DEFAULT_GATEWAY" ]
    }
  }
}
```

A host configuration file then needs to be specified for each host being deployed. The example below just configures some trivial settings such as the DNS server and NTP server:

```json
// host-IP_config_db.json
{
  "DEVICE_METADATA": {
      "localhost": {
          "hostname": "SWITCH_HOSTNAME",
          "nameserver": "DNS_SERVER"
      }
  },
  "NTP_SERVER": {
      "NTP_SERVER": {
          "maxpoll": "10",
          "minpoll": "6",
          "prefer": "false"
      }
  }
}
```

ZTP can be run independently of OS install with the manual commands `ztp enable` and `ztp run` from a SONiC switch.
