import { createHmac, timingSafeEqual } from "node:crypto";
import type { NextResponse } from "next/server";
import {
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS
} from "@/lib/sessionConstants";
import type { Role, SessionUser } from "@/types/user";

type SessionPayload = {
  exp: number;
  user: SessionUser;
};

function getSessionSecret() {
  const secret = process.env.AUTH_SECRET?.trim();

  if (!secret) {
    throw new Error("Define AUTH_SECRET en las variables de entorno.");
  }

  return secret;
}

function toBase64Url(value: string) {
  return Buffer.from(value, "utf8").toString("base64url");
}

function fromBase64Url(value: string) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function signSessionPayload(encodedPayload: string) {
  return createHmac("sha256", getSessionSecret()).update(encodedPayload).digest("base64url");
}

function parseCookieValue(cookieHeader: string | null, name: string) {
  if (!cookieHeader) {
    return null;
  }

  const cookies = cookieHeader.split(";").map((entry) => entry.trim());
  const target = cookies.find((entry) => entry.startsWith(`${name}=`));

  if (!target) {
    return null;
  }

  return decodeURIComponent(target.slice(name.length + 1));
}

function isRole(value: unknown): value is Role {
  return value === "admin" || value === "user";
}

function isSessionUser(value: unknown): value is SessionUser {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<SessionUser>;

  return (
    typeof candidate._id === "string" &&
    typeof candidate.nombre === "string" &&
    typeof candidate.email === "string" &&
    isRole(candidate.role)
  );
}

export function createSessionToken(user: SessionUser) {
  const payload: SessionPayload = {
    exp: Date.now() + SESSION_MAX_AGE_SECONDS * 1000,
    user
  };
  const encodedPayload = toBase64Url(JSON.stringify(payload));
  const signature = signSessionPayload(encodedPayload);

  return `${encodedPayload}.${signature}`;
}

export function verifySessionToken(token: string): SessionUser | null {
  if (!process.env.AUTH_SECRET) {
    return null;
  }

  const [encodedPayload, signature] = token.split(".");

  if (!encodedPayload || !signature) {
    return null;
  }

  const expectedSignature = signSessionPayload(encodedPayload);
  const providedSignature = Buffer.from(signature, "utf8");
  const expectedSignatureBuffer = Buffer.from(expectedSignature, "utf8");

  if (providedSignature.length !== expectedSignatureBuffer.length) {
    return null;
  }

  if (!timingSafeEqual(providedSignature, expectedSignatureBuffer)) {
    return null;
  }

  try {
    const payload = JSON.parse(fromBase64Url(encodedPayload)) as Partial<SessionPayload>;

    if (typeof payload.exp !== "number" || payload.exp <= Date.now()) {
      return null;
    }

    if (!isSessionUser(payload.user)) {
      return null;
    }

    return payload.user;
  } catch {
    return null;
  }
}

export function getSessionFromRequest(request: Request): SessionUser | null {
  const token = parseCookieValue(request.headers.get("cookie"), SESSION_COOKIE_NAME);

  if (!token) {
    return null;
  }

  return verifySessionToken(token);
}

export function setSessionCookie(response: NextResponse, user: SessionUser) {
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: createSessionToken(user),
    httpOnly: true,
    maxAge: SESSION_MAX_AGE_SECONDS,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production"
  });
}

export function clearSessionCookie(response: NextResponse) {
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: "",
    httpOnly: true,
    maxAge: 0,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production"
  });
}
