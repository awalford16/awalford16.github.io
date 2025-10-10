## Pooling

ZFS allocates volumes into pools, so storage can be spread across multiple storage devices.

ZFS removes the concept of volumes sitting between a set of storage devices and file systems. Instead it replaces it with a single storage pool. All the storage in the pool is shared.

This allows for automatic growing and shrinking of the pool.

## Data Integrity

ZFS detects and corrects data corruption. There are occasions where bits can flip within the file data which causes corruption. As far as file-system and metadata are aware, the file is fine, despite the data being corrupted. ZFS will do regular checksums to validate the data integrity and prevent these silent bit flip issues.

Silent and noisy data corruption are becoming more frequent with the increase in storage size and # of devices per deployment. CERN ran a test to verify a 1GB file write/read operation against 3000 rack servers with HW RAID. After 3 weeks there were 152 instances of silent data corruption. HW RAID only detected noisy data errors.

### E2E Data Integrity

A checksum is stored in the parent pointer and there is fault isolation between the data and the checksum. A checksum hierarchy forms a self-validating Merkle tree. ZFS will then validate the entire I/O path which helps catching silent data corruption.

These checksums help detect issues in mirroring. It verifies the good data from the healthy mirrored data block, and uses this to repair the bad data on the mirrored disk.

## Copy On Write

The atomic nature of changes are achieved via COW. When changes are made to data, it will make a copy of the initial data and only update the pointers for the portions of data that have changed. These changes need to be refelcted up the tree so the initial top-level block of the filesystem checksum will need to be updated.

If there is an issue during the write process, the initial tree representing the data will still have it's pointers pointing at the initial state of the data, ensuring the atomic nature of the write process.

## Management Improvements

ZFS is smart enough to know if a system uses big or little endian. Which means file systems can be switched between different hardware and still operate as normal.

## ZPL

ZFS POSIX Layer is an atomic object-based transaction. The transaction will not be marked as complete until all objects/changes have been correctly stored. This ensures that if there is a power failure during changes, all the changes will be reverted to ensure a clean state on retry.

## DMU

Data Management Unit is a transaction group commit which is atomic for an entire group.

## SPA

Storage Pool Allocator is a Transaction Group Batch I/O which can schedule, aggregate and issue I/O at will. This part of the stack talks directly to the disks and handles where data should be written based on the current allocation of data.

## Constant Time Snapshots

On completion of a change, a snapshot root will point at the original data.

## RAID-Z

Dynamic stripe width with a variable block size so each logical block has its own stripe.

All writes are full-stripe writes which eliminates read-modify-write and the RAID-5 write hole

Detects and corrects silent data corruption.

## Resilvering

Refers to recovering data on disk.

ZFS resilvers the storage pool's block tree from teh root down, meaning the most important blocks are restored first. There is no time wasted copying free space, unlike traditional RAID, as it only copies live blocks.

ZFS records the transaction group window that a device misses, and will re-walk the tree up to that point of data loss to recover from transient outages/dirty writes.

## Ditto Blocks

Data can be replicated to update 3 physical blocks to help with recovery of corrupted data. When different devices are not available, it will be replicated to different places on the same device.

## Disk Scrubbing

Finds latent errors while they're still correctable. It verifies the integrity of all data by traversing pool metadata to read every copy of every block (mirror copies, RAID-Z parity and ditto blocks) using its 256-bit checksum and repairs as it goes.

This process has a low I/O priority to ensure that scrubbing does not interrupt day-to-day activities.

## Intelligent Prefetch

ZFS is able to predict and prefetch the data. It will detect any linear access pattern.

## Variable Block Size

No single block size which allows for per-object granularity so read/write times closely represent the size of the data.

## Zones

ZFS allows for part of the pool to be separated into zones for specific use-cases
