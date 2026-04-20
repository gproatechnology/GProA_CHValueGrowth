import{c as u}from"./index-DQz7BqKV.js";import{r as e}from"./vendor-DwSziFxT.js";import{j as d}from"./animations-BWrtZ8Hb.js";/**
 * @license lucide-react v0.503.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const i=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20",key:"13o1zl"}],["path",{d:"M2 12h20",key:"9i4pu4"}]],y=u("globe",i);/**
 * @license lucide-react v0.503.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const l=[["circle",{cx:"12",cy:"12",r:"4",key:"4exip2"}],["path",{d:"M12 2v2",key:"tus03m"}],["path",{d:"M12 20v2",key:"1lh1kg"}],["path",{d:"m4.93 4.93 1.41 1.41",key:"149t6j"}],["path",{d:"m17.66 17.66 1.41 1.41",key:"ptbguv"}],["path",{d:"M2 12h2",key:"1t8f8n"}],["path",{d:"M20 12h2",key:"1q8mjw"}],["path",{d:"m6.34 17.66-1.41 1.41",key:"1m8zz5"}],["path",{d:"m19.07 4.93-1.41 1.41",key:"1shlcs"}]],k=u("sun",l);function h(){const[t,r]=e.useState(null),[s,a]=e.useState(!0),[n,o]=e.useState(null);return e.useEffect(()=>{fetch("/api/v1/metrics").then(c=>c.json()).then(r).catch(o).finally(()=>a(!1))},[]),{data:t,isLoading:s,error:n}}function g(){return h()}function E(){const[t,r]=e.useState(null),[s,a]=e.useState(!0),[n,o]=e.useState(null);return e.useEffect(()=>{fetch("/api/v1/auth/me").then(c=>c.json()).then(r).catch(o).finally(()=>a(!1))},[]),{data:t,isLoading:s,error:n,refetch:()=>{}}}function b({size:t="md"}){const r={sm:"w-4 h-4",md:"w-8 h-8",lg:"w-12 h-12"};return d.jsx("div",{className:`${r[t]} animate-spin rounded-full border-2 border-[#1E90FF]/20 border-t-[#1E90FF]`})}function x({message:t}){return d.jsx("div",{className:"p-4 bg-red-500/20 border border-red-500 rounded text-red-400",children:t||"Error"})}export{x as E,y as G,b as L,k as S,g as a,E as b,h as u};
