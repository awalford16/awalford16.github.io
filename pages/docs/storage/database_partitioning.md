## Sharding

Database sharding involves splitting data across multiple machines to help with scaling to large amounts of data. However, there needs to be a way of determining which machine the data lives on. It is possible to use multiple partition schemes.

### Vertical Partiioning

This involves splitting the data up based on features/categories such as user profiles and projects etc. However, as the tables grow in size, there may be requirement to partition the data further.

### Key-Based Partitioning

This involves using a key within the data which helps identify where the data is stored. This could be a hash represented by the server number. However, this can result in being tied to a fixed number of servers. So when data is required to scale out, the data will need to be reallocated.

### Directory-Based Partitioning

This involves a lookup table for where the data can be found. This lookup table can be a single point of failure and be a potential bottleneck.