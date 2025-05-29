import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserId } from "@/lib/auth";

async function checkIgnExistsOnMojang(ign: string) {
    try {
        const res = await fetch(`https://api.mojang.com/users/profiles/minecraft/${ign}`);
        if (res.status === 200) {
            const data = await res.json();
            return Boolean(data && data.id);
        }
        return false;
    } catch {
        return false;
    }
}

export async function GET(req: NextRequest) {
    const userId = getUserId(req);
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const igns = await prisma.ignHistory.findMany({
        where: { userId },
        orderBy: { loggedAt: "desc" }, // last added first
        select: { id: true, ign: true, loggedAt: true },
    });

    return NextResponse.json(igns || []);
}

export async function POST(req: NextRequest) {
    const userId = getUserId(req);
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { ign } = await req.json();
    if (!ign || typeof ign !== "string") {
        return NextResponse.json({ error: "Invalid IGN" }, { status: 400 });
    }

    const existsOnMojang = await checkIgnExistsOnMojang(ign);
    if (!existsOnMojang) {
        return NextResponse.json({ error: "IGN does not exist on Mojang (are you on cracked?)" }, { status: 400 });
    }

    const existingIgn = await prisma.ignHistory.findFirst({
        where: {
            userId,
            ign,
        },
        orderBy: {
            loggedAt: "desc", // last added first
        },
    });

    // delete ign entry
    if (existingIgn) {
        await prisma.ignHistory.delete({
            where: { id: existingIgn.id },
        });
    }

    // re-create ign entry
    // with updated loggedAt
    const newIgn = await prisma.ignHistory.create({
        data: {
            ign,
            userId,
        },
    });

    return NextResponse.json(newIgn);
}