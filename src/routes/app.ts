import { Router } from "express";
import users from "./users";

const app = Router()

app.use('/users', users)

app.get('/', (req, res) => {
    res.json({message: 'This is test api'})
})

export default app