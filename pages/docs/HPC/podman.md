## Overview

Podman is a daemonless container tool which makes use of Linux kernel features for isolating processes.

Linux Feature | Purpose
---|---
Namespaces | Isolate processes (PIDs, networks, mounts)
cgroups | Limit CPU/Memory
OverlayFS | Layered filesystem for images
User namespaces | Running containers as non-root
Linux capabilities | Fine-grained permissions

## Creating a Container

`podman pull` will fetch the image from a registry and store the layers in `/var/lib/containers/storage/overlay`.

`podman run` Unpacks the image into a new filesystem, creates a namespace and applies cgroups etc.

## Rootless Podman

To run podman as a non-root user, users require a subuid/subgid mapping in `/etc/subuids`. This is then reflected in the storage path for containers: `/run/user/SUBUID/libpod`

## Networking

Podman makes use of Container Network Interfaces similar to `docker`. Supporing the typical host and bridge network types.

## Unshare

`podman unshare` allows for entering new user namespaces for processes that require isolation. The command will trigger a new shell within the namespace with the appropriate isolation.

Unlike the `exec` command, the `unshare` command is running within the user namespace rather than within the container itself allowing for access to files owned by the container.
