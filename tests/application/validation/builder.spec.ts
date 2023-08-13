import { MaxFileSizeValidator, MimeTypeValidator, RequiredBufferValidator, RequiredValidator, ValidationBuilder } from '@/application/validation'

describe('Validation Builder', () => {
  test('Should return a RequiredValidator', () => {
    const buffer = Buffer.from('any_buffer')
    const validators = [
      ...ValidationBuilder.of('any_value', 'any_field').required().mimeType().build(),
      ...ValidationBuilder.of(buffer, 'any_field').requiredBuffer().maxFileSize(1).build()
    ]
    expect(validators).toEqual([
      new RequiredValidator('any_value', 'any_field'),
      new MimeTypeValidator('any_value'),
      new RequiredBufferValidator(buffer, 'any_field'),
      new MaxFileSizeValidator(1, buffer)
    ])
  })
})
