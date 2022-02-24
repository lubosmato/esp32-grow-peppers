import { createHmac } from "crypto"

export function hashPassword(password: string) {
  const key = process.env.APP_SECRET ?? "dummy-secret"
  return createHmac("sha256", key).update(password).digest("base64")
}
