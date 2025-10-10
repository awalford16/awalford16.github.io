```
# View storage consumption of disk/mounts
df -h

# View block storage devices
lsblk

# Generate a file of particular size
# Reads from /dev/zero to generate a 0.5GB file full of 0s
dd if=/dev/zero of=NAME bs=512M count=1

# Check storage consumption recusively throughout a path
ncdu -x $PATH
```
