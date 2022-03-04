import expressWs from "express-ws"
import EventEmitter from "events"
import { RequestHandler, Application } from "express"
import { User } from "../db"
import { Camera, Plant } from "./devices"
import { getSamples, PureSample } from "../chartData"
import { Database } from "sqlite"

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

// TODO this is starting to get ugly, refactor!
export default function useWs(app: Application, sessionParser: RequestHandler, wsEmitter: EventEmitter, db: Database) {
  const wsApp = expressWs(app)

  wsApp.app.ws("/api/v1/ws", async (ws, request) => {
    ws.on("message", async (data) => {
      const user = await new Promise<User | null>((resolve) => {
        sessionParser(request, {} as any, () => {
          resolve(request.session?.user ?? null)
        })
      })

      if (!user) {
        return
      }

      try {
        const jsonData: WsMessage = JSON.parse(data.toString())

        switch (jsonData.type) {
          case "hello":
            const sendHistory = async (plantId: string) => {
              const historyMessage: WsMessage = {
                type: "history",
                data: await getSamples(db, plantId)
              }
              ws.send(JSON.stringify(historyMessage))
            }

            // subscribe to plant info on websocket
            // NOTE I do realize that this is absolutely not a scalable solution
            const sendPlantInfo = (plant: Plant) => {
              if (plant.id !== user.plantId) return

              const info: WsMessage = {
                type: "plant",
                data: plant
              }
              ws.send(JSON.stringify(info))
            }

            const sendCamInfo = (camera: Camera) => {
              if (camera.id !== user.camId) return

              const info: WsMessage = {
                type: "camera",
                data: camera
              }
              ws.send(JSON.stringify(info))
            }

            await sendHistory(user.plantId)

            wsEmitter.addListener("plant", sendPlantInfo)
            wsEmitter.addListener("camera", sendCamInfo)
            wsEmitter.emit("connect", user.plantId, user.camId)

            const sendHistoryInterval = setInterval(async () => {
              await sendHistory(user.plantId)
            }, 10 * 60 * 1000) // 1 minute

            ws.on("close", () => {
              wsEmitter.removeListener("plant", sendPlantInfo)
              wsEmitter.removeListener("camera", sendCamInfo)
              clearInterval(sendHistoryInterval)
            })
            break;
        }
      } catch (e) {
        console.warn("bad WS message", e)
      }
    })
  })
}
