import { useState, useCallback, useEffect, RefObject } from "react";
import { useInView } from "framer-motion";

export function useScrollAnimation(ref: RefObject<HTMLElement>, threshold: number = 0.1) {
  const isInView = useInView(ref, { once: true, amount: threshold });
  return isInView;
}

export function useIntersectionObserver(
  elementRef: RefObject<Element>,
  callback: (entry: IntersectionObserverEntry) => void,
  options: IntersectionObserverInit = { threshold: 0.1 }
) {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          callback(entry);
        });
      },
      options
    );

    const currentElement = elementRef.current;
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [elementRef, callback, options]);
}

export function useParallax(
  ref: RefObject<HTMLElement>,
  speed: number = 0.5
) {
  const [scrollY, setScrollY] = useState(0);

  const handleScroll = useCallback(() => {
    if (typeof window === "undefined") return;
    setScrollY(window.scrollY);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    if (!ref.current) return;
    
    const element = ref.current;
    const rect = element.getBoundingClientRect();
    const elementY = rect.top + scrollY;
    const elementHeight = rect.height;
    
    // Only apply parallax effect when element is near viewport
    if (
      scrollY + window.innerHeight > elementY &&
      scrollY < elementY + elementHeight
    ) {
      const offset = (scrollY - elementY) * speed;
      element.style.transform = `translateY(${offset}px)`;
    }
  }, [scrollY, ref, speed]);
}

export function useStaggerChildren(
  containerRef: RefObject<HTMLElement>,
  defaultDelay: number = 0.1,
  defaultDuration: number = 0.5
) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Once triggered, no need to observe anymore
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [containerRef]);

  const getChildAnimationProps = useCallback(
    (index: number, customDelay?: number, customDuration?: number) => {
      const delay = customDelay !== undefined ? customDelay : defaultDelay * index;
      const duration = customDuration !== undefined ? customDuration : defaultDuration;

      return {
        initial: { opacity: 0, y: 20 },
        animate: isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 },
        transition: { duration, delay },
      };
    },
    [isVisible, defaultDelay, defaultDuration]
  );

  return { isVisible, getChildAnimationProps };
}
