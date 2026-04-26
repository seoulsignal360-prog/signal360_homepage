import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { LogoutButton } from "./LogoutButton";

export const metadata = {
  title: "관리자 - 시그널360",
  robots: { index: false, follow: false },
};

export default async function AdminAuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Proxy already verifies the user is an admin; this fetch is for sidebar UI.
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: adminUser } = await supabase
    .from("admin_users")
    .select("role")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .maybeSingle();

  return (
    <div className="min-h-screen flex bg-surface">
      <aside className="w-60 bg-fg text-white flex flex-col p-6 gap-6 shrink-0">
        <div className="text-h3 tracking-tight">SIGNAL360</div>

        <nav className="flex flex-col gap-1 flex-1">
          <Link
            href="/admin"
            className="px-3 py-2 rounded text-body hover:bg-white/10 transition-colors"
          >
            대시보드
          </Link>
          <Link
            href="/admin/orders"
            className="px-3 py-2 rounded text-body hover:bg-white/10 transition-colors"
          >
            주문 관리
          </Link>
          <Link
            href="/admin/orders?status=refunded"
            className="px-3 py-2 rounded text-body hover:bg-white/10 transition-colors"
          >
            환불 내역
          </Link>
        </nav>

        <div className="flex flex-col gap-3 pt-6 border-t border-white/10">
          <div className="flex flex-col">
            <span className="text-caption text-white/60">로그인</span>
            <span className="text-body truncate">{user.email}</span>
            {adminUser && (
              <span className="text-caption text-primary-light">
                {adminUser.role}
              </span>
            )}
          </div>
          <LogoutButton />
        </div>
      </aside>

      <main className="flex-1 p-12 overflow-auto">{children}</main>
    </div>
  );
}
