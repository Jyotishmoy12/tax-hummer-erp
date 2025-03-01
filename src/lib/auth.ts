import jwt, { Secret, SignOptions, JwtPayload } from "jsonwebtoken"

const JWT_SECRET: Secret = process.env.JWT_SECRET || "khusdfsfhkjdsnahk"

export function signToken(payload: object, expiresIn: string | number = "1d") {
    return jwt.sign(payload, JWT_SECRET, { expiresIn } as SignOptions)
}

export function verifyToken(token: string): JwtPayload | null {
    try {
        return jwt.verify(token, JWT_SECRET) as JwtPayload
    } catch (error) {
        return null;
    }
}