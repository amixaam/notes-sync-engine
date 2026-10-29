import { serve } from "bun";
import { createNoteSchema } from "@/shared/schemas";
import index from "../client/index.html";
import { deleteNote, getAllNotes, getNote, insertNote, updateNote } from "./db";

const server = serve({
  routes: {
    // Serve index.html for all unmatched routes.
    "/*": index,

    "/api/notes": {
      async GET(req) {
        return Response.json(getAllNotes());
      },
      async POST(req) {
        let body: unknown;

        try {
          body = await req.json();
        } catch {
          return Response.json({ error: "Invalid JSON body" }, { status: 400 });
        }

        const result = createNoteSchema.safeParse(body);

        if (!result.success) {
          return Response.json(
            { error: "Invalid note input", issues: result.error.issues },
            { status: 400 },
          );
        }

        const note = insertNote(result.data.content);

        if (note === null) {
          return Response.json(
            { error: "Failed to create note" },
            { status: 500 },
          );
        }

        return Response.json(note, { status: 201 });
      },
    },

    "/api/notes/:id": {
      async GET(req) {
        const id = req.params.id;
        const note = getNote(id);
        return Response.json(getNote(id), {status: note ? 200 : 404});
      },
      async DELETE(req) {
        const id = req.params.id;
        deleteNote(id);
        return Response.json({status: 204});
      },
      async PATCH(req) {
        const id = req.params.id;

        let body: unknown;

        try {
          body = await req.json();
        } catch {
          return Response.json({ error: "Invalid JSON body" }, { status: 400 });
        }

        const result = createNoteSchema.safeParse(body);

        if (!result.success) {
          return Response.json(
            { error: "Invalid note input", issues: result.error.issues },
            { status: 400 },
          );
        }

        const note = updateNote(id, result.data.content);

        if (note === null) {
          return Response.json(
            { error: "Failed to update note" },
            { status: 500 },
          );
        }

        return Response.json(note, { status: 200 });
      },
    },
  },

  development: process.env.NODE_ENV !== "production" && {
    // Enable browser hot reloading in development
    hmr: true,

    // Echo console logs from the browser to the server
    console: true,
  },
});

console.log(`🚀 Server running at ${server.url}`);
