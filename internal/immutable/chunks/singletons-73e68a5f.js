import{A as f,s as g}from"./index-161070e3.js";const l=[];function b(t,n=f){let e;const o=new Set;function s(r){if(g(t,r)&&(t=r,e)){const c=!l.length;for(const a of o)a[1](),l.push(a,t);if(c){for(let a=0;a<l.length;a+=2)l[a][0](l[a+1]);l.length=0}}}function u(r){s(r(t))}function i(r,c=f){const a=[r,c];return o.add(a),o.size===1&&(e=n(s)||f),r(t),()=>{o.delete(a),o.size===0&&(e(),e=null)}}return{set:s,update:u,subscribe:i}}let d="",p="";function k(t){d=t.base,p=t.assets||d}function A(t){let n=t.baseURI;if(!n){const e=t.getElementsByTagName("base");n=e.length?e[0].href:t.URL}return n}function U(){return{x:pageXOffset,y:pageYOffset}}function w(t){let n;const e={noscroll:null,prefetch:null,reload:null};for(const s of t.composedPath())s instanceof Element&&(!n&&s.nodeName.toUpperCase()==="A"&&(n=s),e.noscroll===null&&(e.noscroll=s.getAttribute("data-sveltekit-noscroll")),e.prefetch===null&&(e.prefetch=s.getAttribute("data-sveltekit-prefetch")),e.reload===null&&(e.reload=s.getAttribute("data-sveltekit-reload")));const o=n&&new URL(n instanceof SVGAElement?n.href.baseVal:n.href,document.baseURI);return{a:n,url:o,options:e}}function h(t){const n=b(t);let e=!0;function o(){e=!0,n.update(i=>i)}function s(i){e=!1,n.set(i)}function u(i){let r;return n.subscribe(c=>{(r===void 0||e&&c!==r)&&i(r=c)})}return{notify:o,set:s,subscribe:u}}function m(){const{set:t,subscribe:n}=b(!1);let e;async function o(){clearTimeout(e);const s=await fetch(`${p}/internal/version.json`,{headers:{pragma:"no-cache","cache-control":"no-cache"}});if(s.ok){const{version:u}=await s.json(),i=u!=="1662184608905";return i&&(t(!0),clearTimeout(e)),i}else throw new Error(`Version check failed: ${s.status}`)}return{subscribe:n,check:o}}function y(t){t.client}const R={url:h({}),page:h({}),navigating:b(null),updated:m()};export{U as a,k as b,w as f,A as g,y as i,R as s};