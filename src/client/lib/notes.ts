import { queryOptions } from "@tanstack/react-query";
import { noteSchema, notesSchema } from "@/shared/schemas";
import type { Note } from "@/shared/types";

export async function fetchNotes(signal?: AbortSignal): Promise<Note[]> {
  const response = await fetch("/api/notes", { signal });

  if (!response.ok) {
    throw new Error("Could not load notes. Please try again.");
  }

  const body: unknown = await response.json();
  const result = notesSchema.safeParse(body);

  if (!result.success) {
    throw new Error("Could not read the notes returned by the server.");
  }

  return result.data;
}

export async function createNote(): Promise<Note> {
  const response = await fetch("/api/notes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content: "" }),
  });

  if (!response.ok) {
    throw new Error("Could not load notes. Please try again.");
  }

  const body: unknown = await response.json();
  const result = noteSchema.safeParse(body);

  if (!result.success) {
    throw new Error("Could not create new note.");
  }

  return result.data;
}

export async function updateNote(data: {
  id: string;
  content: string;
}): Promise<Note> {
  const response = await fetch(`/api/notes/${data.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content: data.content }),
  });

  if (!response.ok) {
    throw new Error("Could not load notes. Please try again.");
  }

  const body: unknown = await response.json();
  const result = noteSchema.safeParse(body);

  if (!result.success) {
    throw new Error("Could not update note.");
  }

  return result.data;
}

export async function deleteNote(id: string): Promise<void> {
  const response = await fetch(`/api/notes/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Could not delete note. Please try again.");
  }
}

export const notesQueryOptions = queryOptions({
  queryKey: ["notes"],
  queryFn: ({ signal }) => fetchNotes(signal),
});
