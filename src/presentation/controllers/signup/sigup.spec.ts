import { SignUpController } from "./signup"
import { MissingParamError, InvalidParamError, ServerError } from "../../errors"
import { EmailValidator, AccountModel, AddAccountModel, AddAccount, HttpRequest, Validation } from "../signup/signup-protocols"
import { badRequest, created, serverError } from "../../helpers/http-helper"

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

const makeFakeAccount = (): AccountModel => ({
	id: 'valid-id',
	name: 'valid-name',
	email: 'valid-email@gmail.com',
	password: 'valid-password'
})

const makeAddAccount = (): AddAccount => {
	class AddAccountStub implements AddAccount {
		async add(account: AddAccountModel): Promise<AccountModel> {
			return Promise.resolve(makeFakeAccount())
		}
	}

	return new AddAccountStub()
}

const makeFakeRequest = (): HttpRequest => ({
	body: {
		email: 'any-name',
		name: 'any-email@gmail.com',
		password: 'any-password',
		passwordConfirm: 'any-password'
	}
})

interface SutTypes {
	sut: SignUpController
	emailValidatorStub: EmailValidator
	addAccountStub: AddAccount
	validationStub: Validation
}

const makeValidation = (): Validation => {
	class ValidationStub implements Validation {
		validate<T>(body: T): Error | null {
			return null
		}
	}

	return new ValidationStub()
}

const makeSut = (): SutTypes => {
	const emailValidatorStub = makeEmailValidator()
	const addAccountStub = makeAddAccount()
	const validationStub = makeValidation()
	return {
		sut: new SignUpController(emailValidatorStub, addAccountStub, validationStub),
		emailValidatorStub,
		addAccountStub,
		validationStub
	}
}

describe('Sign Up Controller', () => {
	test('Should return 400 if no name is provided', async () => {
		const { sut } = makeSut()
		const httpRequest = {
			body: {
				email: 'johndoe@gmail.com',
				password: '123456',
				passwordConfirm: '123456'
			}
		}
		const httpResponse = await sut.handle(httpRequest)
		expect(httpResponse).toEqual(badRequest(new MissingParamError('name')))
	})

	test('Should return 400 if no email is provided', async () => {
		const { sut } = makeSut()
		const httpRequest = {
			body: {
				name: 'jhon doe',
				password: '123456',
				passwordConfirm: '123456'
			}
		}
		const httpResponse = await sut.handle(httpRequest)
		expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
	})

	test('Should return 400 if no password is provided', async () => {
		const { sut } = makeSut()
		const httpRequest = {
			body: {
				email: 'johndoe@gmail.com',
				name: 'jhon doe',
				passwordConfirm: '123456'
			}
		}
		const httpResponse = await sut.handle(httpRequest)
		expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
	})

	test('Should return 400 if no password confirmation is provided', async () => {
		const { sut } = makeSut()
		const httpRequest = {
			body: {
				email: 'johndoe@gmail.com',
				name: 'jhon doe',
				password: '123456'
			}
		}
		const httpResponse = await sut.handle(httpRequest)
		expect(httpResponse).toEqual(badRequest(new MissingParamError('passwordConfirm')))
	})

	test('Should return 400 if password confirmation fails', async () => {
		const { sut } = makeSut()
		const httpRequest = {
			body: {
				email: 'johndoe@gmail.com',
				name: 'jhon doe',
				password: '123456',
				passwordConfirm: 'invalid-password-confirm'
			}
		}
		const httpResponse = await sut.handle(httpRequest)
		expect(httpResponse).toEqual(badRequest(new InvalidParamError('passwordConfirm')))
	})

	test('Should return 400 if an invalid email is provided', async () => {
		const { sut, emailValidatorStub } = makeSut()
		//utilizando o jest para mockar o retorno da função
		jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

		const httpResponse = await sut.handle(makeFakeRequest())

		expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
	})

	test('Should call EmailValidator with correct email', async () => {
		const { sut, emailValidatorStub } = makeSut()
		//utilizando o jest para mockar o retorno da função
		const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')

		const httpRequest = {
			body: {
				email: 'invalid_email',
				name: 'jhon doe',
				password: '123456',
				passwordConfirm: '123456'
			}
		}
		await sut.handle(httpRequest)
		expect(isValidSpy).toHaveBeenCalledWith('invalid_email')
	})

	test('Should return 500 if EmailValidator throws', async () => {
		const { sut, emailValidatorStub } = makeSut()
		jest.spyOn(emailValidatorStub, 'isValid').mockImplementation(() => {
			throw new Error();
		})

		const httpResponse = await sut.handle(makeFakeRequest())
		expect(httpResponse).toEqual(serverError(new ServerError(null)))
	})

	test('Should call AddAccount with correct values', async () => {
		const { sut, addAccountStub } = makeSut()
		const addSpy = jest.spyOn(addAccountStub, 'add')

		const httpRequest = {
			body: {
				email: 'invalid_email',
				name: 'jhon doe',
				password: '123456',
				passwordConfirm: '123456'
			}
		}
		await sut.handle(httpRequest)
		expect(addSpy).toHaveBeenCalledWith({
			email: 'invalid_email',
			name: 'jhon doe',
			password: '123456',
		})
	})

	test('Should return 500 if AddAccount throws', async () => {
		const { sut, addAccountStub } = makeSut()
		jest.spyOn(addAccountStub, 'add').mockImplementation(async () => {
			return Promise.reject(new Error())
		})

		const httpResponse = await sut.handle(makeFakeRequest())
		expect(httpResponse).toEqual(serverError(new ServerError(null)))
	})

	test('Should return 201 if valid data is provided', async () => {
		const { sut } = makeSut()

		const httpResponse = await sut.handle(makeFakeRequest())
		expect(httpResponse).toEqual(created(makeFakeAccount()))
	})

	test('Should call Validation with correct values', async () => {
		const { sut, validationStub } = makeSut()
		const validateSpy = jest.spyOn(validationStub, 'validate')

		const httpRequest = makeFakeRequest()
		await sut.handle(httpRequest)

		expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
	})

	test('Should return 400 if Validation returns an error', async () => {
		const { sut, validationStub } = makeSut()
		jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any-field'))

		const httpResponse = await sut.handle(makeFakeRequest())
		expect(httpResponse).toEqual(badRequest(new MissingParamError('any-field')))
	})

})   