export class Distribution {

    dataArray : any;
    hostName : any;
    hostRequest : any;
    hostRequestPct : any;
    hostObj : any;
    totalResponse : any;
    pieData : any;
    hostTableData : any;
    
    constructor(obj)
    { 
       this.hostName = obj.hostName;
       this.hostRequest = obj.hostRequest;
       this.hostRequestPct = obj.hostRequestPct;
       this.hostObj = obj.hostObj;
       this.totalResponse = obj.responseTime;
       this.dataArray = null;
       this.pieData = this.getData();
       this.hostTableData = this.getHostTableData(this.hostName,this.hostRequest,this.hostRequestPct,this.hostObj,this.totalResponse);
       
     }
   
     getRaw()
     {
        console.log("getRaw called : ", this);
        return this;
     }
   
      getData()
      {
         console.log("getData called ");
         let pageLoadObj = {};
         let arrHostRes = {};
         let arrHostReq = {};
         let optionData = [];
         for( let e = 0; e < this.hostName.length; e++)
         {
           pageLoadObj[this.hostName[e]] = (((this.hostObj[this.hostName[e]].time/this.totalResponse)*100).toFixed(2));
           arrHostRes[this.hostName[e]] = ((this.hostObj[this.hostName[e]].time/this.hostObj[this.hostName[e]].count).toFixed(2));
           arrHostReq[this.hostName[e]] = this.hostObj[this.hostName[e]].count;
         }
         let plArray = this.sortGrp(pageLoadObj, false);
         let resArray = this.sortGrp(arrHostRes, false);
         let reqArray = this.sortGrp(arrHostReq, false);
   
         let plData = [];
         plData.push(pageLoadObj);
         plData.push(plArray);
   
         let reqData = [];
         reqData.push(arrHostReq);
         reqData.push(reqArray);
   
         let resData = [];
         resData.push(arrHostRes);
         resData.push(resArray);
   
         optionData = this.getFinalData(plData);
         return optionData;
   
      }
   
      getFinalData(Array)
      {
         let obj = Array[0];
         let sortedArray = Array[1];
         let DataArray =[];
         let DataName = [];
         let data =[];
         let len = 10;
         if(sortedArray.length < len)
           len = sortedArray.length;
         for(let l=0; l < len; l++)
         {
           DataArray.push(obj[sortedArray[l]]);
           DataName.push(sortedArray[l]);
           let entry = {};
           entry["name"] = sortedArray[l];
           entry["y"] = parseFloat(obj[sortedArray[l]]);
           data.push(entry);
         }
         return data;
         }
   
      sortGrp(grp, flag)
      {
        let keysSorted = [];
        if(!flag)
          keysSorted = Object.keys(grp).sort(function(a,b){return grp[b]-grp[a]})
        else
          keysSorted = Object.keys(grp).sort(function(a,b){return (grp[b].time/grp[b].count)-(grp[a].time/grp[a].count)})
        return keysSorted;
      }
      getHostTableData(hostName,hostRequest,hostRequestPct,hostObj,totalResponse)
      {
         let htd = [];
         for(let i=0, j=0, k=0 ; i< hostName.length, j < hostRequest.length, k < hostRequestPct.length; i++,j++,k++) 
         {
            let obj = {};
            obj["hostName"] = hostName[i];
            obj["hostRequest"] = hostRequest[j]; 
            obj["hostRequestPct"] = Number(hostRequestPct[k]);
            obj["hostAvgResponse"] = Number((hostObj[hostName[i]].time/hostObj[hostName[i]].count).toFixed(2));       
            obj["hostLoadDuration"] = Number(((hostObj[hostName[i]].time/totalResponse)*100).toFixed(2));
            htd.push(obj);
         }
         return htd;
      }
   }
   