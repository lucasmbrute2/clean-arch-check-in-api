import { HttpRequest, HttpResponse, Controller, EmailValidator, AddAccount, Validation } from "../signup/signup-protocols"
import { InvalidParamError, MissingParamError } from "../../errors"
import { badRequest, created, serverError } from "../../helpers/http-helper"

export class SignUpController implements Controller {
  constructor(
    private readonly emailValidator: EmailValidator,
    private readonly addAccount: AddAccount,
    private readonly validation: Validation
  ) { }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {

    try {
      this.validation.validate(httpRequest.body)
      const requiredFields = ['name', 'email', 'password', 'passwordConfirm']

      for (const field of requiredFields) {
        if (!httpRequest?.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }

      const { name, email, password, passwordConfirm } = httpRequest.body
      if (password !== passwordConfirm) {
        return badRequest(new InvalidParamError('passwordConfirm'))
      }

      if (!this.emailValidator.isValid(email)) {
        return badRequest(new InvalidParamError('email'))
      }

      //Neste ponto todos os dados estão validados
      const account = await this.addAccount.add({
        name,
        email,
        password
      })

      return created(account)

    } catch (error) {
      console.error(error)
      return serverError(error)
    }
  }
}