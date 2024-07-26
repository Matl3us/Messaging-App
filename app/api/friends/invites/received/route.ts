import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { getUserData } from "@/lib/jwt";
import { db } from "@/lib/db";

export async function GET() {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value!;
  const user = await getUserData(token);

  if (!user) {
    return new NextResponse("Invalid request.", {
      status: 400,
    });
  }

  try {
    const invitesList = await db.friendRequest.findMany({
      where: {
        receiverId: user.id,
        status: "PENDING",
      },
      select: {
        id: true,
        sender: {
          select: {
            id: true,
            username: true,
            imageUrl: true,
          },
        },
      },
    });

    return NextResponse.json(invitesList);
  } catch (err) {
    console.log(err);

    return new NextResponse("Internal server error.", {
      status: 500,
    });
  }
}
