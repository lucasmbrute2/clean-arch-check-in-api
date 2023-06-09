import { InvalidParamError } from "../../errors";
import { EmailValidator } from "../../protocols/email-validator";
import { Validation } from "./validation";

export class EmailValidation implements Validation {
  constructor(
    private readonly fieldName: string,
    private readonly emailValidator: EmailValidator
  ) { }

  validate<T>(input: T): Error | null {
    if (!this.emailValidator.isValid(input[this.fieldName])) {
      return new InvalidParamError(this.fieldName)
    }

    return null
  }
}