import { Container } from "@/app/components/ui/Container";
import { ProblemCard } from "@/app/components/ui/ProblemCard";
import { SectionHeader } from "@/app/components/ui/SectionHeader";
import { SolutionBanner } from "@/app/components/ui/SolutionBanner";

export function Section1() {
  return (
    <section id="problem" className="bg-white py-[100px]">
      <Container>
        <div className="flex flex-col items-center gap-[90px]">
          <div className="flex flex-col gap-12 w-full md:flex-row md:items-end md:justify-between md:gap-8">
            <SectionHeader
              align="left"
              eyebrow="PROBLEM"
              title={
                <>
                  <span className="font-normal">
                    DB를 사도 달라지지 않는 현실
                  </span>
                  <br />
                  문제는 당신이 아닌, DB에 있습니다.
                </>
              }
              className="md:max-w-[582px]"
            />
            <div className="flex flex-col gap-2 items-start text-left md:items-end md:text-right md:max-w-[360px]">
              <h3 className="text-h3 text-fg break-keep">
                분명 DB는 샀는데, 왜 만남으로 이어지지 않을까요?
              </h3>
              <p className="text-body text-muted break-keep">
                문제는 상담이 아니라, DB가 만들어지는 구조에 있습니다.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-6 w-full max-w-[894px]">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ProblemCard
                number="01"
                keyword={
                  <>
                    어려운
                    <br />
                    미팅 성사
                  </>
                }
                theme="light"
              />
              <ProblemCard
                number="02"
                keyword={
                  <>
                    낮은
                    <br />
                    계약 체결률
                  </>
                }
                theme="light"
              />
              <ProblemCard
                number="03"
                keyword={
                  <>
                    높아지는 리쿠르팅
                    <br />
                    인원 이탈률
                  </>
                }
                theme="dark"
              />
            </div>
            <SolutionBanner>
              Signal360은 보험 상담을 원하는 고객과 설계사를 연결하는 퍼미션
              기반 DB 플랫폼입니다.
              <br />
              단순 DB 판매가 아니라 상담 의사를 확인한 고객만 설계사에게
              전달됩니다.
            </SolutionBanner>
          </div>
        </div>
      </Container>
    </section>
  );
}
