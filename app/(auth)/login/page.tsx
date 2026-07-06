// app/(auth)/login/page.tsx
import LoginForm from "@/components/forms/LoginForm";

export const metadata = {
  title: "Admin Portal Access | Portfolio",
  description: "Secure gateway loop to manage site contents.",
};

export default function LoginPage() {
  return (
    <main className="flex min-h-screen w-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-4">
      {/* Dynamic background element for subtle SaaS styling aesthetics */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
      
      <LoginForm />
    </main>
  );
}