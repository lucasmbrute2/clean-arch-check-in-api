import { CompareFieldsValidation } from "../../presentation/helpers/validators/compare-fields-validation"
import { RequiredFieldValidation } from "../../presentation/helpers/validators/required-field-validation"
import { Validation } from "../../presentation/helpers/validators/validation"
import { ValidationComposite } from "../../presentation/helpers/validators/validation-composite"
import { makeSignUpValidation } from "./signup-validation"

jest.mock('../../presentation/helpers/validators/validation-composite')

describe("SignUpValidation Factory", () => {
  // garantir que o Factory em questão seja chamado passando as intancias necessárias
  it("Should call ValidationComposite with all validations", () => {
    makeSignUpValidation()

    const validations: Validation[] = ['name', 'email', 'password', 'passwordConfirm']
      .map(validation => new RequiredFieldValidation(validation));

    validations.push(new CompareFieldsValidation('password', 'passwordConfirm'))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})