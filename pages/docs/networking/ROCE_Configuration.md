## Supporting RDMA

### Switches

To support RDMA on an ethernet network, it is a little less plug and play than an infiniband network.

Here is everything that needs to be configured on an ethernet switch to make it lossless:

1. Priority Flow Control
2. Explicit Congestion Notification
3. DSCP or PCP priority mapping
4. Jumbo frames (MTU 9000)
5. No asymmetrical paths

### Hosts

Hosts themselves need to be configured to enable ROCE:

```
echo 2 > /sys/class/infiniband/mlx5_0/ports/1/roce_enable
```

Configure the `mlnx_qos` traffic class:

```
mlnx_qos -i eth0 --pfc 1,1,1,1,1,1,1,1
```

Ensure `rdma-core` is installed along with vendor libraries such as `NCCL` and `MPI`

## Commands

```
# Test RDMA
rdma_pingpong

# NCCL Test
nccl-tests/build/all_reduce_perf -b 8 -e 4G -g 8
```