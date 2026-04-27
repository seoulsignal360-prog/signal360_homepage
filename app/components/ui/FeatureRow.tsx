import Image from "next/image";

type FeatureRowProps = {
  title: React.ReactNode;
  bullets: string[];
  imageSrc: string;
  imageAlt: string;
  reverse?: boolean;
};

export function FeatureRow({
  title,
  bullets,
  imageSrc,
  imageAlt,
  reverse = false,
}: FeatureRowProps) {
  return (
    <div
      className={`flex flex-col gap-8 mx-auto max-w-[820px] md:flex-row md:items-center md:gap-12 ${
        reverse ? "md:flex-row-reverse" : ""
      }`}
    >
      <div className="flex flex-col gap-3 w-full md:flex-1 md:min-w-0 md:max-w-[374px]">
        <h3 className="text-h3 text-fg break-keep">{title}</h3>
        <ul className="list-disc pl-7 flex flex-col gap-1 text-body text-muted break-keep">
          {bullets.map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>
      </div>
      <div className="relative w-full md:w-[401px] md:shrink-0 aspect-square rounded-card overflow-hidden bg-card-light">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          sizes="(min-width: 768px) 401px, 100vw"
          className="object-contain"
        />
      </div>
    </div>
  );
}
