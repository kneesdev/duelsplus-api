import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getUserId } from "@/lib/auth"

export async function GET(req: NextRequest) {
    console.log("[middleware:GET] Incoming request")
    const userId = getUserId(req)
    console.log("[middleware:GET] Extracted userId:", userId)

    if (!userId) {
        console.warn("[middleware:GET] Unauthorized: Missing or invalid token")
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { username: true, hypixelApiKey: true },
        })

        if (!user) {
            console.warn(`[middleware:GET] User not found for id: ${userId}`)
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }

        console.log(`[middleware:GET] Hypixel API key retrieved for user: ${user.username}`)
        return NextResponse.json({ hypixelApiKey: user.hypixelApiKey })
    } catch (error) {
        console.error("[middleware:GET] Failed to fetch Hypixel API key:", error)
        return NextResponse.json({ error: "Failed to fetch Hypixel API key" }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    console.log("[middleware:POST] Incoming request")
    const userId = getUserId(req)
    console.log("[middleware:POST] Extracted userId:", userId)

    if (!userId) {
        console.warn("[middleware:POST] Unauthorized: Missing or invalid token")
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    console.log("[middleware:POST] Request body:", body)
    const hypixelApiKey = body.hypixelApiKey

    if (hypixelApiKey === undefined) {
        console.warn("[middleware:POST] Hypixel API key is missing from request body")
        return NextResponse.json({ error: "Hypixel API key is required" }, { status: 400 })
    }

    try {
        await prisma.user.update({
            where: { id: userId },
            data: { hypixelApiKey },
        })
        console.log(`[middleware:POST] Hypixel API key updated for userId: ${userId}`)
        return NextResponse.json({ message: "Hypixel API key updated successfully" })
    } catch (error) {
        console.error("[middleware:POST] Failed to update Hypixel API key:", error)
        return NextResponse.json({ error: "Failed to update Hypixel API key" }, { status: 500 })
    }
}