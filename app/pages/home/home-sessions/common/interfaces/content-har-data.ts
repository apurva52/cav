export class ContentHarData {

    contentData : any;
    pieData : any;
    har : object;
    contentTableData : any;
    constructor(harr)
    { 
      this.har = harr;
      this.contentData = this.getContentData(this.har);
      this.pieData = this.getPieData(this.contentData);
      this.contentTableData = this.getTableData(this.contentData);
      return this;
    }    
    
   getContentData(har)
   {
     if(har == null)
      return;
     let contentType = [];
     let tmp =0;
     let repeat = 0;
     let content ="";
     let arrContentResponse ={};
     let totalReq =har.log.entries.length;
     for(var i =0;i< totalReq; i++)
     {
        let entry = har.log.entries[i];
        if(entry.response.content.mimeType == undefined)
          continue;
        if(entry.response.content.mimeType.indexOf('javascript') > -1)
          content = "Scripts";
        else if(entry.response.content.mimeType.indexOf('image') > -1)
          content = "Images";
        else if(entry.response.content.mimeType.indexOf('html') > -1)
          content = "HTML";
        else if(entry.response.content.mimeType.indexOf('css') > -1)
          content = "CSS";
        else
          content = "Others";
        contentType.push(content);
   
        //CHeck we have valid time.
        if(entry.time  < 0)
          continue;
   
        if(!arrContentResponse.hasOwnProperty(content))
        {
          arrContentResponse[content] = {};
          arrContentResponse[content].time = 0;
          arrContentResponse[content].count = 0;
        }
        arrContentResponse[content].time += entry.time;
        arrContentResponse[content].count ++;
     }
     let result = this.getDistinctCount(contentType);
     let arrContentType = result[0];
     let arrRequest =result[1];
     let arrRequestPct = this.getRequestPct(arrRequest,totalReq);
     let completeData = {};
     completeData["arrContentType"] = [];
     completeData["arrContentType"] = arrContentType;
     completeData["arrRequest"] = arrRequest;
     completeData["arrRequestPct"] = arrRequestPct;
     completeData["arrContentResponse"] = arrContentResponse;
     completeData["totalResponse"] = this.getTotalResponse(har);
     return completeData;
   }
   getTotalResponse(har)
   {
     if(har == null)
      return 0;
     let totalRes = 0;
     let totalReq = har.log.entries.length;
     for(var i =0;i< totalReq; i++)
     {
       let entry = har.log.entries[i];
       totalRes +=entry.time;
     }
     return totalRes;
   }
   
   getRequestPct(a,b)
   {
     let pct =[];
     for(let i =0; i< a.length; i++)
     {
       pct[i] = ((a[i]/b)*100).toFixed(2);
     }
      return pct;
   }
   
   
   getDistinctCount(arr) {
       let a = [], b = [], prev;
   
       arr.sort();
       for ( let i = 0; i < arr.length; i++ ) {
           if ( arr[i] !== prev ) {
               a.push(arr[i]);
               b.push(1);
           } else {
               b[b.length-1]++;
           }
           prev = arr[i];
       }
   
       return [a, b];
   }
   
   getPieData(obj)
   {
       console.log("getPieData called : ", obj);
       let content = [];
       let sign = "%";
       for(let i =0; i< obj.arrContentType.length; i++)
       {
          let c = {};
          let sselect = ((obj.arrContentResponse[obj.arrContentType[i]].time/obj.totalResponse)*100).toFixed(2);
          c["name"] = obj.arrContentType[i] ;
          c["y"] = parseFloat(sselect);
          content.push(c);
       }
       return content; 
   }
   getTableData(contentdata)
   {
       let ctd = [];
       for(let i=0, j=0, k=0 ; i< contentdata.arrContentType.length, j < contentdata.arrRequest.length, k < contentdata.arrRequestPct.length; i++,j++,k++)
       {
         console.log("Inside Loop : ", ctd);
         let obj = {};
         obj["ContentType"] = contentdata.arrContentType[i];
         obj["Request"] = contentdata.arrRequest[j]; 
         obj["RequestPct"] = Number(contentdata.arrRequestPct[k]); 
         obj["AvgResponse"] = Number((contentdata.arrContentResponse[contentdata.arrContentType[i]].time/contentdata.arrContentResponse[contentdata.arrContentType[i]].count).toFixed(2)); 
         obj["LoadDuration"] = Number(((contentdata.arrContentResponse[contentdata.arrContentType[i]].time/contentdata.totalResponse)*100).toFixed(2)); 
         ctd.push(obj);
       }
       return ctd;
   }
   }
   