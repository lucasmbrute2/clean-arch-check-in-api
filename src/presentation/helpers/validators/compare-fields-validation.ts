import { InvalidParamError, MissingParamError } from "../../errors";
import { Validation } from "./validation";

export class CompareFieldsValidation implements Validation {
  constructor(
    private readonly fieldName: string,
    private readonly fieldCompareName: string
  ) { }

  validate<T>(input: T): Error | null {
    if (input[this.fieldName] !== input[this.fieldCompareName]) {
      return new InvalidParamError(this.fieldCompareName)
    }
  }
}