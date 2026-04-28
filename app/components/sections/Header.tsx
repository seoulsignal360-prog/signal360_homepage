import Link from "next/link";
import { cookies } from "next/headers";
import { User, ShoppingCart } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { MobileMenu } from "./MobileMenu";

const navItems = [
  { label: "홈", href: "/#top" },
  { label: "상품 구매", href: "/#service" },
  { label: "상담 문의", href: "/#contact" },
  { label: "고객 지원", href: "/#faq" },
];

export async function Header() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isLoggedIn = !!user;

  return (
    <>
      <header className="sticky top-0 z-50 h-[90px] bg-navy">
        <div className="mx-auto max-w-content h-full px-6 flex items-center justify-between">
          <Link
            href="/#top"
            className="text-h3 text-fg-on-dark tracking-tight"
            aria-label="시그널360 홈"
          >
            SIGNAL360
          </Link>

          <nav className="hidden md:flex items-center gap-10 lg:gap-[60px]">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-base lg:text-lg font-medium text-fg-on-dark hover:text-primary-light transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-8">
            <Link
              href={isLoggedIn ? "/account" : "/login"}
              aria-label={isLoggedIn ? "내 계정" : "로그인"}
              className="text-fg-on-dark hover:text-primary-light transition-colors flex items-center gap-2"
            >
              <User size={24} strokeWidth={2} aria-hidden="true" />
              <span className="text-caption hidden lg:inline">
                {isLoggedIn ? "내 계정" : "로그인"}
              </span>
            </Link>
            <Link
              href="/#service"
              aria-label="상품 구매"
              className="text-fg-on-dark hover:text-primary-light transition-colors"
            >
              <ShoppingCart size={24} strokeWidth={2} aria-hidden="true" />
            </Link>
          </div>

          <MobileMenu navItems={navItems} isLoggedIn={isLoggedIn} />
        </div>
      </header>
    </>
  );
}
