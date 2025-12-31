## SSSD Overview

SSSD can provider user and group lookup functionality by integrating with the Linux Name Service Switch and handle remote user authentication with the PAM integration.

In addition to the `nss` and `pam` responders, SSSD has an `ssh` responder which can be used to lookup authorised SSH keys to permit access to a server.

## SSH Auth Flow

When connecting to a server via SSH, authentication flows through the following pipeline:

1. sshd_config (Determines permitted auth methods)
2. Auth methods (password, pubkey, keyboard input)
3. PAM stack
4. PAM modules (e.g. pam_sss)

## SSH Configurations

```
PasswordAuthentication no
```

This disables authentication using a password and instead will require a user to authenticate using an SSH key. These keys will typically be found in `~/.ssh/authorised_keys`

```
AuthorizedKeysCommand /usr/bin/sss_ssh_authorizedkeys
```

This enables SSH to obtain authorised keys via SSSD. SSSD can be configured in the background to talk to 3rd-party authentication services such as LDAP to authenticate the user.

```
UsePAM yes
```

PAM handles the password authentication side of SSH. Providing SSH is configured to permit password auth or keyboard input, if key-based auth fails, SSH can fallback to PAM to authenticate the user.

PAM comes with many plugin modules which help define how authentication is processed. PAM can call out to the SSSD module which in the background will handle the authentication with a remote services such as LDAP.

## External Auth Providers

It is possible to leverage PAM and SSSD to talk remotely to a remote authentication server such as LDAP. This allows for a single sign-on experience as user profiles and credentials are centralised.

**SSSD**

The SSSD configuration needs a domain which defines the properties of the LDAP server. 

```
[domain/ldap]
auth_provider = ldap
ldap_search_base = dc=example,dc=com
ldap_uri = ldaps://ldap.example.com
id_provider = ldap
```

Among the minimum required properties, there are many extra properties which can be set for adjusting behaviour of the authentication, this is just a few examples:

```
# Store the user credentials to prevent doing an LDAP lookup each time
cache_credentials = True

# Ensure user password changes are propogated to LDAP
chpass_provider = ldap

# Only lookup the specific LDAP user, ("true" would lookup all LDAP users and groups to be cached locally)
enumerate = false
```

**SSHD**

It is possible to make use of SSH keys with LDAP so the user can authenticate with a host without a password. To achieve this, the LDAP server needs to have an `sshPublicKey` field set for each user.

Then within the SSH config, password authentication should be disabled and tell SSH to use the `/usr/bin/sss_ssh_authorizedkeys` command to identify the authorized keys for a user on the host. This setup can even make use of LDAP groups to only permit users which belong to a specific LDAP group to have SSH access to the host.

```
# Disable password authentication
PasswordAuthentication no

# Allow Admins SSH access
Match Group admin
  AuthorizedKeysCommand /usr/bin/sss_ssh_authorizedkeys
  AuthorizedKeysCommandUser nobody
  AuthorizedKeysFile none
```

**Verification**

To verify that the external lookup is working, `getent passwd $USERNAME` should return the details for the user in the LDAP database.
