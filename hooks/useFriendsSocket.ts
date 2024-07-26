import { useSocket } from "@/components/providers/socket-provider";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

type FriendsProps = {
  friends: FriendItem[];
  setFriends: Dispatch<SetStateAction<FriendItem[]>>;
  invites: InviteItem[];
  setInvites: Dispatch<SetStateAction<InviteItem[]>>;
};

type FriendItem = {
  id: string;
  user: {
    id: string;
    username: string;
    imageUrl: string;
  };
};

type InviteItem = {
  id: string;
  receiver: {
    id: string;
    username: string;
    imageUrl: string;
  };
};

type UserData = {
  id: string;
  username: string;
  imageUrl: string;
};

export const useFriendsSocket = ({
  friends,
  setFriends,
  invites,
  setInvites,
}: FriendsProps) => {
  const { socket } = useSocket();
  const [userData, setUserData] = useState<UserData>({
    id: "",
    username: "",
    imageUrl: "",
  });

  useEffect(() => {
    if (!socket) {
      return;
    }

    const item = localStorage.getItem("userData");
    if (item) {
      const obj = JSON.parse(item) as UserData;
      setUserData(obj);
    }
    const friendAddKey = `user:${userData.id}:friend:add`;
    const friendRemoveKey = `user:${userData.id}:friend:remove`;
    const inviteRemoveKey = `user:${userData.id}:invite:remove`;

    socket.on(friendAddKey, (friend: FriendItem) => {
      if (friend) {
        setInvites(invites.filter((i) => i.id != friend.id));
        setFriends(friends.concat(friend));
      }
    });

    socket.on(friendRemoveKey, (friendId: string) => {
      if (friendId) {
        setFriends(friends.filter((f) => f.id != friendId));
      }
    });

    socket.on(inviteRemoveKey, (inviteId: string) => {
      if (inviteId) {
        setInvites(invites.filter((i) => i.id != inviteId));
      }
    });

    return () => {
      socket.off(friendAddKey, friendRemoveKey, inviteRemoveKey);
    };
  }, [socket, setInvites, invites, setFriends, friends, userData.id]);
};
