import { UserProfile } from '@/domain/entities'

describe('User Profile Entity', () => {
  test('Should create with empty initials when pictureUrl and name is provided', () => {
    const sut = new UserProfile('any_id')
    sut.setPicture({ pictureUrl: 'any_url', name: 'Any Name' })
    expect(sut).toEqual({
      id: 'any_id',
      pictureUrl: 'any_url',
      initials: undefined
    })
  })

  test('Should create with empty initials when pictureUrl is provided', () => {
    const sut = new UserProfile('any_id')
    sut.setPicture({ pictureUrl: 'any_url' })
    expect(sut).toEqual({
      id: 'any_id',
      pictureUrl: 'any_url',
      initials: undefined
    })
  })

  test('Should create initials correctly when user has 2 or more names', () => {
    const sut = new UserProfile('any_id')
    sut.setPicture({ name: 'Test Super Name' })
    expect(sut).toEqual({
      id: 'any_id',
      pictureUrl: undefined,
      initials: 'TN'
    })
  })

  test('Should create initials correctly when user has 2 or more lower case names', () => {
    const sut = new UserProfile('any_id')
    sut.setPicture({ name: 'test super name' })
    expect(sut).toEqual({
      id: 'any_id',
      pictureUrl: undefined,
      initials: 'TN'
    })
  })

  test('Should create initials correctly when user has only one name', () => {
    const sut = new UserProfile('any_id')
    sut.setPicture({ name: 'test' })
    expect(sut).toEqual({
      id: 'any_id',
      pictureUrl: undefined,
      initials: 'TE'
    })
  })

  test('Should create initials correctly when user has only one letter in name', () => {
    const sut = new UserProfile('any_id')
    sut.setPicture({ name: 't' })
    expect(sut).toEqual({
      id: 'any_id',
      pictureUrl: undefined,
      initials: 'T'
    })
  })

  test('Should create correctly with empty initials and empty picture url', () => {
    const sut = new UserProfile('any_id')
    sut.setPicture({})
    expect(sut).toEqual({
      id: 'any_id',
      pictureUrl: undefined,
      initials: undefined
    })
  })
})
