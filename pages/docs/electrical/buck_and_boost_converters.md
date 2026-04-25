Similar to how transformers in AC circuits are designed to step up and down AC voltage, buck and boost converters are used to step and up and down DC voltage on unregulated circuits.

## Switch Mode Power Conversion

Both buck and boost converters rely on switch mode power conversion meaning they use transistors as a switch to rapidly turn on and off a switch which is used to control the current load through the inductor.

The duty cycle of the rapid on-off switching of the transistor can determine the ratio in voltage drop/boost.

## What is a Buck Converter?

Designed to step down the voltage of an unregulated DC supply to a lower and more stable DC supply, with an increased current.

The design consists of an inductor in series, and a diode plus a capacitor in parallel with the load.

When the transistor is closed, current charges up the inductor and sends power to the load, when open, the charged power of the capacitor and inductor continue to flow through the load.

## What is a Boost Converter?

The design consists of an inductor in series with a diode, and a capacitor in parallel with the load.

When the transistor is closed, current charges up the inductor, but then sends the current directly to ground. Once open, the charged power of the inductor is then released to the load, also charging the capacitor for when the transistor is closed again.
