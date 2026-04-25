## HPL

High Performance Linpack solves a random dense linear system in double precision which is used to measure performance of a cluster.

It outputs the result in number of FLOP/s and these results are used for the [Top 500](https://top500.org/).

The size of the problem matrix to be solved is typically determined by RAM size.

### Internal Operations

HPL uses a lot of linear algebra libraries as well as MPI for distributed memory parallelism.

### Installation

1. Download the tarball
2. Verify you have all the linear algebra libraries (BLAS etc.)
3. Complile with `./configure --prefix=...`
4. `make -j16 && make install`

### Input File (HPL.dat)

The input file determines the run logic. The program will automatically look for the HPL.dat file in the same directory the program was run from.

Parameters include:

- N (Array Size)
- NB (Block size for LA operations)
- P (Factorization rows)
- Q (Factorization columns - must equal MPI processes)

### Run HPL

Run HPL with `mpirun -np 2 xhpl`

### Tuning

HPL should occupy ~90% of you memory for optimal performance. The performance can be impacted by the block size (NB).

## Nvidia Collective Communications Library (NCCL)

NCCL is a high-performance library designed for analysing multi-node environments and their capabilities of scalable communication primitives. Communication types include AllReduce, Reduce, Broadcast and many more, optimised for Nvidia hardware.

An NCCL multi-node job can run where NCCL will identify the number of nodes and tasks per node from a source such as the slurm environment, and then appropriately run a suite of multi-node tests assuming 1 task per GPU per node.

### Algorithms

NCCL can support specialised algorithms but the two main preferred ones are Ring and Tree. The preferred method can depend on the specific operation and execution parameters.

**Ring AllReduce**

GPUs are logically arranged in circular fashion and send and receive data from their neighbors in a pipelined manner. This saturates the bandwidth but the latency increases with the number of GPUs.

**Double Binary Trees**

Double binary trees offer full bandwidth for broadcast and reduce operations. Two trees are formed where on one side, half of the ranks are nodes and half are leaves, and the other is reversed. When superimposed, each rank has 2 parents and 2 children except the root ranks. If each tree handles half of the data, then each rank would only send and receive half of the data twice, making it as optimal as a ring architecture.

The difference from the ring architecture comes from scale, as the double binary tree approach show significant performance improvements on larger multi-node systems[5].


### Communication Protocols

NCCL makes use of 3 communication protocols:

Protocol | Description
---|---
Simple | Designed for large message transfer for maximising bandwidth
Low Latency | Optimised for extremely small messages (4B)
LL128 | Mid-range protocol for medium sized messages

The Simple protocol as best applied larger AllReduce message sizes, with LL128 attempting to be the happy medium[6].


### Running the Tests

There is a [github repo](https://github.com/NVIDIA/nccl-tests) for running NCCL tests.

```bash
# Run on 64 GPUs across 8 nodes
mpirun -np 64 -N 8 ./build/all_reduce_perf -b 8 -e 8G -f 2 -g 1
```

### MNNVL

The MNNVL extension to NCCL can detect NVLink domains and the connected GPUs to optimise the configuration for maximum performance between domains. If no domains are identified then NCCL will fallback to other available Infiniband or RoCE networks.

## IOR

IOR is a standardised benchmarking tool for parallel I/O performance on HPC systems. It runs multi-node jobs with randomised I/O operations and can be used for comparing the performance of different filesystems.



## STREAM

## FIO

`fio` is a command line tool for verify disk read and write operations and measuring filesystem performance.

## References

*[1] A. Petitet, R. C. Whaley, J. Dongarra, and A. Cleary, "HPL – A portable implementation of the High-Performance Linpack benchmark for distributed-memory computers," Netlib, 2018. [Online]. Available: https://www.netlib.org/benchmark/hpl.*

*[2] SC23: The International Conference for High Performance Computing, "SCC23 Benchmarking Webinar," YouTube, Nov. 3, 2023. [Online]. Available: https://www.youtube.com/watch?v=bUdYAtbQ7I0.*

*[3] NVIDIA, "NCCL Tests," GitHub. [Online]. Available: https://github.com/NVIDIA/nccl-tests.*

*[4] NVIDIA, "Nvidia GB200 NVL Multi-node Tuning Guide," Nvidia, Apr. 21, 2025. [Online]. Available: https://docs.nvidia.com/multi-node-nvlink-systems/multi-node-tuning-guide/nccl.html*

[5] https://developer.nvidia.com/blog/massively-scale-deep-learning-training-nccl-2-4/

[6] https://medium.com/@nitin966/unpacking-nccl-a-deep-dive-into-multi-gpu-communication-2b667e77d96d