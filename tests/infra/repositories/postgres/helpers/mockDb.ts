import { type IMemoryDb, newDb } from 'pg-mem'
import type { DataSource } from 'typeorm'
import { fixPgMem } from './fixPgMem'

type MockDb = {
  db: IMemoryDb
  dataSource: DataSource
}

export const mockDb = async (entities?: any[]): Promise<MockDb> => {
  const db = newDb()
  fixPgMem(db)

  const dataSource = await db.adapters.createTypeormDataSource({
    type: 'postgres',
    entities: entities ?? ['src/infra/postgres/entities/index.ts']
  })
  await dataSource.initialize()
  await dataSource.synchronize()

  return {
    db,
    dataSource
  }
}
