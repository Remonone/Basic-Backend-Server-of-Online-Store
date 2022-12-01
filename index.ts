import mongodb from 'mongodb'
import { MongoClient } from 'mongodb'
import server from './src/server'
import dotenv from 'dotenv'
import { collections } from './src/data/collections'

dotenv.config()

const port = process.env.PORT || 8000

const connection_string = process.env.DB_CONN_STRING as string
const db_string = process.env.DB_NAME as string

const users_string = process.env.DB_COLLECTION_USERS as string
const products_string = process.env.DB_COLLECTION_PRODUCTS as string
const orders_string = process.env.DB_COLLECTION_ORDERS as string

const start = async () => {
    try{
        const client: mongodb.MongoClient = new MongoClient(connection_string) 
        await client.connect()
        const db: mongodb.Db = client.db(db_string)

        const userCollection: mongodb.Collection =  db.collection(users_string)
        collections.users = userCollection

        const productCollection: mongodb.Collection = db.collection(products_string)
        collections.products = productCollection

        const ordersCollection: mongodb.Collection = db.collection(orders_string)
        collections.orders = ordersCollection

        server.listen(port, ()=>{
            console.log(`Server was created on port: ${port}`)
        })
    } catch (e){
        console.log(e)
    }
}

start()
