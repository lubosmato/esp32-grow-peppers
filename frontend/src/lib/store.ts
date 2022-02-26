import { writable } from "svelte/store";
import { registerWorker, useMe } from "./user";

export interface User {
  id: number
  name: string
  email: string
  plantId: string
}

const getMe = useMe()
let me = null

try {
  me = await getMe()
  registerWorker()
} catch { }

export const user = writable<User | null>(me)
