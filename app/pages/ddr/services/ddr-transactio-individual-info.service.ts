import { Injectable } from '@angular/core';
import { CommonServices } from './common.services';
// import { Http, Response, URLSearchParams } from '@angular/http';
// import 'rxjs/add/operator/toPromise';
import * as jQuery from 'jquery';
import { CavTopPanelNavigationService } from '../../tools/configuration/nd-config/services/cav-top-panel-navigation.service';
import { Router } from '@angular/router';
import { DdrTxnFlowmapDataService } from './ddr-txn-flowmap-data.service';
import { DDRRequestService } from './ddr-request.service';
import { DdrDataModelService } from '../../tools/actions/dumps/service/ddr-data-model.service';


@Injectable()
export class DdrTransactioIndividualInfoService {
  popupTitle = ""; //to show tittle of dialog box on db click
  col = [];  // array to hold the columns of table
  transactionTableArray = [];
  constructor(private flowMapData: DdrTxnFlowmapDataService, private CommonServices: CommonServices, private ddrRequest:DDRRequestService, private _ddrData: DdrDataModelService) { }
  gridTable;


  getSourceDetails(sid, currentURL, urlIndex, id) {

    var backendEndInfo = {
      "tierId": "-1",
      "tierName": "-",
      "serverId": "-1",
      "serverName": "-",
      "appId": "-1",
      "appName": "-",
      "backendId": "-1",
      "backendName": "-",
      "mappedAppName": "-",
      "ndeId": "-1",
      "flowpathinstance": "-1",
      "urlName": "-",
      "urlIndex": "-1",
      "startDateTime": "-",
      "id": "-"
    };
    /**
     * commenting to due migration as jquery is giving error
     */
    jQuery.each(this.flowMapData.jsonData, function (index, val:any) {
      if (val.id == sid && sid != 'root') {
        backendEndInfo["tierId"] = val.tierId;
        backendEndInfo["serverId"] = val.serverId;
        backendEndInfo["appId"] = val.appId;
        backendEndInfo["tierName"] = val.tierName;
        backendEndInfo["serverName"] = val.serverName;
        backendEndInfo["appName"] = val.appName;
        backendEndInfo["flowpathinstance"] = val.flowpathInstance;
        backendEndInfo["id"] = val.id;

        if (val.instanceType == "java") {
          if (currentURL != "-" && currentURL != 'undefined') {
            backendEndInfo["urlName"] = currentURL;
            backendEndInfo["urlIndex"] = urlIndex
          }
          backendEndInfo["startDateTime"] = "<b title ='Parent Flowpath Start Time (MM/DD/YY HH:mm:ss) '>Start Time: </b> " + val.startDateTime;

        }
        else if (val.url != 'undefined') {
          backendEndInfo["urlName"] = val.url;
          backendEndInfo["urlIndex"] = val.urlIndex;
          backendEndInfo["startDateTime"] = "<b>Start Time: </b> " + val.startDateTime;
        }
        else {
          backendEndInfo["urlName"] = "-";
          backendEndInfo["startDateTime"] = "<b title ='Flowpath Start Time in MM/DD/YY'>Start Time: </b> " + val.startDateTime;
        }
      }
      if (val.id == id) {

        backendEndInfo["backendId"] = val.backendId;
        backendEndInfo["backendName"] = val.backendActualName;
        backendEndInfo["ndeId"] = val.ndeId
        backendEndInfo["mappedAppName"] = val.mappedAppName;
      }
    });
    return backendEndInfo;
  }
  showPopupFilters(backendInfo) {
    var retValue = "";

    if (backendInfo.tierName != undefined && backendInfo.tierName != "-")
      retValue += "<div style='margin:5px'><span><b>From Tier: </b> " + backendInfo.tierName + "&nbsp;</span>";

    if (backendInfo.serverName != undefined && backendInfo.serverName != "-")
      retValue += " <span>&nbsp;<b>From Server: </b> " + backendInfo.serverName + "&nbsp;</span>";

    if (backendInfo.serverName != undefined && backendInfo.serverName != "-")
      retValue += "<span>&nbsp;<b>From Instance: </b> " + backendInfo.appName + "&nbsp;</span>";

    if (backendInfo.urlName != "-" && backendInfo.urlName != 'undefined' && backendInfo.urlName != "")
      retValue += "<span title='" + backendInfo.urlName + "'>&nbsp;<b>URL: </b> " + this.trimText(backendInfo.urlName, 25) + "&nbsp;</span>";

    if (backendInfo.id.startsWith("queue"))
      retValue += "<span>&nbsp;<b>From: </b> " + backendInfo.backendName + "&nbsp;</span>";

    if (backendInfo.startDateTime != "-" && backendInfo.startDateTime != 'undefined')
      retValue += "<span>&nbsp;" + backendInfo.startDateTime + "&nbsp;</span></div>";

    jQuery('#popupTableInfo').html(retValue);   
  }
  //This function is used to get individual information of a particular node,when user double click on any node
  getIndividualGroupedInfo(transGroupType, depth, key, transactionTierList, testRun, contextName) {
    return new Promise ((resolve, reject) => {
      //transGroupType is backendID
      var transactionGroupedList: any = [];
      var transactionDTOMap = {};
      var transactionDTOList = [];
      var backendCallType = this.flowMapData.getBackendType(key, transGroupType);
      var resourceIdList = [];
      var resourceIdMap = {};
      var ndeId = -1;
     var sqlIndexMap={};
      transactionDTOMap = transactionTierList[depth];
      transactionDTOList = transactionDTOMap[key];

      if (transactionDTOList == undefined || transactionDTOList.length == 0) {
        console.log("transactionDTOList is undefined .....");
        return "[]";
      }

      /**
       * commenting to jquery at time of migration
       */
      jQuery.each(transactionDTOList, function (index, val) {

        if (backendCallType == 1 && val['resourceId'] != 0 && val['resourceId'] != undefined) {
          ndeId = val.ndeId;
          resourceIdList.push(val['resourceId']);
        }

      });


      if (transactionDTOList.length > 1 && backendCallType == 2 || backendCallType == 22  || backendCallType == 9 || backendCallType == 10 || backendCallType == 15 || backendCallType == 16 || backendCallType == 18 || backendCallType == 19 || backendCallType == 25){
         transactionDTOList.forEach((valD, index) => { 
          for(var sqlIndex in valD.dbCallOuts)
          {
             //console.log("backendsubtype--------",sqlIndex);
             //console.log("sqlindex map value---------",sqlIndexMap[sqlIndex]);
             if(!sqlIndexMap[sqlIndex])
             {
              // console.log("valD dbCallouts value-------",valD.dbCallOuts[sqlIndex]);
              sqlIndexMap[sqlIndex]=valD.dbCallOuts[sqlIndex];
             }
             else
             {
               let dbCallout= sqlIndexMap[sqlIndex];
             //  console.log("db callouts before",dbCallout);

             if(dbCallout.min > valD.dbCallOuts[sqlIndex].min )
             dbCallout.min = valD.dbCallOuts[sqlIndex].min;
             if(dbCallout.max < valD.dbCallOuts[sqlIndex].max)
             dbCallout.max = valD.dbCallOuts[sqlIndex].max;
             dbCallout.cumAvg += valD.dbCallOuts[sqlIndex].cumAvg;
             dbCallout.errorCount += valD.dbCallOuts[sqlIndex].errorCount;
             dbCallout.count += valD.dbCallOuts[sqlIndex].count;
           //  console.log("--dbCallout value-------",dbCallout, "dbCallout.cumAvg",dbCallout.cumAvg);
             sqlIndexMap[sqlIndex]=dbCallout;
            }
          }
          });
          //transactionDTOList[0]['dbCallOuts']={};
          transactionDTOList[0]['dbCallOuts']=sqlIndexMap;
          transactionDTOMap[key]= [transactionDTOList[0]];
      }
        let resouceIdCount=0;
        transactionDTOList.forEach((val, index) => {
        if (backendCallType == 2 || backendCallType == 22  || backendCallType == 9 || backendCallType == 10 || backendCallType == 15 || backendCallType == 16 || backendCallType == 18 || backendCallType == 19 || backendCallType == 25) {
          //FOR SQL
          this.addDBQueries(transactionGroupedList, val, testRun, contextName).then((data) => {
          resolve(data);
          });

        }
        else if (val.callOutType == "C" && val.coherenceCallOuts != undefined) {
          //For Coherence New Format
          transactionGroupedList = this.addCoherenceTypes(transactionGroupedList, val).then((data) => resolve(data));

        }
        else if (backendCallType == 1 && resourceIdList.length > 0) {
          this.ajaxCallForresourceId(resourceIdList.toString(), testRun, ndeId, contextName).then((data) => {
            resourceIdMap = data;
            resouceIdCount++;
            this.createDataForTable(backendCallType, resourceIdMap, val, transactionGroupedList, transactionGroupInfo).then((data) => {
            if(resouceIdCount == resourceIdList.length) 
             resolve(transactionGroupedList);
            });
            //this.createDataForTable(backendCallType, resourceIdMap, val, transactionGroupedList, transactionGroupInfo).then((data) => resolve(data));
          })
        }
        else {
          var transactionGroupInfo = this.TransactionGroupInfo(backendCallType, val, resourceIdMap, )
          var findIndex = this.listIndexOf(transactionGroupedList, transactionGroupInfo, backendCallType);
          //console.log(" index --- = " + findIndex + " backendCallType = "+ backendCallType +  " transGroupType = " + transGroupType);

          if (findIndex != -1) {

            transactionGroupInfo = transactionGroupedList[findIndex];
            transactionGroupInfo = this.addTransactionPropertiesForGrouping(val, transactionGroupInfo);
            transactionGroupedList[findIndex] = transactionGroupInfo;

            if (transactionGroupInfo.count > 1 && transactionGroupInfo.tierName != '-') {
              transactionGroupedList.push(val);
              resolve(transactionGroupedList);
            }
          }
          else {

            transactionGroupedList.push(transactionGroupInfo);
            resolve(transactionGroupedList);

          }
        }
      });
    });
  }

