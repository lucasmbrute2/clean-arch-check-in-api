import { MissingParamError } from "../../errors"
import { badRequest, serverError, unauthorized, ok } from "../../helpers/http-helper"
import { Authentication, HttpRequest, Validation } from "../login/login-protocols"
import { LoginController } from "./login"

const makeFakeRequest = () => (
  {
    body: {
      email: 'any-email@gmail.com',
      password: 'any-password'
    }
  }
)
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
  authenticationStub: Authentication
  validationStub: Validation
}

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate<T>(body: T): Error | null {
      return null
    }
  }

  return new ValidationStub()
}

const makeSut = (): SutTypes => {
  const authenticationStub = makeAuthenticationStub()
  const validationStub = makeValidation()
  const sut = new LoginController(validationStub, authenticationStub)
  return {
    sut,
    authenticationStub,
    validationStub
  }
}

describe("Login Controller", () => {
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

  test('Should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')

    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)

    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('Should return 400 if Validation returns an error', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any-field'))

    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(badRequest(new MissingParamError('any-field')))
  })
})