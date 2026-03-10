import { useEffect, useRef, useState } from "react";

type UseIsInViewportResult<T extends HTMLElement> = {
  ref: React.RefObject<T | null>;
  isInView: boolean;
};

const hasIntersectionObserver = typeof IntersectionObserver !== "undefined";

export function useIsInViewport<T extends HTMLElement = HTMLElement>(): UseIsInViewportResult<T> {
  const ref = useRef<T | null>(null);
  const [isInView, setIsInView] = useState(() => !hasIntersectionObserver);

  useEffect(() => {
    if (!hasIntersectionObserver) {
      return;
    }

    const node = ref.current;

    if (!node) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === node) {
            setIsInView(entry.isIntersecting);
          }
        });
      },
      {
        threshold: 0.1,
      },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, []);

  return { ref, isInView };
}

