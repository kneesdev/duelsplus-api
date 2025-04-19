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
            select: { hypixelApiKey: true },
        })

        if (!user || !user.hypixelApiKey) {
            return NextResponse.json({ error: "No Hypixel API key set" }, { status: 400 })
        }

        return NextResponse.json({ hypixelApiKey: user.hypixelApiKey })
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch Hypixel API key" }, { status: 500 })
    }
}
