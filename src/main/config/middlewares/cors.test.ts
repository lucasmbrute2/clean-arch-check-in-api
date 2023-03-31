import request from "supertest"
import app from "../app"

describe("CORS Middleware", () => {
  test("Should enable CORS", async () => {
    app.post('/test_cors', (req, res) => {
      return res.send()
    }) // create a fake route to test

    await request(app)
      .get('/test_cors')
      .expect('access-control-allow-origin', '*')
      .expect('access-control-allow-methods', '*')
      .expect('access-control-allow-headers', '*');
  })
})