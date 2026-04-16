## Binding

Binding involves attaching particular processes or threads to specific cores, sockets or slots in the hardware.

The OS scheduler is able to move processes around to different CPU cores for better utilisation, but this is an undesired behaviour in HPC since it can cause slow down through cache validation or NUMA effects.

Binding can be done on multiple levels:

Type | Description
---|---
core | 1 rank per physical core
socket | Spread ranks across sockets for NUMA-aware jobs
slot | Pack 1 socket first for memory-bound jobs
hwthread | Bind to logical hyperthreaded cores

Core binding can have negative impacts if not used for the correct workload. It trades flexibility for predictable and repeatable performance.
