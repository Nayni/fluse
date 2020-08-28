(window.webpackJsonp=window.webpackJsonp||[]).push([[14],{71:function(e,t,r){"use strict";r.r(t),r.d(t,"frontMatter",(function(){return o})),r.d(t,"metadata",(function(){return c})),r.d(t,"rightToc",(function(){return u})),r.d(t,"default",(function(){return p}));var n=r(2),a=r(6),i=(r(0),r(79)),o={id:"api-execute",title:"createExecutor()",sidebar_label:"createExecutor()"},c={unversionedId:"api-execute",id:"api-execute",isDocsHomePage:!1,title:"createExecutor()",description:"createExecutor() creates an executor which allows you to run any particular fixture, this can be a single fixture or a combined fixture.",source:"@site/docs\\api-execute.md",slug:"/api-execute",permalink:"/fluse/docs/api-execute",editUrl:"https://github.com/Nayni/fluse/edit/master/website/docs/api-execute.md",version:"current",sidebar_label:"createExecutor()",sidebar:"docs",previous:{title:"combine()",permalink:"/fluse/docs/api-combine"},next:{title:"plugin-faker",permalink:"/fluse/docs/plugin-faker"}},u=[{value:"Signature",id:"signature",children:[]},{value:"Example",id:"example",children:[]}],l={rightToc:u};function p(e){var t=e.components,r=Object(a.a)(e,["components"]);return Object(i.b)("wrapper",Object(n.a)({},l,r,{components:t,mdxType:"MDXLayout"}),Object(i.b)("p",null,Object(i.b)("inlineCode",{parentName:"p"},"createExecutor()")," creates an executor which allows you to run any particular fixture, this can be a single fixture or a combined fixture."),Object(i.b)("h2",{id:"signature"},"Signature"),Object(i.b)("pre",null,Object(i.b)("code",Object(n.a)({parentName:"pre"},{}),"createExecutor(options?: {\n  plugins?: Plugin[]\n}) => (fixture: Fixture<TResult>) => Promise<TResult>\n")),Object(i.b)("ul",null,Object(i.b)("li",{parentName:"ul"},Object(i.b)("inlineCode",{parentName:"li"},"options")," ",Object(i.b)("strong",{parentName:"li"},"(optional)"),": Additional options including:",Object(i.b)("ul",{parentName:"li"},Object(i.b)("li",{parentName:"ul"},Object(i.b)("inlineCode",{parentName:"li"},"plugins")," ",Object(i.b)("strong",{parentName:"li"},"(optional)"),": A set of plugins to use while executing."))),Object(i.b)("li",{parentName:"ul"},Object(i.b)("inlineCode",{parentName:"li"},"fixture")," ",Object(i.b)("strong",{parentName:"li"},"(required)"),": The fixture to execute, created by either ",Object(i.b)("a",Object(n.a)({parentName:"li"},{href:"/fluse/docs/api-fixture"}),"fixture()")," or by ",Object(i.b)("a",Object(n.a)({parentName:"li"},{href:"/fluse/docs/api-combine"}),"combine()"),".")),Object(i.b)("h2",{id:"example"},"Example"),Object(i.b)("pre",null,Object(i.b)("code",Object(n.a)({parentName:"pre"},{className:"language-typescript"}),'import { createExecutor, fixture } from "fluse";\n\nconst execute = createExecutor({\n  plugins: [\n    /* pass plugins */\n  ],\n});\n\nconst fooFixture = fixture({\n  create() {\n    return new Foo();\n  },\n});\n\nconst { foo } = await execute(fooFixture("foo"));\nconst { manyFoos } = await execute(fooFixture({ name: "manyFoos", list: 10 }));\n')))}p.isMDXComponent=!0},79:function(e,t,r){"use strict";r.d(t,"a",(function(){return s})),r.d(t,"b",(function(){return m}));var n=r(0),a=r.n(n);function i(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function o(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function c(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?o(Object(r),!0).forEach((function(t){i(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):o(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function u(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},i=Object.keys(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var l=a.a.createContext({}),p=function(e){var t=a.a.useContext(l),r=t;return e&&(r="function"==typeof e?e(t):c(c({},t),e)),r},s=function(e){var t=p(e.components);return a.a.createElement(l.Provider,{value:t},e.children)},b={inlineCode:"code",wrapper:function(e){var t=e.children;return a.a.createElement(a.a.Fragment,{},t)}},f=a.a.forwardRef((function(e,t){var r=e.components,n=e.mdxType,i=e.originalType,o=e.parentName,l=u(e,["components","mdxType","originalType","parentName"]),s=p(r),f=n,m=s["".concat(o,".").concat(f)]||s[f]||b[f]||i;return r?a.a.createElement(m,c(c({ref:t},l),{},{components:r})):a.a.createElement(m,c({ref:t},l))}));function m(e,t){var r=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var i=r.length,o=new Array(i);o[0]=f;var c={};for(var u in t)hasOwnProperty.call(t,u)&&(c[u]=t[u]);c.originalType=e,c.mdxType="string"==typeof e?e:n,o[1]=c;for(var l=2;l<i;l++)o[l]=r[l];return a.a.createElement.apply(null,o)}return a.a.createElement.apply(null,r)}f.displayName="MDXCreateElement"}}]);