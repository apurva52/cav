//import { Http, Response } from '@angular/http';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { NvhttpService  } from './../service/nvhttp.service';
import { Session } from "./session";
declare var unescape: any;
export class PageDump {

 val = '';
 src = '';
 protocolVersion = '';
 clientIp = '';
 index = 0;
 sid = '';
 sessionStartTime:number;
 pageInstance = '';
 partitionID = '';
 httpservice:NvhttpService;
 pageurl = '';
 sessioninfo = {};
 currentpageinfo = {};
 screenResolution = '';
 resourceversion:number;
 base : any;
 sanitizer : DomSanitizer;


 constructor(val,session:Session,pageinstance,httpservice,page,sanitizer: DomSanitizer)
 {
   this.val = val;
   this.sanitizer = sanitizer;
   this.index = pageinstance;
   this.clientIp = session.clientIp;
   this.protocolVersion = (session.protocolVersion).toString();
   this.sid = session.sid;
   this.httpservice = httpservice;
   this.sessionStartTime = session.startTime;
   this.partitionID = session.partitionID;
   this.pageInstance = pageinstance;
   this.pageurl = page.url;
   this.screenResolution = session.screenResolution.dim;
   this.resourceversion = session.resourceVersion;
   this.base = environment.api.netvision.base.base;
 }

getPageDump()
 {
  //console.log("this.val == > ", this.val);
  let src = "";
  let currentpageindex = this.index;
  if(this.val.trim() == "NA")
  {
    this.postAjaxRequest();
  }
  else if(this.val.trim() == "")
  {
    this.src= 'noPageDump.html';
    let url =  this.base + 'netvision/reports/noPageDump.html';
    let pagedump = document.getElementById('pagedumpid');
    setTimeout(()=>{
      pagedump.setAttribute('src',url);
      this.setStyleOfPageDump(pagedump);},2000);
  }
  else
  {
    let filePath = this.val;
    let url = null;
    let basePath = this.getBasePathURL(this.pageurl);
    if(this.protocolVersion === "1")
    {
       url = `netvision/reports/nvgetJsonPageDump.jsp?filepath=` + filePath + `&strFileType=gzip&pageIndex=`
              + currentpageindex + `&protocolversion=`+ this.protocolVersion + `&resourceversion=`+this.resourceversion+
               `&basePath=`+ basePath + `&userType=Admin&pageurl=`+ this.pageurl;
    }
    else if(this.protocolVersion === "200")
    {
      url = "netvision/reports/nvAndroidPageDump.jsp?strFileName=" + filePath + "&strFileType=gzip" +
      "&basepath="+basePath+  "&protocolversion="+ this.protocolVersion;
    }
    else {
      url = "netvision/reports/nvOpenCompressedSnapshot.jsp?strFileName=" + filePath + "&strFileType=gzip" + "&basepath="+basePath;
    }
      url =  this.sanitizer.bypassSecurityTrustResourceUrl(this.base + url);
      let pagedump = document.getElementById('pagedumpid');
      setTimeout(()=>{
      pagedump.setAttribute('src',url);
      this.setStyleOfPageDump(pagedump);},2000);
  }
 }


  postAjaxRequest()
  {
     this.httpservice.getSnapShotPathThroughAjax(this.index, this.sessionStartTime, this.sid, this.pageInstance, this.partitionID, 0)
        .subscribe(response => {
         this.getAjaxResponse(response,'getSnapShotPath');

      });
  }


// used to remove ip and port from the current path url

  getBasePathURL(clientip)
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
     return mainurl.substring(0,mainurl.lastIndexOf("/"));
  }


   getAjaxResponse(str,fromOperation)
   {
    //console.log("str == > ", str , " fromOperation == > ",fromOperation );
    let arrTemp = [];
    let pageDumpPath = "";
    let url = '';
    let currentpageindex = this.index;

    if(fromOperation.trim() === "getSnapShotPath")
    {
     arrTemp = str.split("%%%");
     let index = Number(arrTemp[1]);
     this.val = arrTemp[0].trim();
     if(this.val === "")
     {
       this.src = "noPageDump.html";
       let path = this.base + "netvision/reports/noPageDump.html";
       url = this.base + "netvision/reports/noPageDump.html";
       pageDumpPath = path;
     }
     else
     {
      let filepath = arrTemp[0].trim();
      this.val = arrTemp[0].trim();
      pageDumpPath = filepath;
      let basePath = this.getBasePathURL(this.clientIp);
      if(this.protocolVersion === "1")
      {
       url = `netvision/reports/nvgetJsonPageDump.jsp?filepath=` + filepath + `&strFileType=gzip&pageIndex=`
              + currentpageindex + `&protocolversion=`+ this.protocolVersion + `&resourceversion=`+ this.resourceversion +
      `&basePath=`+ basePath + `&userType=Admin&pageurl=`+ this.pageurl;
      }
      else if(this.protocolVersion === "200")
      {
        url = "netvision/reports/nvAndroidPageDump.jsp?strFileName=" + filepath + "&strFileType=gzip" +
         "&basepath="+basePath + "&protocolversion="+ this.protocolVersion;
      }
      else
      {
        url = "netvision/reports/nvOpenCompressedSnapshot.jsp?strFileName=" + filepath + "&strFileType=gzip" +
        "&basepath="+basePath;
      }
      }
      url = this.base + url;
      let pagedump = document.getElementById('pagedumpid');
      setTimeout(()=>{
      pagedump.setAttribute('src',url);
      this.setStyleOfPageDump(pagedump);},2000);
     }
   }


setStyleOfPageDump(pagedump)
{
  let swidth = this.screenResolution.substring(0,this.screenResolution.indexOf("x"));
  let sheight = this.screenResolution.substring(this.screenResolution.indexOf("x")+1,this.screenResolution.length);
  let sf: number;
  sf = parseInt(swidth)/parseInt(sheight);
  let pageWidth: any = parseInt(pagedump.clientHeight) + parseInt(pagedump.scrollHeight);
  let pageHeight: any = parseInt(pagedump.clientWidth);
  if(sf > 1)
   {
      pageWidth = pageWidth;
      pageHeight =  parseInt(pageWidth)/sf;
    }
   else
   {
      pageHeight = pageHeight;
      pageWidth = parseInt(pageHeight) * sf;
   }

    //Check if current view height/width are greater than actual size then take the actual size as pageHeight and pageWidth.
    if(parseInt(pageHeight) > parseInt(sheight) && parseInt(pageWidth) > parseInt(swidth))
     {
         pageWidth = swidth;
         pageHeight = sheight;
     }

     let tx = parseFloat(pageWidth)/parseFloat(swidth);
     let ty = parseFloat(pageHeight)/parseFloat(sheight);

     /*pagedump.setAttribute('style','width:"+swidth+";height:"+sheight+";border: 1px;
     -ms-transform:scale("+tx+","+ty+");-ms-transform-origin:0 0;-webkit-transform: scale("+tx+","+ty+");
     -moz-transform: scale("+tx+","+ty+");-webkit-transform-origin:0 0;transform-origin:0 0;');
     */
     pagedump.setAttribute('style','width: ' + swidth + 'px;height: '+ sheight +'px;-ms-transform-:scale('+tx+','+ty+');-ms-transform-origin:0 0;-webkit-transform-: scale('+tx+','+ty+');-moz-transform-: scale('+tx+','+ty+');-webkit-transform-origin:0 0;transform-origin:0 0;');

    }
}
