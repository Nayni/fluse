(window.webpackJsonp=window.webpackJsonp||[]).push([[3],{100:function(e,t,n){"use strict";n.r(t),n.d(t,"frontMatter",(function(){return a})),n.d(t,"metadata",(function(){return c})),n.d(t,"rightToc",(function(){return u})),n.d(t,"default",(function(){return s}));var r=n(2),o=n(6),i=(n(0),n(122)),a={id:"context",title:"Accessing context",sidebar_label:"Accessing context"},c={id:"context",title:"Accessing context",description:"Every fixture you create with Fluse has the ability to access a context object. This context object is used by plugins to provide you with additional functionalities such as:",source:"@site/docs\\context.md",permalink:"/fluse/docs/context",editUrl:"https://github.com/Nayni/fluse/edit/master/website/docs/context.md",sidebar_label:"Accessing context",sidebar:"docs",previous:{title:"Combining fixtures",permalink:"/fluse/docs/combining-fixtures"},next:{title:"fixture()",permalink:"/fluse/docs/api-fixture"}},u=[],l={rightToc:u};function s(e){var t=e.components,n=Object(o.a)(e,["components"]);return Object(i.b)("wrapper",Object(r.a)({},l,n,{components:t,mdxType:"MDXLayout"}),Object(i.b)("p",null,"Every fixture you create with Fluse has the ability to access a context object. This context object is used by ",Object(i.b)("inlineCode",{parentName:"p"},"plugins")," to provide you with additional functionalities such as:"),Object(i.b)("ul",null,Object(i.b)("li",{parentName:"ul"},"stateful connections like a database connection"),Object(i.b)("li",{parentName:"ul"},"utility functions to help in generating random data")),Object(i.b)("p",null,"Context is Fluse's way of allowing you to plug into the lifecycle of a fixture and access any resources that might need to live outside of your fixture scope such as database connections. It will always be the first argument of a fixture."),Object(i.b)("pre",null,Object(i.b)("code",Object(r.a)({parentName:"pre"},{className:"language-typescript"}),'import { fixture, execute } from "fluse";\nimport fakerPlugin from "fluse-plugin-faker";\n\nconst fooFixture = fixture({\n  async create(context) {\n    return new Foo(context.faker.lorem.words(5));\n  },\n});\n\nconst { foo } = await execute(fooFixture("foo"), { plugins: fakerPlugin() });\n')),Object(i.b)("p",null,"Have a look at some of our official plugins:"),Object(i.b)("ul",null,Object(i.b)("li",{parentName:"ul"},Object(i.b)("a",Object(r.a)({parentName:"li"},{href:"/fluse/docs/plugin-typeorm"}),"plugin-typeorm")),Object(i.b)("li",{parentName:"ul"},Object(i.b)("a",Object(r.a)({parentName:"li"},{href:"/fluse/docs/plugin-faker"}),"plugin-faker"))))}s.isMDXComponent=!0},122:function(e,t,n){"use strict";n.d(t,"a",(function(){return p})),n.d(t,"b",(function(){return d}));var r=n(0),o=n.n(r);function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function c(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){i(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function u(e,t){if(null==e)return{};var n,r,o=function(e,t){if(null==e)return{};var n,r,o={},i=Object.keys(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var l=o.a.createContext({}),s=function(e){var t=o.a.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):c(c({},t),e)),n},p=function(e){var t=s(e.components);return o.a.createElement(l.Provider,{value:t},e.children)},f={inlineCode:"code",wrapper:function(e){var t=e.children;return o.a.createElement(o.a.Fragment,{},t)}},b=o.a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,i=e.originalType,a=e.parentName,l=u(e,["components","mdxType","originalType","parentName"]),p=s(n),b=r,d=p["".concat(a,".").concat(b)]||p[b]||f[b]||i;return n?o.a.createElement(d,c(c({ref:t},l),{},{components:n})):o.a.createElement(d,c({ref:t},l))}));function d(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var i=n.length,a=new Array(i);a[0]=b;var c={};for(var u in t)hasOwnProperty.call(t,u)&&(c[u]=t[u]);c.originalType=e,c.mdxType="string"==typeof e?e:r,a[1]=c;for(var l=2;l<i;l++)a[l]=n[l];return o.a.createElement.apply(null,a)}return o.a.createElement.apply(null,n)}b.displayName="MDXCreateElement"}}]);