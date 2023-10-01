import { prisma } from './prisma';
import express from 'express'
import { ContentService } from './service';

const app = express()
const service = new ContentService(prisma)

// Create Content
app.post('/content', async (req, res) => {
    const { nameOfBeer, OG, FG, alcohol, userId } = req.body
    const content = await service.createContent(nameOfBeer, OG, FG, alcohol, userId)
    res.status(201).send(content)
})

// Updating content through id
app.put('/:contentId', async (req, res) => {
    const { contentId } = req.params;
    const { nameOfBeer, OG, FG, alcohol } = req.body
    const content = await service.updateContent(contentId, nameOfBeer, OG, FG, alcohol)
    res.status(203).send(content) 
})

app.delete('/:contentId', async (req, res) => {
    const { contentId } = req.params;
    const deleted = await service.deleteContent(contentId)
    res.status(200).send(deleted) 

})

// Get all contents
app.get('/', async (req, res) => {
    const userId = res.locals.userId;
    const contents = await service.getContents(userId)
    res.status(200).send(contents)
})


export { app }