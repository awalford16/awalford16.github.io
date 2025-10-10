## Slurm Basics

### Commands

```
# Show cluster information
sinfo

# Show jobs in queue
squeue

# Submit script to cluster
sbatch FILE.sbatch
```

### Job Submission

Create an `sbatch` file to be submitted to Slurm:

```
#!/bin/bash
#SBATCH --job-name=ior
#SBATCH --ntasks=10
#SBATCH --output=%x.out

module load intelmpi
mpirun ./ior -w -r -o=/shared/test_dir -b=256m -a=POSIX -i=5 -F -z -t=64m -C
```

The script above makes use `ior` which is an IO performance tool for parallel file systems. This is assuming a host running Intel MPI.
