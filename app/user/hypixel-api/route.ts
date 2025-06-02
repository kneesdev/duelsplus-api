import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getUserId } from "@/lib/auth"

export async function GET(req: NextRequest) {
    const userId = getUserId(req)
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { username: true, hypixelApiKey: true },
        })

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }

        console.log(`Hypixel API key retrieved for ${user.username}`)
        return NextResponse.json({ hypixelApiKey: user.hypixelApiKey })
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch Hypixel API key" }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    const userId = getUserId(req)
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const hypixelApiKey = body.hypixelApiKey

    if (hypixelApiKey === undefined) {
        return NextResponse.json({ error: "Hypixel API key is required" }, { status: 400 })
    }

    try {
        await prisma.user.update({
            where: { id: userId },
            data: { hypixelApiKey },
        })
        console.log("Hypixel API key updated")
        return NextResponse.json({ message: "Hypixel API key updated successfully" })
    } catch (error) {
        return NextResponse.json({ error: "Failed to update Hypixel API key" }, { status: 500 })
    }
}