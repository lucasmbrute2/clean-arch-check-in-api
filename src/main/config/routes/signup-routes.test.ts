import request from "supertest"
import { MongoHelper } from "../../../infra/db/mongodb/helpers/mongo-helper"
import app from "../app"

describe("SignUp Routes", () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    const accountCollection = MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

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