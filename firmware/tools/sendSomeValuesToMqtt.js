import mqtt from "async-mqtt"

const sendSomeValues = async () => {
  console.log("Connecting to MQTT...")
  const client = await mqtt.connectAsync("mqtts://drawboard.lubosmatejcik.cz:8883", {
    username: "esp32-mqtt",
    password: "esp32-pass",
  })

  if (!client.connected || client.disconnected) throw new Error("Could not connect to MQTT server")
  
  console.log("Connected!")
  
  await Promise.all([
    // input API:
    client.publish("plants/6037cc/light/value", "80", {retain: true}),
    client.publish("plants/6037cc/fan/0/value", "100", {retain: true}),
    client.publish("plants/6037cc/fan/1/value", "0", {retain: true}),
    client.publish("plants/6037cc/light/schedule", "13:11:100,13:12:0", {retain: true}),
    
    client.publish("plants/6037cc/water/calibration/high", "1.2", {retain: true}),
    client.publish("plants/6037cc/water/calibration/low", "1.6", {retain: true}),

    // output API:
    /*
    client.publish("plants/123456/water/amount", "75", {retain: true}),
    client.publish("plants/123456/water/voltage", "75", {retain: true}),
    client.publish("plants/123456/temp/0/celsius", "24.7", {retain: true}),
    client.publish("plants/123456/temp/1/celsius", "12.7", {retain: true}),
    client.publish("plants/123456/info/freeHeap", "123456", {retain: true}),
    client.publish("plants/123456/info/totalHeap", "123456", {retain: true}),
    client.publish("plants/123456/info/uptime", "42123456", {retain: true}),
    client.publish("plants/123456/info/datetime", "2022-02-23T12:57:31Z", {retain: true}),
    client.publish("plants/123456/last/will", "Bye bye", {retain: true}),
    */
  ])

  await client.end()

  console.log("Done!")
  process.exit(0)
}

sendSomeValues()
