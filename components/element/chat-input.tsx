import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { useState } from "react";

import { Input } from "../ui/input";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { messageSchema } from "@/lib/zod-schemas";

import { createMessage } from "@/utils/api";
import EmojiPicker from "./emoji-picker";

interface ChatInputProps {
  conversationID: string;
}

const ChatInput = ({ conversationID }: ChatInputProps) => {
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      message: "",
    },
  });

  async function onSubmit(values: z.infer<typeof messageSchema>) {
    setLoading(true);
    await createMessage(values, conversationID);
    setLoading(false);
    form.reset();
  }

  return (
    <div className="flex items-center">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex items-center w-[550px]">
                    <Input
                      disabled={loading}
                      className="text-base dark:bg-background-800"
                      placeholder={`Write to @user`}
                      {...field}
                    />
                    <div className="hover:text-primary-700 text-primary-600 rounded-lg relative right-10 top-1">
                      <EmojiPicker
                        onChange={(emoji: string) =>
                          field.onChange(`${field.value}${emoji}`)
                        }
                      />
                    </div>
                  </div>
                </FormControl>
                <FormMessage className="absolute" />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
};

export default ChatInput;
