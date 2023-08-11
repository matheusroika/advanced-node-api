import 'dotenv/config'
import 'reflect-metadata'
import app from '@/main/config/app'
import { appDataSource } from '@/main/config/db'

const port = process.env.PORT ?? 8080
appDataSource.initialize()
  .then(async () => {
    await appDataSource.synchronize()
    app.listen(port, () => { console.log(`Server running in port ${port}`) })
  })
  .catch(console.error)
