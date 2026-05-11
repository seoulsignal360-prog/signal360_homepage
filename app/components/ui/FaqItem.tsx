"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";

type FaqItemProps = {
  value: string;
  question: string;
  answer: string;
};

export function FaqItem({ value, question, answer }: FaqItemProps) {
  return (
    <Accordion.Item
      value={value}
      className="border-b border-card-light last:border-b-0"
    >
      <Accordion.Header>
        <Accordion.Trigger className="group flex w-full items-center justify-between gap-4 py-6 px-8 text-lead text-fg text-left transition-colors hover:bg-card-light/50 focus-visible:outline-none focus-visible:bg-card-light/50">
          <span>{question}</span>
          <ChevronDown
            size={32}
            strokeWidth={2}
            aria-hidden="true"
            className="shrink-0 text-muted transition-transform duration-200 group-data-[state=open]:rotate-180"
          />
        </Accordion.Trigger>
      </Accordion.Header>
      <Accordion.Content className="overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
        <div className="pb-6 px-8 text-body text-muted whitespace-pre-line">
          {answer}
        </div>
      </Accordion.Content>
    </Accordion.Item>
  );
}
