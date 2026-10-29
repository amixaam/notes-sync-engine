import { queryOptions } from "@tanstack/react-query";
import { notesSchema } from "@/shared/schemas";
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

export const notesQueryOptions = queryOptions({
  queryKey: ["notes"],
  queryFn: ({ signal }) => fetchNotes(signal),
});
