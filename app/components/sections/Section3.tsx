import Image from "next/image";
import { Container } from "@/app/components/ui/Container";
import { StatItem } from "@/app/components/ui/StatItem";

export function Section3() {
  return (
    <section id="stats" className="bg-navy py-20 lg:py-24">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="flex flex-col gap-10 lg:gap-14">
            <h2 className="text-h2 text-fg-on-dark break-keep">
              숫자는 거짓말을
              <br />
              하지 않습니다.
            </h2>
            <div className="grid grid-cols-3 gap-2 sm:gap-6 lg:gap-10">
              <StatItem size="sm" value="40%" label="평균 만남율" />
              <StatItem size="sm" value="70%" label="평균 계약 전환율" />
              <StatItem
                size="sm"
                value="100↑"
                label={
                  <>
                    자사의 DB로
                    <br />
                    월 납 보험료
                  </>
                }
              />
            </div>
          </div>
          <div className="relative w-full aspect-[16/9] lg:aspect-[693/309] rounded-card overflow-hidden">
            <Image
              src="/img_nobg/chart.png"
              alt=""
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
