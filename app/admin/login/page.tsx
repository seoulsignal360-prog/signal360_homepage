import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { LoginForm } from "./LoginForm";

export const metadata = {
  title: "관리자 로그인 - 시그널360",
  robots: { index: false, follow: false },
};

type LoginPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function AdminLoginPage({ searchParams }: LoginPageProps) {
  const { error } = await searchParams;

  // If already logged in AND admin, skip the login screen.
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    const { data: adminUser } = await supabase
      .from("admin_users")
      .select("user_id")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .maybeSingle();
    if (adminUser) redirect("/admin");
  }

  return (
    <main className="flex-1 min-h-screen flex items-center justify-center bg-surface px-6 py-12">
      <div className="w-full max-w-md">
        <LoginForm initialError={error || null} />
      </div>
    </main>
  );
}
