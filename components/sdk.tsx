"use client";
import type { DiscordSDK } from "@discord/embedded-app-sdk";
import { useEffect, useState } from "react";

export async function setupDiscordSdk(discordSdk: DiscordSDK) {
    await discordSdk.ready();
    const { code } = await discordSdk.commands.authorize({
        client_id: process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID!,
        response_type: "code",
        state: "",
        prompt: "none",
        scope: ["identify", "guilds"],
    });
    const response = await fetch("/api/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            code,
        }),
    });
    const { access_token } = await response.json();
    return discordSdk.commands.authenticate({
        access_token,
    });
}

export function useSdk() {
    const [sdk, setSdk] = useState<DiscordSDK | undefined>();
    useEffect(() => {
        import("@discord/embedded-app-sdk")
            .then((d) => {
                if (
                    !Object.prototype.hasOwnProperty.call(window, "discordSdk")
                ) {
                    Object.defineProperty(window, "discordSdk", {
                        value: new d.DiscordSDK(
                            process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID!,
                        ),
                        writable: false,
                    });
                }
                setSdk(
                    Object.getOwnPropertyDescriptor(window, "discordSdk")!
                        .value,
                );
            })
            .catch((e) => {
                console.error(e);
            });
    }),
        [];
    return sdk;
}
