(window.webpackJsonp=window.webpackJsonp||[]).push([[15],{72:function(e,t,n){"use strict";n.r(t),n.d(t,"frontMatter",(function(){return s})),n.d(t,"metadata",(function(){return a})),n.d(t,"rightToc",(function(){return u})),n.d(t,"default",(function(){return l}));var r=n(2),i=n(6),o=(n(0),n(79)),s={id:"combining-fixtures",title:"Combining fixtures",sidebar_label:"Combining fixtures"},a={unversionedId:"combining-fixtures",id:"combining-fixtures",isDocsHomePage:!1,title:"Combining fixtures",description:"The big strength of Fluse lies in its re-usability. Creating a single fixture is great, but Fluse is built to help with complex data sets.",source:"@site/docs\\combining-fixtures.md",slug:"/combining-fixtures",permalink:"/fluse/docs/combining-fixtures",editUrl:"https://github.com/Nayni/fluse/edit/master/website/docs/combining-fixtures.md",version:"current",sidebar_label:"Combining fixtures",sidebar:"docs",previous:{title:"Making lists",permalink:"/fluse/docs/making-lists"},next:{title:"Accessing context",permalink:"/fluse/docs/context"}},u=[],c={rightToc:u};function l(e){var t=e.components,n=Object(i.a)(e,["components"]);return Object(o.b)("wrapper",Object(r.a)({},c,n,{components:t,mdxType:"MDXLayout"}),Object(o.b)("p",null,"The big strength of Fluse lies in its re-usability. Creating a single fixture is great, but Fluse is built to help with complex data sets."),Object(o.b)("p",null,"Instead of creating one big monolithic fixture Fluse allows you to combine multiple smaller fixtures into a bigger one. Allowing you to compose together data sets by re-using smaller parts you've defined before. On top of that Fluse does this in a type-safe way."),Object(o.b)("pre",null,Object(o.b)("code",Object(r.a)({parentName:"pre"},{className:"language-typescript"}),'// src/fixtures/userFixture.ts\nimport { fixture } from "fluse";\nimport { User } from "./entities/User";\n\ntype UserFixtureArgs = {\n  username: string;\n};\n\nexport const userFixture = fixture({\n  create(ctx, args: UserFixtureArgs) {\n    const user = new User({ username: args.username });\n    return user;\n  },\n});\n')),Object(o.b)("p",null,"Above is our first fixture. It creates a user with a given username. However in the system we are building users can make posts, thus we also have a post fixture:"),Object(o.b)("pre",null,Object(o.b)("code",Object(r.a)({parentName:"pre"},{className:"language-typescript"}),'// src/fixtures/postFixture.ts\nimport { fixture } from "fluse";\nimport { Post } from "./entities/Post";\n\ntype PostFixtureArgs = {\n  author: User;\n};\n\nexport const postFixture = fixture({\n  create(ctx, args: PostFixtureArgs, { index }) {\n    const post = new Post({\n      title: `post ${index}`,\n      author: args.author,\n    });\n    return post;\n  },\n});\n')),Object(o.b)("p",null,"The above fixture create a post for a given author, a user. It also uses some additional ",Object(o.b)("a",Object(r.a)({parentName:"p"},{href:"/fluse/docs/making-lists"}),"list options")," which will be useful for when we make many posts at the same time."),Object(o.b)("p",null,"Right now we have 2 separate fixtures. We could na\xefvely execute those fixtures in sequence, but with Fluse you can do better!"),Object(o.b)("p",null,"We can combine the above and use the output from the ",Object(o.b)("inlineCode",{parentName:"p"},"userFixture")," as input for the ",Object(o.b)("inlineCode",{parentName:"p"},"postFixture"),", on top of that we can let Fluse create many posts by configuring the postFixture as a list:"),Object(o.b)("pre",null,Object(o.b)("code",Object(r.a)({parentName:"pre"},{className:"language-typescript"}),'// src/seed.ts\nimport { combine } from "fluse";\nimport { userFixture } from "./fixtures/userFixture";\nimport { postFixture } from "./fixtures/postFixture";\n\nconst userWithPostsFixture = combine()\n  .and(userFixture("foo", { username: "foo" }))\n  .and(({ foo }) =>\n    postFixture({ name: "fooPosts", list: 10 }, { author: foo })\n  )\n  .toFixture();\n')),Object(o.b)("p",null,"The above example shows how we've successfully combined both fixtures into a single fixture. We've also successfully passed the user that is being created from the first ",Object(o.b)("inlineCode",{parentName:"p"},"userFixture")," as the author of the second ",Object(o.b)("inlineCode",{parentName:"p"},"postFixture"),"."),Object(o.b)("p",null,"Let's go through this step by step:"),Object(o.b)("ul",null,Object(o.b)("li",{parentName:"ul"},"The ",Object(o.b)("inlineCode",{parentName:"li"},"combine")," function starts a ",Object(o.b)("a",Object(r.a)({parentName:"li"},{href:"/fluse/docs/api-combine#combinedfixturebuilderand"}),"builder")," that allows you to chain any number of fixtures together and combine them into a single result"),Object(o.b)("li",{parentName:"ul"},"The ",Object(o.b)("inlineCode",{parentName:"li"},"and")," function allows you to pass any previously defined fixture as an argument, you consume that fixture just like any other fixture."),Object(o.b)("li",{parentName:"ul"},"Alternatively the ",Object(o.b)("inlineCode",{parentName:"li"},"and")," function also allows you to pass in a ",Object(o.b)("em",{parentName:"li"},"factory function"),". This factory function will receive any results from all previous fixtures in the chain (by name) and must return a consumed fixture. This way we are able to pass our user ",Object(o.b)("inlineCode",{parentName:"li"},"foo")," to the ",Object(o.b)("inlineCode",{parentName:"li"},"postFixture")," and make it the author of all the posts it creates."),Object(o.b)("li",{parentName:"ul"},"we end the chain my calling ",Object(o.b)("inlineCode",{parentName:"li"},"toFixture()")," which will produce a new fixture that is ready to be executed.")),Object(o.b)("p",null,"We can now use our new combined fixture to create all the data at once:"),Object(o.b)("pre",null,Object(o.b)("code",Object(r.a)({parentName:"pre"},{className:"language-typescript"}),'import { createExecutor } from "fluse";\nimport { userFixture } from "./fixtures/userFixture";\nimport { postFixture } from "./fixtures/postFixture";\n\nconst execute = createExecutor();\nconst { foo, fooPosts } = await execute(userWithPostsFixture);\n')),Object(o.b)("p",null,"Notice how Fluse still provides you with a type-safe result which you can inspect and assert. The names you've chosen in the combined fixture are carried over into the result."))}l.isMDXComponent=!0},79:function(e,t,n){"use strict";n.d(t,"a",(function(){return p})),n.d(t,"b",(function(){return m}));var r=n(0),i=n.n(r);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function s(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function a(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?s(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):s(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function u(e,t){if(null==e)return{};var n,r,i=function(e,t){if(null==e)return{};var n,r,i={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(i[n]=e[n]);return i}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(i[n]=e[n])}return i}var c=i.a.createContext({}),l=function(e){var t=i.a.useContext(c),n=t;return e&&(n="function"==typeof e?e(t):a(a({},t),e)),n},p=function(e){var t=l(e.components);return i.a.createElement(c.Provider,{value:t},e.children)},b={inlineCode:"code",wrapper:function(e){var t=e.children;return i.a.createElement(i.a.Fragment,{},t)}},f=i.a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,o=e.originalType,s=e.parentName,c=u(e,["components","mdxType","originalType","parentName"]),p=l(n),f=r,m=p["".concat(s,".").concat(f)]||p[f]||b[f]||o;return n?i.a.createElement(m,a(a({ref:t},c),{},{components:n})):i.a.createElement(m,a({ref:t},c))}));function m(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var o=n.length,s=new Array(o);s[0]=f;var a={};for(var u in t)hasOwnProperty.call(t,u)&&(a[u]=t[u]);a.originalType=e,a.mdxType="string"==typeof e?e:r,s[1]=a;for(var c=2;c<o;c++)s[c]=n[c];return i.a.createElement.apply(null,s)}return i.a.createElement.apply(null,n)}f.displayName="MDXCreateElement"}}]);