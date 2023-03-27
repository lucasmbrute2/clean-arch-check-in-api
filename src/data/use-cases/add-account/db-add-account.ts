import { AddAccount, AccountModel, AddAccountModel, Encrypter, AddAccountRepository } from "./db-add-account-protocols"


export class DbAddAccount implements AddAccount {
  constructor(
    private readonly encrypter: Encrypter,
    private readonly addAccountRepository: AddAccountRepository) { }

  async add(accountData: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.encrypter.encrypt(accountData.password)
    await this.addAccountRepository.add({
      ...accountData,
      password: hashedPassword
    })
    return Promise.resolve(null)
  }
}