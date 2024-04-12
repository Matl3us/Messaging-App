import Image from "next/image";

interface UserItemProps {
  id: string;
  username: string;
  imageUrl: string;
  onSubmit: (id: string) => void;
}

const UserItemScroll = ({
  id,
  username,
  imageUrl,
  onSubmit,
}: UserItemProps) => {
  return (
    <div
      className="flex items-center justify-between bg-background-800 hover:bg-background-700 rounded-md p-3"
      onClick={() => onSubmit(id)}
    >
      <div className="flex items-center gap-4">
        <Image
          className="rounded-lg"
          src={imageUrl}
          placeholder="empty"
          alt="Avatar"
          width="32"
          height="32"
          unoptimized
        />
        <p className="text-background-50 text-sm">{username}</p>
      </div>
    </div>
  );
};

export default UserItemScroll;
