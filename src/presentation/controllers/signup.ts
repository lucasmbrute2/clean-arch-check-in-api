import { InvalidParamError, MissingParamError } from "../errors"
import { badRequest, serverError } from "../helpers/http-helper"
import { HttpRequest, HttpResponse, Controller, EmailValidator } from "../protocols"

export class SignUpController implements Controller {
  constructor(private readonly emailValidator: EmailValidator) { }

  handle(httpRequest: HttpRequest): HttpResponse {

    try {
      const requiredFields = ['name', 'email', 'password', 'passwordConfirm']

      for (const field of requiredFields) {
        if (!httpRequest?.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }

      if (httpRequest.body.password !== httpRequest.body.passwordConfirm) {
        return badRequest(new InvalidParamError('passwordConfirm'))
      }

      if (!this.emailValidator.isValid(httpRequest.body.email)) {
        return badRequest(new InvalidParamError('email'))
      }

    } catch (error) {
      return serverError()
    }
  }
}