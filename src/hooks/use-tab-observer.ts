import * as React from "react";

interface TabObserverOptions {
  onActiveTabChange?: (index: number, element: HTMLElement) => void;
}

// AlignUI useTabObserver with a lint-safe effect model.
export function useTabObserver({ onActiveTabChange }: TabObserverOptions = {}) {
  const listRef = React.useRef<HTMLDivElement>(null);
  const onActiveTabChangeRef = React.useRef(onActiveTabChange);

  React.useEffect(() => {
    onActiveTabChangeRef.current = onActiveTabChange;
  }, [onActiveTabChange]);

  const handleUpdate = React.useCallback(() => {
    if (!listRef.current) {
      return;
    }

    const tabs = listRef.current.querySelectorAll('[role="tab"]');
    tabs.forEach((el, i) => {
      if (el.getAttribute("data-state") === "active") {
        onActiveTabChangeRef.current?.(i, el as HTMLElement);
      }
    });
  }, []);

  React.useEffect(() => {
    const resizeObserver = new ResizeObserver(handleUpdate);
    const mutationObserver = new MutationObserver(handleUpdate);

    if (listRef.current) {
      resizeObserver.observe(listRef.current);
      mutationObserver.observe(listRef.current, {
        childList: true,
        subtree: true,
        attributes: true,
      });
    }

    handleUpdate();

    return () => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, [handleUpdate]);

  return { listRef };
}
