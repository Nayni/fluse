---
id: lists
title: Lists
sidebar_label: Lists
---

Once you have a fixture definition for a single model, you can easily let Fluse create a list of them by chaining the `list` method.

```typescript
it("should make a list", async () => {
  const users = await userFixture().list(10).execute();
});
```

The above example will execute the `userFixture` 10 times and accumulate the results into an array.

When working with lists you can also gain information regarding the list execution inside your fixture definition.

```typescript
export const postFixture = fixture<Post, PostArgs>({
  create(context, args, info) {
    const post = new Post({
      title: `title-${info.list.index}`,
    });

    return post;
  },
});
```

The third argument of the `create` function of the definition is an info object which contains a `list` key. This key contains the following information:

- `index`: the current index of the item in the list,
- `size`: the total size of the list,

:::tip
List info is also available without the `list` option . The `index` will just be `0` and `size` will be `1`.
:::

:::note
Fluse does **not** perform any optimzations for lists, it simply calls your fixture in a loop. If you need very high performance for large lists it is advisable to create a specific fixture definition for a large list.
:::
