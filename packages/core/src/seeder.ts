import { Fixture, isFixture } from "./fixture";

export class Seeder {
  seed<T>(fixture: Fixture<T>) {
    if (!isFixture(fixture)) {
      throw new Error(
        "An unexpected error occured while seeding: " +
          "the provided fixture is not valid." +
          "\n\nA valid fixture is a plain object with a 'create' method."
      );
    }

    const context = this.buildContext();
    return fixture.create(context);
  }

  private buildContext(): FluseFixtureContext {
    return {};
  }
}
