import { cookies, headers } from "next/headers";

export async function SocialNavGate() {
  const cookieStore = await cookies();
  const headerStore = await headers();
  const embedded =
    headerStore.get("x-social-embed") === "1" ||
    cookieStore.get("social-embed")?.value === "1";

  if (embedded) return null;

  return (
    <header className="border-b border-slate-200 bg-white">
      <nav className="mx-auto max-w-5xl px-6 py-4 text-sm font-medium text-slate-700">
        MyData Social
      </nav>
    </header>
  );
}
