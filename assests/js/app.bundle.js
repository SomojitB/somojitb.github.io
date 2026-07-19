/*
 * anime.js v3.2.2
 * (c) 2023 Julian Garnier
 * Released under the MIT license
 * animejs.com
 */

window.anime=function(){"use strict";var i={update:null,begin:null,loopBegin:null,changeBegin:null,change:null,changeComplete:null,loopComplete:null,complete:null,loop:1,direction:"normal",autoplay:!0,timelineOffset:0},M={duration:1e3,delay:0,endDelay:0,easing:"easeOutElastic(1, .5)",round:0},j=["translateX","translateY","translateZ","rotate","rotateX","rotateY","rotateZ","scale","scaleX","scaleY","scaleZ","skew","skewX","skewY","perspective","matrix","matrix3d"],l={CSS:{},springs:{}};function C(n,e,t){return Math.min(Math.max(n,e),t)}function u(n,e){return-1<n.indexOf(e)}function o(n,e){return n.apply(null,e)}var w={arr:function(n){return Array.isArray(n)},obj:function(n){return u(Object.prototype.toString.call(n),"Object")},pth:function(n){return w.obj(n)&&n.hasOwnProperty("totalLength")},svg:function(n){return n instanceof SVGElement},inp:function(n){return n instanceof HTMLInputElement},dom:function(n){return n.nodeType||w.svg(n)},str:function(n){return"string"==typeof n},fnc:function(n){return"function"==typeof n},und:function(n){return void 0===n},nil:function(n){return w.und(n)||null===n},hex:function(n){return/(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(n)},rgb:function(n){return/^rgb/.test(n)},hsl:function(n){return/^hsl/.test(n)},col:function(n){return w.hex(n)||w.rgb(n)||w.hsl(n)},key:function(n){return!i.hasOwnProperty(n)&&!M.hasOwnProperty(n)&&"targets"!==n&&"keyframes"!==n}};function d(n){n=/\(([^)]+)\)/.exec(n);return n?n[1].split(",").map(function(n){return parseFloat(n)}):[]}function c(r,t){var n=d(r),e=C(w.und(n[0])?1:n[0],.1,100),a=C(w.und(n[1])?100:n[1],.1,100),o=C(w.und(n[2])?10:n[2],.1,100),n=C(w.und(n[3])?0:n[3],.1,100),u=Math.sqrt(a/e),i=o/(2*Math.sqrt(a*e)),c=i<1?u*Math.sqrt(1-i*i):0,s=i<1?(i*u-n)/c:-n+u;function f(n){var e=t?t*n/1e3:n,e=i<1?Math.exp(-e*i*u)*(+Math.cos(c*e)+s*Math.sin(c*e)):(1+s*e)*Math.exp(-e*u);return 0===n||1===n?n:1-e}return t?f:function(){var n=l.springs[r];if(n)return n;for(var e=0,t=0;;)if(1===f(e+=1/6)){if(16<=++t)break}else t=0;return n=e*(1/6)*1e3,l.springs[r]=n}}function q(e){return void 0===e&&(e=10),function(n){return Math.ceil(C(n,1e-6,1)*e)*(1/e)}}var H=function(b,e,M,t){if(0<=b&&b<=1&&0<=M&&M<=1){var x=new Float32Array(11);if(b!==e||M!==t)for(var n=0;n<11;++n)x[n]=k(.1*n,b,M);return function(n){return b===e&&M===t||0===n||1===n?n:k(r(n),e,t)}}function r(n){for(var e=0,t=1;10!==t&&x[t]<=n;++t)e+=.1;var r=e+.1*((n-x[--t])/(x[t+1]-x[t])),a=O(r,b,M);if(.001<=a){for(var o=n,u=r,i=b,c=M,s=0;s<4;++s){var f=O(u,i,c);if(0===f)return u;u-=(k(u,i,c)-o)/f}return u}if(0===a)return r;for(var l,d,p=n,h=e,g=e+.1,m=b,v=M,y=0;0<(l=k(d=h+(g-h)/2,m,v)-p)?g=d:h=d,1e-7<Math.abs(l)&&++y<10;);return d}};function r(n,e){return 1-3*e+3*n}function k(n,e,t){return((r(e,t)*n+(3*t-6*e))*n+3*e)*n}function O(n,e,t){return 3*r(e,t)*n*n+2*(3*t-6*e)*n+3*e}e={linear:function(){return function(n){return n}}},t={Sine:function(){return function(n){return 1-Math.cos(n*Math.PI/2)}},Expo:function(){return function(n){return n?Math.pow(2,10*n-10):0}},Circ:function(){return function(n){return 1-Math.sqrt(1-n*n)}},Back:function(){return function(n){return n*n*(3*n-2)}},Bounce:function(){return function(n){for(var e,t=4;n<((e=Math.pow(2,--t))-1)/11;);return 1/Math.pow(4,3-t)-7.5625*Math.pow((3*e-2)/22-n,2)}},Elastic:function(n,e){void 0===e&&(e=.5);var t=C(n=void 0===n?1:n,1,10),r=C(e,.1,2);return function(n){return 0===n||1===n?n:-t*Math.pow(2,10*(n-1))*Math.sin((n-1-r/(2*Math.PI)*Math.asin(1/t))*(2*Math.PI)/r)}}},["Quad","Cubic","Quart","Quint"].forEach(function(n,e){t[n]=function(){return function(n){return Math.pow(n,e+2)}}}),Object.keys(t).forEach(function(n){var r=t[n];e["easeIn"+n]=r,e["easeOut"+n]=function(e,t){return function(n){return 1-r(e,t)(1-n)}},e["easeInOut"+n]=function(e,t){return function(n){return n<.5?r(e,t)(2*n)/2:1-r(e,t)(-2*n+2)/2}},e["easeOutIn"+n]=function(e,t){return function(n){return n<.5?(1-r(e,t)(1-2*n))/2:(r(e,t)(2*n-1)+1)/2}}});var e,t,s=e;function P(n,e){if(w.fnc(n))return n;var t=n.split("(")[0],r=s[t],a=d(n);switch(t){case"spring":return c(n,e);case"cubicBezier":return o(H,a);case"steps":return o(q,a);default:return o(r,a)}}function a(n){try{return document.querySelectorAll(n)}catch(n){}}function I(n,e){for(var t,r=n.length,a=2<=arguments.length?e:void 0,o=[],u=0;u<r;u++)u in n&&(t=n[u],e.call(a,t,u,n))&&o.push(t);return o}function f(n){return n.reduce(function(n,e){return n.concat(w.arr(e)?f(e):e)},[])}function p(n){return w.arr(n)?n:(n=w.str(n)?a(n)||n:n)instanceof NodeList||n instanceof HTMLCollection?[].slice.call(n):[n]}function h(n,e){return n.some(function(n){return n===e})}function g(n){var e,t={};for(e in n)t[e]=n[e];return t}function x(n,e){var t,r=g(n);for(t in n)r[t]=(e.hasOwnProperty(t)?e:n)[t];return r}function D(n,e){var t,r=g(n);for(t in e)r[t]=(w.und(n[t])?e:n)[t];return r}function V(n){var e,t,r,a,o,u,i;return w.rgb(n)?(e=/rgb\((\d+,\s*[\d]+,\s*[\d]+)\)/g.exec(t=n))?"rgba("+e[1]+",1)":t:w.hex(n)?(e=(e=n).replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i,function(n,e,t,r){return e+e+t+t+r+r}),e=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(e),"rgba("+parseInt(e[1],16)+","+parseInt(e[2],16)+","+parseInt(e[3],16)+",1)"):w.hsl(n)?(t=/hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/g.exec(t=n)||/hsla\((\d+),\s*([\d.]+)%,\s*([\d.]+)%,\s*([\d.]+)\)/g.exec(t),n=parseInt(t[1],10)/360,u=parseInt(t[2],10)/100,i=parseInt(t[3],10)/100,t=t[4]||1,0==u?r=a=o=i:(r=c(u=2*i-(i=i<.5?i*(1+u):i+u-i*u),i,n+1/3),a=c(u,i,n),o=c(u,i,n-1/3)),"rgba("+255*r+","+255*a+","+255*o+","+t+")"):void 0;function c(n,e,t){return t<0&&(t+=1),1<t&&--t,t<1/6?n+6*(e-n)*t:t<.5?e:t<2/3?n+(e-n)*(2/3-t)*6:n}}function B(n){n=/[+-]?\d*\.?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?(%|px|pt|em|rem|in|cm|mm|ex|ch|pc|vw|vh|vmin|vmax|deg|rad|turn)?$/.exec(n);if(n)return n[1]}function m(n,e){return w.fnc(n)?n(e.target,e.id,e.total):n}function v(n,e){return n.getAttribute(e)}function y(n,e,t){var r,a,o;return h([t,"deg","rad","turn"],B(e))?e:(r=l.CSS[e+t],w.und(r)?(a=document.createElement(n.tagName),(n=n.parentNode&&n.parentNode!==document?n.parentNode:document.body).appendChild(a),a.style.position="absolute",a.style.width=100+t,o=100/a.offsetWidth,n.removeChild(a),n=o*parseFloat(e),l.CSS[e+t]=n):r)}function $(n,e,t){var r;if(e in n.style)return r=e.replace(/([a-z])([A-Z])/g,"$1-$2").toLowerCase(),e=n.style[e]||getComputedStyle(n).getPropertyValue(r)||"0",t?y(n,e,t):e}function b(n,e){return w.dom(n)&&!w.inp(n)&&(!w.nil(v(n,e))||w.svg(n)&&n[e])?"attribute":w.dom(n)&&h(j,e)?"transform":w.dom(n)&&"transform"!==e&&$(n,e)?"css":null!=n[e]?"object":void 0}function W(n){if(w.dom(n)){for(var e,t=n.style.transform||"",r=/(\w+)\(([^)]*)\)/g,a=new Map;e=r.exec(t);)a.set(e[1],e[2]);return a}}function X(n,e,t,r){var a=u(e,"scale")?1:0+(u(a=e,"translate")||"perspective"===a?"px":u(a,"rotate")||u(a,"skew")?"deg":void 0),o=W(n).get(e)||a;return t&&(t.transforms.list.set(e,o),t.transforms.last=e),r?y(n,o,r):o}function T(n,e,t,r){switch(b(n,e)){case"transform":return X(n,e,r,t);case"css":return $(n,e,t);case"attribute":return v(n,e);default:return n[e]||0}}function E(n,e){var t=/^(\*=|\+=|-=)/.exec(n);if(!t)return n;var r=B(n)||0,a=parseFloat(e),o=parseFloat(n.replace(t[0],""));switch(t[0][0]){case"+":return a+o+r;case"-":return a-o+r;case"*":return a*o+r}}function Y(n,e){var t;return w.col(n)?V(n):/\s/g.test(n)?n:(t=(t=B(n))?n.substr(0,n.length-t.length):n,e?t+e:t)}function F(n,e){return Math.sqrt(Math.pow(e.x-n.x,2)+Math.pow(e.y-n.y,2))}function Z(n){for(var e,t=n.points,r=0,a=0;a<t.numberOfItems;a++){var o=t.getItem(a);0<a&&(r+=F(e,o)),e=o}return r}function G(n){if(n.getTotalLength)return n.getTotalLength();switch(n.tagName.toLowerCase()){case"circle":return 2*Math.PI*v(n,"r");case"rect":return 2*v(t=n,"width")+2*v(t,"height");case"line":return F({x:v(t=n,"x1"),y:v(t,"y1")},{x:v(t,"x2"),y:v(t,"y2")});case"polyline":return Z(n);case"polygon":return e=n.points,Z(n)+F(e.getItem(e.numberOfItems-1),e.getItem(0))}var e,t}function Q(n,e){var e=e||{},n=e.el||function(n){for(var e=n.parentNode;w.svg(e)&&w.svg(e.parentNode);)e=e.parentNode;return e}(n),t=n.getBoundingClientRect(),r=v(n,"viewBox"),a=t.width,t=t.height,e=e.viewBox||(r?r.split(" "):[0,0,a,t]);return{el:n,viewBox:e,x:+e[0],y:+e[1],w:a,h:t,vW:e[2],vH:e[3]}}function z(n,e){var t=/[+-]?\d*\.?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/g,r=Y(w.pth(n)?n.totalLength:n,e)+"";return{original:r,numbers:r.match(t)?r.match(t).map(Number):[0],strings:w.str(n)||e?r.split(t):[]}}function A(n){return I(n?f(w.arr(n)?n.map(p):p(n)):[],function(n,e,t){return t.indexOf(n)===e})}function _(n){var t=A(n);return t.map(function(n,e){return{target:n,id:e,total:t.length,transforms:{list:W(n)}}})}function R(e){for(var t=I(f(e.map(function(n){return Object.keys(n)})),function(n){return w.key(n)}).reduce(function(n,e){return n.indexOf(e)<0&&n.push(e),n},[]),a={},n=0;n<t.length;n++)!function(n){var r=t[n];a[r]=e.map(function(n){var e,t={};for(e in n)w.key(e)?e==r&&(t.value=n[e]):t[e]=n[e];return t})}(n);return a}function J(n,e){var t,r=[],a=e.keyframes;for(t in e=a?D(R(a),e):e)w.key(t)&&r.push({name:t,tweens:function(n,t){var e,r=g(t),a=(/^spring/.test(r.easing)&&(r.duration=c(r.easing)),w.arr(n)&&(2===(e=n.length)&&!w.obj(n[0])?n={value:n}:w.fnc(t.duration)||(r.duration=t.duration/e)),w.arr(n)?n:[n]);return a.map(function(n,e){n=w.obj(n)&&!w.pth(n)?n:{value:n};return w.und(n.delay)&&(n.delay=e?0:t.delay),w.und(n.endDelay)&&(n.endDelay=e===a.length-1?t.endDelay:0),n}).map(function(n){return D(n,r)})}(e[t],n)});return r}function K(i,c){var s;return i.tweens.map(function(n){var n=function(n,e){var t,r={};for(t in n){var a=m(n[t],e);w.arr(a)&&1===(a=a.map(function(n){return m(n,e)})).length&&(a=a[0]),r[t]=a}return r.duration=parseFloat(r.duration),r.delay=parseFloat(r.delay),r}(n,c),e=n.value,t=w.arr(e)?e[1]:e,r=B(t),a=T(c.target,i.name,r,c),o=s?s.to.original:a,u=w.arr(e)?e[0]:o,a=B(u)||B(a),r=r||a;return w.und(t)&&(t=o),n.from=z(u,r),n.to=z(E(t,u),r),n.start=s?s.end:0,n.end=n.start+n.delay+n.duration+n.endDelay,n.easing=P(n.easing,n.duration),n.isPath=w.pth(e),n.isPathTargetInsideSVG=n.isPath&&w.svg(c.target),n.isColor=w.col(n.from.original),n.isColor&&(n.round=1),s=n})}var U={css:function(n,e,t){return n.style[e]=t},attribute:function(n,e,t){return n.setAttribute(e,t)},object:function(n,e,t){return n[e]=t},transform:function(n,e,t,r,a){var o;r.list.set(e,t),e!==r.last&&!a||(o="",r.list.forEach(function(n,e){o+=e+"("+n+") "}),n.style.transform=o)}};function nn(n,u){_(n).forEach(function(n){for(var e in u){var t=m(u[e],n),r=n.target,a=B(t),o=T(r,e,a,n),t=E(Y(t,a||B(o)),o),a=b(r,e);U[a](r,e,t,n.transforms,!0)}})}function en(n,e){return I(f(n.map(function(o){return e.map(function(n){var e,t,r=o,a=b(r.target,n.name);if(a)return t=(e=K(n,r))[e.length-1],{type:a,property:n.name,animatable:r,tweens:e,duration:t.end,delay:e[0].delay,endDelay:t.endDelay}})})),function(n){return!w.und(n)})}function tn(n,e){function t(n){return n.timelineOffset||0}var r=n.length,a={};return a.duration=r?Math.max.apply(Math,n.map(function(n){return t(n)+n.duration})):e.duration,a.delay=r?Math.min.apply(Math,n.map(function(n){return t(n)+n.delay})):e.delay,a.endDelay=r?a.duration-Math.max.apply(Math,n.map(function(n){return t(n)+n.duration-n.endDelay})):e.endDelay,a}var rn=0;var N,S=[],an=("undefined"!=typeof document&&document.addEventListener("visibilitychange",function(){L.suspendWhenDocumentHidden&&(n()?N=cancelAnimationFrame(N):(S.forEach(function(n){return n._onDocumentVisibility()}),an()))}),function(){!(N||n()&&L.suspendWhenDocumentHidden)&&0<S.length&&(N=requestAnimationFrame(on))});function on(n){for(var e=S.length,t=0;t<e;){var r=S[t];r.paused?(S.splice(t,1),e--):(r.tick(n),t++)}N=0<t?requestAnimationFrame(on):void 0}function n(){return document&&document.hidden}function L(n){var c,s=0,f=0,l=0,d=0,p=null;function h(n){var e=window.Promise&&new Promise(function(n){return p=n});return n.finished=e}e=x(i,n=n=void 0===n?{}:n),t=J(r=x(M,n),n),n=_(n.targets),r=tn(t=en(n,t),r),a=rn,rn++;var e,t,r,a,k=D(e,{id:a,children:[],animatables:n,animations:t,duration:r.duration,delay:r.delay,endDelay:r.endDelay});h(k);function g(){var n=k.direction;"alternate"!==n&&(k.direction="normal"!==n?"normal":"reverse"),k.reversed=!k.reversed,c.forEach(function(n){return n.reversed=k.reversed})}function m(n){return k.reversed?k.duration-n:n}function o(){s=0,f=m(k.currentTime)*(1/L.speed)}function v(n,e){e&&e.seek(n-e.timelineOffset)}function y(e){for(var n=0,t=k.animations,r=t.length;n<r;){for(var a=t[n],o=a.animatable,u=a.tweens,i=u.length-1,c=u[i],i=(i&&(c=I(u,function(n){return e<n.end})[0]||c),C(e-c.start-c.delay,0,c.duration)/c.duration),s=isNaN(i)?1:c.easing(i),f=c.to.strings,l=c.round,d=[],p=c.to.numbers.length,h=void 0,g=0;g<p;g++){var m=void 0,v=c.to.numbers[g],y=c.from.numbers[g]||0,m=c.isPath?function(e,t,n){function r(n){return e.el.getPointAtLength(1<=t+(n=void 0===n?0:n)?t+n:0)}var a=Q(e.el,e.svg),o=r(),u=r(-1),i=r(1),c=n?1:a.w/a.vW,s=n?1:a.h/a.vH;switch(e.property){case"x":return(o.x-a.x)*c;case"y":return(o.y-a.y)*s;case"angle":return 180*Math.atan2(i.y-u.y,i.x-u.x)/Math.PI}}(c.value,s*v,c.isPathTargetInsideSVG):y+s*(v-y);!l||c.isColor&&2<g||(m=Math.round(m*l)/l),d.push(m)}var b=f.length;if(b)for(var h=f[0],M=0;M<b;M++){f[M];var x=f[M+1],w=d[M];isNaN(w)||(h+=x?w+x:w+" ")}else h=d[0];U[a.type](o.target,a.property,h,o.transforms),a.currentValue=h,n++}}function b(n){k[n]&&!k.passThrough&&k[n](k)}function u(n){var e=k.duration,t=k.delay,r=e-k.endDelay,a=m(n);if(k.progress=C(a/e*100,0,100),k.reversePlayback=a<k.currentTime,c){var o=a;if(k.reversePlayback)for(var u=d;u--;)v(o,c[u]);else for(var i=0;i<d;i++)v(o,c[i])}!k.began&&0<k.currentTime&&(k.began=!0,b("begin")),!k.loopBegan&&0<k.currentTime&&(k.loopBegan=!0,b("loopBegin")),a<=t&&0!==k.currentTime&&y(0),(r<=a&&k.currentTime!==e||!e)&&y(e),t<a&&a<r?(k.changeBegan||(k.changeBegan=!0,k.changeCompleted=!1,b("changeBegin")),b("change"),y(a)):k.changeBegan&&(k.changeCompleted=!0,k.changeBegan=!1,b("changeComplete")),k.currentTime=C(a,0,e),k.began&&b("update"),e<=n&&(f=0,k.remaining&&!0!==k.remaining&&k.remaining--,k.remaining?(s=l,b("loopComplete"),k.loopBegan=!1,"alternate"===k.direction&&g()):(k.paused=!0,k.completed||(k.completed=!0,b("loopComplete"),b("complete"),!k.passThrough&&"Promise"in window&&(p(),h(k)))))}return k.reset=function(){var n=k.direction;k.passThrough=!1,k.currentTime=0,k.progress=0,k.paused=!0,k.began=!1,k.loopBegan=!1,k.changeBegan=!1,k.completed=!1,k.changeCompleted=!1,k.reversePlayback=!1,k.reversed="reverse"===n,k.remaining=k.loop,c=k.children;for(var e=d=c.length;e--;)k.children[e].reset();(k.reversed&&!0!==k.loop||"alternate"===n&&1===k.loop)&&k.remaining++,y(k.reversed?k.duration:0)},k._onDocumentVisibility=o,k.set=function(n,e){return nn(n,e),k},k.tick=function(n){u(((l=n)+(f-(s=s||l)))*L.speed)},k.seek=function(n){u(m(n))},k.pause=function(){k.paused=!0,o()},k.play=function(){k.paused&&(k.completed&&k.reset(),k.paused=!1,S.push(k),o(),an())},k.reverse=function(){g(),k.completed=!k.reversed,o()},k.restart=function(){k.reset(),k.play()},k.remove=function(n){cn(A(n),k)},k.reset(),k.autoplay&&k.play(),k}function un(n,e){for(var t=e.length;t--;)h(n,e[t].animatable.target)&&e.splice(t,1)}function cn(n,e){var t=e.animations,r=e.children;un(n,t);for(var a=r.length;a--;){var o=r[a],u=o.animations;un(n,u),u.length||o.children.length||r.splice(a,1)}t.length||r.length||e.pause()}return L.version="3.2.2",L.speed=1,L.suspendWhenDocumentHidden=!0,L.running=S,L.remove=function(n){for(var e=A(n),t=S.length;t--;)cn(e,S[t])},L.get=T,L.set=nn,L.convertPx=y,L.path=function(n,e){var t=w.str(n)?a(n)[0]:n,r=e||100;return function(n){return{property:n,el:t,svg:Q(t),totalLength:G(t)*(r/100)}}},L.setDashoffset=function(n){var e=G(n);return n.setAttribute("stroke-dasharray",e),e},L.stagger=function(n,e){var i=(e=void 0===e?{}:e).direction||"normal",c=e.easing?P(e.easing):null,s=e.grid,f=e.axis,l=e.from||0,d="first"===l,p="center"===l,h="last"===l,g=w.arr(n),m=g?parseFloat(n[0]):parseFloat(n),v=g?parseFloat(n[1]):0,y=B(g?n[1]:n)||0,b=e.start||0+(g?m:0),M=[],x=0;return function(n,e,t){if(d&&(l=0),p&&(l=(t-1)/2),h&&(l=t-1),!M.length){for(var r,a,o,u=0;u<t;u++)s?(r=p?(s[0]-1)/2:l%s[0],a=p?(s[1]-1)/2:Math.floor(l/s[0]),r=r-u%s[0],a=a-Math.floor(u/s[0]),o=Math.sqrt(r*r+a*a),"x"===f&&(o=-r),M.push(o="y"===f?-a:o)):M.push(Math.abs(l-u)),x=Math.max.apply(Math,M);c&&(M=M.map(function(n){return c(n/x)*x})),"reverse"===i&&(M=M.map(function(n){return f?n<0?-1*n:-n:Math.abs(x-n)}))}return b+(g?(v-m)/x:m)*(Math.round(100*M[e])/100)+y}},L.timeline=function(u){var i=L(u=void 0===u?{}:u);return i.duration=0,i.add=function(n,e){var t=S.indexOf(i),r=i.children;function a(n){n.passThrough=!0}-1<t&&S.splice(t,1);for(var o=0;o<r.length;o++)a(r[o]);t=D(n,x(M,u)),t.targets=t.targets||u.targets,n=i.duration,t.autoplay=!1,t.direction=i.direction,t.timelineOffset=w.und(e)?n:E(e,n),a(i),i.seek(t.timelineOffset),e=L(t),a(e),r.push(e),n=tn(r,u);return i.delay=n.delay,i.endDelay=n.endDelay,i.duration=n.duration,i.seek(0),i.reset(),i.autoplay&&i.play(),i},i},L.easing=P,L.penner=s,L.random=function(n,e){return Math.floor(Math.random()*(e-n+1))+n},L}();

