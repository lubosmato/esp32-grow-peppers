import MQTT from "async-mqtt"

const MQTT_URL = process.env.MQTT_URL ?? ""
const MQTT_USER = process.env.MQTT_USER ?? undefined
const MQTT_PASS = process.env.MQTT_PASS ?? undefined
const WATER_AMOUNT_THRESH = process.env.WATER_AMOUNT_THRESH ?? 50.0

const client = MQTT.connect(MQTT_URL, {
  username: MQTT_USER,
  password: MQTT_PASS,
})

export async function triggerCamera(camId: string) {
  await client.publish(`plantsCam/${camId}/camera/trigger`, "")
}

export async function setFlashlight(camId: string, value: boolean) {
  await client.publish(`plantsCam/${camId}/camera/flashlight`, value.toString(), { retain: true })
}

export async function setLight(plantId: string, value: number) {
  await client.publish(`plants/${plantId}/light/value`, value.toString(), { retain: true })
}

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

export function subscribeToDeviceConnected(action: (plantId: string) => void) {
  client.on("message", async (topic, payload) => {
    const match = topic.match(/plants\/(.*?)\/connected/)
    if (!match) return

    const plantId = match[1] ?? null
    if (!plantId) return

    action(plantId)
  })

  client.subscribe("plants/+/connected", { qos: 0 })
}

export function subscribeToImage(action: (camId: string, image: Buffer, time: Date) => void) {
  client.on("message", async (topic, payload) => {
    const match = topic.match(/plantsCam\/(.*?)\/image\/data/)
    if (!match) return

    const camId = match[1] ?? null
    if (!camId) return

    const image = payload
    const time = new Date()
    action(camId, image, time)
  })

  client.subscribe("plantsCam/+/image/data", { qos: 0 })
}

export enum PlantTopic {
  Water = "water/amount",
  Temperature = "temp/0/celsius",
  Light = "light/value",
  Disconnected = "last/will",
  Connected = "connected",
}

export function subscribeToPlant(action: (plantId: string, topic: PlantTopic, value: string) => void) {
  client.on("message", async (topic, payload) => {
    const match = topic.match(/plants\/(.*?)\/(.*)/)
    if (!match) return
    const plantId = match[1] ?? null
    const restOfTopic = match[2] ?? null

    action(plantId, restOfTopic as PlantTopic, payload.toString())
  })

  Object.values(PlantTopic).forEach((topic) => {
    client.subscribe(`plants/+/${topic}`, { qos: 0 })
  })
}

export enum CamTopic {
  Disconnected = "last/will",
  Connected = "connected",
  ImageDateTime = "image/datetime",
  Flashlight = "camera/flashlight",
}

export function subscribeToCam(action: (camId: string, topic: CamTopic, value: string) => void) {
  client.on("message", async (topic, payload) => {
    const match = topic.match(/plantsCam\/(.*?)\/(.*)/)
    if (!match) return
    const camId = match[1] ?? null
    const restOfTopic = match[2] ?? null

    action(camId, restOfTopic as CamTopic, payload.toString())
  })

  Object.values(CamTopic).forEach((topic) => {
    client.subscribe(`plantsCam/+/${topic}`, { qos: 0 })
  })
}
