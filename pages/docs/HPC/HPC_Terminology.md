## Binding

Binding involves attaching particular processes or threads to specific cores, sockets or slots in the hardware. Also known as processor pinning.

The OS scheduler is able to move processes around to different CPU cores for better utilisation, but this is an undesired behaviour in HPC since it can cause slow down through cache validation or NUMA effects.

Binding can be done on multiple levels:

Type | Description
---|---
core | 1 rank per physical core
socket | Spread ranks across sockets for NUMA-aware jobs
slot | Pack 1 socket first for memory-bound jobs
hwthread | Bind to logical hyperthreaded cores

Core binding can have negative impacts if not used for the correct workload. It trades flexibility for predictable and repeatable performance.

Additionally, the same issue can apply to memory allocation for user processes. Memory binding can ensure that memory allocation is assigned on the correct NUMA node.

## Hyperthreading

In modern CPUs, hyperthreading allows for each compute core to be represented as 2 separate cores with separate code processing modules and registers.

Despite it's efficiency it is recommended for this to be disabled on HPC systems to reduce the complexity of parallel programs which may already be optimised for parallelism and not necessarily benefit hyperthreading.

## Direct Memory Access

DMA allows for node devices such as a GPU to directly communicate with memory without involving the CPU. Infiniband and RoCE technology enable this technology over the network.