  ajaxCallForresourceId(resourceIds, testRun, ndeId, contextName) {
    return new Promise ((resolve, reject) => {
      var map = {};
      var ndeCurrentInfo = this.getNDEInfoFromID(ndeId);
      var specificTestRun = this.flowMapData.allDCData[ndeId].testRun;

      var url = "/v1/cavisson/netdiagnostics/ddr/trxFlowMap/resourcemetadata?testrun=" + specificTestRun;
      //var url =  contextName + "v1/cavisson/netdiagnostics/ddr/trxFlowMap/metadata/sql?testRun=" + testRun;

      if (ndeCurrentInfo != undefined && ndeCurrentInfo != null && ndeCurrentInfo != '' && ndeCurrentInfo != 'NA') //Only in case where DC.conf is present
      { 
       var IPPort;
       if(this._ddrData.nodeKey === '1'){
        IPPort = location.protocol  + "//" + location.host + "/tomcat/" + ndeCurrentInfo.displayName;
       }
       else{
       if(ndeCurrentInfo.ndeProtocol != undefined && ndeCurrentInfo.ndeProtocol != null && ndeCurrentInfo.ndeProtocol != '' && ndeCurrentInfo.ndeProtocol != 'NA')
        IPPort = ndeCurrentInfo.ndeProtocol + "://" + ndeCurrentInfo.ndeIPAddr + ":" + ndeCurrentInfo.ndeTomcatPort + "/";
       else
        IPPort = "//" + ndeCurrentInfo.ndeIPAddr + ":" + ndeCurrentInfo.ndeTomcatPort + "/";
       }
        url = IPPort + "/" + this.flowMapData.urlParam.product +  url;
      }
      else   
      {
       url = this.flowMapData.hosturl + this.flowMapData.urlParam.product + url;
      }

      url = url + "&resourceid=" + resourceIds;
      //console.log("URL: "+url);

      this.ddrRequest.getDataUsingGet(url).subscribe(
        data => {
          map = data;
          console.log('data for map in ajax', data, map);
          resolve(map);
        }
      )

    });
  }

