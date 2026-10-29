import type { Note } from "@/shared/types";
import { Card } from "./components/ui/card";
import { Textarea } from "./components/ui/textarea";

export default function NoteCard(note: Note) {
  return (
    <Card className="px-6">
      <Textarea aria-label="Note content" value={note.content} readOnly />
    </Card>
  );
}
