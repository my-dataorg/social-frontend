import { signIn } from "@/auth";

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
      <h1 className="text-2xl font-semibold">Sign in to Social</h1>
      <p className="mt-2 text-sm text-slate-600">Authentication is provided by MyData Platform.</p>
      <form
        className="mt-6"
        action={async () => {
          "use server";
          await signIn("keycloak", { redirectTo: "/" });
        }}
      >
        <button className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white" type="submit">
          Continue with MyData
        </button>
      </form>
    </main>
  );
}
