import { EmailValidator } from "../presentation/protocols/email-validator";
import validator from "validator"

// É a camada de implementação, de forma desacoplada seguindo o contrato da interface
export class EmailValidatorAdapter implements EmailValidator {
  isValid(email: string): boolean {
    return validator.isEmail(email)
  }
}