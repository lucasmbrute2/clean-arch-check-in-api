//MAIN layer é a camada onde é criada a instância de todas as outras camadas
import express from "express"
import setupMiddlewares from "../config/middlewares"

const app = express()
setupMiddlewares(app)

export default app