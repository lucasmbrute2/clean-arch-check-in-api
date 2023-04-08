import { DbAddAccount } from "../../data/use-cases/add-account/db-add-account";
import { BcryptAdapter } from "../../infra/criptography/bcrypt-adapter";
import { AccountMongoRepository } from "../../infra/db/mongodb/account-repository/account";
import { LongoMongoRepository } from "../../infra/db/mongodb/log-repository/log";
import { SignUpController } from "../../presentation/controllers/signup/signup";
import { Controller } from "../../presentation/protocols";
import { EmailValidatorAdapter } from "../../utils/email-validator-adapter";
import { LogControllerDecorator } from "../decorators/log";

export const makeSignUpController = (): Controller => {
  const emailValidator = new EmailValidatorAdapter()
  const salt = 12
  const encrypter = new BcryptAdapter(salt)
  const addAccountRepository = new AccountMongoRepository()
  const addAccountUseCase = new DbAddAccount(encrypter, addAccountRepository)

  // Decorator pattern
  // Faz um wrapper na instância de um objeto, criando uma outra instância da classe que você quer (do mesmo tipo)
  const signUpController = new SignUpController(emailValidator, addAccountUseCase)
  const logMongoRepository = new LongoMongoRepository()
  return new LogControllerDecorator(signUpController, logMongoRepository)
}