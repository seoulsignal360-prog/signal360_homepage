import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

// Next 16 — runtime is always nodejs for proxy.ts.
// Matcher restricts execution to /admin/* paths.

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Inject x-pathname header so the root layout can suppress Header/Footer
  // for any /admin/* page (login + dashboard).
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", pathname);

  // /admin/login is publicly accessible (visitors land here when not authed).
  if (pathname === "/admin/login") {
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  // Setup Supabase client with cookie sync for session refresh.
  let response = NextResponse.next({ request: { headers: requestHeaders } });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });
          response = NextResponse.next({
            request: { headers: requestHeaders },
          });
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  // Verify admin_users membership (active row).
  const { data: adminUser } = await supabase
    .from("admin_users")
    .select("user_id, role, is_active")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .maybeSingle();

  if (!adminUser) {
    // Logged-in but not an active admin → sign out + redirect with reason.
    await supabase.auth.signOut();
    return NextResponse.redirect(
      new URL("/admin/login?error=unauthorized", request.url)
    );
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
