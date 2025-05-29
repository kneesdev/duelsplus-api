import { NextRequest, NextResponse } from "next/server";
import { getUserId } from "@/lib/auth"

const pearlCoords = {
    "Arena": " §4§l¤§r §aStand at the Back-Left corner of §c23 67 -2§a and Aim for the stair at §c39 74 -2§a.\n §4§l¤§r §aStand at §c-30 68 27§a and get hit by cheater whilst holding space. Aim upwards.",
    "Backwood": " §4§l¤§r §6Aim for §c-40 72 34§6.",
    "Museum": " §4§l¤§r §eStand at §c40 71 40§e and Aim for the stair at §c41 71 36§e and blink.",
    "Neon": " §4§l¤§r §aAim for the missing barrier at §c-41 75 3§a.",
    "Skyport": " §4§l¤§r §4None.",
    "Highset": " §4§l¤§r §4None.",
    "Reef": " §4§l¤§r §eAim for the half-slab at §c41 78 -7§e. Throw another pearl forward and blink.",//
    "Fractal": " §4§l¤§r §aStand at §c28 65 -21§a and Aim for the half-slab at §c7 78 -41§a.",
    "Fight Night": " §4§l¤§r §6Line of Barriers from §c-5 75 41 §6to §c5 75 41§6.\n §4§l¤§r §6Line of Barriers from §c-5 75 -41 §6to §c5 75 -41§6.",
    "Spikerock Bay": " §4§l¤§r §aStand at §c-7 74 40 §aand aim at the fence at §c-7 77 41 §a. Pearl to §c3 80 50§a.\n §4§l¤§r §6Aim for the block behind the fence at §c-7 82 42§6.\n §4§l¤§r §6Aim for the block behind the fence at §c7 82 -42§6.",
    "Christmas Town": " §4§l¤§r §aStand at §c4 71 -16§a and Aim for the half-slab at §c4 76 -42§a.",
    "Slalom Hills": " §4§l¤§r §4None.",
    "Log Cabin": " §4§l¤§r §4None.",
    "Santa's Workshop": " §4§l¤§r §6Aim for the leaf block behind the glass at §c-17 82 4§6.\n §4§l¤§r §6Aim for the leaf block behind the glass at §c-28 82 42§6.",
    "Fireside": " §4§l¤§r §aAim for the half-slab at §c-41 93 -6§a. §4§l¤§r §aAim for the half-slab at §c41 93 6§a.",
    "Lunar": " §4§l¤§r §aAim for the stair at §c8 81 40§a.\n §4§l¤§r §aAim for the fence at §c28 85 -40§a.\n §4§l¤§r §aStand at §c11 71 -26§a and Aim for the half-slab at §c11 76 -40§a.\n §4§l¤§r §aAim for the glass pane at §c-9 86 40§a.\n §4§l¤§r §6Aim for §c39 78 29§a.",
    "Zhulong": " §4§l¤§r §aAim for the wall at §c4 81 -41§a.\n §4§l¤§r §aAim for the wall at §c-4 81 -41§a.\n §4§l¤§r §aAim for the wall at §c4 81 41§a.\n §4§l¤§r §aAim for the wall at §c-4 81 41§a.",
    "Shan": " §4§l¤§r §6Aim for the gate at §c-41 79 5§6.\n §4§l¤§r §6Aim for the gate at §c41 79 -5§6.\n §4§l¤§r §6Aim for the gate at §c41 79 5§6\n §4§l¤§r §6Aim for the gate at §c-41 79 -5§6.",
}

export async function GET(req: NextRequest) {
    const userId = getUserId(req)
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    return NextResponse.json({ pearlCoords });
}