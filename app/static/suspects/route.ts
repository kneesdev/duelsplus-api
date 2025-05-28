import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(req: NextRequest) {
    const reports = await prisma.report.findMany({
        where: {
            status: "pending",
        },
        select: {
            reportedId: true,
            reason: true,
        },
    })
    return NextResponse.json(reports)
}