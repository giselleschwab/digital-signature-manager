"use client"

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// usando o zod para validação do formulário
const formSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(1, "Obrigatório"),
})

type Form = z.infer<typeof formSchema>;

export default function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);


  const form = useForm<Form>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: Form) {
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
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
          control={form.control}
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
  )
}