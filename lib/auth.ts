import jwt from "jsonwebtoken"
import { NextRequest } from "next/server"

export function getUserId(req: NextRequest): string | null {
    const auth = req.headers.get("authorization")
    const token = auth?.replace("Bearer ", "")
    if (!token) return null

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET!) as { sub: string }
        return payload.sub
    } catch {
        return null
    }
}

export function isValidClientRequest(req: NextRequest): boolean {
    const auth = req.headers.get("authorization")
    const token = auth?.replace("Bearer ", "")
    if (!token) return false

    return token === process.env.CLIENT_SECRET
}