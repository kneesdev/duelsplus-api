import jwt from "jsonwebtoken"
import { NextRequest } from "next/server"

export function getUserId(req: NextRequest): string | null {
    const auth = req.headers.get("authorization")
    console.log("[auth:header]", auth)
    const token = auth?.replace("Bearer ", "")
    if (!token) return null
    console.log("[auth:parser]", token)

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET!) as { sub: string }
        console.log("[auth:payload]", payload.sub)
        return payload.sub
    } catch {
        console.warn("[auth] unauthorized")
        return null
    }
}

export function isValidClientRequest(req: NextRequest): boolean {
    const auth = req.headers.get("authorization")
    console.log("[auth:header]", auth)
    const token = auth?.replace("Bearer ", "")
    if (!token) return false
    console.log("[auth:parser]", token)

    return token === process.env.CLIENT_SECRET
}