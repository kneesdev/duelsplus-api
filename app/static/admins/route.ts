import { NextResponse } from "next/server"

export async function GET() {
    const adminsEnv = process.env.ADMIN_UUIDS || "[]"
    let admins: string[] = []

    try {
        admins = JSON.parse(adminsEnv)
    } catch (error) {
        console.error("Failed to parse admins from env:", error)
        return NextResponse.json({ error: "Invalid admins format in .env" }, { status: 500 })
    }

    return NextResponse.json({ admins })
}
