import { Router } from "express";
import { collections } from "../data/collections";
import Product from "../modules/Product";

const products = Router()

products.get('', async (req, res) => {
    const {category, name} = req.query
    const query: any = {}
    if(name) query['name'] = name
    if(category) query['category'] = category
    const prods = await collections.products?.find(query).toArray()
    return res.status(200).json(prods)
})

products.get('/:id', async (req, res) => {
    const {id} = req.params
    const query = {id}
    const product = (await collections.products?.findOne(query)) as unknown as Product
    if(!product) return res.status(404).json({message: `Product doesn't exist`})
    return res.status(200).json(product)
})

products.post('', async (req, res) => {
    const {name, description, category} = req.body
    if(!(!!name && !!category)) return res.status(400).json({message: 'Invalid body'})
    const query: any = {name, category}
    if(description) query['description'] = description
    try{
        collections.products?.insertOne(query)
        .then(result => {
            return res.status(200).json({result: 'Successfully added'})
        })
    } catch(e) {
        return res.status(500).json({message: e})
    }
})

products.put('/:id', async (req, res) => {
    type ProductObject = {name?: string, description?: string, category?: string}
    const infoToUpdate: ProductObject = req.body
    const {id} = req.params
    const query = {id}
    try{
        collections.products?.updateOne(query, infoToUpdate)
        return res.status(200).json({result: 'Successfully updated'})
    } catch(e){
        return res.status(500).json({message: e})
    }
})

products.delete('/:id', async (req, res) => {
    const {id} = req.params
    const query = {id}
    try{
        collections.products?.findOneAndDelete(query)
        return res.status(200).json({result: 'Successfully deleted'})
    } catch(e) {
        return res.status(500).json({message: e})
    }
})

export default products