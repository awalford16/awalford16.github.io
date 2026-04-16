## What is LAMMPS?

Large-scale Atomic/Massively Parallel Simulator (LAMMPS) is a molecular dynamics engine for simulating the behaviour of atoms.

The software is designed to be run on HPC, since there can be billions of atoms interacting with one another, each MPI rank takes a chunk of the atoms and calculates their behaviour based on the forces exerted on them. This then produces a simulation of a materials behaviour under different stresses.

The complexity comes when the ranks need to determine the behaviour of atoms near the edges of their chunk. Atoms at the edges will have forces exerted on them by atoms computed in another rank. This is handled by a large amount of cross-node communication, passing information about the behaviour of the atoms at the edge of their chunk.


### Running LAMMPS

LAMMPS takes in a text file to define the types of atoms, interaction rules and the duration of the simluation.

**Example In file**

```
# 1. Initialisation
units           metal           # unit system (metal = eV, Angstroms, ps)
atom_style      atomic
boundary        p p p           # periodic in x, y, z

variable        x index 1       # may be overridden from command line with -var x <value>
variable        xx equal 20*$x  # variable "xx" is always 20 times "x"

lattice         fcc 0.8442

# the "region" command uses spacing from "lattice" command, unless "units box" is specified
region          box block 0.0 ${xx} &
                          0.0 40.0  &
                          0.0 30.0

# create simulation box and fill with atoms according to lattice setting
create_box      1 box
create_atoms    1 box

# 3. Force field
pair_style      eam/alloy
pair_coeff      * * Cu_u3.eam Cu

# 4. Settings
neighbor        2.0 bin         # skin distance for neighbour list
neigh_modify    every 1 delay 5 check yes

# 5. Ensemble / dynamics
fix             1 all nvt temp 300 300 0.1   # NVT thermostat

# 6. Output
thermo          100             # print thermo every 100 steps
dump            1 all custom 1000 traj.lammpstrj id type x y z

# 7. Run
timestep        0.001           # 1 fs in metal units
run             100000          # 100 ps
```
