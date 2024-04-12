"use client";

import { Skeleton } from "@/components/ui/skeleton";
import UserItem from "@/components/element/user-item";

import {
  useAcceptInvite,
  useInvitesReceived,
  useRejectInvite,
} from "@/hooks/useFriends";

const Home = () => {
  const { invites, loadingInvites, refreshInvites } = useInvitesReceived();

  const acceptInvite = useAcceptInvite(refreshInvites);
  const rejectInvite = useRejectInvite(refreshInvites);

  return (
    <div className="w-[650px] mx-auto mt-12 p-12 rounded-lg bg-background-900">
      <p className="text-xl font-medium mb-4">Notifications</p>
      {loadingInvites && <Skeleton className="w-50 h-16" />}
      {!loadingInvites && invites.length === 0 && (
        <p className="mt-6 text-center text-background-500 text-sm font-medium">
          No notifications received.
        </p>
      )}
      <div>
        {invites.map((e) => (
          <UserItem
            key={e.id}
            id={e.id}
            username={e.sender?.username}
            imageUrl={e.sender?.imageUrl}
            type="notification"
            onSubmit={acceptInvite}
            onDelete={rejectInvite}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
