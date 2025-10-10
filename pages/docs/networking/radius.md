## RADIUS Server

### Quickstart

You can quickly get a RADIUS server up and running on Ubuntu with `apt install freeradius`

### Users

To add a user to the RADIUS server, edit the `/etc/freeradius/3.0/users` file. Add the lines below above the DEFAULT conditions:

```
user1 Cleartext-Password = "password"
```

### Clients

On the Radius server, you will need to configure a client, which specifies where the connection is coming from and the key they should use to authenticate. The following config should be added to `/etc/raddb/clients.conf`

```
client CLIENT_NAME {
    ipaddr = 10.0.0.0/24
    secret = password
}
```

This will allow clients connected in the `10.0.0.0/24` range to authenticate using the key `password`.

With a user and a client in place, we can test the authentication with `radtest`, which will validate the RADIUS response for a set of given credentials:

```
radtest user1 password 10.0.0.1 10 password
```

### Switch Configuration

On the Dell switch side, the Radius server host need to be configured to tell the switch how to reach and authenticate with the RADIUS server. By default, RADIUS servers are configured to listen to Auth requests on port `1812` and accounting requests on port `1813`.

```
radius-server host RADIUS_SERVER_IP key 0 "RADIUS_SECRET" auth-port 1812
```

## AAA

The RADIUS server config can be combined with the `aaa` configuration on Dell switches to configure how to authenticate and authorize users on the switch. The command supports configuring the switch for a variety of auth methods from RADIUS to TACACS+ or local user databases.

```
aaa authentication login default local group radius
```

The command above configures the switch to first look into the local database for user login, then fallback to the Radius servers defined previously. `default` refers to the auth list, which covers SSH sessions; alternatively `console` can be used.

The next command determines the authentication preferences for when a user is entering privileged exec mode

```
aaa authentication enable default local group radius
```

To have the switch also call out to RADIUS to enforce authorization, you can configure the following:

```
aaa authorization exec default local group radius
```

This command first checks locally if the user has exec privileges, if not it will go off to RADIUS and check for exec privileges.

## VTY

VTY lines manage the remote access to the switches via SSH or Telnet. For some Dell switches running OS9, additional configuration needs to be added to the VTY lines to ensure that SSH or Telnet connections are authenticated via the RADIUS server. Most modern switches can have up to 15 VTY lines.

```
configure terminal
line vty 0 9
login authentication default
```

The config above is saying, to authenticate with VTY lines 0-9, which are used by SSH sessions, refer to the "default" auth list.
