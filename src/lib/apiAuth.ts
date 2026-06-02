import { NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/session";

export function requireSession(request: Request) {
  const session = getSessionFromRequest(request);

  if (!session) {
    return {
      session: null,
      response: NextResponse.json({ message: "Debes iniciar sesion." }, { status: 401 })
    };
  }

  return {
    session,
    response: null
  };
}

export function requireAdminSession(request: Request) {
  const { session, response } = requireSession(request);

  if (response) {
    return response;
  }

  if (session.role !== "admin") {
    return NextResponse.json(
      { message: "No tienes permisos para realizar esta accion." },
      { status: 403 }
    );
  }

  return null;
}