document.documentElement.classList.add('js');

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasAnime = typeof window.anime === 'function';
const motionAllowed = hasAnime && !prefersReducedMotion;
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

function buildSignalGrid() {
  const grid = $('.signal-grid');
  if (!grid || grid.children.length) return;

  const fragment = document.createDocumentFragment();
  for (let index = 0; index < 42; index += 1) {
    fragment.appendChild(document.createElement('span'));
  }
  grid.appendChild(fragment);
}

function showStaticFallback() {
  $$('[data-reveal]').forEach((element) => {
    element.style.opacity = '1';
    element.style.transform = 'none';
  });
  $$('.count').forEach((counter) => {
    counter.textContent = Number(counter.dataset.count).toLocaleString();
  });
}

function setupNavigation() {
  const menu = $('#menu');
  const nav = $('.navbar');
  if (!menu || !nav) return;

  const closeMenu = () => {
    nav.classList.remove('open');
    menu.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nav-open');
  };

  menu.addEventListener('click', () => {
    const willOpen = !nav.classList.contains('open');
    nav.classList.toggle('open', willOpen);
    menu.setAttribute('aria-expanded', String(willOpen));
    document.body.classList.toggle('nav-open', willOpen);

    if (motionAllowed && willOpen) {
      anime({
        targets: $$('.navbar a'),
        translateY: [20, 0],
        opacity: [0, 1],
        delay: anime.stagger(55),
        duration: 480,
        easing: 'easeOutCubic'
      });
    }
  });

  $$('.navbar a').forEach((link) => link.addEventListener('click', closeMenu));
  window.addEventListener('resize', () => {
    if (window.innerWidth > 920) closeMenu();
  });
}

