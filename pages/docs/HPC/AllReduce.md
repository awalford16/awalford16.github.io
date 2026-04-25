## What is AllReduce?

### The Problem

In data paralllel training, each GPU has its own copy of the model and trains on different data to other GPUs.

Each GPUs computes it's own gradients which then changes the model known by all other GPUs. The gradients produced by each of the GPUs need to be combined to make them consistent.

### Ring AllReduce

Ring AllReduce is a common implementation of the algortihm to combine the different gradients. 

**Reduce Scatter**

Each GPU sends one chunk clockwise and receives one chunk. It adds the chunk received to its own.

**All Gather**

Once the GPUs have ~1/4 of the chunks calculated, it sends its chunk around the ring and receives all the other chunks from the other GPUs so each GPU has the full final gradient.

## Bottlenecks

AllReduce scales with the network so as more nodes are added, eventually more time is spent syncing gradients. It is better to reduce network calls and perform allreduce on larger buckets rather than tiny tensors.
