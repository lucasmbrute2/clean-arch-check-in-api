import { CompareFieldsValidation } from "../../presentation/helpers/validators/compare-fields-validation"
import { EmailValidation } from "../../presentation/helpers/validators/email-validation"
import { RequiredFieldValidation } from "../../presentation/helpers/validators/required-field-validation"
import { Validation } from "../../presentation/helpers/validators/validation"
import { ValidationComposite } from "../../presentation/helpers/validators/validation-composite"
import { EmailValidator } from "../../presentation/protocols/email-validator"
import { makeSignUpValidation } from "./signup-validation"

jest.mock('../../presentation/helpers/validators/validation-composite')
const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator { //um tipo de mock que existe
    // sempre retorne o seu mock com o valor onde não de erro
    //onde vc quiser q falhe, você mocka e faz falhar
    isValid(email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

describe("SignUpValidation Factory", () => {
  // garantir que o Factory em questão seja chamado passando as intancias necessárias
  it("Should call ValidationComposite with all validations", () => {
    makeSignUpValidation()

    const validations: Validation[] = ['name', 'email', 'password', 'passwordConfirm']
      .map(validation => new RequiredFieldValidation(validation));

    validations.push(new CompareFieldsValidation('password', 'passwordConfirm'))
    validations.push(new EmailValidation('email', makeEmailValidator()))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})