"use client";

import { useEffect, useState } from "react";
import { AgreementCheckboxes } from "@/app/checkout/components/AgreementCheckboxes";
import { BuyerInfoForm } from "@/app/checkout/components/BuyerInfoForm";
import { OrderSummaryCard } from "@/app/checkout/components/OrderSummaryCard";
import { ProductSummaryCard } from "@/app/checkout/components/ProductSummaryCard";

// SeedPay's pgAsistant.js exposes a bare global `SendPay()` (not a namespaced
// `pgAsistant.SendPay`). It builds an iframe overlay, sets form.target to that
// iframe, and submits — required so /payData renders. Submitting the form
// directly to the main window leaves /payData blank: its JS posts results to
// window.parent and expects to be inside the iframe pgAsistant created.
//
// pgAsistant.js's postMessage handler also calls bare-global `pay_result_submit`
// and `pay_result_close` (snake_case). It does NOT define them itself — they
// are integrator-supplied callbacks. Without them the SUCCESS path throws
// `ReferenceError: pay_result_submit is not defined` and the user gets stuck
// (even though SeedPay has already approved the charge). We define them on
// window before SendPay is called.
declare global {
  interface Window {
    SendPay?: (form: HTMLFormElement, mode?: string) => void;
    pay_result_submit?: () => void;
    pay_result_close?: () => void;
    payResult?: HTMLFormElement;
  }
}

const PG_ASISTANT_SRC = "https://pay.seedpayments.co.kr/js/pgAsistant.js";

function loadPgAsistant(): Promise<void> {
  if (typeof window !== "undefined" && typeof window.SendPay === "function") {
    return Promise.resolve();
  }
  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[data-seedpay-asistant]`
    );
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener(
        "error",
        () => reject(new Error("pgAsistant.js load failed")),
        { once: true }
      );
      return;
    }
    const script = document.createElement("script");
    script.src = PG_ASISTANT_SRC;
    script.dataset.seedpayAsistant = "true";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("pgAsistant.js load failed"));
    document.head.appendChild(script);
  });
}

export type CheckoutProduct = {
  id: string;
  slug: string;
  name: string;
  price: number;
  description: string | null;
  thumbnail_url: string | null;
};

export type BuyerInfo = { name: string; phone: string; email: string };
export type Agreements = { terms: boolean; privacy: boolean; payment: boolean };

const PHONE_RE = /^010-\d{4}-\d{4}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function CheckoutForm({
  product,
  initialBuyer,
}: {
  product: CheckoutProduct;
  initialBuyer?: BuyerInfo | null;
}) {
  const [buyer, setBuyer] = useState<BuyerInfo>({
    name: initialBuyer?.name ?? "",
    phone: initialBuyer?.phone ?? "",
    email: initialBuyer?.email ?? "",
  });
  const [agreements, setAgreements] = useState<Agreements>({
    terms: false,
    privacy: false,
    payment: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // pgAsistant.js calls these on SUCCESS / CANCEL postMessage events. Submit
    // the result form pgAsistant builds (named "payResult") to our returnUrl.
    window.pay_result_submit = () => {
      const form = (document.forms.namedItem("payResult") ||
        window.payResult) as HTMLFormElement | null;
      if (form) form.submit();
    };
    window.pay_result_close = () => {
      // User cancelled in the SeedPay iframe; reset the button so they can retry.
      setIsLoading(false);
    };
    return () => {
      delete window.pay_result_submit;
      delete window.pay_result_close;
    };
  }, []);

  const isNameValid = buyer.name.trim().length >= 2;
  const isPhoneValid = PHONE_RE.test(buyer.phone);
  const isEmailValid = !buyer.email || EMAIL_RE.test(buyer.email);
  const allAgreed =
    agreements.terms && agreements.privacy && agreements.payment;
  const isFormValid =
    isNameValid && isPhoneValid && isEmailValid && allAgreed;

  const handleSubmit = async () => {
    if (!isFormValid || isLoading) return;
    setIsLoading(true);
    try {
      const res = await fetch("/api/payment/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productSlug: product.slug,
          buyer,
          agreements,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message || "결제 요청 실패");
      }

      // Lazy-load SeedPay's pgAsistant.js, then call SendPay() so the payment
      // window opens in an iframe overlay with the proper parent message
      // listener context. Without SendPay the /payData page renders blank.
      await loadPgAsistant();

      const form = document.createElement("form");
      form.id = "payForm";
      form.name = "payForm";
      form.method = "POST";
      form.action = data.paymentUrl;
      // popupYN=N → iframe mode (default). Set to 'Y' for popup window mode.
      const fields: Record<string, unknown> = {
        ...(data.formData as Record<string, unknown>),
        popupYN: "N",
      };
      Object.entries(fields).forEach(([key, value]) => {
        if (value === undefined || value === null) return;
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = String(value);
        form.appendChild(input);
      });
      document.body.appendChild(form);

      if (typeof window.SendPay !== "function") {
        throw new Error("SeedPay 결제 스크립트 로드 실패");
      }
      window.SendPay(form);
      // Don't reset isLoading — payment iframe is about to take over.
    } catch (err) {
      setIsLoading(false);
      alert(err instanceof Error ? err.message : "결제 요청 중 오류 발생");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      <div className="lg:col-span-2 flex flex-col gap-8">
        <ProductSummaryCard product={product} />
        <BuyerInfoForm buyer={buyer} onChange={setBuyer} />
        <AgreementCheckboxes
          agreements={agreements}
          onChange={setAgreements}
        />
      </div>
      <div className="lg:col-span-1">
        <OrderSummaryCard
          product={product}
          isFormValid={isFormValid}
          isLoading={isLoading}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
