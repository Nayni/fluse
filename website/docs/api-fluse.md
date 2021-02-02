---
id: api-fluse
title: fluse()
sidebar_label: fluse()
---

Initializes fluse and gives you access to the rest of the api surface.

## Signature

```
fluse(options: {
  plugins?: {
    [key: string]: Plugin
  }
 }) => {
  fixture,
  scenario
};
```

- `options`: additional options for Fluse
  - `plugins`: a record of plugins to use, the key will define what is available on the [context](./plugins-introduction.md).

## Example

```typescript
import { fluse } from "fluse";
import fakerPlugin from "fluse-plugin-faker";
import typeormPlugin from "fluse-plugin-typeorm";

export const { fixture, scenario } = fluse({
  plugins: {
    orm: typeormPlugin(),
    faker: fakerPlugin(),
  },
});
```
