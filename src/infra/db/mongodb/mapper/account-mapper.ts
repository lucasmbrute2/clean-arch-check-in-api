import { AccountModel } from "../../../../domain/models/account";
import { AccountDataFromMongoDB } from "../account-repository/account";

export class AccountRepositoryMapper {
  static toDomain(account: AccountDataFromMongoDB): AccountModel {
    const { _id, ...accountWithoutId } = account
    return {
      ...accountWithoutId,
      id: _id
    }
  }
}