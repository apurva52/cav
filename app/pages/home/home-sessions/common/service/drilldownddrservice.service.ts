import { DdrDataModelService } from '../../../../../pages/tools/actions/dumps/service/ddr-data-model.service';
import { Injectable} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
@Injectable({providedIn : 'root'})
export class DrillDownDDRService {
                   
   masterDC:string =  null;
   protocol:string =  "";
   host:string =  "";
   port:string =  "";
   testRun:string =  "";
  constructor(private router: Router, private route: ActivatedRoute, private _ddrData: DdrDataModelService) {
                    
  } 

//   getMasterDC() 
//   {
//     if(this.masterDC == null) 
//     {
//       let dcArray = this._config.getDCInfoObj();
//       if(!dcArray || dcArray.length == 0)  {
//         console.error('NV ND DrilldownDC Info not present.');
//         this.masterDC = 'ALL';
//         return this.masterDC;
//       } 

//       for (let property in dcArray) {
//          if (dcArray[property].isMaster === true) {
//            this.masterDC  = dcArray[property].dc;
//            this.protocol = dcArray[property].protocol;
//            this.host = dcArray[property].ip;
//            this.port = dcArray[property].port;
//            this.testRun = dcArray[property].testRun;
//            break;
//          }
//       }
//     }
    
//     if(this.masterDC == null)
//     {
//       console.error('Something wrong in dc configuration, master dc not present. ');
//       this.masterDC  = 'ALL';
//     }

//     return this.masterDC;
//   }

  ndFlowpathDdr(starttime: string,endtime: string, testRun: string, fpid: string)
  {
        console.log("ndFlowpathDdr  starttime=="+starttime+"  endtime=="+endtime);
        starttime = ((parseInt(starttime) - 300) * 1000).toString();
        endtime   = ((parseInt(endtime) +1800) * 1000).toString();
        this._ddrData.serverName = undefined;
        this._ddrData.tierName = undefined;
        this._ddrData.tierId = undefined;
        this._ddrData.appName = undefined;
        this._ddrData.urlName = undefined;
        this._ddrData.btCategory = undefined;
        this._ddrData.mode = undefined;
        this._ddrData.backendId = undefined;
        this._ddrData.correlationId = undefined;
        this._ddrData.flowpathID = fpid;
        this._ddrData.startTime = starttime;
        this._ddrData.endTime = endtime;
        //this._ddrData.dcName = this.getMasterDC();
        this._ddrData.isFromNV = "1";
        this._ddrData.port = this.port;
        this._ddrData.protocol = this.protocol;
        this._ddrData.host = this.host;
        this._ddrData.testRun=testRun;
        this._ddrData.ndSessionId = undefined;
        this._ddrData.nvPageId = undefined;
        this._ddrData.nvSessionId = undefined;
        this._ddrData.urlParam = undefined;
        console.log('ndFlowpathDdr ',
                    ' fpid - ', this._ddrData.flowpathID, 
                    ' startTime - ', starttime, 
                    ' endTime - ', endtime, 
                    ' testRun - ', testRun, 
                    ' dcName - ', this._ddrData.dcName);

        //this._navService.addNewNaviationLink('ddr');
        this.router.navigate(["/ddr/flowpath"]);
  }

  ndSessionDdr(starttime: string, endtime: string, testRun: string, nvsid: string, ndsid: string, pageid: string, url: string) 
  {
        console.log("ndSessionDdr  starttime=="+starttime+"  endtime=="+endtime);
        starttime = (((parseInt(starttime)/1000) - 300) * 1000).toString() ;
        endtime = (((parseInt(endtime) / 1000) + 1800) * 1000).toString();
        this._ddrData.serverName = undefined;
        this._ddrData.tierName = undefined;
        this._ddrData.tierId = undefined;
        this._ddrData.appName = undefined;
        this._ddrData.urlName = undefined;
        this._ddrData.flowpathID = undefined;
        this._ddrData.btCategory = undefined;
        this._ddrData.mode = undefined;
        this._ddrData.backendId = undefined;
        this._ddrData.correlationId = undefined;
     this._ddrData.startTime = starttime;
     this._ddrData.endTime = endtime;
     //this._ddrData.dcName = this.getMasterDC();
     this._ddrData.isFromNV = "1";
     this._ddrData.ndSessionId = ndsid;
     this._ddrData.nvPageId = pageid;
     this._ddrData.nvSessionId = nvsid;
     this._ddrData.urlParam = url;
     this._ddrData.port = this.port;
     this._ddrData.protocol = this.protocol;
     this._ddrData.host = this.host;
     this._ddrData.testRun=testRun;
 
     console.log('ndSessionId - ',
                 ' starttime - ', starttime,
                 ' endtime - ', endtime,
                 ' nvsid - ', nvsid,
                 ' ndsid - ', ndsid,
                 ' pageid - ', pageid,
                 ' url - ', url,
                 ' dcname - ', this._ddrData.dcName);

     //this._navService.addNewNaviationLink('ddr');
     this.router.navigate(["/ddr/flowpath"]);


  }

  nfSessionDdr(pageinstance,requestType,flowpathid,sessionId,urlParam,startTime,endTime){
    let pi , i ; 
    let queryStr = "";let str = "";
    let ndsid ="";
    //Update the pageinstance.
    if(pageinstance != null)
    { 
      try {
        pi = Number(pageinstance);
        pageinstance = pi - 1;
      } catch(e) {
        console.log("Exception in nfSessionDddr ", e);
      }
    }
    if(requestType == "session")
    {
      //handling for multiple ndsessionid
      if(flowpathid == null)
        flowpathid = "";
      str = flowpathid.split(",");
      ndsid ="";
      for(i = 0 ;i < str.length;i++)
     { 
       if(i == 0)
        ndsid = "(ndsessionid:"+str[i]+")";
       else
        ndsid += " OR (ndsessionid:"+str[i]+")";
     }
     for(i = 0; sessionId.length < 21 ; i++)
     {
        sessionId = "0"+sessionId;
     }
     queryStr = "("+ ndsid +") AND ((NOT _exists_:nvsessionid) OR nvsessionid:"+ sessionId +")";
    }
    else if(requestType == "page")
    {
     //handling for multiple ndsessionid
     if(flowpathid == null)
     flowpathid = "";
     str = flowpathid.split(",");
     ndsid ="";
     for( i = 0 ;i < str.length;i++)
     {
       if(i == 0)
        ndsid = "(ndsessionid:"+str[i]+")";
        else
        ndsid += " OR (ndsessionid:"+str[i]+")";
     }
     //handling for single slash urlpram
    //  if(urlParam == "/")
    //   urlParam = urlParam.replace("/", "\\/");
    //  else
    //   urlParam = urlParam.replaceAll("/","\\/");      
 
     for( i = 0; sessionId.length < 21 ; i++)
     {
        sessionId = "0"+sessionId;
     }
 
     queryStr = "("+ ndsid +" ) AND ((NOT _exists_:nvsessionid) OR nvsessionid:"+ sessionId +") AND ((NOT _exists_:pageid) OR pageid:"+ (Number(pageinstance)) +") AND ((NOT _exists_:uripath) OR uripath:"+ escape(urlParam) +"*)";
    }
 
    console.log("queryStr in nfSessionDdr......... "+queryStr);   
    // queryStr=<query>&startTime=<startTime>&endTime=<endTime>
    this.router.navigate(["/home/logs"], { queryParams: { queryStr: queryStr ,  startTime : startTime , endTime : endTime}});
  }
}
