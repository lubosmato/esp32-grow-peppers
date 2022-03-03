import { open, Database } from "sqlite"
import { migrate } from "./migrateDb"
import fs from "fs"

export const dbPath = "db/plants.db"

let database: Database | null = null

async function createDatabase(): Promise<Database> {
  if (!fs.existsSync(dbPath)) {
    return await migrate()
  }
  return await open(dbPath)
}

export default async function getDb() {
  if (!database)
    database = await createDatabase()
  return database
}

export interface User {
  id: number
  name: string
  email: string
  password: string
  plantId: string
  camId: string
}

export interface PushSubscription {
  id: number
  userId: number
  subscription: string
}
