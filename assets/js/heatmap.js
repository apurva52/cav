/*
 * heatmap.js v2.0.0 | JavaScript Heatmap Library
 *
 * Copyright 2008-2014 Patrick Wied <heatmapjs@patrick-wied.at> - All rights reserved.
 * Dual licensed under MIT and Beerware license 
 *
 * :: 2014-08-06 04:39
 */
;(function(global)
{ 
  // Heatmap Config stores default values and will be merged with instance config
  var HeatmapConfig = {
    defaultRadius: 40,
    defaultRenderer: 'canvas2d',
    defaultGradient: { 0.25: "rgb(0,0,255)", 0.55: "rgb(0,255,0)", 0.85: "yellow", 1.0: "rgb(255,0,0)"},
    defaultMaxOpacity: 1,
    defaultMinOpacity: 0,
    defaultBlur: .85,
    defaultXField: 'x',
    defaultYField: 'y',
    defaultValueField: 'value', 
    plugins: {}
  };
  var Store = (function StoreClosure() {

  var Store = function Store(config) {
    this._coordinator = {};
    this._data = [];
    this._radi = [];
    this._min = 0;
    this._max = 1;
    this._xField = config['xField'] || config.defaultXField;
    this._yField = config['yField'] || config.defaultYField;
    this._valueField = config['valueField'] || config.defaultValueField;

    if (config["radius"]) {
      this._cfgRadius = config["radius"];
    }
  };

  var defaultRadius = HeatmapConfig.defaultRadius;

  Store.prototype = {
    // when forceRender = false -> called from setData, omits renderall event
    _organiseData: function(dataPoint, forceRender) {
        var x = dataPoint[this._xField];
        var y = dataPoint[this._yField];
        var radi = this._radi;
        var store = this._data;
        var max = this._max;
        var min = this._min;
        var value = dataPoint[this._valueField] || 1;
        var radius = dataPoint.radius || this._cfgRadius || defaultRadius;

        if (!store[x]) {
          store[x] = [];
          radi[x] = [];
        }

        if (!store[x][y]) {
          store[x][y] = value;
          radi[x][y] = radius;
        } else {
          store[x][y] += value;
        }

        if (store[x][y] > max) {
          if (!forceRender) {
            this._max = store[x][y];
          } else {
            this.setDataMax(store[x][y]);
          }
          return false;
        } else{
          return { 
            x: x, 
            y: y,
            value: value, 
            radius: radius,
            min: min,
            max: max 
          };
        }
    },
    _unOrganizeData: function() {
      var unorganizedData = [];
      var data = this._data;
      var radi = this._radi;

      for (var x in data) {
        for (var y in data[x]) {

          unorganizedData.push({
            x: x,
            y: y,
            radius: radi[x][y],
            value: data[x][y]
          });

        }
      }
      return {
        min: this._min,
        max: this._max,
        data: unorganizedData
      };
    },
    _onExtremaChange: function() {
      this._coordinator.emit('extremachange', {
        min: this._min,
        max: this._max
      });
    },
    addData: function() {
      if (arguments[0].length > 0) {
        var dataArr = arguments[0];
        var dataLen = dataArr.length;
        while (dataLen--) {
          this.addData.call(this, dataArr[dataLen]);
        }
      } else {
        // add to store  
        var organisedEntry = this._organiseData(arguments[0], true);
        if (organisedEntry) {
          this._coordinator.emit('renderpartial', {
            min: this._min,
            max: this._max,
            data: [organisedEntry]
          });
        }
      }
      return this;
    },
    setData: function(data) {
      var dataPoints = data.data;
      var pointsLen = dataPoints.length;


      // reset data arrays
      this._data = [];
      this._radi = [];

      for(var i = 0; i < pointsLen; i++) {
        this._organiseData(dataPoints[i], false);
      }
      this._max = data.max;
      this._min = data.min || 0;
      
      this._onExtremaChange();
      this._coordinator.emit('renderall', this._getInternalData());
      return this;
    },
    removeData: function() {
	

    },
    setDataMax: function(max) {
      this._max = max;
      this._onExtremaChange();
      this._coordinator.emit('renderall', this._getInternalData());
      return this;
    },
    setDataMin: function(min) {
      this._min = min;
      this._onExtremaChange();
      this._coordinator.emit('renderall', this._getInternalData());
      return this;
    },
    setCoordinator: function(coordinator) {
      this._coordinator = coordinator;
    },
    _getInternalData: function() {
      return { 
        max: this._max,
        min: this._min, 
        data: this._data,
        radi: this._radi 
      };
    },
    getData: function() {
      return this._unOrganizeData();
    }
  };

  return Store;
  })();

  var Canvas2dRenderer = (function Canvas2dRendererClosure() {
  
    var _getColorPalette = function(config) {
      var gradientConfig = config.gradient || config.defaultGradient;
      var paletteCanvas = document.createElement('canvas');
      var paletteCtx = paletteCanvas.getContext('2d');

      paletteCanvas.width = 256;
      paletteCanvas.height = 1;

      var gradient = paletteCtx.createLinearGradient(0, 0, 256, 1);
      for (var key in gradientConfig) {
        gradient.addColorStop(key, gradientConfig[key]);
      }

      paletteCtx.fillStyle = gradient;
      paletteCtx.fillRect(0, 0, 256, 1);

      return paletteCtx.getImageData(0, 0, 256, 1).data;
    };

    var _getPointTemplate = function(radius, blurFactor) {
      var tplCanvas = document.createElement('canvas');
      var tplCtx = tplCanvas.getContext('2d');
      var x = radius;
      var y = radius;
      tplCanvas.width = tplCanvas.height = radius*2;
      if (blurFactor == 1) {
        tplCtx.beginPath();
        tplCtx.arc(x, y, radius, 0, 2 * Math.PI, false);
        tplCtx.fillStyle = 'rgba(0,0,0,1)';
        tplCtx.fill();
      } else {
        var gradient = "";
        try{
         gradient = tplCtx.createRadialGradient(x, y, parseInt(radius*blurFactor), x, y, radius);
         gradient.addColorStop(0, 'rgba(0,0,0,1)');
         gradient.addColorStop(1, 'rgba(0,0,0,0)');
         tplCtx.fillStyle = gradient;
         tplCtx.fillRect(0, 0, 2*radius, 2*radius);
       }
       catch(e)
       {
       }
      }
    
    

      return tplCanvas;
    };

  var _prepareData = function(data) {
    var renderData = [];
    var min = data.min;
    var max = data.max;
    var radi = data.radi;
    var data = data.data;
    
    var xValues = Object.keys(data);
    var xValuesLen = xValues.length;

    while(xValuesLen--) {
      var xValue = xValues[xValuesLen];
      var yValues = Object.keys(data[xValue]);
      var yValuesLen = yValues.length;
      while(yValuesLen--) {
        var yValue = yValues[yValuesLen];
        var value = data[xValue][yValue];
        var radius = radi[xValue][yValue];
        renderData.push({
          x: xValue,
          y: yValue,
          value: value,
          radius: radius
        });
      }
    }

    return {
      min: min,
      max: max,
      data: renderData
    };
  };


  function Canvas2dRenderer(config) {
    var container = config.container;
    var shadowCanvas = this.shadowCanvas = document.createElement('canvas');
    var canvas = this.canvas = config.canvas || document.createElement('canvas');
    var renderBoundaries = this._renderBoundaries = [10000, 10000, 0, 0];

    var computed = getComputedStyle(config.container) || {};

    canvas.className = 'heatmap-canvas';

    this._width = canvas.width = shadowCanvas.width = +(computed.width.replace(/px/,''));
    this._height = canvas.height = shadowCanvas.height = +(container.scrollHeight);
    
    this.shadowCtx = shadowCanvas.getContext('2d');
    this.ctx = canvas.getContext('2d');

    // @TODO:
    // conditional wrapper

    canvas.style.cssText = shadowCanvas.style.cssText = 'position:absolute;left:0;top:0;z-index:1000';

    //container.style.position = 'relative';
    container.appendChild(canvas);

    this._palette = _getColorPalette(config);
    this._templates = {};

    this._setStyles(config);
  };

  Canvas2dRenderer.prototype = {
    renderPartial: function(data) {
      this._drawAlpha(data);
      this._colorize();
    },
    renderAll: function(data) {
      // reset render boundaries
      this._clear();
      this._drawAlpha(_prepareData(data));
      this._colorize();
    },
    _updateGradient: function(config) {
      this._palette = _getColorPalette(config);
    },
    updateConfig: function(config) {
      if (config['gradient']) {
        this._updateGradient(config);
      }
      this._setStyles(config);
    },
    setDimensions: function(width, height) {
      this._width = width;
      this._height = height;
      this.canvas.width = this.shadowCanvas.width = width;
      this.canvas.height = this.shadowCanvas.height = height;
    },
    _clear: function() {
      this.shadowCtx.clearRect(0, 0, this._width, this._height);
      this.ctx.clearRect(0, 0, this._width, this._height);
    },
    _setStyles: function(config) {
      this._blur = (config.blur == 0)?0:(config.blur || config.defaultBlur);

      if (config.backgroundColor) {
        this.canvas.style.backgroundColor = config.backgroundColor;
      }

      this._opacity = (config.opacity || 0) * 255;
      this._maxOpacity = (config.maxOpacity || config.defaultMaxOpacity) * 255;
      this._minOpacity = (config.minOpacity || config.defaultMinOpacity) * 255;
    },
    _drawAlpha: function(data) {
      var min = this._min = data.min;
      var max = this._max = data.max;
      var data = data.data || [];
      var dataLen = data.length;
      // on a point basis?
      var blur = 1 - this._blur;

      while(dataLen--) {

        var point = data[dataLen];

        var x = point.x;
        var y = point.y;
        var radius = point.radius;
        // if value is bigger than max
        // use max as value
        var value = Math.min(point.value, max);
        var rectX = x - radius;
        var rectY = y - radius;
        var shadowCtx = this.shadowCtx;




        var tpl;
        if (!this._templates[radius]) {
          this._templates[radius] = tpl = _getPointTemplate(radius, blur);
        } else {
          tpl = this._templates[radius];
        }

        shadowCtx.globalAlpha = value/(Math.abs(max-min));
        if(!isNaN(rectX))
          shadowCtx.drawImage(tpl, rectX, rectY);

        // update renderBoundaries
        if (rectX < this._renderBoundaries[0]) {
            this._renderBoundaries[0] = rectX;
          } 
          if (rectY < this._renderBoundaries[1]) {
            this._renderBoundaries[1] = rectY;
          }
          if (rectX + 2*radius > this._renderBoundaries[2]) {
            this._renderBoundaries[2] = rectX + 2*radius;
          }
          if (rectY + 2*radius > this._renderBoundaries[3]) {
            this._renderBoundaries[3] = rectY + 2*radius;
          }

      }
    },
    _colorize: function() {
      var x = this._renderBoundaries[0];
      var y = this._renderBoundaries[1];
      var width = this._renderBoundaries[2] - x;
      var height = this._renderBoundaries[3] - y;
      var maxWidth = this._width;
      var maxHeight = this._height;
      var opacity = this._opacity;
      var maxOpacity = this._maxOpacity;
      var minOpacity = this._minOpacity;

      if (x < 0) {
        x = 0;
      }
      if (y < 0) {
        y = 0;
      }
      if (x + width > maxWidth) {
        width = maxWidth - x;
      }
      if (y + height > maxHeight) {
        height = maxHeight - y;
      }

      var img = this.shadowCtx.getImageData(x, y, width, height);
      var imgData = img.data;
      var len = imgData.length;
      var palette = this._palette;


      for (var i = 3; i < len; i+= 4) {
        var alpha = imgData[i];
        var offset = alpha * 4;


        if (!offset) {
          continue;
        }

        var finalAlpha;
        if (opacity > 0) {
          finalAlpha = opacity;
        } else {
          if (alpha < maxOpacity) {
            if (alpha < minOpacity) {
              finalAlpha = minOpacity;
            } else {
              finalAlpha = alpha;
            }
          } else {
            finalAlpha = maxOpacity;
          }
        }

        imgData[i-3] = palette[offset];
        imgData[i-2] = palette[offset + 1];
        imgData[i-1] = palette[offset + 2];
        imgData[i] = finalAlpha;

      }

      img.data = imgData;
      this.ctx.putImageData(img, x, y);

      this._renderBoundaries = [1000, 1000, 0, 0];

    },
    getValueAt: function(point) {
      var value;
      var shadowCtx = this.shadowCtx;
      var img = shadowCtx.getImageData(point.x, point.y, 1, 1);
      var data = img.data[3];
      var max = this._max;
      var min = this._min;

      value = (Math.abs(max-min) * (data/255)) >> 0;

      return value;
    },
    getDataURL: function() {
      return this.canvas.toDataURL();
    }
  };


  return Canvas2dRenderer;
})();

var Renderer = (function RendererClosure() {

  var rendererFn = false;

  if (HeatmapConfig['defaultRenderer'] === 'canvas2d') {
    rendererFn = Canvas2dRenderer;
  }

  return rendererFn;
})();


var Util = {
  merge: function() {
    var merged = {};
    var argsLen = arguments.length;
    for (var i = 0; i < argsLen; i++) {
      var obj = arguments[i]
      for (var key in obj) {
        merged[key] = obj[key];
      }
    }
    return merged;
  }
};
// Heatmap Constructor
var Heatmap = (function HeatmapClosure() {

  var Coordinator = (function CoordinatorClosure() {

    function Coordinator() {
      this.cStore = {};
    };

    Coordinator.prototype = {
      on: function(evtName, callback, scope) {
        var cStore = this.cStore;

        if (!cStore[evtName]) {
          cStore[evtName] = [];
        }
        cStore[evtName].push((function(data) {
            return callback.call(scope, data);
        }));
      },
      emit: function(evtName, data) {
        var cStore = this.cStore;
        if (cStore[evtName]) {
          var len = cStore[evtName].length;
          for (var i=0; i<len; i++) {
            var callback = cStore[evtName][i];
            callback(data);
          }
        }
      }
    };

    return Coordinator;
  })();


  var _connect = function(scope) {
    var renderer = scope._renderer;
    var coordinator = scope._coordinator;
    var store = scope._store;

    coordinator.on('renderpartial', renderer.renderPartial, renderer);
    coordinator.on('renderall', renderer.renderAll, renderer);
    coordinator.on('extremachange', function(data) {
      scope._config.onExtremaChange &&
      scope._config.onExtremaChange({
        min: data.min,
        max: data.max,
        gradient: scope._config['gradient'] || scope._config['defaultGradient']
      });
    });
    store.setCoordinator(coordinator);
  };


  function Heatmap() {
    var config = this._config = Util.merge(HeatmapConfig, arguments[0] || {});
    this._coordinator = new Coordinator();
    if (config['plugin']) {
      var pluginToLoad = config['plugin'];
      if (!HeatmapConfig.plugins[pluginToLoad]) {
        throw new Error('Plugin \''+ pluginToLoad + '\' not found. Maybe it was not registered.');
      } else {
        var plugin = HeatmapConfig.plugins[pluginToLoad];
        // set plugin renderer and store
        this._renderer = plugin.renderer;
        this._store = plugin.store;
      }
    } else {
      this._renderer = new Renderer(config);
      this._store = new Store(config);
    }
    _connect(this);
  };

  // @TODO:
  // add API documentation
  Heatmap.prototype = {
    addData: function() {
      this._store.addData.apply(this._store, arguments);
      return this;
    },
    removeData: function() {
      this._store.removeData && this._store.removeData.apply(this._store, arguments);
      return this;
    },
    setData: function() {
      this._store.setData.apply(this._store, arguments);
      return this;
    },
    setDataMax: function() {
      this._store.setDataMax.apply(this._store, arguments);
      return this;
    },
    setDataMin: function() {
      this._store.setDataMin.apply(this._store, arguments);
      return this;
    },
    configure: function(config) {
      this._config = Util.merge(this._config, config);
      this._renderer.updateConfig(this._config);
      this._coordinator.emit('renderall', this._store._getInternalData());
      return this;
    },
    repaint: function() {
      this._coordinator.emit('renderall', this._store._getInternalData());
      return this;
    },
    getData: function() {
      return this._store.getData();
    },
    getDataURL: function() {
      return this._renderer.getDataURL();
    },
    getValueAt: function(point) {

      if (this._store.getValueAt) {
        return this._store.getValueAt(point);
      } else  if (this._renderer.getValueAt) {
        return this._renderer.getValueAt(point);
      } else {
        return null;
      }
    }
  };

  return Heatmap;

})();
   
var heatmap;

function changeGradient(gradient) {
        var selectedgradient;
        if (gradient == "cyan")
            selectedgradient = { 0: "#05f9fd", 0.25: "rgb(0,0,50)", 0.5: "rgb(0,255,0)", 0.75: "yellow", 1: "rgb(255,0,0)" } //cyan blue, green, yellow, red};  
        else
            selectedgradient = { '.5': 'blue', '.8': 'red', '.95': 'white' }

        var nuConfig = {
            container: top.replayIframe.contentWindow.document.getElementsByTagName('body')[0],
            radius: 10,
            gradient: selectedgradient,
            blur: 1, 
        };
        heatmap.configure(nuConfig);
    }

function showheatmapforpage(d, response)
{
  var document = d;

  if(response == "" || response == null || response == "[]" || response.length == 0)
   {
      alert("No Data Present for the given timerange");
      return;
   }
   createScaleDiv();
   // this can be us to debug the value at each cordinate
   // uncomment to debug
   createTooltipDiv();
   //validate data. 
   var data;
   try {
      data = JSON.parse(response); 
   } catch(e) {
     //alert('Invalid Data');
     try{
      data = response;
     }catch(e){
     console.log(e);
     return;
     }
   } 

  // only fro debug purposes
  var demoWrapper = top.replayIframe.contentWindow.document.getElementsByTagName('body')[0];
  var tooltip = top.document.querySelector('#tid');
  demoWrapper.onmousemove = function(ev) {
  var x = ev.layerX;
  var y = ev.layerY;
  // getValueAt gives us the value for a point p(x/y)
  var value = heatmap.getValueAt({
    x: x,
    y: y
    });

    tooltip.style.display = 'block';
    tooltip.style.color='black';
    tooltip.style.backgroundColor='#c1e5eb';
    tooltip.style.fontWeight='600';
    tooltip.style.fontSize='12px';
    tooltip.style.padding='5px';
 
    updateTooltip(x, y, value);
  };
  // hide tooltip on mouseout
  demoWrapper.onmouseout = function() {
    tooltip.style.display = 'none';
  };


  // create heatmap instance
  //initial set : document.getElementsByTagName('body')[0];
  // changes done for mobile
  heatmap = h337.create({
    container: top.replayIframe.contentWindow.document.getElementsByTagName('body')[0],
    radius: 10,
    //gradient : { 0: "white" , 0.25: "yellow" , 0.5: "green", 0.75: "cyan", 1: "blue"},
    gradient: {0: "#05f9fd", 0.25: "rgb(0,0,50)", 0.5: "rgb(0,255,0)", 0.75: "yellow", 1: "rgb(255,0,0)"}, //cyan blue, green, yellow, red
    blur :1,
    /*gradient: { 0.25: "rgb(0,0,50)", 0.55: "rgb(0,255,0)", 0.85: "yellow", 1.0: "rgb(255,0,0)"}, //blue, green, yellow, red
    maxOpacity: .6,
    minOpacity: .1,
    radius: 10,
    blur: .90*/
  });  

  // boundaries for data generation
  var width = (+window.getComputedStyle(document.body).width.replace(/px/,''));
  var height = (+window.getComputedStyle(document.body).height.replace(/px/,''));

  var pageWidth = document.width || (null === document.documentElement ? 0 : document.documentElement.offsetWidth);
  var pageHeight = Math.max("undefined" == typeof document.height ? 0 : document.height, "undefined" == typeof document.documentElement ? 0 : document.documentElement.offsetHeight,"undefined" == typeof document.documentElement ? 0 : document.documentElement.scrollHeight);
  //var pageWidth = top.replayIframe.contentWindow.document.documentElement.offsetWidth;
  //var pageHeight =  top.replayIframe.contentWindow.document.documentElement.offsetHeight;

    var minCount = data[0][2];
    var maxCount = 0;
    var x, y, c;
    var d0, d1, d2;
    minCount = parseInt(data[0][0].split(",")[2]);
    var out = new Array(data.length);
    for(var z = 0; z < data.length; z++)
    {
      // data [z] = ["7,195,72"]
      d0 = parseInt(data[z][0].split(",")[0]);
      d1 = parseInt(data[z][0].split(",")[1]); 
      x = parseInt((d0*pageWidth)/1000);
      y = parseInt((d1*pageHeight)/1000);
      c = parseInt(data[z][0].split(",")[2]);
      out[z] = {x: x, y: y, value: c};
      minCount = Math.min(minCount, c);
      maxCount = Math.max(maxCount, c);
    }
    console.log("out : " + JSON.stringify(out));
    // since out.length can be odd number
    var ln = Math.floor(out.length/2);
    console.log(ln + " maxCount : " + ((out[ln].value) * 3) + " -- " + JSON.stringify(out[parseInt(out.length*0.1)]) + " minCount : " + minCount);
   try{
    heatmap.setData({
      min :0,
      //max: out[parseInt(out.length*0.1)], it should be max value |
      //max: out[parseInt(out.length*0.1)],
      max: (out[ln].value) * 3, // 100 for 1000
      data: out
    });
   }catch(e)
   { console.log(e);}
  //parent.document.getElementById('load').style.display = 'none';
};

/* tooltip code start */
// todo : tooltip , top & left are set wrong
function updateTooltip(x, y, value) {
  var tooltip = top.document.querySelector('#tid');
 
 if(tooltip){
  // + 15 for distance to cursor
  var transl = 'translate(' + (x + 15) + 'px, ' + (y + 15) + 'px)';
  tooltip.style.webkitTransform = transl;
  tooltip.style.transform = transl;
  tooltip.style.msTransform = transl; 
  //tooltip.style.top = y + "px";
  //tooltip.style.left = x + "px";
  tooltip.innerHTML ="cord:"+x + "," + y +"<br> value:" +value;
  //tooltip.innerHTML = x + "," + y + ":" + value;
  }
};
/* tooltip code end */
	
//clears the heatmap from webpage
function clearheatmap()
{
 try{
  heatmap.setData({data:[]});
 }
catch(e)
 {}
}

function createScaleDiv()
{
  var scale = top.document.createElement('div');
  scale.innerHTML = "<b>Min <img src='/netvision/images/heatmap.png' height=20 width=80%> Max</b>";
  scale.setAttribute('id','scaleid');
  scale.style = "position:fixed;height:20%;bottom:0;left:20px;z-index:100000";
  scale.setAttribute('style',"position:fixed;height:20%;bottom:0;left:20px;z-index:100000");
 // parent.document.body.appendChild(scale);
  top.replayIframe.contentWindow.document.body.appendChild(scale);
}

function createTooltipDiv()
{
  var scale = top.document.createElement('div');
  scale.setAttribute('id','tid');
  scale.style.position = "absolute";
  scale.style.zIndex = "100001";
  scale.style.display = "none";
  scale.style.top = "0px";
  scale.style.left = "0px";
  parent.document.body.appendChild(scale);
  //top.replayIframe.contentWindow.document.body.appendChild(scale);
}


  

    
 
// core
var heatmapFactory = {
  create: function(config) {
    return new Heatmap(config);
  },
  register: function(pluginKey, plugin) {
    HeatmapConfig.plugins[pluginKey] = plugin;
  }
};

global['h337'] = heatmapFactory;
global['showheatmapforpage'] = showheatmapforpage;
global['clearheatmap'] = clearheatmap;
global['changeGradient'] = changeGradient;
})(this || window);
