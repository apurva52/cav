import { OnInit, Injectable } from '@angular/core';
import { SessionService } from 'src/app/core/session/session.service';
import * as jQuery from 'jquery';
import { TransactionFlowMapService } from './transaction-flowmap.service';

@Injectable()
export class TransactionFlowMapServiceInterceptor{

    constructor(
        // private transactionFlowMapService: TransactionFlowMapService,
        private sessionService: SessionService,
      ) { }




  ////old vars//////
  ndeInfoData = [];
  jsonforflowmap = [];
  jsonData = {};
  jsondataforTable;
  totalFPDuration = 0;
  seqNum = 0;
  mergedSourceMap = {};
  aggregateSimialrTypes = {};
  hosturl
  DEFAULT_NDE_ID = -1;
  urlParam;
  childFlowpatthData = "";
  //paramsForFlowMap: FlowpathDataInterface;
  private _fpDuration: any;
  showOrigFlowmap: boolean = false;
  isRootFpMissing: boolean = false;
  jsonDataToDraw : any;
  newSqbvalue = 0;
  duplicateSeqNum = [];//checking for duplicate seqno
  isFirstRoot: boolean = false; //it for check root fp in multidc case
  jmsSourceId: any;
  backEndData: any;
  allDCData:any;
  entryFPI:any;
  ///////

  input: any;








  //constructor() { }
 



  test(data) {
    this.allDCData = data.panels[0].data;
    this.backEndData = data;
    //console.log("BackendData ", data);
    this.sessionService.setSetting("TrxFMBackEndData", this.backEndData);
    this.jsonforflowmap = data.panels[0].data.dtoList;
    console.log("DTO List coming from backend",this.jsonforflowmap);
    //console.log(this.jsonforflowmap.testRun);
    this.jsonData = this.mergeDataForTransactionFlow(this.jsonforflowmap);
    console.log( "Inside the test for merge jsonData", this.jsonData);
    this.jsonDataToDraw = this.jsonData;
    this.jsonData = this.adapter( this.jsonData);
    console.log( "Inside the test for jsonData", this.jsonData);
  }

  // get individual node data based on node id to create payload for other reports
  getNodeData(){
    const me = this;
    let nodeData:any;
    var nodeId = me.sessionService.getSetting("nodeId");
    // console.log("jasondata to draw",me.jsonDataToDraw)
    for (var i = 0; i < me.jsonDataToDraw.length; i++) {
      if (me.jsonDataToDraw[i].id == nodeId) {
        nodeData = me.jsonDataToDraw[i];
        console.log("individual node data",nodeData)
        me.sessionService.setSetting("TxnFMData", nodeData);
        me.sessionService.setSetting("reportID", "ATF");
        me.sessionService.setSetting("isSource", "isFromMain");
        break;
      }
    }
  }

  
  //phase 1- 615 original

  //TODO - Merge Data 
  dataforaggre
  mergeDataForTransactionFlow(json) {
    this.duplicateSeqNum = [];//blank value in case of   
    var startTime = new Date().getTime();
    //console.log(" get mergeDataForTransactionFlow is start , startTime is  "+startTime);
    // Sort ASC
    //console.log("sort json", json);
    console.log('json isssss ', json, '', this.compareDESC);
    if (!json) {
      //this.CommonServices.loaderForDdr = false;
      return;
    }
    this.jsonforflowmap = json.sort(this.compareDESC);
    this.dataforaggre = []; //list
    this.firstLevel = 1;
    for (var i = 0; i < this.jsonforflowmap.length; i++) {
      var val = this.jsonforflowmap[i];
      if (val.isAlreadyUsed == false)
        this.processCallData(i, this.dataforaggre);
    }

    var coordinates = "";

    if (sessionStorage.getItem("coordinates_" + this.childFlowpatthData) != undefined) {
      //coordinates = sessionStorage.getItem("coordinates_" + this.childFlowpatthData);
    }
     console.log("aggregate for data >>>>>>",this.dataforaggre);
     console.log("dataforaggre", JSON.stringify(this.dataforaggre));

    //TBD//
    var aggregateJSON = this.getDataWithParentChild(this.dataforaggre, coordinates);
    var endTime = new Date().getTime();
    // console.log("method mergeDataForTransactionFlow is end , end time is  " + endTime + "  and duration is " + (endTime - startTime));
    return aggregateJSON;
  }
  compareDESC(A, B) {
    return parseInt(A.depth) - parseInt(B.depth);
  }
  isFPMissCase = false;
  missFPId: boolean = false;;
  firstLevel = 1;



