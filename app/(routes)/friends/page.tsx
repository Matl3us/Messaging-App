"use client";

import UserItem from "@/components/element/user-item";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { Mail } from "lucide-react";
import { UserRoundPlus } from "lucide-react";
import { MailPlus } from "lucide-react";

import { useState } from "react";
import {
  useCancelSentInvite,
  useCreateInvite,
  useDeleteFriend,
  useFriends,
  useInvitesSent,
} from "@/hooks/useFriends";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { inviteSchema } from "@/lib/zod-schemas";

const Friends = () => {
  const { friends, loadingFriends, refreshFriends } = useFriends();
  const { invites, loadingInvites, refreshInvites } = useInvitesSent();

  const createInvite = useCreateInvite(refreshInvites);
  const cancelSentInvite = useCancelSentInvite(refreshInvites);

  const deleteFriend = useDeleteFriend(refreshFriends);

  const [opened, setOpened] = useState(false);

  const changeInputState = () => {
    if (opened) {
      form.reset();
      setOpened(false);
    } else {
      setOpened(true);
    }
  };

  const form = useForm<z.infer<typeof inviteSchema>>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      friendCode: "",
    },
  });

  function onSubmit(values: z.infer<typeof inviteSchema>) {
    form.reset();
    createInvite(values);
  }

  return (
    <div className="flex p-24 gap-24">
      <div className="min-h-96 max-w-[800px] w-96 p-12 rounded-lg bg-background-900">
        <div className="flex items-center gap-2">
          <p className="text-2xl font-medium">Friends</p>
          <button>
            <UserRoundPlus
              size="36"
              className="p-1 hover:bg-background-800 text-primary-500 rounded-lg"
              onClick={() => changeInputState()}
            />
          </button>
        </div>
        {opened && (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex mt-4 gap-1 mb-10"
            >
              <FormField
                control={form.control}
                name="friendCode"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Invite code" {...field} />
                    </FormControl>
                    <FormMessage className="absolute" />
                  </FormItem>
                )}
              />
              <button type="submit">
                <MailPlus
                  size="38"
                  className="p-1 hover:bg-background-800 text-primary-500 rounded-lg"
                />
              </button>
            </form>
          </Form>
        )}
        {loadingFriends && <Skeleton className="mt-6 w-50 h-16" />}
        {!loadingFriends && friends.length === 0 && (
          <div className="flex flex-col gap-1 h-56 items-center justify-center text-background-500 text-sm font-medium">
            <p>Friend list empty.</p>
            <p> Invite some people.</p>
          </div>
        )}
        <div className="mt-6 flex flex-col gap-3">
          {friends.map((e) => (
            <UserItem
              key={e.id}
              id={e.id}
              username={e.user?.username}
              imageUrl={e.user?.imageUrl}
              type="friend"
              onSubmit={() => {}}
              onDelete={deleteFriend}
            />
          ))}
        </div>
      </div>
      <div className="min-h-96 max-w-[800px] w-96 p-12 rounded-lg bg-background-900">
        <p className="text-2xl font-medium">Invites</p>
        {loadingInvites && <Skeleton className="mt-6 w-50 h-16" />}
        {!loadingInvites && invites.length === 0 && (
          <div className="flex flex-col gap-1 h-56 items-center justify-center">
            <Mail size="48" className="text-background-700" />
            <p className="text-background-500 text-sm font-medium">
              No invitations sent.
            </p>
          </div>
        )}
        <div className="mt-6 flex flex-col gap-3">
          {invites.map((e) => (
            <UserItem
              key={e.id}
              id={e.id}
              username={e.receiver?.username}
              imageUrl={e.receiver?.imageUrl}
              type="invitation"
              onSubmit={() => {}}
              onDelete={cancelSentInvite}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Friends;
