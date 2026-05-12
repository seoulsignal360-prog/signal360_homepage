import Image from "next/image";

type ServiceCardProduct = {
  id: string;
  name: string;
  price: number;
  imageSrc: string;
};

type ServiceCardProps = {
  product: ServiceCardProduct;
  onClick?: () => void;
};

export function ServiceCard({ product, onClick }: ServiceCardProps) {
  const interactive = !!onClick;
  const interactiveProps = interactive
    ? {
        role: "button" as const,
        tabIndex: 0,
        onClick,
        onKeyDown: (e: React.KeyboardEvent) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onClick();
          }
        },
      }
    : {};

  return (
    <div
      className="flex flex-col gap-5 cursor-pointer transition-all duration-300 ease-out hover:-translate-y-2 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-4 rounded-card"
      {...interactiveProps}
    >
      {/* On hover: image lifts (parent translate), the thumbnail gets a
          primary-tinted glow shadow, and the artwork zooms slightly. The
          product title shifts to primary color so the buyer's eye locks
          onto whichever card their pointer is over. */}
      <div className="relative w-full aspect-square rounded-card overflow-hidden bg-primary/10 transition-all duration-300 ease-out ring-1 ring-transparent group-hover:ring-primary/20 group-hover:shadow-[0_20px_40px_-15px_rgba(79,70,229,0.35)]">
        <Image
          src={product.imageSrc}
          alt={product.name}
          fill
          sizes="(min-width: 1280px) 282px, (min-width: 640px) 50vw, 100vw"
          className="object-contain transition-transform duration-500 ease-out group-hover:scale-[1.04]"
        />
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-lead text-fg transition-colors duration-200 group-hover:text-primary">
          {product.name}
        </p>
        <p className="text-lead font-bold text-fg">
          {product.price.toLocaleString("ko-KR")}원
        </p>
      </div>
    </div>
  );
}
