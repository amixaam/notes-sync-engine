import type { Note } from "@/shared/types";
import { Database } from "bun:sqlite";

const db = new Database("db.sqlite", {
  strict: true,
});

db.run(`
CREATE TABLE IF NOT EXISTS notes(
  id TEXT PRIMARY KEY,
  content TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER
) STRICT
`);

export function insertNote(content: string): Note | null {
  const statement = db.prepare<Note, [string, string, number]>(
    `INSERT INTO notes (id, content, created_at) VALUES (?, ?, ?) RETURNING *`,
  );

  return statement.get(Bun.randomUUIDv7(), content, Date.now());
}

export function getAllNotes(): Note[] {
  const statement = db.prepare<Note, []>(`SELECT * FROM notes`);
  return statement.all();
}

export function getNote(id: string): Note | null {
  const statement = db.prepare<Note, [string]>(`SELECT * FROM notes WHERE id = ?`);
  return statement.get(id);
}

export function updateNote(id: string, content: string): Note | null {
  const statement = db.prepare<Note, [string, number, string]>(`UPDATE notes SET content = ?, updated_at = ? WHERE id = ? RETURNING *`);
  return statement.get(content, Date.now(), id);
}

export function deleteNote(id: string) {
  const statement = db.prepare<Note, [string]>(`DELETE FROM notes WHERE id = ?`);
  statement.run(id);
}

const notes = getAllNotes();
console.log(notes);
