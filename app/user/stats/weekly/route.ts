import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getUserId } from "@/lib/auth"

export async function GET(req: NextRequest) {
    const userId = getUserId(req)
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const stats = await prisma.stat.findMany({
        where: { userId, type: "weekly" },
        orderBy: { createdAt: "desc" },
        take: 1,
    })
    return NextResponse.json(stats[0] || {})
}