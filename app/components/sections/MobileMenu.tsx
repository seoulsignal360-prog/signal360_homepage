"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, ShoppingCart, User, X } from "lucide-react";

type NavItem = { label: string; href: string };

export function MobileMenu({
  navItems,
  isLoggedIn,
}: {
  navItems: NavItem[];
  isLoggedIn: boolean;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        className="md:hidden text-fg-on-dark"
        aria-label="메뉴 열기"
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        <Menu size={28} strokeWidth={2} aria-hidden="true" />
      </button>

      {open && (
        <div className="fixed inset-0 z-[60] bg-navy md:hidden flex flex-col">
          <div className="h-[90px] px-6 flex items-center justify-between border-b border-white/10">
            <span className="text-h3 text-fg-on-dark tracking-tight">
              SIGNAL360
            </span>
            <button
              type="button"
              className="text-fg-on-dark"
              aria-label="메뉴 닫기"
              onClick={() => setOpen(false)}
            >
              <X size={28} strokeWidth={2} aria-hidden="true" />
            </button>
          </div>
          <nav className="flex-1 flex flex-col items-center justify-center gap-8 px-6">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="text-2xl font-medium text-fg-on-dark hover:text-primary-light transition-colors"
              >
                {item.label}
              </a>
            ))}
            <div className="mt-12 flex items-center gap-8">
              <Link
                href={isLoggedIn ? "/account" : "/login"}
                aria-label={isLoggedIn ? "내 계정" : "로그인"}
                className="text-fg-on-dark flex flex-col items-center gap-1"
                onClick={() => setOpen(false)}
              >
                <User size={28} strokeWidth={2} aria-hidden="true" />
                <span className="text-caption">
                  {isLoggedIn ? "내 계정" : "로그인"}
                </span>
              </Link>
              <Link
                href="/#service"
                aria-label="상품 구매"
                className="text-fg-on-dark flex flex-col items-center gap-1"
                onClick={() => setOpen(false)}
              >
                <ShoppingCart size={28} strokeWidth={2} aria-hidden="true" />
                <span className="text-caption">상품 구매</span>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
