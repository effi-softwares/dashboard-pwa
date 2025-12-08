"use client"

import { useQuery } from "@tanstack/react-query"

interface Note {
  id: number
  title: string
  content: string
  createdAt: string
}

export function NoteList() {
  const {
    data: notes = [],
    isLoading,
    isError,
  } = useQuery<Note[]>({
    queryKey: ["notes"],
    queryFn: async () => {
      const response = await fetch("/api/notes")
      if (!response.ok) throw new Error("Failed to fetch notes")
      return response.json()
    },
  })

  if (isLoading) {
    return (
      <div className="p-6 border rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Notes</h2>
        <p className="text-muted-foreground">Loading notes...</p>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="p-6 border rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Notes</h2>
        <p className="text-red-500">Failed to load notes</p>
      </div>
    )
  }

  return (
    <div className="p-6 border rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Notes ({notes.length})</h2>
      {notes.length === 0 ? (
        <p className="text-muted-foreground">No notes found. Create one above!</p>
      ) : (
        <div className="space-y-4">
          {notes.map(note => (
            <div
              key={note.id}
              className="p-4 border rounded-md bg-card hover:bg-accent/50 transition-colors"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-lg">{note.title}</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-2">{note.content}</p>
              <p className="text-xs text-muted-foreground">
                Created: {new Date(note.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
