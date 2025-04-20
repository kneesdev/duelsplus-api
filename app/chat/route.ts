import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getUserId } from "@/lib/auth"

export async function GET(req: NextRequest) {
    const messages = await prisma.proxyChatMessage.findMany({
        orderBy: { createdAt: "desc" },
        take: 50,
    })
    return NextResponse.json(messages)
}

export async function POST(req: NextRequest) {
    const userId = getUserId(req)
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { content } = await req.json()
    if (!content) {
        return NextResponse.json({ error: "Missing content" }, { status: 400 })
    }

    const message = await prisma.proxyChatMessage.create({
        data: {
            authorId: userId,
            content,
        },
    })
    return NextResponse.json(message)
}