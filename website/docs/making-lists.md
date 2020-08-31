---
id: making-lists
title: Making lists
sidebar_label: Making lists
---

Whenever you've defined a fixture for a single item you can instantly start using it to make lists as well. Fluse provides a simple `list` option to convert your fixture into a list by calling it multiple times and accumulating the results into an array.

```typescript
import { fixture } from "fluse";
import { Post } from "./entities/Post";

const postFixture = fixture({
  async create(ctx, args, info) {
    const post = new Post({ title: `title-${info.list.index}` });
    return post;
  },
});
```

In the example above we've defined a fixture for a single post. Notice how we access the third argument of the `create` function which is additional info such as list options. These options include:

- `index`: the current index that is being created.
- `size`: the total size of the list that was configured (at consume time).

:::tip
List options are also available when fixtures are just created as singles. The `index` will just be `0` and `size` will be `1`.
:::

We can now use this fixture and consume it as a list like so:

```typescript
const execute = createExecutor();
const { posts } = await execute(postFixture("posts", { list: 10 }));
```

The addition of the `list: 10` option will tell Fluse to call the `postFixture` 10 times and accumulate the results into a single array named `posts`.
