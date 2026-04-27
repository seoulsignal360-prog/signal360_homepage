import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { Container } from "@/app/components/ui/Container";
import { PillButton } from "@/app/components/ui/PillButton";
import { StatItem } from "@/app/components/ui/StatItem";

const stats = [
  { value: "55만+", label: "누적 실수요자 DB" },
  { value: "70%", label: "계약 전환율" },
  { value: "100%", label: "QA 품질 보장" },
  { value: "24H", label: "실시간 소통" },
];

export function Hero() {
  return (
    <section id="top" className="relative h-[874px] overflow-hidden bg-navy">
      <div className="absolute inset-x-0 bottom-0 h-[55%] opacity-45">
        <Image
          src="/img_nobg/hero.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-bottom blur-[1px]"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/85 to-navy/40" />
      <div className="absolute inset-0 bg-navy/30" />
      <Container className="relative z-10 h-full flex flex-col justify-between items-center py-16">
        <div />

        <div className="flex flex-col items-center gap-[52px]">
          <div className="flex flex-col items-center gap-5 text-center">
            <p className="text-eyebrow text-primary-light">
              보험설계사를 위한 DB 매칭 플랫폼
            </p>
            <div className="flex flex-col items-center gap-4">
              <h1 className="text-display text-fg-on-dark">
                당신이 찾던 성공의 신호,
                <br />
                결국 시그널360에 있습니다.
              </h1>
              <p className="text-lead font-normal text-muted-on-dark">
                누구를 만나느냐가 설계사의 내일을 결정합니다.
                <br />
                이제 당신을 기다리는 진짜 고객을 만나세요.
              </p>
            </div>
          </div>
          <PillButton href="#contact">시그널 360 문의하기</PillButton>
        </div>

        <div className="w-full flex flex-col items-center gap-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8 w-full">
            {stats.map((s) => (
              <StatItem key={s.label} value={s.value} label={s.label} />
            ))}
          </div>
          <a
            href="#problem"
            aria-label="다음 섹션으로 스크롤"
            className="text-muted-on-dark hover:text-fg-on-dark transition-colors animate-float"
          >
            <ChevronDown size={48} strokeWidth={2} aria-hidden="true" />
          </a>
        </div>
      </Container>
    </section>
  );
}
