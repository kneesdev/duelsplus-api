import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getUserId } from "@/lib/auth"

export async function POST(req: NextRequest) {
    const userId = getUserId(req)
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const hypixelApiKey = body.hypixelApiKey

    if (!hypixelApiKey) {
        return NextResponse.json({ error: "Hypixel API key is required" }, { status: 400 })
    }

    try {
        await prisma.user.update({
            where: { id: userId },
            data: { hypixelApiKey },
        })
        return NextResponse.json({ message: "Hypixel API key updated successfully" })
    } catch (error) {
        return NextResponse.json({ error: "Failed to update Hypixel API key" }, { status: 500 })
    }
}