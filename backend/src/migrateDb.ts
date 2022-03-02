require("dotenv").config()

import getDb from "./db"
import { hashPassword } from "./password"

async function migrate() {
  const db = await getDb()

  try {
    await db.run(`DROP TABLE users`)
    await db.run(`DROP TABLE push_subscriptions`)
    await db.run(`DROP TABLE chart_data`)
  } catch {}

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

  await db.run(`
    INSERT INTO users 
      (name, email, password, plantId, camId)
    VALUES 
      ('Luboš Matejčík', 'lubos.matejcik@gmail.com', '${hashPassword("12345678")}', '0d17a0', '30ab60')
  `)

  /*
  const examplePushSubscription = {
    endpoint: "https://fcm.googleapis.com/fcm/send/coCl7FoHm_k:APA91bFS-VVMsR_DVisIB1gdSRWJLErS4q_ey7bMHgAxKZrYnBmV9QEKFCV8EoecjAIIGMBKNMJVYADrQRvFWvTK94oTQpJ31rI_MDOHKglGCcyluAGoqoCXPeIt49dYPIUJ0NtN8amg",
    expirationTime: null,
    keys: {
      p256dh: "BJeNqXWAWTzXWpNmrw4qj2rV5JSF1f9c91izQkRX6WXPrup5GxhqSb5QilIlnqvM9aBUbiymYxm2osjlnuzPN4I",
      auth: "pMUzSGFvvteOBlq1rGmyrQ"
    }
  }

  await db.run(`
    INSERT INTO push_subscriptions 
      (userId, subscription)
    VALUES 
      ('1', '${JSON.stringify(examplePushSubscription)}')
  `)
  */

  process.exit(0)
}

migrate()
