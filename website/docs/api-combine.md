---
id: api-combine
title: combine()
sidebar_label: combine()
---

Combines multiple fixture definitions into a scenario.

## Signature

```
combine() => CombinedFixtureBuilder;
```

### `CombinedFixtureBuilder.and()`

Chains an additional fixture onto the combined fixture.

#### Signature

```
and<TResult>(fixture: Fixture<TResult>) => CombinedFixtureBuilder<TFixtures & TResult>;
and<TResult>(fixtureFn: (fixtures: TFixtures) => Fixture<TResult>) => CombinedFixtureBuilder<TFixtures & TResult>;
```

- `fixture/fixtureFn` **(required)**: A fixture, or a factory function receiving any of the previous fixture results in the chain and must return a new fixture.

### `CombinedFixtureBuilder.toFixture()`

Creates the combined fixture.

#### Signature

```
toFixture() => Fixture<TFixtures>;
```

## Example

```typescript
const scenario = combine()
  .and(userFixture("bob"))
  .and(({ bob }) =>
    postFixture("bobsPosts", {
      list: 5,
      args: {
        author: bob,
      },
    })
  )
  .toFixture();

const { bob, bobsPosts } = await execute(scenario);
```
