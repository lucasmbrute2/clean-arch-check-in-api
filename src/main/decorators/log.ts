import { Controller, HttpRequest, HttpResponse } from "../../presentation/protocols"

export class LogControllerDecorator implements Controller {
  // A classe que a gnt vai decorar deve ser do msm tipo da que a gnt ta implementando
  constructor(private readonly controller: Controller) { }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    return await this.controller.handle(httpRequest)
  }
}
