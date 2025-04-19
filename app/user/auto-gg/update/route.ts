import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getUserId } from "@/lib/auth"

export async function POST(req: NextRequest) {
    const userId = getUserId(req)
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const message = body.message

    if (!message) {
        return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    try {
        await prisma.user.update({
            where: { id: userId },
            data: { autoGGMessage: message },
        })
        return NextResponse.json({ message: "Auto GG message updated successfully" })
    } catch (error) {
        return NextResponse.json({ error: "Failed to update Auto GG message" }, { status: 500 })
    }
}