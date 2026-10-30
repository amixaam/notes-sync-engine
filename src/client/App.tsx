import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import NoteCard from "./NoteCard";
import { Button } from "./components/ui/button";
import { createNote, notesQueryOptions } from "./lib/notes";
import "./index.css";
import { Plus, RefreshCcw, RefreshCcwDot } from "lucide-react";

export function App() {
  const notesQuery = useQuery(notesQueryOptions);
  const queryClient = useQueryClient();
  const createNoteMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notes"] }),
  });

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 w-full border-b bg-background/95 backdrop-blur-sm">
        <div className="mx-auto flex h-14 w-full max-w-3xl items-center justify-between gap-4 px-6">
          <h1 className="text-lg font-semibold">Notes</h1>
          <nav aria-label="Notes actions" className="flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Reload notes"
              title="Reload notes"
              disabled={notesQuery.isFetching}
              onClick={() => void notesQuery.refetch()}
            >
              {notesQuery.isFetching ? <RefreshCcwDot /> : <RefreshCcw />}
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Add note"
              title="Add note"
              disabled={createNoteMutation.isPending}
              onClick={() => createNoteMutation.mutate()}
            >
              {createNoteMutation.isPending ? <RefreshCcwDot /> : <Plus />}
            </Button>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl space-y-6 p-6">
        <section
          aria-label="Saved notes"
          aria-busy={notesQuery.isFetching}
          className="space-y-4"
        >
          {notesQuery.isPending && <p role="status">Loading notes…</p>}

          {notesQuery.isError && (
            <div role="alert" className="space-y-3">
              <p className="text-destructive">{notesQuery.error.message}</p>
            </div>
          )}
          {createNoteMutation.isError && (
            <div role="alert" className="space-y-3">
              <p className="text-destructive">
                {createNoteMutation.error.message}
              </p>
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
    </div>
  );
}

export default App;
