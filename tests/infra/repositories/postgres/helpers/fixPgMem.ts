import { DataType, type IMemoryDb } from 'pg-mem'

export const fixPgMem = (db: IMemoryDb): void => {
  db.public.registerFunction({
    name: 'current_database',
    args: [],
    returns: DataType.text,
    implementation: (x: string) => `hello world: ${x}`
  })
  db.public.registerFunction({
    name: 'version',
    args: [],
    returns: DataType.text,
    implementation: (x: string) => `hello world: ${x}`
  })
}
