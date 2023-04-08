import { InvalidParamError, MissingParamError } from "../../errors"
import { badRequest, serverError, unauthorized, ok } from "../../helpers/http-helper"
import { Authentication, EmailValidator, HttpRequest } from "../login/login-protocols"
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

const makeAuthenticationStub = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth(email: string, password: string): Promise<string> {
      return Promise.resolve('any-token')
    }
  }

  return new AuthenticationStub()
}

interface SutTypes {
  sut: LoginController
  emailValidatorStub: EmailValidator
  authenticationStub: Authentication
}
const makeSut = (): SutTypes => {
  const authenticationStub = makeAuthenticationStub()
  const emailValidatorStub = makeEmailValidator()
  const sut = new LoginController(emailValidatorStub, authenticationStub)
  return {
    sut,
    emailValidatorStub,
    authenticationStub
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

  it("Should call Authentication with correct values", async () => {
    const { sut, authenticationStub } = makeSut()
    //garantir q internamente o isValid seja chamado pelo SUT
    const authSpy = jest.spyOn(authenticationStub, 'auth')

    await sut.handle(makeFakeRequest())
    expect(authSpy).toHaveBeenCalledWith('any-email@gmail.com', 'any-password')
  })

  it("Should return 401 if invalid credentials are provided", async () => {
    const { sut, authenticationStub } = makeSut()
    //garantir q internamente o isValid seja chamado pelo SUT
    jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(Promise.resolve(null))

    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(unauthorized())
  })

  it("Should return 500 if Authentication throws", async () => {
    const { sut, authenticationStub } = makeSut()
    //garantir q internamente o isValid seja chamado pelo SUT
    jest.spyOn(authenticationStub, 'auth').mockImplementationOnce(async () => {
      throw new Error();
    })

    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  it("Should return 200 if valid credentials are provided", async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(ok({
      accessToken: 'any-token'
    }))
  })
})