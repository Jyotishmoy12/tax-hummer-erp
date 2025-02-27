import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "khusdfsfhkjdsnahk"

export function signToken(payload:object, expiresIn="1d"){
    return jwt.sign(payload, JWT_SECRET, {expiresIn})
}
export function verifyToken(token:string){
    try {
        return jwt.verify(token, JWT_SECRET)
    } catch (error) {
        return null;
    }
}