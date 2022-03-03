require("dotenv").config()

import { open } from "sqlite"
import { dbPath } from "./db"
import { hashPassword } from "./password"

export async function migrate() {
  const db = await open(dbPath)

  try {
    await db.run(`DROP TABLE users`)
    await db.run(`DROP TABLE push_subscriptions`)
    await db.run(`DROP TABLE chart_data`)
  } catch { }

  await db.run(`CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT UNIQUE,
    password TEXT, 
    plantId TEXT,
    camId TEXT,
    CONSTRAINT email_unique UNIQUE (email)
  )`)

  await db.run(`CREATE TABLE push_subscriptions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER NOT NULL,
    subscription TEXT,
    FOREIGN KEY (userId) REFERENCES users (id)
  )`)

  await db.run(`CREATE TABLE chart_data (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    plantId INTEGER NOT NULL,
    key VARCHAR(32) NOT NULL,
    time INTEGER NOT NULL,
    value DOUBLE NOT NULL    
  )`)

  await db.run(`CREATE INDEX idx_chart_data_plantId ON chart_data (plantId)`)

  const [name, email, password, plantId, camId] =
    process.env.DEFAULT_USER?.split(";") ?? ["Default User", "dummy@dummy.com", "12345678", "000000", "000000"]

  await db.run(`
    INSERT INTO users (name, email, password, plantId, camId)
    VALUES (?, ?, ?, ?, ?)
  `, [name, email, hashPassword(password), plantId, camId])

  return db
}
