import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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
import { Cloud, CloudUpload, ImagePlus } from "lucide-react";

import { UploadButton } from "@/lib/uploadthing";

interface ChatInputProps {
  name: string;
  conversationID: string;
}

const ChatInput = ({ name, conversationID }: ChatInputProps) => {
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      message: "",
      fileUrl: null,
    },
  });

  async function onSubmit(values: z.infer<typeof messageSchema>) {
    setLoading(true);
    await createMessage(values, conversationID);
    setLoading(false);
    form.reset();
    setDialogOpen(false);
  }

  return (
    <div className="flex items-center p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex items-center w-[250px] sm:w-[500px] lg:w-[850px]">
                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                      <DialogTrigger>
                        <ImagePlus className="hover:text-primary-700 text-primary-600 rounded-lg relative left-10" />
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle className="mb-4">
                            Upload image
                          </DialogTitle>
                          <div className="mx-2 p-6 border rounded-md border-background-500 flex flex-col items-center justify-center">
                            <CloudUpload size={48} />
                            <UploadButton
                              className="text-background-100 p-1 rounded-md hover:bg-background-900"
                              endpoint="messageImage"
                              onClientUploadComplete={(res) => {
                                onSubmit({
                                  message: res[0].url,
                                  fileUrl: res[0].url,
                                });
                              }}
                              onUploadError={(error: Error) => {
                                alert(`ERROR! ${error.message}`);
                              }}
                            />
                          </div>
                        </DialogHeader>
                      </DialogContent>
                    </Dialog>
                    <Input
                      autoComplete="off"
                      disabled={loading}
                      className="px-12 text-base dark:bg-background-800"
                      placeholder={`Message @${name}`}
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
