import mqtt from "async-mqtt"

const sendSomeValues = async () => {
  console.log("Connecting to MQTT...")
  const client = await mqtt.connectAsync("mqtt://localhost:1883")

  if (!client.connected || client.disconnected) throw new Error("Could not connect to MQTT server")
  
  console.log("Connected!")

  await client.publish("plants/123456/light", "12", {retain: true})
  await client.publish("plants/123456/water", "75", {retain: true})
  await client.publish("plants/123456/fan/0/power", "100", {retain: true})
  await client.publish("plants/123456/fan/1/power", "0", {retain: true})
  await client.publish("plants/123456/temp/0/celsius", "24.7", {retain: true})
  await client.publish("plants/123456/temp/1/celsius", "12.7", {retain: true})

  await client.end()

  console.log("Done!")
  process.exit(0)
}

sendSomeValues()
