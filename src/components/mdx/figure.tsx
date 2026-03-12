type FigureProps = {
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
};

export function Figure({ src, alt, caption, width, height }: FigureProps) {
  return (
    <figure className="my-8 space-y-2">
      <div
        className="overflow-hidden rounded-sm border border-[var(--scaffold-line)]"
       
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading="lazy"
          className="w-full"
         
        />
      </div>
      {caption && (
        <figcaption
          className="text-[11px] tracking-[0.06em] text-[var(--scaffold-ruler)] [font-family:var(--font-geist-pixel-square)]"
         
        >
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
