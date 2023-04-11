import { EmailValidation } from "./email-validation"
import { EmailValidator } from "../../protocols/email-validator"
import { InvalidParamError } from "../../errors"

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

interface SutTypes {
	sut: EmailValidation
	emailValidatorStub: EmailValidator
}


const makeSut = (): SutTypes => {
	const emailValidatorStub = makeEmailValidator()
	return {
		sut: new EmailValidation('email', emailValidatorStub),
		emailValidatorStub,
	}
}

describe('Email Validation', () => {
	test('Should call EmailValidator with correct email', () => {
		const { sut, emailValidatorStub } = makeSut()
		//utilizando o jest para mockar o retorno da função
		const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')

		sut.validate({ email: 'any-email' })
		expect(isValidSpy).toHaveBeenCalledWith('any-email')
	})

	test('Should throw if EmailValidator throws', () => {
		const { sut, emailValidatorStub } = makeSut()
		jest.spyOn(emailValidatorStub, 'isValid').mockImplementation(() => {
			throw new Error();
		})

		expect(sut.validate).toThrow()
	})

	test('Should return an error if EmailValidator returns false', () => {
		const { sut, emailValidatorStub } = makeSut()
		//utilizando o jest para mockar o retorno da função
		jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

		const error = sut.validate({ email: 'any-email' })
		expect(error).toEqual(new InvalidParamError('email'))
	})
})