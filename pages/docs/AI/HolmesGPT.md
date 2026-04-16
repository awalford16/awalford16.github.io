## What is HolmesGPT?

[HolmesGPT](https://holmesgpt.dev/latest/) is an AI agent which plugs into multiple data sources, MCP servers and toolsets and feeds them to an LLM to provide a way of querying your infrastruture with natural language. It is designed to be read-only, so only used to ask questions on the data sources as opposed to the scarier alternative.

## Setup

For this lab I decided just to run `holmes` as a docker container, so all you need installed is `docker`.

## Deploy a Dummy Prometheus Stack

I started with a simple prometheus + node_exporter docker compose stack:

```yaml
# docker-compose.yml
services:
  node-exporter:
    image: prom/node-exporter:latest
    container_name: node-exporter
    restart: unless-stopped
    volumes:
      - /proc:/host/proc:ro
      - /sys:/host/sys:ro
      - /:/rootfs:ro
    command:
      - '--path.procfs=/host/proc'
      - '--path.sysfs=/host/sys'
      - '--collector.filesystem.ignored-mount-points=^/(sys|proc|dev|host|etc)($$|/)'
    ports:
      - "9100:9100"
    networks:
      - monitoring

  prometheus:
    image: prom/prometheus:latest
    container_name: prometheus
    restart: unless-stopped
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
    ports:
      - "9090:9090"
    networks:
      - monitoring

networks:
  monitoring:
    driver: bridge
```

```yaml
# prometheus.yml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']

  - job_name: 'node-exporter'
    static_configs:
      - targets: ['node-exporter:9100']
```

Deploy with `docker compose up -d`

## Configuring the Tools

Using the prometheus stack, we can now create a holmes config file which tells HolmesGPT where to look when it needs to leverage the prometheus tool:

```yaml
# ./.holmes/config.yaml
toolsets:
  prometheus/metrics:
    enabled: true
    config:
      prometheus_url: http://127.0.0.1:9090
```

The config file is created under a `.holmes` directory which will be mounted into the holmes docker container.

Holmes supports quite an extensive list of toolsets/mcp servers which it can refer to. The list can be found [here](https://holmesgpt.dev/latest/data-sources/builtin-toolsets/).

## Connect Holmes to your LLM

For this lab, I am using an LLM running in LiteLLM. Simply set the `OPENAI_API_BASE` to the LiteLLM URL. We can also export the `LITE_LLM_API_KEY` to be passed into the holmes API call later.

## Running Holmes

Since we're running holmes via a docker container, I created a small alias/script to handle the docker run command:

```bash
#!/bin/bash
docker run -it --net=host \
  -e OPENAI_API_BASE \
  -v ~/.holmes:/root/.holmes \
  us-central1-docker.pkg.dev/genuine-flight-317411/devel/holmes ask "${1}" --model="hosted_vllm/$MODEL_NAME" --api-key $LITE_LLM_API_KEY
```

We can then run the script with our prompt: `./holmes.sh "Are there any prometheus node exporter metrics I should be concerned about?"`

```
╭─ AI Response ────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╮
│                                                                                                                                                                                                              │
│  The investigation is complete. The node exporter metrics indicate that the system is healthy, with sufficient memory, low disk I/O, balanced CPU usage, and a healthy system load. No immediate concerns    │
│  were identified.                                                                                                                                                                                            │
│                                                                                                                                                                                                              │
╰──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╯

User: What are the values for each of those metrics?

Thinking... (press escape to interrupt)

╭─ AI Response ────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╮
│                                                                                                                                                                                                              │
│  Here are the values for the metrics I analyzed:                                                                                                                                                             │
│                                                                                                                                                                                                              │
│   1 Memory: node_memory_MemFree_bytes = 14,233,186,304 bytes                                                                                                                                                 │
│   2 Disk I/O: node_disk_io_time_seconds_total = 310.513 seconds (for device sda)                                                                                                                             │
│   3 CPU Usage: node_cpu_seconds_total (for CPU 0):                                                                                                                                                           │
│      • idle = 1,140,891.4 seconds                                                                                                                                                                            │
│      • iowait = 27.74 seconds                                                                                                                                                                                │
│      • irq = 451.5 seconds                                                                                                                                                                                   │
│      • nice = 11.13 seconds                                                                                                                                                                                  │
│      • softirq = 312.97 seconds                                                                                                                                                                              │
│      • steal = 2.49 seconds                                                                                                                                                                                  │
│      • system = 1,749.61 seconds                                                                                                                                                                             │
│      • user = 3,988.61 seconds                                                                                                                                                                               │
│   4 System Load: node_load1 = 0.23                                                                                                                                                                           │
│                                                                                                                                                                                                              │
│  These values indicate that the system is running smoothly.                                                                                                                                                  │
│                                                                                                                                                                                                              │
╰──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╯

```

## Summary

This was a rather over-engineered approach to calling the prometheus endpoint, but hopefully a useful insight into how data sources can plugged into LLMs for managing critical infrastructure.

This can become an incredibly powerful tool for finding needls in a haystack and cross-referencing data from multiple sources.
