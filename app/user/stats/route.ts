import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getUserId } from "@/lib/auth"

export async function GET(req: NextRequest) {
    console.log("[middleware:GET] Incoming request")
    const userId = getUserId(req)
    console.log("[middleware:GET] Extracted userId:", userId)

    if (!userId) {
        console.warn("[middleware:GET] Unauthorized: Missing or invalid token")
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { wins: true, losses: true },
        })

        if (!user) {
            console.warn(`[middleware:GET] User not found for id: ${userId}`)
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }

        const { wins, losses } = user
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
        console.error("[middleware:GET] Failed to retrieve stats:", error)
        return NextResponse.json({ error: "Failed to retrieve stats" }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    console.log("[middleware:POST] Incoming request")
    const userId = getUserId(req)
    console.log("[middleware:POST] Extracted userId:", userId)

    if (!userId) {
        console.warn("[middleware:POST] Unauthorized: Missing or invalid token")
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    let body
    try {
        body = await req.json()
    } catch (error) {
        console.warn("[middleware:POST] Invalid JSON body")
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
    }

    const { wins = 0, losses = 0 } = body

    if (typeof wins !== "number" || typeof losses !== "number") {
        console.warn("[middleware:POST] Invalid types for wins or losses")
        return NextResponse.json({ error: "`wins` and `losses` must be numbers" }, { status: 400 })
    }

    try {
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                wins: { increment: wins },
                losses: { increment: losses },
            },
            select: { wins: true, losses: true },
        })

        console.log(`[middleware:POST] Updated stats for userId ${userId}:`, updatedUser)
        return NextResponse.json({ message: "Stats updated", stats: updatedUser })
    } catch (error) {
        console.error("[middleware:POST] Failed to update stats:", error)
        return NextResponse.json({ error: "Failed to update stats" }, { status: 500 })
    }
}