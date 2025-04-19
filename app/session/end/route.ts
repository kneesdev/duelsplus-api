import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getUserId } from "@/lib/auth"

export async function POST(req: NextRequest) {
    const userId = getUserId(req)
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const session = await prisma.session.findFirst({
        where: { userId, endedAt: null },
    })

    if (!session) {
        return NextResponse.json({ error: "No active session" }, { status: 400 })
    }

    try {
        await prisma.session.update({
            where: { id: session.id },
            data: { endedAt: new Date() },
        })
        return NextResponse.json({ message: "Session ended" })
    } catch (error) {
        return NextResponse.json({ error: "Failed to end session" }, { status: 500 })
    }
}