import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import jwt, { JwtPayload } from "jsonwebtoken";

import { db } from "@/lib/db";

export async function GET() {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value!;

  try {
    const secret = process.env.SECRET!;
    const decoded = jwt.verify(token, secret) as JwtPayload;

    const user = await db.user.findFirst({
      where: {
        OR: [{ id: decoded.sub }, { username: decoded.username }],
      },
      select: {
        email: true,
        username: true,
        imageUrl: true,
      },
    });

    if (!user) {
      return new NextResponse("Invalid user.", {
        status: 400,
      });
    }

    return NextResponse.json(user);
  } catch (err) {
    console.log(err);
    return new NextResponse("Invalid token.", {
      status: 400,
    });
  }
}
