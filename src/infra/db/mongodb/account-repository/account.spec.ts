import { MongoHelper } from "../helpers/mongo-helper"
import { AccountMongoRepository } from "./account"

const makeSut = (): AccountMongoRepository => {
  return new AccountMongoRepository()
}

describe("Account Mongodb Repository", () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })


  test("Should return an account on success", async () => {
    const sut = makeSut()
    const account = await sut.add({
      name: 'any-name',
      email: 'any-email@gmail.com',
      password: 'any-password'
    })

    expect(account).toBeTruthy()
    expect(account).toHaveProperty('id')
    expect(account).toEqual(expect.objectContaining({
      name: 'any-name',
      email: 'any-email@gmail.com',
      password: 'any-password'
    }))
  })
})