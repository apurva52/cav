import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Store } from 'src/app/core/store/store';
import { TRANSACTION_FLOWPATH_DETAILS_TABLE } from './transaction-flowpath-details.dummy';
import { TransactionFlowpathDetailsLoadedState, TransactionFlowpathDetailsLoadingErrorState, TransactionFlowpathDetailsLoadingState } from './transaction-flowpath-details.state';
import { SessionService } from 'src/app/core/session/session.service';
import * as jQuery from 'jquery';
import { environment } from 'src/environments/environment';
import { TransactionFlowMapServiceInterceptor } from '../../service/transaction-flowmap.service.interceptor';
import { AppError } from 'src/app/core/error/error.model';
import { DownloadReportLoadingState, DownloadReportLoadedState, DownloadReportLoadingErrorState} from './transaction-flowpath-details.state'

@Injectable({
  providedIn: 'root',
})
export class TransactionFlowpathDetailsService extends Store.AbstractService {

  fp_DataID: string;
  flowpathInstance: string;
  tierName: string;
  serverName: string;
  appName: string;
  statusCode: string;
  startTimeStr: string;
  responseTimeStr: string;
  endTime: number;
  startTime: number;
  responseTime: number;
  RowData:any;
  jsonData:any;
  error: AppError;
  loading: boolean;
  // public interceptor: TransactionFlowMapServiceInterceptor;

  constructor(
    private sessionService: SessionService, private transactionFlowMapServiceInterceptor: TransactionFlowMapServiceInterceptor
  ){
    super();
    //this.interceptor = new TransactionFlowMapServiceInterceptor(this.jsonData, sessionService);
  }

  load(): Observable<Store.State> {
    const me = this;
    const output = new Subject<Store.State>();

    setTimeout(() => {
      output.next(new TransactionFlowpathDetailsLoadingState());
    }, 0);

    /// DEV CODE ----------------->

    setTimeout(() => {
      //this.interceptor.test(data);
      this.jsonData = this.sessionService.getSetting("TxnFMData");
      //this.jsonData =this.interceptor.jsonData;
      output.next(new TransactionFlowpathDetailsLoadedState(this.jsonData));
      output.complete();
    }, 2000);

    // setTimeout(() => {
    //   output.error(new TransactionFlowpathDetailsLoadingErrorState(new Error()));
    // }, 2000);

    // / <----------------- DEV CODE

    // const path = environment.api.URL.load.endpoint;
    // const payload = {
    //   duration
    // };
    // me.controller.post(path, payload).subscribe(
    //   (data: FlowpathTable) => {
    //     output.next(new FlowpathLoadedState(data));
    //     output.complete();
    //   },
    //   (e: any) => {
    //     output.error(new FlowpathLoadingErrorState(e));
    //     output.complete();

    //     me.logger.error('Transaction Group Data loading failed', e);
    //   }
    // );

    return output;
  }
  loadForQuery(uniqueSqlList, sqlQueries, val, transactionGroupedList): Observable<Store.State> {
    const me = this;
    const output = new Subject<Store.State>();
    var sqlDataMap = {};

    setTimeout(() => {
      output.next(new TransactionFlowpathDetailsLoadingState());
    }, 0);

    /// DEV CODE ----------------->

const path = environment.api.transactionFlowmapMetaDataReport.load.endpoint;
const payload = {
  cctx: me.sessionService.session.cctx,
  testRun: me.sessionService.session.testRun.id,
  sqlIds: uniqueSqlList,
  subType: "sql",
  entityID: ""
};


me.controller.post(path, payload).subscribe(
  (data) => {
   sqlDataMap = data.panels[0].data;
   let dataTemp = this.createJsonFortable(sqlQueries, val, sqlDataMap, transactionGroupedList);
   output.next(new TransactionFlowpathDetailsLoadedState(dataTemp));
    output.complete();
  },
  (e: any) => {
    output.error(new TransactionFlowpathDetailsLoadingErrorState(e));
    output.complete();;

    me.logger.error('Trx Flowmap Query Data loading failed', e);
  }
);
    return output;
  }

