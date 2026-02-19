## HPL

High Performance Linpack solves a random dense linear system in double precision which is used to measure performance of a cluster.

It outputs the result in number of FLOP/s and these results are used for the [Top 500](https://top500.org/).

The size of the problem matrix to be solved is typically determined by RAM size.

### Internal Operations

HPL uses a lot of linear algebra libraries as well as MPI for distributed memory parallelism.

### Installation

1. Download the tarball
2. Verify you have all the linear algebra libraries (BLAS etc.)
3. Complile with `./configure --prefix=...`
4. `make -j16 && make install`

### Input File (HPL.dat)

The input file determines the run logic. The program will automatically look for the HPL.dat file in the same directory the program was run from.

Parameters include:

- N (Array Size)
- NB (Block size for LA operations)
- P (Factorization rows)
- Q (Factorization columns - must equal MPI processes)

### Run HPL

Run HPL with `mpirun -np 2 xhpl`

### Tuning

HPL should occupy ~90% of you memory for optimal performance. The performance can be impacted by the block size (NB).

## References

*Petitet, A., Whaley, R. C., Dongarra, J., & Cleary, A. (2018). HPL – A portable implementation of the High-Performance Linpack benchmark for distributed-memory computers. Netlib. https://www.netlib.org/benchmark/hpl*

*SC23: The International Conference for High Performance Computing. (2023, November 3). SCC23 Benchmarking Webinar [Video]. YouTube. https://www.youtube.com/watch?v=bUdYAtbQ7I0*
