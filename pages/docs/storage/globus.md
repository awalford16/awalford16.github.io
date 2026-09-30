## What is Globus?

Globus is a tool that facilitates large data transfers. It does not handle the storage, but simply applies layers on top of the GridFTP protocol to allow transfer between 2 storage endpoints.

Institutions will enroll their storage endpoints into Globus using the Globus Connect Server, which will then allow authenticated users to transfer data to and from that endpoint.

## GridFTP

GridFTP is the protocol used by Globus under the hood. It allows for performing a 3rd party data transfer, where data can be moved between 2 locations by a program not running at either of those locations. The user requesting the data move does not need to inspect the traffic flowing through it, instead it simply co-ordinates the senders and receivers to ensure data transfer between them.

GridFTP was built on top of the original FTP protocol. 3rd party data transfers were possible with standard FTP, but was limited by it's use of TCP stream mode. TCP is originally designed with sharing in mind, but these data transfers are trying to assume an uncontended network to make the most use of bandwidth. Because WANs are more prone to dropped packets, they can received more pushbacks from TCP. Additionally, because of the backoff behaviour, it takes a WAN longer to recover from dropped packets.

To mitigate against this, GridFTP introduced extended block mode, allowing the sender to create multiple TCP connections with the receiver. While the data still typically traversed the same path, it broke up the logical connections so the impact of dropped packets doesnt prolong the entire transfer. This dramatically improved the performance over a WAN and makes it possible to do large 3rd-party data transfers over a WAN much faster than standard FTP.

## Globus Terminology

**Endpoint**

Instance of globus-connect-server. An endpoint is tied to a Globus subscription and is typically the single entity mapped to a particular institution.

**Data Transfer Node (DTN)**

Physical node or virtual machine running Globus connect server. These are the nodes which will be responsible for transferring data between collections. Multiple DTNs can be assigned to an endpoint to improve reliability and performance.

**Connector**

A package that implements an interface allowing Globus to access the specific storage system
This depends on the type of storage it is interacting with (e.g. S3, POSIX)
Connectors are accessed through storage gateways attached to the endpoint

**Storage Gateway**

An instance of Globus connector configured to access a storage system using specified policies

- Defines identity domains allowed for authentication
- Sets restriction son filesystem paths
- Configures session duration
- Enforces MFA requirements

Multiple gateways can exist for a single endpoint. This can be useful for scalability, but also enforcing different access controls on the endpoint.

**Collection**

A logical construct that allows a user to accesss data via Globus
Part of a storage system that Globus can see

*Mapped*

Collection access is mapped to a local user account - requires the user to have a local OS account. User authenticates with institutional credentials which then maps to a local POSIX account. Data access operations run with local account permissions.

*Guest Collection*

Collection access does not require the user to have a local OS account. This enables colaboration with external users and institutions. Access is created by a local user and their mapped collection.

Admins must enable guest collections on the storage gateway - permissions are limited by the creators permissions.

## Deploying Globus Components

### Creating an Endpoint

```bash
gcs endpoint setup \
'My Tutorial Endpoint' \
--organization YOUR_ORGANIZATION_NAME \
--contact-email YOUR_EMAIL_ADDRESS \
--owner GLOBUS_IDENTITY   # must be known to Globus Auth; log in at least once
```

As part of the setup, you will be required to authenticate with your Globus identity which will then provide an authorization code to register the endpoint. It is recommended that this is done with a service account for production systems.

On completion, this generates a `deployment-key.json`. This needs to be stored safely so the server can be safely restored or migrated. Additionally, this is how multiple DTNs can be added to an endpoint.

Add the server as a DTN endpoint

```bash
sudo gcs node setup
```

You can now log in to the endpoint on this server:

```bash
gcs login localhost
```

To view information about the deployed endpoint run `gcs endpoint show`

### Create a Storage Gateway

Create a posix storage gateway designed to interact with the POSIX filesystem on the host.

```bash
gcs storage-gateway create posix \
'My POSIX Storage Gateway' \
--domain globusid.org \
--authentication-timeout-mins 90
```

Here the `domain` refers to the account access. This should match the identity of the institution that requires access to the storage. For example, if users access the storage with Google accounts, the domain would be `accounts.google.com`. A gateway can support multiple domains.


### Create a Mapped Collection

Create a mapped collection which points to a specific path on the host for storage access.

```bash
gcs collection create STORAGE_GATEWAY_ID $DIRECTORY 'Tutorial Mapped Collection'
```

This defines which path Globus will access the system from. The collection will be visible in Globus, but if you attempt to access it, it will throw an authentication failure because there is no local account for the user.

**Mapping Users**

For mapped collections, the user must have a local account on the OS.

```bash
# Create a user on the host
sudo adduser --gecos '$USERNAME' $USERNAME
```

Here the username should reflect the user attempting to access the storage. Once the user exists, it should be able to view the collection in Globus file manager.

**Path Restrictions**

We want to ensure that users cannot traverse paths in a collection. The following json block gives users access to the /home directory only:

```json
{
    "DATA_TYPE": "path_restrictions#1.0.0",
    "read_write": ["/home/"],
    "none": ["/"]
}
```

This can then be applied to a storage gateway to enforce the restritions

```bash
gcs storage-gateway create posix \
"Tutorial Storage Gateway - Restricted" \
--domain globusid.org \
--authentication-timeout-mins 90 \
--restrict-paths file:./paths.json
```

Creating a new collection behind the restricted storage gateway will ensure that users are only able to view up to `/home` and nothing else in the root directory.

## S3 Backed Collections

Create a storage gateway which points to an S3 bucket:

```bash
gcs storage-gateway create s3 \
"S3 Storage Gateway" \
--domain AUTH_DOMAIN \
--s3-endpoint https://s3.eu-west-2.amazonaws.com \
--s3-user-credential \
--bucket s3-globus
```

This command restricts access specifically to a bucket. It is possible to restrict further to prefixes within the bucket.

Create a mapped collection going to the storage gateway:

```bash
gcs collection create $S3_STORAGE_GATEWAY_ID / "S3 Mapped Collection"
```

When you go to the collection from Globus, it will request an Access and Secret key with permissions to access the bucket.

One thing to note when using S3 collections, is that it is not using the GridFTP protocol. Instead transfer is handled by the HTTP/S3 interfaces which can have an impact on data transfer performance. One further consideration when using cloud providers is the data egress cost$ associated with transferring data out of the S3 collection.

## Usefult Commands

```bash
# Associate endpoint with a subscription
gcs endpoint set-subscription-id $SUB_ID

# Enable guest collections
gcs collection update $COLLECTION_ID --allow-guest-collections

# Enforce MFA on storage gateways
gcs storage-gateway update posix $STORAGE_GATEWAY_ID --mfa
```
