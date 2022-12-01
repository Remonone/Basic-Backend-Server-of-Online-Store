import jwt from "jsonwebtoken";

const jwtKey = process.env.JWT_SECRET_KEY as string
const jwtExpires = process.env.JWT_EXPIRES as string


export const getToken = (data: {}): string => {
    const token = jwt.sign(data, jwtKey, {
        algorithm: "HS256",
        expiresIn: parseInt(jwtExpires)
    })
    return token
}

export const convertToken = (token: string): any => {
    if(!token) return {status: 400, message: "Empty token"}
    try{
        const payload = jwt.verify(token, jwtKey)
        return payload
    }catch(e) {
        if(e instanceof jwt.JsonWebTokenError){
            return {status: 401, message: "Unauthorized"}
        }
        return {status: 400, message: "Bad Request"}
    }
}