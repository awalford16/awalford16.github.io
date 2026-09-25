## Hardware Monitoring via Redfish

This write up specifically looks at Dell server's running iDRAC 10.

When running your own physical hardware or datacenter, power monitoring is essential. This report discusses the different ways of monitoring power for HPC compute.

## Metric Reporting Approaches

Metrics reporting on server power usage and other general physical hardware metrics can be collected in a number of ways. Typical monitoring approaches involve installing some sort of exporter software on a host such as Node Exporter or DCGM exporter and then scraping that with prometheus. This poses one main issue; the server needs to be on, and the OS running it needs to have the correct software installed. Instead, metric monitoring for physical hardware should come direct from the BMC.

**Redfish Exporter**

Redfish is a standardised API for talking to server BMCs. The API can be used for configuring the server as well as scraping hardware metrics. [Fishymetrics](https://github.com/Comcast/fishymetrics) is a tool that can be run which calls the relevant Redfish endpoints based on the server model and reports back the various power and temperature values in a Prometheus-scrapable format.

Whilst experimenting with Fishymetrics, I noticed a couple short-comings. Firstly, our servers run a UBB, so GPU metrics are reported from a different Chassis which Fishymetrics was not picking. After forking the repo and adding the functionality to scrape UBB metrics, the reporting times we're incredibly slow. Since Fishymetrics needed to call numerous different endpoints and collate many different results, even after some parallelisation tweaks in the code, some servers were taking upward of 6 minutes to report back power metrics.

**Streaming API**

The streaming API is a dedicated telemetry feature in Dell iDRAC 10. It can operate in 2 different approaches. A push approach will push metric reports to a specified server, and a pull approach will have a dedicated server open a persistent connection with the BMC where it will continuously report metric updates.


## Configuring Streaming API

This part specifically looks at configuring a push-based metrics report. Mostly because this approach is far more scalable. A pull-based approach would require our server to have hundreds of open connections to monitor all of the datacenter iDRACs. It also doesn't require Telegraf to know about BMC credentials, allowing infrastructure admins to keep access for themselves and opt-in to the metric reporting. Additionally, configuration is far more scalable. A pull-based would require Telegraf being updated with new servers every time, whereas a push-based can be baked into the initial server configuration from day 1.

Firstly, the iDRAC needs to have telemetry streaming enabled:

```bash
curl -sk -u "$IDRAC_USER:$IDRAC_PASS" \
  -X PATCH "https://$IDRAC_IP/redfish/v1/TelemetryService" \
  -H "Content-Type: application/json" \
  -d '{"ServiceEnabled": true}'
```

### Telegraf

I used Telegraf as the dedicated server for iDRACs to push their metric reports to. Telegraf can be configured to take in these reports, parse the JSON and report values as Prometheus metrics. I simply ran Telegraf in a docker container with the below config:

```toml
[agent]
  ## don't append Telegraf host to metrics
  omit_hostname = true

[[inputs.http_listener_v2]]
  ## The port Telegraf will listen on for iDRAC telemetry data
  service_address = ":8080"
  paths = ["/idrac-telemetry"]
  methods = ["POST"]

  ## Parse the iDRAC Redfish MetricReport JSON
  data_format = "json_v2"

  [[inputs.http_listener_v2.json_v2]]
    measurement_name = "redfish_metrics"

    ## One metric per entry in the report's MetricValues array
    [[inputs.http_listener_v2.json_v2.object]]
      path = "MetricValues"

      ## Use the timestamp reported for each metric value
      timestamp_key = "Timestamp"
      timestamp_format = "2006-01-02T15:04:05.999999999Z07:00"

      ## Identify each metric by its Redfish MetricId
      tags = ["MetricId"]

      ## Only keep the value itself as a field (tags above are kept too)
      included_keys = ["MetricValue"]

      ## iDRAC reports MetricValue as a string - expose it as a float
      [inputs.http_listener_v2.json_v2.object.fields]
        MetricValue = "float"

[[outputs.prometheus_client]]
  ## Expose received metrics for Prometheus to scrape
  listen = ":9273"
  path = "/metrics"
```

This configuration tells Telegraf to listen on port 8080 for connections coming from iDRAC, parses the JSON object and reports them as prometheus metrics under `/metrics` on port `9273`. In particular, Telegraf receives a JSON block that includes a key for `MetricValue` which is the value that will get interpreted as the reading to export.

### Setting Up Subscriptions

Redfish has a concept of MetricReports which are typically generated each minute, which read the server sensor values. Additionally, Event Subscriptions within Redfish allow you to tell a server what to do for particular RedfishEvents.


```bash
curl -s -k -u $IDRAC_USER:$IDRAC_PASS \
  -X PATCH https://$IDRAC_IP/redfish/v1/TelemetryService/MetricReportDefinitions/PowerMetrics \
  -H 'Content-Type: application/json' \
  -d '{
        "MetricReportDefinitionEnabled": true,
        "ReportActions": ["LogToMetricReportsCollection", "RedfishEvent"],
        "Schedule": {
          "RecurrenceInterval": "PT0H0M10S"
        }
      }'
```

Configure the subscription to send MetricReports to Telegraf:

```bash
curl -k -u <username>:<password> \
  -X POST "https://<iDRAC-IP>/redfish/v1/EventService/Subscriptions" \
  -H "Content-Type: application/json" \
  -d '{
    "Destination": "http://$TELEGRAF_IP:8080/",
    "EventTypes": ["MetricReport"],
    "Protocol": "Redfish"
  }'
```

### Reporting GPU Metrics

If we look into the MetricReportDefinition for the `PowerMetrics`, we can see it lists many different metrics. For our system with a UBB, we care about the `FPGAPower` metric. We can dig into the `/redfish/v1/TelemetryService/MetricReports/PowerMetrics` report output and see the reported values:

```json
{
  "MetricId": "FPGAPower",
  "Timestamp": "2026-09-25T10:14:08.624Z",
  "MetricValue": "263.0",
  "MetricProperty": "",
  "Oem": {
    "Dell": {
      "@odata.type": "#DellMetricReportValue.v1_0_1.DellMetricReportValue",
      "ContextID": "ProcAccelerator.Slot.25-1#GPU6_POWER",
      "Label": "ProcAccelerator.Slot.25-1#GPU6_POWER FPGAPower",
      "Source": "PowerMetrics",
      "FQDD": "ProcAccelerator.Slot.25-1#GPU6_POWER"
    }
  }
},
{
  "MetricId": "FPGAPower",
  "Timestamp": "2026-09-25T10:14:03.625Z",
  "MetricValue": "2104.0",
  "MetricProperty": "",
  "Oem": {
    "Dell": {
      "@odata.type": "#DellMetricReportValue.v1_0_1.DellMetricReportValue",
      "ContextID": "ProcAccelerator.Slot.255-1#GPU_TOTAL_POWER",
      "Label": "ProcAccelerator.Slot.255-1#GPU_TOTAL_POWER FPGAPower",
      "Source": "PowerMetrics",
      "FQDD": "ProcAccelerator.Slot.255-1#GPU_TOTAL_POWER"
    }
  }
},
{
  "MetricId": "FPGAPower",
  "Timestamp": "2026-09-25T10:14:08.623Z",
  "MetricValue": "2247.0",
  "MetricProperty": "",
  "Oem": {
    "Dell": {
      "@odata.type": "#DellMetricReportValue.v1_0_1.DellMetricReportValue",
      "ContextID": "ProcAccelerator.Slot.255-1#UBB_POWER",
      "Label": "ProcAccelerator.Slot.255-1#UBB_POWER FPGAPower",
      "Source": "PowerMetrics",
      "FQDD": "ProcAccelerator.Slot.255-1#UBB_POWER"
    }
  }
}
```

This is the JSON structure that will get passed on to our Telegraf endpoint. So we can tweak the config to report for each FQDD, allowing us to scrape each device power reading.

With the subscription set up, we should be able to see the metrics from our Telegraf instance:

```
redfish_metrics_MetricValue{MetricId="CPUUsage"} 36
redfish_metrics_MetricValue{MetricId="CumulativeSystemEnergy"} 2.322928e+06
redfish_metrics_MetricValue{MetricId="FPGAPower"} 263
```

There is just one small issue, the cardinality is not showing all the GPU power metrics, just the last reported. So we need to update the tags parsed by Telegraf:

```
...
    [[inputs.http_listener_v2.json_v2.object]]
      ## Identify each metric by its Redfish MetricId and FQDD
      tags = ["MetricId", "Oem_Dell_FQDD"]
...
```

The only issue with this is it will give us this entire string `ProcAccelerator.Slot.255-1#UBB_POWER` which is not the nicest for our monitoring. In this instance I only care about the specific device. So I can define a regex processor to split by '#'

```
[[processors.regex]]
  ## For FQDD values of the form <fqdd>#<resource>, keep only the resource
  ## (e.g. ProcAccelerator.Slot.23-1#GPU3_POWER -> GPU3_POWER)
  [[processors.regex.tags]]
    key = "Oem_Dell_FQDD"
    pattern = "^[^#]+#(?P<resource>.+)$"
    replacement = "${resource}"
    result_key = "Oem_Dell_FQDD"
```

Now my metrics look like this:

```
redfish_metrics_MetricValue{MetricId="FPGAPower",Oem_Dell_FQDD="GPU0_POWER",Oem_Dell_Source="PowerMetrics"} 263
redfish_metrics_MetricValue{MetricId="FPGAPower",Oem_Dell_FQDD="GPU1_POWER",Oem_Dell_Source="PowerMetrics"} 262
redfish_metrics_MetricValue{MetricId="FPGAPower",Oem_Dell_FQDD="GPU2_POWER",Oem_Dell_Source="PowerMetrics"} 281
redfish_metrics_MetricValue{MetricId="FPGAPower",Oem_Dell_FQDD="GPU3_POWER",Oem_Dell_Source="PowerMetrics"} 260
redfish_metrics_MetricValue{MetricId="FPGAPower",Oem_Dell_FQDD="GPU4_POWER",Oem_Dell_Source="PowerMetrics"} 261
redfish_metrics_MetricValue{MetricId="FPGAPower",Oem_Dell_FQDD="GPU5_POWER",Oem_Dell_Source="PowerMetrics"} 244
redfish_metrics_MetricValue{MetricId="FPGAPower",Oem_Dell_FQDD="GPU6_POWER",Oem_Dell_Source="PowerMetrics"} 263
redfish_metrics_MetricValue{MetricId="FPGAPower",Oem_Dell_FQDD="GPU7_POWER",Oem_Dell_Source="PowerMetrics"} 268
redfish_metrics_MetricValue{MetricId="FPGAPower",Oem_Dell_FQDD="GPU_TOTAL_POWER",Oem_Dell_Source="PowerMetrics"} 2102
redfish_metrics_MetricValue{MetricId="FPGAPower",Oem_Dell_FQDD="UBB_POWER",Oem_Dell_Source="PowerMetrics"} 2243
```

## Scaling the Exporter

Now I can get individual server power metrics on a 15s scrape as opposed to the 6m wait time before, but currently it is not clear in the metrics where these metrics came from. This Telegraf setup does not work like a scraping exporter where prometheus asks for a particular target metrics, instead the exporter simply ingests the metrics from BMCs and formats them into something Prometheus can read.

The issue with this is that when the BMC passes the MetricsReport over to Telegraf, by default it doesn't give Telegraf any information about where it came from. To fix this, we can tell the subscription via Redfish to add a HTTP header to it's POST requests to Telegraf. Annoyingly, this is not something that can be patched, and insted needs to be added on the creation of the subscription:

```bash
curl -k -u $IDRAC_USER:$IDRAC_PASS \
  -X POST "https://$iDRAC_IP/redfish/v1/EventService/Subscriptions" \
  -H "Content-Type: application/json" \
  -d '{
    "Destination": "http://$TELEGRAF_IP:8080/",
    "EventTypes": ["MetricReport"],
    "Protocol": "Redfish",
    "HttpHeaders": [{ "X-iDRAC-Host": "$SERVER_NAME" }]
  }'
```

Now under the `http_listener_v2` we can tell Telegraf to parse that header into a metric tag:

```toml
[[inputs.http_listener_v2]]
  ...
  # Read server hostname from HTTP Header
  http_header_tags = {"X-iDRAC-Host" = "instance_name"}
```

Now my metrics look like this:

```
redfish_metrics_MetricValue{MetricId="FPGAPower",Oem_Dell_FQDD="GPU0_POWER",Oem_Dell_Source="PowerMetrics",instance_name="my-gpu-server"} 263
redfish_metrics_MetricValue{MetricId="FPGAPower",Oem_Dell_FQDD="GPU1_POWER",Oem_Dell_Source="PowerMetrics",instance_name="my-gpu-server"} 262
redfish_metrics_MetricValue{MetricId="FPGAPower",Oem_Dell_FQDD="GPU2_POWER",Oem_Dell_Source="PowerMetrics",instance_name="my-gpu-server"} 281
redfish_metrics_MetricValue{MetricId="FPGAPower",Oem_Dell_FQDD="GPU3_POWER",Oem_Dell_Source="PowerMetrics",instance_name="my-gpu-server"} 259
redfish_metrics_MetricValue{MetricId="FPGAPower",Oem_Dell_FQDD="GPU4_POWER",Oem_Dell_Source="PowerMetrics",instance_name="my-gpu-server"} 261
redfish_metrics_MetricValue{MetricId="FPGAPower",Oem_Dell_FQDD="GPU5_POWER",Oem_Dell_Source="PowerMetrics",instance_name="my-gpu-server"} 244
redfish_metrics_MetricValue{MetricId="FPGAPower",Oem_Dell_FQDD="GPU6_POWER",Oem_Dell_Source="PowerMetrics",instance_name="my-gpu-server"} 263
redfish_metrics_MetricValue{MetricId="FPGAPower",Oem_Dell_FQDD="GPU7_POWER",Oem_Dell_Source="PowerMetrics",instance_name="my-gpu-server"} 268
redfish_metrics_MetricValue{MetricId="FPGAPower",Oem_Dell_FQDD="GPU_TOTAL_POWER",Oem_Dell_Source="PowerMetrics",instance_name="my-gpu-server"} 2101
redfish_metrics_MetricValue{MetricId="FPGAPower",Oem_Dell_FQDD="UBB_POWER",Oem_Dell_Source="PowerMetrics",instance_name="my-gpu-server"} 2243
```

The metrics we get from these reports also include the rest of the system power, so we can determine the full load of the server as well as the individual component power consumption.
