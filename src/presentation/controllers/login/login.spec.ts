import { MissingParamError } from "../../errors"
import { badRequest } from "../../helpers/http-helper"
import { HttpRequest } from "../../protocols"
import { LoginController } from "./login"

interface SutTypes {
  sut: LoginController
}
const makeSut = (): SutTypes => {
  const sut = new LoginController()
  return {
    sut
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
})