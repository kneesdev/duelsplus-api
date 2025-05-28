import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(req: NextRequest) {
    const reports = await prisma.report.findMany({
        where: {
            status: "pending",
        },
    })
    return NextResponse.json(reports)
}