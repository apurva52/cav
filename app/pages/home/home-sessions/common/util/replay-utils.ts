import { PageInformation } from './../interfaces/pageinformation';
import {nvEncoder} from './../interfaces/nvencode';
import { ReplaySettings } from './../../play-sessions/service/replaysettings';
export class ReplayUtil
{
  
  lastJsonDataPageInstance : number =0;
  //start : number = 0;
  static progressBarValue : number =0 ;
  static currentPercentage : number =0 ;
  static startPercentage : number =0 ;
  static targetPercentage : number =0 ;
  

  static getRequestedPageList(startPageInstance :number, maxLimit: number, pages:PageInformation[] , totalPages : number, partitionID,defoffset)
  {
     //console.log("in getRequestedPageList : startPageInstance : " + startPageInstance + " maxLimit : " + maxLimit + " partitionID : " + partitionID);
     var pageInstance;
     var requestedUrl = "";
     for(var z = 0; z < totalPages && maxLimit > 0; z++)
     {
        pageInstance = pages[z].pageInstance;
        //if(userActionData[pageInstance].jsonDataCollected) continue; // if data already present. 
        if(pageInstance >= startPageInstance)
        {
           requestedUrl = pageInstance + "," + partitionID + "," + requestedUrl + "," /*this will not harm ******/;
           maxLimit--;
        }
      }
      return this.requestLink(requestedUrl,defoffset); 
   }


  static requestLink(requestedUrl: string, defoffset: any) {
  //console.log('inside newrequestLink=',defoffset);

     //String format entering in this method    
    //5,20200612172605,4,20200612172605,3,20200612172605,2,20200612172605,1,20200612172605,,,,,,
    
    var offsetq='0';
    var pagekey =null;
    if(defoffset == null)
      defoffset = "0";
    if(defoffset.includes('_'))
       {
         pagekey=defoffset.split('_')[0];
         var offsetvalue =defoffset.split('_')[1];
         pagekey.trim();
        }
  
    let b= requestedUrl.split(',');
    b = b.filter((entry) => { return entry.trim() !== '' })
    let newLink='';
    let sid =b[1];
  
    //console.log('sid=',sid,'pagekey',pagekey);

     for (let i=b.length;i>-1;i=i-2)
    {
      
      if(b[i]==undefined)
      continue;
        
        if((pagekey!=null) && (b[i]==pagekey)){
        newLink=newLink+b[i]+'_'+offsetvalue+','+sid+',';  
        
      }
        else{
          
         newLink=newLink+b[i]+'_'+offsetq+','+sid+',';
         
        } 
    }

   //console.log('new requested=',newLink);
   return newLink;
  }
 

  

