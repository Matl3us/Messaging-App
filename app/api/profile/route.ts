import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { getUserData } from "@/lib/jwt";

export async function GET() {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value!;

  try {
    const user = await getUserData(token);

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
