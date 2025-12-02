## What to Consider?

When building a multi-GPU node designed for high performance, there are many hardware factors that need to be taken into consideration. This write up will cover the following factors:

- GPU-to-GPU interconnects
- PCIe Balancing
- NUMA Awareness
- RDMA

### GPU-to-GPU Interconnects

GPU interconnects like Nvidia's NVLink can provide more than 10x improved speeds in comparison to communication over PCIe. This is critical when building servers designed for deep learning where there is a lot of parallelism and communication across GPUs.

**GPU Topologies**

GPUs can be connected with different topologies such as a ring or a full-mesh. It is important that these topologies are considered when designing HPC schedulers. They should be aware of which GPUs should be allocated. GPUs which cannot talk over NVLink will impact training performance.

Nvidia's `nvidia-smi topo -m` can be used to help get a better understanding of the GPU topology when configuring the scheduler.

**NVLink Switch**

Nvidia actually offer NVLink one step further and allow the GPU-to-GPU communication to operate across an entire rack using the NVLink switch.

### PCIe Balancing

**PCIe Lanes**

GPUs can rely heavily on PCIe lanes. If these lanes are over-subscribed then it can reduce the bandwidth and impact data transfer.

**NUMA Awareness**

Each GPU is attached to a specific CPU socket. For a NUMA-aware architecture, it is important that schedulers can identify the most appropriate GPU and CPU pairing for a process to avoid having to communicate across sockets. GPUs should be pinned to NUMA groups and schedulers should allocated CPUs in the same NUMA domain as the GPUs.

**PCIe Switches**

PCIe switches work like network swiches, but for PCIe devices. This allows multiple PCIe devices to share a single PCIe connection to the CPU. GPU connections can use up to 16 PCIe lanes per GPU, and factoring in all the other devices in a server, these PCIe lanes can quickly get used up.

This can become an issue when many GPUs share a single PCIe switch uplink, so the switch becomes oversubscribed. This can result in slower data loading

**RDMA**

Remote Direct Memory Access allows machines to directly read/write memory of another without involving the CPU or kernel and bypasses the TCP/IP stack. This has huge performance impacts on multi-node training as it scales more linearly as the number of nodes in a cluster increases.

Data path without RDMA:

```
GPU -> System memory (copty) -> Kernel -> NIC (Interrupt) -> Network Stack -> Remote NIC -> Kernel -> Memory -> GPU
```

Data path with RDMA

```
GPU Memory -> NIC DMA Engine -> Remote NIC -> GPU Memory
```

It requires specific NICs like Mellanox or Nvidia ConnectX, but the PCIe topology needs to be correct, otherwise performance could drop to pre-RDMA levels.

For fast RDMA performance, the NIC should be on the same PCIe root as the GPU to avoid involving the CPU.

Nvidia offer a library called NCCL which identifies the fastest path for GPU communication, preferring NVLink then PCIe peers, followed by RDMA. It can silently fallback to TCP/IP meaning performance can be unknowingly impacted.

## Commands

```
# Check GPU topology
nvidia-smi topo -m

# Check for RDMA
mlx5_core

# Verify ROCE
ethtool -S <iface> | grep roce
```