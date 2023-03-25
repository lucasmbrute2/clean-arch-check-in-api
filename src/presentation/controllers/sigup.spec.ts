import { SignUpController } from "./signup"
import { MissingParamError } from "../errors/missing-param-error"
import { InvalidParamError } from "../errors/invalid-param-error"
import { EmailValidator } from "../protocols/email-validator"

interface SutTypes {
	sut: SignUpController
	emailValidatorStub: EmailValidator
}

const makeSut = (): SutTypes => {
	class EmailValidatorStub implements EmailValidator { //um tipo de mock que existe
		// sempre retorne o seu mock com o valor onde não de erro
		//onde vc quiser q falhe, você mocka e faz falhar
		isValid(email: string): boolean {
			return true
		}
	}
	const emailValidatorStub = new EmailValidatorStub()
	return {
		sut: new SignUpController(emailValidatorStub),
		emailValidatorStub
	}
}

describe('Sign Up Controller', () => {
	test('Should return 400 if no name is provided', () => {
		const { sut } = makeSut()
		const httpRequest = {
			body: {
				email: 'johndoe@gmail.com',
				password: '123456',
				passwordConfirm: '123456'
			}
		}
		const httpResponse = sut.handle(httpRequest)
		expect(httpResponse.statusCode).toBe(400) // compara o ponteiro dos objetos
		expect(httpResponse.body).toEqual(new MissingParamError('name'))
	})

	test('Should return 400 if no email is provided', () => {
		const { sut } = makeSut()
		const httpRequest = {
			body: {
				name: 'jhon doe',
				password: '123456',
				passwordConfirm: '123456'
			}
		}
		const httpResponse = sut.handle(httpRequest)
		expect(httpResponse.statusCode).toBe(400) // compara o ponteiro dos objetos
		expect(httpResponse.body).toEqual(new MissingParamError('email'))
	})

	test('Should return 400 if no password is provided', () => {
		const { sut } = makeSut()
		const httpRequest = {
			body: {
				email: 'johndoe@gmail.com',
				name: 'jhon doe',
				passwordConfirm: '123456'
			}
		}
		const httpResponse = sut.handle(httpRequest)
		expect(httpResponse.statusCode).toBe(400) // compara o ponteiro dos objetos
		expect(httpResponse.body).toEqual(new MissingParamError('password'))
	})

	test('Should return 400 if no password confirmation is provided', () => {
		const { sut } = makeSut()
		const httpRequest = {
			body: {
				email: 'johndoe@gmail.com',
				name: 'jhon doe',
				password: '123456'
			}
		}
		const httpResponse = sut.handle(httpRequest)
		expect(httpResponse.statusCode).toBe(400) // compara o ponteiro dos objetos
		expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirm'))
	})

	test('Should return 400 if an invalid email is provided', () => {
		const { sut, emailValidatorStub } = makeSut()
		//utilizando o jest para mockar o retorno da função
		jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

		const httpRequest = {
			body: {
				email: 'invalid_email',
				name: 'jhon doe',
				password: '123456',
				passwordConfirm: '123456'
			}
		}
		const httpResponse = sut.handle(httpRequest)


		expect(httpResponse.statusCode).toBe(400) // compara o ponteiro dos objetos
		expect(httpResponse.body).toEqual(new InvalidParamError('email'))
	})

	test('Should call email validator with correct email', () => {
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
		sut.handle(httpRequest)
		expect(isValidSpy).toHaveBeenCalledWith('invalid_email')
	})
}) 