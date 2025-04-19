import { NextResponse } from "next/server"

function calcUptime() {
    const uptimeSeconds = process.uptime()
    const hours = Math.floor(uptimeSeconds / 3600)
    const minutes = Math.floor((uptimeSeconds % 3600) / 60)
    const seconds = Math.floor(uptimeSeconds % 60)
    return `${hours}h${minutes}m${seconds}s`
}

export async function GET() {
    return NextResponse.json({
        message: `API was been operational for ${calcUptime()}`,
    })
}