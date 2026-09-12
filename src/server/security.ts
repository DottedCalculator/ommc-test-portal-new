import { createHash } from "crypto";
import type { NextApiRequest, NextApiResponse } from "next";
import type { Session } from "next-auth";
import { getServerAuthSession } from "~/server/auth";

// Server-side admin allowlist.
// Keep this file server-only — do not import it into React/browser code.
const ADMIN_EMAILS = new Set([
  "23evanchang@gmail.com",
  "kk23907751@gmail.com",
  "billchanghaofei@gmail.com",
  "charleszhang1729@gmail.com",
  "abwang07@gmail.com",
  "suyalpranshu@gmail.com",
]);

export function isAdminEmail(email?: string | null): boolean {
  if (!email) return false;

  return ADMIN_EMAILS.has(email.trim().toLowerCase());
}

export function setNoStore(res: NextApiResponse): void {
  res.setHeader("Cache-Control", "private, no-store, max-age=0");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("X-Content-Type-Options", "nosniff");
}

export function allowMethod(
  req: NextApiRequest,
  res: NextApiResponse,
  method: "GET" | "POST"
): boolean {
  if (req.method === method) {
    return true;
  }

  res.setHeader("Allow", method);
  res.status(405).json({ message: "Method not allowed" });

  return false;
}

export async function requireUser(
  req: NextApiRequest,
  res: NextApiResponse,
  adminOnly = false
): Promise<Session | null> {
  const session = await getServerAuthSession({ req, res });

  // User must be authenticated.
  if (!session?.user?.id || !session.user.email) {
    res.status(401).json({
      message: "Authentication required",
    });

    return null;
  }

  // Admin routes additionally require an approved email.
  if (adminOnly && !isAdminEmail(session.user.email)) {
    res.status(403).json({
      message: "Forbidden",
    });

    return null;
  }

  return session;
}

// Create a stable database document ID from the authenticated user's ID.
//
// This prevents the browser from choosing which user's document
// should be read or overwritten.
export function submissionDocId(userId: string): string {
  return `user_${createHash("sha256")
    .update(userId)
    .digest("hex")}`;
}

// Custom POST routes do not automatically inherit the CSRF protection
// used by NextAuth's own authentication endpoints.
//
// Require JSON and verify that the browser's Origin matches this app.
export function allowSameOriginJson(
  req: NextApiRequest,
  res: NextApiResponse
): boolean {
  const contentType = req.headers["content-type"]
    ?.split(";")[0]
    ?.trim()
    .toLowerCase();

  if (contentType !== "application/json") {
    res.status(415).json({
      message: "Expected application/json",
    });

    return false;
  }

  const appUrl =
    process.env.NEXTAUTH_URL ||
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NODE_ENV !== "production"
      ? "http://localhost:3000"
      : undefined);

  if (!appUrl) {
    res.status(503).json({
      message: "Application origin is not configured",
    });

    return false;
  }

  let expectedOrigin: string;

  try {
    const url = new URL(appUrl);

    if (
      url.protocol !== "http:" &&
      url.protocol !== "https:"
    ) {
      throw new Error("Invalid protocol");
    }

    expectedOrigin = url.origin;
  } catch {
    res.status(503).json({
      message: "Application origin is not configured",
    });

    return false;
  }

  if (
    req.headers.origin !== expectedOrigin ||
    req.headers["sec-fetch-site"] === "cross-site"
  ) {
    res.status(403).json({
      message: "Invalid request origin",
    });

    return false;
  }

  return true;
}
