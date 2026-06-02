import { NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/session";

export async function GET(request: Request) {
  const session = getSessionFromRequest(request);

  return NextResponse.json({
    user: session
  });
}
