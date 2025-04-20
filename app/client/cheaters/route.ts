import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { isValidClientRequest } from "@/lib/auth"

export async function GET(req: NextRequest) {
    if (!isValidClientRequest(req)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const cheaters = await prisma.cheater.findMany()
    return NextResponse.json(cheaters)
}