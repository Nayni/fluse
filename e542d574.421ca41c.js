(window.webpackJsonp=window.webpackJsonp||[]).push([[16],{118:function(e,t,r){"use strict";r.r(t),r.d(t,"frontMatter",(function(){return u})),r.d(t,"metadata",(function(){return a})),r.d(t,"rightToc",(function(){return c})),r.d(t,"default",(function(){return l}));var n=r(2),i=r(6),o=(r(0),r(122)),u={id:"api-combine",title:"combine()",sidebar_label:"combine()"},a={id:"api-combine",title:"combine()",description:"combine() is a builder function that allows you to combine multiple single fixtures into a bigger fixture.",source:"@site/docs\\api-combine.md",permalink:"/fluse/docs/api-combine",editUrl:"https://github.com/Nayni/fluse/edit/master/website/docs/api-combine.md",sidebar_label:"combine()",sidebar:"docs",previous:{title:"fixture()",permalink:"/fluse/docs/api-fixture"},next:{title:"execute()",permalink:"/fluse/docs/api-execute"}},c=[{value:"Signature",id:"signature",children:[{value:"<code>CombinedFixtureBuilder.and()</code>",id:"combinedfixturebuilderand",children:[]},{value:"<code>CombinedFixtureBuilder.toFixture()</code>",id:"combinedfixturebuildertofixture",children:[]}]},{value:"Example",id:"example",children:[]}],s={rightToc:c};function l(e){var t=e.components,r=Object(i.a)(e,["components"]);return Object(o.b)("wrapper",Object(n.a)({},s,r,{components:t,mdxType:"MDXLayout"}),Object(o.b)("p",null,Object(o.b)("inlineCode",{parentName:"p"},"combine()")," is a builder function that allows you to combine multiple single fixtures into a bigger fixture."),Object(o.b)("h2",{id:"signature"},"Signature"),Object(o.b)("pre",null,Object(o.b)("code",Object(n.a)({parentName:"pre"},{}),"combine() => CombinedFixtureBuilder;\n")),Object(o.b)("h3",{id:"combinedfixturebuilderand"},Object(o.b)("inlineCode",{parentName:"h3"},"CombinedFixtureBuilder.and()")),Object(o.b)("p",null,"Chains an additional fixture onto the combined fixture."),Object(o.b)("h4",{id:"signature-1"},"Signature"),Object(o.b)("pre",null,Object(o.b)("code",Object(n.a)({parentName:"pre"},{}),"and<TResult>(fixture: Fixture<TResult>) => CombinedFixtureBuilder<TFixtures & TResult>;\nand<TResult>(fixtureFn: (fixtures: TFixtures) => Fixture<TResult>) => CombinedFixtureBuilder<TFixtures & TResult>;\n")),Object(o.b)("ul",null,Object(o.b)("li",{parentName:"ul"},Object(o.b)("inlineCode",{parentName:"li"},"fixture/fixtureFn")," ",Object(o.b)("strong",{parentName:"li"},"(required)"),": A fixture, or a factory function receiving any of the previous fixture results in the chain and must return a new fixture.")),Object(o.b)("h3",{id:"combinedfixturebuildertofixture"},Object(o.b)("inlineCode",{parentName:"h3"},"CombinedFixtureBuilder.toFixture()")),Object(o.b)("p",null,"Creates the combined fixture."),Object(o.b)("h4",{id:"signature-2"},"Signature"),Object(o.b)("pre",null,Object(o.b)("code",Object(n.a)({parentName:"pre"},{}),"toFixture() => Fixture<TFixtures>;\n")),Object(o.b)("h2",{id:"example"},"Example"),Object(o.b)("pre",null,Object(o.b)("code",Object(n.a)({parentName:"pre"},{className:"language-typescript"}),'import { fixture, combine, execute } from "fluse";\nimport { User } from "./entities/User";\nimport { Post } from "./entities/Post";\n\ntype UserFixtureArgs = {\n  username: string;\n};\n\nconst userFixture = fixture({\n  async create(ctx, args: UserFixtureArgs) {\n    const user = new User({ username: args.username });\n    return user;\n  },\n});\n\ntype PostsFixtureArgs = {\n  author: User;\n};\n\nconst postsFixture = fixture({\n  async create(ctx, args: PostsFixtureArgs) {\n    return Array(10)\n      .fill(0)\n      .map((_, index) => {\n        const post = new Post({\n          title: `post ${index}`,\n          author: args.author,\n        });\n        return post;\n      });\n  },\n});\n\nconst userWithPostsFixture = combine()\n  .and(userFixture("foo", { username: "foo" }))\n  .and(({ foo }) => postFixture("fooPosts", { author: foo }))\n  .toFixture();\n')))}l.isMDXComponent=!0},122:function(e,t,r){"use strict";r.d(t,"a",(function(){return b})),r.d(t,"b",(function(){return m}));var n=r(0),i=r.n(n);function o(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function u(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function a(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?u(Object(r),!0).forEach((function(t){o(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):u(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function c(e,t){if(null==e)return{};var r,n,i=function(e,t){if(null==e)return{};var r,n,i={},o=Object.keys(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||(i[r]=e[r]);return i}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(i[r]=e[r])}return i}var s=i.a.createContext({}),l=function(e){var t=i.a.useContext(s),r=t;return e&&(r="function"==typeof e?e(t):a(a({},t),e)),r},b=function(e){var t=l(e.components);return i.a.createElement(s.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return i.a.createElement(i.a.Fragment,{},t)}},d=i.a.forwardRef((function(e,t){var r=e.components,n=e.mdxType,o=e.originalType,u=e.parentName,s=c(e,["components","mdxType","originalType","parentName"]),b=l(r),d=n,m=b["".concat(u,".").concat(d)]||b[d]||p[d]||o;return r?i.a.createElement(m,a(a({ref:t},s),{},{components:r})):i.a.createElement(m,a({ref:t},s))}));function m(e,t){var r=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var o=r.length,u=new Array(o);u[0]=d;var a={};for(var c in t)hasOwnProperty.call(t,c)&&(a[c]=t[c]);a.originalType=e,a.mdxType="string"==typeof e?e:n,u[1]=a;for(var s=2;s<o;s++)u[s]=r[s];return i.a.createElement.apply(null,u)}return i.a.createElement.apply(null,r)}d.displayName="MDXCreateElement"}}]);