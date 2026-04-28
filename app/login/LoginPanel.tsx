"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

const ERROR_MESSAGES: Record<string, string> = {
  oauth_failed: "카카오 로그인에 실패했습니다. 다시 시도해주세요.",
  callback_error: "로그인 처리 중 오류가 발생했습니다.",
  no_code: "인증 코드가 전달되지 않았습니다.",
};

function mapError(code: string): string {
  return ERROR_MESSAGES[code] || "로그인 중 오류가 발생했습니다.";
}

export function LoginPanel({
  next,
  initialError,
}: {
  next: string;
  initialError: string | null;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(
    initialError ? mapError(initialError) : null
  );

  const handleKakao = async () => {
    if (isLoading) return;
    setError(null);
    setIsLoading(true);

    const supabase = createClient();
    const origin = window.location.origin;
    const redirectTo = `${origin}/auth/callback?next=${encodeURIComponent(
      next
    )}`;

    const { error: oauthErr } = await supabase.auth.signInWithOAuth({
      provider: "kakao",
      options: { redirectTo },
    });

    if (oauthErr) {
      setError(oauthErr.message);
      setIsLoading(false);
    }
    // On success, browser is redirected to Kakao — no further code runs here.
  };

  return (
    <div className="bg-white rounded-card shadow-lg p-10 flex flex-col gap-8">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-h2 text-fg">로그인</h1>
        <p className="text-caption text-muted">
          카카오 계정으로 시그널360에 로그인하세요
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-caption text-red-700">
          {error}
        </div>
      )}

      <button
        type="button"
        onClick={handleKakao}
        disabled={isLoading}
        className="w-full h-14 rounded-pill bg-[#FEE500] text-[#191600] text-lead font-bold flex items-center justify-center gap-2 hover:brightness-95 active:brightness-90 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
      >
        {isLoading ? (
          <>
            <Loader2 size={20} strokeWidth={2.5} className="animate-spin" />
            카카오로 이동 중
          </>
        ) : (
          <>
            <KakaoMark />
            카카오로 시작하기
          </>
        )}
      </button>

      <p className="text-caption text-muted text-center">
        로그인 시 시그널360 이용약관 및 개인정보처리방침에 동의한 것으로
        간주됩니다.
      </p>
    </div>
  );
}

function KakaoMark() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 3C6.48 3 2 6.48 2 10.8c0 2.71 1.74 5.1 4.4 6.51-.16.55-.6 2.1-.69 2.43 0 0-.01.1.04.13s.13.02.16.01c.36-.05 4.13-2.69 4.78-3.13.43.06.87.1 1.31.1 5.52 0 10-3.48 10-7.95C22 6.48 17.52 3 12 3z" />
    </svg>
  );
}
