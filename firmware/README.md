# FW for main unit

Controls light and measures sensors to monitor plant health.

## API

MQTT API is used. The device uses a unique part of MAC address as an identifier in topics `plants/{uniqueId}/`. 

Here is a list of topics:

### Input values
- `plants/+/light/value`: `retained`, also output, payload type `number`, range 0-100. Percentage of light.
- `plants/+/fan/0/value`: payload type `number`, range 0-100. Percentage of fan 0.
- `plants/+/fan/1/value`: payload type `number`, range 0-100. Percentage of fan 1.
- `plants/+/fan/1/schedule`: payload type `string`, format `hh:mm:value,...`. Schedule for fan control. At hour/minute will be used given value. Eg. `08:00:100,18:10:50` will set fan to 100% at 8:00 and to 50% at 18:10.
- `plants/+/light/schedule`: payload type `string`, format `hh:mm:value,...`. Schedule for light control. At hour/minute will be used given value. Eg. `08:00:100,18:10:50` will set light to 100% at 8:00 and to 50% at 18:10.
- `plants/+/water/calibration/high`: payload type `number`, range -inf to inf. What voltage corresponds to 100% of water. Water amount is calculated with linear function `water = voltage * k + q` where `k` and `q` are found based on `calibration/high` and `calibration/low`.
- `plants/+/water/calibration/low`: payload type `number`, range -inf to inf. What voltage corresponds to 0% of water. Water amount is calculated with linear function `water = voltage * k + q` where `k` and `q` are found based on `calibration/high` and `calibration/low`.

### Output values
- `plants/+/water/amount`: `retained`, payload type `number`, range 0-100. Percentage of water.
- `plants/+/water/voltage`: `retained`, payload type `number`, range 0-2.5. Raw voltage of water sensor.
- `plants/+/temp/0/celsius`: `retained`
- `plants/+/temp/1/celsius`: `retained`
- `plants/+/info/freeHeap`
- `plants/+/info/totalHeap`
- `plants/+/info/uptime`: in microseconds
- `plants/+/info/datetime`: in ISO datetime string
- `plants/+/last/will`: `Bye` value when disconnected
- `plants/+/connected`: `true` value when connected

Don't forget about submodules (as always :-))

```bash
git submodule update --init --recursive
```
