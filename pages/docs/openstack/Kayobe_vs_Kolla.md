Bot Kayobe and Kolla are openstack tools which leverage Ansible for deploying Openstack components.

## Kolla Ansible

Kolla Ansible is reposnible for deploying Openstack containers on the controller and compute hosts which are part of the overcloud.

### Command Examples

```
# Bootstrap docker, users and dependencies on target hosts
kolla-ansible boostrap-servers

# Deploy openstack containers to the host
kolla-ansible deploy
```

## Kayobe

Kayobe is responible for managing all infrastructure responsible in openstack, including the seed host. Where Kolla will just deploy the Openstack containers to overcloud hosts, Kayobe will also manage the bare metal host, seed node and networking.

### Command Examples

```
# Install depencies on seed host
kayobe seed host configure

# Deploy containers used by seed host
kayobe seed container deploy

# Configure network interfaces etc on overcloud hosts
kayobe overcloud host configure

# Deploy openstack services on overcloud (calls kolla-ansible under the hood)
kayobe overcloud service deploy

# Use Kayobe to run commands against overcloud hosts
kayobe overcloud host command run --show-output --command 'uptime'
```
