import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import jwt from "jsonwebtoken"
import { isValidClientRequest } from "@/lib/auth"

export async function POST(req: NextRequest) {
    if (!isValidClientRequest(req)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { discordId, username } = await req.json()

    if (!discordId) {
        return NextResponse.json({ error: "Missing discordId" }, { status: 400 })
    }

    const user = await prisma.user.upsert({
        where: { discordId },
        update: username ? { username } : {},
        create: {
            discordId,
            ...(username && { username }),
        },
    })

    const token = jwt.sign(
        { sub: user.id },
        process.env.JWT_SECRET!,
        { expiresIn: "7d" }
    )

    return NextResponse.json({ token })
}