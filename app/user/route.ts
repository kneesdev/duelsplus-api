import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getUserId } from "@/lib/auth"

export async function GET(req: NextRequest) {
    const userId = getUserId(req)
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({ where: { id: userId } })

    // include ign history
    const igns = await prisma.ignHistory.findMany({
        where: { userId },
        orderBy: { loggedAt: "desc" }, // last added first
        select: {
            id: true,
            ign: true,
            loggedAt: true,
        },
    });

    // include sessions
    const sessions = await prisma.session.findMany({
        where: { userId },
        orderBy: { startedAt: "desc" }, // last started first
        select: {
            id: true,
            startedAt: true,
            endedAt: true,
        },
    });

    const activeSessionIndex = sessions.findIndex(s => !s.endedAt);

    console.log({
        ...user,
        igns,
        sessions: sessions.map((session, index) => ({
            ...session,
            active: index === activeSessionIndex,
        })),
    })

    return NextResponse.json({
        ...user,
        igns,
        sessions: sessions.map((session, index) => ({
            ...session,
            active: index === activeSessionIndex,
        })),
    });
}