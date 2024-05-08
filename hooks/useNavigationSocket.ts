import { useSocket } from "@/components/providers/socket-provider";
import { useEffect } from "react";

type NavigationSocketProps = {
  currentPage: string;
  notificationKey: string;
  messageKey: string;
  notificationCount: number;
  setNotificationCount: (notificationCount: number) => void;
  messageCount: number;
  setMessageCount: (messageCount: number) => void;
};

export const useNavigationSocket = ({
  currentPage,
  notificationKey,
  messageKey,
  notificationCount,
  setNotificationCount,
  messageCount,
  setMessageCount,
}: NavigationSocketProps) => {
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) {
      return;
    }

    socket.on(notificationKey, () => {
      if (currentPage !== "/") {
        setNotificationCount(notificationCount + 1);
      }
    });

    socket.on(messageKey, () => {
      if (!currentPage.startsWith("/conversations")) {
        setMessageCount(messageCount + 1);
      }
    });

    return () => {
      socket.off(notificationKey);
      socket.off(messageKey);
    };
  }, [
    currentPage,
    notificationKey,
    messageKey,
    notificationCount,
    setNotificationCount,
    messageCount,
    setMessageCount,
    socket,
  ]);
};
