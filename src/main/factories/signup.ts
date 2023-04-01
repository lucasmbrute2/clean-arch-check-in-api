import { DbAddAccount } from "../../data/use-cases/add-account/db-add-account";
import { BcryptAdapter } from "../../infra/criptography/bcrypt-adapter";
import { AccountMongoRepository } from "../../infra/db/mongodb/account-repository/account";
import { SignUpController } from "../../presentation/controllers/signup/signup";
import { EmailValidatorAdapter } from "../../utils/email-validator-adapter";

export const makeSignUpController = (): SignUpController => {
  const emailValidator = new EmailValidatorAdapter()
  const salt = 12
  const encrypter = new BcryptAdapter(salt)
  const addAccountRepository = new AccountMongoRepository()
  const addAccountUseCase = new DbAddAccount(encrypter, addAccountRepository)

  return new SignUpController(emailValidator, addAccountUseCase)
}