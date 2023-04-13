import { InvalidParamError } from "../../errors"
import { CompareFieldsValidation } from "./compare-fields-validation"

const makeSut = (): CompareFieldsValidation => {
  return new CompareFieldsValidation('field', 'fieldToCompare')
}

describe("CompareFields validation", () => {
  test("Should return a InvalidParamError if validations fails", () => {
    const sut = makeSut()
    const error = sut.validate({
      field: 'any-value',
      fieldToCompare: 'wrong-value'
    })
    expect(error).toEqual(new InvalidParamError('fieldToCompare'))
  })

  test("Should not return if validation succeeds", () => {
    const sut = makeSut()
    const error = sut.validate({
      field: 'any-value',
      fieldToCompare: 'any-value'
    })
    expect(error).toBeFalsy()
  })
})