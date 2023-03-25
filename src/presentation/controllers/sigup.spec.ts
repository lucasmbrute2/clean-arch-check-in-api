import { SignUpController } from "./signup"

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
		expect(httpResponse.body).toEqual(new Error('Missing param: name'))
	})
})