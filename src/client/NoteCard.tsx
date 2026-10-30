import type { Note } from "@/shared/types";
import { useEffect, useState } from "react";
import { Button } from "./components/ui/button";
import { Card } from "./components/ui/card";
import { Textarea } from "./components/ui/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LoaderCircle, Trash2 } from "lucide-react";
import { deleteNote, updateNote } from "./lib/notes";

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeStyle: "short",
});

interface NoteCardViewProps {
  note: Note;
  draft: string;
  isPending?: boolean;
  isError?: boolean;
  isDeleting?: boolean;
  deleteError?: string;
  onDraftChange?: (content: string) => void;
  onRetry?: () => void;
  onDelete?: () => void;
}

export default function NoteCard(note: Note) {
  const [draft, setDraft] = useState<string>(note.content);

  const queryClient = useQueryClient();
  const { mutate, isPending, isError } = useMutation({
    mutationFn: updateNote,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notes"] }),
  });
  const {
    mutate: removeNote,
    isPending: isDeleting,
    isError: isDeleteError,
    error: deleteError,
  } = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.setQueryData<Note[]>(["notes"], (notes) =>
        notes?.filter((savedNote) => savedNote.id !== note.id),
      );
      return queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  useEffect(() => {
    if (note.content === draft || isPending || isError || isDeleting) return;

    const timeout = setTimeout(() => {
      mutate({ id: note.id, content: draft });
    }, 600);
    return () => {
      clearTimeout(timeout);
    };
  }, [draft, note.id, note.content, mutate, isPending, isError, isDeleting]);

  return (
    <NoteCardView
      note={note}
      draft={draft}
      isPending={isPending}
      isError={isError}
      isDeleting={isDeleting}
      deleteError={isDeleteError ? deleteError.message : undefined}
      onDraftChange={setDraft}
      onRetry={() => mutate({ id: note.id, content: draft })}
      onDelete={() => removeNote(note.id)}
    />
  );
}

export function NoteCardView({
  note,
  draft,
  isPending = false,
  isError = false,
  isDeleting = false,
  deleteError,
  onDraftChange,
  onRetry,
  onDelete,
}: NoteCardViewProps) {
  const createdAt = new Date(note.created_at);
  const updatedAt = note.updated_at === null ? null : new Date(note.updated_at);

  return (
    <Card className="relative gap-0 overflow-hidden rounded-lg py-0 shadow-none focus-within:ring-2 focus-within:ring-ring/30">
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="absolute right-2 top-2 text-muted-foreground hover:text-destructive"
        aria-label="Delete note"
        title="Delete note"
        disabled={isPending || isDeleting || !onDelete}
        onClick={onDelete}
      >
        {isDeleting ? (
          <LoaderCircle aria-hidden="true" className="animate-spin" />
        ) : (
          <Trash2 aria-hidden="true" />
        )}
      </Button>
      <Textarea
        aria-label="Note content"
        placeholder="Write a note..."
        className="min-h-20 resize-none rounded-none border-0 bg-transparent px-4 py-3 pr-12 text-base leading-6 shadow-none focus-visible:border-transparent focus-visible:ring-0 dark:bg-transparent md:text-sm"
        disabled={isDeleting}
        readOnly={!onDraftChange}
        value={draft}
        onChange={(e) => onDraftChange?.(e.target.value)}
      />
      <footer className="space-y-1 border-t border-border/60 bg-muted/20 px-4 py-2">
        <dl className="grid min-w-0 grid-cols-1 gap-x-4 gap-y-1 text-xs text-muted-foreground sm:grid-cols-2">
          <div className="flex min-w-0 gap-1.5">
            <dt className="shrink-0">Created</dt>
            <dd className="min-w-0 truncate">
              <time dateTime={createdAt.toISOString()} title={createdAt.toLocaleString()}>
                {dateFormatter.format(createdAt)}
              </time>
            </dd>
          </div>
          <div className="flex min-w-0 gap-1.5">
            <dt className="shrink-0">Updated</dt>
            <dd className="min-w-0 truncate">
              {updatedAt ? (
                <time dateTime={updatedAt.toISOString()} title={updatedAt.toLocaleString()}>
                  {dateFormatter.format(updatedAt)}
                </time>
              ) : (
                "Not updated yet"
              )}
            </dd>
          </div>
        </dl>
        <div className="flex h-8 min-w-0 items-center gap-2 text-xs">
          {isError || deleteError ? (
            <>
              <p
                role="alert"
                className="min-w-0 flex-1 truncate text-destructive"
                title={deleteError}
              >
                {deleteError
                  ? isError
                    ? `Could not save note. ${deleteError}`
                    : deleteError
                  : "Could not save note."}
              </p>
              {isError && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 shrink-0 px-2 text-xs"
                  disabled={isPending || isDeleting || !onRetry}
                  onClick={onRetry}
                >
                  Retry
                </Button>
              )}
            </>
          ) : (
            <p role="status" className="flex items-center gap-1.5 text-muted-foreground">
              {(isPending || isDeleting) && (
                <LoaderCircle aria-hidden="true" className="size-3 animate-spin" />
              )}
              {isDeleting
                ? "Deleting..."
                : isPending
                  ? "Saving..."
                  : draft !== note.content
                    ? "Unsaved changes"
                    : "Saved"}
            </p>
          )}
        </div>
      </footer>
    </Card>
  );
}