function setupSmoothAnchors() {
  $$('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const hash = link.getAttribute('href');
      const target = hash ? $(hash) : null;
      if (!target || !motionAllowed) return;

      event.preventDefault();
      const headerOffset = target.matches('[data-section]') ? 0 : 82;
      const destination = Math.max(0, target.getBoundingClientRect().top + window.scrollY - headerOffset);
      anime.remove(document.scrollingElement);
      anime({
        targets: document.scrollingElement,
        scrollTop: destination,
        duration: 900,
        easing: 'easeInOutQuart',
        complete: () => {
          history.replaceState(null, '', hash);
          if (link.classList.contains('skip-link')) target.focus({ preventScroll: true });
        }
      });
    });
  });
}

function setupInitialHashAlignment() {
  if (!window.location.hash || window.location.hash === '#home') return;

  let visitorHasInteracted = false;
  const cancelAlignment = () => { visitorHasInteracted = true; };
  ['keydown', 'pointerdown', 'touchstart', 'wheel'].forEach((eventName) => {
    window.addEventListener(eventName, cancelAlignment, { once: true, passive: true });
  });

  const align = () => {
    if (visitorHasInteracted) return;
    const target = $(window.location.hash);
    if (!target) return;
    const headerOffset = target.matches('[data-section]') ? 0 : 82;
    const destination = Math.max(0, target.getBoundingClientRect().top + window.scrollY - headerOffset);
    window.scrollTo(0, destination);
  };

  window.addEventListener('load', () => {
    align();
    window.setTimeout(align, 350);
    window.setTimeout(align, 1100);
  });
}

