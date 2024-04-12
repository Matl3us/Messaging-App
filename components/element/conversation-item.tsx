import Image from "next/image";
import { useRouter } from "next/navigation";

interface ConvItemProps {
  id: string;
  name?: string;
  isGroup: boolean;
  users: Array<UserItemProps>;
}

interface UserItemProps {
  id: string;
  username: string;
  imageUrl: string;
}

const ConversationItem = ({ id, name, isGroup, users }: ConvItemProps) => {
  const router = useRouter();
  return (
    <div
      className="flex items-center justify-between bg-background-800 hover:bg-background-700 rounded-md p-3"
      onClick={() => router.push(`/conversations/${id}`)}
    >
      <div className="flex items-center gap-4">
        {isGroup ? (
          <Image
            className="rounded-lg"
            src="https://ui-avatars.com/api/?background=random&color=fff&name=user"
            placeholder="empty"
            alt="Avatar"
            width="32"
            height="32"
            unoptimized
          />
        ) : (
          <Image
            className="rounded-lg"
            src={users[0]?.imageUrl}
            placeholder="empty"
            alt="Avatar"
            width="32"
            height="32"
            unoptimized
          />
        )}

        {name ? (
          <p className="text-background-50 text-sm">{name}</p>
        ) : (
          <p className="text-background-50 text-sm">{users[0]?.username}</p>
        )}
      </div>
    </div>
  );
};

export default ConversationItem;
