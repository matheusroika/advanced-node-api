import { v4 } from 'uuid'
import type { UUIDGenerator } from '@/domain/contracts/crypto'

export class UUIDHandler implements UUIDGenerator {
  uuid (params: UUIDGenerator.Params): UUIDGenerator.Result {
    v4()
    return ''
  }
}
