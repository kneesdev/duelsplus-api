import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getUserId } from "@/lib/auth"

export async function POST(req: NextRequest) {
    const userId = getUserId(req)
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { reportedId, reason } = await req.json()
    if (!reportedId) {
        return NextResponse.json({ error: "Missing reportedId" }, { status: 400 })
    }
    
    const existingReport = await prisma.report.findFirst({
        where: {
            reportedId,
            reporterId: userId,
        },
    })

    const status = existingReport ? "duplicate" : "pending"

    const report = await prisma.report.create({
        data: {
            reportedId,
            reporterId: userId,
            reason,
            status,
        },
    })

    return NextResponse.json(report)
}