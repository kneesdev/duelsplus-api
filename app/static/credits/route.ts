// app/api/credits/route.ts
import { NextResponse } from "next/server"

export async function GET() {
    const credits = {
        ADMINS: [
            { name: "Venxm", link: "https://e-z.bio/venom" },
            { name: 'Nicolás "Kqt" Gurrich', link: "https://github.com/NicolasGurrich" },
            { name: "lee/wyzux", link: "https://github.com/kneesdev" },
        ],
        DEVELOPERS: [
            { name: "QIStu", link: "https://github.com/qistu" },
        ],
        TESTERS: [
            "Qukc",
            "jamie_lmao",
            "solestar",
            "ethan (sigma edater)",
            "mcd",
            "QIStu",
        ],
        DATABASE: [
            "Rod Guild",
            "Villain Arc Guild",
        ],
        SPECIAL: [
            "Frieren",
            "Nathan Bossan (who is this)",
        ],
    }

    return NextResponse.json(credits)
}