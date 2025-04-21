import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { isValidClientRequest } from "@/lib/auth"

export async function GET(req: NextRequest) {
    if (!isValidClientRequest(req)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const discordId = searchParams.get("discordId")

    if (!discordId) {
        return NextResponse.json({ error: "Missing discordId" }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { discordId } })
    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 })
    }
    
    return NextResponse.json(user)
}