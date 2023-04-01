import request from "supertest"
import app from "../app"

describe("SignUp Routes", () => {
  test("Should return an account on success", async () => {
    const response = await request(app)
      .post('/api/signup')
      .send({
        name: 'Lucas',
        email: 'lucasmbrute614@gmail.com',
        password: '123',
        passwordConfirm: '123'
      })

    expect(response.statusCode).toBe(201)
    expect(response.body).toEqual({
      ok: 'ok'
    })
  })
})