import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getUserId } from "@/lib/auth"

export async function GET(req: NextRequest) {
    const userId = getUserId(req)
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const stats = await prisma.dailyStat.findMany({
            where: { userId },
            orderBy: { date: "desc" },
        })

        return NextResponse.json(stats)
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch daily stats" }, { status: 500 })
    }
}