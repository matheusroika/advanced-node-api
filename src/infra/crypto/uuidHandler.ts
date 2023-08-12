import { v4 as uuidv4 } from 'uuid'
import type { UUIDGenerator } from '@/domain/contracts/crypto'

export class UUIDHandler implements UUIDGenerator {
  uuid ({ key }: UUIDGenerator.Params): UUIDGenerator.Result {
    const uuid = `${key}_${uuidv4()}`
    return uuid
  }
}
