(function(e){e.pjaxTransition=function(t){if(!e.support.pjax)return;var n={container:".pjax-transition-container",linkSelector:"a",transition:!1,beforeTransition:!1,duration:500,animateHistory:!1,loadWhileAnimating:!1};t=e.extend({},n,t),t.transition||(t.duration/=2,t.transition=function(){this.next.css("opacity",0).appendTo(this.current.parent()),this.current.remove(),this.fire("start"),this.next.animate({opacity:1},t.duration,e.proxy(function(){this.done()},this))},t.beforeTransition=function(){this.current.fadeOut(t.duration,e.proxy(function(){this.continue()},this))});var r=e(t.container+":first");r.addClass("pjax-container-current"),e("<script />").attr("id","pjax-container-staging").attr("type","text/html").html(e(".pjax-container-current").clone()).appendTo("body");var i={ready:!1,context:r.parent(),scriptTag:!1,fire:function(e){this.context.trigger("pjax:transition:"+e)},"continue":function(){this.ready&&this.next?(e(window).scrollTop(0),this.next.addClass("pjax-container-current"),t.transition.apply(this,[t])):this.ready=!0},done:function(){this.insertScripts(),e(".pjax-container-current").find("iframe").each(function(){e(this).replaceWith(e(this))}),this.fire("end"),this.ready=!1,this.next=!1},insertScripts:function(){this.scriptTag&&(this.next.append(this.scriptTag),this.scriptTag=!1)}},s=!1;e(document).on("pjax:popstate",function(){s=!0}),e(document).on("pjax:start",function(){i.current=e(".pjax-container-current:first"),i.fire("begin"),typeof t.beforeTransition=="function"&&t.loadWhileAnimating?t.beforeTransition.apply(i,[t]):i.ready=!0}),e(document).on("pjax:success pjax:end",function(n,r,o){if(n.type==="pjax:end"&&!s)return;s=!1,setTimeout(function(){i.next=e("#pjax-container-staging").find(t.container).clone();var r=i.next.find("script");r.length?(i.scriptTag=e("<script/>"),r.each(function(){i.scriptTag.append(e(this).html())}),r.remove()):i.scriptTag=!1,n.type==="pjax:end"&&!t.animateHistory?(i.fire("beforeRestore"),i.next.addClass("pjax-container-current"),i.current.replaceWith(i.next),i.done(),i.fire("restore")):t.loadWhileAnimating||typeof t.beforeTransition!="function"?i.continue():t.beforeTransition.apply(i,[t])},0)}),e(document).pjax(t.linkSelector,"#pjax-container-staging",{scrollTo:!1})}})(jQuery);