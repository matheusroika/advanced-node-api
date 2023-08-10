import 'dotenv/config'
import 'reflect-metadata'
import app from '@/main/config/app'

const port = process.env.PORT ?? 8080
app.listen(port, () => { console.log(`Server running in port ${port}`) })
