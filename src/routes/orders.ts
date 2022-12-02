import { Router } from "express"
import { ObjectId } from "mongodb"
import {BSONTypeError} from 'bson'
import { collections } from "../data/collections"
import Order from "../modules/Order"
import Product from "../modules/Product"
import User from "../modules/User"
import { convertToken } from "../utils/jwt"

const orders = Router()

orders.get('/:id', async(req, res) => {
    const {jwtToken} = req.body
    const {id} = req.params
    const data = convertToken(jwtToken)
    const query = {_id: new ObjectId(id), email: data.email}
    const order = (await collections.orders?.findOne(query)) as unknown as Order
    if(!order) return res.status(403).json({message: "Forbidden"})
    return res.status(200).json(order)
})

orders.post('', async (req, res) => {
    const {address, webToken, products} = req.body
    if(!(!!address && !!webToken && (products.length > 0))) return res.status(400).json({message: "Invalid body"})

    const data = convertToken(webToken)
    const user = (await collections.users?.findOne({email: data.email})) as unknown as User

    try{
        const query = products.map((item: Order) => new ObjectId(item.id))
        const prods = (await collections.products?.find({ _id : { $in :query } }).toArray()) as unknown as Product[]

        if(prods.length < 1) return res.status(404).json({message: "No Products was found"})
        const orderProducts = prods.map((item, index) => {
            const product:{product:Product, count: number} = {
                product: item,
                count: products[index].count
            }
            return product
        })
        const order: Order = new Order(orderProducts, user, address)
        const result = await collections.orders?.insertOne(order)
        return res.status(200).json({result})
    } catch(e) {
        switch(true){
            case e instanceof BSONTypeError: 
                res.status(400).json({message: "Invalid Product Id"})
                throw new Error("Invalid Product Id")
            default: 
                res.status(500).json({message: "Unhandled server error"})
                throw new Error("Unhandled server error")
        }  
    }
})

orders.put('/editOrder', async (req, res) => {
    const {jwtToken, order_id, products, address} = req.body
    if(!(!!jwtToken && !!order_id && (!!products || !!address))) return res.status(400).json("Invalid body")
    const data = convertToken(jwtToken)
    const _id = new ObjectId(order_id)
    const order = (await collections.orders?.findOne({_id, user: {email: data.email}})) as unknown as Order
    if(!order) return res.status(403).json({message: "Forbidden"})
    const query: any = {}
    if(products) query['products'] = products
    if(address) query['address'] = address
    try{
        const result = await collections.orders?.updateOne({_id}, query)
        return res.status(200).json({result})
    }catch(e) {
        return res.status(500).json({message: e})
    }
})

orders.delete('/:id', async (req, res) => {
    const {jwtToken, order_id} = req.body
    if(!(!!jwtToken && !!order_id)) return res.status(400).json("Invalid body")
    const data = convertToken(jwtToken)
    try{
        const result = await collections.orders?.findOneAndDelete({_id: new ObjectId(order_id), user: {email: data.email}})
        return res.status(200).json({result})
    } catch(e) {
        return res.status(500).json({message: e})
    }
})

export default orders