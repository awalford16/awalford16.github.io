## Slurm Basics

### Commands

```
# Show cluster information
sinfo

# Show jobs in queue
squeue

# Submit script to cluster
sbatch FILE.sbatch

# Get detailed job output
scontrol show jobid --d $JOBID

# Cancel a job
scancel $JOBID

# Pause,resume job etc. - (suspend, resume, hold, release)
scontrol suspend $JOBID

# Run an asynchronous interactive job (SSH to node available after allocation)
salloc --nodes=1 -p PARTITION --time=30:00

# Run sychronous interactive job
srun --time=30:00 --pty /bin/bash
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


### Accounting

Slurm can be configured to collect information about jobs to be written to a database for reporting on resource usage from users.

The accounting world is separate to the scheduling world in slurm, so despite accounting being setup, users still need to be tied to accounts.

You can view the clusters, accounts and users known to Slurm accounting:

```
# List clusters
sacctmgr list clusters

# List accounts
sacctmgr list accounts

# List users
sacctmgr list users
```

You can verify if accounting is wired using `scontrol show job $JOBID | grep Account`. If it shows `Account=(null)` then the accounting is not wired up for that user. By default Slurm will allow all users to submit jobs even when they are not associated with an account.

Accounts can be enforced in `slurm.conf` by setting the `AccountingStorageEnforce` to `associations`. There are further configuratoin values for this setting depending on how strict the behaviour of job submission needs to be: https://slurm.schedmd.com/slurm.conf.html#OPT_AccountingStorageEnforce.

**More Accounting Commands**

```
# Add user
sacctmgr add user USERNAME Account=ACCOUNT

# Modify default account for user
sacctmgr modify user USERNAME set DefaultAccount=ACCOUNT

# Report resource usage
sacct

# Generate report for a particular time interval
sreport
```
