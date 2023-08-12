import { v4 as uuidv4 } from 'uuid'
import { mocked } from 'jest-mock'
import { UUIDHandler } from '@/infra/crypto'

jest.mock('uuid')

describe('UUID Handler', () => {
  test('Should call uuid.v4', () => {
    const sut = new UUIDHandler()
    sut.uuid({ key: 'any_key' })
    expect(uuidv4).toHaveBeenCalledTimes(1)
  })

  test('Should return correct uuid', () => {
    mocked(uuidv4).mockReturnValueOnce('any_uuid')
    const sut = new UUIDHandler()
    const uuid = sut.uuid({ key: 'any_key' })
    expect(uuid).toBe('any_key_any_uuid')
  })
})
