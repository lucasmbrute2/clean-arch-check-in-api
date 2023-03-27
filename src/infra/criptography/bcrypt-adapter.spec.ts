import bcrypt from "bcrypt"
import { BcryptAdapter } from "./bcrypt-adapter"

jest.mock("bcrypt", () => ({
  async hash(): Promise<string> {
    return Promise.resolve('hash')
  }
}))


const salt = 12
const makeSut = (): BcryptAdapter => {
  const salt = 12
  return new BcryptAdapter(salt)
}

describe("Bcrypt Adapter", () => {
  test("Should call bcrypt with correct values", async () => {
    const sut = makeSut()
    const hashSpy = jest.spyOn(bcrypt, 'hash')

    await sut.encrypt('any-value')
    //esperamos que a biblioteca seja usada com a string referida
    expect(hashSpy).toHaveBeenCalledWith('any-value', salt)
  })

  test("Should return a hash on success", async () => {
    const sut = makeSut()
    const hashedPassword = await sut.encrypt('any-value')
    //não importa como o bcrypt faz o hash, 
    //apenas se o retorno vai ser igual o retorno da função
    //ou seja, se o retorno está sendo repassado para o SUT
    expect(hashedPassword).toBe('hash')

  })
  test("Should throw if bcrypt throws", async () => {
    const sut = makeSut()
    jest.spyOn(bcrypt, 'hash').mockImplementation(async () => {
      return Promise.reject(new Error())
    })

    //não podemos user o await pois queremos pegar a exceção
    const promise = sut.encrypt('any-value')
    await expect(promise).rejects.toThrow()
  })
})