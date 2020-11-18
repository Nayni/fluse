(window.webpackJsonp=window.webpackJsonp||[]).push([[11],{68:function(e,t,n){"use strict";n.r(t),n.d(t,"frontMatter",(function(){return c})),n.d(t,"metadata",(function(){return u})),n.d(t,"rightToc",(function(){return l})),n.d(t,"default",(function(){return f}));var r=n(2),a=n(6),o=(n(0),n(83)),s=n(90),i=n(91),c={id:"quickstart",title:"Quickstart",sidebar_label:"Quickstart"},u={unversionedId:"quickstart",id:"quickstart",isDocsHomePage:!1,title:"Quickstart",description:"1. Install Fluse",source:"@site/docs\\quickstart.mdx",slug:"/quickstart",permalink:"/fluse/docs/quickstart",editUrl:"https://github.com/Nayni/fluse/edit/master/website/docs/quickstart.mdx",version:"current",sidebar_label:"Quickstart",sidebar:"docs",next:{title:"Introduction",permalink:"/fluse/docs/"}},l=[{value:"1. Install <code>Fluse</code>",id:"1-install-fluse",children:[]},{value:"2. Initialize",id:"2-initialize",children:[]},{value:"3. Define some data fixtures for your domain",id:"3-define-some-data-fixtures-for-your-domain",children:[]},{value:"3. Supercharge your tests!",id:"3-supercharge-your-tests",children:[]}],m={rightToc:l};function f(e){var t=e.components,n=Object(a.a)(e,["components"]);return Object(o.b)("wrapper",Object(r.a)({},m,n,{components:t,mdxType:"MDXLayout"}),Object(o.b)("h3",{id:"1-install-fluse"},"1. Install ",Object(o.b)("inlineCode",{parentName:"h3"},"Fluse")),Object(o.b)(s.a,{defaultValue:"yarn",values:[{label:"yarn",value:"yarn"},{label:"npm",value:"npm"}],mdxType:"Tabs"},Object(o.b)(i.a,{value:"npm",mdxType:"TabItem"},Object(o.b)("pre",null,Object(o.b)("code",Object(r.a)({parentName:"pre"},{className:"language-bash"}),"npm install fluse --save-dev\n"))),Object(o.b)(i.a,{value:"yarn",mdxType:"TabItem"},Object(o.b)("pre",null,Object(o.b)("code",Object(r.a)({parentName:"pre"},{className:"language-bash"}),"yarn add -D fluse\n")))),Object(o.b)("h3",{id:"2-initialize"},"2. Initialize"),Object(o.b)("pre",null,Object(o.b)("code",Object(r.a)({parentName:"pre"},{className:"language-typescript"}),'import { fluse } from "fluse";\nimport fakerPlugin from "fluse-plugin-faker";\n\nexport const { fixture, combine, execute } = fluse({\n  plugins: {\n    faker: fakerPlugin(),\n  },\n});\n')),Object(o.b)("h3",{id:"3-define-some-data-fixtures-for-your-domain"},"3. Define some data fixtures for your domain"),Object(o.b)("pre",null,Object(o.b)("code",Object(r.a)({parentName:"pre"},{className:"language-typescript"}),'import { Comment } from "./model/Comment";\nimport { Post } from "./model/Post";\nimport { User } from "./model/User";\n\nexport const userFixture = fixture<User>({\n  create({ faker }) {\n    return new User({\n      userName: faker.internet.userName(),\n    });\n  },\n});\n\ninterface CommentArgs {\n  author: User;\n}\n\nexport const commentFixture = fixture<Comment, CommentArgs>({\n  create({ faker }, args) {\n    return new Comment({\n      message: faker.lorem.slug(),\n      author: args.author,\n    });\n  },\n});\n\ninterface PostArgs {\n  author: User;\n  comments?: Comment[];\n}\n\nexport const postFixture = fixture<Post, PostArgs>({\n  create({ faker }, args) {\n    return new Post({\n      title: faker.lorem.slug(),\n      body: faker.lorem.paragraphs(4),\n      author: args.author,\n      comments: args.comments,\n    });\n  },\n});\n')),Object(o.b)("h3",{id:"3-supercharge-your-tests"},"3. Supercharge your tests!"),Object(o.b)("pre",null,Object(o.b)("code",Object(r.a)({parentName:"pre"},{className:"language-typescript"}),'it("should create a single post", async () => {\n  const { singlePost } = await execute(\n    postFixture("singlePost", {\n      args: {\n        author: userFixture.asArg(),\n      },\n    })\n  );\n\n  expect(singlePost).toBeDefined();\n});\n\nit("should create many posts", async () => {\n  const { manyPosts } = await execute(\n    postFixture("manyPosts", {\n      list: 3,\n      args: {\n        author: userFixture.asArg(),\n        comments: commentFixture.asArg({\n          list: 3,\n          args: { author: userFixture.asArg() },\n        }),\n      },\n    })\n  );\n\n  expect(manyPosts).toBeDefined();\n});\n\nit("should create a complex scenario", async () => {\n  const postsFromBobAndAlice = combine()\n    .and(userFixture("bob"))\n    .and(userFixture("alice"))\n    .and(({ bob }) =>\n      postFixture("bobsPosts", {\n        list: 5,\n        args: {\n          author: bob,\n          comments: commentFixture.asArg({\n            list: 3,\n            args: {\n              author: userFixture.asArg(),\n            },\n          }),\n        },\n      })\n    )\n    .and(({ alice }) =>\n      postFixture("alicesPosts", {\n        list: 5,\n        args: {\n          author: alice,\n          comments: commentFixture.asArg({\n            list: 3,\n            args: {\n              author: userFixture.asArg(),\n            },\n          }),\n        },\n      })\n    )\n    .toFixture();\n\n  const { bob, bobsPosts, alice, alicesPosts } = await execute(\n    postsFromBobAndAlice\n  );\n\n  expect(bob).toBeDefined();\n  expect(alice).toBeDefined();\n});\n')))}f.isMDXComponent=!0},83:function(e,t,n){"use strict";n.d(t,"a",(function(){return m})),n.d(t,"b",(function(){return b}));var r=n(0),a=n.n(r);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function s(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?s(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):s(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function c(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var u=a.a.createContext({}),l=function(e){var t=a.a.useContext(u),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},m=function(e){var t=l(e.components);return a.a.createElement(u.Provider,{value:t},e.children)},f={inlineCode:"code",wrapper:function(e){var t=e.children;return a.a.createElement(a.a.Fragment,{},t)}},p=a.a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,o=e.originalType,s=e.parentName,u=c(e,["components","mdxType","originalType","parentName"]),m=l(n),p=r,b=m["".concat(s,".").concat(p)]||m[p]||f[p]||o;return n?a.a.createElement(b,i(i({ref:t},u),{},{components:n})):a.a.createElement(b,i({ref:t},u))}));function b(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var o=n.length,s=new Array(o);s[0]=p;var i={};for(var c in t)hasOwnProperty.call(t,c)&&(i[c]=t[c]);i.originalType=e,i.mdxType="string"==typeof e?e:r,s[1]=i;for(var u=2;u<o;u++)s[u]=n[u];return a.a.createElement.apply(null,s)}return a.a.createElement.apply(null,n)}p.displayName="MDXCreateElement"},85:function(e,t,n){"use strict";function r(e){var t,n,a="";if("string"==typeof e||"number"==typeof e)a+=e;else if("object"==typeof e)if(Array.isArray(e))for(t=0;t<e.length;t++)e[t]&&(n=r(e[t]))&&(a&&(a+=" "),a+=n);else for(t in e)e[t]&&(a&&(a+=" "),a+=t);return a}t.a=function(){for(var e,t,n=0,a="";n<arguments.length;)(e=arguments[n++])&&(t=r(e))&&(a&&(a+=" "),a+=t);return a}},86:function(e,t,n){"use strict";var r=n(0);const a=Object(r.createContext)(void 0);t.a=a},87:function(e,t,n){"use strict";var r=n(0),a=n(86);t.a=function(){const e=Object(r.useContext)(a.a);if(null==e)throw new Error("`useUserPreferencesContext` is used outside of `Layout` Component.");return e}},90:function(e,t,n){"use strict";var r=n(0),a=n.n(r),o=n(87),s=n(85),i=n(47),c=n.n(i);const u=37,l=39;t.a=function(e){const{block:t,children:n,defaultValue:i,values:m,groupId:f}=e,{tabGroupChoices:p,setTabGroupChoices:b}=Object(o.a)(),[d,g]=Object(r.useState)(i),[y,O]=Object(r.useState)(!1);if(null!=f){const e=p[f];null!=e&&e!==d&&m.some(t=>t.value===e)&&g(e)}const x=e=>{g(e),null!=f&&b(f,e)},h=[],v=e=>{e.metaKey||e.altKey||e.ctrlKey||O(!0)},j=()=>{O(!1)};return Object(r.useEffect)(()=>{window.addEventListener("keydown",v),window.addEventListener("mousedown",j)},[]),a.a.createElement("div",null,a.a.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:Object(s.a)("tabs",{"tabs--block":t})},m.map(({value:e,label:t})=>a.a.createElement("li",{role:"tab",tabIndex:0,"aria-selected":d===e,className:Object(s.a)("tabs__item",c.a.tabItem,{"tabs__item--active":d===e}),style:y?{}:{outline:"none"},key:e,ref:e=>h.push(e),onKeyDown:e=>{((e,t,n)=>{switch(n.keyCode){case l:((e,t)=>{const n=e.indexOf(t)+1;e[n]?e[n].focus():e[0].focus()})(e,t);break;case u:((e,t)=>{const n=e.indexOf(t)-1;e[n]?e[n].focus():e[e.length-1].focus()})(e,t)}})(h,e.target,e),v(e)},onFocus:()=>x(e),onClick:()=>{x(e),O(!1)},onPointerDown:()=>O(!1)},t))),a.a.createElement("div",{role:"tabpanel",className:"margin-vert--md"},r.Children.toArray(n).filter(e=>e.props.value===d)[0]))}},91:function(e,t,n){"use strict";var r=n(0),a=n.n(r);t.a=function(e){return a.a.createElement("div",null,e.children)}}}]);