function runHeroSequence() {
  if (!motionAllowed) return;

  anime.timeline({ easing: 'easeOutExpo' })
    .add({
      targets: '.site-header > *',
      translateY: [-22, 0],
      opacity: [0, 1],
      delay: anime.stagger(50),
      duration: 760
    })
    .add({
      targets: '.hero-kicker',
      translateY: [18, 0],
      opacity: [0, 1],
      duration: 560
    }, '-=430')
    .add({
      targets: '.title-line > span',
      translateY: ['108%', '0%'],
      delay: anime.stagger(90),
      duration: 900
    }, '-=370')
    .add({
      targets: '.hero-intro',
      translateY: [26, 0],
      opacity: [0, 1],
      duration: 620
    }, '-=520')
    .add({
      targets: '.portrait-frame, .hero-portrait figcaption',
      translateY: [42, 0],
      opacity: [0, 1],
      delay: anime.stagger(90),
      duration: 800
    }, '-=760')
    .add({
      targets: '.proof-strip > div',
      translateY: [24, 0],
      opacity: [0, 1],
      delay: anime.stagger(70),
      duration: 580
    }, '-=560')
    .add({
      targets: '.signal-grid span',
      scale: [0, 1],
      opacity: [0, 1],
      delay: anime.stagger(14, { grid: [7, 6], from: 'center' }),
      duration: 420
    }, '-=590');

  anime({
    targets: '.availability-dot',
    scale: [1, 1.35],
    opacity: [1, 0.58],
    direction: 'alternate',
    loop: true,
    duration: 850,
    easing: 'easeInOutSine'
  });
}

