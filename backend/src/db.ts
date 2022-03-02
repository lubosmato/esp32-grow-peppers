import { open, Database } from "sqlite"

let database: Database | null = null

async function createDatabase() {
  return await open("db/plants.db")
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
