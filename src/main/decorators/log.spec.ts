import { Controller, HttpRequest, HttpResponse } from "../../presentation/protocols"
import { LogControllerDecorator } from "./log"

interface SutTypes {
  sut: LogControllerDecorator
  controllerStub: Controller
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
  const controllerStub = makeController()
  const sut = new LogControllerDecorator(controllerStub)
  return {
    controllerStub,
    sut
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
})