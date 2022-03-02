
import { Application } from "express"
import { Database } from "sqlite"
import { PushSubscription, User } from "../db"
import { subscribeToDeviceConnected, subscribeToDeviceDisconnected, subscribeToLowWaterEvent } from "../mqtt"
import { sendNotification } from "../pushNotification"

export function useSubscription(app: Application, db: Database) {

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

  const getSubscriptions = async (plantId: string) => {
    const usersToNotify = await db.all<Partial<User>>("SELECT id FROM users WHERE plantId = ?", [plantId])
    const userIds = usersToNotify.filter(user => user.id !== null).map(user => user.id)
    const subscriptions = await db.all<PushSubscription>(
      `SELECT * FROM push_subscriptions 
      WHERE userId IN (${userIds.map(() => "?").join(",")})`, userIds
    )
    return subscriptions
  }

  subscribeToLowWaterEvent(async (waterAmount, plantId) => {
    const subscriptions = await getSubscriptions(plantId)
    for (let sub of subscriptions) {
      try {
        console.log(`notifying 'low water' sub id: ${sub.id}, userId: ${sub.userId}`)
        await sendNotification(sub, "🔥 Peppers Thirsty! 🔥", `Peppers need water! Water level is ${Math.round(waterAmount)}%.`)
      } catch (e) {
        console.error("Could not notify", { subId: sub.id, error: e })
      }
    }
  })

  subscribeToDeviceDisconnected(async (plantId) => {
    const subscriptions = await getSubscriptions(plantId)
    for (let sub of subscriptions) {
      try {
        console.log(`notifying 'disconnected' sub id: ${sub.id}, userId: ${sub.userId}`)
        await sendNotification(sub, "🚫📶 Peppers Offline! 🚫📶", `Peppers lost wifi signal! Or maybe they came to life and disconnected self 🤷.`)
      } catch (e) {
        console.error("Could not notify", { subId: sub.id, error: e })
      }
    }
  })

  subscribeToDeviceConnected(async (plantId) => {
    const subscriptions = await getSubscriptions(plantId)
    for (let sub of subscriptions) {
      try {
        console.log(`notifying 'connected' sub id: ${sub.id}, userId: ${sub.userId}`)
        await sendNotification(sub, "✔️📶 Peppers Online! ✔️📶", `Peppers are back online! But be careful... They might download some restricted content 🤦‍♂️.`)
      } catch (e) {
        console.error("Could not notify", { subId: sub.id, error: e })
      }
    }
  })
}