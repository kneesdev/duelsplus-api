import { NextRequest, NextResponse } from "next/server"

export async function GET() {
    const params = new URLSearchParams({
        client_id: process.env.DISCORD_CLIENT_ID!,
        redirect_uri: process.env.DISCORD_REDIRECT_URI!,
        response_type: "code",
        scope: "identify email",
    })

    const url = `https://discord.com/api/oauth2/authorize?${params.toString()}`
    return NextResponse.json({ url })
}