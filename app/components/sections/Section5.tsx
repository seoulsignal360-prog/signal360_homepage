import Link from "next/link";
import { Container } from "@/app/components/ui/Container";
import { SectionHeader } from "@/app/components/ui/SectionHeader";
import { ServiceCard } from "@/app/components/ui/ServiceCard";

type Product = {
  id: string;
  name: string;
  price: number;
  category: "analysis" | "replan";
  tier: "general" | "silver";
  imageSrc: string;
};

const products: Product[] = [
  {
    id: "analysis-general",
    name: "보장 분석 리모델링 (일반)",
    price: 90000,
    category: "analysis",
    tier: "general",
    imageSrc: "/img_nobg/service-1.png",
  },
  {
    id: "analysis-silver",
    name: "보장 분석 리모델링 (실버)",
    price: 80000,
    category: "analysis",
    tier: "silver",
    imageSrc: "/img_nobg/service-2.png",
  },
  {
    id: "replan-silver",
    name: "보험료 플랜 재설계 (실버)",
    price: 70000,
    category: "replan",
    tier: "silver",
    imageSrc: "/img_nobg/service-3.png",
  },
  {
    id: "replan-general",
    name: "보험료 플랜 재설계 (일반)",
    price: 80000,
    category: "replan",
    tier: "general",
    imageSrc: "/img_nobg/service-4.png",
  },
];

export function Section5() {
  return (
    <section id="service" className="bg-white py-[150px]">
      <Container>
        <div className="flex flex-col gap-[90px]">
          <SectionHeader
            align="left"
            eyebrow="SERVICE"
            title={
              <>
                Signal360이{" "}
                <span className="text-primary">하면 다릅니다.</span>
              </>
            }
            subtitle="가장 선명한 성공 주파수, Signal360과 연결하세요"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {products.map((p) => (
              <Link
                key={p.id}
                href={`/checkout?product=${p.id}`}
                className="block rounded-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4"
              >
                <ServiceCard product={p} />
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
