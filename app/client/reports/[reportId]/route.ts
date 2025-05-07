import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { isValidClientRequest } from "@/lib/auth"

export async function GET(
    req: NextRequest,
    { params }: { params: { reportId: string } }
) {
    if (!isValidClientRequest(req)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const report = await prisma.report.findUnique({
        where: { id: params.reportId },
    })

    if (!report) {
        return NextResponse.json({ error: "Report not found" }, { status: 404 })
    }

    return NextResponse.json(report)
}

export async function POST(
    req: NextRequest,
    { params }: { params: { reportId: string } }
) {
    if (!isValidClientRequest(req)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { status } = await req.json()

    if (!status) {
        return NextResponse.json({ error: "Missing status" }, { status: 400 })
    }

    const updated = await prisma.report.update({
        where: { id: params.reportId },
        data: { status },
    })

    return NextResponse.json(updated)
}