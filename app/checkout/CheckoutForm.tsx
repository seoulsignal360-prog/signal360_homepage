"use client";

import { useState } from "react";
import { AgreementCheckboxes } from "@/app/checkout/components/AgreementCheckboxes";
import { BuyerInfoForm } from "@/app/checkout/components/BuyerInfoForm";
import { OrderSummaryCard } from "@/app/checkout/components/OrderSummaryCard";
import { ProductSummaryCard } from "@/app/checkout/components/ProductSummaryCard";

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

      // Build dynamic form and submit to SeedPay (redirect-style POST).
      const form = document.createElement("form");
      form.method = "POST";
      form.action = data.paymentUrl;
      Object.entries(data.formData as Record<string, unknown>).forEach(
        ([key, value]) => {
          if (value === undefined || value === null) return;
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = key;
          input.value = String(value);
          form.appendChild(input);
        }
      );
      document.body.appendChild(form);
      form.submit();
      // Don't reset isLoading — page is about to navigate to SeedPay.
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