    static toHHMMSS (str : String) {
      let h : string = "0";
      let m : string = "0";
      let s : string = "0";
      let sec_num = Number(str); // don't forget the second param
      let hours   =  (Math.floor(sec_num / 3600));
      let minutes =  (Math.floor((sec_num - (hours * 3600)) / 60));
      let seconds =  (sec_num - (hours * 3600) - (minutes * 60));
      s = seconds+"";
      if (hours   < 10) {h   = "0"+hours;}
      if (minutes < 10) {m = "0"+minutes;}
      if (seconds < 10) {s = "0"+seconds;}
      let  time    = h+':'+m+':'+s;
      return time;
    }
    /************Helping Methods***********/
//if nearParnet flag is set then if element not found then it will check for it's nearest parent element.
//Note in case of 2 and 3 event type we can apply on element's parent if the target element not visible.
 static getElementByXPath(eleid, nearParent, w, d)
{
    nearParent = nearParent|| false;
    w = w || window;
    d = d || document;

    var element = null;
    var c = 0;
    while(!nearParent || c <= 5)//|| c <= ReplaySettings.parentcount)
    {
      try
      {
        element = d.evaluate(eleid, d, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      }
      catch(Exception)
      {
        //handle for xpath when there is namespace in the xpath
        //in this case we are removing the namespace by *
        //replace the current id using regex
        while(eleid.indexOf(":") > -1){eleid=eleid.replace(/\/[0-9A-Za-z]*:[^\/]*$/g, "/*").replace(/\/[0-9A-Za-z]*:[^\/]*\//g, "/*/");}
        //nvreporterdebug("Namespace removed id - " + eleid);
        //replayDataSet[dataIndex].elementid = eleid;
        try { 
          element = d.evaluate(eleid, d, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        }
        catch(e) {}
      }
      if(!nearParent) return element;
      //if we found visible then return.
      //TODO: anjali review window.getComputedStyle(element,null) ??
      else if(element != null && window.getComputedStyle(element,null).display != "none") return element;
      else if(eleid.indexOf("']") == eleid.length -2) return element;
      else if(eleid == "") return element ;

      else
        eleid = eleid.substring(0, eleid.lastIndexOf("/")).trim();
      c++;
    }
  return element;
                   
}

static getElementByCssSelector(eleid, nearParent, w, d)
{
    nearParent = nearParent || false;
    var checked = false;
    w = w || window;
    d = d || document;

    var element = null;
    var element1 = null;
    var newele = null;
    try{
      element = d.querySelector(eleid)
    }catch(e) {element = null;}
    if(element != null && window.getComputedStyle(element,null).display != "none")
      return element;
    else
    { 
      var elearr = eleid.split(' > ');
      var newele1 = null;
      newele = elearr;
      var z = elearr.length - 1;
      for(var i = z; i >= 0 ; i--)
      { 
        if(elearr[i].indexOf(':') != -1 && checked == false)
        { 
          var a = elearr[i];
          //parenthesis value
          var b = parseInt(a.substring(a.indexOf("(")+1,a.indexOf(")"))) - 1;
          for(var p = b; p>=1; p--)
          { 
            elearr[i] = elearr[i].replace(parseInt(elearr[i].substring(a.indexOf("(")+1,elearr[i].indexOf(")"))), p);
            newele1 = elearr;
            newele1 = newele1.join(' > ');
            try { 
              element1 = d.querySelector(newele1);
            } catch(e) {element1 = null;}
            if(element1 != null && window.getComputedStyle(element1,null).display != "none")
            return element1;
          } 
          checked = true;
        } 
          newele1 = newele.splice(-1);
          newele1 = newele.join(' > ');
          try{
            element1 = d.querySelector(newele1);
          } catch(e) {element1 = null;}
          if(element1 != null && window.getComputedStyle(element1,null).display != "none")
          return element1;
      }   
   }  
   return null;
}
 

 static getElementPos(ele)
{
  var w = ele.ownerDocument.defaultView || ele.ownerDocument.parentWindow;
  var d = ele.ownerDocument;
  var bounds = ele.getBoundingClientRect();
  var body =  d.body;
  var docElem = d.documentElement;
  // taking into account scrolling position
  var scrollTop = w.pageYOffset || docElem.scrollTop || body.scrollTop;
  var scrollLeft = w.pageXOffset || docElem.scrollLeft || body.scrollLeft;
  var clientTop = docElem.clientTop || body.clientTop || 0;
  var clientLeft = docElem.clientLeft || body.clientLeft || 0;
  var etop  = bounds.top +  scrollTop - clientTop;
  var left = bounds.left + scrollLeft - clientLeft;
  return {"top" :etop , "left" : left  }; 
}

static computeFrameOffset(win, dims ,replayWindow, c) {
  if(replayWindow == null || replayWindow == undefined){
    let iframeEle :any = document.querySelector("#replayIframe");
    replayWindow  = iframeEle.contentWindow;
  }
  if(c > 10)
     return dims;
  if(dims == null){
     dims = { top: 0, left: 0};
  }
  //dims = (typeof dims === 'undefined')?{ top: 0, left: 0}:dims;
  if (win !== replayWindow) {
    let fe = win.frameElement;
    if(fe == null)
      fe = replayWindow.frameElement;
    if(fe == null){
      return dims;
    }
    var rect = fe.getBoundingClientRect();
      dims.left += rect.left;
      dims.top += rect.top;
      dims = ReplayUtil.computeFrameOffset(win.parent, dims, replayWindow , c++); // recursion
  }
  return dims;
}

 //Note: max limit of text content is 50.
//we will try to find the complete text within 50 chars.
static shortTextContent(text, lmt, action)
{

  text = text.trim();
  // no limit check for text like 
  /*shoppingBag
    

    Visit
  */
  if(action != undefined && action == "hide" && text.indexOf('\n') > -1)
    return text.substr(0, text.indexOf('\n')+1) + "...";

  if(text.length <= lmt)
    return text;
  else if(action != undefined && action == "hide")
  {
    if(text.indexOf('\n') <= -1)
      return text.substr(0,lmt)+ "...";
    else
      return text.substr(0, text.indexOf('\n')+1) + "...";
  }

  //split the content by \n, \t and space \r \b.
  var lastComplete = -1;
  for(var z = 0;  z < text.length; z++)  
  {
    if(text[z] == ' ' || text[z] == '\r' || text[z] == '\n' || text[z] == '\t' )
      lastComplete = z;
    if(z + 1 == 50)
      break;
  }
  
  if(lastComplete != -1)
    return text.substr(0, lastComplete + 1);
  else 
     return text.substr(0, 50);
}

//Note: this method will find the nearest text node. will be treated as level.
static getLabel(node)
{
  //console.log('getLable called. nodeName - ' + node.nodeName + ', and id - ' +  node.id);
  //Check for nodeType if INPUT then check for it's label tag. 
  if(node.nodeName == "INPUT" && node.id)
  {
    var l = node.ownerDocument.querySelector('[for="' + node.id +'"]');
	if(l && l.textContent.trim() != "") 
      return ReplayUtil.shortTextContent(l.textContent, 50,null);	  
  }
  
    //Method to get value. 
  function v(node)
  {
    //Check for text Content and then for input element having value.
	if(node.innerText &&  node.innerText.trim() != "")
	  return ReplayUtil.shortTextContent(node.innerText, 50,null);
	//Check for input then it;s value. 
    if(node.nodeName == "INPUT" && node.value && node.value.trim() != "")
      return ReplayUtil.shortTextContent(node.value, 50,null);
    return null;	
  }
  
  var value = v(node);
  if(value && value.trim() != "") return value;
  
	
  //Check for Child Element. 
  function cv(node) {
    var children = node.children;
	//Check for this node. 
	for (var z = 0; z < children.length; z++)
	{
	  if(children[z].tagName == "INPUT" && children[z].value && children[z].value.trim() != "")
	    return ReplayUtil.shortTextContent(children[z].value, 50,null);	 
      //Check for this itself.
	  var value = cv(children[z]);
	  if(value && value.trim() != "")
	     return ReplayUtil.shortTextContent(value, 50,null);
	}
  }


  //Check for child value. 
  var value = cv(node);
  if(value && value.trim() != "") return ReplayUtil.shortTextContent(value, 50,null);
   
  function ptext(node, self)
  {
    var value = null;
    if(self)
	{
	  value = v(node);
	  if(value && value.trim() != "") return value;
	}
	
	//Check for prev sibling. 
	var next =  node.previousElementSibling;
	while(next) {
	  value = v(next);
	  if(value && value.trim() != "") return value;
          next = next.previousElementSibling;
	}
	
	//Check for nextSibling. 
	next = node.nextElementSibling;
	while(next) {
	  value = v(next);
	  if(value && value.trim() != "") return value;
          next = next.nextElementSibling; 
	}
	
	if(node.parentElement)
	{
	  return ptext(node.parentElement, true);
	}
  }
  
  value = ptext(node, false);
  if(value && value.trim() != "") return value;
  
  return node.tagName;
}
//used to handle check the encryption and decode the value
//case1: Blocker- no need to do anything
//case2: check for encrytion and user type
//case2.1: admin - decode the value
//case2.2: standard - convert to *
//case3: decode the value
// Domwatcher Changes will not be encoded.
//This method should only be called if required.
static checkEncryptDecrypt(pi, value, encValue)
{
  try{
    //check if encValue not given then decrypt and send.
    value = unescape(value);
    if(!encValue || encValue == "")
    {
      //just decrypt that by default algo and return.   
      if(/^[\s*]*$/.test(value)) return value;  
  
      return nvEncoder.decodeText(value, nvEncoder.decode);
    }

  //Encoding.
  //Note: if userType is not admin then just return the value.
  /*var usertype = ReplaySettings.userRole;
  if(usertype.toLowerCase() != "admin")
    return value;

  var ev;
  if(encValue.indexOf("%NVENCRYPTED") == 0)
  {
    ev = rsadecrypt(pi, encValue); 
    if(ev) return ev;
    return value;
  }
*/
  //TODO : Handling for encValue
  //return nvEncoder.decodeText(encValue, nvEncoder.decode);
  return nvEncoder.decodeText(value, nvEncoder.decode);
  }catch(e){
     console.log("Exception while decoding in checkEncryptDecrypt : ", e);
     return value;
  }
}

static getBasePathURL(clientip:string)
{
  //get the url
  let mainurl = unescape(clientip).trim();
  //check for get the url substring to remove query string
  if(mainurl.indexOf("?") > -1)
    mainurl = mainurl.substring(0,mainurl.indexOf("?"));
  else if(mainurl.indexOf("#") > -1)
    mainurl = mainurl.substring(0,mainurl.indexOf("#"));

   //used to remove base path ip and port
   if(mainurl.startsWith("http://") || mainurl.startsWith("https://") || mainurl.startsWith("//"))
   {
     mainurl = mainurl.substring(mainurl.indexOf("//") + 2);
   }
   return mainurl.substring(0,mainurl.lastIndexOf("/")) ;
}

static myRemoveClass(element: any, cls: string) 
{
  cls = cls.trim();
  var classes = element.className.split(' ');
  for(var z = 0; z < classes.length; z++)
  {
   if(classes[z].trim() == "")
    classes[z] = undefined;
   else if(classes[z].trim() == cls)
    classes[z] = undefined;
  } 
  element.className = classes.join(' ');
}

static outerHeight(el) {
  var height = el.offsetHeight;
  var style = getComputedStyle(el);

  height += parseInt(style.marginTop) + parseInt(style.marginBottom);
  return height;
}
static outerWidth(el) {
  var width = el.offsetWidth;
  var style = getComputedStyle(el);

  width += parseInt(style.marginLeft) + parseInt(style.marginRight);
  return width;
}
static getReplayDocument(){
  let iframe_document: Document = null;
  try{
    let iframeEle :any = document.querySelector("#replayIframe");
    let win : Window = iframeEle.contentWindow;
    iframe_document = <Document> win.document;
  }catch(e){
    console.log("Exception in getReplayDocument : ", e.message);
  }
  return iframe_document;
}
static showframe(swidth,sheight,userAgent, fullFrame)
{
  //let pageWidth =  $(document).width()*0.7699;
  //let pageHeight = $(document).height();
  
  let pageWidth = parseFloat(getComputedStyle(document.body, null).width.replace("px", "")) * 0.7399;
  let pageHeight = parseFloat(getComputedStyle(document.body, null).height.replace("px", ""));

  if(fullFrame)
    pageWidth =  parseFloat(getComputedStyle(document.body, null).width.replace("px", ""));
     
  var sf = swidth/sheight;
  //var origPW = pageWidth, origPH = pageHeight;
  var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  var f = "";
  var sdwidth = parseInt(swidth) ;
  var hdheight = parseInt(sheight) ;
  if((userAgent.toLowerCase().indexOf('mobile') > -1) || (userAgent.toLowerCase().indexOf('iphone') > -1)  || (userAgent.toLowerCase().indexOf('tablet') > -1)  || (userAgent.toLowerCase().indexOf('ipad') > -1) || (ReplaySettings.showTabs == true))
   { 
    //f = top.document.getElementById('filterQueryId1');
    sdwidth = parseInt(swidth) + 500;
    hdheight = parseInt(sheight) + 800;
   }
  //else
    //f =  d;
  if(sf > 1)
    {
      pageWidth = pageWidth;
      pageHeight =  pageWidth/sf;
    }
  else
    {
      pageHeight = pageHeight;
      pageWidth = pageHeight * sf;
    }
  if(pageHeight > sheight && pageWidth > swidth)
    {
      pageWidth = swidth;
      pageHeight = sheight;
    }
       let tx = (pageWidth)/parseFloat(swidth);
       let ty = (pageHeight)/parseFloat(sheight);
       let iframe_width = pageWidth;
       let iframe_transform = "";
       //document.getElementById('smalldiv').style.width = pageWidth;
       //document.getElementById('canvas1').style.width = parseInt(pageWidth) - 20;
       if((navigator.userAgent.indexOf("MSIE") > -1  || navigator.userAgent.indexOf("rv:11.0") > -1) && fullFrame == true)
       {          //document.getElementById('filterQueryId').style = "width:"+swidth+";height:"+sheight+";border: 1px;-ms-transform:scale(0);-webkit-transform: scale("+tx+","+ty+");-moz-transform: scale("+tx+","+ty+");-webkit-transform-origin:0 0;";
          iframe_transform = "scale(1,1)";
         //f.setAttribute('style','width:'+sdwidth+';height:'+hdheight+';webkitTransformOrigin:0 0;msTransform:scale(1,1)');
         //height = sheight;
         //f.style.webkitTransformOrigin= "0 0";
         return;
       }
       else if((navigator.userAgent.indexOf("MSIE") > -1  || navigator.userAgent.indexOf("rv:11.0") > -1) && fullFrame == false)
       {          
         iframe_transform = "scale("+tx+","+ty+")";
         //f.style = "width:"+sdwidth+";height:"+hdheight+";border: 1px;-ms-transform:scale(0);-webkit-transform: scale("+tx+","+ty+");-moz-transform: scale("+tx+","+ty+");-webkit-transform-origin:0 0;";
         //f.style.msTransform = "scale("+tx+","+ty+")";
         //f.setAttribute('style',"width:"+sdwidth+";height:"+hdheight+";border: 1px;-ms-transform:scale(0);-webkit-transform: scale("+tx+","+ty+");-moz-transform: scale("+tx+","+ty+");-webkit-transform-origin:0 0;msTransform:scale("+tx+","+ty+")");
         return;
       }
       else if(isSafari && fullFrame == true)
       {
        iframe_transform = "scale(1,1)";
        //f.style.webkitTransform = "scale(1,1)";
        //f.style.width = sdwidth;
        //f.style.height = hdheight;
        //f.style.webkitTransformOrigin= "0 0";
        //f.setAttribute('style','width:'+swidth+';height:'+height+';webkitTransformOrigin:0 0;webkitTransform:scale(1,1)'); 
        return;
       }
       else if(isSafari && fullFrame == false)
       {
        iframe_transform = "scale("+tx+","+ty+")";
        //f.style.width = sdwidth;
        //f.style.height = sheight;
        //f.style.webkitTransformOrigin= "0 0";
        //f.setAttribute('style','width:'+sdwidth+';height:'+height+';webkitTransformOrigin:0 0;webkitTransform:scale('+tx+','+ty+')');
       return;
       }
       else
       {
        iframe_transform = "scale("+tx+","+ty+")";
        //f.style = "width:"+sdwidth+";height:"+hdheight+";border: 1px;-webkit-transform: scale("+tx+","+ty+");-moz-transform: scale("+tx+","+ty+");-webkit-transform-origin:0 0;transform-origin:0 0;";
        //f.setAttribute('style',"width:"+sdwidth+";height:"+hdheight+";border: 1px;-webkit-transform: scale("+tx+","+ty+");-moz-transform: scale("+tx+","+ty+");-webkit-transform-origin:0 0;transform-origin:0 0;");
       }
       iframe_transform += " translate(-50%, 0px)";
       let r = {"iframe_transform" : iframe_transform, "width": iframe_width};
       return r;
  }

  // hiding cav side bar, as it is hiding the vertical bar 
  // step 1 :  hide the main menu side navigation bar
  // step 2 :  render pagedump properly , expand and collapse will automatically correct the positions
  static hideCavSideBar(){
    // if coming to replay, hide cav side bar
     let sidebar = <HTMLElement> document.getElementById('cavsidebar');
     if(sidebar == null)
       return;
     // hide side bar , if not hidden
     if(!sidebar.classList.contains("inactive-common-menu")){
      sidebar.className += " inactive-common-menu";
      //console.log(sidebar.className);
      }
  }

   // this will not be needed .
  hidefn(callbackfn){
    // if open during replay, wait for it to hide, when menu bar is hidden 
    // call callback function that will correct the rendering of page  dump
    var  sidebarClickbtn = <HTMLElement>document.getElementById('sidebarCollapse');
    sidebarClickbtn.addEventListener('click',()=>{
       // on click check , if side bar menu is closed, call callback function
       // that will correct the rendering of page  dump
       callbackfn();
    });
  }

  // alternative to scrollIntoView()
  // caller function will act as a type, to scroll page div or action div
  static scrollIntoView(elem,callerfn){
    //console.log("scrollIntoView -- ",callerfn ," -- ",elem);
    {
      elem.style.display ="";
      /*if(callerfn == "highlightPageinNavigator")
        document.getElementById('rpn').scrollTop =  elem.offsetTop - document.getElementById('rpn').offsetTop
      else
        document.getElementById('rpa').scrollTop =  elem.offsetTop - document.getElementById('rpa').offsetTop*/
        //document.querySelector('#currentsession').scrollTop =  elem.offsetTop -  document.querySelector('#currentsession')['offsetTop'] - 165;
        elem.scrollIntoView();
        // so that it gets time to collapse all 
        setTimeout(()=>{ReplayUtil.expand(elem);},0);
        
    }
  }
  // purpose :  to expand the corresponding page panel or ua accordian
  static expand(elem){
      //console.log("trying to expand elem info : ", elem);
      let childCount = elem.childElementCount;
      if(childCount > 0){
        if(elem.getAttribute("name") == "uadiv"){
          let uaAccord  =  elem.children[0];
          let l = uaAccord.querySelector('a');
          l.click();
          // also check for ua div that its page div should be expanded
          ReplayUtil.expand(document.querySelector("#"+elem.getAttribute("pagediv")));
        }
        if(elem.getAttribute("name") == "pagediv"){
          let pagepanel =  elem.children[0];
          //console.log("pagepanel : ", pagepanel);
          let p = pagepanel.querySelector('[name="panelbtn"]');
          // uncollapse only if not already collapsed
          if(pagepanel.className.indexOf("uncollapsed") == -1)
           p.click();
        }
      }
  }
  // to decode mouxe move data into cordinates
  static mmdecoder(data){
     //      let type = 2 // false for x-axis and true for y-axis.
     let prevx = 0, prevy = 0;
     let splittedData = data.split(',');
     let count = 0;
     let output = [[splittedData[0],splittedData[1]]];
     let coordinates = splittedData[2].split('');
     for(let i = 0;i < coordinates.length; i++) {
       var code = splittedData[2].charCodeAt(i);
       if(code > 90) {
         // process for small letters i.e, y-axis
         if( prevx != 0) {
           checkNset(prevx, 0);
           prevx = 0;
         } 
         code -= 109;
         if(code == 12 || code == -12) {
           prevy += code;
         } 
         else {
           if(prevy > 0) {
             checkNset( prevy, 1);
             prevy = 0;
           }
           else {
             checkNset( code, 1);
           }
         }
       }        else {          // process for capital letters i.e, x-axis
         if( prevy != 0 ) {
          checkNset(prevy, 1);
          prevy = 0;
        }
        code -= 77;
        if(code == 12 || code == -12) {
//          type = 1;
          prevx += code;
        }
        else {
          if(prevx != 0) {
            output.push( [prevx + code, 0]);
            count++;
            prevx = 0;
          }
          else {
            output.push([code, 0]);
            count++;
          }
        }
      }
    }
    if(prevx != 0){
      checkNset(prevx, 0);
    }
    else {
      if(prevy != 0) {
        checkNset(prevy, 1);
      }
    }
    // xORy (0 for x and 1 for y)
    function checkNset(pre, xORy) {
      if(pre != 0) {
        if(!!output[count] && output[count][xORy] == 0) {
          // set data in array y-axis part
            output[count][xORy] = pre;
          }
          else {
            if(xORy == 1)
              output.push([0,pre]);
            else
              output.push([pre, 0]);
            count++;
          }
        }
      }

      return output;
  }
  static whichTransitionEvent(el){
    // to detect transition end of eny element
    var transitions = {
          "transition"      : "transitionend",
          "OTransition"     : "oTransitionEnd",
          "MozTransition"   : "transitionend",
          "WebkitTransition": "webkitTransitionEnd"
        }
        for (let t in transitions){
          if (el.style[t] !== undefined){
            return transitions[t];
          }
        }
  }

static renderElement(x,y)
{
  var d = ReplayUtil.getReplayDocument();
  var new_elem = d.createElement("div");
  new_elem.setAttribute("name","anjali");
  new_elem.setAttribute("style","z-Index:1000;background:red;height:10px;width:10px;position:absolute;");
  new_elem.style.top = y  + "px";
  new_elem.style.left = x + "px";
  d.body.appendChild(new_elem);
}

// NOT IN USE : tried ripple effect , not working
static createRipple(element) {
  var dox = this.getReplayDocument();
  //console.log("createRipple called");
  const button = element;

  const circle = dox.createElement("span");
  const diameter = Math.max(button.clientWidth, button.clientHeight);
  const radius = diameter / 2;

  circle.style.width = circle.style.height = `${diameter}px`;
  var left = /*button.getBoundingClientRect().width +*/ button.getBoundingClientRect().left;
  circle.style.left = `${left - button.offsetLeft - radius}px`;
  var top = /*button.getBoundingClientRect().height +*/ button.getBoundingClientRect().top;
  circle.style.top = `${top - button.offsetTop - radius}px`;
  //circle.style.left = `${event.clientX - button.offsetLeft - radius}px`;
  //circle.style.top = `${event.clientY - button.offsetTop - radius}px`;
  circle.classList.add("ripple");

  const ripple = button.getElementsByClassName("ripple")[0];

  if (ripple) {
    ripple.remove();
  }

  button.appendChild(circle);
}
  static calculateSpeed(points1,points2){
    var d = Math.sqrt(Math.pow(points2[0] - points1[0], 2) + Math.pow(points2[1] - points1[1], 2))
    /**
     * lets assume a rate of 100px per second
     */
    var speed = (1/100.0 *d) ;
    //console.log("for distance : ", d, " speed calulated is : ",speed);
    return speed;
  }
  static closeAllAccordionTabs(accordion) {
    if((accordion.tabs)){
        for(let tab of accordion.tabs) {
            if(tab.selected) tab.selected = false;
        }
    }
  }

  static openAllAccordionTabs(accordion) {
    if((accordion.tabs)){
        for(let tab of accordion.tabs) {
            if(!tab.selected) tab.selected = true;
        }
    }
  }
  static hasParentClass(child, classname){
    if(child.className.split(' ').indexOf(classname) >= 0) return true;
    try{
      //Throws TypeError if child doesn't have parent any more
      return child.parentNode && this.hasParentClass(child.parentNode, classname);
    }catch(TypeError){
      return false;
    }
  }
  
}

    
