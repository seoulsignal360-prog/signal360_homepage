import { Hero } from "@/app/components/sections/Hero";
import { Section1 } from "@/app/components/sections/Section1";
import { Section2 } from "@/app/components/sections/Section2";
import { Section3 } from "@/app/components/sections/Section3";
import { Section4 } from "@/app/components/sections/Section4";
import { Section5 } from "@/app/components/sections/Section5";
import { Section6 } from "@/app/components/sections/Section6";
import { Reveal } from "@/app/components/ui/Reveal";

export default function Home() {
  return (
    <main className="flex-1">
      {/* Hero is above the fold — render in final state on first paint, no
          reveal animation, so visitors see the headline immediately. */}
      <Hero />
      <Reveal>
        <Section1 />
      </Reveal>
      <Reveal>
        <Section2 />
      </Reveal>
      <Reveal>
        <Section3 />
      </Reveal>
      <Reveal>
        <Section4 />
      </Reveal>
      <Reveal>
        <Section5 />
      </Reveal>
      <Reveal>
        <Section6 />
      </Reveal>
    </main>
  );
}
