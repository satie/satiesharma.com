(function(e){typeof module=="function"?module.exports=e(this.jQuery||require("jquery")):typeof define=="function"&&define.amd?define(["jquery"],function(t){return e(t)}):this.NProgress=e(this.jQuery)})(function(e){function r(e,t,n){return e<t?t:e>n?n:e}function i(e){return(-1+e)*100}function s(e,t,r){var s;return n.positionUsing==="translate3d"?s={transform:"translate3d("+i(e)+"%,0,0)"}:n.positionUsing==="translate"?s={transform:"translate("+i(e)+"%,0)"}:s={"margin-left":i(e)+"%"},s.transition="all "+t+"ms "+r,s}var t={};t.version="0.1.2";var n=t.settings={minimum:.08,easing:"ease",positionUsing:"",speed:200,trickle:!0,trickleRate:.02,trickleSpeed:800,showSpinner:!0,template:'<div class="bar" role="bar"><div class="peg"></div></div><div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'};return t.configure=function(t){return e.extend(n,t),this},t.status=null,t.set=function(e){var i=t.isStarted();e=r(e,n.minimum,1),t.status=e===1?null:e;var o=t.render(!i),u=o.find('[role="bar"]'),a=n.speed,f=n.easing;return o[0].offsetWidth,o.queue(function(r){n.positionUsing===""&&(n.positionUsing=t.getPositioningCSS()),u.css(s(e,a,f)),e===1?(o.css({transition:"none",opacity:1}),o[0].offsetWidth,setTimeout(function(){o.css({transition:"all "+a+"ms linear",opacity:0}),setTimeout(function(){t.remove(),r()},a)},a)):setTimeout(r,a)}),this},t.isStarted=function(){return typeof t.status=="number"},t.start=function(){t.status||t.set(0);var e=function(){setTimeout(function(){if(!t.status)return;t.trickle(),e()},n.trickleSpeed)};return n.trickle&&e(),this},t.done=function(e){return!e&&!t.status?this:t.inc(.3+.5*Math.random()).set(1)},t.inc=function(e){var n=t.status;return n?(typeof e!="number"&&(e=(1-n)*r(Math.random()*n,.1,.95)),n=r(n+e,0,.994),t.set(n)):t.start()},t.trickle=function(){return t.inc(Math.random()*n.trickleRate)},function(){var e=0,n=0;t.promise=function(r){return!r||r.state()=="resolved"?this:(n==0&&t.start(),e++,n++,r.always(function(){n--,n==0?(e=0,t.done()):t.set((e-n)/e)}),this)}}(),t.render=function(r){if(t.isRendered())return e("#nprogress");e("html").addClass("nprogress-busy");var s=e("<div id='nprogress'>").html(n.template),o=r?"-100":i(t.status||0);return s.find('[role="bar"]').css({transition:"all 0 linear",transform:"translate3d("+o+"%,0,0)"}),n.showSpinner||s.find('[role="spinner"]').remove(),s.appendTo(document.body),s},t.remove=function(){e("html").removeClass("nprogress-busy"),e("#nprogress").remove()},t.isRendered=function(){return e("#nprogress").length>0},t.getPositioningCSS=function(){var e=document.body.style,t="WebkitTransform"in e?"Webkit":"MozTransform"in e?"Moz":"msTransform"in e?"ms":"OTransform"in e?"O":"";return t+"Perspective"in e?"translate3d":t+"Transform"in e?"translate":"margin"},t});