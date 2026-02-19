## Benefits of Lustre

Lustre is a storage system primarily used by HPC due to its high-bandwidth storage access.

Lustre stripes data across multiple OSTs (Object Storage Targets). When accessing these OSTs, it can be done in parallel which helps reduce IO strain on a single machine.


### LNet Networking

LNet is Lustre's networking layer that handles the routing and transport of packets through the lustre infrastructure.

Everything is identified by a NID (W.X.Y.Z@tcp). Can be `tcp` or `o2ib` and each host can have multiple NIDs.

When mounting a Lustre file system, the client connects to the MDS NID. By default it will prefer the faster network automatically, so it is possible to configure a TCP and IB network on the same LNET as well as multiple TCP or multiple IB networks.

**Routing Config**

Some clients on a Lustre network may not have a NIC capable of talking to an IB network. LNet allows for routes to be defined to point TCP clients to the `o2ib` network.

By default LNet will rely on linux routing to talk to clients on the network, but in a more robust setup, LNet routers can be deployed to explicitly handle routes to LNet clients/servers. As soon as LNet routers are added to the system, linux-based routing is no longer supported and paths have to be defined explicitly and be reachable either on the same subnet as the host, or via an LNet router.

**ksocklnd + ko2iblnd**

`ksocklnd` is a Lustre Network Driber that handles lustre network traffic over TCP/IP using the standard Ethernet network.

`kl2iblnd` is the network driber module which allows Lustre to leverage RDMA. It supports both RoCE and Infiniband so data can be move directly between node memory without involving the CPU.

The configuration and tuning of this module can be found in `/etc/modprobe.d/ko2iblnd.conf`.

### Commands

```
# Create an lnet network on a host
lnetctl net add --net tcp|o2ib --if eth0

# Add a route
lnetctl route add --net tcp --gateway o2ib

# Test connectivity to NID
lnetctl ping W.X.Y.Z@tcp
```
