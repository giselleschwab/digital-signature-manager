"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

// Usando o zod para validação do formulário
const loginFormSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(1, "Obrigatório"),
});

const registerFormSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"), // Campo de nome adicionado
  email: z.string().email("E-mail inválido"),
  password: z.string().min(1, "Obrigatório"),
  confirmPassword: z.string().min(1, "Confirmar senha é obrigatório"),
});

type LoginForm = z.infer<typeof loginFormSchema>;
type RegisterForm = z.infer<typeof registerFormSchema>;

export default function LoginFormComponent() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setDialogOpen] = useState(false); // Controla a abertura do modal

  // UseForm para o formulário de login
  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // UseForm para o formulário de registro
  const registerForm = useForm<RegisterForm>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Função de Login
  async function onLoginSubmit(values: LoginForm) {
    try {
      setLoading(true);
      const res = await signIn("credentials", {
        redirect: false,
        ...values,
      });
      if (res?.ok) {
        toast.success("Usuário logado com sucesso!");
        router.push("/documents");
      } else throw new Error();
    } catch {
      toast.error("Usuário/Senha inválido(s).");
    } finally {
      setLoading(false);
    }
  }

  // Função de Registro
  async function onRegisterSubmit(values: RegisterForm) {
    try {
      setLoading(true);
      // Verifica se as senhas coincidem
      if (values.password !== values.confirmPassword) {
        toast.error("As senhas não coincidem.");
        return;
      }

      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: values.name, // Envia o nome
          email: values.email,
          password: values.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Cadastro realizado com sucesso!");
        setDialogOpen(false); // Fecha o modal
      } else {
        toast.error(data.error || "Erro ao registrar usuário.");
      }
    } catch {
      toast.error("Erro ao registrar usuário.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {/* Formulário de Login */}
      <Form {...loginForm}>
        <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
          <FormField
            control={loginForm.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-mail</FormLabel>
                <FormControl>
                  <Input placeholder="Digite seu e-mail" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={loginForm.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Senha</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Digite sua senha" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {loading && <p className="mt-4">Aguarde...</p>}
          {!loading && <Button type="submit">Entrar</Button>}
        </form>
      </Form>

      {/* Campo de Registrar com o Modal */}
      <div className="mt-4 text-center">
        <Button variant="link" onClick={() => setDialogOpen(true)}>Registrar</Button>
      </div>

      {/* Modal de Registrar */}
      <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger />
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cadastro</DialogTitle>
            <DialogDescription>
              Crie uma nova conta para acessar nossos serviços.
            </DialogDescription>
          </DialogHeader>

          {/* Formulário de Cadastro */}
          <Form {...registerForm}>
            <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)}>
              {/* Campo de Nome */}
              <FormField
                control={registerForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite seu nome" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={registerForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite seu e-mail" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={registerForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Digite sua senha" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={registerForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Repetir Senha</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Repita sua senha" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Registrar</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
