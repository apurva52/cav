var NVScrollMap =
(function () {

function getScrollMap(/*startTime, endTime, deviceType, channelID, pageName */args, callback)
{
  var win = top.replayIframe.contentWindow;
  var d = win.document;
  d.getElementById('load').style.display = "block" ;
  var xmlHttp;
  if (window.XMLHttpRequest)
  {
    // Mozilla, Safari, ...
    xmlHttp = new XMLHttpRequest();
  }
  else if (window.ActiveXObject)
  {
    // IE
    xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
  }
  var url = "/netvision/rest/webapi/nvscrollmap";
  //show heatmap in webpage
  url = url + "?startTime=" + args.starttime + "&endTime=" + args.endtime + "&currentPage=" + args.currentpage +"&strOperName=scrollmap" +"&type=" +args.deviceType + "&channel=" +args.channelid + "&usersegmentid="+ args.userSegment+"&access_token=563e412ab7f5a282c15ae5de1732bfd1";
  //opening conection to the server
  //url = "test1.txt";

  //url = "scrolldatamap.txt";
  xmlHttp.open('GET', url, true);

  //if ready state is 4 means response are coming
  //you can add other condition, check success 200
  xmlHttp.onreadystatechange = function()
  {
    if (xmlHttp.readyState == 4 && xmlHttp.status==200)
    {
        try{
           console.log("response : ", xmlHttp.responseText);
           callback(null, xmlHttp.responseText.trim(""));
        }
        catch(e)
         {
           console.log(e);
         }
    //d.getElementById('load').style.display = 'none';
    //hideIcon();
    }
    else
    {
    }
  }
  xmlHttp.send();
  //setTimeout(function(){  hideIcon(); }, 5000);
}
function drawscrollmap()
{
  console.log("drawscrollmap called");
  var win = top.replayIframe.contentWindow;
  var d = win.document;
  var ht = Math.max(win.innerHeight, d.documentElement.clientHeight , d.documentElement.scrollHeight);
  var overLayContainer = document.createElement("DIV");
  overLayContainer.style.width = "100%";

  overLayContainer.style.height = ht + "px";
  //overLayContainer.style.backgroundColor = "black";
  overLayContainer.style.opacity = 1.7;
  overLayContainer.style.position = "absolute";
  overLayContainer.style.display = "block";
  //overLayContainer.style.overflow = 'hidden';
  overLayContainer.style.top = 0 + "px";
  overLayContainer.style.left = 0 + "px";
  overLayContainer.id="overLayParent1";
  d.body.appendChild(overLayContainer);
  var x = d.getElementById("myc");
  var ctx = x.getContext("2d");
  x.style = "height:"+ht+"px;width:100%;z-index:1000;opacity:0.6;position:absolute;";
  x.setAttribute('style', "height:"+ht+"px;width:100%;z-index:1000;opacity:0.6;position:absolute;");
  var my_gradient = ctx.createLinearGradient(0, 0, 0, 150);
  creatediv(ctx,my_gradient,ht);
}

function creatediv(ctx,my_gradient,ht)
{

   for(var i = 0;i<= 1000;i++)
   {
    my_gradient.addColorStop(i/1000, mainarr[i].color);
   }
   
     ctx.fillRect(0, 0, 1366, ht);
     ctx.fillStyle = my_gradient;

}

function mapIntensityToColor(intensity, min, max) {
  var cint = map(intensity,min,max,0,255);
  var step = ((max - min) / 5);
  if(cint > 204) 
    return [255, map(intensity, max-step,max, 255,0), 0];
  if(cint > 153) 
    return [map(intensity, max-2*step,max-step, 0,255), 255, 0];
  if(cint > 102) 
    return [0, 255, map(intensity, max-3*step,max-2*step, 255,0)];
  if(cint > 51)
    return [0, map(intensity, max-4*step,max-3*step, 0,255), 255];
  return [map(intensity, min,max-4*step, 255,0), 0, 255];
}





var userdata = {};
var mainarr = [];
function setuserdata(userdata)
{
var maxCount = 1;  

for(var i =0;i<=1000;i++)
{
   if(mainarr[i] == undefined)
   {
     mainarr[i] = {};
     mainarr[i].count = 0;
   }

 for(var g = 0 ;g < userdata.length ; g++)
   {
          if(i == userdata[g].ypos)
                mainarr[i].count = userdata[g].count;
   }

}
//aggregate the records. 
var sum = 0;

for(var z = mainarr.length-1; z>-1;z--)
{
  sum += mainarr[z].count;
  mainarr[z].count = sum;

}

/*
n = mainarr.length-1;
while(n>0)
{
mainarr[n-1].count=mainarr[n-1].count+mainarr[n].count;
n--;

}

/*
*/
for(var i =0;i<mainarr.length;i++)
 {
    if(mainarr[i].count > maxCount)
      maxCount = mainarr[i].count;
 }

 for(var i =0;i<mainarr.length;i++)
 {
  mainarr[i].percentage = Math.round((mainarr[i].count/maxCount) * 100);
  var rgb =  mapIntensityToColor(mainarr[i].count,0,maxCount);
  mainarr[i].color = rgbToHex(parseInt(rgb[0]),parseInt(rgb[1]),parseInt(rgb[2]));
  
 }
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function map(value, istart, istop, ostart, ostop) {
  return ostart + (ostop - ostart) * ((value - istart) / (istop - istart));
}

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function removeScrollMap()
{
  var win = top.replayIframe.contentWindow;
  var d = win.document;
  var canvas = "";
  var context = "";
  try{
   canvas = d.getElementById("myc");
   context = canvas.getContext('2d');
  context.clearRect(0, 0, canvas.width, canvas.height);
  var f =  top.replayIframe.contentDocument.getElementById('overLayParent1');
  if(f != null)
  f.parentElement.removeChild(f);
  var g = top.replayDocument.querySelector("#scaleid");
  var di = top.replayDocument.querySelector("#spanrid");
  if(g != null)
   top.replayIframe.contentDocument.body.removeChild(g);
  if(di != null)
    top.replayIframe.contentDocument.body.removeChild(di);
  }
 catch(e)
  {}
  mainarr = []; 
  //$('#overLayParent').remove();
}

function fillBookmarkArray()
{
  var prev = 0;
  var bookmark = [];
  for(var z = mainarr.length - 1; z >= 0; z--)
  {
        if(mainarr[z].percentage == prev) continue;
        if(mainarr[z].percentage - prev > 10 || parseInt(mainarr[z].percentage) % 10 == 0)
                {
                  bookmark.push({value: mainarr[z].percentage, idx: z});
                  prev = mainarr[z].percentage;
                }
  }

  //mark the flag.
  for(var z = 0; z < bookmark.length; z++)
  {
     if(z==0)
     {
      drawperc(bookmark[z].value,bookmark[z].idx);
       continue;
     }
     if((bookmark[z].value % 10 == 0))
        drawperc(bookmark[z].value,bookmark[z].idx); 
     if((z < bookmark.length  && bookmark[z].value  - bookmark[z-1].value < 9))
          continue;
     drawperc(bookmark[z].value,bookmark[z].idx);
        //mark(bookmark[z]);
  }
}

var selected;
// Will be called when user starts dragging an element
function _drag_init(elem) {
    // Store the object of the element which needs to be moved
    selected = elem;
   // x_elem = x_pos - selected.offsetLeft;
    y_elem = y_pos - selected.offsetTop;
}

var f = null;


function onScrollChange(ev) {

    var viewPortHeight = 0;
   var window =  top.replayIframe;
        if(window.innerHeight && (document.documentElement || document.body ) && (document.documentElement || document.body ).clientHeight)
          viewPortHeight = Math.min(window.innerHeight ,  (document.documentElement || document.body).clientHeight);
        else if(window.innerHeight)
          viewPortHeight = window.innerHeight;
        else if((document.documentElement || document.body ) && (document.documentElement || document.body ).clientHeight)
         viewPortHeight = (document.documentElement || document.body ).clientHeight;

         var viewPortWidth = 0;
         if(window.innerWidth && (document.documentElement || document.body ) && (document.documentElement || document.body ).clientWidth)
           viewPortWidth = Math.min(window.innerWidth ,  (document.documentElement || document.body).clientWidth);
         else if((document.documentElement || document.body ) && (document.documentElement || document.body ).clientWidth)
           viewPortWidth = (document.documentElement || document.body ).clientWidth;
         else if(window.innerWidth)
           viewPortWidth = window.innerWidth;
   {
    var f = top.replayIframe.contentDocument.getElementById('spanrid');
     var w = window.parent;
  //get the window to scroll
  var scrollwindow = top.replayIframe.contentWindow;
  var win = top.replayIframe.contentWindow;
  var d = win.document;
  var ht = Math.max(win.innerHeight, d.documentElement.clientHeight , d.documentElement.scrollHeight);
  //get the hidden fields area if any
  var hr = scrollwindow.document.body.scrollTop || scrollwindow.document.documentElement.scrollTop;
  hr = hr + viewPortHeight;
  var rnd = Math.round(hr/ht * 100 );
  //get the hidden fields area if any
  //var hiddenarea = scrollwindow.document.body.scrollTop || scrollwindow.document.documentElement.scrollTop;
  //document.getElementById('spanrid').innerHTML = "";
      if(f != null && mainarr[parseInt(rnd*10)] != undefined)
       top.replayIframe.contentDocument.getElementById('userviewtxt').innerHTML = (mainarr[parseInt(rnd*10)].percentage) +"%";
     if(f != null)
       top.replayIframe.contentDocument.getElementById('userviewscroll').innerHTML = rnd +"%";
   } 
}

function createDivScale()
{
 var sp = document.createElement('span');
 sp.style = "padding:3px 8px;border:1px solid; border-radius:4px;background:blue;color:white;width:160px;position:fixed;left:-200px;z-Index:1000;display:block;height:";
 sp.style.top = "74%";
 sp.style.left="0px";
 sp.setAttribute('style',"padding:3px 8px;border:1px solid; border-radius:4px;background:blue;color:white;width:160px;position:fixed;z-Index:1000;display:block;top:74%;left:0px");
 sp.setAttribute('top', '74%');
 sp.setAttribute('left','0px'); 
 sp.id = 'spanrid';
 console.log("createDivScale , userAgent : " , userAgent);
  if(userAgent !== null && userAgent !== undefined)
  {
    if(userAgent.toLowerCase().indexOf("mobile") > -1 ||  userAgent.toLowerCase().indexOf("iphone") > -1)
    {
     sp.setAttribute('style',"padding:3px 8px;border:1px solid; border-radius:4px;background:blue;color:white;width:160px;position:fixed;z-Index:1000;display:block;top:92%;left:0px");
    }
  }
 sp.setAttribute('class','spr');
 sp.innerHTML = "<span id='userid' style='font-size:14px' ><b>User View </b></span><span id='userviewtxt'>100%</span><br><span style='font-size:14px'  id='scrollid'><b>Scroll Position </b></span><span id='userviewscroll'>0%</span></span>";
  top.replayIframe.contentDocument.getElementById('overLayParent1').appendChild(sp);
}

function drawperc(val,i)
{
var win = top.replayIframe.contentWindow;
var d = win.document;
var ht = Math.max(win.innerHeight, d.documentElement.clientHeight , d.documentElement.scrollHeight);

var f = document.createElement('div');
f.setAttribute('class','btn btn-primary');
f.innerHTML = val + "%" ;
f.style = "padding:3px 8px;border:1px solid; border-radius:4px;background:blue;color:white;width:7%;position:absolute;margin-left:85%;z-Index:10000";
f.id = 'val'+i;

f.style.top  = ((parseInt(i) * ht )/1000) ; 
tp = ((parseInt(i) * ht )/1000) ;
f.setAttribute('style',"padding:3px 8px;border:1px solid; border-radius:4px;background:blue;color:white;width:7%;position:absolute;margin-left:85%;z-Index:10000;top:"+ tp+"px");
var win = top.replayIframe.contentWindow;
var d = win.document;
var ht = Math.max(win.innerHeight, d.documentElement.clientHeight , d.documentElement.scrollHeight);
tempDiv(i,ht);

$(f).mouseenter(function(event)
 {
   /*var popOver = document.createElement("span");
   popOver.id = "popover" + i;
   popOver.setAttribute("class","nvpopOver");
   popOver.setAttribute("style","font-size : 15px;font-family : Raleway,HelveticaNeue,Helvetica Neue,Helvetica,Arial,sans-serif;position"
                              +": absolute;background-color : skyblue;color : purple;z-index:10000;border-radius : 3px;visibility:visible;padding-bottom"
                               +": 8px;padding-right : 10px;padding-top : 8px;padding-left : 10px;height;width:15%;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2),"
                                                           +"0 6px 20px 0 rgba(0, 0, 0, 0.19);");
   var scrl = top.replayIframe.contentDocument.getElementById('val'+i);
    var rnd = (parseInt(scrl.style.top)/ht * 100 );
   popOver.innerHTML = " User View "+val +"%<br> Scroll Position " + rnd.toFixed(2) + "%";
   popOver.style.top = event.pageY;
   popOver.style.left = "1090px";
   top.replayIframe.contentDocument.getElementById('overLayParent1').appendChild(popOver);*/

   showTempDiv(event,val,i,ht);
 });

$(f).mouseleave(function(event)
 {
   hideTempDiv(i);
   //$('.nvPopOver')[0].parentNode.removeChild($('.nvPopOver')[0])
   //var f = top.replayIframe.contentDocument.getElementById('overLayParent1');
   //var g = f.querySelectorAll('.nvpopOver');
   //f.removeChild(g[0]);
 });

//f.setAttribute("onmouseout","showDetailInfo("+val+","+i+",false)");
//parent.frames[0].document.getElementById("overLayParent").appendChild(f);
  top.replayIframe.contentDocument.getElementById('overLayParent1').appendChild(f);
}

function tempDiv(i,ht)
{
  var popOver = document.createElement("span");
   popOver.id = "popover" + i;
   popOver.setAttribute("class","nvpopOver");
   popOver.setAttribute("style","font-size : 15px;font-family : Raleway,HelveticaNeue,Helvetica Neue,Helvetica,Arial,sans-serif;position"
                              +": absolute;background-color : skyblue;color : purple;z-index:10000;border-radius : 3px;visibility:visible;padding-bottom"
                               +": 8px;padding-right : 10px;padding-top : 8px;padding-left : 10px;width:15%;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2),"
                                                           +"0 6px 20px 0 rgba(0, 0, 0, 0.19);margin-left:63%");
   popOver.style.display = "none";
   top.replayIframe.contentDocument.getElementById('overLayParent1').appendChild(popOver);
}

function showTempDiv(event,val,i,ht)
{  
    var popOver = top.replayIframe.contentDocument.getElementById("popover" + i);
    if(!popOver) return;
    var scrl = top.replayIframe.contentDocument.getElementById('val'+i);
    var rnd = (parseInt(scrl.style.top)/ht * 100 );
    popOver.style.display = "block";
    popOver.innerHTML = " User View "+val +"%<br> Scroll Position " + rnd.toFixed(2) + "%";
    popOver.style.top = event.pageY + "px";
}

function hideTempDiv(i)
{
  var popOver = top.replayIframe.contentDocument.getElementById("popover" + i);
    if(!popOver) return;
  popOver.style.display = "none";
}

var devicetype ;
var channelid;
var startDateTime;
var endDateTime;
var pageid;
var replaymode;
var userSegment;
var scrollClickMap = {};

var service = {};

service.init = function init(currentpage, channelid, starttime, endtime, deviceType, pageid, replaymode, version)
{
   this.currentpage = currentpage;
   this.channelid = channelid;
   this.starttime = starttime;
   this.endtime = deviceType;
   this.pageid = pageid;
   this.replaymode = replaymode;
   this.version = version;
}


function createScaleDiv()
{
  var scale = document.createElement('div');
  scale.innerHTML = "<b>Min <img src='/netvision/images/heatmap.png' style='width:50%;height:25px'> Max</b>";
  scale.setAttribute('id','scaleid');
  scale.setAttribute('style',"position:fixed;top:68%;left:20px;z-index:1000");
  if(userAgent !== null && userAgent !== undefined)
  {
    if(userAgent.toLowerCase().indexOf("mobile") > -1 ||  userAgent.toLowerCase().indexOf("iphone") > -1)
    {
     scale.setAttribute('style',"position:fixed;top:84%;left:20px;z-index:1000");
    }
  }
  top.replayIframe.contentDocument.body.appendChild(scale);
}

function createNav()
{
 var g = document.createElement('div');
 g.id = 'draggable-element';
 g.style ='border-top: 20px solid transparent;border-right: 40px solid blue;border-bottom: 20px solid transparent;position:absolute;z-index:20030;width: 0px;height: 0px;left:0px';
 var op = top.replayIframe.contentDocument.getElementById('overLayParent1');
 op.appendChild(g);
 
 //hideIcon();
 var parentel = top.replayIframe.contentDocument;
 // Bind the functions...
 parentel.getElementById('draggable-element').onmousedown = function () {
  _drag_init(this);
    return false;
};
var maxScroll = $(parent.frames[0].document).height();
var maxWindow = $(parent.frames[0]).innerHeight;
var f = parentel.getElementById('draggable-element');
//parent.frames[0].document.body.style.overflow = "hidden";
 var sp = document.createElement('span'); 
 sp.style = "padding:3px 8px;border:1px solid; border-radius:4px;background:blue;color:white;width:160px;position:absolute;left:3px;z-Index:10020;top:2px;display:none";
  //sp.style.top = event.pageY;
   sp.id = 'spanview';
   sp.setAttribute('class','spr');
   //parent.frames[0].document.getElementById('overLayParent1').appendChild(sp);
   parentel.getElementById('draggable-element').appendChild(sp);
   var tp = parentel.getElementById('draggable-element');
   sp.innerHTML = "User View <span>100<br> Scroll Position<span> 0%</span>";
 $(f).mousemove(function(event)
 {
    //if((parent.frames[0].innerHeight + $(parent.frames[0].window).scrollTop()) >= maxScroll) return;
    //_move_elem(event);
    // x_pos = document.all ? window.event.clientX : e.pageX;
    x_pos = 90;
    //y_pos = document.all ? window.event.clientY : e.pageY;
    y_pos = event.pageY;
    if (selected !== null && selected != undefined) {
       // selected.style.left = (x_pos - x_elem) + 'px';
       selected.style.top = (y_pos - y_elem) + 'px';
    }

    var hr = parseInt(tp.style.top);
    var win = top.replayIframe.contentWindow;
    var d = win.document;
    var ht = Math.max(win.innerHeight, d.documentElement.clientHeight , d.documentElement.scrollHeight);
    var rnd = Math.round(hr/ht * 100 );
    if(mainarr[parseInt(rnd*10)] != undefined){
         sp.innerHTML = "User View " + (mainarr[parseInt(rnd*10)].percentage).toFixed(2) + "%<br> Scroll Position"+ rnd.toFixed(2) +"%";
    }
 });
$(f).mouseup(function(event)
 {
    //_destroy(event);
    selected = null;
 });

$(f).mouseover(function(event)
 {
   sp.style.display = 'block'
 });
$(f).mouseout(function(event)
 {
   sp.style.display = 'none';
 });
}

function hideIcon()
{
   var parentel = top.replayIframe.contentDocument;
   if( parentel.getElementById('nvreplayid') !== null)
     parentel.getElementById('nvreplayid').style.display = 'none';
}
function setUserAgent(ua){
 console.log("setUserAgent called with  : ", ua);
  userAgent =ua;
}

function showScrollMap(currentpage, channelid, starttime, endtime, deviceType, pageid, userSegment)
  {
    
    var uaRecords;
     getScrollMap({currentpage: currentpage, channelid: channelid, starttime: starttime, endtime: endtime, deviceType: deviceType ,pageid : pageid ,userSegment : userSegment},
        function(error, data)
        {
          if(error)
          {
            //TODO: give some notification failed to draw heatmap.
             alert("Failed to draw heatmap");
             return ;
          }
          if(data == null || data == "")
          {
             alert("No data for the given timerange");
             return ;
          }
          if(JSON.parse(data).length == 0)
          {
           //TODO: give some notification failed to draw heatmap.
             alert("No data for the given timerange");
             return ;
          }
          var g = JSON.parse(data);
          console.log("showScrollMap called : "+g);
          uaRecords = [];
          for(var i = 0;i <g.length ;i++)
          {
           if(g[i].ypos > 100) 
             uaRecords.push(g[i]); 
          } 
          userdata = JSON.parse(data); 
          
          scrollClickMap[currentpage] = uaRecords;
          //hideIcon(); 
          setuserdata(uaRecords);
          drawscrollmap(uaRecords);
          drawscrollmap(uaRecords);
          fillBookmarkArray();
          //mainarr = [];
          //creatediv(uaRecords);
          createNav();
         var g = $('#scaleid')[0];
          createScaleDiv();
         //if(g == null)
          createDivScale();
 
       });                                                 
  }

  var scrollmap = {};
  var userAgent = "";
  scrollmap.setUserAgent = setUserAgent; 
  scrollmap.showScrollMap  = showScrollMap;
  scrollmap.removeScrollMap =  removeScrollMap;
  scrollmap.onScrollChange = onScrollChange;
  scrollmap.getScrollMap = getScrollMap;
  scrollmap.scrollClickMap = scrollClickMap;
  scrollmap.setuserdata = setuserdata;
  scrollmap.drawscrollmap = drawscrollmap;
  scrollmap.fillBookmarkArray = fillBookmarkArray;
  scrollmap.createNav = createNav;
  scrollmap.createScaleDiv = createScaleDiv;
  return scrollmap; 

})(window, document);


