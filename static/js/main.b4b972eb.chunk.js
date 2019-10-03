(window["webpackJsonpxc-live-viewer"]=window["webpackJsonpxc-live-viewer"]||[]).push([[0],{101:function(e,t,n){e.exports=n(157)},128:function(e,t,n){},152:function(e,t,n){},157:function(e,t,n){"use strict";n.r(t);var a=n(0),r=n.n(a),i=n(9),l=n.n(i),o=n(7),s=n(209),c=n(80),u=n.n(c),f=n(206),h=n(207),g=n(91),d=n.n(g),b=n(90),m=n.n(b),p=n(89),v=n.n(p),y=(n(128),null);var E=function(){var e=Object(a.useState)({ready:!1,error:!1}),t=Object(o.a)(e,2),n=t[0],r=t[1];return Object(a.useEffect)((function(){null===y&&(y=new Promise((function(e,t){console.log("Loading Google Maps API ...");var n=document.createElement("script");n.src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBCrP5uoEJXfEvz8f_y1HgzQnqUGHz0Aak",n.async=!0,n.addEventListener("load",(function(){return e(!0)})),n.addEventListener("error",(function(){return e(!1)})),document.body.appendChild(n)}))),y.then((function(e){e?(console.log("Google Maps API loaded."),r({ready:!0,error:!1})):(console.log("Error: Cannot load Google Maps API."),r({ready:!1,error:!0}))}))}),[]),[n.ready,n.error,n.ready?window.google:null]},O=n(189),k=n(192),_=n(191),A=n(82),w=n.n(A),S=Object(O.a)((function(e){return{progress:{margin:e.spacing(2)}}})),I=function(e){var t=e.message,n=e.hideIf,a=e.subRef,i=S();return r.a.createElement(s.a,{width:"100%",height:"100%",display:n?"none":"flex",alignItems:"center",justifyContent:"center",ref:a},r.a.createElement(s.a,{textAlign:"center"},r.a.createElement(_.a,{className:i.progress}),r.a.createElement(k.a,null,t)))},C=function(e){var t=e.message,n=e.hideIf,a=S();return r.a.createElement(s.a,{width:"100%",height:"100%",display:n?"none":"flex",alignItems:"center",justifyContent:"center"},r.a.createElement(s.a,{textAlign:"center"},r.a.createElement(w.a,{fontSize:"large",color:"error",className:a.progress}),r.a.createElement(k.a,{color:"error"},t)))},j=n(83),T=n(10),N=n(15),P=function e(t,n){var r=this;Object(T.a)(this,e),this.getValue=function(){var e=JSON.parse(localStorage.getItem(r.key));return null===e?r.initialValue:e},this._notifyAll=function(){var e=r.getValue(),t=!0,n=!1,a=void 0;try{for(var i,l=r.callbacks[Symbol.iterator]();!(t=(i=l.next()).done);t=!0){(0,i.value)(e)}}catch(o){n=!0,a=o}finally{try{t||null==l.return||l.return()}finally{if(n)throw a}}},this.registerCallback=function(e){r.callbacks.includes(e)||r.callbacks.push(e)},this.unregisterCallback=function(e){var t=r.callbacks.indexOf(e);t>=0&&r.callbacks.splice(t,1)},this.setValue=function(e){null==e?localStorage.removeItem(r.key):localStorage.setItem(r.key,JSON.stringify(e)),r._notifyAll()},this.use=function(){var e=Object(a.useState)(r.getValue),t=Object(o.a)(e,2),n=t[0],i=t[1];return Object(a.useEffect)((function(){var e=function(e){i(e)};return r.registerCallback(e),function(){return r.unregisterCallback(e)}}),[]),[n,r.setValue]},this.key=t,this.initialValue=n,this.callbacks=[]},D=function(e,t){return new P(e,t)},L={PATH_LENGTH:"PATH_LENGTH",FULL_PATHS:"FULL_PATHS",LOW_LATENCY:"LOW_LATENCY",ANIMATION_DELAY:"ANIMATION_DELAY",FPS_LIMIT:"FPS_LIMIT",FPS_RATE:"FPS_RATE"},F=function(e,t){return D("SETTINGS_"+e,t)},x={PATH_LENGTH:F(L.PATH_LENGTH,900),FULL_PATHS:F(L.FULL_PATHS,!1),LOW_LATENCY:F(L.LOW_LATENCY,!1),ANIMATION_DELAY:F(L.ANIMATION_DELAY,80),FPS_LIMIT:F(L.FPS_LIMIT,!0),FPS_RATE:F(L.FPS_RATE,10)},V=function(e){return x[e]},M=function(){function e(t,n,a){var r=this;Object(T.a)(this,e),this.formatSubscribedFlights=function(){var e=V(L.PATH_LENGTH).getValue(),t=V(L.FULL_PATHS).getValue(),n=null;if(!t){var a=new Date(Date.now()-1e3*e);a.setMilliseconds(0),n=a.toISOString()}return r.subscribedFlights.map((function(e){return{flightUuid:e,start:n}}))},this.refreshSubscribedFlights=function(){r.sock.readyState===WebSocket.OPEN&&r.connected&&r.sock.send(JSON.stringify({tag:"WebFollow",contents:r.formatSubscribedFlights()}))},this.setSubscribedFlights=function(e){r.subscribedFlights=e,r.refreshSubscribedFlights()},this.onOpen=function(){r.handleReset(),console.log("WebSocket: Open!"),r.setConnectionState(ne.ESTABLISHED),r.connected=!0,r.sock.send(JSON.stringify({tag:"WebFilterArea",area:[{lat:-90,lon:-180},{lat:90,lon:180}]})),r.sock.send(JSON.stringify({tag:"WebFilterContest",contents:"alpha9999"})),r.sock.send(JSON.stringify({tag:"WebFollow",contents:r.formatSubscribedFlights()}))},this.onMessage=function(e){console.log("WebSocket: Message!"),r.setConnectionState(ne.ACTIVE);var t=JSON.parse(e.data);clearTimeout(r.watchdog),r.watchdog=setTimeout((function(){r.setConnectionState(ne.INACTIVE)}),7e4),r.processMessage(t)},this.onClose=function(e){r.connected=!1,console.log("WebSocket: Close!"),r.setConnectionState(ne.NO_CONNECTION),setTimeout(r.connect.bind(r),1e3)},this.onError=function(e){r.connected=!1,console.log("WebSocket: Error!")},this.handleReset=function(){console.log("TODO: handle reset!")},this.processMessage=function(e){if("tag"in e)switch(e.tag){case"LiveFlightInfos":r.dispatchInfoMessage(e.contents);break;case"LiveFlightChunk":r.dispatchTracklogMessage(e);break;default:console.warn("Warning: Unknown message tag '".concat(e.tag,"'!"),e)}else console.warn("Warning: Invalid message format!",e)},this.setConnectionState=t,this.dispatchInfoMessage=n,this.dispatchTracklogMessage=a,this.subscribedFlights=[],this.connect(),this.connected=!1,V(L.PATH_LENGTH).registerCallback(this.refreshSubscribedFlights),V(L.FULL_PATHS).registerCallback(this.refreshSubscribedFlights)}return Object(N.a)(e,[{key:"connect",value:function(){"WebSocket"in window?(this.connected=!1,this.setConnectionState(ne.CONNECTING),this.sock=new WebSocket("wss://live.xcontest.org/websock/webclient"),this.sock.onopen=this.onOpen,this.sock.onmessage=this.onMessage,this.sock.onclose=this.onClose,this.sock.onerror=this.onError):(this.setConnectionState(ne.ERROR),alert("WebSocket NOT supported by your Browser!"))}}]),e}(),R=n(11);function W(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function H(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?W(n,!0).forEach((function(t){Object(R.a)(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):W(n).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}var z=D("chosen-pilots",{});var G=function(e,t,n){return null===t?e:null===e?t:(1-n)*e+n*t},U=function(){function e(t){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:function(e,t){return t-e},a=arguments.length>2&&void 0!==arguments[2]?arguments[2]:function(e){return null===e};Object(T.a)(this,e),this.computeDiff=n,this.isInvalid=a,this.old_val=null,this.old_t=null,this.running_avg=null,this.smoothingFactor=t}return Object(N.a)(e,[{key:"update",value:function(e,t){if(null===this.old_val||null===e||null===this.old_t||null===t||this.isInvalid(this.old_val)||this.isInvalid(e)||this.old_t===this.new_t)return this.old_val=e,this.old_t=t,null;var n=t-this.old_t,a=this.computeDiff(this.old_val,e)/n,r=Math.pow(this.smoothingFactor,n);return null===this.running_avg?this.running_avg=a:this.running_avg=r*this.running_avg+(1-r)*a,this.old_val=e,this.old_t=t,this.running_avg}},{key:"reset",value:function(){this.old_val=null,this.old_t=null,this.running_avg=null}}]),e}(),Y=n(59),B=function(e,t,n){if(t<1)return 0;for(var a=-1,r=t,i=0;a<r-1;)n(i=(a+r)/2|0)<e?a=i:r=i;return r},J=function(e){return Math.round(Date.parse(e)/1e3)},q=function(){function e(){var t=this;Object(T.a)(this,e),this.at=function(e){return t.data[e]},this.findBisect=function(e){return B(e,t.data.length,(function(e){return t.data[e].t}))},this.findForwardSwipe=function(e,n){for(var a=n;a<t.data.length&&t.data[a].t<e;)a+=1;return a},this.data=[],this.counter_gpsVario=new U(.7),this.counter_baroVarion=new U(.7),this.counter_velocity=new U(.7,(function(e,t){return Object(Y.getDistance)(e,t,.01)}),(function(){return!1}))}return Object(N.a)(e,[{key:"clear",value:function(){this.data=[],this.counter_gpsVario=new U(.7),this.counter_baroVarion=new U(.7),this.counter_velocity=new U(.7,(function(e,t){return Object(Y.getDistance)(e,t,.01)}),(function(){return!1}))}},{key:"isAfterLastElement",value:function(e){return this.data.length<=0||this.data[this.data.length-1].t<e}},{key:"append",value:function(e){var t=!0,n=!1,a=void 0;try{for(var r,i=e[Symbol.iterator]();!(t=(r=i.next()).done);t=!0){var l=r.value,o=J(l.timestamp),s={lat:l.lat,lng:l.lon},c=0===l.baroAlt?null:l.baroAlt,u=0===l.gpsAlt?null:l.gpsAlt,f=this.counter_gpsVario.update(u,o),h=this.counter_baroVarion.update(c,o),g=this.counter_velocity.update(s,o),d={baroAlt:c,gpsAlt:u,elevation:l.elevation,pos:s,gpsVario:f,baroVario:h,velocity:g,t:o};this.data.push(d)}}catch(b){n=!0,a=b}finally{try{t||null==i.return||i.return()}finally{if(n)throw a}}}},{key:"replace",value:function(e){this.clear(),this.append(e)}},{key:"insert",value:function(e){var t=[],n=!0,a=!1,r=void 0;try{for(var i,l=e[Symbol.iterator]();!(n=(i=l.next()).done);n=!0){var o=i.value,s=J(o.timestamp),c={lat:o.lat,lng:o.lon},u={baroAlt:0===o.baroAlt?null:o.baroAlt,gpsAlt:0===o.gpsAlt?null:o.gpsAlt,elevation:o.elevation,pos:c,gpsVario:null,baroVario:null,velocity:null,t:s};t.push(u)}}catch(w){a=!0,r=w}finally{try{n||null==l.return||l.return()}finally{if(a)throw r}}var f=this.data;this.data=[];for(var h=0,g=0;!(h>=f.length&&g>=t.length);)if(h>=f.length)this.data.push(t[g]),g+=1;else if(g>=t.length)this.data.push(f[h]),h+=1;else{var d=f[h],b=t[g];b.t<d.t?(this.data.push(b),g+=1):d.t<b.t?(this.data.push(d),h+=1):(this.data.push(b),h+=1,g+=1)}this.counter_gpsVario.reset(),this.counter_baroVarion.reset(),this.counter_velocity.reset();var m=!0,p=!1,v=void 0;try{for(var y,E=this.data[Symbol.iterator]();!(m=(y=E.next()).done);m=!0){var O=y.value,k=this.counter_gpsVario.update(O.gpsAlt,O.t),_=this.counter_baroVarion.update(O.baroAlt,O.t),A=this.counter_velocity.update(O.pos,O.t);O.gpsVario=k,O.baroVario=_,O.velocity=A}}catch(w){p=!0,v=w}finally{try{m||null==E.return||E.return()}finally{if(p)throw v}}}},{key:"length",get:function(){return this.data.length}}]),e}();function X(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}var Q=function e(){var t=this;Object(T.a)(this,e),this.reset=function(){t.currentArrayPos=null,t.mapsPath=[]},this.currentArrayPos=null,this.mapsPath=[]},Z=function(){function e(){Object(T.a)(this,e)}return Object(N.a)(e,null,[{key:"takeData",value:function(e){return{baroAlt:e.baroAlt,gpsAlt:e.gpsAlt,elevation:e.elevation,pos:{lat:e.pos.lat,lng:e.pos.lng},gpsVario:e.gpsVario,baroVario:e.baroVario,velocity:e.velocity}}},{key:"blendData",value:function(e,t,n){return{baroAlt:G(e.baroAlt,t.baroAlt,n),gpsAlt:G(e.gpsAlt,t.gpsAlt,n),elevation:G(e.elevation,t.elevation,n),pos:{lat:G(e.pos.lat,t.pos.lat,n),lng:G(e.pos.lng,t.pos.lng,n)},gpsVario:G(e.gpsVario,t.gpsVario,n),baroVario:G(e.baroVario,t.baroVario,n),velocity:G(e.velocity,t.velocity,n)}}},{key:"blendDataSpline",value:function(e,t,n,a,r){return null}}]),e}();Z.fallbackData=function(e){return{baroAlt:e.lastFix.baroAlt,gpsAlt:e.lastFix.gpsAlt,elevation:e.lastFix.elevation,pos:{lat:e.lastFix.lat,lng:e.lastFix.lon},gpsVario:null,baroVario:null,velocity:null}};var $=function e(t){var n=this;Object(T.a)(this,e),this.updateInfos=function(e){n.landed|=e.landed,n.flightInfos=e,n.flightInfoData.replace(e.track),n.flightInfoDataCache.reset()},this.updateData=function(e){if(!(e.length<1)){var t=J(e[0].timestamp);n.liveData.isAfterLastElement(t)?n.liveData.append(e):(n.liveData.insert(e),n.liveDataCache.reset()),console.log("Animation updated.",n.liveData)}},this.getInterpolatedData=function(e,t,n){if(e.length<1)return null;null===t.currentArrayPos?t.currentArrayPos=e.findBisect(n):t.currentArrayPos=e.findForwardSwipe(n,t.currentArrayPos);var a=null,r=!1,i=!1;if(t.currentArrayPos<=0)a=Z.takeData(e.at(0)),i=!0;else if(t.currentArrayPos>=e.length)a=Z.takeData(e.at(e.length-1)),r=!0;else{var l=e.at(t.currentArrayPos-1),o=e.at(t.currentArrayPos),s=(n-l.t)/(o.t-l.t);a=Z.blendData(l,o,s)}return[a,i,r]},this.getFallbackData=function(){return[Z.fallbackData(n.flightInfos),!1,n.flightInfos.landed]},this.updateAnimation=function(e,t){var a=e/1e3,r=n.getInterpolatedData(n.liveData,n.liveDataCache,a);r||(r=n.getInterpolatedData(n.flightInfoData,n.flightInfoDataCache,a)),r||(r=n.getFallbackData());var i=r,l=Object(o.a)(i,3);return function(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?X(n,!0).forEach((function(t){Object(R.a)(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):X(n).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}({},l[0],{startOfTrack:l[1],endOfTrack:l[2],landed:n.landed})},this.liveData=new q,this.liveDataCache=new Q,this.flightInfos=null,this.flightInfoData=new q,this.flightInfoDataCache=new Q,this.landed=t.landed,this.updateInfos(t)},K=function e(){var t=this,n=arguments.length>0&&void 0!==arguments[0]?arguments[0]:20;Object(T.a)(this,e),this.get=function(e,n){var a=e+t.offset,r=a-n;return(r>t.tolerance||r<-t.tolerance)&&(t.offset-=r,a=e+t.offset),a},this.offset=0,this.tolerance=n};var ee=function e(t){var n=this;Object(T.a)(this,e),this.animationLoop=function(e){var t=Date.now(),a=n._highPrecisionTimeSync.get(e,t)-1e3*n._setting_timeOffset,r={};Object.keys(n._subscribedPilots).forEach((function(e){if(e in n._pilotInfos){var t=n._pilotInfos[e].flightId;if(t in n._flightAnimations){var i=n._flightAnimations[t];r[e]=i.updateAnimation(a,n._setting_lowLatencyMode)}}})),n._submitAnimationFrame(r),requestAnimationFrame(n.animationLoop)},this._submitAnimationFrame=function(e){n._currentAnimationData=e;var t=!0,a=!1,r=void 0;try{for(var i,l=n._callbacks[Symbol.iterator]();!(t=(i=l.next()).done);t=!0){(0,i.value)(e)}}catch(o){a=!0,r=o}finally{try{t||null==l.return||l.return()}finally{if(a)throw r}}},this.setSubscribedPilots=function(e){n._subscribedPilots=e,n._updateImportantFlights()},this.pushNewInfo=function(e){console.log("newInfo: ",e),n._pilotInfos=e,n._updateImportantFlights(),Object.values(e).forEach((function(e){var t=e.flightId;t in n._flightAnimations&&n._flightAnimations[t].updateInfos(e)}))},this.pushNewData=function(e,t){console.log("newTrackdata: ",e,t),e in n._flightAnimations&&n._flightAnimations[e].updateData(t)},this.registerCallback=function(e){n._callbacks.includes(e)||n._callbacks.push(e)},this.unregisterCallback=function(e){var t=n._callbacks.indexOf(e);t>=0&&n._callbacks.splice(t,1)},this.useAnimatedData=function(){var e=Object(a.useState)(n._currentAnimationData),t=Object(o.a)(e,2),r=t[0],i=t[1];return Object(a.useEffect)((function(){var e=function(e){i(e)};return n.registerCallback(e),function(){return n.unregisterCallback(e)}}),[]),r},this._updateImportantFlights=function(){var e={};Object.values(n._pilotInfos).filter((function(e){return e.info.user.username in n._subscribedPilots})).forEach((function(t){e[t.flightId]=t}));var t=new Set(Object.keys(e)),a=[];for(var r in n._flightAnimations)r in e||a.push(r);for(var i=0,l=a;i<l.length;i++){var s=l[i];console.log("Removing flightAnimation of '"+s+"' ..."),delete n._flightAnimations[s]}Object.entries(e).forEach((function(e){var t=Object(o.a)(e,2),a=t[0],r=t[1];a in n._flightAnimations||(n._flightAnimations[a]=new $(r))})),function(e,t){if(e.size!==t.size)return!1;var n=!0,a=!1,r=void 0;try{for(var i,l=e[Symbol.iterator]();!(n=(i=l.next()).done);n=!0){var o=i.value;if(!t.has(o))return!1}}catch(s){a=!0,r=s}finally{try{n||null==l.return||l.return()}finally{if(a)throw r}}return!0}(t,n._subscribedFlights)||(console.log("Changing flight subscribtion: ",n._subscribedFlights,t),n._setSubscribedFlightsCallback(t))},this._currentAnimationData={},this._callbacks=[],this._subscribedPilots=z.getValue(),this._subscribedFlights=new Set,this._pilotInfos={},this._flightAnimations={},this._highPrecisionTimeSync=new K;var r=V(L.ANIMATION_DELAY),i=V(L.LOW_LATENCY);this._setting_timeOffset=r.getValue(),this._setting_lowLatencyMode=i.getValue(),r.registerCallback((function(e){n._setting_timeOffset=e})),i.registerCallback((function(e){n._setting_lowLatencyMode=e})),this._setSubscribedFlightsCallback=function(e){n._subscribedFlights=e,t(Array.from(e))},z.registerCallback(this.setSubscribedPilots),requestAnimationFrame(this.animationLoop)},te=function e(t){var n=this;Object(T.a)(this,e),this.set=function(e){n._callbackData=e;var t=!0,a=!1,r=void 0;try{for(var i,l=n._callbacks[Symbol.iterator]();!(t=(i=l.next()).done);t=!0){(0,i.value)(e)}}catch(o){a=!0,r=o}finally{try{t||null==l.return||l.return()}finally{if(a)throw r}}},this.getValue=function(){return n._callbackData},this.registerCallback=function(e){n._callbacks.includes(e)||n._callbacks.push(e)},this.unregisterCallback=function(e){var t=n._callbacks.indexOf(e);t>=0&&n._callbacks.splice(t,1)},this.use=function(){var e=Object(a.useState)(n._callbackData),t=Object(o.a)(e,2),r=t[0],i=t[1];return Object(a.useEffect)((function(){return n.registerCallback(i),function(){return n.unregisterCallback(i)}}),[]),r},this._callbacks=[],this._callbackData=t},ne={CONNECTING:"connecting",ERROR:"error",ESTABLISHED:"established",ACTIVE:"active",INACTIVE:"inactive",NO_CONNECTION:"no connection",NO_INFORMATION:"no information"},ae=function e(){var t=this;Object(T.a)(this,e),this.setSubscribedFlights=function(e){t.socket.setSubscribedFlights(e)},this.onConnectionStateChanged=function(e){t.connectionState.set(e)},this.onInfoMessageReceived=function(e){t.pilots={};var n=!0,a=!1,r=void 0;try{for(var i,l=e[Symbol.iterator]();!(n=(i=l.next()).done);n=!0){var s=i.value,c=Object(o.a)(s,2),u=c[0],f=c[1];f.overriden||(f.flightId=u,t.pilots[f.info.user.username]=f)}}catch(h){a=!0,r=h}finally{try{n||null==l.return||l.return()}finally{if(a)throw r}}t.animation.pushNewInfo(t.pilots),t.pilotInfos.set(t.pilots)},this.getPilotInfos=function(){return t.pilots},this.onTracklogMessageReceived=function(e){t.animation.pushNewData(e.flightUuid,e.trackChunk)},this.pilots=[],this.connectionState=new te(ne.NO_INFORMATION),this.pilotInfos=new te([]),this.socket=new M(this.onConnectionStateChanged,this.onInfoMessageReceived,this.onTracklogMessageReceived),this.animation=new ee(this.setSubscribedFlights)},re=null,ie=function(){return re||(re=new ae),re},le=function e(t,n){var a=this;Object(T.a)(this,e),this.cleanupOldMarkers=function(e){var t=[];for(var n in a.markers)n in e||t.push(n);for(var r=0,i=t;r<i.length;r++){var l=i[r];a.markers[l].setMap(null),delete a.markers[l]}},this.update=function(e){var t=ie().getPilotInfos();a.cleanupOldMarkers(e),Object.entries(e).forEach((function(e){var n=Object(o.a)(e,2),r=n[0],i=n[1];if(r in t){var l=t[r],s={lat:i.pos.lat,lng:i.pos.lng};r in a.markers||(a.markers[r]=new a.google.maps.Marker({map:a.map,position:s,title:l.info.user.fullname})),a.markers[r].setPosition(s)}}))},this.map=t,this.google=n,this.markers={}},oe=function(){var e=E(),t=Object(o.a)(e,3),n=t[0],i=t[1],l=t[2],c=Object(a.useRef)(),u=Object(a.useState)(null),f=Object(o.a)(u,2),h=f[0],g=f[1];return Object(a.useLayoutEffect)((function(){n&&!h&&g(new l.maps.Map(c.current,{center:{lat:46.509012,lng:11.827984},mapTypeId:"terrain",zoom:12,maxZoom:15,disableDefaultUI:!0,scaleControl:!0,fullscreenControl:!0,styles:j}))}),[n,h,l,c]),Object(a.useEffect)((function(){if(h&&l){var e=new le(h,l).update;return ie().animation.registerCallback(e),function(){ie().animation.unregisterCallback(e)}}}),[h,l]),r.a.createElement(r.a.Fragment,null,r.a.createElement(s.a,{width:"100%",height:"100%",display:n?"block":"none",ref:c}),r.a.createElement(I,{message:"Loading Maps ...",hideIf:n||i}),r.a.createElement(C,{message:"Unable to load map!",hideIf:!i}))},se=n(202),ce=n(26),ue=n(84),fe=n.n(ue),he=n(193),ge=n(194),de=n(12),be=n(211),me=n(208),pe=n(200),ve=n(201),ye=n(195),Ee=n(196),Oe=n(197),ke=n(198),_e=n(199),Ae=[{id:"name",label:"Name",minWidth:0,render:function(e){return r.a.createElement(r.a.Fragment,null,e.user.fullname,r.a.createElement(k.a,{component:"span",variant:"caption",color:"textSecondary",style:{paddingLeft:".3em"}},"[",e.user.username,"]"))}},{id:"country",label:"Country",minWidth:"4em",align:"right",render:function(e){return r.a.createElement(r.a.Fragment,null,e.user.nationality.iso,r.a.createElement(s.a,{fontSize:"large",marginLeft:"4px",boxShadow:1,style:{verticalAlign:"middle"},className:"flag-icon flag-icon-"+e.user.nationality.iso.toLowerCase()}))}}];var we=function(e){var t=Object(ce.a)(),n=ie().pilotInfos.use(),i=Object(a.useState)([]),l=Object(o.a)(i,2),c=l[0],u=l[1],f=Object(a.useState)(""),h=Object(o.a)(f,2),g=h[0],d=h[1],b=c.length,m=function(){d(""),u([]),e.onClose()},p=Object(he.a)(t.breakpoints.down("xs")),v=function(e){return""===g||e.toLowerCase().includes(g.toLowerCase())},y=Object.values(n).filter((function(e){return v(e.info.user.username)||v(e.info.user.fullname)}));return 0===y.length&&!/\s/.test(g)&&g.length>0&&y.push({info:{user:{login:null,username:g,fullname:"Offline User",gender:"-",nationality:{iso:"--",name:"--"}},flightId:null}}),r.a.createElement(be.a,{open:e.open,onClose:m,fullScreen:p},r.a.createElement(ge.a,{style:0===b?{}:"light"===t.palette.type?{color:t.palette.secondary.main,backgroundColor:Object(de.d)(t.palette.secondary.light,.85)}:{color:t.palette.text.primary,backgroundColor:t.palette.secondary.dark}},b>0?r.a.createElement(k.a,{component:"div",color:"inherit",variant:"subtitle1"},b," selected"):r.a.createElement(k.a,{component:"div",variant:"h6",id:"tableTitle"},"Add new pilots:")),r.a.createElement(s.a,{paddingLeft:"1em",paddingRight:"1em",paddingTop:"4px"},r.a.createElement(me.a,{margin:"dense",autoComplete:"off",variant:"outlined",id:"search_field",label:"Search",type:"search",fullWidth:!0,onChange:function(e){return d(e.target.value)}})),r.a.createElement(s.a,{flex:"1 1 auto",marginY:"8px",style:{overflowY:"auto"}},r.a.createElement(ye.a,{stickyHeader:!0,size:"small"},r.a.createElement(Ee.a,null,r.a.createElement(Oe.a,null,Ae.map((function(e){return r.a.createElement(ke.a,{key:e.id,align:e.align,style:{minWidth:e.minWidth},component:"th"},e.label)})))),r.a.createElement(_e.a,null,y.map((function(t){var n=t.info.user.username,a=function(e){return-1!==c.indexOf(e)}(n),i=function(t){return-1!==e.alreadyAdded.indexOf(t)}(n),l=i?{filter:"grayscale(100%) opacity(30%)"}:{},o=Ae.map((function(e){return r.a.createElement(ke.a,{key:e.id,align:e.align},r.a.createElement(s.a,{style:l},e.render(t.info)))}));return i?r.a.createElement(Oe.a,{key:n},o):r.a.createElement(Oe.a,{key:n,selected:a,onClick:function(e){return function(e,t){var n=c.indexOf(t),a=[];-1===n?a=a.concat(c,t):0===n?a=a.concat(c.slice(1)):n===c.length-1?a=a.concat(c.slice(0,-1)):n>0&&(a=a.concat(c.slice(0,n),c.slice(n+1))),u(a)}(0,n)}},o)}))))),r.a.createElement(pe.a,null,r.a.createElement(ve.a,{onClick:m,color:"primary"},"Cancel"),r.a.createElement(ve.a,{disabled:0===b,onClick:function(){e.onAddPilots(c),m()},color:"primary"},"Add")))},Se=function(e){var t=ie().animation.useAnimatedData(),n=Object.entries(e.pilots).map((function(n){var a=Object(o.a)(n,2),i=a[0],l=a[1],c=l;null===l&&(c=i);var u=[];if(i in t){var f=t[i];for(var h in f)u.push(r.a.createElement("tr",{key:h},r.a.createElement("td",null,h),r.a.createElement("td",null,(Math.round(100*f[h])/100).toString())))}return r.a.createElement(s.a,{margin:"10px",key:i,onClick:function(){return e.removePilots([i])}},c,r.a.createElement("table",null,r.a.createElement("tbody",null,u)))}));return r.a.createElement(s.a,{height:"100%",style:{overflowY:"auto"}},n)},Ie=function(){var e=Object(ce.a)(),t=Object(a.useState)(!1),n=Object(o.a)(t,2),i=n[0],l=n[1],c=function(){var e=z.use(),t=Object(o.a)(e,2),n=t[0],a=t[1];return[n,function(e){var t=H({},n),r=!1,i=!0,l=!1,o=void 0;try{for(var s,c=e[Symbol.iterator]();!(i=(s=c.next()).done);i=!0){var u=s.value;u in t||(t[u]=null,r=!0)}}catch(f){l=!0,o=f}finally{try{i||null==c.return||c.return()}finally{if(l)throw o}}r&&a(t)},function(e){var t=H({},n),r=!1,i=!0,l=!1,o=void 0;try{for(var s,c=e[Symbol.iterator]();!(i=(s=c.next()).done);i=!0){var u=s.value;u in t&&(delete t[u],r=!0)}}catch(f){l=!0,o=f}finally{try{i||null==c.return||c.return()}finally{if(l)throw o}}r&&a(t)}]}(),u=Object(o.a)(c,3),f=u[0],h=u[1],g=u[2];return r.a.createElement(r.a.Fragment,null,r.a.createElement(Se,{pilots:f,removePilots:g}),r.a.createElement(s.a,{position:"absolute",bottom:e.spacing(2),right:e.spacing(2)},r.a.createElement(se.a,{size:"small",color:"primary",onClick:function(){return l(!0)}},r.a.createElement(fe.a,null))),r.a.createElement(we,{open:i,onClose:function(){return l(!1)},onAddPilots:h,alreadyAdded:Object.keys(f)}))},Ce=n(204),je=n(205),Te=n(212),Ne=n(203),Pe=n(88),De=n.n(Pe),Le=n(86),Fe=n.n(Le),xe=n(85),Ve=n.n(xe),Me=n(87),Re=n.n(Me),We=n(40),He=n.n(We),ze=Object(O.a)((function(e){return{menuButton:{marginRight:e.spacing(2)},popover:{padding:e.spacing(1),align:"right"}}})),Ge=function(e){return r.a.createElement(Ne.a,{anchorOrigin:{vertical:"bottom",horizontal:"right"},badgeContent:r.a.createElement(_.a,{disableShrink:e.disableShrink,color:"secondary",size:15,thickness:10})},e.children)},Ue=function(){var e=ze(),t=ie().connectionState.use(),n=r.a.useRef(),i=Object(a.useState)(null),l=Object(o.a)(i,2),c=l[0],u=l[1];r.a.useLayoutEffect((function(){n.current&&n.current.updatePosition()}),[t,c]);return r.a.createElement("div",null,r.a.createElement(Ce.a,{position:"static"},r.a.createElement(ge.a,null,r.a.createElement(s.a,{clone:!0},r.a.createElement(je.a,{className:e.menuButton,edge:"start",color:"inherit"},r.a.createElement(De.a,null))),r.a.createElement(s.a,{flexGrow:1,clone:!0},r.a.createElement(k.a,{variant:"h6"},"XC Live Viewer")),r.a.createElement(je.a,{edge:"end",color:"inherit",onClick:function(e){return u(e.currentTarget)}},function(){switch(t){case ne.ACTIVE:return r.a.createElement(Ve.a,null);case ne.CONNECTING:return r.a.createElement(Ge,null,r.a.createElement(He.a,null));case ne.ERROR:return r.a.createElement(Fe.a,{color:"error"});case ne.ESTABLISHED:return r.a.createElement(Ge,{disableShrink:!0},r.a.createElement(He.a,null));case ne.INACTIVE:return r.a.createElement(Re.a,null);case ne.NO_CONNECTION:default:return r.a.createElement(He.a,null)}}()))),r.a.createElement(Te.a,{open:Boolean(c),anchorEl:c,onClose:function(){return u(null)},anchorOrigin:{vertical:"bottom",horizontal:"right"},transformOrigin:{vertical:"top",horizontal:"right"},action:n},r.a.createElement(s.a,{className:e.popover},r.a.createElement(k.a,null,t))))};function Ye(){var e=r.a.useState(1),t=Object(o.a)(e,2),n=t[0],a=t[1],i=r.a.useState(0),l=Object(o.a)(i,2),c=l[0],g=l[1],b=function(){g(window.innerHeight)};r.a.useLayoutEffect((function(){return b(),window.addEventListener("resize",b),function(){return window.removeEventListener("resize",b)}}),[]);return r.a.createElement(s.a,{height:c,display:"flex",flexDirection:"column"},r.a.createElement(s.a,{zIndex:100},r.a.createElement(Ue,null)),r.a.createElement(s.a,{flexGrow:1,clone:!0},r.a.createElement(u.a,{disabled:!0,index:n},r.a.createElement(s.a,{width:"100%",height:"100%",position:"relative"},r.a.createElement(oe,null)),r.a.createElement(s.a,{width:"100%",height:"100%",position:"relative"},r.a.createElement(Ie,null)),r.a.createElement(s.a,{width:"100%",height:"100%",position:"relative"},"Item Three"))),r.a.createElement(s.a,{zIndex:100,boxShadow:3},r.a.createElement(f.a,{value:n,onChange:function(e,t){return a(t)},showLabels:!0},r.a.createElement(h.a,{label:"Map",icon:r.a.createElement(v.a,null)}),r.a.createElement(h.a,{label:"Pilots",icon:r.a.createElement(m.a,null)}),r.a.createElement(h.a,{label:"Nearby",icon:r.a.createElement(d.a,null)}))))}var Be=function(){return r.a.createElement("div",{className:"App"},r.a.createElement(Ye,null))};n(152),n(153),Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));n(154).config(),l.a.render(r.a.createElement(Be,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()}))},83:function(e){e.exports=JSON.parse('[{"featureType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"administrative.land_parcel","stylers":[{"visibility":"off"}]},{"featureType":"administrative.neighborhood","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"labels.text","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"labels.text","stylers":[{"visibility":"off"}]}]')}},[[101,1,2]]]);
//# sourceMappingURL=main.b4b972eb.chunk.js.map