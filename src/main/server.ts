//MAIN layer é a camada onde é criada a instância de todas as outras camadas
import express from "express"
const app = express()

app.listen(3333, () => console.log("Server running at http://localhost:3333"))