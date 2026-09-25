## What are disk sectors?

Sectors refer to how a physical disk on a server is chunked up. Modern server's typically have their disks chunked up into sector sizes of 512 bytes, or more recently 4096 (4K) bytes. The larger sector sizes make the server more efficient since it doesnt need to keep track of as many sectors.

## Where Sectors are Used

Typically when booting an operating system onto a server, an image is written to the disk. This image contains a list of instructions which references particular memory locations based on sector numbers. These images assume a particular sector size, so their instruction may say go to sector 100 on boot.

This can become an issue when deploying older images on newer hardware which have 4K sector sizes. Since the image assumes sizes of 512 bytes, sector 100 is in a different location on a 4K disk compared to 512 in terms of actual bytes. One way around this is to ensure that disk partitions are created which are multiples of 4K.

### Image Creation

Images themselves contain the details of where to look for certain instructions when booting, which is all referenced in sectors. Supporting both 512 and 4K sectors could mean creating separate images for both. Below is an explanation of why different sector sizes complicate full disk images for each partitioning scheme.

**Master Boot Record**

A partition entry stores its start and length in sectors, not bytes. This means partitions can point to the wrong place on disks with different sector sizes. Additionally, there is a limit of 2TB for 512 sectors as opposed to 16TB for 4K disks.

**GPT**

GPT images still have an MBR at sector 0 for compatibility, but the real partition information is in the GPT header. Like MBR, all references in the GPT header are written referring to sectors and not bytes. GPT Header is typically sector 1 which is already in the wrong location when looking at different sector sizes.


## 512e

Modern disks are now adopting a 512e format, meaning they have sector sizes of 4K but mimic 512 byte capability to support backward compatibility.
