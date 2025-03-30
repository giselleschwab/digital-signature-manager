import { getServerAuthSession } from "@/backend/authentication/auth";
import { SignOutButton } from "../login/components/SignOutButton";
import UploadDocument from "./components/UploadDocument";

export default async function DocumentsList() {
    const session = await getServerAuthSession();
    const user = session?.user;

    return (
        <>
            <SignOutButton />
            <UploadDocument />
                {user && (
                    <p> Bem vindo {user.name} !!!!</p>
                )}
        </>
    )
}