import { cookies } from "next/headers";
import type { NextApiRequest, NextApiResponse } from "next";

import { createUploadthing, type FileRouter } from "uploadthing/next-legacy";
import { UploadThingError } from "uploadthing/server";
import { getUserData } from "@/lib/jwt";

const f = createUploadthing();

const auth = async () => {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value!;
  const user = await getUserData(token);
  if (!user) throw new Error("Unauthorized");
  return { userId: user.id };
};

export const ourFileRouter = {
  messageImage: f({
    image: { maxFileSize: "8MB", maxFileCount: 1 },
  })
    .middleware(() => auth())
    .onUploadComplete(() => {}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
