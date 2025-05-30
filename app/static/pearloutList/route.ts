import { NextRequest, NextResponse } from "next/server";
import { getUserId } from "@/lib/auth"

const pearloutList = {
    "Arena": "Pearlout",
    "Backwood": "Pearl-Up",
    "Museum": "Blink",
    "Neon": "Pearlout",
    "Skyport": "None",
    "Highset": "None",
    "Reef": "Blink",
    "Fractal": "Pearlout",
    "Fight Night": "Pearl-Up",
    "Spikerock Bay": "Pearlout",
    "Christmas Town": "Pearlout",
    "Slalom Hills": "None",
    "Log Cabin": "None",
    "Santa's Workshop": "Pearl-Up",
    "Fireside": "Pearlout",
    "Lunar": "Pearlout",
    "Zhulong": "Pearlout",
    "Shan": "Pearl-Up",
}

export async function GET(req: NextRequest) {
    const userId = getUserId(req)
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    return NextResponse.json({ pearloutList });
}