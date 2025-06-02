import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserId } from "@/lib/auth";

const VALID_TYPES = {
  pearlout: "Pearlout",
  pearlup: "PearlUp",
  blink: "Blink",
  none: "None",
} as const;

type DodgeKey = keyof typeof VALID_TYPES; // i hate typescript

export async function GET(req: NextRequest) {
    const userId = getUserId(req);
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { username: true, dodges: true },
    });

    console.log(`Dodges retrieved for ${user?.username}`)
    return NextResponse.json(user?.dodges ?? []);
}

export async function POST(req: NextRequest) {
    const userId = getUserId(req);
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { type } = await req.json();

    const lowerType = type?.toLowerCase();
    if (!Object.keys(VALID_TYPES).includes(lowerType)) {
        return NextResponse.json({
            error: `Invalid dodge type: ${type}. Valid types: ${Object.values(VALID_TYPES).join(", ")}`,
        }, { status: 400 });
    }

    const properType = VALID_TYPES[lowerType as DodgeKey]; // i hate typescript

    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { dodges: true },
    });

    const current = user?.dodges ?? [];
    let updated: string[];

    if (current.includes(properType)) {
        // toggle off (remove)
        updated = current.filter(t => t !== properType);
    } else {
        // toggle on (add)
        updated = [...current, properType];
    }

    await prisma.user.update({
        where: { id: userId },
        data: { dodges: updated },
    });

    return NextResponse.json(updated);
}
