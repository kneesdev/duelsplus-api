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
            select: { username: true, lastGamemode: true },
        })

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }

        console.log(`Last gamemode retrieved for ${user.username}: ${user.lastGamemode}`)
        return NextResponse.json({ lastGamemode: user.lastGamemode })
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch last gamemode" }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    const userId = getUserId(req)
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const gamemode = body.gamemode

    if (gamemode === undefined) {
        return NextResponse.json({ error: "Gamemode is required" }, { status: 400 })
    }

    try {
        await prisma.user.update({
            where: { id: userId },
            data: { lastGamemode: gamemode },
        })
        return NextResponse.json({ message: "Last gamemode updated successfully" })
    } catch (error) {
        return NextResponse.json({ error: "Failed to update last gamemode" }, { status: 500 })
    }
}