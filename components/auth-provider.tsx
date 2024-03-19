"use client";
import {
    useContext,
    useEffect,
    useState,
    createContext,
    ReactNode,
} from "react";
import { setupDiscordSdk, useSdk } from "@/components/sdk";

const AuthContext = createContext<{
    auth: Auth | undefined;
    setAuth: (v: Auth | undefined) => void;
}>({ auth: undefined, setAuth: () => {} });

type Auth = AsyncReturnType<typeof setupDiscordSdk>;

type AsyncReturnType<T extends (...args: any) => any> = T extends (
    ...args: any
) => Promise<infer R>
    ? R
    : any;

export function AuthProvider({ children }: { children: ReactNode }) {
    const [auth, setAuth] = useState<Auth | undefined>();
    const discordSdk = useSdk();
    useEffect(() => {
        if (!discordSdk) return;
        setupDiscordSdk(discordSdk).then((state) => setAuth(state));
    }, [discordSdk]);
    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
