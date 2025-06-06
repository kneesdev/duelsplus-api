import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getUserId } from "@/lib/auth"

export async function GET(_: NextRequest, { params }: { params: { ign: string } }) {
    const { ign } = params

    try {
        const entry = await prisma.ignHistory.findFirst({
            where: { ign },
            select: { wins: true, losses: true },
        })

        if (!entry) {
            return NextResponse.json({ error: "IGN not found" }, { status: 404 })
        }

        const { wins, losses } = entry
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
        console.error("[GET /stats/[ign]] Failed:", error)
        return NextResponse.json({ error: "Internal error" }, { status: 500 })
    }
}

export async function POST(req: NextRequest, { params }: { params: { ign: string } }) {
    const userId = getUserId(req)
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { ign } = params
    let body

    try {
        body = await req.json()
    } catch {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
    }

    const { wins = 0, losses = 0 } = body

    if (typeof wins !== "number" || typeof losses !== "number") {
        return NextResponse.json({ error: "`wins` and `losses` must be numbers" }, { status: 400 })
    }

    try {
        const entry = await prisma.ignHistory.findFirst({
            where: { ign, userId },
            orderBy: { loggedAt: "desc" }, // latest use of ign by user
        })

        if (!entry) {
            return NextResponse.json({ error: "IGN not found or unauthorized" }, { status: 403 })
        }

        const updated = await prisma.ignHistory.update({
            where: { id: entry.id },
            data: {
                wins: { increment: wins },
                losses: { increment: losses },
            },
            select: { wins: true, losses: true },
        })

        return NextResponse.json({ message: "Stats updated", stats: updated })
    } catch (error) {
        console.error("[POST /stats/[ign]] Failed:", error)
        return NextResponse.json({ error: "Failed to update stats" }, { status: 500 })
    }
}