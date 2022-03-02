
import { Application } from "express"
import { subscribeToImage, triggerCamera } from "../mqtt"

export function useCamera(app: Application) {
  const imageCache: Map<string, [Buffer, Date]> = new Map()

  app.get("/api/v1/plants/camera", async function (request, response) {
    const camId = request.session.user?.camId
    if (!camId) {
      response.status(404).end()
      return
    }

    const [imageData, time] = imageCache.get(camId) ?? [null, null]
    if (!imageData) {
      response.status(404).end()
      return
    }

    response
      .status(200)
      .contentType("image/jpeg")
      .end(Buffer.from(imageData))
  })

  app.post("/api/v1/plants/camera", async function (request, response) {
    const camId = request.session.user?.camId
    if (!camId) {
      response.status(404).end()
      return
    }

    try {
      await triggerCamera(camId)
      response
        .status(200)
        .json({
          message: "Camera triggered"
        })
    } catch {
      response
        .status(404)
        .json({
          error: "Plants cloud is down :(",
        })
    }
  })

  subscribeToImage(async (camId, image, time) => {
    imageCache.set(camId, [image, time])
  })
}