"use client";
import Link from "next/link";

import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/spinner";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { loginSchema } from "@/lib/zod-schemas";
import { useLogin } from "@/hooks/useLogin";

const Login = () => {
  const { login, loading } = useLogin();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof loginSchema>) {
    login(values, form);
  }

  return (
    <div className="w-[450px] mx-auto mt-24 p-12 rounded-lg bg-background-900 flex flex-col gap-4">
      <h1 className="mb-6 text-3xl font-semibold text-center text-text-500">
        Login
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
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
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Login</Button>
        </form>
      </Form>
      {loading && <LoadingSpinner />}
      <div className="flex items-center">
        <span className="text-sm">Don&apos;t have an account?</span>
        <Link href="/register">
          <Button variant="link" className="text-sm text-accent-500">
            Register
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Login;
