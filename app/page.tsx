"use client";
import { useAuth } from "@/components/auth-provider";

export default function Home() {
    const { auth, setAuth } = useAuth();
    if (!auth) return <div>Loading...</div>;
    return <div>{auth.user.username}</div>;
}
