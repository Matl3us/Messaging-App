import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { getUserData } from "@/lib/jwt";
import { NextApiResponse } from "next";
import { db } from "@/lib/db";

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

export async function PUT(req: Request, res: NextApiResponse) {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value!;
  let reqData;
  try {
    reqData = await req.json();
  } catch (err) {
    return new NextResponse("Invalid body data.", {
      status: 400,
    });
  }

  const { imageUrl } = reqData;

  if (!imageUrl) {
    return new NextResponse("Image Url missing.", {
      status: 400,
    });
  }

  try {
    const user = await getUserData(token);

    if (!user) {
      return new NextResponse("Invalid user.", {
        status: 400,
      });
    }

    await db.user.update({
      data: {
        imageUrl,
      },
      where: {
        id: user.id,
      },
    });

    return NextResponse.json(
      { msg: "Profile image updated" },
      {
        status: 200,
      }
    );
  } catch (err) {
    console.log(err);
    return new NextResponse("Invalid token.", {
      status: 400,
    });
  }
}