function setupMarquee() {
  const track = $('.marquee-track');
  const firstGroup = track ? $('.marquee-group', track) : null;
  if (!track || !firstGroup || !motionAllowed) return;

  const run = () => {
    anime.remove(track);
    anime.set(track, { translateX: 0 });
    anime({
      targets: track,
      translateX: -firstGroup.getBoundingClientRect().width,
      duration: 24000,
      easing: 'linear',
      loop: true
    });
  };

  run();
  window.addEventListener('resize', run);
}

function setupRevealAnimations() {
  const elements = $$('[data-reveal]');
  if (!motionAllowed || !('IntersectionObserver' in window)) {
    showStaticFallback();
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      anime.remove(entry.target);
      anime({
        targets: entry.target,
        translateY: [32, 0],
        opacity: [0, 1],
        duration: 720,
        easing: 'easeOutCubic'
      });
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -7% 0px' });

  elements.forEach((element) => observer.observe(element));
}

function setupCounters() {
  const counters = $$('.count');
  const proofStrip = $('.proof-strip');
  if (!proofStrip || counters.length === 0) return;

  const setFinalValues = () => counters.forEach((counter) => {
    counter.textContent = Number(counter.dataset.count).toLocaleString();
  });

  if (!motionAllowed || !('IntersectionObserver' in window)) {
    setFinalValues();
    return;
  }

  setFinalValues();
  const observer = new IntersectionObserver((entries) => {
    if (!entries.some((entry) => entry.isIntersecting)) return;
    counters.forEach((counter) => {
      anime.remove(counter);
    });
    anime({
      targets: counters,
      scale: [0.72, 1],
      opacity: [0, 1],
      delay: anime.stagger(90),
      duration: 760,
      easing: 'easeOutElastic(1, .72)'
    });
    observer.disconnect();
  }, { threshold: 0.45 });
  observer.observe(proofStrip);
}

function setupPointerMotion() {
  if (!motionAllowed || !window.matchMedia('(pointer: fine)').matches) return;

  const dot = $('.cursor-dot');
  const ring = $('.cursor-ring');
  let pointerX = -80;
  let pointerY = -80;
  let ringX = -80;
  let ringY = -80;

  const renderCursor = () => {
    ringX += (pointerX - ringX) * 0.16;
    ringY += (pointerY - ringY) * 0.16;
    if (ring) {
      ring.style.left = `${ringX}px`;
      ring.style.top = `${ringY}px`;
    }
    requestAnimationFrame(renderCursor);
  };

  window.addEventListener('pointermove', (event) => {
    pointerX = event.clientX;
    pointerY = event.clientY;
    if (dot) {
      dot.style.left = `${pointerX}px`;
      dot.style.top = `${pointerY}px`;
    }
  }, { passive: true });
  renderCursor();

  const interactiveSelector = 'a, button, summary, [data-project-card], [data-spotlight]';
  $$(interactiveSelector).forEach((element) => {
    element.addEventListener('pointerenter', () => ring?.classList.add('is-active'));
    element.addEventListener('pointerleave', () => ring?.classList.remove('is-active'));
  });

  $$('[data-magnetic]').forEach((element) => {
    element.addEventListener('pointermove', (event) => {
      const rect = element.getBoundingClientRect();
      anime.remove(element);
      anime({
        targets: element,
        translateX: (event.clientX - rect.left - rect.width / 2) * 0.14,
        translateY: (event.clientY - rect.top - rect.height / 2) * 0.14,
        duration: 230,
        easing: 'easeOutQuad'
      });
    });
    element.addEventListener('pointerleave', () => {
      anime.remove(element);
      anime({ targets: element, translateX: 0, translateY: 0, duration: 520, easing: 'easeOutElastic(1, .55)' });
    });
  });

  const portrait = $('[data-tilt]');
  portrait?.addEventListener('pointermove', (event) => {
    const rect = portrait.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    anime.remove(portrait);
    anime({ targets: portrait, rotateY: x * 7, rotateX: y * -7, duration: 360, easing: 'easeOutCubic' });
  });
  portrait?.addEventListener('pointerleave', () => {
    anime.remove(portrait);
    anime({ targets: portrait, rotateX: 0, rotateY: 0, duration: 650, easing: 'easeOutElastic(1, .6)' });
  });

  $$('[data-project-card]').forEach((card) => {
    const image = $('.project-image img', card);
    const arrow = $('.project-info b', card);
    card.addEventListener('pointerenter', () => {
      anime.remove([card, image, arrow]);
      anime({ targets: card, translateY: -7, duration: 260, easing: 'easeOutCubic' });
      anime({ targets: image, scale: 1.035, duration: 650, easing: 'easeOutCubic' });
      anime({ targets: arrow, translateX: 5, translateY: -5, duration: 280, easing: 'easeOutCubic' });
    });
    card.addEventListener('pointerleave', () => {
      anime.remove([card, image, arrow]);
      anime({ targets: card, translateY: 0, duration: 360, easing: 'easeOutCubic' });
      anime({ targets: image, scale: 1, duration: 520, easing: 'easeOutCubic' });
      anime({ targets: arrow, translateX: 0, translateY: 0, duration: 300, easing: 'easeOutCubic' });
    });
  });

  $$('[data-spotlight]').forEach((entry) => {
    entry.addEventListener('pointermove', (event) => {
      const rect = entry.getBoundingClientRect();
      entry.style.setProperty('--spot-x', `${event.clientX - rect.left}px`);
      entry.style.setProperty('--spot-y', `${event.clientY - rect.top}px`);
    });
  });
}

function setupClickFeedback() {
  const pulse = $('.click-pulse');
  if (!pulse || !motionAllowed) return;

  document.addEventListener('pointerdown', (event) => {
    if (event.button !== 0) return;
    anime.remove(pulse);
    pulse.style.left = `${event.clientX}px`;
    pulse.style.top = `${event.clientY}px`;
    anime({
      targets: pulse,
      translateX: '-50%',
      translateY: '-50%',
      scale: [0.2, 4.5],
      opacity: [0.9, 0],
      duration: 520,
      easing: 'easeOutCubic'
    });
  }, { passive: true });

  $$('a, button, summary').forEach((element) => {
    element.addEventListener('pointerdown', () => {
      anime.remove(element);
      anime({ targets: element, scale: [0.97, 1], duration: 300, easing: 'easeOutElastic(1, .7)' });
    });
  });
}

function setupLanguageMotion() {
  const panel = $('[data-language-card]');
  const current = panel ? $('[data-language-current]', panel) : null;
  const codes = panel ? $$('[data-language-code]', panel) : [];
  if (!panel || !current || codes.length === 0 || !motionAllowed) return;

  const languages = ['English', 'Hindi', 'Bengali', 'Spanish'];
  let index = 0;
  let visible = !('IntersectionObserver' in window);

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      visible = entries.some((entry) => entry.isIntersecting);
    }, { threshold: 0.25 });
    observer.observe(panel);
  }

  window.setInterval(() => {
    if (!visible || document.hidden) return;
    index = (index + 1) % languages.length;
    anime.remove(current);
    anime({
      targets: current,
      translateY: [0, -20],
      opacity: [1, 0],
      duration: 240,
      easing: 'easeInCubic',
      complete: () => {
        current.textContent = languages[index];
        codes.forEach((code, codeIndex) => code.classList.toggle('active', codeIndex === index));
        anime({ targets: current, translateY: [20, 0], opacity: [0, 1], duration: 390, easing: 'easeOutExpo' });
        anime({ targets: codes[index], scale: [0.72, 1], duration: 430, easing: 'easeOutElastic(1, .65)' });
      }
    });
  }, 1800);
}

