/** 
 * Author 岳晓 
 *  
 * 对百度地图的事件扩展，目前扩展了fastclick和longclick, 
 * 解决某些设备click不执行的问题 
 * 解决长按事件在拖动、多触点依然执行的bug 
 * v1.0.0 
 */  
  
(function(){  
    BMap.Map.prototype.on=function(evt,fn,option){  
        var _option = {  
            canBubble:true  
        }  
          
        extend(_option,option)  
          
        if(!evt || !fn) return;  
          
          
        var $this = this;  
        var evtList = ["longtouch","onetouch"];  
        if(inArray(evt,evtList)){  
            MesureEvents[evt]($this,evt,fn,option);  
            $this.getContainer().querySelector("div.BMap_mask").addEventListener(evt,fn);  
        }  
        else{  
            $this.addEventListener(evt,fn);  
            /*function(e){ 
                if(option.canBubble){ 
                    e.domEvent.stopPropagation(); 
                } 
                fn.call(this,e); 
            });*/  
        }  
    };  
      
    var centerAndZoom = BMap.Map.prototype.centerAndZoom;  
      
    BMap.Map.prototype.centerAndZoom  = function(){  
          
        var $this = this;  
        centerAndZoom.apply(this,arguments);  
        if(!$this.hasRegistMyTouch){  
            $this.on("onetouch",function(e){  
                //console.log(e);  
                var event = document.createEvent("MouseEvent");  
                event.initEvent("fastclick",true,true);  
                  
                  
                  
                event.clientX = e.clientX;  
                event.clientY = e.clientY;  
                event.point = e.point;  
                $this.dispatchEvent(event);  
                  
                var event = document.createEvent("MouseEvent");  
                event.initEvent("click",true,true);  
                event.clientX = e.clientX;  
                event.clientY = e.clientY;  
                $this.dispatchEvent(event);  
            });  
            $this.on("longtouch",function(e){  
                //console.log(e);  
                var event = document.createEvent("TouchEvent");  
                event.initEvent("longclick",true,true);  
                event.clientX = e.clientX;  
                event.clientY = e.clientY;  
                event.point = e.point;  
                $this.dispatchEvent(event);  
            });  
            $this.hasRegistMyTouch = true;  
        }  
          
    }  
    var MesureEvents = {  
        onetouch:function($this,evt,fn,data,option){  
            var ismoved;  
            var time = null;  
            var touchLocation = null;  
            var maxTouchesCount = 0;  
              
            var container = $this.getContainer();  
            var mask = container.querySelector("div.BMap_mask");  
            var panes = $this.getPanes();  
              
            $this.addEventListener("touchstart",function(e){  
                  
                var temp = Math.max(maxTouchesCount,e.touches.length);  
                if(temp==1) {  
                    var touch = e.changedTouches[0];  
                      
                    if(isAncestors(touch.target,[panes.floatPane,panes.markerMouseTarget,panes.markerPane],container)) return;  
                      
                    maxTouchesCount = temp;  
                      
                    touchLocation = {  
                        x:touch.clientX,  
                        y:touch.clientY  
                    };  
                    time = new Date().getTime();  
                }  
            });  
            $this.addEventListener("touchmove",function(e){  
                maxTouchesCount = Math.max(maxTouchesCount,e.touches.length);  
                  
                if(maxTouchesCount==1) {  
                    var touch = e.changedTouches[0];  
                      
                    if(isAncestors(touch.target,[panes.floatPane,panes.markerMouseTarget,panes.markerPane],container)) return;  
                      
                      
                    if(Math.abs(touchLocation.x-touch.clientX)>0 && Math.abs(touchLocation.y-touch.clientY)>0){//解决部分手机对touchmove过分“敏感”的问题  
                        ismoved = true;  
                        //console.log("touchmove---");  
                    }  
                    else{  
                        ismoved = false;  
                    }  
                }  
            });  
            $this.addEventListener("touchend",function(e){  
                  
                var touches =e.touches.length;  
                  
                if(touches==0){  
                      
                    var touch = e.changedTouches[0];  
                      
                    if(isAncestors(touch.target,[panes.floatPane,panes.markerMouseTarget,panes.markerPane],container)) return;  
                      
                      
                    var temp = maxTouchesCount;  
                    var tempM = ismoved;  
                    ismoved= false;  
                    maxTouchesCount = 0;  
                    if(temp==1 && !tempM /*&& /BMap_mask/.test(e.srcElement.className)*/ && new Date().getTime()-time<500){  
                          
                        var event = document.createEvent("Event");  
                        event.initEvent("onetouch",true,true);  
                        var touch = e.changedTouches[0];  
                          
                        event.clientX = touch.clientX;  
                        event.clientY = touch.clientY;  
                        event.point =calLngLat($this,event.clientX,event.clientY);  
                        mask.dispatchEvent(event,fn);  
                    }     
                }  
            });  
        },  
        longtouch:function($this,evt,fn,data,option){  
            var ismoved;  
            var time = null;  
            var timeout;  
            var maxTouchesCount = 0;  
            var touchLocation = null;  
            var container = $this.getContainer();  
            var mask = container.querySelector("div.BMap_mask");  
            var panes = $this.getPanes();  
            $this.addEventListener("touchstart",function(e){  
                  
                var temp = Math.max(maxTouchesCount,e.touches.length);  
                if(temp==1) {  
                    var touch = e.changedTouches[0];  
                      
                    if(isAncestors(touch.target,[panes.floatPane,panes.markerMouseTarget,panes.markerPane],container)) return;  
                      
                    maxTouchesCount = temp;  
                      
                    touchLocation = {  
                        x:touch.clientX,  
                        y:touch.clientY  
                    };  
                    time = new Date().getTime();  
                    timeout = setTimeout(function(){  
                          
                        clearTimeout(timeout);  
                        timeout = null;  
                        longtouch(e);  
                    },750);  
                }  
            });  
            $this.addEventListener("touchmove",function(e){  
                maxTouchesCount = Math.max(maxTouchesCount,e.touches.length);  
                if(maxTouchesCount==1) {  
                    var touch = e.changedTouches[0];  
                      
                    if(isAncestors(touch.target,[panes.floatPane,panes.markerMouseTarget,panes.markerPane],container)) return;  
                      
                    //console.log("move:" +touch.clientX +"," + touch.clientY);  
                    if(Math.abs(touchLocation.x-touch.clientX)>=2 && Math.abs(touchLocation.y-touch.clientY)>2){//解决部分手机对touchmove过分“敏感”的问题  
                        ismoved = true;  
                        //console.log("touchmove---");  
                        if(timeout){  
                            clearTimeout(timeout);  
                            timeout = null;  
                        }  
                    }  
                    else{  
                        ismoved = false;  
                    }  
                }  
                else{  
                    if(timeout){  
                        clearTimeout(timeout);  
                        timeout = null;  
                    }  
                }  
            });  
              
            function longtouch(e){  
                var temp = maxTouchesCount;  
                var tempM = ismoved;  
                ismoved= false;  
                maxTouchesCount = 0;  
                if(temp==1 && !tempM){  
                  
                    var event = document.createEvent("Event");  
                    event.initEvent("longtouch",true,true);  
                    var touch = e.changedTouches[0];  
                      
                    event.clientX = touch.clientX;  
                    event.clientY = touch.clientY;  
                    event.point =calLngLat($this,event.clientX,event.clientY);  
                    $this.getContainer().querySelector("div.BMap_mask").dispatchEvent(event);  
                      
                }     
            }  
              
            $this.addEventListener("touchend",function(e){  
                  
                var touches =e.touches.length;  
                  
                if(touches==0){  
                      
                    var touch = e.changedTouches[0];  
                      
                    if(isAncestors(touch.target,[panes.floatPane,panes.markerMouseTarget,panes.markerPane],container)) return;  
                      
                    maxTouchesCount = 0;  
                    ismoved= false;  
                }  
                if(new Date().getTime()-time<1000){  
                    if(timeout){  
                        clearTimeout(timeout);  
                        timeout = null;  
                    }  
                }  
            });  
        }  
    }  
      
    function calLngLat($this,x,y){  
        var container = $this.getContainer();  
        var rect = container.getBoundingClientRect();  
        var y = y - rect.top;  
        var x = x - rect.left;  
        var bounds = $this.getBounds();  
        var lefTop = new BMap.Point(bounds.getSouthWest().lng,bounds.getNorthEast().lat);  
        var lefTopPix = $this.pointToPixel(lefTop);  
        var pix = new BMap.Pixel(lefTopPix.x + x,lefTopPix.y+y);  
        var point = $this.pixelToPoint(pix);  
        return point;  
    }  
      
    function inArray(obj,array){  
        for(x in array){  
            if(obj==array[x]) return true;  
        }  
        return false;  
    }  
      
    function extend(o1,o2){  
        if(o1 && o2){  
            for(x in o2){  
                if(o2.hasOwnProperty(x) && o2[x]!=undefined){  
                    o1[x] = o2[x];  
                }  
            }  
        }  
    }  
      
    function isAncestors(element,nodes,root){  
        var p = element;  
        while(p && p!=root){  
            if(inArray(p,nodes)){  
                return true;  
            }  
            p = p.parentElement;  
        }  
        return false;  
    }  
      
})(BMap);  