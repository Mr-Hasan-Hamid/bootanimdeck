"use client";

import { useEffect } from "react";

export default function PWARegister() {
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      "serviceWorker" in navigator
    ) {
      // Exclude crawlers and search bots from registering the service worker
      const isBot = /bot|google|baidu|bing|msn|duckduckbot|teoma|slurp|yandex/i.test(
        navigator.userAgent
      );
      if (!isBot) {
        window.addEventListener("load", () => {
          navigator.serviceWorker
            .register("/sw.js")
            .then((reg) => {
              console.log("Service Worker registered successfully:", reg.scope);
            })
            .catch((err) => {
              console.error("Service Worker registration failed:", err);
            });
        });
      }
    }
  }, []);

  return null;
}
