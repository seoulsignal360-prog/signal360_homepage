"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";

export function LogoutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    if (isLoading) return;
    setIsLoading(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isLoading}
      className="flex items-center gap-2 px-3 py-2 rounded text-body text-white/80 hover:text-white hover:bg-white/10 transition-colors w-full text-left disabled:opacity-50"
    >
      <LogOut size={16} strokeWidth={2} aria-hidden="true" />
      {isLoading ? "로그아웃 중..." : "로그아웃"}
    </button>
  );
}
