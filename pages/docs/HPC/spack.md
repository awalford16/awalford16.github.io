## Why use Spack?

### Reproducibility

Spack makes advancements on the traditional binary package managers like `apt` and `yum` by allowing a system to support multiple different versions and dependency trees.

Spack abstracts away a lot of the complexity of pacakage management on HPC systems and allows for easy reproducibility of research software runtime environments. On top of this, it provides a much more friendly CLI for managing these dependency trees of varying complexity.

Spack ensures reproducibility by tying dependency trees and linking packages to their dependent compilers, so environments can be rebuilt in a consistent way. It can also speed up installations by aiming to build dependency trees based on what the machine already has.

While reproducibility can be solved by tools like Virtual Machine Images and Docker, Spack attempts to handle the reproducibility on the package level, without having to make an entire copy of the system.

### Compiler and Architecture Considerations

Spack ensures that packages being installed a compatible with the host and relevant to the compiler version and architectures avilable. All libraries in a depency chain should use compatible compilers to ensure ABI and linking compatibility.

## Environments

Environments are cirtualised spack instances that can be used to aggregate package installations for a project.

```
spack env create myenv
spack env activate myenv

# Add a package into an environment
spack add tcl
spack install

# Remove a package from an environment
spack remove tcl

# Concretize the environment
spack concretize

spack env deactivate
```

It is still possible to use globally installed packages within an environment, but commands like `spack find` will show no installed packaages.

Spack environments will spit out a `spack.lock` which can be shared for reproducibility.

## Mirrors

Spack mirrors are designed to host local repositories where hosts can get their files from. This is used in the event of the host not having access to the internet or the site where the packages are typically installed from.

## Concretization

Concretization fills out any missing configuration details on a dependency graph when a user is not explicit. This will then explicitly set versions, compilers, architectures and compiler versions for each package in the dependency graph for guaranteed reproducibility.

## Complexity Handling

Spack ensures that multiple different versions and variations can be installed by taking a hash of the dependency graph for each installed package. The hash is then appended to each package prefix and saved under the relevant compiler in the spack directory. This ensures that each unique dependency graph is a unique configuration meaning multiple configurations of the same package can coexist on the system.

## External Software

Spack packages can be built with external software so not all packages need to be spack packages. The main issue with using external software is that the DAG gets pruned meaning Spack does not know anything about the external software below it in the tree.

External software can be configured in the `packages.yaml`, specifying the path to where the external software can be found.

## Commands

```
# List all packages from repository
spack list

# Show installed packages and different versions
spack find

# Show spack compilers
spack compilers

# Configure a spack mirror
spack mirror mymirror /mirror

# Find location of package
spack location -i gcc@12

# Specify the compiler for the install
spack install gmake %clang

# Explicitly specify the version of a dependency
spack install tcl ^zlib-ng@2.0.7 %clang

# Install package from package has
spack install tcl ^/6bh

# Disable a dependency
spack install hdf5~mpi

# Graphical view of dependencies
spack graph

# Uninstall pacakages (Remove zlib-ng built with gcc version 10)
spack uninstall zlib-ng %gcc@10

# Spack will attempt to prevent uninstalling pacakages that are used as a dependency
# Uninstall dependents along with package
spack uninstall --dependents zlib-ng/$HASH

# Target a specific architecture
spack install mpileaks@3.3 target=cascadelake

# Get spack config
spack config get
```
