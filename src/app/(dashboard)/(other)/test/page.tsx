"use client"

import { useState } from "react"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

import { NoteForm } from "@/components/note-form"
import { NoteList } from "@/components/note-list"

export default function TestPage() {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-4xl font-bold mb-8">User & Notes Management</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Forms Column */}
          <div className="space-y-8">
            <NoteForm />
          </div>

          {/* Lists Column */}
          <div className="space-y-8">
            <NoteList />
          </div>
        </div>
      </div>
    </QueryClientProvider>
  )
}
