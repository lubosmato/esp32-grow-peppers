import EventEmitter from "events"
import { Application } from "express"
import { CamTopic, PlantTopic, setFlashlight, setLight, subscribeToCam, subscribeToPlant } from "../mqtt"

export interface Plant {
  id: string
  temperature: number | null
  water: number | null
  light: number | null
  isOnline: boolean | null
}

export interface Camera {
  id: string
  isOnline: boolean | null
  imageDate: Date | null
  isFlashlightEnabled: boolean | null
}

function compareAndSet<T, K extends keyof T>(obj: T, key: K, newValue: T[K]) {
  const hasChanged = obj[key] !== newValue
  obj[key] = newValue
  return hasChanged
}

// NOTE I do realize that this is absolutely not a scalable solution
export function routeMqttToWebsocket(wsEmitter: EventEmitter) {
  const plantCache: Map<string, Plant> = new Map()
  const cameraCache: Map<string, Camera> = new Map()

  const emitWsPlant = (plant: Plant) => wsEmitter.emit("plant", plant)
  const emitWsCamera = (camera: Camera) => wsEmitter.emit("camera", camera)

  wsEmitter.addListener("connect", (plantId: string, camId: string) => {
    let plant = plantCache.get(plantId)
    let cam = cameraCache.get(camId)

    if (plant) {
      emitWsPlant(plant)
    }
    if (cam) {
      emitWsCamera(cam)
    }
  })

  subscribeToPlant((plantId, topic, value) => {
    let plant = plantCache.get(plantId)
    if (!plant) plant = { id: plantId, temperature: null, water: null, light: null, isOnline: null }

    let hasChanged = false

    if (topic !== PlantTopic.Disconnected) hasChanged ||= compareAndSet(plant, "isOnline", true)

    if (topic === PlantTopic.Connected) hasChanged ||= compareAndSet(plant, "isOnline", true)
    if (topic === PlantTopic.Disconnected) hasChanged ||= compareAndSet(plant, "isOnline", false)
    if (topic === PlantTopic.Light) hasChanged ||= compareAndSet(plant, "light", parseInt(value))
    if (topic === PlantTopic.Temperature) hasChanged ||= compareAndSet(plant, "temperature", parseFloat(value))
    if (topic === PlantTopic.Water) hasChanged ||= compareAndSet(plant, "water", parseInt(value))

    plantCache.set(plantId, plant)
    if (hasChanged) {
      emitWsPlant(plant)
    }
  })

  subscribeToCam((camId, topic, value) => {
    let cam = cameraCache.get(camId)
    if (!cam) cam = { id: camId, isOnline: null, imageDate: null, isFlashlightEnabled: null }

    let hasChanged = false

    if (topic !== CamTopic.Disconnected) hasChanged ||= compareAndSet(cam, "isOnline", true)

    if (topic === CamTopic.Connected) hasChanged ||= compareAndSet(cam, "isOnline", true)
    if (topic === CamTopic.Disconnected) hasChanged ||= compareAndSet(cam, "isOnline", false)
    if (topic === CamTopic.Flashlight) hasChanged ||= compareAndSet(cam, "isFlashlightEnabled", value === "true")
    if (topic === CamTopic.ImageDateTime) hasChanged ||= compareAndSet(cam, "imageDate", new Date(value))

    cameraCache.set(camId, cam)
    if (hasChanged) {
      emitWsCamera(cam)
    }
  })
}

export function useDevices(app: Application) {

  app.post("/api/v1/plants/light", async function (request, response) {
    const value: number | null = request.body.value ?? null

    if (value === null) {
      response
        .status(400)
        .json({
          error: "Missing value",
        })
      return
    }

    if (request.session.user) {
      setLight(request.session.user.plantId, value)
    }

    response
      .status(200)
      .json({
        message: "Light value set"
      })
  })

  app.post("/api/v1/plants/camera/flashlight", async function (request, response) {
    const value: boolean | null = request.body.value ?? null

    if (value === null) {
      response
        .status(400)
        .json({
          error: "Missing value",
        })
      return
    }

    if (request.session.user) {
      setFlashlight(request.session.user.camId, value)
    }

    response
      .status(200)
      .json({
        message: "Flashlight set"
      })
  })
}