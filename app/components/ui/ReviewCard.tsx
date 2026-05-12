import Image from "next/image";

type ReviewCardProps = {
  name: string;
  company: string;
  quote: string;
  avatarSrc: string;
};

export function ReviewCard({
  name,
  company,
  quote,
  avatarSrc,
}: ReviewCardProps) {
  return (
    // Subtle lift + shadow on hover so the marquee feels interactive as
    // the user scans across testimonials. Background brightens to white
    // so the active card visually pops above the row of muted siblings.
    <div className="bg-card-light hover:bg-white rounded-card p-8 h-[258px] flex flex-col gap-6 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_12px_28px_-12px_rgba(26,29,46,0.18)]">
      <div className="flex items-center gap-4">
        <div className="relative shrink-0 w-[60px] h-[60px] rounded-full overflow-hidden bg-white">
          <Image
            src={avatarSrc}
            alt={`${name} 프로필`}
            fill
            sizes="60px"
            className="object-cover"
          />
        </div>
        <div className="flex flex-col gap-1 min-w-0">
          <p className="text-lead text-fg">{name}</p>
          <p className="text-body text-muted">{company}</p>
        </div>
      </div>
      <p className="text-body text-fg line-clamp-3">{quote}</p>
    </div>
  );
}
