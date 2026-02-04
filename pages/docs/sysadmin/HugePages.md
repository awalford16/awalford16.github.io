## HugePages

### What is a page?

Typically a page represents 4KB of memory, meaning 1GB can be over 260,000 pages.

Every time the CPU accesses memory, it refers to the page table. The CPU will try to identify the page in memory associated with that process.

The more pages there are, the larger this table becomes which puts more burden on the CPU and slows down memory access. The CPU also has a cache called the Translation Lookaside Buffer (TLB) which will experiance a lot of cache misses in the event of thousands of small pages.

### HugePages Benefits

HugePages allows for 2MB or 1GB pages instead of 4KB. Instead of a million tiny boxes for storing memory, hugepages turns it into 1000 larger boxes. This can make the computer faster for larger programs.

Huge pages are useful for databases, virtual machines, ML workloads as they can improve cache behaviour.


### Types of HugePages

**Transparent**

Here, the kernel attempts to merge small pages into 2MB pages. This is the default behaviour on many distros.

**Explicit**

Here the huge pages are explicitly defined and reserved for special applications. These pages are locked and guaranteed for applications that require them.

### Defining HugePages

This needs to be decided before linux starts, so the GRUB config determines the size that linux should reserve for huge pages. GRUB is the only place early enough in the boot cycle for this to happen.

```
# Options passed to GRUB
default_hugepagesz=2M hugepagesz=2M hugepages=1024
```

