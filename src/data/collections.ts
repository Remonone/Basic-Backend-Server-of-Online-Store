import mongodb from "mongodb";

export const collections: {users?: mongodb.Collection, products?: mongodb.Collection, orders?: mongodb.Collection} = {}