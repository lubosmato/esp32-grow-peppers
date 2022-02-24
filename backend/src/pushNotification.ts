import webpush from "web-push"
import getDb, { PushSubscription } from "./db";

const vapidKeys = {
  publicKey: process.env.VAPID_PUBLIC_KEY ?? "",
  privateKey: process.env.VAPID_PRIVATE_KEY ?? "",
}

webpush.setVapidDetails(
  `mailto:${process.env.VAPID_EMAIL ?? ""}`,
  vapidKeys.publicKey,
  vapidKeys.privateKey
)

export async function sendNotification(sub: PushSubscription, title: string, body: string) {
  const subscription = JSON.parse(sub.subscription)
  const dataToSend = JSON.stringify({ title, body })

  try {
    await webpush.sendNotification(subscription, dataToSend)
  } catch (err) {
    console.log(`subscription ${sub.id} is broken (${err}), deleting`)
    const db = await getDb()
    await db.run(`DELETE FROM push_subscriptions WHERE id = ?`, [sub.id])
  }
}
