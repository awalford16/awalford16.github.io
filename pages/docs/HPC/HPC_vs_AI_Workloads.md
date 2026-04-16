## A Comparison of HPC and AI workloads

While the infrastructure under the hood of an AI cluster and HPC cluster may look very similar, the requirements of the workload types are very different.

### HPC

**Memory Access**

Memory access in HPC is irregular and sparse; working with large data sets that often exceed the size of the cache.

**Latency Sensitive**

Workloads rely on a lot of synchronisation points, where each rank waits for the slowest rank to complete before continuing.

### AI Model Training

During AI model trianing, the GPU is responsible for running the forward pass, back propagation and weight updates. All this happens sequentially for each batch of data. The back-propagation is the most compute-intensive part of the model training.

During training the CPU can be one of the main bottlenecks. It's main responsibility is orchestration and ensuring that the data being processed by the GPU is loaded and ready to ensure the GPU is not sat idle.

The other main bottleneck in AI training is the GPU memory. The memory during training is responsible for storing model weights, gradients and activations for each layer. This can grow quickly with the number of parameters that the model accepts.

### AI Inference

During AI inference, only the forward pass through the model is relevant. This means it is less reliant on the compute intensive operations of back-propagation. Here the bottleneck is less on GPU operational capabilities and more on the memory bandwidth.

**Memory Access**

AI inference workloads are continuously loading large model weights into memory, making the jobs incredibly memory-bound with compute waiting for weights to arrive. Unlike HPC, the access patterns are much more predictable and jobs value bandwidth more over latency. This is true for networks on multi-node inference as well where AllReduce is moving GB chunks between GPUs.
