import type { Metadata } from "next";
import SignInForm from "@/components/SignInForm";

export const metadata: Metadata = {
  title: "Sign In | Riverside Ward",
  description: "Bishopric sign-in for the Riverside Ward Sacrament Meeting Planner.",
};

export default async function LoginPage(props: PageProps<"/login">) {
  const searchParams = await props.searchParams;
  const callbackUrl =
    typeof searchParams.callbackUrl === "string" ? searchParams.callbackUrl : "/meetings";

  return (
    <section className="mx-auto max-w-sm">
      <h1 className="text-2xl font-semibold tracking-tight">Bishopric Sign In</h1>
      <p className="mt-2 text-sm text-black/60 dark:text-white/60">
        Sign in to plan or edit a sacrament meeting agenda.
      </p>

      <div className="mt-6">
        <SignInForm callbackUrl={callbackUrl} />
      </div>
    </section>
  );
}
