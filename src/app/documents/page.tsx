import { getServerAuthSession } from "@/backend/authentication/auth";
import { SignOutButton } from "../login/components/SignOutButton";

export default async function DocumentsList() {
    const session = await getServerAuthSession();
    const user = session?.user;

    return (
        <>
        <SignOutButton />

        {user && (
            <p> Bem vindo {user.name} !!!!</p>
        )}
        </>
    )
}