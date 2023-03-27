import bcrypt from "bcrypt"
import { BcryptAdapter } from "./bcrypt-adapter"

describe("Bcrypt Adapter", () => {
  test("Should call bcrypt with correct values", async () => {
    const salt = 12
    const sut = new BcryptAdapter(salt)
    const hashSpy = jest.spyOn(bcrypt, 'hash')

    await sut.encrypt('any-value')
    //esperamos que a biblioteca seja usada com a string referida
    expect(hashSpy).toHaveBeenCalledWith('any-value', salt)
  })
})