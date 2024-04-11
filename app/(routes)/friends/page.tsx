"use client";

import UserItem from "@/components/element/user-item";
import { Skeleton } from "@/components/ui/skeleton";

import { Mail } from "lucide-react";
import { UserRoundPlus } from "lucide-react";

import { useFriends, useInvitesSent } from "@/hooks/useFriends";

const Friends = () => {
  const { friends, loadingFriends } = useFriends();
  const { invites, loadingInvites } = useInvitesSent();

  return (
    <div className="flex p-24 gap-24">
      <div className="min-h-96 max-w-[800px] w-96 p-12 rounded-lg bg-background-900">
        <p className="text-xl">Friends</p>
        {loadingFriends && <Skeleton className="mt-6 w-50 h-16" />}
        {!loadingFriends && friends.length === 0 && (
          <div className="flex flex-col gap-1 h-56 items-center justify-center text-background-500 text-sm font-medium">
            <UserRoundPlus size="48" className="text-background-700" />
            <p>Friend list empty.</p>
            <p> Invite some people.</p>
          </div>
        )}
        <div className="mt-6">
          {friends.map((e) => (
            <UserItem
              key={e.id}
              username={e.user.username}
              imageUrl={e.user.imageUrl}
              type="friend"
            />
          ))}
        </div>
      </div>
      <div className="min-h-96 max-w-[800px] w-96 p-12 rounded-lg bg-background-900">
        <p className="text-xl">Invites</p>
        {loadingInvites && <Skeleton className="mt-6 w-50 h-16" />}
        {!loadingInvites && invites.length === 0 && (
          <div className="flex flex-col gap-1 h-56 items-center justify-center">
            <Mail size="48" className="text-background-700" />
            <p className="text-background-500 text-sm font-medium">
              No invitations sent.
            </p>
          </div>
        )}
        <div className="mt-6">
          {invites.map((e) => (
            <UserItem
              key={e.id}
              username={e.user.username}
              imageUrl={e.user.imageUrl}
              type="invitation"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Friends;
