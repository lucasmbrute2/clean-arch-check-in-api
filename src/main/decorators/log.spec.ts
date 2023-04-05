import { LogErrorRepository } from "../../data/protocols/log-error-repository"
import { AccountModel } from "../../domain/models/account"
import { ok, serverError } from "../../presentation/helpers/http-helper"
import { Controller, HttpRequest, HttpResponse } from "../../presentation/protocols"
import { LogControllerDecorator } from "./log"

const makeLogErrorRepository = (): LogErrorRepository => {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async logError(stack: string): Promise<void> {
      Promise.resolve()
    }
  }

  return new LogErrorRepositoryStub()
}

const makeFakeRequest = (): HttpRequest => ({
  body: {
    email: 'any-name',
    name: 'any-email@gmail.com',
    password: 'any-password',
    passwordConfirm: 'any-password'
  }
})

const makeController = (): Controller => {
  class ControllerStub implements Controller {
    handle(httpRequest: HttpRequest): Promise<HttpResponse> {
      return Promise.resolve(ok(makeFakeAccount()))
    }
  }
  return new ControllerStub()
}

const makeFakeAccount = (): AccountModel => ({
  id: 'valid-id',
  name: 'valid-name',
  email: 'valid-email@gmail.com',
  password: 'valid-password'
})

const makeFakeServerError = (): HttpResponse => {
  const fakeError = new Error()
  fakeError.stack = 'any-stack'
  return serverError(fakeError)
}

interface SutTypes {
  sut: LogControllerDecorator
  controllerStub: Controller
  logErrorRepositoryStub: LogErrorRepository
}


const makeSut = (): SutTypes => {
  const logErrorRepositoryStub = makeLogErrorRepository()
  const controllerStub = makeController()
  const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub)

  return {
    controllerStub,
    sut,
    logErrorRepositoryStub
  }
}

describe("LogController Decorator", () => {
  test("Should call controller handle", async () => {
    const { controllerStub, sut } = makeSut()
    const handleSpy = jest.spyOn(controllerStub, 'handle')

    await sut.handle(makeFakeRequest())

    //verificar se o Stub foi chamado com os mesmos dados que o Decorator
    expect(handleSpy).toHaveBeenCalledWith(makeFakeRequest())
  })

  test("Should return the same result of the controller", async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())

    //verificar se o Stub foi chamado com os mesmos dados que o Decorator
    expect(httpResponse).toEqual(ok(makeFakeAccount()))
  })

  test("Should call LogErrorRepository with correct error if controller returns a server error", async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut()



    const logSpy = jest.spyOn(logErrorRepositoryStub, 'logError')
    // mocka o erro no Controller e verifica se é o mesmo que chega pro log
    jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(Promise.resolve(makeFakeServerError()))

    await sut.handle(makeFakeRequest())
    expect(logSpy).toHaveBeenCalledWith('any-stack')
  })
})