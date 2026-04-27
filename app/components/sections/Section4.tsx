"use client";

import useEmblaCarousel from "embla-carousel-react";
import { Container } from "@/app/components/ui/Container";
import { PillButton } from "@/app/components/ui/PillButton";
import { ReviewCard } from "@/app/components/ui/ReviewCard";
import { SectionHeader } from "@/app/components/ui/SectionHeader";

const reviews = [
  {
    name: "김** 지점장",
    company: "G보험 부산지점",
    quote: "30개 중 8개 계약! 미팅률도 역대급이에요.",
    avatarSrc: "/img_nobg/avatar-1.png",
  },
  {
    name: "박** 팀장",
    company: "H생명 서울지점",
    quote:
      "DB 품질이 정말 다릅니다. 계약 전환율이 평균 2배 올랐어요.",
    avatarSrc: "/img_nobg/avatar-2.png",
  },
  {
    name: "이** 매니저",
    company: "S손보 인천지점",
    quote:
      "기존 DB 업체와 비교가 안 됩니다. 진짜 상담 의향 있는 고객만 와요.",
    avatarSrc: "/img_nobg/avatar-3.png",
  },
  {
    name: "최** 지점장",
    company: "K생명 대구지점",
    quote:
      "30대 고객 위주로 매칭 받았는데 미팅 성사율이 70% 넘어요.",
    avatarSrc: "/img_nobg/avatar-4.png",
  },
  {
    name: "정** 팀장",
    company: "M보험 광주지점",
    quote: "QA 필터링이 확실해서 헛걸음하는 일이 없습니다.",
    avatarSrc: "/img_nobg/avatar-5.png",
  },
  {
    name: "강** 매니저",
    company: "D보험 울산지점",
    quote:
      "심층 메모 덕분에 첫 통화부터 깊이 있는 상담이 가능했어요.",
    avatarSrc: "/img_nobg/avatar-6.png",
  },
];

export function Section4() {
  const [emblaRef] = useEmblaCarousel({ loop: true, align: "start" });

  return (
    <section id="review" className="bg-white py-[100px]">
      <div className="flex flex-col gap-[60px]">
        <Container>
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <SectionHeader
              align="left"
              eyebrow="REVIEW"
              title="설계사님들의 후기"
            />
            <PillButton href="https://pf.kakao.com/_signal360" external>
              카톡 실제 후기 바로가기
            </PillButton>
          </div>
        </Container>

        <div ref={emblaRef} className="overflow-hidden">
          <div className="flex gap-6 px-6 lg:px-12 2xl:pl-[360px]">
            {reviews.map((r) => (
              <div
                key={r.name}
                className="flex-[0_0_85%] sm:flex-[0_0_50%] lg:flex-[0_0_366px]"
              >
                <ReviewCard
                  name={r.name}
                  company={r.company}
                  quote={r.quote}
                  avatarSrc={r.avatarSrc}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
