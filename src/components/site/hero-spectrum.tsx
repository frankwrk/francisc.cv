export function HeroSpectrum() {
  return (
    <div className="tone-border relative h-[320px] overflow-hidden rounded-md bg-[#06080d] sm:h-[360px]">
      <div className="hero-grid absolute inset-0 opacity-60" aria-hidden />
      <div className="spectrum-field absolute inset-0" aria-hidden />
      <div className="spectrum-lines absolute inset-0" aria-hidden />

      <div className="absolute left-1/2 top-1/2 h-[170px] w-[170px] -translate-x-1/2 -translate-y-1/2 sm:h-[200px] sm:w-[200px]">
        <div className="spectrum-prism absolute inset-0" />
        <div className="spectrum-core absolute left-1/2 top-[62%] h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full" />
      </div>

      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between rounded-sm border border-white/10 bg-black/25 px-3 py-2 backdrop-blur-[1px]">
        <span className="font-pixel text-[10px] uppercase tracking-[0.14em] text-white/70">Signal</span>
        <span className="font-mono text-[11px] text-white/70">clarity → delivery</span>
      </div>
    </div>
  );
}
