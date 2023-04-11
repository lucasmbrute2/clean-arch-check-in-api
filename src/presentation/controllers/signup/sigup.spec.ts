import { SignUpController } from "./signup"
import { MissingParamError, ServerError } from "../../errors"
import { AccountModel, AddAccountModel, AddAccount, HttpRequest, Validation } from "../signup/signup-protocols"
import { badRequest, created, serverError } from "../../helpers/http-helper"

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
	const addAccountStub = makeAddAccount()
	const validationStub = makeValidation()
	return {
		sut: new SignUpController(addAccountStub, validationStub),
		addAccountStub,
		validationStub
	}
}

describe('Sign Up Controller', () => {
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