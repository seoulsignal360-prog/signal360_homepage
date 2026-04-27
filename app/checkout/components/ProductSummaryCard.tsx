import Image from "next/image";
import type { CheckoutProduct } from "@/app/checkout/CheckoutForm";

const SLUG_TO_IMAGE: Record<string, string> = {
  "analysis-general": "/img_nobg/service-1.png",
  "analysis-silver": "/img_nobg/service-2.png",
  "replan-silver": "/img_nobg/service-3.png",
  "replan-general": "/img_nobg/service-4.png",
};

export function ProductSummaryCard({ product }: { product: CheckoutProduct }) {
  const imageSrc =
    product.thumbnail_url ?? SLUG_TO_IMAGE[product.slug] ?? null;

  return (
    <section className="bg-white rounded-card p-6">
      <h2 className="text-h3 text-fg mb-6">주문 상품</h2>
      <div className="flex gap-6 items-center">
        <div className="relative shrink-0 w-[100px] h-[100px] rounded-card overflow-hidden bg-primary/10">
          {imageSrc && (
            <Image
              src={imageSrc}
              alt={product.name}
              fill
              sizes="100px"
              className="object-contain"
            />
          )}
        </div>
        <div className="flex flex-col gap-2 min-w-0 flex-1">
          <p className="text-lead text-fg">{product.name}</p>
          {product.description && (
            <p className="text-body text-muted line-clamp-2">
              {product.description}
            </p>
          )}
          <p className="text-lead font-bold text-fg">
            {product.price.toLocaleString("ko-KR")}원
          </p>
        </div>
      </div>
    </section>
  );
}
