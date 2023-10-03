import express from 'express'
import { app } from './app';
import { auth } from './auth';
import cors from 'cors'

const server = express();
server.use(express.json())
server.use( app)
server.use( auth)
server.use(cors)

const PORT = process.env.TZ || 4000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})

