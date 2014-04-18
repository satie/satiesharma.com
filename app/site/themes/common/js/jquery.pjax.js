(function(e){function t(t,r,i){var s=this;return this.on("click.pjax",t,function(t){var o=e.extend({},v(r,i));o.container||(o.container=e(this).attr("data-pjax")||s),n(t,o)})}function n(t,n,r){r=v(n,r);var s=t.currentTarget;if(s.tagName.toUpperCase()!=="A")throw"$.fn.pjax or $.pjax.click requires an anchor element";if(t.which>1||t.metaKey||t.ctrlKey||t.shiftKey||t.altKey)return;if(location.protocol!==s.protocol||location.hostname!==s.hostname)return;if(s.hash&&s.href.replace(s.hash,"")===location.href.replace(location.hash,""))return;if(s.href===location.href+"#")return;var o={url:s.href,container:e(s).attr("data-pjax"),target:s},u=e.extend({},o,r),a=e.Event("pjax:click");e(s).trigger(a,[u]),a.isDefaultPrevented()||(i(u),t.preventDefault())}function r(t,n,r){r=v(n,r);var s=t.currentTarget;if(s.tagName.toUpperCase()!=="FORM")throw"$.pjax.submit requires a form element";var o={type:s.method.toUpperCase(),url:s.action,data:e(s).serializeArray(),container:e(s).attr("data-pjax"),target:s};i(e.extend({},o,r)),t.preventDefault()}function i(t){function u(t,r){var i=e.Event(t,{relatedTarget:n});return s.trigger(i,r),!i.isDefaultPrevented()}t=e.extend(!0,{},e.ajaxSettings,i.defaults,t),e.isFunction(t.url)&&(t.url=t.url());var n=t.target,r=d(t.url).hash,s=t.context=m(t.container);t.data||(t.data={}),t.data._pjax=s.selector;var a;t.beforeSend=function(e,n){n.type!=="GET"&&(n.timeout=0),e.setRequestHeader("X-PJAX","true"),e.setRequestHeader("X-PJAX-Container",s.selector);if(!u("pjax:beforeSend",[e,n]))return!1;n.timeout>0&&(a=setTimeout(function(){u("pjax:timeout",[e,t])&&e.abort("timeout")},n.timeout),n.timeout=0),t.requestUrl=d(n.url).href},t.complete=function(e,n){a&&clearTimeout(a),u("pjax:complete",[e,n,t]),u("pjax:end",[e,t])},t.error=function(e,n,r){var i=b("",e,t),s=u("pjax:error",[e,n,r,t]);t.type=="GET"&&n!=="abort"&&s&&o(i.url)},t.success=function(n,a,f){var l=typeof e.pjax.defaults.version=="function"?e.pjax.defaults.version():e.pjax.defaults.version,c=f.getResponseHeader("X-PJAX-Version"),p=b(n,f,t);if(l&&c&&l!==c){o(p.url);return}if(!p.contents){o(p.url);return}i.state={id:t.id||h(),url:p.url,title:p.title,container:s.selector,fragment:t.fragment,timeout:t.timeout},(t.push||t.replace)&&window.history.replaceState(i.state,p.title,p.url),document.activeElement.blur(),p.title&&(document.title=p.title),s.html(p.contents);var v=s.find("input[autofocus], textarea[autofocus]").last()[0];v&&document.activeElement!==v&&v.focus(),w(p.scripts),typeof t.scrollTo=="number"&&e(window).scrollTop(t.scrollTo);if(r!==""){var m=d(p.url);m.hash=r,i.state.url=m.href,window.history.replaceState(i.state,p.title,m.href);var g=e(m.hash);g.length&&e(window).scrollTop(g.offset().top)}u("pjax:success",[n,a,f,t])},i.state||(i.state={id:h(),url:window.location.href,title:document.title,container:s.selector,fragment:t.fragment,timeout:t.timeout},window.history.replaceState(i.state,document.title));var f=i.xhr;f&&f.readyState<4&&(f.onreadystatechange=e.noop,f.abort()),i.options=t;var f=i.xhr=e.ajax(t);return f.readyState>0&&(t.push&&!t.replace&&(T(i.state.id,s.clone().contents()),window.history.pushState(null,"",p(t.requestUrl))),u("pjax:start",[f,t]),u("pjax:send",[f,t])),i.xhr}function s(t,n){var r={url:window.location.href,push:!1,replace:!0,scrollTo:!1};return i(e.extend(r,v(t,n)))}function o(e){window.history.replaceState(null,"","#"),window.location.replace(e)}function l(t){var n=t.state;if(n&&n.container){if(u&&a==n.url)return;if(i.state.id===n.id)return;var r=e(n.container);if(r.length){var s,f=E[n.id];i.state&&(s=i.state.id<n.id?"forward":"back",N(s,i.state.id,r.clone().contents()));var l=e.Event("pjax:popstate",{state:n,direction:s});r.trigger(l);var c={id:n.id,url:n.url,container:r,push:!1,fragment:n.fragment,timeout:n.timeout,scrollTo:!1};f?(r.trigger("pjax:start",[null,c]),n.title&&(document.title=n.title),r.html(f),i.state=n,r.trigger("pjax:end",[null,c])):i(c),r[0].offsetHeight}else o(location.href)}u=!1}function c(t){var n=e.isFunction(t.url)?t.url():t.url,r=t.type?t.type.toUpperCase():"GET",i=e("<form>",{method:r==="GET"?"GET":"POST",action:n,style:"display:none"});r!=="GET"&&r!=="POST"&&i.append(e("<input>",{type:"hidden",name:"_method",value:r.toLowerCase()}));var s=t.data;if(typeof s=="string")e.each(s.split("&"),function(t,n){var r=n.split("=");i.append(e("<input>",{type:"hidden",name:r[0],value:r[1]}))});else if(typeof s=="object")for(key in s)i.append(e("<input>",{type:"hidden",name:key,value:s[key]}));e(document.body).append(i),i.submit()}function h(){return(new Date).getTime()}function p(e){return e.replace(/\?_pjax=[^&]+&?/,"?").replace(/_pjax=[^&]+&?/,"").replace(/[\?&]$/,"")}function d(e){var t=document.createElement("a");return t.href=e,t}function v(t,n){return t&&n?n.container=t:e.isPlainObject(t)?n=t:n={container:t},n.container&&(n.container=m(n.container)),n}function m(t){t=e(t);if(!t.length)throw"no pjax container for "+t.selector;if(t.selector!==""&&t.context===document)return t;if(t.attr("id"))return e("#"+t.attr("id"));throw"cant get selector for pjax container!"}function g(e,t){return e.filter(t).add(e.find(t))}function y(t){return e.parseHTML(t,document,!0)}function b(t,n,r){var i={};i.url=p(n.getResponseHeader("X-PJAX-URL")||r.requestUrl);if(/<html/i.test(t))var s=e(y(t.match(/<head[^>]*>([\s\S.]*)<\/head>/i)[0])),o=e(y(t.match(/<body[^>]*>([\s\S.]*)<\/body>/i)[0]));else var s=o=e(y(t));if(o.length===0)return i;i.title=g(s,"title").last().text();if(r.fragment){if(r.fragment==="body")var u=o;else var u=g(o,r.fragment).first();u.length&&(i.contents=u.contents(),i.title||(i.title=u.attr("title")||u.data("title")))}else/<html/i.test(t)||(i.contents=o);return i.contents&&(i.contents=i.contents.not(function(){return e(this).is("title")}),i.contents.find("title").remove(),i.scripts=g(i.contents,"script[src]").remove(),i.contents=i.contents.not(i.scripts)),i.title&&(i.title=e.trim(i.title)),i}function w(t){if(!t)return;var n=e("script[src]");t.each(function(){var t=this.src,r=n.filter(function(){return this.src===t});if(r.length)return;var i=document.createElement("script");i.type=e(this).attr("type"),i.src=e(this).attr("src"),document.head.appendChild(i)})}function T(e,t){E[e]=t,x.push(e);while(S.length)delete E[S.shift()];while(x.length>i.defaults.maxCacheLength)delete E[x.shift()]}function N(e,t,n){var r,i;E[t]=n,e==="forward"?(r=x,i=S):(r=S,i=x),r.push(t),(t=i.pop())&&delete E[t]}function C(){return e("meta").filter(function(){var t=e(this).attr("http-equiv");return t&&t.toUpperCase()==="X-PJAX-VERSION"}).attr("content")}function k(){e.fn.pjax=t,e.pjax=i,e.pjax.enable=e.noop,e.pjax.disable=L,e.pjax.click=n,e.pjax.submit=r,e.pjax.reload=s,e.pjax.defaults={timeout:650,push:!0,replace:!1,type:"GET",dataType:"html",scrollTo:0,maxCacheLength:20,version:C},e(window).on("popstate.pjax",l)}function L(){e.fn.pjax=function(){return this},e.pjax=c,e.pjax.enable=k,e.pjax.disable=e.noop,e.pjax.click=e.noop,e.pjax.submit=e.noop,e.pjax.reload=function(){window.location.reload()},e(window).off("popstate.pjax",l)}var u=!0,a=window.location.href,f=window.history.state;f&&f.container&&(i.state=f),"state"in window.history&&(u=!1);var E={},S=[],x=[];e.inArray("state",e.event.props)<0&&e.event.props.push("state"),e.support.pjax=window.history&&window.history.pushState&&window.history.replaceState&&!navigator.userAgent.match(/((iPod|iPhone|iPad).+\bOS\s+[1-4]|WebApps\/.+CFNetwork)/),e.support.pjax?k():L()})(jQuery);