import Link from "next/link";
import { SocialNavGate } from "@/components/social-nav-gate";

export default function HomePage() {
  return (
    <>
      <SocialNavGate />
      <main className="mx-auto max-w-5xl px-6 py-12">
        <h1 className="text-3xl font-semibold">Social</h1>
        <p className="mt-2 text-slate-600">Your community space is ready for the next product feature.</p>
        <Link className="mt-6 inline-block text-sm font-medium underline" href="/login">
          Continue with MyData
        </Link>
      </main>
    </>
  );
}
