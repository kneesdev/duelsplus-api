import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getUserId } from "@/lib/auth"

export async function GET(req: NextRequest) {
    const userId = getUserId(req)
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const igns = await prisma.ignHistory.findMany({
            where: { userId },
            select: { wins: true, losses: true },
        })

        const wins = igns.reduce((sum, ign) => sum + ign.wins, 0)
        const losses = igns.reduce((sum, ign) => sum + ign.losses, 0)
        const totalGames = wins + losses
        const winLossRatio = losses === 0 ? wins : wins / losses
        const winRate = totalGames === 0 ? 0 : (wins / totalGames) * 100

        return NextResponse.json({
            stats: {
                wins,
                losses,
                winLossRatio: +winLossRatio.toFixed(2),
                winRate: +winRate.toFixed(2),
            },
        })
    } catch (error) {
        console.error("[stats:GET] Failed to retrieve stats:", error)
        return NextResponse.json({ error: "Failed to retrieve stats" }, { status: 500 })
    }
}
