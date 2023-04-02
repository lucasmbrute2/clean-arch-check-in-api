import { MongoHelper as sut } from "./mongo-helper"

describe('Mongo Helper', () => {
  beforeAll(async () => {
    await sut.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await sut.disconnect()
  })

  test('Should reconnect if mongoDB is down', async () => {
    let accountColleticions = await sut.getCollection('accounts')
    expect(accountColleticions).toBeTruthy()

    await sut.disconnect()
    accountColleticions = await sut.getCollection('accounts')
    expect(accountColleticions).toBeTruthy()
  })
})