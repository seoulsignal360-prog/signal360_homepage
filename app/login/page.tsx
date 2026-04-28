import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Container } from "@/app/components/ui/Container";
import { createClient } from "@/utils/supabase/server";
import { LoginPanel } from "./LoginPanel";

export const metadata = {
  title: "로그인 - 시그널360",
};

type Props = {
  searchParams: Promise<{ next?: string; error?: string }>;
};

export default async function LoginPage({ searchParams }: Props) {
  const sp = await searchParams;
  const next = sp.next && sp.next.startsWith("/") ? sp.next : "/";

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect(next);

  return (
    <main className="flex-1 bg-surface py-16 lg:py-24">
      <Container>
        <div className="max-w-[440px] mx-auto">
          <LoginPanel next={next} initialError={sp.error ?? null} />
        </div>
      </Container>
    </main>
  );
}
