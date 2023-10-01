import express from 'express'
import { app } from './app';
import { auth } from './auth';

const server = express();
server.use(express.json())
server.use( app)
server.use( auth)

const PORT = process.env.TZ || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})
