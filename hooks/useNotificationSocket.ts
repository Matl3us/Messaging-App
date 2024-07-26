import { useSocket } from "@/components/providers/socket-provider";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

type NotificationProps = {
  invites: NotificationItem[];
  setInvites: Dispatch<SetStateAction<NotificationItem[]>>;
};

type NotificationItem = {
  id: string;
  sender: {
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

export const useNotificationSocket = ({
  invites,
  setInvites,
}: NotificationProps) => {
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
    const notificationAddKey = `user:${userData.id}:notification:add`;
    const notificationRemoveKey = `user:${userData.id}:notification:remove`;

    socket.on(notificationAddKey, (notification: NotificationItem) => {
      if (notification) {
        setInvites(invites.concat(notification));
      }
    });

    socket.on(notificationRemoveKey, (notificationId: string) => {
      if (notificationId) {
        setInvites(invites.filter((i) => i.id != notificationId));
      }
    });

    return () => {
      socket.off(notificationAddKey, notificationRemoveKey);
    };
  }, [socket, setInvites, invites, userData.id]);
};