function setupContactMotion() {
  const routes = $$('[data-contact-route]');
  if (!routes.length) return;

  if (motionAllowed && window.matchMedia('(pointer: fine)').matches) {
    routes.forEach((route) => {
      const details = $$(':scope > span:not(.contact-signal), :scope > strong, :scope > small, :scope > b', route);
      route.addEventListener('pointerenter', () => {
        anime.remove(details);
        anime({ targets: details, translateX: [0, 7], delay: anime.stagger(28), duration: 260, easing: 'easeOutCubic' });
      });
      route.addEventListener('pointerleave', () => {
        anime.remove(details);
        anime({ targets: details, translateX: 0, duration: 240, easing: 'easeOutCubic' });
      });
    });
  }

  const disclosure = $('.phone-disclosure');
  disclosure?.addEventListener('toggle', () => {
    if (!motionAllowed || !disclosure.open) return;
    anime({
      targets: $$('.phone-options a', disclosure),
      translateY: [14, 0],
      opacity: [0, 1],
      delay: anime.stagger(65),
      duration: 420,
      easing: 'easeOutCubic'
    });
  });

  if (motionAllowed) {
    anime({
      targets: '.contact-signal i',
      scaleY: [0.28, 1],
      opacity: [0.45, 1],
      delay: anime.stagger(105),
      duration: 700,
      direction: 'alternate',
      loop: true,
      easing: 'easeInOutSine'
    });
  }
}

