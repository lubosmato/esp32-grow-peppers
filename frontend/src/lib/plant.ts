import { camera, plant } from "./store";

export interface PureSample {
  time: number
  value: number
  key: "water" | "temp"
}

export interface Plant {
  id: string
  temperature: number | null
  water: number | null
  fan: number | null
  light: number | null
  isOnline: boolean | null
}

export interface Camera {
  id: string
  isOnline: boolean | null
  imageDate: string | null
  isFlashlightEnabled: boolean | null
}

export function usePlant() {
  return {
    async setFan(value: number) {
      const response = await fetch("/api/v1/plants/fan", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ value }),
      })
      const responseJson = await response.json()
      if (response.status !== 200) throw new Error(responseJson.error)

      plant.update((p) => {
        return { ...p, fan: value }
      })
    },

    async setLight(value: number) {
      const response = await fetch("/api/v1/plants/light", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ value }),
      })
      const responseJson = await response.json()
      if (response.status !== 200) throw new Error(responseJson.error)

      plant.update((p) => {
        return { ...p, light: value }
      })
    },

    async setFlashlight(value: boolean) {
      const response = await fetch("/api/v1/plants/camera/flashlight", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ value }),
      })
      const responseJson = await response.json()
      if (response.status !== 200) throw new Error(responseJson.error)

      camera.update((c) => {
        return { ...c, isFlashlightEnabled: value }
      })
    }
  }
}
