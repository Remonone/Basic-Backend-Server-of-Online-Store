import { ObjectId } from "mongodb";
import Product from "./Product";
import User from "./User";

export default class Order{
    constructor(public products: {product: Product, count: number}[], public user: User, public address: string, public id?: ObjectId){}
}