import { LogErrorRepository } from "../../data/protocols/log-error-repository"
import { serverError } from "../../presentation/helpers/http-helper"
import { Controller, HttpRequest, HttpResponse } from "../../presentation/protocols"
import { LogControllerDecorator } from "./log"

interface SutTypes {
  sut: LogControllerDecorator
  controllerStub: Controller
  logErrorRepositoryStub: LogErrorRepository
}

const makeLogErrorRepository = (): LogErrorRepository => {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async log(stack: string): Promise<void> {
      Promise.resolve()
    }
  }

  return new LogErrorRepositoryStub()
}

const makeController = (): Controller => {
  class ControllerStub implements Controller {
    handle(httpRequest: HttpRequest): Promise<HttpResponse> {
      const httpResponse: HttpResponse = {
        statusCode: 200,
        body: {
          name: 'Lucas'
        }
      }
      return Promise.resolve(httpResponse)
    }
  }
  return new ControllerStub()
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

    const httpRequest: HttpRequest = {
      body: {
        name: 'any-name',
        email: 'any-email@gmail.com',
        password: 'any-password',
        passwordConfirm: 'any-password'
      }
    }
    await sut.handle(httpRequest)

    //verificar se o Stub foi chamado com os mesmos dados que o Decorator
    expect(handleSpy).toHaveBeenCalledWith(httpRequest)
  })

  test("Should return the same result of the controller", async () => {
    const { sut } = makeSut()

    const httpRequest: HttpRequest = {
      body: {
        name: 'any-name',
        email: 'any-email@gmail.com',
        password: 'any-password',
        passwordConfirm: 'any-password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)

    //verificar se o Stub foi chamado com os mesmos dados que o Decorator
    expect(httpResponse).toEqual({
      statusCode: 200,
      body: {
        name: 'Lucas'
      }
    })
  })

  test("Should call LogErrorRepository with correct error if controller returns a server error", async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut()

    const fakeError = new Error()
    fakeError.stack = 'any-stack'
    const error = serverError(fakeError)

    const logSpy = jest.spyOn(logErrorRepositoryStub, 'log')
    // mocka o erro no Controller e verifica se é o mesmo que chega pro log
    jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(Promise.resolve(error))

    const httpRequest: HttpRequest = {
      body: {
        name: 'any-name',
        email: 'any-email@gmail.com',
        password: 'any-password',
        passwordConfirm: 'any-password'
      }
    }
    await sut.handle(httpRequest)
    expect(logSpy).toHaveBeenCalledWith('any-stack')
  })
})