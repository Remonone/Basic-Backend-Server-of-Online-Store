import { ObjectId } from "mongodb";

export default class Product {
    constructor(public id: ObjectId, public name: string, public descr: string){}
}