  // Method is used to download report in pdf,excel and word format
  downloadShowDescReports(downloadType, rowData, header, reportTitle): Observable<Store.State> {
    try {
      const me = this;
      const output = new Subject<Store.State>();

      setTimeout(() => {
        output.next(new DownloadReportLoadingState());
      }, 3000);

      let skipColumn = [];
      let downloadDataPayload = {};

      downloadDataPayload = {
        "testRun": me.sessionService.testRun.id,
        "clientconnectionkey": me.sessionService.session.cctx.cck,
        "userName": me.sessionService.session.cctx.u,
        "productName": me.sessionService.session.cctx.prodType,
        "downloadType": downloadType,
        "skipColumn": skipColumn,
        "rowData": rowData,
        "header": header,
        "reportTitle": reportTitle
      }
      let downloadPath = environment.api.dashboard.download.endpoint;
      me.controller.post(downloadPath, downloadDataPayload).subscribe((DownloadReportData: any) => {
      output.next(new DownloadReportLoadedState(DownloadReportData));
      output.complete();
      },
        (error: AppError) => {
          output.next(new DownloadReportLoadingErrorState(error));
          output.complete();
        }
      );
      return output;
    } catch (err) {
      console.log("Exception has occured while Downloading Report for Show Description", err);
    }
  }

  //////
 //Phase 3-4 -- 102 original ---> For individual node infromation

