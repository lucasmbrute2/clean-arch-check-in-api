import { InvalidParamError, MissingParamError } from "../../errors"
import { badRequest, serverError } from "../../helpers/http-helper"
import { HttpRequest } from "../../protocols"
import { EmailValidator } from "../signup/signup-protocols"
import { LoginController } from "./login"

const makeFakeRequest = () => (
  {
    body: {
      email: 'any-email@gmail.com',
      password: 'any-password'
    }
  }
)

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

  it("Should return 400 if an invalid email is provided", async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
  })

  //garantindo a integração entre a biblioteca e controller
  it("Should call EmailValidator with correct email", async () => {
    const { sut, emailValidatorStub } = makeSut()
    //garantir q internamente o isValid seja chamado pelo SUT
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')

    await sut.handle(makeFakeRequest())
    expect(isValidSpy).toHaveBeenCalledWith('any-email@gmail.com')
  })

  it("Should return 500 if EmailValidator throws", async () => {
    const { sut, emailValidatorStub } = makeSut()
    //garantir q internamente o isValid seja chamado pelo SUT
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error();
    })

    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})