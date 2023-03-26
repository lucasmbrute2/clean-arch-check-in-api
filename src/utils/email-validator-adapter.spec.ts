// Wrappers ou adapters são componentes criados para encapsular o componente do validator, estamos isolando dos controllers a validação de e-mail
import { EmailValidatorAdapter } from "./email-validator-adapter"
import validator from "validator"

// O teste unitário não deve depender da validação da implementanção, a regra de negócios deve ser mockada. Nos importamos apenas com o resultado da função.
jest.mock('validator', () => ({ // sobrescreve todos os métodos desse modulo, passando um segundo parametro sobrescrevendo o resultado mockado
  isEmail(): boolean {
    return true
  },
}))

describe('EmailValidator Adapter', () => {
  test('Should return false if validator returns false', () => {

    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)


    const sut = new EmailValidatorAdapter()
    const isValid = sut.isValid('invalid-email@gmail.com')

    expect(isValid).toBe(false)
  })

  test('Should return true if validator returns true', () => {
    const sut = new EmailValidatorAdapter()
    const isValid = sut.isValid('valid-email@gmail.com')

    expect(isValid).toBe(true)
  })

  test('Should call validator with correct email', () => {
    const sut = new EmailValidatorAdapter()
    const isEmailSpy = jest.spyOn(validator, 'isEmail')

    sut.isValid('any-email@gmail.com')
    expect(isEmailSpy).toHaveBeenCalledWith('any-email@gmail.com')
  })
})