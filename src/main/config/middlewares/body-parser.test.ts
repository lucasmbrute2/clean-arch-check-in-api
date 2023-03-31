import request from "supertest"
import app from "../app"

describe("Body Parser Middleware", () => {
  test("Should parse body as json", async () => {
    app.post('/test_body_parser', (req, res) => {
      return res.send(req.body)
    }) // create a fake route to test

    await request(app)
      .post('/test_body_parser')
      .send({ name: "test" })
      .expect({ name: 'test' });
  })
})