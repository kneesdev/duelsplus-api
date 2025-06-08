import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

// in-memory cache cause we don't got redis
let cachedStats: any = null
let lastFetched = 0
const CACHE_DURATION_MS = 60 * 60 * 1000 // 1h

export async function GET(_req: NextRequest) {
    const now = Date.now()
    if (cachedStats && now - lastFetched < CACHE_DURATION_MS) {
        return NextResponse.json(cachedStats)
    }

    try {
        const data = await prisma.ignHistory.findMany({
            select: {
                wins: true,
                losses: true,
            },
        })
        
        const totalWins = data.reduce((sum, row) => sum + row.wins, 0)
        const totalLosses = data.reduce((sum, row) => sum + row.losses, 0)
        const totalGames = totalWins + totalLosses
        const winLossRatio = totalLosses === 0 ? totalWins : totalWins / totalLosses
        const winRate = totalGames === 0 ? 0 : (totalWins / totalGames) * 100
        const result = {
            globalStats: {
                totalWins,
                totalLosses,
                totalGames,
                winLossRatio: +winLossRatio.toFixed(2),
                winRate: +winRate.toFixed(2),
            },
        }
        cachedStats = result
        lastFetched = now

        return NextResponse.json(result)
    } catch (error) {
        console.error("[stats/global:GET] Failed to fetch global stats:", error)
        return NextResponse.json({ error: "Failed to fetch global stats" }, { status: 500 })
    }
}
