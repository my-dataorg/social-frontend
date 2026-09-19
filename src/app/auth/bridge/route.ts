import { signIn } from "@/auth";
import { bridgeDestination, safeNextPath } from "@/lib/auth-bridge";
import { NextRequest } from "next/server";

const platformApi = (
  process.env.PLATFORM_API_URL || "http://127.0.0.1:8002"
).replace("://localhost", "://127.0.0.1");

type HandoffInput = {
  code?: string;
  next?: string;
  embed?: string;
};

async function bridge(request: NextRequest, input: HandoffInput) {
  const code = input.code?.trim();
  const nextPath = safeNextPath(input.next);
  const embedded = input.embed === "1";
  if (!code) {
    return Response.redirect(new URL("/login", request.nextUrl.origin));
  }

  const exchange = await fetch(`${platformApi}/v1/products/handoff/exchange`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      code,
      targetOrigin: request.nextUrl.origin,
      returnPath: nextPath,
    }),
    cache: "no-store",
  });

  if (!exchange.ok) {
    return Response.redirect(new URL("/login?error=handoff", request.nextUrl.origin));
  }

  const data = await exchange.json();
  const accessToken = String(data?.accessToken || "").trim();
  if (!accessToken) {
    return Response.redirect(new URL("/login?error=handoff", request.nextUrl.origin));
  }

  return signIn("platform-token", {
    accessToken,
    redirectTo: bridgeDestination(nextPath, embedded),
  });
}

export async function GET(request: NextRequest) {
  return bridge(request, {
    code: request.nextUrl.searchParams.get("code") || undefined,
    next: request.nextUrl.searchParams.get("next") || undefined,
    embed: request.nextUrl.searchParams.get("embed") || undefined,
  });
}

export async function POST(request: NextRequest) {
  let input: HandoffInput = {};
  try {
    input = (await request.json()) as HandoffInput;
  } catch {
    // Redirect malformed handoffs through the normal login flow.
  }
  return bridge(request, input);
}
