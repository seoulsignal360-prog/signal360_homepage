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
    <div className="bg-card-light rounded-card p-8 h-[258px] flex flex-col gap-6">
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
