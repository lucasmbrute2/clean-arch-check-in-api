import { MissingParamError } from "../../errors";
import { badRequest } from "../../helpers/http-helper";
import { HttpRequest, HttpResponse } from "../../protocols";
import { Controller } from "../../protocols/controller"
import { EmailValidator } from "../signup/signup-protocols";

export class LoginController implements Controller {
  constructor(private readonly emailValidator: EmailValidator) { }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    if (!httpRequest?.body?.email) {
      return badRequest(new MissingParamError('email'))
    }

    if (!httpRequest?.body?.password) {
      return badRequest(new MissingParamError('password'))
    }

    const isValidEmail = this.emailValidator.isValid(httpRequest?.body?.email)
  }
}