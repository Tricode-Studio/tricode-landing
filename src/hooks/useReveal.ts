import { useEffect } from 'react';

export function useReveal() {
  useEffect(() => {
    const tracked = new WeakSet<HTMLElement>();
    const revealNode = (node: Element | null) => {
      if (!(node instanceof HTMLElement) || !node.classList.contains('reveal')) {
        return;
      }
      node.classList.add('is-visible');
    };

    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll<HTMLElement>('.reveal').forEach(revealNode);

      const fallbackMutationObserver = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          for (const added of mutation.addedNodes) {
            if (!(added instanceof Element)) {
              continue;
            }
            revealNode(added);
            added.querySelectorAll<HTMLElement>('.reveal').forEach(revealNode);
          }
        }
      });

      fallbackMutationObserver.observe(document.body, { childList: true, subtree: true });
      return () => fallbackMutationObserver.disconnect();
    }

    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            intersectionObserver.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.12 },
    );

    const observeReveal = (node: Element | null) => {
      if (!(node instanceof HTMLElement) || !node.classList.contains('reveal')) {
        return;
      }
      if (node.classList.contains('is-visible')) {
        return;
      }
      if (tracked.has(node)) {
        return;
      }
      tracked.add(node);
      intersectionObserver.observe(node);
    };

    document.querySelectorAll<HTMLElement>('.reveal').forEach(observeReveal);

    const mutationObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const added of mutation.addedNodes) {
          if (!(added instanceof Element)) {
            continue;
          }
          observeReveal(added);
          added.querySelectorAll<HTMLElement>('.reveal').forEach(observeReveal);
        }
      }
    });

    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      mutationObserver.disconnect();
      intersectionObserver.disconnect();
    };
  }, []);
}
