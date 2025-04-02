import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { UserRepositoryPrisma } from "@/backend/user/UserRepositoryPrisma";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Todos os campos são obrigatórios" }, { status: 400 });
    }

    const userRepository = new UserRepositoryPrisma();

    // Verifica se o usuário já existe
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      return NextResponse.json({ error: "E-mail já cadastrado" }, { status: 400 });
    }

    // Criptografa a senha antes de salvar
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criar o usuário
    const newUser = await userRepository.create({ name, email, password: hashedPassword });

    return NextResponse.json({ message: "Usuário cadastrado com sucesso!", user: newUser }, { status: 201 });
  } catch (error) {
    console.error("Erro ao registrar o usuário:", error);
    return NextResponse.json({ error: "Erro ao registrar o usuário" }, { status: 500 });
  }
}
