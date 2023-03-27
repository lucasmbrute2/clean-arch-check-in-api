import { DbAddAccount } from "./db-add-account"
import { AccountModel, AddAccountModel, AddAccountRepository, Encrypter } from "./db-add-account-protocols"


const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt(value: string): Promise<string> {
      return Promise.resolve('hashed_password')
    }
  }

  return new EncrypterStub()
}

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add(accountData: AddAccountModel): Promise<AccountModel> {
      const fakeAccount = {
        id: 'valid-id',
        name: 'valid-name',
        email: 'valid-email',
        password: 'hashed-password'
      }
      return Promise.resolve(fakeAccount)
    }
  }

  return new AddAccountRepositoryStub()
}

interface SutTypes {
  sut: DbAddAccount
  encrypterStub: Encrypter
  addAccountRepositoryStub: AddAccountRepository
}

const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypter()
  const addAccountRepositoryStub = makeAddAccountRepository()

  const sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub)
  return {
    sut,
    encrypterStub,
    addAccountRepositoryStub
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

  test("Should call AddAccountRepository with correct values", async () => {
    const { addAccountRepositoryStub, sut } = makeSut()
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')

    const accountData = {
      name: 'valid-name',
      email: 'valid-email',
      password: 'valid-password'
    }
    await sut.add(accountData)
    expect(addSpy).toHaveBeenCalledWith({
      name: 'valid-name',
      email: 'valid-email',
      password: 'hashed_password'
    })
  })

  test("Should throw AddAccountRepository throws", async () => {
    const { addAccountRepositoryStub, sut } = makeSut()

    jest.spyOn(addAccountRepositoryStub, 'add').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))

    const accountData = {
      name: 'valid-name',
      email: 'valid-email',
      password: 'valid-password'
    }
    const promise = sut.add(accountData)
    await expect(promise).rejects.toThrow()
  })
})