  processCallData(index, data) { 
    var val = this.jsonforflowmap[index];
    var parentLevel = 1;
    //When already with depth 1 is added,increase depth by 1.
    if (val.depth == 1 || data.length == 0 || val.level == undefined) {

      //console.log(" val.depth " + val.depth + " --- data.length " + data.length + "   val.level  " + val.level + "  and index is    " + index);
      val["level"] = "1";
      val.backEndId = -1;
      val.backEndDuration = 0;
      val.backendType = 0;
      val.backendSubType = -1;
      if (index > 0) {
      if(!val.urlName.startsWith("JMSC")) {
        val.level = "1." + Number(this.getLevelForErrCase());//+Number(this.firstLevel);// commenting firstLevel
        this.isFPMissCase = true;
      } 
      else
        val.level = "1.p" + Number(this.getLevelForErrCase())+Number(this.firstLevel);  //JMSC
        // console.log(" level ---->"   +val.level);
        this.missFPId = this.replaceAll(val.level, ".", "_"); //this id pass in trxFlow for indicating partial flow
        //console.log("missFPId------"+missFPId);
         this.firstLevel++;
      }

      data.push(val);
    }
    
    var lastIndexDotBeginSq = (val.beginSeqNum).lastIndexOf("."); //getting begin sequence no from last index of .
    var tmpBeginSeq = "";
    //if(lastIndexDotBeginSq == -1)
    //tmpBeginSeq = val.beginSeqNum; //TODO -> error - log in console, ignore data 

    tmpBeginSeq = (val.beginSeqNum).substring(0, (val.beginSeqNum).lastIndexOf("."));
    val["childErCount"] = 0;
  if(val.callOutList && val.callOutList.length > 0) {
    val.callOutList.forEach((callOutVal, callOutIndex) => {

      if (callOutVal.seqNum != undefined && callOutVal.seqNum.length != 0) //Removing T0 Case
      {
        //Change in sequence number logic

        var chkSeqNum = "";
        chkSeqNum = tmpBeginSeq + "." + callOutVal.seqNum;

        //TODO - Concat here only rather than creating string every time
        for (var k = (index + 1); k < this.jsonforflowmap.length; k++) // loop through json
        {

          //console.log("index " + index + " k = " + k + " json[k] = " + this.jsonforflowmap[k].tierName);
          var jsonLocalObj = this.jsonforflowmap[k];

          if (jsonLocalObj.depth > val.depth + 1) {
            //console.log("Breaking because of next json array length is higher than current json length+1 ............ " + jsonLocalObj.depth);
            break;
          }


          if (jsonLocalObj.depth < val.depth + 1) {

            console.log("Continueing  ............ " + jsonLocalObj.depth);
            continue;
          }

         // console.log(jsonLocalObj.isAlreadyUsed,"---------flowpathinstance------",jsonLocalObj.flowPathInstance," jsonLocalObj.beginSeqNum = " + jsonLocalObj.beginSeqNum + " chkSeqNum = " + chkSeqNum);
          if (jsonLocalObj.isAlreadyUsed == false && (jsonLocalObj.beginSeqNum.trim() == (chkSeqNum + ".1")) && !(callOutVal.backEndType == 11 || callOutVal.backEndType == 12 || callOutVal.backEndType == 13 || callOutVal.backEndType == 14)) //TODO 
          {
            jsonLocalObj.callOutType = callOutVal.callOutType;
            jsonLocalObj.backEndId = callOutVal.backendId;
            jsonLocalObj.backendType = callOutVal.backEndType;
            jsonLocalObj.backendSubType = callOutVal.backendSubType;
            jsonLocalObj.erCount = callOutVal.errorCount;
            jsonLocalObj.statusCODE = callOutVal.statusCODE;
            jsonLocalObj["level"] = val.level + "." + parentLevel++;
           // console.log("Tier  -level going to change here ... " + jsonLocalObj.level, "check ",this.duplicateSeqNum.indexOf(jsonLocalObj.beginSeqNum.trim()));
             //console.log("duplicate seq no value------",this.duplicateSeqNum);
            if(this.duplicateSeqNum.indexOf(jsonLocalObj.beginSeqNum.trim()) == -1)// checking condition for duplicate sequence no
            {
            jsonLocalObj.backEndDuration = callOutVal.backEndDuration;
            jsonLocalObj.totalNetworkDelay=callOutVal.totalNetworkDelay;
            callOutVal.alreadyUsed = true;
            jsonLocalObj.isAlreadyUsed = true;
            this.duplicateSeqNum.push(jsonLocalObj.beginSeqNum.trim());
            }
            else
            {
              callOutVal.alreadyUsed = true;
              jsonLocalObj.isAlreadyUsed = true;
              jsonLocalObj.backEndDuration = undefined;
              jsonLocalObj.totalNetworkDelay=undefined;
            }
                       
            this.dataforaggre.push(jsonLocalObj);
            console.log("this.jsonforflowmap[k].callOutList ", this.jsonforflowmap[k].callOutList, this.jsonforflowmap[k].callOutList.length);
            if(this.jsonforflowmap[k].callOutList && this.jsonforflowmap[k].callOutList.length > 1)
              this.processCallData(k, data);
            else
              break;   
            //not breaking here after getting a child sequence num. It may so happen that there are two child flowpath with same sequence number  
          }
        }
        //Child flowapth not found
        if (callOutVal.alreadyUsed == false) {
        //  console.log("Index is "+callOutIndex+"   it is a case of filling entry of backends......");
          var newObject = {};
          newObject["tierName"] = "-";
          newObject["tierId"] = -1;
          newObject["serverName"] = "-";
          newObject["serverId"] = -1;
          newObject["appName"] = "-";
          newObject["appId"] = -1;
          newObject["urlName"] = "-";
          newObject["urlIndex"] = -1;
          newObject["urlQueryParmStr"] = "-";
          newObject["beginSeqNum"] = "-1";
          newObject["flowPathInstance"] = val.flowPathInstance;
          newObject["previousFlowPathInstance"] =  val.previousFlowPathInstance;
          newObject["startTime"] = 0;
          newObject["fpDuration"] = 0;
          newObject["methodscount"] = -1;
          newObject["statusCode"] = -1;
          newObject["threadId"] = -1;
          newObject["depth"] = -1;
          newObject["callOutType"] = "-";
          newObject["backEndId"] = -1;
          newObject["backEndDuration"] = -1;
          newObject["backendType"] = "-";
          newObject["backendSubType"] = "-";
          newObject["alreadyUsed"] = false;
          newObject["level"] = val.level + "." + parentLevel++;
          newObject["ndeId"] = val.ndeId; //adding nde Id
          newObject["erCount"] = "0";
          newObject["statusCODE"] = "-";
          newObject["resourceId"] = "-";
          newObject["totalNetworkDelay"]="-1";
          if (index == 0)
            this.setLevelForErrCase(parentLevel);
          //console.log("parentLevel------------------"+parentLevel);

          newObject["depth"] = val.depth + 1;
          newObject["callOutType"] = callOutVal.callOutType;
          newObject["backEndId"] = callOutVal.backendId;
          newObject["backEndDuration"] = callOutVal.backEndDuration;
          newObject["backendType"] = callOutVal.backEndType;
          newObject["erCount"] = callOutVal.errorCount;
          newObject["statusCODE"] = callOutVal.statusCODE;
          newObject["backendSubType"] = callOutVal.backendSubType;
          val.childErCount += callOutVal.errorCount;
          newObject["resourceId"] = callOutVal.resourceId;
           newObject["totalNetworkDelay"]=callOutVal.totalNetworkDelay;
          if (callOutVal.mapDBCallouts != undefined) {
            console.log("Adding new Entry for DB Callouts ", callOutVal.mapDBCallouts,"checkk ",callOutVal.backendId);
            newObject["dbCallOuts"] = callOutVal.mapDBCallouts;
          //tbd  var e = this.getDBErrorCount(callOutVal.mapDBCallouts);
           // val.childErCount = e;
          }
          else if (callOutVal.coherenceCallOuts != undefined) {
            // console.log("Adding new Entry for Coherence ");
            newObject["coherenceCallOuts"] = callOutVal.coherenceCallOuts;
          }

          val.isAlreadyUsed = true;
          callOutVal.alreadyUsed = true;
          this.dataforaggre.push(newObject);
        }

      }

    });
  }
  console.log("Data for Agg:-", this.dataforaggre);
  }
  
  

/////phase 2 line 824 original

transactionDataList
//This Function will be called after parent-child linkage from Remote NDE
getDataWithParentChild(json, coordinatesData) {
  //get aggregate node information
  this.transactionDataList = this.getAggregateBackendMap(json);
  //sessionStorage.setItem("transactionDataList",JSON.stringify(this.transactionDataList));
  console.log("Aggregation Done ...",this.transactionDataList);
  //console.log("after", JSON.stringify(this.transactionDataList));

  //create JSON format from aggregate data node
  var nodeData = this.prepareJSON(this.transactionDataList, coordinatesData);
  console.log("prepareJSON node data length - " + nodeData);
 console.log(JSON.stringify(nodeData));
  return nodeData;
}



getDBErrorCount(dbCalllouts) {
  var errorCount = 0;
  var dbCallouts = []
  for(let i = 0; i < dbCalllouts.length; i++){
    dbCallouts[i] = dbCalllouts[i];
  }
 // console.log('dbCallouts',JSON.stringify(dbCalllouts) );
  dbCallouts.forEach((value, index) => {
    errorCount += value.errorCount;
  });
  return errorCount;
}
//This method is used to aggregate the node data
getAggregateBackendMap(json) {
  var transactionList = [];
  var backendMonitoringLists = [];
  //add undefined
  transactionList.push(undefined); //DEPTH 0 hence undefined
  var aggregateMap = {};
  //Loop through Json data
  json.forEach((val, index) => {
   // console.log("valuuu", val);
    if (index == 0) {
      this.totalFPDuration = val.fpDuration;
      //To Find entryFPI Id for NF Entry point(In LRM)
      this.entryFPI = val.flowPathInstance;
      //console.log(" totalFpDuration = " + totalFPDuration);
    }

    if (val.depth < transactionList.length) {
      //console.log("aggregateMapf", transactionList[val.depth]);
      aggregateMap = transactionList[val.depth];
      //get aggregate map by depth basis

      //If map is undefined and size is zero then return new map
      if (aggregateMap == undefined || this.getSize(aggregateMap) == 0) {
        //console.log("  ERROR : aggregateMap is null or size is zero  , aggregateMap = " + aggregateMap);
        return [];

      }

      //If map does'nt contains uniqueAppName as a key
      if (!aggregateMap.hasOwnProperty(this.getUniqueAppName(val))) {
        var backendMonitoringLists = [];
        this.seqNum++;
        val.index = this.seqNum;

        backendMonitoringLists.push(val);
        aggregateMap[this.getUniqueAppName(val)] = backendMonitoringLists;
        transactionList.push[val.depth] = aggregateMap;

      }

      else // if map has the uniqueAppName entry 
      {
        //Lets assume 1.2 and 1.3 are merged
        //Their Childs 1.2.1 and 1.2.2 and 1.3.1 and 1.3.2
        //console.log("aggregatemap", aggregateMap, aggregateMap[this.getUniqueAppName(val)]);
        backendMonitoringLists = aggregateMap[this.getUniqueAppName(val)];

        if (backendMonitoringLists.length > 0) {

          if (this.getParentLevel(val) == this.getParentLevel(backendMonitoringLists[0]) || this.getParentLevel(backendMonitoringLists[0]) == this.aggregateSimialrTypes[this.getParentLevel(val)]) {
            //aggregating same backend
            backendMonitoringLists.push(val);
            aggregateMap[this.getUniqueAppName(val)] = backendMonitoringLists;
            //console.log(" Merged are : " + val.level + " ---------- " +  backendMonitoringLists[0].level);      
            this.aggregateSimialrTypes[val.level] = backendMonitoringLists[0].level;
            transactionList.push[val.depth] = aggregateMap;
          }

          else {
            //Check for this backend existence in hashmap
            var uniqueStr = "";
            if (this.aggregateSimialrTypes[this.getParentLevel(val)] == undefined)
              uniqueStr = this.getUniqueAppName(val) + "_" + this.getParentLevel(val);

            else
              uniqueStr = this.getUniqueAppName(val) + "_" + this.aggregateSimialrTypes[this.getParentLevel(val)];

            //console.log("uniqueStr === " +uniqueStr);
            var parentDifferentDTOs = aggregateMap[uniqueStr];
            if (parentDifferentDTOs == undefined) {
              parentDifferentDTOs = [];
              this.seqNum++; //incrementing seqNum when ever we are adding a new key in hashmap
              val.index = this.seqNum;
            }

            parentDifferentDTOs.push(val);
            aggregateMap[uniqueStr] = parentDifferentDTOs;
            transactionList.push[val.depth] = aggregateMap;
          }
        }

      }
    }

    else {
      if (val.depth != transactionList.length)//Minimum case where depth should be equal to length
      {
        //ERROR CASE- where depth starts from 2 or 3 or so on.
        for (var loopCount = transactionList.length; loopCount < val.depth; loopCount++) {
          //console.log("WARNING : Depth starting from " + val.depth + " , transactionList length = " + transactionList.length + "which is invalid and hence adding undefined ");
          transactionList.push(undefined);
        }
      }

      //Initial Case ,create new map and add to the List
      aggregateMap = {};
      this.seqNum++;
      val.index = this.seqNum;
      var transactionTracingList = [];
      transactionTracingList.push(val);
      aggregateMap[this.getUniqueAppName(val)] = transactionTracingList;
      transactionList.push(aggregateMap);

      // reserving a seqNum(index) for queue that will be inserted later. queue's seqNum(index) will be one less than respective instance index
      //modified notreserving in case of backend 
   /*   if (val.backendType == 11 || val.backendType == 12 || val.backendType == 13 || val.backendType == 14) {
        if (val.appName != "-")   //if it is instance not backend   
        {
          this.seqNum++;
          val.index = this.seqNum;
        }
      } */
    }
  });
  return transactionList;
}



//This function used to create JSON structure depending upon the aggregation of the nodes.
prepareJSON(transactionList, coordinatesData) {
   console.log("transaction list after", JSON.stringify(transactionList));
   var nodeData = [];

   transactionList.forEach((val, index) => {

     if (val == undefined) {
       console.log(" transactionList is undefined..." + val);
     }
     else {
       var aggregatedInfoMap = val;
       if (aggregatedInfoMap == undefined || this.getSize(aggregatedInfoMap) == 0) {
         console.log("aggregatedInfoMap is undefined... ");
       }
       for (var obj in aggregatedInfoMap) {
         var key = obj;
         var value = aggregatedInfoMap[key];
         var aggInfoProperties = undefined;
         value.forEach((aggVal, aggindex) => {
          //TBD
          if (aggInfoProperties == undefined) {
             aggInfoProperties = this.agreegateInfoProperties(aggVal, key);
           }
           else {
             aggInfoProperties = this.addAggregateInfoProperties(aggVal, aggInfoProperties);
           }

         });

         if (aggInfoProperties != undefined) {
           nodeData.push(aggInfoProperties);
         }
       }
     }
   });

   //inserting a virtual node between two instances if there is JMS call between them
 /*  jQuery.each(nodeData, function (index, val) {
     //console.log("coming for jquery", nodeData);
     if (val.backendTypeId == 11 || val.backendTypeId == 12 || val.backendTypeId == 13 || val.backendTypeId == 14) {

       //case when there is call like [Tier -> JMS call -> backend]  there is no need to show backend. only queue will be shown in gui.      
       if (val.appName == "-")    //backend case
       {
         val.icon = "jmsqueue.png";
       }
       else {

         var queue = jQuery.extend({}, val);

         queue.id = "queue_" + val.id;

         // queue.id = "queue_"+val.sourceId;
         queue.sourceId = val.sourceId;

         // attributes that will be same as to node
         queue.backendTypeId = val.backendTypeId;
         queue.backendType = val.backendType;
         queue.backendId = val.backendId;
         queue.backendName = val.backendName;
         queue.backendActualName = val.backendActualName;
         queue.depth = val.depth;
         queue.key = val.key;

         queue.mappedAppName = val.backendName;

         queue.tierId = -1;
         queue.serverId = -1;
         queue.appId = -1;
         queue.tierName = "-";
         queue.serverName = "-";
         queue.appName = "-";

         queue.index = parseInt(val.index) - 1;
         queue.icon = "jmsqueue.png";
         val.sourceId = queue.id;
         nodeData.push(queue);
       }
     }
   }); */
//TBD - coordinates
  // if (coordinatesData == undefined || coordinatesData == "")
    // this.setZigZagPosition(nodeData);
 //  else
    // this.setActualCoordinates(nodeData, coordinatesData);

   return nodeData;
 }


