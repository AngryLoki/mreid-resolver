function b(){}function U(t,e){for(const n in e)t[n]=e[n];return t}function W(t){return!!t&&(typeof t=="object"||typeof t=="function")&&typeof t.then=="function"}function L(t){return t()}function M(){return Object.create(null)}function x(t){t.forEach(L)}function j(t){return typeof t=="function"}function dt(t,e){return t!=t?e==e:t!==e||t&&typeof t=="object"||typeof t=="function"}let $;function ht(t,e){return $||($=document.createElement("a")),$.href=e,t===$.href}function G(t){return Object.keys(t).length===0}function I(t,...e){if(t==null)return b;const n=t.subscribe(...e);return n.unsubscribe?()=>n.unsubscribe():n}function mt(t,e,n){t.$$.on_destroy.push(I(e,n))}function pt(t,e,n,r){if(t){const c=q(t,e,n,r);return t[0](c)}}function q(t,e,n,r){return t[1]&&r?U(n.ctx.slice(),t[1](r(e))):n.ctx}function yt(t,e,n,r){if(t[2]&&r){const c=t[2](r(n));if(e.dirty===void 0)return c;if(typeof c=="object"){const u=[],s=Math.max(e.dirty.length,c.length);for(let o=0;o<s;o+=1)u[o]=e.dirty[o]|c[o];return u}return e.dirty|c}return e.dirty}function bt(t,e,n,r,c,u){if(c){const s=q(e,n,r,u);t.p(s,c)}}function gt(t){if(t.ctx.length>32){const e=[],n=t.ctx.length/32;for(let r=0;r<n;r++)e[r]=-1;return e}return-1}function xt(t){const e={};for(const n in t)e[n]=!0;return e}function $t(t){return t&&j(t.destroy)?t.destroy:b}let w=!1;function J(){w=!0}function K(){w=!1}function Q(t,e,n,r){for(;t<e;){const c=t+(e-t>>1);n(c)<=r?t=c+1:e=c}return t}function V(t){if(t.hydrate_init)return;t.hydrate_init=!0;let e=t.childNodes;if(t.nodeName==="HEAD"){const i=[];for(let l=0;l<e.length;l++){const f=e[l];f.claim_order!==void 0&&i.push(f)}e=i}const n=new Int32Array(e.length+1),r=new Int32Array(e.length);n[0]=-1;let c=0;for(let i=0;i<e.length;i++){const l=e[i].claim_order,f=(c>0&&e[n[c]].claim_order<=l?c+1:Q(1,c,d=>e[n[d]].claim_order,l))-1;r[i]=n[f]+1;const a=f+1;n[a]=i,c=Math.max(a,c)}const u=[],s=[];let o=e.length-1;for(let i=n[c]+1;i!=0;i=r[i-1]){for(u.push(e[i-1]);o>=i;o--)s.push(e[o]);o--}for(;o>=0;o--)s.push(e[o]);u.reverse(),s.sort((i,l)=>i.claim_order-l.claim_order);for(let i=0,l=0;i<s.length;i++){for(;l<u.length&&s[i].claim_order>=u[l].claim_order;)l++;const f=l<u.length?u[l]:null;t.insertBefore(s[i],f)}}function X(t,e){if(w){for(V(t),(t.actual_end_child===void 0||t.actual_end_child!==null&&t.actual_end_child.parentNode!==t)&&(t.actual_end_child=t.firstChild);t.actual_end_child!==null&&t.actual_end_child.claim_order===void 0;)t.actual_end_child=t.actual_end_child.nextSibling;e!==t.actual_end_child?(e.claim_order!==void 0||e.parentNode!==t)&&t.insertBefore(e,t.actual_end_child):t.actual_end_child=e.nextSibling}else(e.parentNode!==t||e.nextSibling!==null)&&t.appendChild(e)}function vt(t,e,n){w&&!n?X(t,e):(e.parentNode!==t||e.nextSibling!=n)&&t.insertBefore(e,n||null)}function Y(t){t.parentNode&&t.parentNode.removeChild(t)}function kt(t,e){for(let n=0;n<t.length;n+=1)t[n]&&t[n].d(e)}function Z(t){return document.createElement(t)}function tt(t){return document.createElementNS("http://www.w3.org/2000/svg",t)}function C(t){return document.createTextNode(t)}function wt(){return C(" ")}function Et(){return C("")}function Nt(t,e,n,r){return t.addEventListener(e,n,r),()=>t.removeEventListener(e,n,r)}function At(t){return function(e){return e.preventDefault(),t.call(this,e)}}function St(t){return function(e){return e.stopPropagation(),t.call(this,e)}}function et(t,e,n){n==null?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}function jt(t,e){const n=Object.getOwnPropertyDescriptors(t.__proto__);for(const r in e)e[r]==null?t.removeAttribute(r):r==="style"?t.style.cssText=e[r]:r==="__value"?t.value=t[r]=e[r]:n[r]&&n[r].set?t[r]=e[r]:et(t,r,e[r])}function nt(t){return Array.from(t.childNodes)}function rt(t){t.claim_info===void 0&&(t.claim_info={last_index:0,total_claimed:0})}function B(t,e,n,r,c=!1){rt(t);const u=(()=>{for(let s=t.claim_info.last_index;s<t.length;s++){const o=t[s];if(e(o)){const i=n(o);return i===void 0?t.splice(s,1):t[s]=i,c||(t.claim_info.last_index=s),o}}for(let s=t.claim_info.last_index-1;s>=0;s--){const o=t[s];if(e(o)){const i=n(o);return i===void 0?t.splice(s,1):t[s]=i,c?i===void 0&&t.claim_info.last_index--:t.claim_info.last_index=s,o}}return r()})();return u.claim_order=t.claim_info.total_claimed,t.claim_info.total_claimed+=1,u}function H(t,e,n,r){return B(t,c=>c.nodeName===e,c=>{const u=[];for(let s=0;s<c.attributes.length;s++){const o=c.attributes[s];n[o.name]||u.push(o.name)}u.forEach(s=>c.removeAttribute(s))},()=>r(e))}function Ct(t,e,n){return H(t,e,n,Z)}function Dt(t,e,n){return H(t,e,n,tt)}function ct(t,e){return B(t,n=>n.nodeType===3,n=>{const r=""+e;if(n.data.startsWith(r)){if(n.data.length!==r.length)return n.splitText(r.length)}else n.data=r},()=>C(e),!0)}function Tt(t){return ct(t," ")}function Pt(t,e){e=""+e,t.wholeText!==e&&(t.data=e)}function Mt(t,e){t.value=e??""}function Ot(t,e,n,r){n===null?t.style.removeProperty(e):t.style.setProperty(e,n,r?"important":"")}function Lt(t,e,n){t.classList[n?"add":"remove"](e)}function it(t,e,{bubbles:n=!1,cancelable:r=!1}={}){const c=document.createEvent("CustomEvent");return c.initCustomEvent(t,n,r,e),c}function qt(t,e){const n=[];let r=0;for(const c of e.childNodes)if(c.nodeType===8){const u=c.textContent.trim();u===`HEAD_${t}_END`?(r-=1,n.push(c)):u===`HEAD_${t}_START`&&(r+=1,n.push(c))}else r>0&&n.push(c);return n}function Bt(t,e){return new t(e)}let g;function _(t){g=t}function y(){if(!g)throw new Error("Function called outside component initialization");return g}function Ht(t){y().$$.before_update.push(t)}function zt(t){y().$$.on_mount.push(t)}function Ft(t){y().$$.after_update.push(t)}function Rt(t){y().$$.on_destroy.push(t)}function Ut(){const t=y();return(e,n,{cancelable:r=!1}={})=>{const c=t.$$.callbacks[e];if(c){const u=it(e,n,{cancelable:r});return c.slice().forEach(s=>{s.call(t,u)}),!u.defaultPrevented}return!0}}function Wt(t,e){const n=t.$$.callbacks[e.type];n&&n.slice().forEach(r=>r.call(this,e))}const p=[],O=[],v=[],N=[],z=Promise.resolve();let A=!1;function F(){A||(A=!0,z.then(D))}function Gt(){return F(),z}function S(t){v.push(t)}function It(t){N.push(t)}const E=new Set;let m=0;function D(){if(m!==0)return;const t=g;do{try{for(;m<p.length;){const e=p[m];m++,_(e),st(e.$$)}}catch(e){throw p.length=0,m=0,e}for(_(null),p.length=0,m=0;O.length;)O.pop()();for(let e=0;e<v.length;e+=1){const n=v[e];E.has(n)||(E.add(n),n())}v.length=0}while(p.length);for(;N.length;)N.pop()();A=!1,E.clear(),_(t)}function st(t){if(t.fragment!==null){t.update(),x(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(S)}}const k=new Set;let h;function ut(){h={r:0,c:[],p:h}}function lt(){h.r||x(h.c),h=h.p}function R(t,e){t&&t.i&&(k.delete(t),t.i(e))}function ot(t,e,n,r){if(t&&t.o){if(k.has(t))return;k.add(t),h.c.push(()=>{k.delete(t),r&&(n&&t.d(1),r())}),t.o(e)}else r&&r()}function Jt(t,e){const n=e.token={};function r(c,u,s,o){if(e.token!==n)return;e.resolved=o;let i=e.ctx;s!==void 0&&(i=i.slice(),i[s]=o);const l=c&&(e.current=c)(i);let f=!1;e.block&&(e.blocks?e.blocks.forEach((a,d)=>{d!==u&&a&&(ut(),ot(a,1,1,()=>{e.blocks[d]===a&&(e.blocks[d]=null)}),lt())}):e.block.d(1),l.c(),R(l,1),l.m(e.mount(),e.anchor),f=!0),e.block=l,e.blocks&&(e.blocks[u]=l),f&&D()}if(W(t)){const c=y();if(t.then(u=>{_(c),r(e.then,1,e.value,u),_(null)},u=>{if(_(c),r(e.catch,2,e.error,u),_(null),!e.hasCatch)throw u}),e.current!==e.pending)return r(e.pending,0),!0}else{if(e.current!==e.then)return r(e.then,1,e.value,t),!0;e.resolved=t}}function Kt(t,e,n){const r=e.slice(),{resolved:c}=t;t.current===t.then&&(r[t.value]=c),t.current===t.catch&&(r[t.error]=c),t.block.p(r,n)}function Qt(t,e){const n={},r={},c={$$scope:1};let u=t.length;for(;u--;){const s=t[u],o=e[u];if(o){for(const i in s)i in o||(r[i]=1);for(const i in o)c[i]||(n[i]=o[i],c[i]=1);t[u]=o}else for(const i in s)c[i]=1}for(const s in r)s in n||(n[s]=void 0);return n}function Vt(t,e,n){const r=t.$$.props[e];r!==void 0&&(t.$$.bound[r]=n,n(t.$$.ctx[r]))}function Xt(t){t&&t.c()}function Yt(t,e){t&&t.l(e)}function at(t,e,n,r){const{fragment:c,after_update:u}=t.$$;c&&c.m(e,n),r||S(()=>{const s=t.$$.on_mount.map(L).filter(j);t.$$.on_destroy?t.$$.on_destroy.push(...s):x(s),t.$$.on_mount=[]}),u.forEach(S)}function ft(t,e){const n=t.$$;n.fragment!==null&&(x(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}function _t(t,e){t.$$.dirty[0]===-1&&(p.push(t),F(),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function Zt(t,e,n,r,c,u,s,o=[-1]){const i=g;_(t);const l=t.$$={fragment:null,ctx:[],props:u,update:b,not_equal:c,bound:M(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(e.context||(i?i.$$.context:[])),callbacks:M(),dirty:o,skip_bound:!1,root:e.target||i.$$.root};s&&s(l.root);let f=!1;if(l.ctx=n?n(t,e.props||{},(a,d,...T)=>{const P=T.length?T[0]:d;return l.ctx&&c(l.ctx[a],l.ctx[a]=P)&&(!l.skip_bound&&l.bound[a]&&l.bound[a](P),f&&_t(t,a)),d}):[],l.update(),f=!0,x(l.before_update),l.fragment=r?r(l.ctx):!1,e.target){if(e.hydrate){J();const a=nt(e.target);l.fragment&&l.fragment.l(a),a.forEach(Y)}else l.fragment&&l.fragment.c();e.intro&&R(t.$$.fragment),at(t,e.target,e.anchor,e.customElement),K(),D()}_(i)}class te{$destroy(){ft(this,1),this.$destroy=b}$on(e,n){if(!j(n))return b;const r=this.$$.callbacks[e]||(this.$$.callbacks[e]=[]);return r.push(n),()=>{const c=r.indexOf(n);c!==-1&&r.splice(c,1)}}$set(e){this.$$set&&!G(e)&&(this.$$.skip_bound=!0,this.$$set(e),this.$$.skip_bound=!1)}}export{Ht as $,Gt as A,b as B,pt as C,bt as D,gt as E,yt as F,X as G,mt as H,Mt as I,Nt as J,O as K,ht as L,tt as M,Dt as N,Jt as O,Kt as P,kt as Q,Lt as R,te as S,U as T,jt as U,At as V,$t as W,Qt as X,x as Y,xt as Z,Ut as _,wt as a,Rt as a0,St as a1,Wt as a2,j as a3,Vt as a4,It as a5,qt as a6,vt as b,Tt as c,lt as d,Et as e,R as f,ut as g,Y as h,Zt as i,Ft as j,Z as k,Ct as l,nt as m,et as n,zt as o,Ot as p,C as q,ct as r,dt as s,ot as t,Pt as u,Bt as v,Xt as w,Yt as x,at as y,ft as z};
