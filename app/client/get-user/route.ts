import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { isValidClientRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
    if (!isValidClientRequest(req)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const discordId = searchParams.get("discordId");

    if (!discordId) {
        return NextResponse.json({ error: "Missing discordId" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
        where: { discordId },
    });

    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // include ign history
    const igns = await prisma.ignHistory.findMany({
        where: { userId: user.id },
        orderBy: { loggedAt: "desc" }, // last added first
        select: {
            id: true,
            ign: true,
            loggedAt: true,
        },
    });

    // include sessions
    const sessions = await prisma.session.findMany({
        where: { userId: user.id },
        orderBy: { startedAt: "desc" }, // last started first
        select: {
            id: true,
            startedAt: true,
            endedAt: true,
        },
    });

    const activeSessionIndex = sessions.findIndex(s => !s.endedAt);

    return NextResponse.json({
        ...user,
        igns,
        sessions: sessions.map((session, index) => ({
            ...session,
            active: index === activeSessionIndex,
        })),
    });
}