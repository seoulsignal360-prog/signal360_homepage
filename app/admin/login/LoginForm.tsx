"use client";

import Image from "next/image";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";

const ERROR_MESSAGES: Record<string, string> = {
  "Invalid login credentials": "이메일 또는 비밀번호가 올바르지 않습니다",
  "Email not confirmed": "이메일 인증이 완료되지 않았습니다",
  unauthorized: "관리자 권한이 없습니다",
};

function mapError(message: string): string {
  return ERROR_MESSAGES[message] || "로그인 중 오류가 발생했습니다";
}

const inputClass =
  "w-full h-12 px-4 border border-card-light rounded-lg bg-white text-body text-fg placeholder:text-muted focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors";
const labelClass = "text-body font-medium text-fg";

export function LoginForm({ initialError }: { initialError: string | null }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(
    initialError ? mapError(initialError) : null
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || isLoading) return;
    setError(null);
    setIsLoading(true);

    const supabase = createClient();
    const { error: signInErr } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (signInErr) {
      setError(mapError(signInErr.message));
      setIsLoading(false);
      return;
    }

    // Proxy will verify admin_users on the next request.
    router.push("/admin");
    router.refresh();
  };

  const submitDisabled = !email || !password || isLoading;

  return (
    <div className="bg-white rounded-card shadow-lg p-12 flex flex-col gap-8">
      <div className="flex flex-col items-center gap-3 text-center">
        <Image
          src="/img/logo.png"
          alt="SIGNAL360"
          width={180}
          height={36}
          priority
          className="h-9 w-auto"
        />
        <h1 className="text-h2 text-fg">관리자 로그인</h1>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className={labelClass}>
            이메일
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className={inputClass}
            placeholder="admin@iruda.co.kr"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="password" className={labelClass}>
            비밀번호
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            className={inputClass}
            placeholder="••••••••"
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-caption text-red-700">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={submitDisabled}
          className={`w-full h-14 rounded-pill text-lead font-bold transition-colors flex items-center justify-center gap-2 ${
            submitDisabled
              ? "bg-card-light text-muted cursor-not-allowed"
              : "bg-primary text-white hover:bg-[#4338CA] active:bg-[#3730A3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
          }`}
        >
          {isLoading ? (
            <>
              <Loader2 size={20} strokeWidth={2.5} className="animate-spin" />
              로그인 중
            </>
          ) : (
            "로그인"
          )}
        </button>
      </form>

      <p className="text-caption text-muted text-center">
        관리자 권한이 필요합니다
      </p>
    </div>
  );
}
