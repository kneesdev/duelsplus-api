import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getUserId } from "@/lib/auth"

export async function POST(req: NextRequest) {
    const userId = getUserId(req)
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { reportedId } = await req.json()
    if (!reportedId) {
        return NextResponse.json({ error: "Missing reportedId" }, { status: 400 })
    }

    const existingReport = await prisma.report.findMany({
        where: {
            reportedId,
            status: {
                in: ["approved", "pending"], // consider as cheater if there's either approved and pending reports
            },
        },
    })

    if (existingReport.length === 0) {
        return NextResponse.json({ error: "No existing reports" }, { status: 404 })
    }

    await prisma.report.deleteMany({
        where: {
            reportedId,
            status: {
                in: ["approved", "pending"],
            },
        },
    })

    return NextResponse.json({ message: `Player has been pardoned` })
}