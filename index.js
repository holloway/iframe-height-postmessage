(function(){
  "use strict";

  var iframeListeners = {},
      wildcardDomain = '*',
      byId = {};

  function receiveMessage(e){
    var origin = e.origin || e.originalEvent.origin, // For Chrome
        data   = e.data,
        iframeListener;

    if(Object.prototype.toString.call(e.data) === "[object String]"){ // IE8/9 and Firefox 6 and lesser only support strings
      try {
        data = JSON.parse(data);
      } catch(err){
        return consoleWarn("Received invalid JSON message from " + origin + " of ", data, err);
      }
    }

    if(!data.id || !data.height) return consoleWarn("Received invalid data message from " + origin + " of ", data);

    if(!iframeListeners.hasOwnProperty(data.id)) return consoleWarn("Received request to size iframe that hasn't been configured to support it from " + origin + " of ", data);

    iframeListener = iframeListeners[data.id];

    if(iframeListener.whitelistDomains.indexOf(wildcardDomain) === -1 && iframeListener.whitelistDomains.indexOf(origin) === -1) return consoleWarn("Received request to size iframe from domain that wasn't whitelisted. Was from " + origin + " but we support these domains ", iframeListener.whitelistDomains, ". Message was", data);

    data.height = parseFloat(data.height);

    if(iframeListener.minimumHeight){
      data.height = data.height < iframeListener.minimumHeight ? iframeListener.minimumHeight : data.height;
    }

    if(iframeListener.maximumHeight){
      data.height = data.height > iframeListener.maximumHeight ? iframeListener.maximumHeight : data.height;
    }

    if(!byId.hasOwnProperty(data.id)) byId[data.id] = document.getElementById(data.id);

    if(!byId[data.id]) return consoleWarn("Can't find element by id #" + data.id);

    byId[data.id].style.height = data.height + "px";
  }

  window.addEventListener("message", receiveMessage, false);

  window.addIframeHeightListener = function(id, whitelistDomains, minimumHeight, maximumHeight){
    iframeListeners[id] = {
      whitelistDomains: whitelistDomains || [],
      minimumHeight:    minimumHeight,
      maximumHeight:    maximumHeight
    };
  };

  function consoleWarn(){
    if(!console) return;
    if(console.warn) {
      console.warn.apply(console, arguments);
    } else {
      console.log.apply(console, arguments);
    }
  }

}());