import { RequiredFieldValidation } from "../../presentation/helpers/validators/required-field-validation"
import { ValidationComposite } from "../../presentation/helpers/validators/validation-composite"
import { makeSignUpValidation } from "./signup-validation"

jest.mock('../../presentation/helpers/validators/validation-composite')

describe("SignUpValidation Factory", () => {
  // garantir que o Factory em questão seja chamado passando as intancias necessárias
  it("Should call ValidationComposite with all validations", () => {
    makeSignUpValidation()

    const validations = ['name', 'email', 'password', 'passwordConfirmation']
      .map(validation => new RequiredFieldValidation(validation));

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})