import type { ReactNode } from "react";

export function MdxContent({ children }: { children: ReactNode }) {
  return (
    <div
      className="
        space-y-4 text-[15px] leading-[22px] text-[var(--scaffold-ruler)]
        [&_h2]:mb-1 [&_h2]:mt-8 [&_h2]:scroll-mt-20 [&_h2]:text-[17px] [&_h2]:font-medium [&_h2]:leading-snug [&_h2]:tracking-tight [&_h2]:text-balance [&_h2]:text-[var(--scaffold-toggle-text-active)]
        [&_h3]:mb-1 [&_h3]:mt-6 [&_h3]:scroll-mt-20 [&_h3]:text-[15px] [&_h3]:font-medium [&_h3]:text-balance [&_h3]:text-[var(--scaffold-toggle-text-active)]
        [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5
        [&_ol]:list-decimal [&_ol]:space-y-1 [&_ol]:pl-5
        [&_li]:leading-relaxed
        [&_pre]:my-4 [&_pre]:overflow-x-auto [&_pre]:rounded-sm [&_pre]:border [&_pre]:border-[var(--scaffold-line)] [&_pre]:bg-[var(--scaffold-bg)] [&_pre]:p-4 [&_pre]:text-[13px]
        [&_code:not(pre_code)]:rounded [&_code:not(pre_code)]:bg-[var(--scaffold-bg)] [&_code:not(pre_code)]:px-1.5 [&_code:not(pre_code)]:py-0.5 [&_code:not(pre_code)]:font-mono [&_code:not(pre_code)]:text-[13px] [&_code:not(pre_code)]:text-[var(--scaffold-toggle-text-active)]
        [&_a]:text-[var(--scaffold-toggle-text-active)] [&_a]:underline [&_a]:transition-opacity [&_a]:hover:opacity-70
        [&_blockquote]:border-l-2 [&_blockquote]:border-[var(--scaffold-line)] [&_blockquote]:pl-4 [&_blockquote]:italic
        [&_hr]:my-6 [&_hr]:border-[var(--scaffold-line)]
        [&_strong]:font-medium [&_strong]:text-[var(--scaffold-toggle-text-active)]
        [&_table]:w-full [&_table]:border-collapse [&_table]:text-[14px]
        [&_th]:border [&_th]:border-[var(--scaffold-line)] [&_th]:p-2 [&_th]:text-left [&_th]:text-[var(--scaffold-toggle-text-active)]
        [&_td]:border [&_td]:border-[var(--scaffold-line)] [&_td]:p-2
      "
     
    >
      {children}
    </div>
  );
}
