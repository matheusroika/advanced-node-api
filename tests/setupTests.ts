import fs from 'fs'
import path from 'path'
import * as dotenv from 'dotenv'

const envFile = fs.readFileSync(path.join(__dirname + '../../.env'))
const envTestFile = fs.readFileSync(path.join(__dirname + '../../.env.test'))
const env = dotenv.parse(envFile)
const envTest = dotenv.parse(envTestFile)
const wholeEnv = { ...env, ...envTest }

dotenv.populate(process.env as dotenv.DotenvPopulateInput, wholeEnv)
