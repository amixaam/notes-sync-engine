# bun-react-tailwind-shadcn-template

Source layout:

```text
src/
  client/  React app, UI components, styles, and assets
  server/  Bun server and API routes
  shared/  Types and utilities used by both
```

The `@/` alias points to `src`, so shared code can be imported from `@/shared/...`.

To install dependencies:

```bash
bun install
```

To start a development server:

```bash
bun dev
```

To run for production:

```bash
bun start
```

This project was created using `bun init` in bun v1.4.2. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.