  // This method is used to 
  
  addDBQueries(transactionGroupedList, val, testRun, contextName) {
    //console.log("Querying---NdeId :" + val.ndeId +"DBCallOuts : "+val.dbCallOuts);
    return new Promise ((resolve, reject) => {
      var uniqueSQLList = new Array();
      var sqlQueries = val.dbCallOuts;
      for (var obj in sqlQueries) {
        if(obj != '-1'){
          uniqueSQLList.push(obj);
        }
      }

      var sqlDataMap = {};
      var ndeCurrentInfo = this.getNDEInfoFromID(val.ndeId);
      var specificTestRun = this.flowMapData.allDCData[val.ndeId].testRun;

      var url = "/v1/cavisson/netdiagnostics/ddr/trxFlowMap/metadata/sql?testRun=" + specificTestRun;
      //var url =  contextName + "v1/cavisson/netdiagnostics/ddr/trxFlowMap/metadata/sql?testRun=" + testRun;

      if (ndeCurrentInfo != undefined && ndeCurrentInfo != null && ndeCurrentInfo != '' && ndeCurrentInfo != 'NA') //Only in case where DC.conf is present
      { 
       var IPPort;
       if(this._ddrData.nodeKey === '1'){
        IPPort = location.protocol  + "//" + location.host + "/tomcat/" + ndeCurrentInfo.displayName;
       }
       else{
       if(ndeCurrentInfo.ndeProtocol != undefined && ndeCurrentInfo.ndeProtocol != null && ndeCurrentInfo.ndeProtocol != '' && ndeCurrentInfo.ndeProtocol != 'NA')
        IPPort = ndeCurrentInfo.ndeProtocol + "://" + ndeCurrentInfo.ndeIPAddr + ":" + ndeCurrentInfo.ndeTomcatPort;
       else
        IPPort = "//" + ndeCurrentInfo.ndeIPAddr + ":" + ndeCurrentInfo.ndeTomcatPort;
       }
        url = IPPort + "/" + this.flowMapData.urlParam.product +  url;
      }
      else
      {
       url = this.flowMapData.hosturl + this.flowMapData.urlParam.product + url;
      }

      url = url + "&sqlID=" + uniqueSQLList.toString();
      // console.log("URL: "+url);
      //console.log("URL: "+url);
      this.ddrRequest.getDataUsingGet(url).subscribe(
        data => {
          sqlDataMap = data;//JSON.parse(['_body']);
          let dataTemp = this.createJsonFortable(sqlQueries, val, sqlDataMap, transactionGroupedList);
          console.log("dataForJson - ", dataTemp);
          resolve(dataTemp);
        }
      )
    });
  }

