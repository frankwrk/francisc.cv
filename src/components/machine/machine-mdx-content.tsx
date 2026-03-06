import type { ReactNode } from "react";

export function MachineMdxContent({ children }: { children: ReactNode }) {
  return (
    <div
      className="
        text-[14px] leading-7 text-[var(--scaffold-ruler)] [font-family:var(--font-geist-mono)]
        [&_h1]:mb-6 [&_h1]:text-[22px] [&_h1]:font-medium [&_h1]:tracking-tight [&_h1]:text-[var(--scaffold-toggle-text-active)] [&_h1]:[font-family:var(--font-geist-sans)]
        [&_h2]:mb-2 [&_h2]:mt-10 [&_h2]:text-[16px] [&_h2]:font-medium [&_h2]:tracking-[0.04em] [&_h2]:text-[var(--scaffold-toggle-text-active)] [&_h2]:[font-family:var(--font-geist-sans)]
        [&_h3]:mb-1 [&_h3]:mt-6 [&_h3]:text-[14px] [&_h3]:font-medium [&_h3]:text-[var(--scaffold-toggle-text-active)] [&_h3]:[font-family:var(--font-geist-sans)]
        [&_p]:mb-4
        [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5
        [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:space-y-1 [&_ol]:pl-5
        [&_li]:leading-relaxed
        [&_a]:text-[var(--scaffold-toggle-text-active)] [&_a]:underline [&_a]:underline-offset-2
        [&_pre]:my-5 [&_pre]:overflow-x-auto [&_pre]:border [&_pre]:border-[var(--scaffold-line)] [&_pre]:bg-[var(--scaffold-bg)] [&_pre]:p-4 [&_pre]:text-[12px] [&_pre]:leading-6 [&_pre]:text-[var(--scaffold-toggle-text-active)]
        [&_code:not(pre_code)]:rounded [&_code:not(pre_code)]:bg-[var(--scaffold-bg)] [&_code:not(pre_code)]:px-1.5 [&_code:not(pre_code)]:py-0.5 [&_code:not(pre_code)]:text-[13px] [&_code:not(pre_code)]:text-[var(--scaffold-toggle-text-active)]
        [&_table]:mb-4 [&_table]:w-full [&_table]:border-collapse [&_table]:text-[13px]
        [&_th]:border [&_th]:border-[var(--scaffold-line)] [&_th]:p-2 [&_th]:text-left [&_th]:font-medium [&_th]:text-[var(--scaffold-toggle-text-active)]
        [&_td]:border [&_td]:border-[var(--scaffold-line)] [&_td]:p-2
        [&_hr]:my-8 [&_hr]:border-[var(--scaffold-line)]
      "
      data-oid="zmeg3px"
    >
      {children}
    </div>
  );
}
