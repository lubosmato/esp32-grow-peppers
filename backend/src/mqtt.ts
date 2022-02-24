import MQTT from "async-mqtt"

const MQTT_URL = process.env.MQTT_URL ?? ""
const MQTT_USER = process.env.MQTT_USER ?? undefined
const MQTT_PASS = process.env.MQTT_PASS ?? undefined
const WATER_AMOUNT_THRESH = process.env.WATER_AMOUNT_THRESH ?? 50.0

const client = MQTT.connect(MQTT_URL, {
  username: MQTT_USER,
  password: MQTT_PASS,
})

export function subscribeToLowWaterEvent(action: (waterAmount: number, plantId: string) => void) {
  const prevWaterAmounts: Map<string, number> = new Map()

  client.on("message", async (topic, payload) => {
    const match = topic.match(/plants\/(.*?)\/water/)
    if (!match) return

    const plantId = match[1] ?? null
    if (!plantId) return

    const waterAmount = parseFloat(payload.toString())
    const prevWaterAmount = prevWaterAmounts.get(plantId) ?? null

    let shouldSendNotification = false

    if (prevWaterAmount === null && waterAmount < WATER_AMOUNT_THRESH) {
      shouldSendNotification = true
    }

    if (
      prevWaterAmount !== null &&
      prevWaterAmount >= WATER_AMOUNT_THRESH &&
      waterAmount < WATER_AMOUNT_THRESH
    ) {
      shouldSendNotification = true
    }

    if (shouldSendNotification) {
      action(waterAmount, plantId)
    }

    prevWaterAmounts.set(plantId, waterAmount)
  })

  client.subscribe("plants/+/water/amount", { qos: 0 })
}

export function subscribeToDeviceDisconnected(action: (plantId: string) => void) {
  client.on("message", async (topic, payload) => {
    const match = topic.match(/plants\/(.*?)\/last\/will/)
    if (!match) return

    const plantId = match[1] ?? null
    if (!plantId) return

    action(plantId)
  })

  client.subscribe("plants/+/last/will", { qos: 0 })
}
