import { combine, fixture } from ".";

class User {
  constructor(public id: number, public username: string) {}
}

class Post {
  constructor(public id: number, public title: string, public author: User) {}
}

const helloFixture = fixture({
  async create() {
    return "world";
  },
});

type UserFixtureArgs = {
  username: string;
};

/** A fixture with arguments, returning an object */
const userFixture = fixture({
  async create(ctx, args: UserFixtureArgs) {
    const user = new User(1, args.username);
    return user;
  },
});

type PostFixtureArgs = {
  author: User;
};

/** A fixture with arguments, returning an array */
const postFixture = fixture({
  async create(ctx, args: PostFixtureArgs) {
    return Promise.all(
      Array(10)
        .fill(0)
        .map((_, index) => {
          const post = new Post(index, `Post ${index}`, args.author);
          return post;
        })
    );
  },
});

const voidFixture = fixture({
  async create() {
    console.log("Hello");
  },
});

async function main() {
  const ctx = {};

  /* Basic combination */
  const twoUsers = combine()
    .and(helloFixture("hello"))
    .and(userFixture("foo", { username: "foo" }))
    .and(userFixture("bar", { username: "bar" }))
    .and(voidFixture())
    .toFixture();

  const twoUserFixtures = await twoUsers.create(ctx);
  console.log(JSON.stringify(twoUserFixtures, null, 2));

  /* Advanced combination, using previous fixtures in the chain as arguments for the next. */
  const twoUsersWithPosts = combine()
    .and(twoUsers)
    .and(({ foo }) => postFixture("fooPosts", { author: foo }))
    .and(({ bar }) => postFixture("barPosts", { author: bar }))
    .toFixture();

  const twoUsersWithPostsFixtures = await twoUsersWithPosts.create(ctx);
  console.log(JSON.stringify(twoUsersWithPostsFixtures, null, 2));
}

main()
  .then(() => {
    console.log("Done");
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
