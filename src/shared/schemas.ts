import { z } from "zod";
import type { Note } from "./types";

export const noteSchema: z.ZodType<Note> = z.object({
  id: z.string(),
  content: z.string(),
  created_at: z.number().int(),
  updated_at: z.number().int().nullable(),
});

export const notesSchema = z.array(noteSchema);

export const createNoteSchema = z.object({
  content: z.string(),
});

export type CreateNoteInput = z.infer<typeof createNoteSchema>;
