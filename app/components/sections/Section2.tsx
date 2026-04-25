import { Container } from "@/app/components/ui/Container";
import { FeatureRow } from "@/app/components/ui/FeatureRow";
import { SectionHeader } from "@/app/components/ui/SectionHeader";

const features = [
  {
    title: (
      <>
        실수요자 기반 추출,
        <br />
        타협없는 <span className="text-primary">정교한 타겟</span>
      </>
    ),
    bullets: [
      "55세~84세 고객 중 실 납부 보험료 10만원 이상",
      "담당 설계사 X, 2년 내 병력확인 O",
    ],
    imageLabel: "노트북 보는 사람",
  },
  {
    title: (
      <>
        꾸준한 품질 관리를 위한 투자!
        <br />
        자체 <span className="text-primary">QA필터</span> 시스템 도입
      </>
    ),
    bullets: [
      "품질 기준 미달 DB = 전량 폐기",
      "납품된 DB 100% 모니터링 + 재검수 진행",
    ],
    imageLabel: "사무실 일하는 사람",
  },
  {
    title: (
      <>
        상담의 주도권을 당신에게
        <br />
        <span className="text-primary">심층 니즈 메모</span> 전달
      </>
    ),
    bullets: [
      "보험료 과납, 암보험 관심 등",
      "꼼꼼한 보장 분석 정보도 메모 전달",
    ],
    imageLabel: "핸드폰 + 손",
  },
  {
    title: (
      <>
        높은 <span className="text-primary">콜백 전환율</span> 및
        <br />
        <span className="text-primary">계약 전환률</span>
      </>
    ),
    bullets: [
      "설계사의 전문성 강조",
      "계약 전환에 대한 니즈 상기",
      "여유로운 시간대 설정",
    ],
    imageLabel: "전화기 다이얼",
  },
];

export function Section2() {
  return (
    <section id="why" className="bg-surface py-[120px]">
      <Container>
        <div className="flex flex-col items-center gap-[90px]">
          <SectionHeader
            align="center"
            title={
              <>
                왜 <span className="text-primary">Signal360</span> 일까요?
              </>
            }
          />
          <div className="flex flex-col gap-0 w-full">
            {features.map((f, i) => (
              <FeatureRow
                key={i}
                title={f.title}
                bullets={f.bullets}
                imageLabel={f.imageLabel}
                reverse={i % 2 === 1}
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
