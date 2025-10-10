## STS Authentication

Minio Security Token Service provides a way of authenticating with Minio tenants without needing to create authentication credentials on the tenant.

In this setup, we will be using Kubernetes service accounts with the `AssumeRoleWithWebIdentity` action for acquiring Minio access credentials.

### Minio Setup

We will be using the Minio helm chart to deploy a tenant for testing the STS authantication. Add the Minio Helm repository:

```
helm repo add minio https://operator.min.io
helm repo update
```

Install the Minio Operator:

```
helm install operator minio/operator -n minio-operator --create-namespace
```

The operator allows us to provision multiple Minio tenants using Minio CRDs. We can now deploy a Minio tenant once the operator pods are up and running:

```
helm install tenant minio/tenant -n minio-tenant --create-namespace
```

This will deploy a `tenant` custom resource which can be checked with `kubectl get tenants`.

The tenants will need to be configured with TLS enabled. By default the Helm chart configures the tenants with "auto-cert", which will use the Kubernetes CA cert on the cluster for generating TLS certificates for communication between the client, tenant and the Minio operator. This can be disabled and certs can be managed manually by configurating the chart valies with `certificate.requestAutoCert=false`. There are Minio STS deployment examples here on how to configure certificates with CertManager: https://github.com/minio/operator/tree/master/examples/kustomization/sts-example.

### Service Account Setup

The token that will be passed to the STS endpoint for authentication will be the JWT tied to a Kubernetes service account. The `yaml` below will create a service account in the cluster which will be assigned to a client service.

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: minio-client-sa
```

When assigning the service account to the client deployment, the `sts.min.io` audience needs to be added to the token, which can be achieved using projected volume mounts:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: minio-client
spec:
  template:
    spec:
      containers:
        - name: minio-client
          image: $IMAGE
          name: fridge-api-server
          ports:
            - containerPort: 8000
              protocol: TCP
          volumeMounts:
            - mountPath: /minio
              name: minio-client-sa
              readOnly: true
      serviceAccountName: minio-client-sa
      volumes:
        - name: minio-client-sa
          projected:
            sources:
              - serviceAccountToken:
                  audience: sts.min.io
                  path: token
```

The service account token with the projected audience will be mounted at `/minio/token`.

### Policy Binding

The service account needs to be bound to a Minio policy. This can be achieved using the Minio `PolicyBinding` CRD:

```yaml
apiVersion: sts.min.io/v1beta1
kind: PolicyBinding
metadata:
  name: minio-client-readonly
spec:
  application:
    namespace: client # Namespace of the client using the service account
    serviceaccount: minio-client-sa # Service account name
  policies:
    - readonly
```

### Python Client

Minio STS requires TLS encryption to work. Since the certificates used by the Minio tenant and operator are issued by the cluster CA, the CA cert needs to be trusted within the client. The certificates are also only valid for internal cluster URLs (e.g. `svc.cluster.local`), meaning the client needs to be running from somewhere where that can be resolved.

This certificate is already accessible within the pod when a Kubernetes service account is assigned to the pod. The cert can be found in the pod under `/var/run/secrets/kubernetes.io/serviceaccount/ca.crt`

The Python script below assumes that it is running within the cluster, with the internal Kube DNS to resolve `svc.cluster.local`. It passes the cluster certificate into the SSL context for the HTTP call, which calls the `/sts/$TENANT` Minio operator STS endpoint passing the `Action=AssumeRoleWithWebIdentity` and `WebIdentityToken=$JWT`.

```python
import ssl
import urllib3
from pathlib import Path

SA_TOKEN_FILE = "/minio/token"
KUBE_CA_CRT = "/var/run/secrets/kubernetes.io/serviceaccount/ca.crt"
STS_ENDPOINT = "https://sts.minio-operator.svc.cluster.local:4223"
TENANT = "minio-tenant"

# Read service account token
sa_token = Path(SA_TOKEN_FILE).read_text().strip()

ssl_context = ssl.create_default_context(cafile=KUBE_CA_CRT)

# Create urllib3 client which accepts kube CA cert
http = urllib3.PoolManager(ssl_context=ssl_context)

# Send the token to the MinIO STS endpoint
response = http.request(
    "POST",
    f"{STS_ENDPOINT}/sts/{TENANT}?Action=AssumeRoleWithWebIdentity&Version=2011-06-15&WebIdentityToken={sa_token}",
)

print(response.data)
```

Providing all went to plan, Minio should return a block of XML containing the access and secret key, looking similar to the block below.

```xml
<AssumeRoleWithWebIdentityResponse xmlns="https://sts.amazonaws.com/doc/2011-06-15/">
    <AssumeRoleWithWebIdentityResult>
        <AssumedRoleUser>
            <Arn></Arn>
            <AssumeRoleId></AssumeRoleId>
        </AssumedRoleUser>
        <Credentials>
            <AccessKeyId>ACCESS_KEY</AccessKeyId>
            <SecretAccessKey>SECRET_KET</SecretAccessKey>
            <Expiration>2020-12-25T00:00:50Z</Expiration>
            <SessionToken>JWT</SessionToken>
        </Credentials>
    </AssumeRoleWithWebIdentityResult>
    <ResponseMetadata></ResponseMetadata>
</AssumeRoleWithWebIdentityResponse>
```

This XML can then be parsed to grab the keys and configure the minio Python client.

```python
from minio import Minio

minio_client = Minio(
  "minio.minio-tenant.svc.cluster.local:9000",
  access_key=$ACCESS_KEY,
  secret_key=$SECRET_KEY,
  secure=True,
)
```
