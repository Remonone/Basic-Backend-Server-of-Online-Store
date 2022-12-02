import { ObjectId } from "mongodb";

export default class Product {
    constructor(public name: string, public descr: string, public category: string, public id?: ObjectId){}
}