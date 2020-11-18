---
id: initialize
title: Initialize
sidebar_label: Initialize
---

In order to gain access to the API of Fluse you have to initialize it.

When you initialize Flue you also have the ability to specifiy which plugins you wish to use.

```typescript
import { fluse } from "fluse";
import fakerPlugin from "fluse-plugin-faker";

export const { fixture, combine, execute } = fluse({
  plugins: {
    faker: fakerPlugin(),
  },
});
```

:::tip
We suggest that you do this **only once** and export the resulting API.
:::

After you've initialized Fluse it's time to [build your first fixture](./define-fixture.md).
