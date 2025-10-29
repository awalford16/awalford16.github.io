## RAID Types

**RAID 0 (Striping)**

Stripes data across multiple disks to improve performance. Provides faster read/write speeds but offers no resiliency meaning it cannot tolerate any drive failures.

**RAID 1 (Mirroring)**

Requires a minimum of 2 drives. Creates copies of the data across the drives so the capacity of the storage is `n/2`. Can withstand a single drive failure.

**RAID 5 (Striping with Distributed Parity)**

Requires a minimum of 3 drives to distribute data and parity information across. Can only withstand a single drive failure.

**RAID 6 (Striping with Double Parity)**

Distributes data across multiple drives but uses independent sets of parity data. This allows for it to withstand 2 drive failures at the same time. Requires a minimum of 4 drives.

**RAID 10 (Striping + Mirroring)**

Requires a minimum of 4 drives to create independent mirrored sets where data is striped across drives within the set. This provides the high performance of RAID 0 (still slower than RAID 5 or 6), and the fault tolerance provided by RAID 1.

## RAID Policies

### Read Ahead

Read sequential data ahead of time and store it in the cache to make read operations faster. Altenatively, this can be enabled dynamically when the system detects sequential data patterns.

### Write Through

Will not confirm completion of the write until it is written to disk. This provides assurance that there is not risk of data loss during outages, but write operations will be slower compared to write ahead.

### Write Back

Confirms completion of write operations once written to cache. This provides much faster write operations but is less fault tolerant, since data can be lost during unexpected outages, but can be more reliable if it is backed by a battery powered RAID controller.
