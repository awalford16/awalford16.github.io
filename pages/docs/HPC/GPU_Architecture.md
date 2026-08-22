## GPU Structure

**Graphics Processing Unit**

Built from billions of transistors. Mostly taking up with processing cores

It is divided into Graphics Processing Clusters (GPCs) which are then divided into Steaming Multiprocessors (SMs). Each SM contains Warps and a Ray Tracing Core (RT Core).

Within each Warp is are multiple CUDA cores and a single Tensor Core.

All in all, the GPU contains 3 main types of cores: CUDA cores, Tensor Cores and Ray Tracing cores.

Each core is responsible for different calculation functions.


### Ray Tracing Cores

Ray Tracing cores are the largest of the all the cores in the GPU. They are used for Ray Tracing algortihms.

### Tensor Cores

Tensor cores are designed for matrix multiplication and addition, used for geometric transformations. This is best applied for neural network and AI applications.

### CUDA Cores

CUDA cores are for standard binary calacultion functions like addition, multiplication, greater-than etc. These types of operations are most popular for video game applications.


**Fused-Multiply and Add (FMA)**

The CUDA core is responsible for handling FMA calculations. FMA is an A x B + C calculation and is the most common operation performed by graphics cards. The core will complete one add and multiple calaculation each clock cycle.
 
Half of the CUDA cores within a GPU will perform FMA caculations using 32-bit floating-point numbers. The rest of the cores will either use 32-bit integers or 32-bit floating point for the calacultions.


**More Complex Calculaions**

Within an SM, there are much fewer cores available for performing more complex functions such as division and square root calculations.


## Caching + Gigathread Engine

The GPU is connected over PCIe to an L2 cache and a Gigathread engine responsible for managing the Graphics processing clusters.

## GPU Memory

Around the outside of the GPU is where the memory chips sit. This is where working data is loaded from the on-board memory of the server.

In order to render large 3D models, chunks of memory are continuously being passed between the GPU memory and the GPU processor.

The bandwidth of the GPU refers to how much memory can be transferred from the GPU memory into the GPU per second. To improve performance, GPU memory chips are not just transferring 0s and 1s at a time. The encoding scheme of GDDR7 is known as PAM3 which supports using multiple voltage ranges to represent chunks of bits to transfer 3 bits at a time.

### High-Bandwidth Memory (HBM)

HBM is built from stacks of DRAM memory chips. Between the layers there is Through Silicon Vias (TSVs) to connect the stack into a single chip. This supports a much larger density of memory per GPU chip.

## Single-Instruction Multiple-Data (SIMD)

SIMD is a process for solving embaressingly parallel problems such as video game rendering and crypto mining. This is where the same instruction is applied across millions of different numbers in parallel.

For example, 3D models can have XYZ co-ordintes, to render objects into a 3D world, these co-ordinates need to be transferred into the common world co-ordinate system to represent the location of each 3D object. SIMD takes each vertex of a 3D model and translates it into the common world 3D space. This is performed for all verteces for all objects in the world.

All of these calculations have no dependency on any other calculation and can be acheived completely in parallel.

**SIMT**

Single-Instruction Multiple-Threads works the same as SIMD except the threads dont need to be in sync with one another and can progress at different rates.

Additionally, all threads share an L1 cache where data can be shared between threads.
