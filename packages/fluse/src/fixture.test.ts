import _ from "lodash";
import { FixtureContext } from ".";
import { combine, fixture, FixtureCreateListConfig } from "./fixture";

describe("'fixture()'", () => {
  it("should create a function", () => {
    const actual = fixture({
      create() {
        return 1;
      },
    });

    expect(typeof actual).toBe("function");
  });

  it("should create a function that throws when no name is given", () => {
    const missingName = (null as unknown) as string;
    const actual = fixture({
      create() {
        return 1;
      },
    });

    expect(() => actual(missingName)).toThrowError(/must have a name/);
    expect(() => actual({ name: missingName })).toThrowError(
      /must have a name/
    );
  });

  it("should create a function that throws when the list option is a number equal or lower than 0", () => {
    const actual = fixture({
      create() {
        return 1;
      },
    });

    expect(() => actual({ name: "actual", list: 0 })).toThrowError(
      /The list option must be a number greater than 0/
    );
    expect(() => actual({ name: "actual", list: -5 })).toThrowError(
      /The list option must be a number greater than 0/
    );
  });

  it("should create a function that returns an object with a property create (function)", () => {
    const testFixture = fixture({
      create() {
        return 1;
      },
    });

    const actual = testFixture("test");

    expect(actual).toEqual(expect.any(Object));
    expect(typeof actual.create).toBe("function");
  });

  describe("'fixture().create()'", () => {
    it("should return an object with a named key, containing the result of the create() method", async () => {
      const testFixture = fixture({
        create() {
          return 1;
        },
      });

      const uot = testFixture("test");
      const actual = await uot.create({});

      expect(actual).toEqual(expect.any(Object));
      expect(actual.test).toBe(1);
    });

    it("should return an object with a named key, containing a list of results created by the create() method", async () => {
      const testFixture = fixture({
        create() {
          return 1;
        },
      });

      const uot = testFixture({ name: "test", list: 10 });
      const actual = await uot.create({});

      expect(actual).toEqual(expect.any(Object));
      expect(actual.test).toEqual(expect.any(Array));
      expect(actual.test.length).toBe(10);
      expect(_.every(actual.test, (v) => v === 1)).toBe(true);
    });

    it("should pass list parameters through as the third argument", async () => {
      const createFn = jest.fn<
        number,
        [FixtureContext, unknown, FixtureCreateListConfig]
      >();
      const testFixture = fixture({
        create: createFn,
      });

      const uot = testFixture({ name: "test", list: 2 }, {});
      const actual = await uot.create({});

      expect(actual).toEqual(expect.any(Object));
      expect(createFn).toHaveBeenCalled();
      expect(createFn.mock.calls[0][2]).toBeDefined();
      expect(createFn.mock.calls[0][2].index).toBe(0);
      expect(createFn.mock.calls[1][2].index).toBe(1);
      expect(createFn.mock.calls[0][2].size).toBe(2);
      expect(createFn.mock.calls[1][2].size).toBe(2);
    });
  });
});

describe("'combine()'", () => {
  it("should combine multiple fixtures into one", async () => {
    const fixtureOneCreate = jest.fn<number, [FixtureContext]>(() => 1);
    const fixtureTwoCreate = jest.fn<number, [FixtureContext]>(() => 2);
    const fixtureOne = fixture({
      create: fixtureOneCreate,
    });
    const fixtureTwo = fixture({
      create: fixtureTwoCreate,
    });

    const uot = combine()
      .and(fixtureOne("one"))
      .and(fixtureTwo("two"))
      .toFixture();

    const actual = await uot.create({});

    expect(actual).toEqual(expect.any(Object));
    expect(actual.one).toBeDefined();
    expect(actual.two).toBeDefined();
    expect(fixtureOneCreate).toHaveBeenCalledTimes(1);
    expect(fixtureTwoCreate).toHaveBeenCalledTimes(1);
  });

  it("should create a combined fixture that runs fixtures in the same order as they were added", async () => {
    const order: number[] = [];
    const fixtureOneCreate = jest.fn<number, [FixtureContext]>(() =>
      order.push(1)
    );
    const fixtureTwoCreate = jest.fn<number, [FixtureContext]>(() =>
      order.push(2)
    );
    const fixtureThreeCreate = jest.fn<number, [FixtureContext]>(() =>
      order.push(3)
    );
    const fixtureOne = fixture({
      create: fixtureOneCreate,
    });
    const fixtureTwo = fixture({
      create: fixtureTwoCreate,
    });
    const fixtureThree = fixture({
      create: fixtureThreeCreate,
    });

    const uot = combine()
      .and(fixtureOne("one"))
      .and(fixtureTwo("two"))
      .and(fixtureThree("three"))
      .toFixture();

    const actual = await uot.create({});

    expect(actual).toEqual(expect.any(Object));
    expect(order).toEqual([1, 2, 3]);
  });

  it("should pass partial results to the next fixture in the chain", async () => {
    const fixtureOneCreate = jest.fn<number, [FixtureContext]>(() => 1);
    const fixtureTwoCreate = jest.fn<number, [FixtureContext, { one: number }]>(
      () => 2
    );
    const fixtureThreeCreate = jest.fn<
      number,
      [FixtureContext, { one: number; two: number }]
    >(() => 3);
    const fixtureOne = fixture({
      create: fixtureOneCreate,
    });
    const fixtureTwo = fixture({
      create: fixtureTwoCreate,
    });
    const fixtureThree = fixture({
      create: fixtureThreeCreate,
    });

    const uot = combine()
      .and(fixtureOne("one"))
      .and(({ one }) => fixtureTwo("two", { one }))
      .and(({ one, two }) => fixtureThree("three", { one, two }))
      .toFixture();

    const actual = await uot.create({});

    expect(actual).toEqual(expect.any(Object));
    expect(fixtureTwoCreate.mock.calls[0][1]).toEqual({ one: 1 });
    expect(fixtureThreeCreate.mock.calls[0][1]).toEqual({ one: 1, two: 2 });
  });
});
