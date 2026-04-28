import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Container } from "@/app/components/ui/Container";
import { CheckoutForm } from "@/app/checkout/CheckoutForm";
import { createClient } from "@/utils/supabase/server";

export const metadata = {
  title: "주문/결제 - 시그널360",
};

type CheckoutPageProps = {
  searchParams: Promise<{ product?: string }>;
};

export default async function CheckoutPage({
  searchParams,
}: CheckoutPageProps) {
  const { product: slug } = await searchParams;

  if (!slug) {
    redirect("/#service");
  }

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const [productRes, authRes] = await Promise.all([
    supabase
      .from("products")
      .select("id, slug, name, price, description, thumbnail_url")
      .eq("slug", slug)
      .eq("is_active", true)
      .maybeSingle(),
    supabase.auth.getUser(),
  ]);
  const product = productRes.data;
  const user = authRes.data.user;

  if (!product) {
    redirect("/#service");
  }

  let initialBuyer: { name: string; phone: string; email: string } | null = null;
  if (user) {
    const { data: profile } = await supabase
      .from("users")
      .select("name, phone")
      .eq("id", user.id)
      .maybeSingle();
    const meta = user.user_metadata as {
      name?: string;
      full_name?: string;
    } | null;
    initialBuyer = {
      name: profile?.name || meta?.name || meta?.full_name || "",
      phone: profile?.phone || "",
      email: user.email || "",
    };
  }

  return (
    <main className="flex-1 bg-surface py-16">
      <Container>
        <div className="flex flex-col gap-12">
          <h1 className="text-h2 text-fg">주문/결제</h1>
          <CheckoutForm product={product} initialBuyer={initialBuyer} />
        </div>
      </Container>
    </main>
  );
}
