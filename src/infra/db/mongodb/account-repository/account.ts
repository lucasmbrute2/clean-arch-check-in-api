import { AddAccountRepository } from "../../../../data/protocols/add-account-repository";
import { AccountModel } from "../../../../domain/models/account";
import { AddAccountModel } from "../../../../domain/use-cases/add-account";
import { MongoHelper } from "../helpers/mongo-helper";

interface AccountDataFromMongoDB extends AddAccountModel {
  _id: string
}

export class AccountMongoRepository implements AddAccountRepository {
  async add(accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = MongoHelper.getCollection('accounts')
    await accountCollection.insertOne(accountData)
    const { _id, ...accountWithoutId } = accountData as AccountDataFromMongoDB

    return {
      ...accountWithoutId,
      id: _id
    }
  }
}