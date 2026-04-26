"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { isOrderStatus } from "./types";

type ActionResult = { ok: true } | { ok: false; error: string };

async function assertAdmin() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { supabase: null, error: "unauthorized" as const };
  const { data: adminUser } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .maybeSingle();
  if (!adminUser) return { supabase: null, error: "forbidden" as const };
  return { supabase, error: null };
}

export async function updateOrderStatus(
  orderId: string,
  status: string
): Promise<ActionResult> {
  if (!isOrderStatus(status)) {
    return { ok: false, error: "잘못된 상태값입니다" };
  }
  const { supabase, error } = await assertAdmin();
  if (!supabase) return { ok: false, error: error ?? "권한 없음" };

  const { error: updateErr } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", orderId);
  if (updateErr) {
    console.error("[updateOrderStatus]", updateErr);
    return { ok: false, error: "상태 변경에 실패했습니다" };
  }

  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath("/admin/orders");
  return { ok: true };
}

export async function updateOrderMemo(
  orderId: string,
  memo: string
): Promise<ActionResult> {
  if (memo.length > 2000) {
    return { ok: false, error: "메모는 2000자 이내여야 합니다" };
  }
  const { supabase, error } = await assertAdmin();
  if (!supabase) return { ok: false, error: error ?? "권한 없음" };

  const { error: updateErr } = await supabase
    .from("orders")
    .update({ admin_memo: memo.trim() || null })
    .eq("id", orderId);
  if (updateErr) {
    console.error("[updateOrderMemo]", updateErr);
    return { ok: false, error: "메모 저장에 실패했습니다" };
  }

  revalidatePath(`/admin/orders/${orderId}`);
  return { ok: true };
}
