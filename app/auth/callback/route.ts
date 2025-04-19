import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import jwt from "jsonwebtoken"

export async function GET(req: NextRequest) {
    const code = req.nextUrl.searchParams.get("code")
    if (!code) return NextResponse.json({ error: "No code" }, { status: 400 })

    const tokenRes = await fetch("https://discord.com/api/oauth2/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            client_id: process.env.DISCORD_CLIENT_ID!,
            client_secret: process.env.DISCORD_CLIENT_SECRET!,
            code,
            grant_type: "authorization_code",
            redirect_uri: process.env.DISCORD_REDIRECT_URI!,
        }),
    })

    const tokenData = await tokenRes.json()
    if (!tokenData.access_token) {
        return NextResponse.json({ error: "Token exchange failed" }, { status: 401 })
    }

    const userRes = await fetch("https://discord.com/api/users/@me", {
        headers: {
            Authorization: `Bearer ${tokenData.access_token}`,
        },
    })
    const discordUser = await userRes.json()

    const user = await prisma.user.upsert({
        where: { discordId: discordUser.id },
        update: { username: discordUser.username },
        create: {
            discordId: discordUser.id,
            username: discordUser.username,
        },
    })

    const token = jwt.sign(
        { sub: user.id },
        process.env.JWT_SECRET!,
        { expiresIn: "7d" }
    )

    return NextResponse.json({ token })
}