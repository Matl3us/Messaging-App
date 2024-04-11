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

import { registerSchema } from "@/lib/zod-schemas";
import { useRegister } from "@/hooks/useRegister";

const Register = () => {
  const { register, loading } = useRegister();

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
      confPassword: "",
    },
  });

  function onSubmit(values: z.infer<typeof registerSchema>) {
    register(values, form);
  }

  return (
    <div className="w-[450px] mx-auto mt-24 p-12 rounded-lg bg-background-900 flex flex-col gap-4">
      <h1 className="mb-6 text-3xl font-semibold text-center text-text-500">
        Register
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
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input {...field} />
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
          <FormField
            control={form.control}
            name="confPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Register</Button>
        </form>
      </Form>
      {loading && <LoadingSpinner />}
      <div className="flex items-center">
        <span className="text-sm">Already have an account?</span>
        <Link href="/login">
          <Button variant="link" className="text-accent-500 text-sm">
            Login
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Register;
