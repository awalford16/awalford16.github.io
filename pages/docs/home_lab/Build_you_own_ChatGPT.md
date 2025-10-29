## ChatGPT On-Premise... but why?

ChatGPT has become an incredibly useful tool since its release in 2022. One of the most powerful things you can do with ChatGPT is to prompt it to become your own personal advisor in a wide range of issues. We can leverage it to be our own project manager or even a fitness coach/planner. There is just one issue though; these prompts and the information we provide to ChatGPT can get personal, and all of it goes out to the internet. This data that we provide to OpenAI can be used in model training and has been known to get exposed in the past.

Thanksfully, there are hundreds of open source LLMs which we can run ourselves, allowing the information we pass to the model to stay within our home network. With lower-parameter models like `llama3:8b` and `gemma3:12b`, it is possible to run an LLM on something like a Mac or a home lab computer with a GPU. They may not be as accurate as what is running behind OpenAI but it can still be a very powerful tool with an increased sense of security.

## Hardware Recommendations

This demo is deploying `llama3:8b` on an M2 Mac Mini with 16GB of RAM. For context, here is the recommended hardware specs for some of the available opensource LLMs to still achieve a good throughput.

Model | Min. GPU VRAM
---|---
llama3:8b | 6GB
gemma3:12b | 9GB
qwen2.5:32b | 24GB

## Ollama

Ollama is a tool used for running LLMs locally. It can be run very easily with just a docker container:

```
# Make a directory for ollama to download models to
mkdir ollama
docker run ollama/ollama:0.10.0-rc3 -p 11434:11434 -v ./ollama:/root/.ollama
```

Or in docker compose:

```yaml
ollama:
    image: ollama/ollama:0.10.0-rc3
    container_name: ollama
    ports:
      - 11434:11434
    volumes:
      - ./ollama:/root/.ollama
    restart: unless-stopped
```

We wont have any models available to talk to yet, but they can be downloaded with the command:

```
docker exec -it ollama ollama pull MODEL_NAME
```

### Quantization

Since we are running locally, we may not have access to a huge amount of storage, especially if we want to offer a range of models to try within our own ChatGPT. However, we can take advantage of QAT or post-training quantized models, which can reduce their memory footprint significantly.

Take Google's `gemma3:12b` model. The original model takes up 24GB in space, Google leveraged Quantized Aware Training (QAT), which reduces the precision of the models weights and biases from BF16 to Int4, taking the model size down to just 8GB. QAT is supposedly meant to keep the accuracy of the model better and post-training quantization, so we can also try add the `gemma3:12b-it-qat` model.

## Open WebUI

So we have ollama running, but it is not the most user-friendly interface. Each time we stop ollama, it loses all memory of our conversations.

[Open WebUI](https://github.com/open-webui/open-webui) is an open-source tool for providing a ChatGPT-like interface which can be used to point at your own locally-run LLMs. Meaning you can point it at your previously deployed ollama model, completing your completely on-premise ChatGPT.

Docker compose example:

```
open-webui:
    image: ghcr.io/open-webui/open-webui:main
    container_name: open-webui
    environment:
      - OLLAMA_BASE_URL=http://YOUR_IP:11434
      - 'WEBUI_SECRET_KEY='
    ports:
      - 3000:8080
    volumes:
      - ./open-webui:/app/backend/data
    extra_hosts:
      - host.docker.internal:host-gateway
    restart: unless-stopped
```

It takes a little while for the container to start, but once it is up, we can hit `localhost:3000` and be greated with a very familiar looking interface.
