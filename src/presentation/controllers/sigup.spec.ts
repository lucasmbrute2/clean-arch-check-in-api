import { SignUpController } from "./signup"
import { MissingParamError } from "../errors/missing-param-error"

describe('Sign Up Controller', () => {
	test('Should return 400 if no name is provided', () => {
		const sut = new SignUpController()
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
		const sut = new SignUpController()
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
		const sut = new SignUpController()
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
		const sut = new SignUpController()
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
}) 