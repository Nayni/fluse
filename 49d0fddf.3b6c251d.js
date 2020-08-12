/*! For license information please see 49d0fddf.3b6c251d.js.LICENSE.txt */
(window.webpackJsonp=window.webpackJsonp||[]).push([[10],{112:function(e,t,r){"use strict";r.r(t),r.d(t,"frontMatter",(function(){return i})),r.d(t,"metadata",(function(){return c})),r.d(t,"rightToc",(function(){return l})),r.d(t,"default",(function(){return f}));var n=r(2),a=r(6),o=(r(0),r(122)),s=r(130),u=r(129),i={id:"quickstart",title:"Quickstart",sidebar_label:"Quickstart"},c={id:"quickstart",title:"Quickstart",description:"1. Install Fluse",source:"@site/docs\\quickstart.mdx",permalink:"/fluse/docs/quickstart",editUrl:"https://github.com/Nayni/fluse/edit/master/website/docs/quickstart.mdx",sidebar_label:"Quickstart",sidebar:"docs",next:{title:"Introduction",permalink:"/fluse/docs/introduction"}},l=[{value:"1. Install <code>Fluse</code>",id:"1-install-fluse",children:[]},{value:"2. Define your fixtures",id:"2-define-your-fixtures",children:[]},{value:"3. Combine them together",id:"3-combine-them-together",children:[]},{value:"4. Use your fixtures",id:"4-use-your-fixtures",children:[]}],p={rightToc:l};function f(e){var t=e.components,r=Object(a.a)(e,["components"]);return Object(o.b)("wrapper",Object(n.a)({},p,r,{components:t,mdxType:"MDXLayout"}),Object(o.b)("h3",{id:"1-install-fluse"},"1. Install ",Object(o.b)("inlineCode",{parentName:"h3"},"Fluse")),Object(o.b)(s.a,{defaultValue:"yarn",values:[{label:"yarn",value:"yarn"},{label:"npm",value:"npm"}],mdxType:"Tabs"},Object(o.b)(u.a,{value:"npm",mdxType:"TabItem"},Object(o.b)("pre",null,Object(o.b)("code",Object(n.a)({parentName:"pre"},{className:"language-bash"}),"npm install fluse --save-dev\n"))),Object(o.b)(u.a,{value:"yarn",mdxType:"TabItem"},Object(o.b)("pre",null,Object(o.b)("code",Object(n.a)({parentName:"pre"},{className:"language-bash"}),"yarn add -D fluse\n")))),Object(o.b)("h3",{id:"2-define-your-fixtures"},"2. Define your fixtures"),Object(o.b)("pre",null,Object(o.b)("code",Object(n.a)({parentName:"pre"},{className:"language-typescript"}),'// src/fixtures/userFixture.ts\nimport { fixture } from "fluse";\nimport { User } from "./entities/User";\n\ntype UserFixtureArgs = {\n  username: string;\n};\n\nexport const userFixture = fixture({\n  async create(ctx, args: UserFixtureArgs) {\n    const user = new User({ username: args.username });\n    return user;\n  },\n});\n')),Object(o.b)("pre",null,Object(o.b)("code",Object(n.a)({parentName:"pre"},{className:"language-typescript"}),'// src/fixtures/postFixture.ts\nimport { fixture } from "fluse";\nimport { Post } from "./entities/Post";\n\ntype PostsFixtureArgs = {\n  author: User;\n};\n\nexport const postsFixture = fixture({\n  async create(ctx, args: PostsFixtureArgs) {\n    return Array(10).fill(0).map((_, index) => {\n      const post = new Post({\n        title: `post ${index}`,\n        author: args.author,\n      });\n      return post;\n    });\n  },\n});\n')),Object(o.b)("h3",{id:"3-combine-them-together"},"3. Combine them together"),Object(o.b)("pre",null,Object(o.b)("code",Object(n.a)({parentName:"pre"},{className:"language-typescript"}),'import { combine } from "fluse";\nimport { userFixture } from "./fixtures/userFixture";\nimport { postFixture } from "./fixtures/postFixture";\n\nconst userWithPostsFixture = combine()\n  .and(userFixture("foo", { username: "foo" }))\n  .and(({ foo }) => postFixture("fooPosts", { author: foo }))\n  .toFixture();\n')),Object(o.b)("h3",{id:"4-use-your-fixtures"},"4. Use your fixtures"),Object(o.b)("pre",null,Object(o.b)("code",Object(n.a)({parentName:"pre"},{className:"language-typescript"}),'import { createExecutor, combine } from "fluse";\nimport { userFixture } from "./fixtures/userFixture";\nimport { postFixture } from "./fixtures/postFixture";\n\nconst execute = createExecutor();\n\nconst userWithPostsFixture = combine()\n  .and(userFixture("foo", { username: "foo" }))\n  .and(({ foo }) => postFixture("fooPosts", { author: foo }))\n  .toFixture();\n\ndescribe("bar", () => {\n  it("should return the first post of a user.", async () => {\n    const { foo, fooPosts } = await execute(userWithPostsFixture);\n\n    const actual = bar(foo);\n    expect(actual.title).toBe(fooPosts[0].title);\n  });\n});\n')))}f.isMDXComponent=!0},122:function(e,t,r){"use strict";r.d(t,"a",(function(){return p})),r.d(t,"b",(function(){return m}));var n=r(0),a=r.n(n);function o(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function s(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function u(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?s(Object(r),!0).forEach((function(t){o(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):s(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function i(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},o=Object.keys(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var c=a.a.createContext({}),l=function(e){var t=a.a.useContext(c),r=t;return e&&(r="function"==typeof e?e(t):u(u({},t),e)),r},p=function(e){var t=l(e.components);return a.a.createElement(c.Provider,{value:t},e.children)},f={inlineCode:"code",wrapper:function(e){var t=e.children;return a.a.createElement(a.a.Fragment,{},t)}},b=a.a.forwardRef((function(e,t){var r=e.components,n=e.mdxType,o=e.originalType,s=e.parentName,c=i(e,["components","mdxType","originalType","parentName"]),p=l(r),b=n,m=p["".concat(s,".").concat(b)]||p[b]||f[b]||o;return r?a.a.createElement(m,u(u({ref:t},c),{},{components:r})):a.a.createElement(m,u({ref:t},c))}));function m(e,t){var r=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var o=r.length,s=new Array(o);s[0]=b;var u={};for(var i in t)hasOwnProperty.call(t,i)&&(u[i]=t[i]);u.originalType=e,u.mdxType="string"==typeof e?e:n,s[1]=u;for(var c=2;c<o;c++)s[c]=r[c];return a.a.createElement.apply(null,s)}return a.a.createElement.apply(null,r)}b.displayName="MDXCreateElement"},124:function(e,t,r){var n;!function(){"use strict";var r={}.hasOwnProperty;function a(){for(var e=[],t=0;t<arguments.length;t++){var n=arguments[t];if(n){var o=typeof n;if("string"===o||"number"===o)e.push(n);else if(Array.isArray(n)&&n.length){var s=a.apply(null,n);s&&e.push(s)}else if("object"===o)for(var u in n)r.call(n,u)&&n[u]&&e.push(u)}}return e.join(" ")}e.exports?(a.default=a,e.exports=a):void 0===(n=function(){return a}.apply(t,[]))||(e.exports=n)}()},126:function(e,t,r){"use strict";var n=r(0);const a=Object(n.createContext)({tabGroupChoices:{},setTabGroupChoices:()=>{}});t.a=a},129:function(e,t,r){"use strict";var n=r(0),a=r.n(n);t.a=function(e){return a.a.createElement("div",null,e.children)}},130:function(e,t,r){"use strict";var n=r(0),a=r.n(n),o=r(126);var s=function(){return Object(n.useContext)(o.a)},u=r(124),i=r.n(u),c=r(92),l=r.n(c);const p=37,f=39;t.a=function(e){const{block:t,children:r,defaultValue:o,values:u,groupId:c}=e,{tabGroupChoices:b,setTabGroupChoices:m}=s(),[d,x]=Object(n.useState)(o);if(null!=c){const e=b[c];null!=e&&e!==d&&x(e)}const y=e=>{x(e),null!=c&&m(c,e)},O=[];return a.a.createElement("div",null,a.a.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:i()("tabs",{"tabs--block":t})},u.map(({value:e,label:t})=>a.a.createElement("li",{role:"tab",tabIndex:"0","aria-selected":d===e,className:i()("tabs__item",l.a.tabItem,{"tabs__item--active":d===e}),key:e,ref:e=>O.push(e),onKeyDown:e=>((e,t,r)=>{switch(r.keyCode){case f:((e,t)=>{const r=e.indexOf(t)+1;e[r]?e[r].focus():e[0].focus()})(e,t);break;case p:((e,t)=>{const r=e.indexOf(t)-1;e[r]?e[r].focus():e[e.length-1].focus()})(e,t)}})(O,e.target,e),onFocus:()=>y(e),onClick:()=>y(e)},t))),a.a.createElement("div",{role:"tabpanel",className:"margin-vert--md"},n.Children.toArray(r).filter(e=>e.props.value===d)[0]))}}}]);