"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { useProfile, useUpdateImage } from "@/hooks/useProfile";

import { LoadingSpinner } from "@/components/ui/spinner";
import { useState } from "react";
import {
  Circle,
  CircleMinus,
  ClipboardCopy,
  CloudUpload,
  EyeOff,
  ImageUp,
} from "lucide-react";
import { UploadButton } from "@uploadthing/react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { passwordChangeSchema } from "@/lib/zod-schemas";
import { usePasswordChange } from "@/hooks/usePasswordChange";

const Profile = () => {
  const { profile, loadingProfile } = useProfile();
  const [show, setShow] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [changePassOpen, setChangePass] = useState(false);

  const { changePassword, loadingChange } = usePasswordChange();

  const updateImage = useUpdateImage();

  const form = useForm<z.infer<typeof passwordChangeSchema>>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      newPasswordConf: "",
    },
  });

  function onSubmit(values: z.infer<typeof passwordChangeSchema>) {
    changePassword(values, form);
    setChangePass(false);
  }

  const changeInputState = () => {
    if (show) {
      setShow(false);
    } else {
      setShow(true);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(profile.friendCode);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="w-96 mx-auto mt-12 p-12 rounded-lg bg-background-900">
      <h1 className="text-2xl font-medium">Profile</h1>
      <div className="flex flex-col gap-2 mt-8 text-base text-background-50">
        {!profile.imageUrl ? (
          <Skeleton className="w-16 h-16 rounded-lg mb-4" />
        ) : (
          <div className="flex items-end">
            <Image
              className="rounded-lg mb-4"
              src={profile.imageUrl}
              placeholder="empty"
              alt="Avatar"
              width="64"
              height="64"
              unoptimized
            />
            {profile.status === "ONLINE" && (
              <span className="relative right-2 bottom-2 w-5 h-5 rounded-full bg-success" />
            )}
            {profile.status === "AWAY" && (
              <span className="relative right-2 bottom-2 w-5 h-5 rounded-full bg-warning" />
            )}
            {profile.status === "DONTDISTURB" && (
              <CircleMinus
                className="relative right-2 bottom-2 text-error rounded-full bg-black"
                size="20"
              />
            )}
            {profile.status === "OFFLINE" && (
              <Circle
                className="relative right-2 bottom-2 text-background-600 rounded-full bg-black"
                size="20"
              />
            )}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger>
                <ImageUp
                  size={32}
                  className="rounded-md hover:bg-background-800 text-primary-500 p-1"
                />
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="mb-4">Upload image</DialogTitle>
                  <div className="mx-2 p-6 border rounded-md border-background-500 flex flex-col items-center justify-center">
                    <CloudUpload size={48} />
                    <UploadButton
                      className="text-background-100 p-1 rounded-md hover:bg-background-900"
                      endpoint="messageImage"
                      onClientUploadComplete={(res) => {
                        updateImage(res[0].url);
                      }}
                      onUploadError={(error: Error) => {
                        alert(`ERROR! ${error.message}`);
                      }}
                    />
                  </div>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
        )}
        <div className="flex justify-between">
          <p>Username</p>
          {!profile.username ? (
            <Skeleton className="w-32 h-5 rounded-lg mt-2" />
          ) : (
            <p>{profile.username}</p>
          )}
        </div>
        <div className="flex justify-between items-center">
          <p>Friend code</p>
          {!profile.friendCode ? (
            <Skeleton className="w-32 h-5 rounded-lg mt-2" />
          ) : (
            <div className="flex gap-2 items-center border border-background-700 p-1 rounded-md relative left-1">
              <p className="pl-2">{show ? profile.friendCode : "**********"}</p>
              <div className="flex">
                <button>
                  <EyeOff
                    size="28"
                    className="p-1 hover:bg-background-800 text-primary-600 hover:text-primary-500 rounded-lg"
                    onClick={() => changeInputState()}
                  />
                </button>
                <button>
                  <ClipboardCopy
                    size="28"
                    className="p-1 hover:bg-background-800 text-primary-600 hover:text-primary-500 rounded-lg"
                    onClick={() => {
                      copyToClipboard();
                    }}
                  />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      {(loadingProfile || loadingChange) && <LoadingSpinner className="mt-4" />}
      <div className="mt-4">
        {changePassOpen && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="oldPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Old password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="newPasswordConf"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New password confirmation</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-4">
                <Button type="submit">Submit</Button>
              </div>
            </form>
          </Form>
        )}
        <Button
          className="mt-4"
          onClick={() => {
            setChangePass(!changePassOpen);
            form.reset();
          }}
        >
          {changePassOpen ? <span>Cancel</span> : <span>Change Password</span>}
        </Button>
      </div>
    </div>
  );
};

export default Profile;
