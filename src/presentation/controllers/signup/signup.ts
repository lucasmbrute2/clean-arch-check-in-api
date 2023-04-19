import { HttpRequest, HttpResponse, Controller, AddAccount, Validation } from "../signup/signup-protocols"
import { badRequest, created, serverError } from "../../helpers/http-helper"

export class SignUpController implements Controller {
  constructor(
    private readonly addAccount: AddAccount,
    private readonly validation: Validation
  ) { }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {

    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }
      const { name, email, password } = httpRequest.body
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