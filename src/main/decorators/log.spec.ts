import { Controller, HttpRequest, HttpResponse } from "../../presentation/protocols"
import { LogControllerDecorator } from "./log"

describe("LogController Decorator", () => {
  test("Should call controller handle", async () => {
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
    const controllerStub = new ControllerStub()
    const handleSpy = jest.spyOn(controllerStub, 'handle')

    const httpRequest: HttpRequest = {
      body: {
        name: 'valid-name',
        email: 'valid-email@gmail.com',
        password: 'valid-password',
        passwordConfirm: 'valid-password'
      }
    }

    const sut = new LogControllerDecorator(controllerStub)
    await sut.handle(httpRequest)

    //verificar se o Stub foi chamado com os mesmos dados que o Decorator
    expect(handleSpy).toHaveBeenCalledWith(httpRequest)
  })
})