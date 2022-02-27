# FW for camera module

Periodically sends pictures to MQTT.

## API

MQTT API is used. The device uses a unique part of MAC address as an identifier in topics `plantsCam/{uniqueId}/`. 

Here is a list of topics:

### Input values
- `plantsCam/+/camera/trigger`: Send anything to trigger camera.
- `plantsCam/+/camera/flashlight`: payload type `bool`, enable/disable flashlight. Persistent value stored in NVS.

### Output values
- `plantsCam/+/image/data`: `retained`, payload type `bytes`. JPEG image data.
- `plantsCam/+/image/datetime`: `retained`, ISO datetime string
- `plantsCam/+/info/freeHeap`
- `plantsCam/+/info/totalHeap`
- `plantsCam/+/info/uptime`: in microseconds
- `plantsCam/+/last/will`: `Bye` value when disconnected
- `plantsCam/+/connected`: `true` value when connected

Don't forget about submodules (as always :-))

```bash
git submodule update --init --recursive
```
