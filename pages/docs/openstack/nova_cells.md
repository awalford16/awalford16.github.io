## What are Nova Cells?

In a large openstack deployment, compute nodes will talk to a single Nova database and RabbitMQ message bus. Byt default, all compute nodes are deployed under `cell1`, but extra cells can be configured to reduce the bottleneck with new cells having their own database instance and RabbitMQ.

The cell conductor handles communicatoin between the cell's compute nodes and the Nova API.

Nova cells can be configured on the kayobe level with their own database and transport layer information.