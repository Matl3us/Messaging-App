"use client";

import { PenLine, UserPlus } from "lucide-react";
import { ArchiveX } from "lucide-react";

import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { useEffect, useState } from "react";
import { useFriends } from "@/hooks/useFriends";
import UserItemScroll from "@/components/element/user-item-scroll";
import {
  useConversations,
  useCreateGroup,
  useCreatePrivateConv,
} from "@/hooks/useConversations";
import ConversationItem from "@/components/element/conversation-item";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { groupCreationSchema } from "@/lib/zod-schemas";

type UserData = {
  id: string;
  username: string;
  imageUrl: string;
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { friends, loadingFriends } = useFriends();
  const { conversations, loadingConversations, refreshConversations } =
    useConversations();

  const createInvite = useCreatePrivateConv(refreshConversations);
  const createGroup = useCreateGroup(refreshConversations);

  const [opened, setOpened] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [friendName, setFriendName] = useState("");
  const [userData, setUserData] = useState<UserData>({
    id: "",
    username: "",
    imageUrl: "",
  });

  const groupForm = useForm<z.infer<typeof groupCreationSchema>>({
    resolver: zodResolver(groupCreationSchema),
    defaultValues: {
      name: "",
      userIds: [],
    },
  });

  function onSubmit(values: z.infer<typeof groupCreationSchema>) {
    createGroup(values.name, values.userIds, setDialogOpen);
  }

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const item = localStorage.getItem("userData");
    if (item) {
      const obj = JSON.parse(item) as UserData;
      setUserData(obj);
    }
    setIsMounted(true);
  }, []);

  const changeInputState = () => {
    if (opened) {
      setOpened(false);
      setFriendName("");
    } else {
      setOpened(true);
    }
  };

  const filteredFriends = friends.filter((item) =>
    item?.user?.username.includes(friendName)
  );

  if (!isMounted) {
    return null;
  }

  return (
    <div className="flex h-full overflow-hidden">
      <div className="min-w-80 p-8 bg-background-900">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-medium">Chat</h1>
          <div className="flex gap-3">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger>
                <UserPlus
                  size="36"
                  className="pl-[6px] pr-[2px] hover:bg-background-700 bg-background-800 text-background-400 rounded-lg"
                />
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create group</DialogTitle>
                </DialogHeader>
                <Form {...groupForm}>
                  <form
                    onSubmit={groupForm.handleSubmit(onSubmit)}
                    className="space-y-4"
                  >
                    <FormField
                      control={groupForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Group name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={groupForm.control}
                      name="userIds"
                      render={() => (
                        <FormItem className="space-y-0">
                          <FormLabel>Invite users to the group</FormLabel>
                          <div className="w-72 max-h-48 overflow-scroll">
                            {friends.map((item) => (
                              <FormField
                                key={item.user.id}
                                control={groupForm.control}
                                name="userIds"
                                render={({ field }) => {
                                  return (
                                    <FormItem
                                      key={item.user.id}
                                      className="ml-2 w-64"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          className="relative top-11 left-56"
                                          checked={field.value?.includes(
                                            item.user.id
                                          )}
                                          onCheckedChange={(checked) => {
                                            return checked
                                              ? field.onChange([
                                                  ...field.value,
                                                  item.user.id,
                                                ])
                                              : field.onChange(
                                                  field.value?.filter(
                                                    (value) =>
                                                      value !== item.user.id
                                                  )
                                                );
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className="ml-4">
                                        <UserItemScroll
                                          key={item.id}
                                          id={item.user?.id}
                                          username={item.user?.username}
                                          imageUrl={item.user?.imageUrl}
                                          onSubmit={() => {}}
                                        />
                                      </FormLabel>
                                    </FormItem>
                                  );
                                }}
                              />
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit">Create</Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
            <button>
              <PenLine
                size="36"
                className="p-1 hover:bg-background-700 bg-background-800 text-background-400 rounded-lg"
                onClick={() => changeInputState()}
              />
            </button>
          </div>
        </div>
        {opened && (
          <div className="mt-4">
            <Input
              className="z-10"
              placeholder="Search"
              onChange={(e) => setFriendName(e.target.value)}
              value={friendName}
            />
            <div className="relative top-1 flex flex-col gap-1 bg-background-950 p-2 max-h-48 rounded-b-md overflow-y-scroll">
              {loadingFriends && <Skeleton className="mt-6 w-50 h-12" />}
              {filteredFriends.length === 0 ? (
                <p className="text-center text-background-200 text-sm font-medium">
                  No friends found
                </p>
              ) : (
                filteredFriends.map((e) => (
                  <UserItemScroll
                    key={e.id}
                    id={e.user?.id}
                    username={e.user?.username}
                    imageUrl={e.user?.imageUrl}
                    onSubmit={createInvite}
                  />
                ))
              )}
            </div>
          </div>
        )}
        <Separator className="mt-5" />
        {!loadingConversations && conversations.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-background-500 text-sm font-medium">
            <ArchiveX size="36" />
            <p className="text-center">No conversations started</p>
          </div>
        )}
        <div className="mt-6 flex flex-col gap-3">
          {conversations.map((e) => (
            <ConversationItem
              key={e.id}
              id={e.id}
              name={e.name}
              isGroup={e.isGroup}
              memberId={userData?.id}
              members={e.members}
              lastMessage={e?.messages[0]}
            />
          ))}
        </div>
      </div>
      <div className="flex-auto">{children}</div>
    </div>
  );
}
