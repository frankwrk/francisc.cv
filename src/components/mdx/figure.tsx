type FigureProps = {
  src: string;
  alt: string;
  caption?: string;
};

export function Figure({ src, alt, caption }: FigureProps) {
  return (
    <figure className="my-8 space-y-2">
      <div className="overflow-hidden rounded-sm border border-[var(--scaffold-line)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} className="w-full" />
      </div>
      {caption && (
        <figcaption className="text-[11px] tracking-[0.06em] text-[var(--scaffold-ruler)] [font-family:var(--font-geist-pixel-square)]">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
