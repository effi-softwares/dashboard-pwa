"use client"
import React from "react"

import { QueryProvider } from "@/providers/query-provider"

import "./globals.css"

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  React.useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then(registration => {
          console.log("Service Worker registered with scope:", registration.scope)
        })
        .catch(error => {
          console.error("Service Worker registration failed:", error)
        })
    }
  }, [])

  return <QueryProvider>{children}</QueryProvider>
}
