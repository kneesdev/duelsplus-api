import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { isValidClientRequest } from "@/lib/auth";

export async function POST(req: NextRequest) {
    if (!isValidClientRequest(req)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { discordId, ban } = await req.json();

    if (!discordId || typeof ban !== "boolean") {
        return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
        where: { discordId },
    });

    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.isBanned && ban) {
        return NextResponse.json({ error: "User already banned" }, { status: 409 });
    }

    const updated = await prisma.user.update({
        where: { discordId },
        data: { isBanned: ban },
    });

    return NextResponse.json({
        message: ban ? "User banned" : "User unbanned",
        user: {
            discordId: updated.discordId,
            isBanned: updated.isBanned,
        },
    });
}
