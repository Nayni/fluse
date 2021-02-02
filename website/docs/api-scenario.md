---
id: api-scenario
title: scenario()
sidebar_label: scenario()
---

Composes multiple fixture definitions into a scenario.

## Signature

```
scenario() => FluseScenarioComposer;
```

### `FluseScenarioComposer.with()`

Adds an additional fixture onto the composition

#### Signature

```
with<TResult>(name: string, fixture: Fixture<TResult>) => FluseScenarioComposer;

with<TResult>(name: string, fixtures: Fixture<TResult>[]) => FluseScenarioComposer;

with<TResult>(name: string, factory: (prevResults) => Fixture<TResult>) => FluseScenarioComposer

with<TResult>(name: string, multiFactory: (prevResults) => Fixture<TResult>[]) => FluseScenarioComposer
```

- `name` **(required)**: A unique name to refer to the specific entry in the scenario.
- `fixture` **(required)**: A fixture to generate the data for the given name.
- `fixtures` **(required)**: A list of fixtures to generate the data for the given name.
- `factory` **(required)**: A factory function returning a fixture to generate the data for the given name. The factory is any previous results in the chain as input arguments.
- `multiFactory` **(required)**: A factory function returning a list of fixtures to generate the data for the given name. The multi factory is any previous results in the chain as input arguments.

### `FluseScenarioComposer.compose()`

Composes the scenario into an executable fixture.

#### Signature

```
compose() => Fixture<TFixtures>;
```

## Example

```typescript
const { bob, bobsPosts } = await scenario()
  .with("bob", userFixture())
  .with("bobsPosts", ({ bob }) =>
    postFixture({
      author: bob,
    }).list(5)
  )
  .compose()
  .execute();
```
