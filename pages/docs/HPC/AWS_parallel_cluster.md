## What is Parallel Cluster

Parallel cluster is an open-source tool provided by AWS for provisioning on-demand HPC clusters in AWS.

## Install Parallel Cluster

Parallel Cluster is a pip package which can be installed with:

```
pip install aws-parallelcluster --user
```

This installation provides access to the `pcluster` CLI

## Cluster Configuration

When creating a cluster, a cluster definition file is needed which will define the head node, access to the cluster, network configuration and scheduling tools.

### Head Node

```yaml
Region: us-east-1
Image:
  Os: alinux2
HeadNode:
  InstanceType: c6i.2xlarge
  Networking:
    SubnetId: $SUBNET_ID
  Ssh:
    KeyName: ws-default-keypair
  LocalStorage:
    RootVolume:
      VolumeType: gp3
  Dcv:
    Enabled: true
    Port: 8443
    AllowedIps: 0.0.0.0/0
  Iam:
    AdditionalIamPolicies:
      - Policy: arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore
      - Policy: arn:aws:iam::aws:policy/AmazonS3ReadOnlyAccess
  Imds:
    Secured: false
```

### Scheduler

```yaml
Scheduling:
  Scheduler: slurm
  SlurmQueues:
    - Name: c6i
      ComputeResources:
        - Name: compute
          Instances:
            - InstanceType: c6i.32xlarge
          MinCount: 0
          MaxCount: 2
          Efa:
            Enabled: true
            GdrSupport: true
      Networking:
        SubnetIds:
          - $SUBNET_ID
        PlacementGroup:
          Enabled: true
```

### Storage

You can configure the cluster to mount FSx file systems for Lustre storage access.

```yaml
SharedStorage:
  - Name: FSx
    StorageType: FsxLustre
    MountDir: /fsx
    FsxLustreSettings:
      FileSystemId: $FSX_FS_ID
```

Combine this all together into a `cluster.yaml` file

## Create a Cluster

Using the cluster configuration file from previously, the defined cluster can be provisioned with the `pcluster` CLI.

```
pcluster create-cluster --cluster-name $CLUSTER_NAME --cluster-configuration cluster.yaml
```

Created clusters can be viewed with `pcluster list-clusters`

## FSx

FSx provides a fast storage using Lustre, which can be attached to parallel cluster nodes for optimised HPC workloads.

### Data Repository Association

A DRA needs to be setup between an FSx and an S3 bucket.

```
aws fsx create-data-repository-association \
    --file-system-id $FSX_ID \
    --file-system-path "/dra" \
    --data-repository-path s3://$S3_BUCKET_NAME \
    --s3 AutoImportPolicy='{Events=[NEW,CHANGED,DELETED]},AutoExportPolicy={Events=[NEW,CHANGED,DELETED]}' \
    --batch-import-meta-data-on-create \
    --region $AWS_REGION
```

Once the DRA is created, from the head node of the cluster, the `dra` directory should be visible under `/fsx`.

Files uploaded to the S3 bucket will be visible from this directory however, they are lazy loaded.

### Lazy Loading

Lazy loading means that the metadata is visible from the directory but the data is only copied from the upstream S3 bucket at the time of first access.

If you run `lfs hsm_state /fsx/dra/$FILE` against an uploaded file in the S3 bucket, the state will show as `released`.

You can verify that subsequent accesses to the file are faster by cat-ing the file

```
time cat /fsx/dra/$FILE > /dev/shm/fsx
time cat /fsx/dra/$FILE > /dev/shm/fsx
```

The `hsm_state` will now show as `archived` and the Lustre `lfs df -h` command will now show the full file size. To release it from the system run `lfs hsm_release /fsx/dra/$FILE`.

### Auto-Export

The DRA configured previously also setup an `AutoExportPolicy` which tells the FSx filesystem to automatically update the state of the S3 bucket with any new, changed or deleted files.
