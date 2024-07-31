import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { getUserData } from "@/lib/jwt";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value!;

  const searchParams = req.nextUrl.searchParams;
  const id = searchParams.get("id");

  if (!id) {
    return new NextResponse("Invalid conversation ID.", {
      status: 400,
    });
  }

  try {
    const user = await getUserData(token);
    if (!user) {
      return new NextResponse("Invalid request.", {
        status: 400,
      });
    }

    const conversation = await db.conversation.findFirst({
      where: {
        id,
        members: {
          some: {
            id: user.id,
          },
        },
      },
      include: {
        members: {
          select: {
            id: true,
            username: true,
            imageUrl: true,
            status: true,
          },
        },
      },
    });

    return NextResponse.json(conversation);
  } catch (err) {
    console.log(err);

    return new NextResponse("Internal server error.", {
      status: 500,
    });
  }
}
