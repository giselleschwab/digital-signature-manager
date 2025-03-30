"use client";

import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

export function SignOutButton() {
    return (
        <Button className="bg-[#30A949] cursor-pointer hover:bg-[#5CCF7F] transition-all duration-300"onClick={() => signOut()}>
            Sair
        </Button>
    );
}