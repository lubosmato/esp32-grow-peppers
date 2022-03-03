import { createHmac } from "crypto"

if (!process.env.APP_SECRET) throw new Error("Missing env variable APP_SECRET")

export function hashPassword(password: string) {
  const key = process.env.APP_SECRET ?? "dummy-secret"
  return createHmac("sha256", key).update(password).digest("base64")
}
