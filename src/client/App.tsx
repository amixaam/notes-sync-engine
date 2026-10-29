import { useQuery } from "@tanstack/react-query";
import NoteCard from "./NoteCard";
import { Button } from "./components/ui/button";
import { notesQueryOptions } from "./lib/notes";
import "./index.css";
import { Plus, RefreshCcw, RefreshCcwDot } from "lucide-react";

export function App() {
  const notesQuery = useQuery(notesQueryOptions);

  return (
    <main className="mx-auto w-full max-w-3xl space-y-6 p-6">
      <header className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Notes</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            disabled={notesQuery.isFetching}
            onClick={() => void notesQuery.refetch()}
          >
            {notesQuery.isFetching ? <RefreshCcwDot /> : <RefreshCcw />}
          </Button>

          <Button variant="outline">
            <Plus />
          </Button>
        </div>
      </header>

      <section
        aria-label="Saved notes"
        aria-busy={notesQuery.isFetching}
        className="space-y-4"
      >
        {notesQuery.isPending && <p role="status">Loading notes…</p>}

        {notesQuery.isError && (
          <div role="alert" className="space-y-3">
            <p className="text-destructive">{notesQuery.error.message}</p>
            <Button
              variant="outline"
              disabled={notesQuery.isFetching}
              onClick={() => void notesQuery.refetch()}
            >
              Try again
            </Button>
          </div>
        )}

        {notesQuery.data &&
          (notesQuery.data.length === 0 ? (
            <p className="text-muted-foreground">No notes yet.</p>
          ) : (
            <ul className="space-y-4">
              {notesQuery.data.map((note) => (
                <li key={note.id}>
                  <NoteCard {...note} />
                </li>
              ))}
            </ul>
          ))}
      </section>
    </main>
  );
}

export default App;
