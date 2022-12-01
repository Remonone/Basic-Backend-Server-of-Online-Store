import { Router } from "express";
import { collections } from "../data/collections";
import bcrypt from 'bcrypt'
import User from "../modules/User";
import { convertToken, getToken } from "../utils/jwt";

const users = Router()

users.get('', (req, res) => {
    const {name, email} = req.query
    const result = collections.users?.find({name, email}).toArray()
    return res.status(200).json(result)
})

users.get('/:id', (req, res) => {
    const { id } = req.params
    const query = {id}
    const result = collections.users?.find(query).toArray()
    if(!!result) return res.status(404).json({message: 'User was not found'})
    return res.status(200).json(result)
})

users.get('/login', async (req, res) => {
    const {email, password} = req.body
    if(!(!!email && !!password)) return res.status(400).json({message: 'Invalid Body'})
    const query = {email}
    try{
        const user = (await collections.users?.findOne(query)) as unknown as User
        if(!user) return res.status(401).json({message: "Unauthorized"})
        if(bcrypt.compareSync(password, user.password)){
            const jwt = getToken({
                name: user.name,
                email: user.email
            })
            return res.status(200).json({webToken: jwt})
        }
        return res.status(401).json({message: "Unauthorized"})
    } catch(e) {
        res.status(500).json({message: e})
    }
    
})

users.post('/register', async (req, res) => {
    const {email, password, name} = req.body
    if(!(!!email && !!password && !!name)) return res.status(400).json({message: 'Invalid Body'})
    const saltRounds = 10
    const hashed_password = bcrypt.hashSync(password, saltRounds)
    const query = {email, hashed_password, name}
    collections.users?.insertOne(query)
    .catch((e) => {
        return res.status(500).json(e)
    })
    .then(result => {
        return res.status(200).json(result)
    })
    

})

users.put('/changePassword', async (req, res) => {
    const {email, old_password, new_password} = req.body
    if(!(!!email && !!old_password && !!new_password)) return res.status(400).json({message: 'Invalid Body'})
    const query = {email}
    const user = (await collections.users?.findOne(query)) as unknown as User
    if(!user) return res.status(404).json({message: "User was not found"})
    if(!bcrypt.compareSync(old_password, user.password))
        return res.status(401).json({message: "Unauthorized"})
    try{
        const query = {id: user.id}
        const newUser = new User(user.name, user.email, new_password)
        collections.users?.findOneAndReplace(query, newUser)
        .then(result => {
            return res.status(200).json(result)
        })
    } catch(e) {
        return res.status(500).json({message: e})
    }
})

users.delete('/:id', async (req, res) => {
    const {token} = req.body
    const {id} = req.params
    const data = convertToken(token)
    const query = {email: data.email}
    const user = (await collections.users?.findOne(query)) as unknown as User
    if(!user.id?.equals(id)) return res.status(403).json({message: "Different User"})
    try{
        collections.users?.deleteOne(query)
    } catch(e){
        return res.status(500).json({message: e})
    }
    return res.status(200).json({message: "Successfully deleted"})
})

export default users