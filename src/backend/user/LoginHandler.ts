import { UserRepository } from "./UserRepository";

type LoginInput = {
    email: string;
    password: string;
}

type LoginOutput = {
    id: string;
    name: string;
    email: string;
}

export class LoginHandler {
    constructor(readonly userRepo: UserRepository) {}

    execute(input: LoginInput): LoginOutput | null {
        try {
            const user = this.userRepo.findByEmail(input.email);
            if (user.password !== input.password) {
                throw new Error("Invalid password");
            }
            return {
                id: user.id,
                name: user.name,
                email: user.email,
            };
        } catch {
            return null;
        }
    }

}