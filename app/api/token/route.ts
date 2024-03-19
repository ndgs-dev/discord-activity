import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    const response = await fetch(`https://discord.com/api/oauth2/token`, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
            client_id: process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID!,
            client_secret: process.env.DISCORD_CLIENT_SECRET!,
            grant_type: "authorization_code",
            code: (await request.json()).code,
        }),
    });
    const { access_token } = await response.json();
    return Response.json({ access_token });
}
