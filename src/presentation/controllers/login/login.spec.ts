import { MissingParamError } from "../../errors"
import { badRequest } from "../../helpers/http-helper"
import { HttpRequest } from "../../protocols"
import { EmailValidator } from "../signup/signup-protocols"
import { LoginController } from "./login"

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true
    }

  }
  return new EmailValidatorStub()
}

interface SutTypes {
  sut: LoginController
  emailValidatorStub: EmailValidator
}
const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const sut = new LoginController(emailValidatorStub)
  return {
    sut,
    emailValidatorStub
  }
}

describe("Login Controller", () => {
  it("Should return 400 if no email is provided", async () => {
    const { sut } = makeSut()
    const httpRequest: HttpRequest = {
      body: {
        password: 'any-password'
      }
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })

  it("Should return 400 if no password is provided", async () => {
    const { sut } = makeSut()
    const httpRequest: HttpRequest = {
      body: {
        email: 'any-email@gmail.com'
      }
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
  })

  //garantindo a integração entre a biblioteca e controller
  it("Should call EmailValidator with correct email", async () => {
    const { sut, emailValidatorStub } = makeSut()
    //garantir q internamente o isValid seja chamado pelo SUT
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')

    const httpRequest: HttpRequest = {
      body: {
        email: 'any-email@gmail.com',
        password: 'any-password'
      }
    }

    await sut.handle(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith('any-email@gmail.com')
  })
})