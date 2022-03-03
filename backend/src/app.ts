require("dotenv").config()

import EventEmitter from "events"
import express from "express"
import session from "express-session"
import bodyParser from "body-parser"
import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"

import getDb, { User } from "./db"
import { useCamera } from "./api/camera"
import { useUser } from "./api/user"
import { useSubscription } from "./api/subscription"
import useWs from "./api/ws"
import { routeMqttToWebsocket, useDevices } from "./api/devices"
import { useDataStoring } from "./chartData"

declare module "express-session" {
  interface SessionData {
    user: User | null;
  }
}

async function runServer() {
  const db = await getDb()
  const sessionParser = session({
    secret: process.env.APP_SECRET,
    resave: true,
    saveUninitialized: true,
  })

  const app = express()

  app.use(helmet())
  app.use(bodyParser.json())
  app.use(cors())
  if (process.env?.DEV)
    app.use(morgan("combined"))
  app.use(sessionParser)

  const wsEmitter = new EventEmitter()
  useWs(app, sessionParser, wsEmitter, db)
  useUser(app, db)
  useCamera(app)
  useSubscription(app, db)
  useDevices(app)
  useDataStoring(wsEmitter, db)

  routeMqttToWebsocket(wsEmitter)

  const port = 8080
  app.listen(port, () => {
    console.log(`listening on port ${port}`)
  })
}

runServer()
