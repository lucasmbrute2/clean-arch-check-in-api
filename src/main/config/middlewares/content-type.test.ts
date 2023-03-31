import request from "supertest"
import app from "../app"

describe("Content Type Middleware", () => {
  test("Should return default content type as json", async () => {
    app.get('/test_content_type', (req, res) => {
      return res.send()
    }) // create a fake route to test

    await request(app)
      .get('/test_content_type')
      .expect('content-type', /json/) // se tiver 'json' no meio passa
  })

  // como a rota já foi definida como JSON, deve ser criada outra rota ou resetar o modulo
  test("Should return xml content typr when forced", async () => {
    app.get('/test_content_type_xml', (req, res) => {
      res.type('xml')
      return res.send()
    }) // create a fake route to test

    await request(app)
      .get('/test_content_type_xml')
      .expect('content-type', /xml/)
  })
})