import { useEffect, useRef, useState } from "react";

/**
 * useMainSectionObserver
 * Triggers a callback when the element becomes the main visible section.
 *
 * @param onEnterMainSection - Function to call when element becomes the main section.
 * @param thresholdRatio - Minimum visibility ratio to consider element as main (default: 0.5).
 */
export function useMainSectionObserver(
  onEnterMainSection: () => void,
  thresholdRatio: number = 0.5
) {
  const ref = useRef<HTMLElement | null>(null);
  const [isMain, setIsMain] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isVisible = entry.intersectionRatio >= thresholdRatio;
        if (isVisible && !isMain) {
          setIsMain(true);
          onEnterMainSection();
        } else if (!isVisible && isMain) {
          setIsMain(false);
        }
      },
      {
        threshold: Array.from({ length: 11 }, (_, i) => i / 10), // 0.0 to 1.0
      }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [onEnterMainSection, thresholdRatio, isMain]);

  return ref;
}