// Wrappers ou adapters são componentes criados para encapsular o componente do validator, estamos isolando dos controllers a validação de e-mail

import { EmailValidatorAdapter } from "./email-validator-adapter"

describe('EmailValidator Adapter', () => {
  test('Should return false if validator returns false', () => {
    const sut = new EmailValidatorAdapter()
    const isValid = sut.isValid('invalid-email@gmail.com')

    expect(isValid).toBe(false)
  })
})