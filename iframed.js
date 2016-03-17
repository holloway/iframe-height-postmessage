(function(){
  "use strict";

  var body = document.body,
      html = document.documentElement,
      heightMessagers = {},
      previousHeight;

  function heightMessager(){
    var height = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);

    if(height === previousHeight) return window.requestAnimationFrame(heightMessager);

    if(!window.parent) return;

    for(var key in heightMessagers){
      if(heightMessagers.hasOwnProperty(key)){
        window.parent.postMessage(JSON.stringify({
          id:     key,
          height: height
        }), heightMessagers[key]);
      }
    }

    previousHeight = height;

    window.requestAnimationFrame(heightMessager);
  }

  // http://paulirish.com/2011/requestanimationframe-for-smart-animating/
  // http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
  // requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel
  // MIT license
  (function() {
      var lastTime = 0;
      var vendors = ['ms', 'moz', 'webkit', 'o'];
      for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
          window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
          window.cancelAnimationFrame  = window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
      }
      if (!window.requestAnimationFrame)
          window.requestAnimationFrame = function(callback, element) {
              var currTime = new Date().getTime(),
                  timeToCall = Math.max(0, 16 - (currTime - lastTime)),
                  id = window.setTimeout(function() { callback(currTime + timeToCall); }, timeToCall);
              lastTime = currTime + timeToCall;
              return id;
          };

      if (!window.cancelAnimationFrame)
          window.cancelAnimationFrame = function(id) {
              clearTimeout(id);
          };
  }());

  window.addIframeHeightMessager = function(id, origin){
    heightMessagers[id] = origin;
    heightMessager();
  };


}());