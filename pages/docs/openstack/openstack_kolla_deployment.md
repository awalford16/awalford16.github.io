Openstack can be deployed in a number of ways. A popular tool for deployment is Kayobe which deploys the Openstack services to machines as docker containers.

Kayobe uses kolla-ansible to automate the deployment of Openstack services.

## Kayobe

```
# Configure Seed hypervisor
kayobe seed hypervisor host configure

# Configure a Seed host
kayobe seed host configure

# Configure an overcloud host
kayobe overcloud host configure
```

Kayobe has global configuration for each of these type of hosts under $KAYOBE_CONFIG_PATH. The configuration files names represent the host type.

```
seed.yml
controller.yml
compute.yml
```

## Service Deployment

With the Kayobe host configured, the services can be deployed.

```
# Deploy services for seed host
kayobe seed service deploy

# Deploy services for overcloud hosts
kayobe overcloud service deploy
```

## Service Upgrade

This docs assumes an Openstack deployment with Kayobe. Official Github docs for updates can be found [here](https://github.com/stackhpc/stackhpc-kayobe-config/blob/staggered-upgrade/doc/source/operations/upgrading-openstack.rst#ovs)

### Overcloud

```
# Make database backup
kayobe overcloud database backup

# Pull host containers
kayobe overcloud container image pull

# Update host packages
kayobe overcloud host package update --packages "*"

# Update host components (pip packages etc.)
kayobe overcloud host upgrade

# Stop health manager service (from controllers)
# Checking for loadbalancer states to see if they need to failover (upgrade can cause them to go into an error state)
# Loadbalancers wont come out of error state
docker stop octavia_health_manager

# Upgrade services
# Skip sensitive services like nova and networking services
kayobe overcloud service upgrade --kolla-skip-tags neutron,nova,openvswitch
```
