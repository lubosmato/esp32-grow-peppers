require("dotenv").config()

import express, { Request, Response } from "express"
import session from "express-session"
import bodyParser from "body-parser"
import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"

import getDb, { PushSubscription, User } from "./db"
import { hashPassword } from "./password"
import { sendNotification } from "./pushNotification"
import { subscribeToDeviceDisconnected, subscribeToLowWaterEvent } from "./mqtt"

declare module "express-session" {
  interface SessionData {
    user: User | null;
  }
}

if (!process.env.APP_SECRET) throw new Error("Missing env variable APP_SECRET")

const APP_SECRET = process.env.APP_SECRET

async function runServer() {
  const db = await getDb()
  const app = express()

  app.use(session({
    secret: APP_SECRET,
    resave: true,
    saveUninitialized: true,
  }))
  app.use(helmet())
  app.use(bodyParser.json())
  app.use(cors())
  app.use(morgan("combined"))

  // auth middleware:
  app.use((request, response, next) => {
    if (request.path == "/api/v1/auth") {
      next()
      return
    }

    if (!request.session.user) {
      response
        .status(401)
        .json({
          error: "Unauthorized",
        })
      return
    }

    next()
  })

  app.post("/api/v1/auth", async function (request, response) {
    const email = request.body.email as string | undefined
    const password = request.body.password as string | undefined

    if (!email || !password) {
      response
        .status(400)
        .json({
          error: "Missing auth input",
        })
      return
    }

    const passwordHash = hashPassword(password)
    const userData = await db.get<User | undefined>(`SELECT * FROM users WHERE email = ? AND password = ?`, [email, passwordHash])

    if (!userData) {
      response
        .status(404)
        .json({
          error: "User does not exist",
        })
      return
    }

    request.session.user = userData
    response
      .status(200)
      .json({
        user: {
          id: userData.id,
          name: userData.name,
          email: userData.email,
          plantId: userData.plantId,
        }
      })
  })

  app.get("/api/v1/logout", async function (request, response) {
    request.session.user = null
    response
      .status(200)
      .json({
        message: "Signed out"
      })
  })

  app.get("/api/v1/user", async function (request, response) {
    response
      .status(200)
      .json({
        user: {
          id: request.session.user?.id,
          name: request.session.user?.name,
          email: request.session.user?.email,
          plantId: request.session.user?.plantId,
        }
      })
  })

  app.post("/api/v1/subscribe", async function (request, response) {
    const subscription = request.body.subscription ?? null

    if (subscription === null) {
      response
        .status(400)
        .json({
          error: "Missing subscription data",
        })
      return
    }

    const subscriptionJson = JSON.stringify(subscription)

    const result = await db.run(`
      INSERT INTO push_subscriptions (userId, subscription) 
      VALUES (?, ?)`, [request.session.user?.id, subscriptionJson])

    const sub = await db.get<PushSubscription>("SELECT * FROM push_subscriptions WHERE id = ?", [result.lastID])
    await sendNotification(sub, "🌶️ Peppers Grow 🌶️", `Hey! When peppers run out of water you will get similar notification. Have a great day!🙂`)

    response
      .status(200)
      .json({
        message: "Subscribed"
      })
  })

  subscribeToLowWaterEvent(async (waterAmount, plantId) => {
    const usersToNotify = await db.all<Partial<User>>("SELECT id FROM users WHERE plantId = ?", [plantId])
    const userIds = usersToNotify.filter(user => user.id !== null).map(user => user.id)
    const subscriptions = await db.all<PushSubscription>(
      `SELECT * FROM push_subscriptions 
      WHERE userId IN (${userIds.map(() => "?").join(",")})`, userIds
    )
    for (let sub of subscriptions) {
      try {
        console.log(`notifying sub id: ${sub.id}, userId: ${sub.userId}`)
        await sendNotification(sub, "🔥 Peppers Thirsty! 🔥", `Peppers need water! Water level is ${Math.round(waterAmount)}%.`)
      } catch (e) {
        console.error("Could not notify", { subId: sub.id, error: e })
      }
    }
  })

  subscribeToDeviceDisconnected(async (plantId) => {
    const usersToNotify = await db.all<Partial<User>>("SELECT id FROM users WHERE plantId = ?", [plantId])
    const userIds = usersToNotify.filter(user => user.id !== null).map(user => user.id)
    const subscriptions = await db.all<PushSubscription>(
      `SELECT * FROM push_subscriptions 
      WHERE userId IN (${userIds.map(() => "?").join(",")})`, userIds
    )
    for (let sub of subscriptions) {
      try {
        console.log(`notifying sub id: ${sub.id}, userId: ${sub.userId}`)
        await sendNotification(sub, "🚫📶 Peppers Disconnected! 🚫📶", `Peppers lost wifi signal! Or maybe they came to life and disconnected self 🤷.`)
      } catch (e) {
        console.error("Could not notify", { subId: sub.id, error: e })
      }
    }
  })

  const port = 3001
  app.listen(port, () => {
    console.log(`listening on port ${port}`)
  })
}

runServer()
