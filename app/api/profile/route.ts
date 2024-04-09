import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { getJwtPayload } from "@/lib/jwt";

export async function GET() {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value!;

  try {
    const user = await getJwtPayload(token);

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
