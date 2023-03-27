import { DbAddAccount } from "./db-add-account"
import { Encrypter } from "./db-add-account-protocols"

interface SutTypes {
  sut: DbAddAccount
  encrypterStub: Encrypter
}

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt(value: string): Promise<string> {
      return Promise.resolve('hashed_password')
    }
  }

  return new EncrypterStub()
}

const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypter()

  const sut = new DbAddAccount(encrypterStub)
  return {
    sut,
    encrypterStub
  }
}

describe("DbAddAccount Use Case", () => {
  test("Should call Encrypter with correct password", async () => {
    const { encrypterStub, sut } = makeSut()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')

    const accountData = {
      name: 'valid-name',
      email: 'valid-email',
      password: 'valid-password'
    }
    await sut.add(accountData)
    expect(encryptSpy).toHaveBeenCalledWith('valid-password')
  })

  test("Should throw if Encrypter throws", async () => {
    // garantimos que a exceção está sendo tratada no presentation
    const { encrypterStub, sut } = makeSut()
    //fazemos a dependencia do sut retornar uma exceção
    jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(Promise.reject(new Error()))

    const accountData = {
      name: 'valid-name',
      email: 'valid-email',
      password: 'valid-password'
    }
    const promise = sut.add(accountData)
    await expect(promise).rejects.toThrow()
  })
})