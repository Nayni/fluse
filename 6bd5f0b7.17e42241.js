/*! For license information please see 6bd5f0b7.17e42241.js.LICENSE.txt */
(window.webpackJsonp=window.webpackJsonp||[]).push([[11],{113:function(e,t,n){"use strict";n.r(t),n.d(t,"frontMatter",(function(){return l})),n.d(t,"metadata",(function(){return u})),n.d(t,"rightToc",(function(){return p})),n.d(t,"default",(function(){return b}));var r=n(2),a=n(6),o=(n(0),n(122)),i=n(130),c=n(129),l={id:"plugin-typeorm",title:"plugin-typeorm",sidebar_label:"plugin-typeorm"},u={id:"plugin-typeorm",title:"plugin-typeorm",description:"A plugin to allow Fluse fixtures to interact with a TypeORM connection.",source:"@site/docs\\plugin-typeorm.md",permalink:"/fluse/docs/plugin-typeorm",editUrl:"https://github.com/Nayni/fluse/edit/master/website/docs/plugin-typeorm.md",sidebar_label:"plugin-typeorm",sidebar:"docs",previous:{title:"createExecutor()",permalink:"/fluse/docs/api-execute"},next:{title:"plugin-faker",permalink:"/fluse/docs/plugin-faker"}},p=[{value:"Install",id:"install",children:[]},{value:"Example",id:"example",children:[]},{value:"API Reference",id:"api-reference",children:[{value:"Signature",id:"signature",children:[]}]}],s={rightToc:p};function b(e){var t=e.components,n=Object(a.a)(e,["components"]);return Object(o.b)("wrapper",Object(r.a)({},s,n,{components:t,mdxType:"MDXLayout"}),Object(o.b)("p",null,"A plugin to allow Fluse fixtures to interact with a TypeORM connection."),Object(o.b)("h2",{id:"install"},"Install"),Object(o.b)(i.a,{defaultValue:"yarn",values:[{label:"yarn",value:"yarn"},{label:"npm",value:"npm"}],mdxType:"Tabs"},Object(o.b)(c.a,{value:"npm",mdxType:"TabItem"},Object(o.b)("pre",null,Object(o.b)("code",Object(r.a)({parentName:"pre"},{className:"language-bash"}),"npm install fluse-plugin-typeorm typeorm --save-dev\n"))),Object(o.b)(c.a,{value:"yarn",mdxType:"TabItem"},Object(o.b)("pre",null,Object(o.b)("code",Object(r.a)({parentName:"pre"},{className:"language-bash"}),"yarn add -D fluse-plugin-typeorm typeorm\n")))),Object(o.b)("div",{className:"admonition admonition-tip alert alert--success"},Object(o.b)("div",Object(r.a)({parentName:"div"},{className:"admonition-heading"}),Object(o.b)("h5",{parentName:"div"},Object(o.b)("span",Object(r.a)({parentName:"h5"},{className:"admonition-icon"}),Object(o.b)("svg",Object(r.a)({parentName:"span"},{xmlns:"http://www.w3.org/2000/svg",width:"12",height:"16",viewBox:"0 0 12 16"}),Object(o.b)("path",Object(r.a)({parentName:"svg"},{fillRule:"evenodd",d:"M6.5 0C3.48 0 1 2.19 1 5c0 .92.55 2.25 1 3 1.34 2.25 1.78 2.78 2 4v1h5v-1c.22-1.22.66-1.75 2-4 .45-.75 1-2.08 1-3 0-2.81-2.48-5-5.5-5zm3.64 7.48c-.25.44-.47.8-.67 1.11-.86 1.41-1.25 2.06-1.45 3.23-.02.05-.02.11-.02.17H5c0-.06 0-.13-.02-.17-.2-1.17-.59-1.83-1.45-3.23-.2-.31-.42-.67-.67-1.11C2.44 6.78 2 5.65 2 5c0-2.2 2.02-4 4.5-4 1.22 0 2.36.42 3.22 1.19C10.55 2.94 11 3.94 11 5c0 .66-.44 1.78-.86 2.48zM4 14h5c-.23 1.14-1.3 2-2.5 2s-2.27-.86-2.5-2z"})))),"tip")),Object(o.b)("div",Object(r.a)({parentName:"div"},{className:"admonition-content"}),Object(o.b)("p",{parentName:"div"},"This plugin requires ",Object(o.b)("inlineCode",{parentName:"p"},"typeorm")," to be installed as well."))),Object(o.b)("h2",{id:"example"},"Example"),Object(o.b)("pre",null,Object(o.b)("code",Object(r.a)({parentName:"pre"},{className:"language-typescript"}),'import { createExecutor, fixture } from "fluse";\nimport typeormPlugin from "fluse-plugin-typeorm";\n\nconst execute = createExecutor({\n  plugins: [typeormPlugin({ connection: "default", transaction: true })],\n});\n\nconst fooFixture = fixture({\n  async create(ctx) {\n    const foo = new Foo();\n    return ctx.typeorm.entityManager.save(foo);\n  },\n});\n\nconst result = await execute(fooFixture("foo"));\n')),Object(o.b)("h2",{id:"api-reference"},"API Reference"),Object(o.b)("p",null,"The ",Object(o.b)("inlineCode",{parentName:"p"},"typeorm")," key will become available on the ",Object(o.b)("a",Object(r.a)({parentName:"p"},{href:"/fluse/docs/context"}),"context")," as you use this plugin."),Object(o.b)("h3",{id:"signature"},"Signature"),Object(o.b)("pre",null,Object(o.b)("code",Object(r.a)({parentName:"pre"},{}),"typeormPlugin(config?: {\n  connection?: Connection | string;\n  transaction?: boolean;\n  synchronize?: boolean;\n  dropBeforeSync?: boolean;\n}) => Plugin\n")),Object(o.b)("ul",null,Object(o.b)("li",{parentName:"ul"},Object(o.b)("inlineCode",{parentName:"li"},"connection")," ",Object(o.b)("strong",{parentName:"li"},"(optional)"),": The name of the connection, or an instance of a TypeORM connection."),Object(o.b)("li",{parentName:"ul"},Object(o.b)("inlineCode",{parentName:"li"},"transaction")," ",Object(o.b)("strong",{parentName:"li"},"(optional)"),": Run the fixture (or combined fixtures) in a single transaction, rolling back if something fails."),Object(o.b)("li",{parentName:"ul"},Object(o.b)("inlineCode",{parentName:"li"},"synchronize")," ",Object(o.b)("strong",{parentName:"li"},"(optional)"),": Synchronize the database before running the fixture."),Object(o.b)("li",{parentName:"ul"},Object(o.b)("inlineCode",{parentName:"li"},"dropBeforeSync")," ",Object(o.b)("strong",{parentName:"li"},"(optional)"),": Drop the database entirely before sychronizing.")))}b.isMDXComponent=!0},122:function(e,t,n){"use strict";n.d(t,"a",(function(){return s})),n.d(t,"b",(function(){return f}));var r=n(0),a=n.n(r);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function c(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var u=a.a.createContext({}),p=function(e){var t=a.a.useContext(u),n=t;return e&&(n="function"==typeof e?e(t):c(c({},t),e)),n},s=function(e){var t=p(e.components);return a.a.createElement(u.Provider,{value:t},e.children)},b={inlineCode:"code",wrapper:function(e){var t=e.children;return a.a.createElement(a.a.Fragment,{},t)}},m=a.a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,o=e.originalType,i=e.parentName,u=l(e,["components","mdxType","originalType","parentName"]),s=p(n),m=r,f=s["".concat(i,".").concat(m)]||s[m]||b[m]||o;return n?a.a.createElement(f,c(c({ref:t},u),{},{components:n})):a.a.createElement(f,c({ref:t},u))}));function f(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var o=n.length,i=new Array(o);i[0]=m;var c={};for(var l in t)hasOwnProperty.call(t,l)&&(c[l]=t[l]);c.originalType=e,c.mdxType="string"==typeof e?e:r,i[1]=c;for(var u=2;u<o;u++)i[u]=n[u];return a.a.createElement.apply(null,i)}return a.a.createElement.apply(null,n)}m.displayName="MDXCreateElement"},124:function(e,t,n){var r;!function(){"use strict";var n={}.hasOwnProperty;function a(){for(var e=[],t=0;t<arguments.length;t++){var r=arguments[t];if(r){var o=typeof r;if("string"===o||"number"===o)e.push(r);else if(Array.isArray(r)&&r.length){var i=a.apply(null,r);i&&e.push(i)}else if("object"===o)for(var c in r)n.call(r,c)&&r[c]&&e.push(c)}}return e.join(" ")}e.exports?(a.default=a,e.exports=a):void 0===(r=function(){return a}.apply(t,[]))||(e.exports=r)}()},126:function(e,t,n){"use strict";var r=n(0);const a=Object(r.createContext)({tabGroupChoices:{},setTabGroupChoices:()=>{}});t.a=a},129:function(e,t,n){"use strict";var r=n(0),a=n.n(r);t.a=function(e){return a.a.createElement("div",null,e.children)}},130:function(e,t,n){"use strict";var r=n(0),a=n.n(r),o=n(126);var i=function(){return Object(r.useContext)(o.a)},c=n(124),l=n.n(c),u=n(92),p=n.n(u);const s=37,b=39;t.a=function(e){const{block:t,children:n,defaultValue:o,values:c,groupId:u}=e,{tabGroupChoices:m,setTabGroupChoices:f}=i(),[d,y]=Object(r.useState)(o);if(null!=u){const e=m[u];null!=e&&e!==d&&y(e)}const O=e=>{y(e),null!=u&&f(u,e)},g=[];return a.a.createElement("div",null,a.a.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:l()("tabs",{"tabs--block":t})},c.map(({value:e,label:t})=>a.a.createElement("li",{role:"tab",tabIndex:"0","aria-selected":d===e,className:l()("tabs__item",p.a.tabItem,{"tabs__item--active":d===e}),key:e,ref:e=>g.push(e),onKeyDown:e=>((e,t,n)=>{switch(n.keyCode){case b:((e,t)=>{const n=e.indexOf(t)+1;e[n]?e[n].focus():e[0].focus()})(e,t);break;case s:((e,t)=>{const n=e.indexOf(t)-1;e[n]?e[n].focus():e[e.length-1].focus()})(e,t)}})(g,e.target,e),onFocus:()=>O(e),onClick:()=>O(e)},t))),a.a.createElement("div",{role:"tabpanel",className:"margin-vert--md"},r.Children.toArray(n).filter(e=>e.props.value===d)[0]))}}}]);