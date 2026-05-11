"use client";

import { ChevronDown } from "lucide-react";
import { REGIONS, type Region } from "@/lib/checkout/constants";

export function RegionSelect({
  value,
  onChange,
}: {
  value: Region | "";
  onChange: (next: Region | "") => void;
}) {
  return (
    <section className="bg-white rounded-card p-6">
      <h2 className="text-h3 text-fg mb-6">지역 선택</h2>
      <div className="flex flex-col gap-2">
        <label
          htmlFor="region"
          className="text-body font-medium text-fg flex items-center gap-1"
        >
          DB 분배 지역<span className="text-primary">*</span>
        </label>
        <div className="relative">
          <select
            id="region"
            value={value}
            onChange={(e) => onChange(e.target.value as Region | "")}
            className="w-full h-12 pl-4 pr-10 border border-card-light rounded-lg bg-white text-body text-fg appearance-none focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors cursor-pointer"
          >
            <option value="" disabled>
              지역을 선택해주세요
            </option>
            {REGIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          <ChevronDown
            size={20}
            strokeWidth={2}
            aria-hidden="true"
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted"
          />
        </div>
      </div>
    </section>
  );
}
