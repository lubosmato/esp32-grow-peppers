import { Application } from "express"
import { hashPassword } from "../password"
import { Database } from "sqlite"
import { User } from "../db"

export function useUser(app: Application, db: Database) {
  // auth middleware:
  app.use((request, response, next) => {
    if (request.path == "/api/v1/auth") {
      next()
      return
    }

    if (!request.session.user) {
      response
        .status(401)
        .json({
          error: "Unauthorized",
        })
      return
    }

    next()
  })

  app.post("/api/v1/auth", async function (request, response) {
    const email = request.body.email as string | undefined
    const password = request.body.password as string | undefined

    if (!email || !password) {
      response
        .status(400)
        .json({
          error: "Missing auth input",
        })
      return
    }

    const passwordHash = hashPassword(password)
    const userData = await db.get<User | undefined>(`SELECT * FROM users WHERE email = ? AND password = ?`, [email, passwordHash])

    if (!userData) {
      response
        .status(404)
        .json({
          error: "User does not exist",
        })
      return
    }

    request.session.user = userData
    response
      .status(200)
      .json({
        user: {
          id: userData.id,
          name: userData.name,
          email: userData.email,
          plantId: userData.plantId,
          camId: userData.camId,
        }
      })
  })

  app.get("/api/v1/logout", async function (request, response) {
    request.session.user = null
    response
      .status(200)
      .json({
        message: "Signed out"
      })
  })

  app.get("/api/v1/user", async function (request, response) {
    response
      .status(200)
      .json({
        user: {
          id: request.session.user?.id,
          name: request.session.user?.name,
          email: request.session.user?.email,
          plantId: request.session.user?.plantId,
          camId: request.session.user?.camId,
        }
      })
  })
}