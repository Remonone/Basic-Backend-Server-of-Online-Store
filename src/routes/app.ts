import { Router } from "express";
import orders from "./orders";
import products from "./products";
import users from "./users";

const app = Router()

app.use('/users', users)
app.use('/products', products)
app.use('/orders', orders)

app.get('/', (req, res) => {
    res.json({message: 'This is test api'})
})

export default app