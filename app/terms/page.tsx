import Link from "next/link";
import { Container } from "@/app/components/ui/Container";

export const metadata = {
  title: "이용약관 - 시그널360",
};

const EFFECTIVE_DATE = "2026년 4월 28일";

export default function TermsPage() {
  return (
    <main className="flex-1 bg-white py-16">
      <Container>
        <article className="max-w-[820px] mx-auto flex flex-col gap-10">
          <header className="flex flex-col gap-3">
            <h1 className="text-h2 text-fg">이용약관</h1>
            <p className="text-caption text-muted">
              시행일: {EFFECTIVE_DATE}
            </p>
          </header>

          <Section title="제1조 (목적)">
            <p>
              본 약관은 이루다컴퍼니(이하 “회사”)가 운영하는 시그널360
              서비스(이하 “서비스”)의 이용과 관련하여 회사와 이용자의 권리,
              의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
            </p>
          </Section>

          <Section title="제2조 (용어의 정의)">
            <ol className="list-decimal pl-6 flex flex-col gap-2">
              <li>
                “서비스”란 회사가 제공하는 보험설계사 대상 데이터베이스(이하
                “DB”) 매칭 플랫폼 및 이에 부수되는 일체의 서비스를 말합니다.
              </li>
              <li>
                “이용자”란 본 약관에 따라 회사와 서비스 이용계약을 체결하고
                서비스를 이용하는 회원 및 비회원을 말합니다.
              </li>
              <li>
                “회원”이란 회사에 개인정보를 제공하여 회원등록을 한 자로서,
                회사의 정보를 지속적으로 제공받으며 회사가 제공하는 서비스를
                계속적으로 이용할 수 있는 자를 말합니다.
              </li>
              <li>
                “DB 상품”이란 회사가 이용자에게 유료로 제공하는 상담 의향 고객
                정보 및 관련 부가 서비스를 말합니다.
              </li>
            </ol>
          </Section>

          <Section title="제3조 (약관의 게시와 개정)">
            <ol className="list-decimal pl-6 flex flex-col gap-2">
              <li>
                회사는 본 약관을 이용자가 쉽게 알 수 있도록 서비스 초기 화면에
                게시합니다.
              </li>
              <li>
                회사는 관련 법령을 위배하지 않는 범위에서 본 약관을 개정할 수
                있으며, 개정 시 적용일자 및 개정 사유를 명시하여 적용일 7일
                이전부터 공지합니다.
              </li>
              <li>
                이용자에게 불리한 개정의 경우 적용일자 30일 이전부터 공지하며,
                이용자가 명시적으로 거부 의사를 표시하지 않는 경우 개정 약관에
                동의한 것으로 봅니다.
              </li>
            </ol>
          </Section>

          <Section title="제4조 (회원가입)">
            <ol className="list-decimal pl-6 flex flex-col gap-2">
              <li>
                회원가입은 이용자가 카카오 계정 등 회사가 지정한 인증 방식으로
                본인 인증을 완료하고, 본 약관 및 개인정보처리방침에 동의함으로써
                성립됩니다.
              </li>
              <li>
                회사는 다음 각 호에 해당하는 신청에 대하여 가입을 거절하거나
                사후에 회원자격을 상실시킬 수 있습니다.
                <ul className="list-disc pl-6 mt-2 flex flex-col gap-1">
                  <li>타인의 정보를 도용하여 신청한 경우</li>
                  <li>허위 정보를 기재한 경우</li>
                  <li>관계 법령 또는 본 약관을 위반한 사실이 있는 경우</li>
                </ul>
              </li>
            </ol>
          </Section>

          <Section title="제5조 (서비스의 제공 및 변경)">
            <ol className="list-decimal pl-6 flex flex-col gap-2">
              <li>
                회사는 다음과 같은 서비스를 제공합니다.
                <ul className="list-disc pl-6 mt-2 flex flex-col gap-1">
                  <li>보장 분석 리모델링 DB(일반/실버) 제공</li>
                  <li>보험료 플랜 재설계 DB(일반/실버) 제공</li>
                  <li>심층 니즈 메모 등 부가 정보 제공</li>
                  <li>기타 회사가 추가 개발하거나 제휴하여 제공하는 서비스</li>
                </ul>
              </li>
              <li>
                회사는 운영상·기술상 필요에 따라 제공하고 있는 서비스의 내용을
                변경할 수 있으며, 이 경우 변경 사유와 내용을 사전에 공지합니다.
              </li>
              <li>
                회사는 천재지변, 전시, 사변, 정전, 시스템 점검 등 부득이한
                사유가 발생한 경우 서비스의 제공을 일시적으로 중단할 수
                있습니다.
              </li>
            </ol>
          </Section>

          <Section title="제6조 (결제 및 청약철회)">
            <ol className="list-decimal pl-6 flex flex-col gap-2">
              <li>
                서비스 결제는 회사가 지정한 결제대행사(시드페이먼츠 등)를 통해
                신용카드, 계좌이체, 가상계좌 등의 방법으로 이루어집니다.
              </li>
              <li>
                이용자는 결제 완료 후 7일 이내에 청약철회를 요청할 수 있습니다.
                다만, 다음 각 호의 경우에는 이용자의 청약철회가 제한될 수
                있습니다.
                <ul className="list-disc pl-6 mt-2 flex flex-col gap-1">
                  <li>이미 DB가 이용자에게 제공된 경우</li>
                  <li>이용자의 사용으로 DB의 가치가 현저히 감소한 경우</li>
                  <li>
                    복제 가능한 디지털 콘텐츠 특성상 「전자상거래법」
                    제17조 제2항에 따라 청약철회가 제한되는 경우
                  </li>
                </ul>
              </li>
              <li>
                환불은 회사가 정한 절차에 따라 결제수단별로 처리되며, 결제대행사
                및 카드사의 처리 일정에 따라 영업일 기준 3~7일 소요될 수
                있습니다.
              </li>
            </ol>
          </Section>

          <Section title="제7조 (이용자의 의무)">
            <ol className="list-decimal pl-6 flex flex-col gap-2">
              <li>
                이용자는 다음 행위를 해서는 안 됩니다.
                <ul className="list-disc pl-6 mt-2 flex flex-col gap-1">
                  <li>회사가 제공한 DB를 제3자에게 양도·재판매하는 행위</li>
                  <li>
                    회사의 사전 동의 없이 DB를 본래 목적 외의 용도로 사용하는
                    행위
                  </li>
                  <li>
                    회사의 서비스 운영을 방해하거나 시스템에 부정한 방법으로
                    접근하는 행위
                  </li>
                  <li>
                    DB에 포함된 개인정보를 「개인정보 보호법」 등 관계 법령에
                    위반하여 처리하는 행위
                  </li>
                </ul>
              </li>
              <li>
                이용자가 본 조의 의무를 위반하여 회사 또는 제3자에게 손해를
                발생시킨 경우 그에 대한 일체의 책임을 부담합니다.
              </li>
            </ol>
          </Section>

          <Section title="제8조 (회사의 의무)">
            <ol className="list-decimal pl-6 flex flex-col gap-2">
              <li>
                회사는 관련 법령과 본 약관을 준수하며, 안정적인 서비스 제공을
                위해 최선을 다합니다.
              </li>
              <li>
                회사는 이용자의 개인정보를 안전하게 보호하기 위해
                개인정보처리방침을 수립·공개하고 이를 준수합니다.
              </li>
              <li>
                회사는 자체 QA 절차를 통해 제공 DB의 품질을 관리하며, 품질 기준
                미달 DB가 발견된 경우 재제공 또는 환불 등의 조치를 취합니다.
              </li>
            </ol>
          </Section>

          <Section title="제9조 (책임 제한)">
            <ol className="list-decimal pl-6 flex flex-col gap-2">
              <li>
                회사는 천재지변, 전쟁, 기간통신사업자의 서비스 중지, 해킹 등
                회사의 합리적 통제를 벗어난 사유로 서비스를 제공할 수 없는
                경우에는 책임이 면제됩니다.
              </li>
              <li>
                회사가 제공하는 DB는 상담 의향이 확인된 고객 정보로서, 실제
                계약 체결 여부 및 그 결과에 대해서는 회사가 보장하지 않습니다.
              </li>
              <li>
                회사는 이용자가 서비스를 이용하여 기대하는 수익(계약 건수,
                매출 등)을 보장하지 않습니다.
              </li>
            </ol>
          </Section>

          <Section title="제10조 (분쟁의 해결 및 관할법원)">
            <ol className="list-decimal pl-6 flex flex-col gap-2">
              <li>
                본 약관과 관련하여 발생하는 분쟁은 회사와 이용자 간의 협의에
                의해 우선 해결합니다.
              </li>
              <li>
                협의로 해결되지 않은 분쟁에 관한 소송은 「민사소송법」상의
                관할 법원에 제기합니다.
              </li>
            </ol>
          </Section>

          <Section title="부칙">
            <p>본 약관은 {EFFECTIVE_DATE}부터 시행됩니다.</p>
          </Section>

          <div className="border-t border-card-light pt-6 flex flex-col gap-2 text-caption text-muted">
            <p>이루다컴퍼니 · 대표 이주훈 · 사업자등록번호 562-81-02354</p>
            <p>
              서울 구로구 디지털로 306, 대륭포스트타워 2차 316호 ·{" "}
              <a
                href="mailto:seoulsignal360@gmail.com"
                className="hover:text-fg"
              >
                seoulsignal360@gmail.com
              </a>
            </p>
            <p>
              <Link href="/privacy" className="text-primary hover:underline">
                개인정보처리방침 보기 →
              </Link>
            </p>
          </div>
        </article>
      </Container>
    </main>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-h3 text-fg">{title}</h2>
      <div className="text-body text-muted leading-relaxed flex flex-col gap-3 break-keep">
        {children}
      </div>
    </section>
  );
}
