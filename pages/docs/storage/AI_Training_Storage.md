## Storage Tiers

Tier | Hardware | Uses
---|---|---
0 | GPU HMB | GPU current working data
1 | RAM | Data loaded by the CPU to feed the GPU
2 | Local NVMe | Data shards, checkpoints, dataset caches
3 | Shared High-performance FS | Training datasets, checkpoints, multi-node access
4 | Object Storage | Models, long-term checkpoints, raw datasets
5 | Archive | Old datasets, backups

## Data Flow

Datasets are loaded into the shared high-performance file-system from object storage prior to training. Prior to the job run, data is staged into local NVMe on the node. This data is loaded from NVMe into RAM and eventually into GPU memory.

Checkpoints travel in the opposite direction, written from GPU memory into NVMe, written in parallel to the shared file-system and backed up to object storage.

## Slow Downs

The data pipeline can be impacted by many things:

- Single-thread data loading
- No asynchronous I/O
- Small files making operations metadata bound
