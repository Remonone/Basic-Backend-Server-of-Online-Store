import { Router } from "express";

const app = Router()

app.get('/', (req, res) => {
    res.json({message: 'This is test api'})
})

export default app