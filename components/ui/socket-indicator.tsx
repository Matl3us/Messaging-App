"use client";

import { useSocket } from "@/components/providers/socket-provider";
import { Badge } from "@/components/ui/badge";

export const SocketIndicator = () => {
  const { isConnected } = useSocket();

  if (!isConnected) {
    return (
      <Badge className="border-yellow-500 text-yellow-500">Connecting</Badge>
    );
  }

  return (
    <Badge className="border-emerald-500 text-emerald-500">Connected</Badge>
  );
};
