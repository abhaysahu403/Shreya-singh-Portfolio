"use client";

import { useEffect } from "react";

export function HydrationFix() {
  useEffect(() => {
    // Remove fdprocessedid attributes added by browser extensions
    const removeAttributes = () => {
      const elements = document.querySelectorAll('[fdprocessedid]');
      elements.forEach((el) => {
        el.removeAttribute('fdprocessedid');
      });
    };

    // Run immediately
    removeAttributes();

    // Set up observer for new elements
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'fdprocessedid') {
          (mutation.target as Element).removeAttribute('fdprocessedid');
        }
        if (mutation.addedNodes.length) {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1) {
              const element = node as Element;
              if (element.hasAttribute('fdprocessedid')) {
                element.removeAttribute('fdprocessedid');
              }
              // Check children
              const children = element.querySelectorAll('[fdprocessedid]');
              children.forEach((child) => child.removeAttribute('fdprocessedid'));
            }
          });
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['fdprocessedid'],
    });

    return () => observer.disconnect();
  }, []);

  return null;
}
