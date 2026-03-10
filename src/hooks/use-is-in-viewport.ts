import { useEffect, useRef, useState } from "react";

type UseIsInViewportResult<T extends HTMLElement> = {
  ref: React.RefObject<T | null>;
  isInView: boolean;
};

export function useIsInViewport<T extends HTMLElement = HTMLElement>(): UseIsInViewportResult<T> {
  const ref = useRef<T | null>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const node = ref.current;

    if (!node) {
      return;
    }

    if (typeof IntersectionObserver === "undefined") {
      setIsInView(true);
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

