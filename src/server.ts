import cors from 'cors'
import express from 'express'
import Logger from './middleware/logger'
import app from './routes/app'

const server = express()
server.use(Logger)


server.use(express.json())
server.use(cors())
server.use('/api/v1', app)


export default server