  //TODO - Can be Optimized
  createJsonFortable(sqlQueries, val, sqlDataMap, transactionGroupedList) {
    for (var obj in sqlQueries) {
      if(obj != '-1'){
        var TransactionGroupInfo = this.createTransactionGroupInfo(); 
      TransactionGroupInfo.tierId = val.tierId;
      TransactionGroupInfo.tierName = val.tierName;
      TransactionGroupInfo.serverName = val.serverName;
      TransactionGroupInfo.serverId = val.serverId;
      TransactionGroupInfo.appName = val.appName;
      TransactionGroupInfo.appId = val.appId;
      TransactionGroupInfo.backendQuery = this.decodeUrlQuery(sqlDataMap[obj]);
      //console.log(sqlDataMap[obj] + " ------------------ " + sqlDataMap.obj);
      TransactionGroupInfo.backendSubType = sqlQueries[obj].backendSubType;//gets Query Name
      TransactionGroupInfo.min = sqlQueries[obj].min;
      TransactionGroupInfo.max = sqlQueries[obj].max;
      TransactionGroupInfo.cumAvg = sqlQueries[obj].cumAvg;
      TransactionGroupInfo.count = sqlQueries[obj].count;
      TransactionGroupInfo.avg = TransactionGroupInfo.cumAvg / TransactionGroupInfo.count;
      TransactionGroupInfo.errorCount = sqlQueries[obj].errorCount;
      // TransactionGroupInfo.statusCODE=sqlQueries[obj].statusCODE;
      var str = sqlQueries[obj].statusCODE;
      for (var h = 0; h < str.length; h++) {
        if (str[h] != null && str[h] != "-") {
          TransactionGroupInfo.statusCODE += "," + str[h];
        }

        if (TransactionGroupInfo.statusCODE.startsWith(","))
          TransactionGroupInfo.statusCODE = TransactionGroupInfo.statusCODE.substring(1);
      }
      transactionGroupedList.push(TransactionGroupInfo);
      } 
    }
    return transactionGroupedList;
  }
  //This method is used to add coherencetype in an array object
  addCoherenceTypes(transactionGroupedList, val) {
    return new Promise ((resolove, reject) => {
      var coherenceCallOuts = val.coherenceCallOuts;
      coherenceCallOuts.forEach((coherenceCall,index ) => {
        var TransactionGroupInfo = this.createTransactionGroupInfo();
        TransactionGroupInfo.min = coherenceCall.min;
        TransactionGroupInfo.max = coherenceCall.max;
        TransactionGroupInfo.cumAvg = coherenceCall.cumAvg;
        TransactionGroupInfo.count = coherenceCall.count;
        TransactionGroupInfo.avg = TransactionGroupInfo.cumAvg / TransactionGroupInfo.count;
        TransactionGroupInfo.backendSubType = this.getCoherenceType(coherenceCall.backendSubType);
        transactionGroupedList.push(TransactionGroupInfo);
        resolove(transactionGroupedList);
      });
    });

  }
  avg
  // This method is used to group the transaction node.(for initial time)
  TransactionGroupInfo(backendCallType, val, resourceIdmap) {
    var TransactionGroupInfo = {
      "url": "",
      "backendType": "",
      "backendName": "",
      "backendSubType": "",
      "min": 0,//long
      "max": 0,
      "avg": 0,
      "cumAvg": 0,//double
      "threadID": 0,
      "startTime": "",
      "startTimeInMs": "",
      "fpDuration": "",
      "flowPathInstance": "",
      "urlQueryParmStr": "",
      "urlIndex": "",
      "tierId": "",
      "tierName": "",
      "serverId": "",
      "serverName": "",
      "appId": "",
      "appName": "",
      "ndeId": "",
      "correlationid": "",
      "btcputime": "",
      "count": 0,
      "errorCount": 0,
      "statusCODE": "",
      "resourceId": 0,
      "resourceName": "-"
    };

    TransactionGroupInfo.backendName = val.backendName;
    if (backendCallType == 1 || backendCallType == 11 || backendCallType == 12 || backendCallType == 13 || backendCallType == 14) {
      //console.log("Query Parameter String val.urlQueryParmStr = " + val.urlQueryParmStr);
      TransactionGroupInfo.url = val.urlQueryParmStr;
      if(val.gcpause == "1"  || val.gcpause == "0")
       TransactionGroupInfo['gcpause'] = val.gcpause;
      if (val.level.indexOf(".") == -1) {
        TransactionGroupInfo.min = val.fpDuration;
        TransactionGroupInfo.cumAvg = val.fpDuration;
        TransactionGroupInfo.max = val.fpDuration;
        TransactionGroupInfo.flowPathInstance = val.flowPathInstance;
        TransactionGroupInfo.startTime = val.startTime;
        TransactionGroupInfo.fpDuration = val.fpDuration;
        TransactionGroupInfo.urlQueryParmStr = this.decodeUrlQuery(val.urlQueryParmStr);
        TransactionGroupInfo.urlIndex = val.urlIndex;
        TransactionGroupInfo.tierId = val.tierId;
        TransactionGroupInfo.tierName = val.tierName;
        TransactionGroupInfo.serverId = val.serverId;
        TransactionGroupInfo.serverName = val.serverName;
        TransactionGroupInfo.appId = val.appId;
        TransactionGroupInfo.appName = val.appName;
        TransactionGroupInfo.ndeId = val.ndeId;
        TransactionGroupInfo.startTimeInMs = val.startTimeInMs;
        TransactionGroupInfo.correlationid = val.correlationid;
        TransactionGroupInfo.btcputime = val.btcputime;
        TransactionGroupInfo.threadID = val.threadID;
      }
      else if (val.callOutType === "t") {
        TransactionGroupInfo.min = val.fpDuration;
        TransactionGroupInfo.cumAvg = val.fpDuration;
        TransactionGroupInfo.max = val.fpDuration;
        TransactionGroupInfo.flowPathInstance = val.flowPathInstance;
        TransactionGroupInfo.startTime = val.startTime;
        TransactionGroupInfo.fpDuration = val.fpDuration;
        TransactionGroupInfo.urlQueryParmStr = this.decodeUrlQuery(val.urlQueryParmStr);
        TransactionGroupInfo.urlIndex = val.urlIndex;
        TransactionGroupInfo.tierId = val.tierId;
        TransactionGroupInfo.tierName = val.tierName;
        TransactionGroupInfo.serverId = val.serverId;
        TransactionGroupInfo.serverName = val.serverName;
        TransactionGroupInfo.appId = val.appId;
        TransactionGroupInfo.appName = val.appName;
        TransactionGroupInfo.ndeId = val.ndeId;
        TransactionGroupInfo.startTimeInMs = val.startTimeInMs;
        TransactionGroupInfo.correlationid = val.correlationid;
        TransactionGroupInfo.btcputime = val.btcputime;
        TransactionGroupInfo.threadID = val.threadID;
      }
      else {
        TransactionGroupInfo.min = val.backEndDuration;
        TransactionGroupInfo.cumAvg = val.backEndDuration;
        TransactionGroupInfo.max = val.backEndDuration;
        TransactionGroupInfo.flowPathInstance = val.flowPathInstance;
        TransactionGroupInfo.startTime = val.startTime;
        TransactionGroupInfo.fpDuration = val.fpDuration;
        TransactionGroupInfo.urlQueryParmStr = this.decodeUrlQuery(val.urlQueryParmStr);
        TransactionGroupInfo.urlIndex = val.urlIndex;
        TransactionGroupInfo.tierId = val.tierId;
        TransactionGroupInfo.tierName = val.tierName;
        TransactionGroupInfo.serverId = val.serverId;
        TransactionGroupInfo.serverName = val.serverName;
        TransactionGroupInfo.appId = val.appId;
        TransactionGroupInfo.appName = val.appName;
        TransactionGroupInfo.ndeId = val.ndeId;
        TransactionGroupInfo.startTimeInMs = val.startTimeInMs;
        TransactionGroupInfo.correlationid = val.correlationid;
        TransactionGroupInfo.btcputime = val.btcputime;
        TransactionGroupInfo.threadID = val.threadID;
        TransactionGroupInfo.errorCount = val.erCount;
        TransactionGroupInfo.statusCODE = val.statusCODE;
        TransactionGroupInfo.resourceId = val.resourceId;
        if (val.resourceId != 0 && resourceIdmap[val.resourceId] != undefined)
          TransactionGroupInfo.resourceName = resourceIdmap[val.resourceId];

      }
      TransactionGroupInfo.count++;
      TransactionGroupInfo.avg = TransactionGroupInfo.cumAvg / TransactionGroupInfo.count;

    }
    else if (backendCallType == 3 || backendCallType == 5) {
      TransactionGroupInfo.backendType = this.getBackendTypeName(val.backendType);

      if (val.level.indexOf(".") == -1) {
        TransactionGroupInfo.min = val.fpDuration;
        TransactionGroupInfo.cumAvg = val.fpDuration;
        TransactionGroupInfo.max = val.fpDuration;
      }

      else if (val.callOutType === "t") {
        TransactionGroupInfo.min = val.fpDuration;
        TransactionGroupInfo.cumAvg = val.fpDuration;
        TransactionGroupInfo.max = val.fpDuration;
        TransactionGroupInfo.count++;
      }
      else if (val.callOutType != "C") {
        TransactionGroupInfo.min = val.backEndDuration;
        TransactionGroupInfo.max = val.backEndDuration;
        TransactionGroupInfo.cumAvg = val.backEndDuration;
        TransactionGroupInfo.count++;
      }

      TransactionGroupInfo.avg = TransactionGroupInfo.cumAvg / TransactionGroupInfo.count;
    }
    else {
      TransactionGroupInfo.backendType = this.getBackendTypeName(val.backendType);

      if (val.level.indexOf(".") == -1) {
        TransactionGroupInfo.min = val.fpDuration;
        TransactionGroupInfo.cumAvg = val.fpDuration;
        TransactionGroupInfo.max = val.fpDuration
      }

      else if (val.callOutType === "t") {
        TransactionGroupInfo.min = val.fpDuration;
        TransactionGroupInfo.cumAvg = val.fpDuration;
        TransactionGroupInfo.max = val.fpDuration;
      }

      else {
        TransactionGroupInfo.min = val.backEndDuration;
        TransactionGroupInfo.max = val.backEndDuration;
        TransactionGroupInfo.cumAvg = val.backEndDuration;
        TransactionGroupInfo.errorCount = val.erCount;
        TransactionGroupInfo.statusCODE = val.statusCODE;
        // TransactionGroupInfo.resourceId=val.resourceId;
      }

      TransactionGroupInfo.count++;
      TransactionGroupInfo.avg = TransactionGroupInfo.cumAvg / TransactionGroupInfo.count;

      if (isNaN(TransactionGroupInfo.avg) || TransactionGroupInfo.avg == Infinity) {
        this.avg = 0;
      }

    }
    return TransactionGroupInfo;
  }
  listIndexOf(transactionGroupedList, transactionGroupInfo, transGroupType) {
    for (var localIndex = 0; localIndex < transactionGroupedList.length; localIndex++) {
      var val = transactionGroupedList[localIndex];

      var retValue = false;

      if (transGroupType == 1) {
        //  alert("in list of index 1"+transactionGroupInfo.resourceId+"----------resourceid -------"+val.resourceId);
        //checking for url
        if (transactionGroupInfo.url != undefined && transactionGroupInfo.url != "-" && val.url == transactionGroupInfo.url) {
          retValue = true;
        }
        else if (transactionGroupInfo.resourceId != undefined && val.resourceId == transactionGroupInfo.resourceId) {
          retValue = true;
        }
        else {
          if (transactionGroupInfo.url == undefined && val.url == undefined)
            retValue = true;
          else
            retValue = false;
        }
      }
      else {
        //checking for backend type
        if (transactionGroupInfo.backendType != undefined && val.backendType == transactionGroupInfo.backendType)
          retValue = true;
        else {
          if (val.backendType == undefined && transactionGroupInfo.backendType == undefined)
            retValue = true;
          else
            retValue = false;
        }
      }

      if (retValue == true)
        return localIndex;
      else
        return -1;
    }
    return -1;
  }
  //This method is used to add all the transaction properties
  addTransactionPropertiesForGrouping(val, TransactionGroupInfo) {
    if (val.callOutType === "t") {
      if (val.fpDuration < TransactionGroupInfo.min)
        TransactionGroupInfo.min = val.fpDuration;

      if (val.fpDuration > TransactionGroupInfo.max)
        TransactionGroupInfo.max = val.fpDuration;

      TransactionGroupInfo.cumAvg += val.fpDuration;
    }

    else {
      if (val.backEndDuration < TransactionGroupInfo.min)
        TransactionGroupInfo.min = val.backEndDuration;

      if (val.backEndDuration > TransactionGroupInfo.max)
        TransactionGroupInfo.max = val.backEndDuration;

      TransactionGroupInfo.cumAvg += val.backEndDuration;
      TransactionGroupInfo.errorCount += val.erCount;

      if (TransactionGroupInfo.statusCODE != undefined && val.statusCODE != undefined && TransactionGroupInfo.statusCODE.indexOf(val.statusCODE) == -1)
        TransactionGroupInfo.statusCODE += "," + val.statusCODE;
    }

    TransactionGroupInfo.count++;
    TransactionGroupInfo.avg = TransactionGroupInfo.cumAvg / TransactionGroupInfo.count;
    if (isNaN(TransactionGroupInfo.avg) || TransactionGroupInfo.avg == Infinity) {
      TransactionGroupInfo.avg = 0;
    }
    return TransactionGroupInfo;
  }
  //This method is used to get NDE.conf information as a object
  getNDEInfoFromID(ndeId) {
    for (var i = 0; i < this.flowMapData.ndeInfoData.length; i++) {
      var val = this.flowMapData.ndeInfoData[i];
      if (val.ndeId == ndeId)
        return val;
    }
  }
  // This function is used to set coherence type based on backendsubtype
  //0- put() 1-putAll() 2-get() 3-getAll() 4-remove 5-replace  
  //TODO - what is max count in BCI ?[public static final int SUB_TYPE_BACKEND_COHERENCE_MAX_COUNT = 5;]
  getCoherenceType(backendSubType) {
    var retValue = "";
    if (backendSubType == 0)
      retValue = "put()";
    else if (backendSubType == 1)
      retValue = "putAll()";
    else if (backendSubType == 2)
      retValue = "get()";
    else if (backendSubType == 3)
      retValue = "getAll()";
    else if (backendSubType == 4)
      retValue = "remove()";
    else if (backendSubType == 5)
      retValue = "replace()";
    return retValue;
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
      return "ClOUDANT_DB";
    else if (backendType == 22)
      return "FTP";
    else if (backendType == 23)
      return "KAFKA";  
    else if (backendType == 25)
      return "DYNAMO"; 
    return backendTypeName;
  }

