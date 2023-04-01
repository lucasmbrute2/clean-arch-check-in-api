//MAIN layer é a camada onde é criada a instância de todas as outras camadas
import express from "express"
import setupMiddlewares from "../config/middlewares"
import setupRoutes from "../config/routes"

const app = express()
setupMiddlewares(app)
setupRoutes(app)

export default app