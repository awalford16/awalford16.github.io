Servers are built with speicifc physical configurations that leave memory and PCIe devices tied to specific CPUs. UMA and NUMA are two approaches to how the operating system handles access to these devices.

## Uniform Memory Access (UMA)

In a uniform memory access (UMA) system, the server is booted with the view that everything can talk to everything else. Access to the resources takes the same amount of time regardless of the physical connections. This can result in bottlenecking if tasks are having to talk across CPUs for accessing devices.

## Non-Uniform Memory Access

In a non-uniform memory access (NUMA) setup, the server can be configured so CPUs can specifically handle tasks that only require access to memory or PCIe devices which they are physically attached to. This ensures a much faster access to resources and is known as NUMA affinity.

Processes can also be configured to run in the same NUMA node if they communicate frequently with each other.

**NUMA Balancing**

NUMA balancing is an automated process for ensuring that data is kept close to the processes that are consuming it. Altenatively, the process itself is moved closer to the data.

Linux achieves this by marking memory pages with the NUMA node which accessed it. If the page is consistently accessed by another NUMA node then it assumes that either the process or the data needs to be moved.

While this can help performance, there is a risk that the auto-balancing can cause disruption and jitter in the server, so it is not an ideal feature for performance-critical servers.
