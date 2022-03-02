
import EventEmitter from "events"
import { Application } from "express"
import throttle from "lodash.throttle"
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

// NOTE I do realize that this is absolutely not a scalable solution
export function routeMqttToWebsocket(wsEmitter: EventEmitter) {
  const plantCache: Map<string, Plant> = new Map()
  const cameraCache: Map<string, Camera> = new Map()

  const emitWsPlant = throttle((plant: Plant) => wsEmitter.emit("plant", plant), 1000)
  const emitWsCamera = throttle((camera: Camera) => wsEmitter.emit("camera", camera), 1000)

  subscribeToPlant((plantId, topic, value) => {
    let plant = plantCache.get(plantId)
    if (!plant) plant = { id: plantId, temperature: null, water: null, light: null, isOnline: null }

    if (topic !== PlantTopic.Disconnected) plant.isOnline = true

    if (topic === PlantTopic.Connected) plant.isOnline = true
    if (topic === PlantTopic.Disconnected) plant.isOnline = false
    if (topic === PlantTopic.Light) plant.light = parseInt(value)
    if (topic === PlantTopic.Temperature) plant.temperature = parseFloat(value)
    if (topic === PlantTopic.Water) plant.water = parseInt(value)

    plantCache.set(plantId, plant)
    emitWsPlant(plant)
  })

  subscribeToCam((camId, topic, value) => {
    let cam = cameraCache.get(camId)
    if (!cam) cam = { id: camId, isOnline: null, imageDate: null, isFlashlightEnabled: null }

    if (topic !== CamTopic.Disconnected) cam.isOnline = true

    if (topic === CamTopic.Connected) cam.isOnline = true
    if (topic === CamTopic.Disconnected) cam.isOnline = false
    if (topic === CamTopic.Flashlight) cam.isFlashlightEnabled = value === "true"
    if (topic === CamTopic.ImageDateTime) cam.imageDate = new Date(value)

    cameraCache.set(camId, cam)
    emitWsCamera(cam)
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