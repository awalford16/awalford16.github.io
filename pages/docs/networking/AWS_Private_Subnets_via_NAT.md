## Setup

The diagram below outlines how to setup a public/private subnet network in AWS where both subnets are able to talk to the internet via a NAT gateway.

```
        +-------------------+
        |    Internet       |
        +---------+---------+
                  |
            +-----v-----+
            |   IGW     |
            +-----+-----+
                  |
        +---------v----------+
        |    VPC 10.0.0.0/16 |
        +---------+----------+
                  |
       +----------+-----------+
       |                      |
+------v------+        +------v------+
| Public SN   |        | Private SN  |
| 10.0.1.0/24 |        | 10.0.2.0/24 |
+------+------+\       +------+------+
       |       \              |
       |        \             |
+------v--+      \            |
| NAT GW  |<------+            |
| (EIP)   |                   |
+----+----+                   |
     | Outbound via NAT       |
     +------------------------+
```

The NAT gateway is assigned an internal IP address within the public subnet, and an external IP address that allows it to talk to the internet GW.

In order for the private subnet to be able to reach the internet, it needs to first be given a route to the NAT gateway in it's route table.

## Configuring with Terraform

**Subnets**


It can be important to specify the availability zone here. NAT gateways are AZ specific, so the private subnet needs to be in the same AZ as the public subnet to be able to successfully route to the NAT gateway.

**Internet Gateway**

```
resource "aws_internet_gateway" "gw" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name = "igw"
  }
}
```

**NAT Gateway**

Unlike an internet gateway, a NAT gateway will allow communication with servers via a single IP address making use of Network Address Translation.

```
resource "aws_nat_gateway" "nat_gateway" {
  allocation_id     = aws_eip.public_ip.id
  connectivity_type = "public"
  subnet_id         = aws_subnet.public_sn.id
}
```

**Route Table**

The route table resource is used to define a route of `0.0.0.0/0` to the NAT gateway, which is then referenced by an `aws_route_table_association` resource to assign that route to the private subnet.

This allows hosts in the private subnet to be able to know where to go when trying to get to the internet.

```
resource "aws_route_table" "public_egress_via_nat" {
  vpc_id = aws_vpc.main.id

  # Route all internet traffic to access subnet
  route {
    cidr_block = "0.0.0.0/0"
    # Use the NAT gateway attached to access subnet for internet access
    nat_gateway_id = aws_nat_gateway.nat_gateway.id
  }

  tags = {
    Name = "public-egress"
  }
}

# Associate Route Table with Private SN
resource "aws_route_table_association" "public_egress_access_via_nat" {
  subnet_id      = aws_subnet.private_sn.id
  route_table_id = aws_route_table.public_egress_via_nat.id
}
```

**Security Groups**

One extra consideration to have, is whether the hosts in the private subnet should allow internet traffic in both directions.

**Verification**

You can verify hosts in the private subnet are going via the NAT gateway by running `curl ifconfig.me`. The result should match the public IP assigned to the NAT gateway.

```
[ec2-user@priv-sn-0 ~]$ curl ifconfig.me
13.42.197.39    # (NAT Gateway)
```

Running from a host in the public subnet which has a public IP assigned directly to the host, shows it does not go through the NAT gateway and instead directly through the internet gateway.

```
[ec2-user@pub-sn-0 ~]$ curl ifconfig.me
18.134.137.111  # (Directly assigned IP)
```
