"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { Container } from "@/app/components/ui/Container";
import { FaqItem } from "@/app/components/ui/FaqItem";
import { SectionHeader } from "@/app/components/ui/SectionHeader";

type Faq = {
  q: string;
  a: string;
  open?: boolean;
};

const faqs: Faq[] = [
  {
    q: "환불 받고 싶어요.",
    a: "DB 분배 전이라면 전액 환불 가능합니다.\n자세한 내용은 시그널360 카카오톡 채널로 문의 부탁드립니다.",
    open: true,
  },
  {
    q: "DB 분배 방법이 궁금합니다.",
    a: "카카오톡 단체 톡방에 구글 스프레드시트를 통해 분배드리고 있습니다.\nDB 분배 시, 제공 내용 및 녹취파일까지 함께 제공됩니다.",
  },
  {
    q: "배분 조건을 보다 더 자세히 설정할 수 있나요? (나이, 특정 지역, 성별 등)",
    a: "최대한 설계사님이 원하시는 조건을 충족시켜드리려고 하겠지만, 경우에 따라서는 원하시는 조건을 맞춰드리기 어려울 수 있습니다.\n이런 사유로는 DB 회수 및 A/S, 환불이 어려운 점 참고 부탁드립니다.",
  },
  {
    q: "결제 페이지가 안 넘어가요.",
    a: "일시적인 오류로, 새로고침 또는 종료 후 재시도 부탁드립니다.\n해당 조치를 취했음에도 결제 오류가 나는 경우 시그널360 채널톡으로 문의 부탁드립니다.",
  },
  {
    q: "분배 받는 중인데 분배 스케줄을 변경하고 싶어요.",
    a: "분배 후 일정상 스케줄 변경이 필요하신 경우, 전날 오후 1시까지 분배 톡방에 문의 주시면 변경 처리 도와드리고 있습니다.\n당일 변경은 어려울 수 있으니 참고 부탁드립니다.",
  },
  {
    q: "분배 받는 중인데 상품을 변경하고 싶어요.",
    a: "분배 중 상품 변경은 가능하십니다.\n상품의 금액에 따라, 기존 분배된 DB의 차액을 제외한 나머지 금액에 맞춰 새로운 상품으로 DB를 분배해 드립니다.",
  },
  {
    q: "대량 구매 시 할인 혜택이 있나요?",
    a: "상품마다 차이가 있으나, 50개 이상 구매 시 추가 할인이 가능합니다.\n자세한 내용은 시그널360 카카오톡 채널로 문의 부탁드립니다.",
  },
  {
    q: "배분에 걸리는 기간은 어느 정도 인가요?",
    a: "배분은 계약 후 한 달 이내 배정을 원칙으로 하고 있습니다.\n다만 설계사님의 요청 사항, 원천 DB 생성 등의 이슈로 변경 사항이 있을 수 있습니다. 최대한 조율하여 빠르게 배정해 드리겠습니다.",
  },
  {
    q: "AS 승인 여부는 어디에서 확인할 수 있나요?",
    a: "A/S가 처리된 경우 DB 분배 구글 스프레드시트에 별도로 표시해 드리고 있습니다.",
  },
  {
    q: "장기부재의 기준은 무엇인가요?",
    a: "5번의 통화 시도를 기준으로 하며, 1시간씩 텀을 두고 하루 3번까지 통화를 시도해 보실 수 있습니다.",
  },
];

const defaultOpenValues = faqs
  .map((f, i) => (f.open ? `faq-${i}` : null))
  .filter((v): v is string => v !== null);

export function Section6() {
  return (
    <section id="faq" className="bg-white py-[100px]">
      <Container>
        <div className="flex flex-col items-center gap-[90px]">
          <SectionHeader align="center" title="자주 묻는 질문" />
          <Accordion.Root
            type="multiple"
            defaultValue={defaultOpenValues}
            className="w-full"
          >
            {faqs.map((f, i) => (
              <FaqItem
                key={i}
                value={`faq-${i}`}
                question={f.q}
                answer={f.a}
              />
            ))}
          </Accordion.Root>
        </div>
      </Container>
    </section>
  );
}
