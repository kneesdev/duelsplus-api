import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getUserId } from "@/lib/auth"

export async function POST(req: NextRequest) {
    const userId = getUserId(req)
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        await prisma.session.create({
            data: { userId, startedAt: new Date() },
        })
        return NextResponse.json({ message: "Session started" })
    } catch (error) {
        return NextResponse.json({ error: "Failed to start session" }, { status: 500 })
    }
}