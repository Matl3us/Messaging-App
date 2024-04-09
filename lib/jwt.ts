import jwt, { JwtPayload } from "jsonwebtoken";

import { db } from "@/lib/db";

const secret = process.env.SECRET!;

export const getJwtPayload = async (token: string) => {
  const decoded = jwt.verify(token, secret) as JwtPayload;

  const user = await db.user.findFirst({
    where: {
      OR: [{ id: decoded.sub }, { username: decoded.username }],
    },
    select: {
      id: true,
      email: true,
      username: true,
      imageUrl: true,
      friendCode: true,
    },
  });

  return user;
};
