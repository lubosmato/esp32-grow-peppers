import { writable } from "svelte/store";
import type { Camera, Plant, PureSample } from "./plant";
import { registerWorker, useMe, User } from "./user";

const getMe = useMe()

type WsMessage = ({
  type: "hello"
  data?: any
} | {
  type: "plant"
  data: Plant
} | {
  type: "camera"
  data: Camera
} | {
  type: "history"
  data: PureSample[]
})

let ws: WebSocket | null = null

function startStreamingRealTimeData() {
  if (ws) return

  const url = new URL('/api/v1/ws', window.location.href);
  url.protocol = url.protocol.replace('http', 'ws');

  ws = new WebSocket(url);

  ws.onopen = async () => {
    const helloMessage: WsMessage = { type: "hello" }
    ws.send(JSON.stringify(helloMessage));
  }

  ws.onclose = (e) => {
    setTimeout(() => ws = null, 0)
  }

  ws.onmessage = (event) => {
    try {
      const message: WsMessage = JSON.parse(event.data)

      switch (message.type) {
        case "plant":
          plant.update((p) => {
            return { ...p, ...message.data }
          })
          break;
        case "camera":
          camera.update((cam) => {
            return { ...cam, ...message.data }
          })
          break;
        case "history":
          history.set(message.data)
          break;
      }
    } catch (e) {
      console.warn("error parsing WS message", e)
    }
  }
}

function stopStreamingRealTimeData() {
  if (!ws) return

  ws.close()
  ws = null
}

export const user = writable<User | null>(null, (set) => {
  getMe()
    .then(set)
    .then(registerWorker)
    .catch(() => { })
})

user.subscribe((u) => {
  if (u !== null)
    startStreamingRealTimeData()
  else
    stopStreamingRealTimeData()
})

export const plant = writable<Plant>({ id: "", isOnline: null, light: null, temperature: null, water: null })
export const camera = writable<Camera>({ id: "", imageDate: null, isFlashlightEnabled: null, isOnline: null })
export const history = writable<PureSample[]>([])
