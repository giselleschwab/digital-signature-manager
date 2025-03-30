"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";


const loginFormSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(1, "Obrigatório"),
});

const registerFormSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(1, "Obrigatório"),
  confirmPassword: z.string().min(1, "Confirmar senha é obrigatório"),
});

type LoginForm = z.infer<typeof loginFormSchema>;
type RegisterForm = z.infer<typeof registerFormSchema>;

export default function LoginFormComponent() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); 

  // Configuração do formulário de login
  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const registerForm = useForm<RegisterForm>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

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
      } else {
        throw new Error();
      }
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
        setErrorMessage("As senhas não coincidem.");
        return;
      }

      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          password: values.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Cadastro realizado com sucesso!");
        setErrorMessage(""); // Limpa a mensagem de erro em caso de sucesso
        setDialogOpen(false); // Fecha o modal
      } else {
        setErrorMessage(data.error || "Erro ao registrar usuário.");
      }
    } catch {
      setErrorMessage("Erro ao registrar usuário.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Painel informativo */}
      <div className="w-full sm:w-2/3 md:w-3/5 bg-[#383838] text-white p-8 relative">
        <div className="max-w-md ml-auto mt-30 mr-8">
          <h2 className="text-3xl text-right">
            Simplifique sua assinatura de documentos.
          </h2>
          <p className="mt-4 text-3xl font-bold text-right">
            Rápido, seguro e digital.
          </p>
        </div>
        <Image
          src="/image-login.svg"
          alt="Imagem explicativa"
          className="absolute bottom-0 left-0 hidden sm:block"
          width={400}
          height={500}
        />
      </div>

      {/* Painel de formulários */}
      <div className="w-full sm:w-1/3 md:w-2/5 bg-[#D9D9D9] flex items-center justify-center p-8 flex-1">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
          {/* Formulário de Login */}
          <Form {...loginForm}>
            <form
              onSubmit={loginForm.handleSubmit(onLoginSubmit)}
              className="space-y-4"
            >
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
                      <Input
                        type="password"
                        placeholder="Digite sua senha"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {loading && <p className="mt-4">Aguarde...</p>}
              {!loading && (
                <Button
                  className="w-full bg-[#30A949] cursor-pointer hover:bg-[#5CCF7F] transition-all duration-300"
                  type="submit"
                >
                  Entrar
                </Button>
              )}
            </form>
          </Form>

          <div className="mt-4 text-center">
            <Button
              variant="link"
              className="cursor-pointer"
              onClick={() => setDialogOpen(true)}
            >
              Novo por aqui? Cadastre-se!
            </Button>
          </div>

          {/* Modal de Registro */}
          <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger />
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Cadastro</DialogTitle>
                <DialogDescription>
                  Crie uma nova conta para acessar nossos serviços.
                </DialogDescription>
              </DialogHeader>

              {errorMessage && (
                <Alert variant="destructive" className="mb-4">
                  <AlertTitle>Erro</AlertTitle>
                  <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
              )}

              <Form {...registerForm}>
                <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)}>
                  <FormField
                    control={registerForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="mb-4">
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
                      <FormItem className="mb-4">
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
                      <FormItem className="mb-4">
                        <FormLabel>Senha</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Digite sua senha"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={registerForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem className="mb-4">
                        <FormLabel>Repetir Senha</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Repita sua senha"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full mt-8">
                    Registrar
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