  //This function is used to get individual information of a particular node,when user double click on any node
  getIndividualGroupedInfo(transGroupType, depth, key, transactionTierList) {
    return new Promise((resolve, reject) => {
      //transGroupType is backendID
      var transactionGroupedList: any = [];
      var transactionDTOMap = {};
      var transactionDTOList = [];
      var backendCallType = this.getBackendType(key, transGroupType);
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
          this.addDBQueries(transactionGroupedList, val).then((data) => {
          resolve(data);
          });

        }
        else if (val.callOutType == "C" && val.coherenceCallOuts != undefined) {
          //For Coherence New Format
          transactionGroupedList = this.addCoherenceTypes(transactionGroupedList, val).then((data) => resolve(data));

        }
        else if (backendCallType == 1 && resourceIdList.length > 0) {
          // this.ajaxCallForresourceId(resourceIdList.toString(), testRun, ndeId, contextName).then((data) => {
          //   resourceIdMap = data;
          //   resouceIdCount++;
          //   this.createDataForTable(backendCallType, resourceIdMap, val, transactionGroupedList, transactionGroupInfo).then((data) => {
          //   if(resouceIdCount == resourceIdList.length)
          //    resolve(transactionGroupedList);
          //   });
          //   //this.createDataForTable(backendCallType, resourceIdMap, val, transactionGroupedList, transactionGroupInfo).then((data) => resolve(data));
          // })
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

// This method is used to

addDBQueries(transactionGroupedList, val) {
  //console.log("Querying---NdeId :" + val.ndeId +"DBCallOuts : "+val.dbCallOuts);
  return new Promise((resolve, reject) => {
    var uniqueSQLList = new Array();
    var sqlQueries = val.dbCallOuts;
    for (var obj in sqlQueries) {
      if(obj != '-1'){
        uniqueSQLList.push(obj);
      }
    }

    //  var sqlDataMap = {};
    // var ndeCurrentInfo = this.getNDEInfoFromID(val.ndeId);
    // //var specificTestRun = this.flowMapData.allDCData[val.ndeId].testRun;

    // var url = "/v1/cavisson/netdiagnostics/ddr/trxFlowMap/metadata/sql?testRun=" + specificTestRun;
    // //var url =  contextName + "v1/cavisson/netdiagnostics/ddr/trxFlowMap/metadata/sql?testRun=" + testRun;

    // if (ndeCurrentInfo != undefined && ndeCurrentInfo != null && ndeCurrentInfo != '' && ndeCurrentInfo != 'NA') //Only in case where DC.conf is present
    // {
    //  var IPPort;
    //  if(this._ddrData.nodeKey === '1'){
    //   IPPort = location.protocol  + "//" + location.host + "/tomcat/" + ndeCurrentInfo.displayName;
    //  }
    //  else{
    //  if(ndeCurrentInfo.ndeProtocol != undefined && ndeCurrentInfo.ndeProtocol != null && ndeCurrentInfo.ndeProtocol != '' && ndeCurrentInfo.ndeProtocol != 'NA')
    //   IPPort = ndeCurrentInfo.ndeProtocol + "://" + ndeCurrentInfo.ndeIPAddr + ":" + ndeCurrentInfo.ndeTomcatPort;
    //  else
    //   IPPort = "//" + ndeCurrentInfo.ndeIPAddr + ":" + ndeCurrentInfo.ndeTomcatPort;
    //  }
    //   url = IPPort + "/" + this.flowMapData.urlParam.product +  url;
    // }
    // else
    // {
    //  url = this.flowMapData.hosturl + this.flowMapData.urlParam.product + url;
    // }

    // url = url + "&sqlID=" + uniqueSQLList.toString();
    // console.log("URL: "+url);
    // console.log("URL: "+url);   //this.ddrRequest.getDataUsingGet(url).subscribe
     let uniqueSqlList = uniqueSQLList.toString();
     this.loadForQuery(uniqueSqlList, sqlQueries, val, transactionGroupedList).subscribe(
      (state: Store.State) => {
        if (state instanceof TransactionFlowpathDetailsLoadingState) {
          this.error = null;
          this.loading = true;
        }

        if (state instanceof TransactionFlowpathDetailsLoadedState) {
          this.error = null;
          this.loading = false;
          resolve(state.data);
        }
      },
      (state: TransactionFlowpathDetailsLoadingErrorState) => {
        this.error = state.error;
        this.loading = false;
      }
    );
    //  this.loadForQuery(uniqueSqlList).subscribe(
    //   (data) => {
    //     console.log(data + 'what is exactly coming');
    //     sqlDataMap = data;//JSON.parse(['_body']);
    //     let dataTemp = this.createJsonFortable(sqlQueries, val, sqlDataMap, transactionGroupedList);
    //     console.log("dataForJson - ", dataTemp);
    //     resolve(dataTemp);
    //   }
    // )
  });
}

//TODO - Can be Optimized
createJsonFortable(sqlQueries, val, sqlDataMap, transactionGroupedList) {
  // var sqlDataMap1 = sqlDataMap.data;
  for (var obj in sqlQueries) {
    if(obj != '-1'){
      var key = obj;
      var TransactionGroupInfo = this.createTransactionGroupInfo();
    TransactionGroupInfo.tierId = val.tierId;
    TransactionGroupInfo.tierName = val.tierName;
    TransactionGroupInfo.serverName = val.serverName;
    TransactionGroupInfo.serverId = val.serverId;
    TransactionGroupInfo.appName = val.appName;
    TransactionGroupInfo.appId = val.appId;
    //console.log(sqlDataMap + " ------------------ " + sqlDataMap.data + "--------------");
    TransactionGroupInfo.backendQuery = this.decodeUrlQuery(sqlDataMap[obj]);
    //console.log(sqlDataMap.data[obj] + " ------------------ " + sqlDataMap.data.key + "--------------" + sqlDataMap['data'][obj]);
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
  return new Promise((resolove, reject) => {
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
      TransactionGroupInfo.backendType = this.transactionFlowMapServiceInterceptor.getBackendTypeName(val.backendType);

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
      TransactionGroupInfo.backendType = this.transactionFlowMapServiceInterceptor.getBackendTypeName(val.backendType);

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

  //This functions is used to getbackedType according to the backendTypeName
  getBackendType(key, backendTypeName) {
    if (backendTypeName == "HTTP")
      return 1;
    else if (backendTypeName == "JDBC")
      return 2;
    else if (backendTypeName == "COHERENCE")
      return 3;
    else if (backendTypeName == "RMI")
      return 4;
    else if (backendTypeName == "MemCache")
      return 5;
    else if (backendTypeName == "CLOUDANT")
      return 6;
    else if (backendTypeName == "HADOOP")
      return 7;
    else if (backendTypeName == "CASSANDRA")
      return 9;
    else if (backendTypeName == "DB")
      return 10;
    else if (backendTypeName == "IBM_MQ")
      return 11;
    else if (backendTypeName == "ACTIVE_MQ")
      return 12;
    else if (backendTypeName == "RABBIT_MQ")
      return 13;
    else if (backendTypeName == "MongoDB")
      return 15;
    else if (backendTypeName == "Redis")
      return 16;
    else if (backendTypeName == "JMS_ATG")
      return 14;
     else if (backendTypeName == "CLOUDANT_DB")
      return 19;
    else if (backendTypeName == "FTP")
      return 22;
    else if (backendTypeName == "KAFKA")
      return 23;
    else if (backendTypeName == "LDAP")
      return 24;
    else if (backendTypeName == "DYNAMO")
      return 25;
    else if (backendTypeName == "SOCKET")
      return 26;
    else
      return 1;
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

  decodeUrlQuery(val){
    if(val)
     return val.replace(/&#038;/g, "&").replace(/&#044;/g, ",").replace(/&#010;/g, "\n").replace(/&#039;/g, "\'").replace(/&#034;/g, "\"").replace(/&#092;/g, "\\").replace(/&#124;/g, "\|").replace(/&#46;/g, ".").replace(/&#58/g, ":").replace(/&#011;/g, "\r\n").replace(/&#094;/g, "^");
    else
     return val;
    }
}
