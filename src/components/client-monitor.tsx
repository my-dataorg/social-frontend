"use client";

import { useEffect } from "react";

function safePath(input: string): string {
  try {
    return new URL(input, window.location.origin).pathname;
  } catch {
    return input.split("?")[0]?.slice(0, 180) ?? "";
  }
}

function report(level: "warn" | "error", kind: string, message: string, extra?: Record<string, string | number>) {
  const payload = { level, kind, message, ...extra };
  const line = JSON.stringify(payload);
  if (level === "error") console.error(line);
  else console.warn(line);
}

export function ClientMonitor() {
  useEffect(() => {
    const onError = (event: ErrorEvent) => {
      report("error", "ui", event.message || "Script error", {
        source: event.filename ? safePath(event.filename) : "",
        line: event.lineno,
      });
    };
    const onRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      const message = reason instanceof Error ? reason.message : "Unexpected failure";
      report("error", "ui", message);
    };
    const original = window.fetch.bind(window);
    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const response = await original(input, init);
      if (!response.ok) {
        const raw =
          typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
        const requestId = response.headers.get("x-request-id");
        report("warn", "api", "Request failed", {
          status: response.status,
          path: safePath(raw),
          ...(requestId ? { requestId } : {}),
        });
      }
      return response;
    };
    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);
    return () => {
      window.fetch = original;
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
    };
  }, []);

  return null;
}
