import { useEffect, useRef } from "react";

/**
 * Scroll-reveal hook: adds `.in` class to elements with `.up` when they
 * enter the viewport, matching the original HTML behaviour.
 */
export function useScrollReveal() {
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (!("IntersectionObserver" in window)) {
      // Fallback: show everything immediately
      document.querySelectorAll(".up").forEach((el) => el.classList.add("in"));
      return;
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            observerRef.current?.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -28px 0px" }
    );

    document.querySelectorAll(".up").forEach((el) => observerRef.current!.observe(el));

    // Hero elements fire on first paint
    requestAnimationFrame(() => {
      setTimeout(() => {
        document.querySelectorAll(".hero .up").forEach((el) => el.classList.add("in"));
      }, 80);
    });

    return () => {
      observerRef.current?.disconnect();
    };
  }, []);
}
