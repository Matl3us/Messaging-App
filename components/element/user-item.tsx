import Image from "next/image";

interface UserItemProps {
  username: string;
  imageUrl: string;
  type: "friend" | "invitation" | "notification";
}

const UserItem = ({ username, imageUrl, type }: UserItemProps) => {
  return (
    <div className="flex items-center justify-between bg-background-800 hover:bg-background-700 rounded-md p-3">
      <div className="flex items-center gap-4">
        <Image
          className="rounded-lg"
          src={imageUrl}
          placeholder="empty"
          alt="Avatar"
          width="40"
          height="40"
          unoptimized
        />
        <p className="text-background-50">{username}</p>
      </div>
    </div>
  );
};

export default UserItem;
