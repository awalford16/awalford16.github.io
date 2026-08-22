CPU caches store frequently used data to avoid needing to fetch information regularly from RAM. This is achieved through a tiered approach of gradually slower access speeds but larger memory sizes.

## L1 Cache

This is the cache closest to the core, with a latency of around 1-5 clock cycles. 

Type | Description
---|---
L1i | Instruction cache
L1d | Data cache

This is the smallest cache which lives physically inside each CPU core.

## L2 Cache - Mid-level Buffer

L2 acts as a larger staging area for L1 misses, with a latency of ~10-20 clock cycles.

Some architectures share this cace across CPU cores, but primarily the CPU cores have their own private L2 cache.

## L3 Cache - LLC

Serves as the last line of defense before going out to RAM, with a latency or ~40-60 clock cycles.

This is shared across all cores on the chip. Additionally, it plays a role in cache coherency between cores so they can see information from other CPU cores.
