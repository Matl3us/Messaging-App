"use client";

import ChatInput from "@/components/element/chat-input";
import ChatMessages from "@/components/element/chat-messages";
import { useEffect, useState } from "react";
import {
  useAddToGroup,
  useChangeName,
  useConversation,
  useConversations,
} from "@/hooks/useConversations";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Ban, Check, Info, Loader2, PenLine, UserPlus } from "lucide-react";

import Image from "next/image";
import GroupIcon from "@/components/ui/group-icon";
import { Separator } from "@/components/ui/separator";
import { useFriends } from "@/hooks/useFriends";
import { Skeleton } from "@/components/ui/skeleton";
import UserItemScroll from "@/components/element/user-item-scroll";
import { Input } from "@/components/ui/input";

interface IParams {
  conversationId: string;
}

type UserData = {
  id: string;
  username: string;
  imageUrl: string;
};

const Conversation = ({ params }: { params: IParams }) => {
  const { conversationId } = params;
  const { conversation, loadingConversation } = useConversation(conversationId);
  const { friends, loadingFriends } = useFriends();
  const [friendName, setFriendName] = useState("");
  const [groupName, setGroupName] = useState("");

  const [opened, setOpened] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [changeNameOpen, setChangeNameOpen] = useState(false);

  const { refreshConversations } = useConversations();
  const addToGroup = useAddToGroup();
  const updateName = useChangeName();

  const [userData, setUserData] = useState<UserData>({
    id: "",
    username: "",
    imageUrl: "",
  });

  useEffect(() => {
    const item = localStorage.getItem("userData");
    if (item) {
      const obj = JSON.parse(item) as UserData;
      setUserData(obj);
    }
    setGroupName(conversation?.name ?? "");
  }, [conversation]);

  let name = "";
  let imageUrl = "";
  if (!loadingConversation) {
    const otherUsers = conversation?.members.filter(
      (member) => member.id !== userData.id
    );
    if (otherUsers.length > 1) {
      name = conversation?.name ? conversation?.name : otherUsers[0].username;
      imageUrl = otherUsers[0].imageUrl;
    } else {
      name = conversation?.name
        ? conversation?.name
        : conversation?.members[0].username;
      imageUrl = conversation?.members[0].imageUrl;
    }
  }

  const filteredFriends = friends.filter((item) => {
    const names = conversation?.members.map((m) => m.username);
    return (
      item.user.username.includes(friendName) &&
      !names.includes(item.user.username)
    );
  });

  return (
    <div className="flex h-full flex-col gap-2 items-center bg-background-950">
      {loadingConversation ? (
        <div className="flex flex-col flex-1 justify-center items-center">
          <Loader2 className="h-10 w-10 text-primary-600 animate-spin" />
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between px-6 w-full h-16 border-b-2 border-background-900">
            <div className="flex gap-5 items-center">
              {conversation?.isGroup ? (
                <GroupIcon members={conversation?.members} size="small" />
              ) : (
                <Image
                  className="rounded-lg"
                  src={imageUrl}
                  placeholder="empty"
                  alt="Avatar"
                  width="32"
                  height="32"
                  unoptimized
                />
              )}

              <p className="text-background-100 text-large font-semibold">
                {name}
              </p>
            </div>
            <div className="flex gap-2 items-center">
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger>
                  <Info
                    size="32"
                    className="p-1 hover:bg-background-800 text-primary-500 rounded-lg"
                  />
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="mb-6">
                      Information about this chat
                    </DialogTitle>
                    <div>
                      <div className="flex flex-col gap-2 items-center">
                        {conversation?.isGroup ? (
                          <GroupIcon
                            members={conversation?.members}
                            size="large"
                          />
                        ) : (
                          <Image
                            className="rounded-lg"
                            src={imageUrl}
                            placeholder="empty"
                            alt="Avatar"
                            width="48"
                            height="48"
                            unoptimized
                          />
                        )}

                        <div className="flex gap-2">
                          {changeNameOpen ? (
                            <>
                              <Input
                                className="h-8 text-[24px]"
                                onChange={(e) => setGroupName(e.target.value)}
                                value={groupName}
                              />
                              <Check
                                size="32"
                                className="p-1 hover:bg-background-700 text-success rounded-lg"
                                onClick={() => {
                                  if (groupName) {
                                    updateName(
                                      conversationId,
                                      groupName,
                                      setDialogOpen
                                    );
                                  }
                                }}
                              />
                              <Ban
                                size="32"
                                className="p-1 hover:bg-background-700 text-error rounded-lg"
                                onClick={() => setChangeNameOpen(false)}
                              />
                            </>
                          ) : (
                            <>
                              <p className="text-background-50 text-[24px] font-semibold">
                                {name}
                              </p>
                              <PenLine
                                size="32"
                                className="p-1 hover:bg-background-700 text-background-400 rounded-lg"
                                onClick={() => setChangeNameOpen(true)}
                              />
                            </>
                          )}
                        </div>
                      </div>
                      <Separator className="my-4" />
                      <p className="text-background-100 mb-2">Members</p>
                      <div className="flex flex-col gap-[1px]">
                        {conversation.members.map((m) => (
                          <div
                            key={m.id}
                            className="flex items-center gap-4 p-2 hover:bg-background-800 rounded-md"
                          >
                            <Image
                              className="rounded-lg"
                              src={m.imageUrl}
                              placeholder="empty"
                              alt="Avatar"
                              width="32"
                              height="32"
                              unoptimized
                            />
                            <span className="text-background-200">
                              {m.username}
                            </span>
                          </div>
                        ))}
                      </div>
                      {conversation.isGroup && (
                        <>
                          <button
                            className="flex gap-2 items-center justify-center hover:bg-background-800 py-2 pr-[12px] rounded-lg"
                            onClick={() => setOpened(!opened)}
                          >
                            <UserPlus size="36" className="pl-[6px] pr-[2px]" />
                            <p className="font-semibold mt-2">
                              Invite new members
                            </p>
                          </button>
                          {opened && (
                            <div className="mt-4">
                              <Input
                                className="z-10"
                                placeholder="Search"
                                onChange={(e) => setFriendName(e.target.value)}
                                value={friendName}
                              />
                              <div className="relative top-1 flex flex-col gap-1 bg-background-950 p-2 max-h-48 rounded-b-md overflow-y-scroll">
                                {loadingFriends && (
                                  <Skeleton className="mt-6 w-50 h-12" />
                                )}
                                {filteredFriends.length === 0 ? (
                                  <p className="text-center text-background-200 text-sm font-medium">
                                    No friends available
                                  </p>
                                ) : (
                                  filteredFriends.map((e) => (
                                    <UserItemScroll
                                      key={e.id}
                                      id={e.user?.id}
                                      username={e.user?.username}
                                      imageUrl={e.user?.imageUrl}
                                      onSubmit={(userId) =>
                                        addToGroup(
                                          conversationId,
                                          [userId],
                                          setDialogOpen
                                        )
                                      }
                                    />
                                  ))
                                )}
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <ChatMessages
            name={name}
            userId={userData.id}
            conversationId={conversationId}
            isGroup={conversation?.isGroup}
            members={conversation?.members}
            apiUrl="/api/messages"
            socketUrl="/api/socket/messages"
            imageUrl={imageUrl}
          />
          <ChatInput name={name} conversationID={conversationId} />
        </>
      )}
    </div>
  );
};

export default Conversation;
