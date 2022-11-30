import { ObjectId } from "mongodb";
import Product from "./Product";
import User from "./User";

export default class Order{
    constructor(public id: ObjectId, public products: Product[], public user: User, public address: string){}
}