function setupScrollMotion() {
  const progress = $('.scroll-progress span');
  const header = $('[data-header]');
  const images = $$('[data-scroll-image]');
  const sections = $$('[data-section][id]');
  const navLinks = $$('.navbar a');
  let ticking = false;

  const update = () => {
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    if (progress) progress.style.transform = `scaleX(${Math.min(1, Math.max(0, window.scrollY / maxScroll))})`;
    header?.classList.toggle('compact', window.scrollY > 40);

    let currentSection = sections[0];
    sections.forEach((section) => {
      if (section.getBoundingClientRect().top <= window.innerHeight * 0.34) currentSection = section;
    });
    const currentHref = currentSection ? `#${currentSection.id}` : '#home';
    navLinks.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === currentHref));

    if (motionAllowed && window.innerWidth > 920) {
      images.forEach((image) => {
        const frame = image.parentElement;
        const rect = frame.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > window.innerHeight) return;
        const offset = (rect.top + rect.height / 2 - window.innerHeight / 2) / window.innerHeight;
        image.style.transform = `translateY(${(-7 - offset * 7).toFixed(2)}%)`;
      });
    }
    ticking = false;
  };

  const requestUpdate = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  };
  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate);
  update();
}

function setupSignalMotion() {
  if (!motionAllowed) return;
  anime({
    targets: '.signal-grid span',
    translateY: () => anime.random(-6, 6),
    scale: () => anime.random(72, 118) / 100,
    opacity: () => anime.random(36, 100) / 100,
    delay: anime.stagger(48, { grid: [7, 6], from: 'center' }),
    duration: 1700,
    direction: 'alternate',
    loop: true,
    easing: 'easeInOutSine'
  });
}

function setupPageDetails() {
  const favicon = $('#favicon');
  document.addEventListener('visibilitychange', () => {
    const visible = document.visibilityState === 'visible';
    document.title = visible ? 'Somojit Banerjee | Cloud Security Architect' : 'Come Back To Portfolio';
    favicon?.setAttribute('href', visible ? './assests/images/favicon.jpg' : './assests/images/favhand.png');
  });
  const year = $('#current-year');
  if (year) year.textContent = String(new Date().getFullYear());
}

buildSignalGrid();
setupNavigation();
setupSmoothAnchors();
setupInitialHashAlignment();
setupRevealAnimations();
setupCounters();
setupPointerMotion();
setupClickFeedback();
setupLanguageMotion();
setupContactMotion();
setupScrollMotion();
setupPageDetails();

if (motionAllowed) {
  runHeroSequence();
  setupMarquee();
  setupSignalMotion();
} else {
  showStaticFallback();
}
