require("dotenv").config()

if (!process.env.APP_SECRET) throw new Error("Missing env variable APP_SECRET")

import fs from "fs"
import createAedes from "aedes"
import accounts, { hashPassword } from "./accounts"
import logger from "./log"
import tls from "tls"
import memory from 'aedes-persistence'

const aedes = createAedes({
  persistence: memory(),
  authenticate: (client, username, password, callback) => {
    const isSuccess = accounts[username] && accounts[username] === hashPassword(password.toString("utf8"))
    if (!isSuccess) {
      log.warn("Authentication error for user", `'${username}'`, "client id:", `'${client.id}'`, "client version:", client.version)
      callback(null, false)
      return
    }

    log.info("Client", `'${username}'`, "authenticated", "client id:", `'${client.id}'`, "client version:", client.version)
    callback(null, true)
  }
})

const log = logger("mqtt")

const mqttsPort = 8883

const options = {
  key: fs.readFileSync("./certs/live/grow.lubosmatejcik.cz/privkey.pem"),
  cert: fs.readFileSync("./certs/live/grow.lubosmatejcik.cz/fullchain.pem")
};
const mqttServer = tls.createServer(options, aedes.handle)

mqttServer.listen(mqttsPort, function () {
  log.info("Aedes MQTTS listening on port:", mqttsPort)
})

aedes.on("subscribe", function (subscriptions, client) {
  log.info("Client", `'${(client ? client.id : client)}'`, "subscribed to topics:", subscriptions.map(s => s.topic).join("\n"), "from broker", `'${aedes.id}'`)
})

aedes.on("unsubscribe", function (subscriptions, client) {
  log.info("Client", `'${(client ? client.id : client)}'`, "unsubscribed to topics:", subscriptions.join("\n"), "from broker", `'${aedes.id}'`)
})

aedes.on("client", function (client) {
  log.info("Client Connected:", `'${(client ? client.id : client)}'`, "to broker", `'${aedes.id}'`)
})

aedes.on("clientDisconnect", function (client) {
  log.info("Client Disconnected:", `'${(client ? client.id : client)}'`, "to broker", `'${aedes.id}'`)
})

aedes.on("publish", async function (packet, client) {
  let data = packet.payload.slice(0, 16).toString()
  if (packet.payload.length > 16) data += "..."
  log.info("Client", (client ? client.id : "BROKER_" + aedes.id), "has published", data, "on", packet.topic, "to broker", `'${aedes.id}'`)
})