  // Initializing the individual group info variables 
  createTransactionGroupInfo() {
    var TransactionGroupInfo = {
      "url": "",
      "backendType": "",
      "backendName": "",
      "backendSubType": "",
      "backendQuery": "",
      "min": 0,//long
      "max": 0,
      "avg": 0,
      "cumAvg": 0,//double
      "threadID": 0,
      "startTime": "",
      "startTimeInMs": "",
      "fpDuration": "",
      "flowPathInstance": "",
      "urlQueryParmStr": "",
      "urlIndex": "",
      "tierId": "",
      "tierName": "",
      "serverId": "",
      "serverName": "",
      "appId": "",
      "appName": "",
      "ndeId": "",
      "correlationid": "",
      "btcputime": "",
      "count": 0,
      "errorCount": 0,
      "statusCODE": "",
      "resourceId": ""
    };
    return TransactionGroupInfo;
  }
  trimText(text, number) {
    if (text != undefined && text.length > number)
      text = text.substring(0, number) + "..";
    return text;
  }
  createDataForTable(backendCallType, resourceIdMap, val, transactionGroupedList, transactionGroupInfo) {
    return new Promise ((resolve, reject) => {
      var transactionGroupInfo = this.TransactionGroupInfo(backendCallType, val, resourceIdMap, )
      var findIndex = this.listIndexOf(transactionGroupedList, transactionGroupInfo, backendCallType);
      //console.log(" index --- = " + findIndex + " backendCallType = "+ backendCallType +  " transGroupType = " + transGroupType);

      if (findIndex != -1) {

        transactionGroupInfo = transactionGroupedList[findIndex];
        transactionGroupInfo = this.addTransactionPropertiesForGrouping(val, transactionGroupInfo);
        transactionGroupedList[findIndex] = transactionGroupInfo;

        if (transactionGroupInfo.count > 1 && transactionGroupInfo.tierName != '-') {
          transactionGroupedList.push(val);
          resolve(transactionGroupedList);
        }
      }
      else {

        transactionGroupedList.push(transactionGroupInfo);
        resolve(transactionGroupedList);

      }
    });
  }
 decodeUrlQuery(val){
 if(val)
  return val.replace(/&#038;/g, "&").replace(/&#044;/g, ",").replace(/&#010;/g, "\n").replace(/&#039;/g, "\'").replace(/&#034;/g, "\"").replace(/&#092;/g, "\\").replace(/&#124;/g, "\|").replace(/&#46;/g, ".").replace(/&#58/g, ":").replace(/&#011;/g, "\r\n").replace(/&#094;/g, "^");
 else
  return val;
 }
}


