import { createHmac } from "crypto"

if (!process.env.APP_SECRET) throw new Error("Missing env variable APP_SECRET")

export function hashPassword(password: string) {
  const key = process.env.APP_SECRET ?? "dummy-secret"
  return createHmac("sha256", key).update(password).digest("base64")
}

export interface Accounts {
  [username: string]: string
}

const accounts: Accounts = {}

for (const [username, password] of Object.entries<string>(JSON.parse(process.env.MQTT_ACCOUNTS ?? "{}"))) {
  accounts[username] = hashPassword(password)
}

export default accounts
