import mongodb, { MongoClient } from 'mongodb'
import server from './src/server'
import dotenv from 'dotenv'
import { collections } from './src/data/collections'

const port = process.env.PORT || 8000

const start = async () => {
    try{
        dotenv.config()

        const client: mongodb.MongoClient = new MongoClient(process.env.DB_CONN_STRING!) 
        await client.connect()
        const db: mongodb.Db = client.db(process.env.DB_NAME!)

        const userCollection: mongodb.Collection =  db.collection(process.env.DB_COLLECTION_USERS!)
        collections.users = userCollection

        const productCollection: mongodb.Collection = db.collection(process.env.DB_COLLECTION_PRODUCTS!)
        collections.products = productCollection

        const ordersCollection: mongodb.Collection = db.collection(process.env.DB_COLLECTION_ORDERS!)
        collections.orders = ordersCollection

        server.listen(port, ()=>{
            console.log(`Server was created on port: ${port}`)
        })
    } catch (e){
        console.log(e)
    }
}

start()
