import{c as o}from"./index-DsU8QnRT.js";function s(e,t=250){const[u,r]=o.useState(e);return o.useEffect(()=>{const c=setTimeout(()=>{r(e)},t);return()=>{clearTimeout(c)}},[e,t]),u}export{s as u};
