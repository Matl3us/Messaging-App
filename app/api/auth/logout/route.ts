import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({
    msg: "Success",
  });

  response.cookies.set({
    name: "token",
    value: "",
    path: "/",
    maxAge: -1,
    httpOnly: false,
    sameSite: "strict",
  });

  return response;
}