 //helpers 
 //This method is used to get the MAP Size
 getSize(object) {
  var len = 0;
  for (var o in object) {
    len++;
    return len;
  }
}
getUniqueAppName(val) {

  var callOutType = val.callOutType;

  // if(callOutType === "c")
  // callOutType = "C";

  var uniqueName = val.tierName + "_" + val.serverName + "_" + val.appName + "_" + val.depth + "_" + val.backendType + "_" + val.callOutType + "_" + val.backEndId;

  return uniqueName;
}

getParentLevel(val) {
  return val.level.substring(0, val.level.lastIndexOf("."));
}




/////////

//Phase 3 -- 1136 original

 //This function is used to aggregate the node data which has same uniqueappname(For first time)
 agreegateInfoProperties(val, key) {
  var object;
  //Create new object
  var aggregateInfoProperties = {
    "id": "",
    "key": "",
    "sourceId": "",
    "backendName": "",
    "backendType": "",
    "backendTypeId": 0,
    "count": 0,
    "cumFpDuration": 0,
    "avgFpDuration": 0,
    "url": "",
    "urlIndex": 0,
    "cumBackendDuration": 0,
    "avgBackendDuration": 0,
    "depth": 0,
    "tierName": "",
    "serverName": "",
    "appName": "",
    "mappedAppName": "",
    "tierId": 0,
    "serverId": 0,
    "appId": 0,
    "flowpathInstance": "",
    "correlationid": "",
    "threadId": 0,
    "percentage": 0,
    "backendPercentage": 0,
    "mergedArrayIndex": 0,
    "icon": "",
    "instanceType": "",
    "startDateTime": "",
    "left": 0,
    "top": 0,
    "callOutType": "",
    "urlQueryParmStr": "",
    "index": 0,
    "methodCount": 0,
    "fpDuration": 0,
    "max": 0,
    "backendActualName": "",
    "startTimeInMs": "",
    "erCount": 0,
    "statusCODE": "",
    "backendId": "",
    "childErCount": 0,
    "instanceTypeTopology": "-",
    "min": 0,// it  is used to show min duration in Thread Callout
    "resourceId": "-",
    "exceptionCount": 0,
    "flowPathType": "-",
    "totalNetworkDelay":"-1",
    "avgNetworkDelay":"",
    "prevFlowpathInstance":""
  };

  //console.log("val.level  "+val.level);
  //replace the level "." by "_"
  console.log("val.level",val.level,val);
  console.log("aggregateInfoProperties",aggregateInfoProperties);
  console.log("this.replaceAll",this.replaceAll(val.level, ".", "_"));    
  aggregateInfoProperties.id = this.replaceAll(val.level, ".", "_");
  aggregateInfoProperties.key = key;
  aggregateInfoProperties["ndeId"] = val.ndeId; //Adding ndeId in every box



  //get backend name
  aggregateInfoProperties.backendType = this.getBackendTypeName(val.backendType);


  aggregateInfoProperties.backendId = val.backEndId;
  aggregateInfoProperties.backendTypeId = val.backendType;

  aggregateInfoProperties.cumFpDuration = val.fpDuration;
  aggregateInfoProperties.url = val.urlName;
  aggregateInfoProperties.startTimeInMs = val.startTimeInMs;

  //TODO : GET TESTRUN NUMBER

  aggregateInfoProperties.startDateTime = val.startTime;


  if (val.callOutType == "t") {
    aggregateInfoProperties.cumBackendDuration = val.fpDuration;
    aggregateInfoProperties.count++;
  }
  else if (val.callOutType == "C" /*|| val.callOutType =="c"*/) //works fine in 'c' case as we create an empty object
  {

    object = this.getCoherenceCounts(val.coherenceCallOuts);
    aggregateInfoProperties.cumBackendDuration = object.cumAvg;
    aggregateInfoProperties.count = object.count;

  }
  else if (val.callOutType == "D") //This is new format created by Java  Program
  {
    object = this.getDBCounts(val.dbCallOuts);
    aggregateInfoProperties.cumBackendDuration = object.cumAvg;
    aggregateInfoProperties.count = object.count;

    aggregateInfoProperties.childErCount = val.childErCount;
    aggregateInfoProperties.erCount = object.erCount;
    aggregateInfoProperties.statusCODE = object.statusCODE;

  }
  else // for old coherence,memcache and other backends including old and new formats
  {
    aggregateInfoProperties.cumBackendDuration = val.backEndDuration;
    aggregateInfoProperties.count++;
    aggregateInfoProperties.erCount = val.erCount;
    aggregateInfoProperties.statusCODE = val.statusCODE;
    aggregateInfoProperties.childErCount = val.childErCount;
    if (val.callOutType == "T")
    {
      aggregateInfoProperties.resourceId = val.resourceId;
      aggregateInfoProperties.totalNetworkDelay=val.totalNetworkDelay;
      aggregateInfoProperties.avgNetworkDelay= val.totalNetworkDelay
    }
  }

  if (aggregateInfoProperties.count > 0) {
    aggregateInfoProperties.avgBackendDuration = (aggregateInfoProperties.cumBackendDuration / aggregateInfoProperties.count);
    aggregateInfoProperties.avgFpDuration = aggregateInfoProperties.cumFpDuration / aggregateInfoProperties.count;
  }

  aggregateInfoProperties.instanceTypeTopology = val.instanceTypeTopology;
  aggregateInfoProperties.depth = val.depth;
  aggregateInfoProperties.tierName = val.tierName;
  aggregateInfoProperties.serverName = val.serverName;
  aggregateInfoProperties.appName = val.appName;
  aggregateInfoProperties.tierId = val.tierId;
  aggregateInfoProperties.serverId = val.serverId;
  aggregateInfoProperties.flowpathInstance = val.flowPathInstance + "";
  aggregateInfoProperties.prevFlowpathInstance = val.previousFlowPathInstance;
  aggregateInfoProperties.correlationid = val.correlationid;
  aggregateInfoProperties.appId = val.appId;
  aggregateInfoProperties.threadId = val.threadID;
  aggregateInfoProperties.max = val.fpDuration;
  aggregateInfoProperties.min = val.fpDuration;
  aggregateInfoProperties.mergedArrayIndex = val.index;
  aggregateInfoProperties.callOutType = val.callOutType;
  aggregateInfoProperties.urlQueryParmStr = val.urlQueryParmStr;
  aggregateInfoProperties.urlIndex = val.urlIndex;
  aggregateInfoProperties.methodCount = val.methodscount;
  aggregateInfoProperties.fpDuration = val.fpDuration;
  aggregateInfoProperties.index = val.index;
  aggregateInfoProperties.exceptionCount = val.exceptionCount;
  aggregateInfoProperties.flowPathType = val.flowpathtype;

  if (aggregateInfoProperties.urlQueryParmStr == "")
    aggregateInfoProperties.urlQueryParmStr = "-";


  if (val.appName == "-")//if appName is "-" we show backend name
  {
    if (val.backEndId == -1)
      aggregateInfoProperties.mappedAppName = "-";
    else {
      //get the backend name from coresponding ndeId 

//TBD alldc data
      if (this.allDCData.backends != undefined)
        aggregateInfoProperties.mappedAppName = this.allDCData.backends[val.backEndId];

      if (this.allDCData.backendsActualName != undefined)
        aggregateInfoProperties.backendActualName = this.allDCData.backendsActualName[val.backEndId];

      }
  }
  else {
    aggregateInfoProperties.mappedAppName = val.appName;

   /* if (val.backendType == 11 || val.backendType == 12 || val.backendType == 13 || val.backendType == 14) {
      if (this.allDCData[val.ndeId].backendsActualName != undefined) {
        aggregateInfoProperties.backendActualName = this.allDCData[val.ndeId].backendsActualName[val.backEndId];
        aggregateInfoProperties.backendName = this.allDCData[val.ndeId].backends[val.backEndId];
      }

    } */

  }
  if ((aggregateInfoProperties.id).lastIndexOf("_") == -1)
    aggregateInfoProperties.sourceId = "root";
  else if((aggregateInfoProperties.backendActualName && !aggregateInfoProperties.backendActualName.startsWith("JMSP")) || (val.urlName && val.urlName != "-" && !val.urlName.startsWith("JMSC")))
    aggregateInfoProperties.sourceId = this.getMergedSource(aggregateInfoProperties.id.substring(0, aggregateInfoProperties.id.lastIndexOf("_")));
  else if(aggregateInfoProperties.backendActualName && aggregateInfoProperties.backendActualName.startsWith("JMSP")){
    aggregateInfoProperties.sourceId = this.getMergedSource(aggregateInfoProperties.id.substring(0, aggregateInfoProperties.id.lastIndexOf("_")));
    this.jmsSourceId = aggregateInfoProperties.id;
    // aggregateInfoProperties.backendActualName = aggregateInfoProperties.backendActualName.substring(5,aggregateInfoProperties.backendActualName.length);
    // aggregateInfoProperties.mappedAppName = aggregateInfoProperties.mappedAppName.substring(5,aggregateInfoProperties.mappedAppName.length)
    // console.log("JMSP case ", aggregateInfoProperties);
  }
  else if(val.urlName && val.urlName.startsWith("JMSC")){
    if(val.callOutType !== "t")
     aggregateInfoProperties.sourceId = this.jmsSourceId;
    else
     aggregateInfoProperties.sourceId = this.getMergedSource(aggregateInfoProperties.id.substring(0, aggregateInfoProperties.id.lastIndexOf("_")));
    // aggregateInfoProperties.urlQueryParmStr = aggregateInfoProperties.urlQueryParmStr.substring(5, aggregateInfoProperties.urlQueryParmStr.length);
    // aggregateInfoProperties.url = aggregateInfoProperties.url.substring(5, aggregateInfoProperties.url.length);
    // console.log("JMSC case ", aggregateInfoProperties);
  }
  else
   aggregateInfoProperties.sourceId = this.getMergedSource(aggregateInfoProperties.id.substring(0, aggregateInfoProperties.id.lastIndexOf("_")));
  //console.log( " mappedAppName  = " +  aggregateInfoProperties.mappedAppName + " val.backendName Id = " + val.backEndId);

  if (val.callOutType == "t") //Thread Call out
  {
    aggregateInfoProperties.percentage = (aggregateInfoProperties.max * 100 / this.totalFPDuration);
    aggregateInfoProperties.backendPercentage = (aggregateInfoProperties.max * 100 / this.totalFPDuration);
    /* if(aggregateInfoProperties.backendPercentage > 100)
             aggregateInfoProperties.backendPercentage = 100;*/
  }
  else {
    aggregateInfoProperties.percentage = (aggregateInfoProperties.cumFpDuration * 100 / this.totalFPDuration);
    aggregateInfoProperties.backendPercentage = (aggregateInfoProperties.cumBackendDuration * 100 / this.totalFPDuration);
    /*if(aggregateInfoProperties.backendPercentage > 100)
             aggregateInfoProperties.backendPercentage = 100;*/
  }

  if (isNaN(aggregateInfoProperties.backendPercentage) || aggregateInfoProperties.backendPercentage == Infinity)
    aggregateInfoProperties.backendPercentage = 0;

  if (isNaN(aggregateInfoProperties.percentage) || aggregateInfoProperties.percentage == Infinity)
    aggregateInfoProperties.percentage = 0;

  //In case if backend percentage is zero and fpDuration has some value, in order to show
  // that Backend is taking time we will show the fpDuration as backendDuration 
  if (aggregateInfoProperties.backendPercentage == 0 && aggregateInfoProperties.percentage != 0) {
    aggregateInfoProperties.avgBackendDuration = aggregateInfoProperties.cumFpDuration;
    aggregateInfoProperties.cumBackendDuration = aggregateInfoProperties.cumFpDuration;
    aggregateInfoProperties.backendPercentage = aggregateInfoProperties.percentage;
  }

   let instanceTypeTopology : string = val.instanceTypeTopology 
  //Checking blank data for tier_server_app name 
  if (this.getUniqueAppName(val).startsWith("-_-_-_")) {
    if (val.backendType == 2 || val.backendType == 10) //checking For DB callOut && supporting ADO.Net BackendType (10 for ADO.Net)
    {
      aggregateInfoProperties.icon = "db.png";
      aggregateInfoProperties.instanceType = "db";
    }
    else if (val.backendType == 9) //checking Cassandra DB callOut
    {
      aggregateInfoProperties.icon = "cassandra.png";
      aggregateInfoProperties.instanceType = "db";
    }
    else if (val.backendType == 11 || val.backendType == 12 || val.backendType == 13 || val.backendType == 14) {
      aggregateInfoProperties.icon = "jmsqueue.png";
      aggregateInfoProperties.instanceType = "JMS"
    }
    else if (val.backendType == 15) {
      aggregateInfoProperties.icon = "mongodb.png";
      aggregateInfoProperties.instanceType = "MongoDB";
    }
    else if (val.backendType == 16) {
      aggregateInfoProperties.icon = "redis.png";
      aggregateInfoProperties.instanceType = "RedisServer";
    }
     else if (val.backendType == 19) {
      aggregateInfoProperties.icon = "cloudant.png";
      aggregateInfoProperties.instanceType = "CLOUDANT";
    }
   else if (val.backendType == 22) //checking ftp callOut
    {
      aggregateInfoProperties.icon = "ftp.png";
      aggregateInfoProperties.instanceType = "FTP";
    }
    else if (val.backendType == 23) //checking ftp callOut
    {
      aggregateInfoProperties.icon = "kafka.png";
      aggregateInfoProperties.instanceType = "KAFKA";
    }
    else if (val.backendType == 24) //checking LDAP callOut
    {
      aggregateInfoProperties.icon = "ldap.png";
      aggregateInfoProperties.instanceType = "LDAP";
    }
    else if (val.backendType == 25) //checking DYNAMO callOut
    {
      aggregateInfoProperties.icon = "dynamo.png";
      aggregateInfoProperties.instanceType = "DYNAMO";
    }
    else if (val.backendType == 26) //checking Socket callout
    {
      aggregateInfoProperties.icon = "socket.png";
      aggregateInfoProperties.instanceType = "SOCKET";
    }
    else {
      aggregateInfoProperties.icon = "backend.png";
      aggregateInfoProperties.instanceType = "backend";
    }
  }
  else if (instanceTypeTopology.toLowerCase() == "nodejs") {

    aggregateInfoProperties.icon = "nodejs.png";
    aggregateInfoProperties.instanceType = "NodeJS";

  }
  else if (instanceTypeTopology.toLowerCase() == "dotnet") {

    aggregateInfoProperties.icon = "dotnet.png";
    aggregateInfoProperties.instanceType = "dotNet";

  }
 else if(instanceTypeTopology.toLowerCase() == "php")
  {
    aggregateInfoProperties.icon = "php.png";
    aggregateInfoProperties.instanceType = "php";

  }
  else if(instanceTypeTopology.toLowerCase() == "go")
  {
    aggregateInfoProperties.icon = "go.png";
    aggregateInfoProperties.instanceType = "go";

  }
  else if(instanceTypeTopology.toLowerCase() == "python")
  {
    aggregateInfoProperties.icon = "python.png";
    aggregateInfoProperties.instanceType = "python";

  }
  else {
    aggregateInfoProperties.icon = "java.png";
    aggregateInfoProperties.instanceType = "java";
  }

  return aggregateInfoProperties;

}


//This function aggregate those node data whose uniqueName already exists
  //Add all the aggInfoPropertiesValue elements
  addAggregateInfoProperties(val, aggInfoPropertiesValue) {
    var dbObject;
    var sourceNodeId = this.replaceAll(val.level, ".", "_");
    aggInfoPropertiesValue.cumFpDuration += val.fpDuration

    if (aggInfoPropertiesValue.url != val.urlName)
      aggInfoPropertiesValue.url = "-";

    if (aggInfoPropertiesValue.count > 0)
      aggInfoPropertiesValue.avgFpDuration = aggInfoPropertiesValue.cumFpDuration / aggInfoPropertiesValue.count;

    if (aggInfoPropertiesValue.max < val.fpDuration)
      aggInfoPropertiesValue.max = val.fpDuration;
    if (aggInfoPropertiesValue.min > val.fpDuration)
      aggInfoPropertiesValue.min = val.fpDuration;

    if (val.callOutType == "t") {
      /*aggInfoPropertiesValue.cumBackendDuration += val.fpDuration;
      aggInfoPropertiesValue.count++;
      aggInfoPropertiesValue.avgBackendDuration = Math.round(aggInfoPropertiesValue.cumBackendDuration/aggInfoPropertiesValue.count);*/

      aggInfoPropertiesValue.cumBackendDuration = aggInfoPropertiesValue.max;
      aggInfoPropertiesValue.count++;
      aggInfoPropertiesValue.avgBackendDuration = (aggInfoPropertiesValue.max / aggInfoPropertiesValue.count).toFixed();
      //Also the same will be FP Duration
      aggInfoPropertiesValue.cumFpDuration = aggInfoPropertiesValue.max;
      aggInfoPropertiesValue.avgFpDuration = (aggInfoPropertiesValue.max / aggInfoPropertiesValue.count);
    }
    else if (val.callOutType == "C" || val.callOutType == "c") //In this case 'c' will come only once in one level and this case should never occur
    {
      var object = this.getCoherenceCounts(val.coherenceCallOuts);

      aggInfoPropertiesValue.cumBackendDuration += object.cumAvg;
      aggInfoPropertiesValue.count += object.count;
      aggInfoPropertiesValue.avgBackendDuration = (aggInfoPropertiesValue.cumBackendDuration / aggInfoPropertiesValue.count);
    }
    else if (val.callOutType == "D") //This is new format created by Java  Program
    {
      dbObject = this.getDBCounts(val.dbCallOuts);
      aggInfoPropertiesValue.cumBackendDuration += dbObject.cumAvg;
      aggInfoPropertiesValue.count += dbObject.count;
      aggInfoPropertiesValue.childErCount += val.childErCount;
      aggInfoPropertiesValue.erCount += dbObject.erCount;
      aggInfoPropertiesValue.statusCODE += dbObject.statusCODE;
      aggInfoPropertiesValue.avgBackendDuration = (aggInfoPropertiesValue.cumBackendDuration / aggInfoPropertiesValue.count);
    }
    else {
    //  if(this.duplicateSeqNum)
      if(val.backEndDuration)
      aggInfoPropertiesValue.cumBackendDuration += val.backEndDuration;
        //In case if backend percentage is zero and fpDuration has some value, in order to show
		   // that Backend is taking time we will show the fpDuration as backendDuration 
       if(val.backEndDuration && val.backEndDuration == 0 && val.fpDuration != 0)
       {
       aggInfoPropertiesValue.cumBackendDuration += val.fpDuration;
       }
      aggInfoPropertiesValue.count++;
      aggInfoPropertiesValue.erCount += val.erCount;
      aggInfoPropertiesValue.statusCODE += val.statusCODE;
      aggInfoPropertiesValue.avgBackendDuration = (aggInfoPropertiesValue.cumBackendDuration / aggInfoPropertiesValue.count);
      if (val.callOutType == "T")
          {
        aggInfoPropertiesValue.resourceId = val.resourceId;
         if(aggInfoPropertiesValue.totalNetworkDelay && aggInfoPropertiesValue.totalNetworkDelay != "-1")
          {
         aggInfoPropertiesValue.totalNetworkDelay += val.totalNetworkDelay;
        aggInfoPropertiesValue.avgNetworkDelay=aggInfoPropertiesValue.totalNetworkDelay/aggInfoPropertiesValue.count;
	  }
         }
    }



    if (val.callOutType == "t") //Thread Call out
    {
      aggInfoPropertiesValue.percentage = (aggInfoPropertiesValue.max * 100 / this.totalFPDuration);
      if (aggInfoPropertiesValue.percentage > 100)
        aggInfoPropertiesValue.percentage = 100;
    }
    else {
      aggInfoPropertiesValue.percentage = (aggInfoPropertiesValue.cumFpDuration * 100 / this.totalFPDuration);
      if (aggInfoPropertiesValue.percentage > 100)
        aggInfoPropertiesValue.percentage = 100;
    }

    if (val.callOutType == "t") //Thread Call out
    {
      aggInfoPropertiesValue.backendPercentage = (aggInfoPropertiesValue.max * 100 / this.totalFPDuration);
      /*                   if(aggInfoPropertiesValue.backendPercentage > 100)
                                        aggInfoPropertiesValue.backendPercentage = 100;*/
    }
    else {
      aggInfoPropertiesValue.backendPercentage = (aggInfoPropertiesValue.cumBackendDuration * 100 / this.totalFPDuration);
      /*                        if(aggInfoPropertiesValue.backendPercentage > 100)
                                        aggInfoPropertiesValue.backendPercentage = 100;*/
    }
    if (isNaN(aggInfoPropertiesValue.percentage) || aggInfoPropertiesValue.percentage == Infinity)
      aggInfoPropertiesValue.percentage = 0;

    if (isNaN(aggInfoPropertiesValue.backendPercentage) || aggInfoPropertiesValue.backendPercentage == Infinity)
      aggInfoPropertiesValue.backendPercentage = 0;

    this.mergedSourceMap[sourceNodeId] = aggInfoPropertiesValue.id;

    return aggInfoPropertiesValue;
  }
  //  }
 /* getRequestData(url) {
    console.log(" coming hefr", url)

   return this.ddrRequest.getDataUsingGet(url);

  }*/
//If map already contains the sourceID,merge it
getMergedSource(destKey) {
  var mergedSource = destKey;
  if (this.mergedSourceMap.hasOwnProperty(mergedSource))
    mergedSource = this.mergedSourceMap[mergedSource];
  return mergedSource;
}

//Aggregate coherence callout counts
getCoherenceCounts(coherenceCallOuts) {
  var object = { "count": 0, "cumAvg": 0.0 };

  coherenceCallOuts.forEach((val) => {
    object.count += val.count;
    object.cumAvg += val.cumAvg;
  });
  return object;
}

//This function aggregate DBCall out for the same DB
getDBCounts(dbCallout) {
  var object = { "count": 0, "cumAvg": 0.0, "erCount": 0 };
  for (var obj in dbCallout) {
    object.count += dbCallout[obj].count;
    object.cumAvg += dbCallout[obj].cumAvg;
    object.erCount += dbCallout[obj].errorCount;
  };

  return object;
}

adapter(data){
  //var finaldata:any;
  var finaldata = {};
 // newObject["tierName"] = "-";
  var node =[];
  var edge =[];
  var entry = {
    id: 'root',
    type: 'cluster',
    left: 58.5392,
    top: 6.59954,
    tier: 'tier',
    server: 'server',
    instance: 'instance',
    startTime: '02/05/2020',
    totalDuration: '20/2/20',
    percentage: '20%',
    nodeName: 'Entry',
    calls: 15,
    rspTime: 1700,
    icon: '',
  }
  node.push(entry);
  for (var i = 0; i < data.length; i++) {
    var edgeval1 = {};
   var nodeval1 ={};
   // var edgeval2 = {};
   // var nodeval2 ={};
    edgeval1["target"] = data[i].id ;
    edgeval1["source"] = data[i].sourceId;
    edgeval1["data"] = {
      type:'outputEdgeLabel',
      index: i+1+"",
      rspTime:this.RespValue(data[i].avgBackendDuration) + ' ms', //data[i].avgBackendDuration.toLocaleString()+'ms'
      calls:data[i].count,
      avgTime:((data[i].avgBackendDuration)/data[i].count.toFixed(2)).toLocaleString()+' ms',
      putMyLabelAt: 0.5,
      percentage: data[i].percentage.toFixed(1) + '%',
      backendType: data[i].backedtype
    }

   // edgeval2["id"] = data[i].id ;
   // edgeval2["source"] =data[i].id + "connector";
   // nodeval1["name"] = data[i].tierName + "connector" ;
  // String icon = geticonName(data[i].icon);

    nodeval1 =  {
      id: data[i].id ,
      type: 'nodeIndices',
      left: 1693.116,
      top: -171.204,
      tier: data[i].tierName,
      server: data[i].serverName,
      instance: data[i].mappedAppName,
      startTime: data[i].startDateTime,
      totalDuration: this.RespValue(data[i].avgBackendDuration) + 'ms', //'20/2/20'
      instanceType: data[i].instanceType,
      percentage: data[i].percentage.toFixed(1) + '%',
      nodeName: this.nodeName(data[i]), //data[i].serverName + " : " +  data[i].mappedAppName
      calls: 15,
      rspTime: 1700,
      icon: this.geticonName(data[i].icon),//'./assets/icons8-png/icons8-database-100.png',
    }
   // nodeval2["name"] = data[i].tierName + ":" + data[i].serverName;
    //nodeval2["id"] =  data[i].id ;
    edge.push(edgeval1);
    node.push(nodeval1);
 //   edge.push(edgeval2);
 //   node.push(nodeval2);
  }

  finaldata["node"]= node;
  finaldata["edge"]= edge;
  var returndata = {};
  returndata["nodeInfoData"] = finaldata;
  console.log("finaldata::" + JSON.stringify(finaldata));
  return returndata;
}
RespValue(value){
  if (Number(value) && Number(value) > 0) {
    //const num: any = parseFloat(value).toFixed(3);
    const num: any = value + 'e+' + 3;
    return Number(Math.round(num) + 'e-' + 3).toLocaleString();
    }
    if(Number(value) == 0){
    const num: any = parseFloat(value).toFixed(2);
    return num;
    }
}
nodeName(data){
  if(data.tierName != '-'){
    var nodeName:any = data.serverName + ' : ' + data.mappedAppName ;
    return nodeName;

  }
  if(data.tierName == '-'){
    // if(data.mappedAppName.length>12){
    //   var nodeName:any = data.mappedAppName.substring(0,12).replace(/\+/g, ' ') + "..";
    //   return nodeName;
    // }else{
      var nodeName:any = data.mappedAppName;
      return nodeName;
    // }
  }
}
geticonName(name)
{
  var val = './assets/icons8-png/';
switch(name)
{
  case 'java.png' : return val+'icons8-java-100.png';
  case 'nodejs.png' : return val+'icons8-node-js-100.png';

  case 'mongodb.png' : return val+'icons8-mongodb-100.png';
  case 'db.png' : return val+'icons8-database-100.png';
  case 'python.png' : return val+'icons8-python-100.png';
  case 'cassandra.png' : return val+'icons8-cassandra-100.png';
  case 'jmsqueue.png' : return val+'icons8-jmsqueue-100.png';
  case 'redis.png' : return val+'icons8-redis-100.png';
  case 'ftp.png' : return val+'icons8-ftp-100.png';
  case 'kafka.png' : return val+'icons8-kafka-100.png';
  case 'ldap.png' : return val+'icons8-ldap-100.png';
  case 'dynamo.png' : return val+'icons8-dynamo-100.png';
  case 'socket.png' : return val+'icons8-socket-100.png';
  case 'backend.png' : return val+'icons8-backend-100.png';
  case 'dotnet.png' : return val+'icons8-dotnet-100.png';
  case 'php.png' : return val+'icons8-php-logo-100.png';
  case 'go.png' : return val+'icons8-go-100.png';
  case 'cloudant.png' : return val+'icons8-database-100.png';
  //case 'java.png' : return val+'icons8-java-100.png'


}
}


//This function is used to set backedtype according to the type
getBackendTypeName(backendType) {
  var backendTypeName = "OTHER";

  if (backendType == 1)
    return "HTTP";
  else if (backendType == 2)
    return "JDBC";
  else if (backendType == 3)
    return "COHERENCE";
  else if (backendType == 4)
    return "RMI";
  else if (backendType == 5)
    return "MemCache";
  else if (backendType == 6)
    return "CLOUDANT";
  else if (backendType == 7)
    return "HADOOP";
  else if (backendType == 9)
    return "CASSANDRA";
  else if (backendType == 10)
    return "DB";
  else if (backendType == 11)
    return "IBM_MQ";
  else if (backendType == 12)
    return "ACTIVE_MQ";
  else if (backendType == 13)
    return "RABBIT_MQ";
  else if (backendType == 15)
    return "MongoDB";
  else if (backendType == 16)
    return "Redis";
  else if (backendType == 14)
    return "JMS_ATG";
   else if (backendType == 19)
    return "CLOUDANT_DB"; 
  else if (backendType == 22)
    return "FTP"; 
  else if (backendType == 23)
    return "KAFKA";
  else if (backendType == 24)
    return "LDAP"; 
  else if (backendType == 25)
    return "DYNAMO";
  else if (backendType == 26) 
    return "SOCKET";
  else
    return backendTypeName;
}




  replaceAll(str, find, replace) {
    //console.log("str is  "+str);
    return str.replace(new RegExp(find.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), replace);
  }  

  errParentLevel = 0;
  setLevelForErrCase(incParLvl) {
    if (incParLvl != undefined)
      this.errParentLevel = incParLvl;
  }
  getLevelForErrCase() {
    return this.errParentLevel;
  }


    }
