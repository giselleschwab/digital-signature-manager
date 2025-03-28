import { User } from "./User";
import { UserRepository } from "./UserRepository";

export class UserRepositoryMemory implements UserRepository {
    private users: User[] = [
        new User("1", "Giselle", "giselleschwab@gmail.com", "123")
    ];

    findByEmail(email: string): User {
        const user = this.users.find(user => user.email === email);
        if (!user) {
            throw new Error("User not found");
        }
        return user;
    }
}
