import Link from "next/link";
import { Container } from "@/app/components/ui/Container";

export const metadata = {
  title: "개인정보처리방침 - 시그널360",
};

const EFFECTIVE_DATE = "2026년 4월 28일";

export default function PrivacyPage() {
  return (
    <main className="flex-1 bg-white py-16">
      <Container>
        <article className="max-w-[820px] mx-auto flex flex-col gap-10">
          <header className="flex flex-col gap-3">
            <h1 className="text-h2 text-fg">개인정보처리방침</h1>
            <p className="text-caption text-muted">
              시행일: {EFFECTIVE_DATE}
            </p>
          </header>

          <Section>
            <p>
              이루다컴퍼니(이하 “회사”)는 「개인정보 보호법」 제30조에 따라
              정보주체의 개인정보를 보호하고 이와 관련한 고충을 신속하고
              원활하게 처리할 수 있도록 다음과 같이 개인정보처리방침을
              수립·공개합니다.
            </p>
          </Section>

          <Section title="제1조 (개인정보의 처리 목적)">
            <p>
              회사는 다음의 목적을 위하여 개인정보를 처리합니다. 처리한 개인정보는
              다음의 목적 외의 용도로는 이용되지 않으며, 이용 목적이 변경될
              경우에는 「개인정보 보호법」 제18조에 따라 별도의 동의를 받는 등
              필요한 조치를 이행할 예정입니다.
            </p>
            <ul className="list-disc pl-6 flex flex-col gap-1">
              <li>회원 가입 및 관리, 본인 확인, 부정 이용 방지</li>
              <li>서비스(DB 상품) 제공 및 운영, 결제 및 환불 처리</li>
              <li>고객 문의 응대 및 민원 처리</li>
              <li>서비스 개선 및 통계 분석</li>
              <li>법령상 의무 이행 및 분쟁 대응</li>
            </ul>
          </Section>

          <Section title="제2조 (처리하는 개인정보 항목)">
            <p>회사는 다음의 개인정보 항목을 처리합니다.</p>
            <div className="overflow-x-auto">
              <table className="w-full border border-card-light text-caption">
                <thead className="bg-surface text-fg">
                  <tr>
                    <th className="px-3 py-2 text-left border-b border-card-light">
                      구분
                    </th>
                    <th className="px-3 py-2 text-left border-b border-card-light">
                      필수 항목
                    </th>
                    <th className="px-3 py-2 text-left border-b border-card-light">
                      선택 항목
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-3 py-2 border-b border-card-light">
                      회원가입(카카오)
                    </td>
                    <td className="px-3 py-2 border-b border-card-light">
                      카카오 식별자, 닉네임
                    </td>
                    <td className="px-3 py-2 border-b border-card-light">
                      이메일, 프로필 이미지
                    </td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 border-b border-card-light">
                      주문/결제
                    </td>
                    <td className="px-3 py-2 border-b border-card-light">
                      구매자명, 휴대폰 번호, 결제 정보
                    </td>
                    <td className="px-3 py-2 border-b border-card-light">
                      이메일, 주문 메모
                    </td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2">자동 수집</td>
                    <td className="px-3 py-2">
                      접속 IP, 쿠키, 서비스 이용 기록, 기기 정보, 브라우저
                      정보
                    </td>
                    <td className="px-3 py-2">—</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Section>

          <Section title="제3조 (개인정보의 처리 및 보유 기간)">
            <ol className="list-decimal pl-6 flex flex-col gap-2">
              <li>
                회사는 법령에 따른 개인정보 보유·이용 기간 또는 정보주체로부터
                개인정보 수집 시 동의받은 보유·이용 기간 내에서 개인정보를
                처리·보유합니다.
              </li>
              <li>
                각 개인정보 보유 및 이용 기간은 다음과 같습니다.
                <ul className="list-disc pl-6 mt-2 flex flex-col gap-1">
                  <li>
                    회원 정보: 회원 탈퇴 시까지 (단, 관계 법령 위반에 따른 수사
                    의뢰 등 별도 보존이 필요한 경우 그에 따름)
                  </li>
                  <li>
                    계약 또는 청약철회 등에 관한 기록: 5년 (전자상거래법)
                  </li>
                  <li>대금결제 및 재화 등의 공급에 관한 기록: 5년</li>
                  <li>소비자의 불만 또는 분쟁 처리에 관한 기록: 3년</li>
                  <li>
                    웹사이트 방문 기록(접속 로그 등): 3개월 (통신비밀보호법)
                  </li>
                </ul>
              </li>
            </ol>
          </Section>

          <Section title="제4조 (개인정보의 제3자 제공)">
            <p>
              회사는 정보주체의 개인정보를 제1조(처리 목적)에서 명시한 범위
              내에서만 처리하며, 정보주체의 동의, 법률의 특별한 규정 등 「개인정보
              보호법」 제17조 및 제18조에 해당하는 경우에만 개인정보를 제3자에게
              제공합니다.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full border border-card-light text-caption">
                <thead className="bg-surface text-fg">
                  <tr>
                    <th className="px-3 py-2 text-left border-b border-card-light">
                      제공받는 자
                    </th>
                    <th className="px-3 py-2 text-left border-b border-card-light">
                      제공 목적
                    </th>
                    <th className="px-3 py-2 text-left border-b border-card-light">
                      제공 항목
                    </th>
                    <th className="px-3 py-2 text-left border-b border-card-light">
                      보유 기간
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-3 py-2">㈜시드페이먼츠</td>
                    <td className="px-3 py-2">결제 처리 및 결제 결과 통지</td>
                    <td className="px-3 py-2">
                      구매자명, 휴대폰 번호, 결제 정보
                    </td>
                    <td className="px-3 py-2">
                      관계 법령에 따른 보존 기간
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Section>

          <Section title="제5조 (개인정보 처리의 위탁)">
            <p>
              회사는 원활한 서비스 제공을 위해 다음과 같이 개인정보 처리 업무를
              외부에 위탁하고 있습니다.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full border border-card-light text-caption">
                <thead className="bg-surface text-fg">
                  <tr>
                    <th className="px-3 py-2 text-left border-b border-card-light">
                      수탁 업체
                    </th>
                    <th className="px-3 py-2 text-left border-b border-card-light">
                      위탁 업무 내용
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-3 py-2 border-b border-card-light">
                      Supabase Inc.
                    </td>
                    <td className="px-3 py-2 border-b border-card-light">
                      회원 인증 및 데이터베이스 호스팅
                    </td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 border-b border-card-light">
                      Vercel Inc.
                    </td>
                    <td className="px-3 py-2 border-b border-card-light">
                      웹사이트 호스팅 및 콘텐츠 전송
                    </td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 border-b border-card-light">
                      ㈜카카오
                    </td>
                    <td className="px-3 py-2 border-b border-card-light">
                      간편 로그인(소셜 인증) 및 알림 메시지
                    </td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2">㈜시드페이먼츠</td>
                    <td className="px-3 py-2">전자결제 대행</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>
              회사는 위탁 계약 체결 시 「개인정보 보호법」 제26조에 따라 위탁
              업무 수행 목적 외 개인정보 처리 금지, 기술적·관리적 보호조치, 재위탁
              제한, 수탁자에 대한 관리·감독, 손해배상 등 책임에 관한 사항을
              계약서 등 문서에 명시하고, 수탁자가 개인정보를 안전하게 처리하는지
              감독하고 있습니다.
            </p>
          </Section>

          <Section title="제6조 (정보주체의 권리·의무 및 행사 방법)">
            <ol className="list-decimal pl-6 flex flex-col gap-2">
              <li>
                정보주체는 회사에 대해 언제든지 다음 각 호의 권리를 행사할 수
                있습니다.
                <ul className="list-disc pl-6 mt-2 flex flex-col gap-1">
                  <li>개인정보 열람 요구</li>
                  <li>오류 등이 있을 경우 정정 요구</li>
                  <li>삭제 요구</li>
                  <li>처리 정지 요구</li>
                </ul>
              </li>
              <li>
                권리 행사는 회사에 대해 서면, 전자우편 등을 통하여 하실 수
                있으며 회사는 이에 대해 지체 없이 조치하겠습니다.
              </li>
              <li>
                정보주체가 개인정보의 오류 등에 대한 정정 또는 삭제를 요구한
                경우에는 회사는 정정 또는 삭제를 완료할 때까지 당해 개인정보를
                이용하거나 제공하지 않습니다.
              </li>
            </ol>
          </Section>

          <Section title="제7조 (개인정보의 파기 절차 및 방법)">
            <ol className="list-decimal pl-6 flex flex-col gap-2">
              <li>
                회사는 개인정보 보유기간의 경과, 처리 목적 달성 등 개인정보가
                불필요하게 되었을 때에는 지체 없이 해당 개인정보를 파기합니다.
              </li>
              <li>
                전자적 파일 형태로 저장된 개인정보는 기록을 재생할 수 없도록
                기술적 방법을 사용하여 삭제하며, 종이에 출력된 개인정보는
                분쇄기로 분쇄하거나 소각하여 파기합니다.
              </li>
            </ol>
          </Section>

          <Section title="제8조 (개인정보의 안전성 확보 조치)">
            <p>
              회사는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고
              있습니다.
            </p>
            <ul className="list-disc pl-6 flex flex-col gap-1">
              <li>관리적 조치: 내부 관리계획 수립·시행, 정기적 직원 교육</li>
              <li>
                기술적 조치: 개인정보 처리 시스템 등의 접근 권한 관리, 접근통제
                시스템 설치, 고유식별정보 등의 암호화, 보안프로그램 설치
              </li>
              <li>물리적 조치: 전산실, 자료보관실 등의 접근 통제</li>
            </ul>
          </Section>

          <Section title="제9조 (쿠키 등 자동 수집 장치의 운영)">
            <ol className="list-decimal pl-6 flex flex-col gap-2">
              <li>
                회사는 이용자에게 개별적인 맞춤서비스를 제공하기 위해 이용 정보를
                저장하고 수시로 불러오는 ‘쿠키(Cookie)’를 사용합니다.
              </li>
              <li>
                이용자는 웹브라우저의 옵션 설정을 통해 쿠키 허용 여부를 선택할 수
                있으며, 쿠키 저장을 거부할 경우 일부 서비스 이용에 제한이 있을 수
                있습니다.
              </li>
            </ol>
          </Section>

          <Section title="제10조 (개인정보 보호책임자)">
            <p>
              회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보
              처리와 관련한 정보주체의 불만 처리 및 피해 구제 등을 위하여
              아래와 같이 개인정보 보호책임자를 지정하고 있습니다.
            </p>
            <ul className="list-disc pl-6 flex flex-col gap-1">
              <li>성명: 이주훈 (대표)</li>
              <li>
                연락처:{" "}
                <a
                  href="mailto:seoulsignal360@gmail.com"
                  className="text-primary hover:underline"
                >
                  seoulsignal360@gmail.com
                </a>
              </li>
            </ul>
          </Section>

          <Section title="제11조 (권익침해 구제 방법)">
            <p>
              정보주체는 개인정보 침해로 인한 구제를 받기 위하여 아래의 기관에
              분쟁해결이나 상담 등을 신청할 수 있습니다.
            </p>
            <ul className="list-disc pl-6 flex flex-col gap-1">
              <li>개인정보분쟁조정위원회: (국번없이) 1833-6972 / kopico.go.kr</li>
              <li>개인정보침해 신고센터: (국번없이) 118 / privacy.kisa.or.kr</li>
              <li>대검찰청 사이버수사과: (국번없이) 1301 / spo.go.kr</li>
              <li>경찰청 사이버수사국: (국번없이) 182 / ecrm.cyber.go.kr</li>
            </ul>
          </Section>

          <Section title="제12조 (개인정보처리방침의 변경)">
            <p>
              본 개인정보처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른
              변경 내용의 추가, 삭제 및 정정이 있는 경우에는 변경 사항의 시행
              7일 전부터 공지사항을 통하여 공지합니다.
            </p>
          </Section>

          <Section title="부칙">
            <p>본 방침은 {EFFECTIVE_DATE}부터 시행됩니다.</p>
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
              <Link href="/terms" className="text-primary hover:underline">
                이용약관 보기 →
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
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-3">
      {title && <h2 className="text-h3 text-fg">{title}</h2>}
      <div className="text-body text-muted leading-relaxed flex flex-col gap-3 break-keep">
        {children}
      </div>
    </section>
  );
}
