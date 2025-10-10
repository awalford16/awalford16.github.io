## What is Forward Error Correction?

FEC improves bit error rate. Sometimes cyclic redundancy checks or checksums are done to check for errors in transmitted data and determine if it needs to be re-transmitted. FEC removes the need for re-transmitting the data by correcting the data in-place.

## How does it work?

When payloads are transferred between network devices, bits are added to the payload to help reduce errors within the payload.

Hamming distance checks the distance between 2 bit streams based on how many bits are incorrect.

FEC creates an error correcting code (ECC), which are codes stored in a dictionary on both sides of the connection. The code words are 5 bits (e.g 10101) map to a 2-bit sequence (e.g. 01, 10, 11). Each 2 bits in the transfer data is mapped to a code word, and the final longer string is then what gets transferred between the devices.

On receipt of the code words, the receiver checks the code words against the dictionary. If the receivers dictionary contains the code word, then it can be assumed that there were no errors in the transfer. However, if the dictionary does not contain the code word, it will try to identify the most similar code word in the dictionary using the hamming distance. Having multiple bit errors is less likely than a single bit error, so the hamming distance helps determine the most likely intended code word.

If the hamming distance determines it could be multiple possible ECCs from the dictionary, the receiver will request that the specific portion of the data is resent. To make a system more robust, code words can be made longer to reduce the likelihood of retransmissions or incorrect decoding.

One of the main tradeoffs of FEC is an increased latency due to the increased payload size. There is also additional complexity, since devices on both sides of the connection, including the transceivers, need to support FEC.

## FEC Options

| RS (Reed-Solomon)                                                                           | FC (Firecode)                                                                  |
| ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| Stronger correction but more overhead and latency (Good for DAC cables and long fibre runs) | Lighter correction with lower overhead and latency (For 25GB short cable runs) |

```
interface Eth X/X
fec auto    # Negotiate FEC
fec rs      # Configure Reed-Solomon
fec fc      # Configure Firecode
fec off     # No error correction
```
