import cors from 'cors'
import express from 'express'
import app from './routes/app'

const server = express()

server.use(express.json())
server.use(cors())
server.use('/api/v1', app)

export default server