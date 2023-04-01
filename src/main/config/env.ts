import { config } from "dotenv"
config()
const mongo_url = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.gvnhc8c.mongodb.net/?retryWrites=true&w=majority`

export default {
  mongoUrl: process.env.MONGO_URL || mongo_url,
  port: process.env.PORT
}