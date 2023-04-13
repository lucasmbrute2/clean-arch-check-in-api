import { MissingParamError } from "../../errors"
import { RequiredFieldValidation } from "./required-field-validation"

const makeSut = (): RequiredFieldValidation => {
  return new RequiredFieldValidation('field')
}

describe("RequiredField validation", () => {
  test("Should return a MissingParamError if validations fails", () => {
    const sut = makeSut()
    const error = sut.validate({ name: 'any-name' })
    expect(error).toEqual(new MissingParamError('field'))
  })
})