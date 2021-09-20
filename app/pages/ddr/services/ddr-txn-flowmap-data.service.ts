import { Injectable } from '@angular/core';
import { CommonServices } from './common.services';
// import 'rxjs/add/operator/toPromise';
// import { CavTopPanelNavigationService } from './../../../main/services/cav-top-panel-navigation.service';
import { Router } from '@angular/router';
//import { DdrDataModelService } from "./ddr-data-model.service";
import { DdrDataModelService } from '../../../pages/tools/actions/dumps/service/ddr-data-model.service';

//declare var LZString: any;
import { LZString } from './common.services';
import { DDRRequestService } from './ddr-request.service';
import { timeout } from 'rxjs/operators';

@Injectable()
export class DdrTxnFlowmapDataService {
  ndeInfoData = [];
  jsonforflowmap = [];
  jsonData = {};
  jsondataforTable = {};
  totalFPDuration = 0;
  seqNum = 0;
  mergedSourceMap = {};
  aggregateSimialrTypes = {};
  hosturl
  DEFAULT_NDE_ID = -1;
  urlParam;
  childFlowpatthData = "";
  paramsForFlowMap: FlowpathDataInterface;
  private _fpDuration: any;
  showOrigFlowmap: boolean = false;
  isRootFpMissing: boolean = false;
  jsonDataToDraw = [];
  newSqbvalue = 0;
  duplicateSeqNum = [];//checking for duplicate seqno
  isFirstRoot: boolean = false; //it for check root fp in multidc case
  jmsSourceId: any;
  constructor(
    public CommonServices: CommonServices, 
    private _router: Router, 
    private ddrRequest: DDRRequestService, 
    private _ddrData: DdrDataModelService
    ) {

    sessionStorage.removeItem("transactionFlow_" + this.childFlowpatthData);
  }

  public get fpDuration(): any {
    return this._fpDuration;
  }

  public set fpDuration(value: any) {
    this._fpDuration = value;
  }
  getParsedJson() {
    return this.jsonData;
  }
  getTruncatedURL(name) {
    let str = "";

    // if (name == '-' || !name)    //Due to A-9 migration requirement
    //   return '';

    // if (name.length <= 32)
    //   return name;

    // str = name.substring(0, 16) + "..." + name.substring(name.length - 16, name.length);
    return str;
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

  getDataForTxnFlowpath(childFlowpatthData, rawData) {
    this.isFPMissCase = false;
    this.paramsForFlowMap = rawData;
    console.log('row dat for download0', rawData)
    this.urlParam = this.CommonServices.getData();
    if (this.urlParam.enableQueryCaching) {
      this.CommonServices.enableQueryCaching = this.urlParam.enableQueryCaching;
    }
    this.seqNum = 0;
    if (this._ddrData.isFromtrxFlow && this._ddrData.isFromAgg) {
      if (this._ddrData.protocolTr)
        this.hosturl = this._ddrData.protocolTr + "://" + this._ddrData.hostTr + ":" + this._ddrData.portTr;
      else
        this.hosturl = "//" + this._ddrData.hostTr + ":" + this._ddrData.portTr;
      this.hosturl += "/";
      this.urlParam.testRun = this._ddrData.testRunTr;
      this.childFlowpatthData = childFlowpatthData;
      let userLoginName = sessionStorage.getItem("sesLoginName");
      let ipPort = this.urlParam.ipWithProd;
      this.getComandArgs();
      setTimeout(() => {
        this.getDataFromDatabase(ipPort, this.urlParam.testRun, userLoginName);
      }, 300);
    }
    else if (sessionStorage.getItem("isMultiDCMode") == "true") {
      this._ddrData.getKeyInfo().then(() => {
        if (this._ddrData.nodeKey === '1') {
          this.ndeInfoData = this._ddrData.getDcNameInfo();
          this.childFlowpatthData = childFlowpatthData;
          this.hosturl = location.protocol + "//" + location.host + "/tomcat/" + this._ddrData.getMasterDC() + '/';
          //String relatedGraphJSON =
          this.getComandArgs();

          let userLoginName = sessionStorage.getItem("sesLoginName");
          let ipPort = this.urlParam.ipWithProd
          setTimeout(() => {
            this.getDataFromDatabase(ipPort, this.urlParam.testRun, userLoginName);
          }, 300);
        }
        else {
          this.getNDE(childFlowpatthData, rawData);
        }
      });
    }
    else {
      this.getNDE(childFlowpatthData, rawData);
    }
  }
  getNDE(childFlowpatthData, rawData) {
    try {
      if (this.CommonServices.testRun != undefined && this.CommonServices.testRun != null && this.CommonServices.testRun != '') {
        this.urlParam.testRun = this.CommonServices.testRun;
      }
      if (this.CommonServices.host != undefined && this.CommonServices.host != '' && this.CommonServices.host != null) {
        if (this.CommonServices.protocol && this.CommonServices.protocol.endsWith("://"))
          this.hosturl = this.CommonServices.protocol + this.CommonServices.host + ':' + this.CommonServices.port + '/';
        else if (this.CommonServices.protocol)
          this.hosturl = this.CommonServices.protocol + "://" + this.CommonServices.host + ':' + this.CommonServices.port + '/';
        else
          this.hosturl = "//" + this.CommonServices.host + ':' + this.CommonServices.port + '/';

      } else {
        //Due to LRM Migration..
        // if (!sessionStorage.getItem('hostDcName').startsWith("//") && !sessionStorage.getItem('hostDcName').startsWith("http") && sessionStorage.getItem("protocol"))
        //   this.hosturl = sessionStorage.getItem("protocol") + "://" + sessionStorage.getItem('hostDcName') + "/";
        // else if (sessionStorage.getItem('hostDcName').startsWith("http"))
        //   this.hosturl = sessionStorage.getItem('hostDcName') + "/";
        // else
        //   this.hosturl = "//" + sessionStorage.getItem('hostDcName') + "/";
        console.log("Else case Trx =");
        this.hosturl = this._ddrData.getHostUrl() + "/";
        console.log("Value coming in host Url =", this.hosturl);
      }
      let url = this.hosturl + this.urlParam.product.replace('/', "") + '/v1/cavisson/netdiagnostics/ddr/getNDEinfoForFlowmap?testRun=' + this.urlParam.testRun;
      console.log(url);
      this.getRequestData(url).subscribe(
        res => {
          let data = <any>res;
          this.ndeInfoData = data
          console.log("datafor", data);
          this.childFlowpatthData = childFlowpatthData;

          //String relatedGraphJSON =
          this.getComandArgs()



          let userLoginName = sessionStorage.getItem("sesLoginName");
          let ipPort = this.urlParam.ipWithProd
          setTimeout(() => {
            this.getDataFromDatabase(ipPort, this.urlParam.testRun, userLoginName);
          }, 300);
        },
        err => {
          this.CommonServices.loaderForDdr = false;
        }
      );
    }
    catch (e) {
      this.CommonServices.loaderForDdr = false;
    }
  }
  timeFilters = "";
  cmdArgs = ''
  isFpCheckMiss: boolean = true;

  getComandArgs() {
    this.cmdArgs = '';
    this.timeFilters = ''
    console.log('cmd args', this.cmdArgs)
    this.cmdArgs = " --object  4  --status  -2 ";
    if (this.paramsForFlowMap.startTimeInMs != "" && this.paramsForFlowMap.startTime !== "NA") {

      this.timeFilters += " --abs_starttime " + (Number(this.paramsForFlowMap.startTimeInMs) - 1800000);
      // sessionStorage.setItem("startTimeforFlowmap",this.paramsForFlowMap.startTime);
      console.log("before replace fpduration is :==", this.paramsForFlowMap.fpDuration.toString());
      this.fpDuration = this.paramsForFlowMap.fpDuration.toString().replace(/,/g, "");
      console.log("after replace fpduration is :==", this.fpDuration);
      let endTime = Number(this.paramsForFlowMap.startTimeInMs) + Number(this.fpDuration) + 1800000;
      console.log("End time is===", endTime);
      //sessionStorage.setItem("endTimeforFlowmap", this.paramsForFlowMap.fpDuration.toString().replace(/,/g,""));
      // console.log('this.paramsForFlowMap.fpDuration *** ',Number(this.paramsForFlowMap.fpDuration.toString().replace(/,/g,"")) ,'endtime',endTime,this.paramsForFlowMap.startTimeInMs,' this.paramsForFlowMap.startTime *** ',this.paramsForFlowMap.startTime);
      this.timeFilters += " --abs_endtime " + endTime;
    }

    /*Wrong code for getting transaction flowmap- it should pass prevFlowpathInstance not flowpathInstance
if (childFlowpatthData != "NA")
      cmdArgs = cmdArgs + "--getchildflowpath " + childFlowpatthData + timeFilters;
     */

    //code to get transaction flowmap for all flowpath of root flowpaths including current flowpath
    if (this.paramsForFlowMap != undefined && Number(this.paramsForFlowMap.prevFlowpathInstance) != 0 && this.isFpCheckMiss) {
      if (this.CommonServices.isFromFpInstance) {

        this.cmdArgs = this.cmdArgs + "--getchildflowpath " + this.paramsForFlowMap.flowpathInstance + this.timeFilters;
      }
      else {
        this.cmdArgs = this.cmdArgs + "--getchildflowpath " + this.paramsForFlowMap.prevFlowpathInstance + this.timeFilters;
      }
    }
    else if (this.childFlowpatthData != "NA")
      this.cmdArgs = this.cmdArgs + "--getchildflowpath " + this.childFlowpatthData + this.timeFilters;


    if (this.paramsForFlowMap["selfResponseTime"]) {
      this.cmdArgs = this.cmdArgs + "--enableNewSQB " + 10 + " --enableDDRDebug 0";
    }
    else {
      this.cmdArgs = this.cmdArgs + "--enableNewSQB " + 0 + " --enableDDRDebug 0";
    }
  }
  allDCData = {};
  isRemoteTiers = "true";
  countLoaderData = 1;  //for all data case rest failed case check
  countLoaderRoot = 1;  //for all root case rest failed case check
  processingInterval
  multiDCMissRootFp = false;  //it is for remove multiple rest call when root found
  missRootFpArr: any;  // it contain the data of rootFP check rest call
  getDataFromDatabase(contextName, testRun, sesLoginName) {
    this.multiDCMissRootFp = false;
    this.missRootFpArr = "";
    this.allDCData = {};
    this.jsonData = {};
    this.jsonforflowmap = [];
    if (this.ndeInfoData.length != 0 && this.isRemoteTiers == "true") //if file exists
    {
      console.log(" NDE.conf exists with some data ......... ");
      this.checkRootFp().then(() => {

        if (!this.showOrigFlowmap && !this.isFirstRoot) {
          if (this.missRootFpArr && this.missRootFpArr.includes("true")) {
            this.isFirstRoot = true;
            this.isFpCheckMiss = true;
            this.isRootFpMissing = false;
            console.log("true case final");
          }
          else if (this.missRootFpArr && this.missRootFpArr.includes("false")) {
            this.isFpCheckMiss = false;
            this.isRootFpMissing = true;
            console.log("false case final");
          }
        }
        this.ndeInfoData.forEach((val) => {
          this.countLoaderData = 1;
          var IPPort = "";
          if (this._ddrData.nodeKey === '1') {
            IPPort = location.protocol + "//" + location.host + "/tomcat/" + val.displayName;
          }
          else {
            if (val.ndeProtocol)
              IPPort = val.ndeProtocol + "://" + val.ndeIPAddr + ":" + val.ndeTomcatPort;
            else
              IPPort = "//" + val.ndeIPAddr + ":" + val.ndeTomcatPort;
          }
          var dcTestRun;
          if (val.ndeTestRun)
            dcTestRun = val.ndeTestRun;
          else
            dcTestRun = this.urlParam.testRun;

          let url = "";
          console.log('return', IPPort);
          this.getComandArgs();

          if (this.CommonServices.enableQueryCaching == 1) {
            url = IPPort + "/netdiagnostics/v1/cavisson/netdiagnostics/ddr/trxFlowMap/data/" + dcTestRun + "?cmdArgs=" + encodeURIComponent("--testrun " + dcTestRun + this.cmdArgs) + "&ndeId=" + val.ndeId;
          } else {
            url = IPPort + "/netdiagnostics/v1/cavisson/netdiagnostics/ddr/trxFlowMap/data?cmdArgs=" + encodeURIComponent("--testrun " + dcTestRun + this.cmdArgs) + "&ndeId=" + val.ndeId;
          }
          this.ddrRequest.getDataInStringUsingGet(url).subscribe(
            // Successful responses call the first callback.
            data => {
              let resdata = LZString.decompressFromEncodedURIComponent(data);
              resdata = JSON.parse(resdata);
              this.allDCData[val.ndeId] = resdata;
            },
            // Errors will call this callback instead:
            err => {
              if (this.countLoaderData == this.ndeInfoData.length)
                this.CommonServices.loaderForDdr = false;
              this.allDCData[val.ndeId] = {};//JSON.parse("{}");
              this.countLoaderData++;
            });
        },
          //set Interval to check response is retrived
          this.processingInterval = setInterval(() => {
            console.log("calling filter set time Interval");
            if (Object.entries(this.allDCData).length >= this.ndeInfoData.length) {
              this.checkInterval = this.CommonServices.ajaxTimeOut;
            }
            this.checkForCriteria();
          }, 5000))
      });
    }

    else //file does not exists
    {
      let url = "";
      if (this.CommonServices.enableQueryCaching == 1) {
        url = this.hosturl + this.urlParam.product.replace('/', "") + "/v1/cavisson/netdiagnostics/ddr/trxFlowMap/data/" + this.urlParam.testRun + "?cmdArgs=" + encodeURIComponent("--testrun " + this.urlParam.testRun + this.cmdArgs) + "&ndeId=" + this.DEFAULT_NDE_ID;
      }
      else {
        url = this.hosturl + this.urlParam.product.replace('/', "") + "/v1/cavisson/netdiagnostics/ddr/trxFlowMap/data?cmdArgs=" + encodeURIComponent("--testrun " + this.urlParam.testRun + this.cmdArgs) + "&ndeId=" + this.DEFAULT_NDE_ID;
      }
      console.log("first");
      let urlForFpCheck = this.hosturl + this.urlParam.product.replace('/', "") + "/v1/cavisson/netdiagnostics/ddr/trxFlowMap/rootFPCheck?cmdArgs=" + encodeURIComponent("--testrun " + this.urlParam.testRun + this.cmdArgs) + "&ndeId=" + this.DEFAULT_NDE_ID;
      if (!this.showOrigFlowmap && !this.isFirstRoot) {
        this.ddrRequest.getDataInStringUsingGet(urlForFpCheck).pipe(timeout(this.CommonServices.ajaxTimeOut)).subscribe(
          data => {

            if (LZString.decompressFromEncodedURIComponent(data) == 'false') {
              this.isFpCheckMiss = false;
              this.isRootFpMissing = true;
            }
            else {
              this.isFpCheckMiss = true;
            }
            this.getComandArgs()
            if (this.CommonServices.enableQueryCaching == 1) {
              url = this.hosturl + this.urlParam.product.replace('/', "") + "/v1/cavisson/netdiagnostics/ddr/trxFlowMap/data/" + this.urlParam.testRun + "?cmdArgs=" + encodeURIComponent("--testrun " + this.urlParam.testRun + this.cmdArgs) + "&ndeId=" + this.DEFAULT_NDE_ID;
            }
            else {
              url = this.hosturl + this.urlParam.product.replace('/', "") + "/v1/cavisson/netdiagnostics/ddr/trxFlowMap/data?cmdArgs=" + encodeURIComponent("--testrun " + this.urlParam.testRun + this.cmdArgs) + "&ndeId=" + this.DEFAULT_NDE_ID;
            }
            this.ddrRequest.getDataInStringUsingGet(url).pipe(timeout(this.CommonServices.ajaxTimeOut)).subscribe(
              // Successful responses call the first callback.
              data => {
                //  data = this.trimString(data);
                let resdata = LZString.decompressFromEncodedURIComponent(data);
                resdata = JSON.parse(resdata);
                if (resdata && resdata.length == 0) {
                  this.CommonServices.loaderForDdr = false;
                  return;
                }

                if (resdata.hasOwnProperty('Error')) {
                  console.log("Status", resdata.Status);
                  this.CommonServices.showError(resdata.Error);
                  this.CommonServices.loaderForDdr = false;
                }
                this.isFPMissCase = false;
                this.allDCData[this.DEFAULT_NDE_ID] = resdata;
                if (this.allDCData != undefined) {
                  //sessionStorage.removeItem("transactionFlow_");
                  // sessionStorage.setItem("transactionFlow_" ,LZString.compress(JSON.stringify(this.allDCData)));
                }
                //console.log(JSON.stringify(this.allDCData));
                this.jsonforflowmap = this.allDCData[this.DEFAULT_NDE_ID].dtoList;
                if (this.jsonforflowmap) {
                  this.jsonData = this.mergeDataForTransactionFlow(this.jsonforflowmap);
                  this.removeUnusedAsync();
                }
                if (this.CommonServices.isIntegratedFlowpath) {
                  this.CommonServices.showTransactionFlowmap = true;
                  this.CommonServices.openFlowMapTab = true;
                  this.CommonServices.jsonData = this.jsonData;
                }
                else {
                  setTimeout(() => {
                    if (this._router.url.indexOf("/home/ddrCopyLink") != -1)
                      this._router.navigate(['/home/ddrCopyLink/Ddrtransactionflowpmap']);
                    else if (this._router.url.indexOf("/home/ED-ddr") != -1)
                      this._router.navigate(['/home/ED-ddr/Ddrtransactionflowpmap'])
                    else
                      this._router.navigate(['/home/ddr/Ddrtransactionflowpmap']);
                  }, 1000);
                }
                // this.CommonServices.loaderForDdr = false;
                //console.log("this.jsondata", this.jsonData);
                // createFlowMap();
              },
              error => {
                this.CommonServices.loaderForDdr = false;
                this.CommonServices.openFlowpath = true;

                this.CommonServices.showError('Query taking more time than ' + this.CommonServices.ajaxTimeOut + ' ms to give response');
              }
            );
          }
        );

      }
      else {


        this.getComandArgs()
        //url = this.hosturl + "/v1/cavisson/netdiagnostics/ddr/trxFlowMap/data?cmdArgs=" + encodeURIComponent(this.cmdArgs) + "&ndeId=" + this.DEFAULT_NDE_ID;
        this.ddrRequest.getDataInStringUsingGet(url).pipe(timeout(this.CommonServices.ajaxTimeOut)).subscribe(
          // Successful responses call the first callback.
          data => {
            //  data = this.trimString(data);
            let resdata = LZString.decompressFromEncodedURIComponent(data);
            resdata = JSON.parse(resdata);
            if (resdata && resdata.length == 0) {
              this.CommonServices.loaderForDdr = false;
              return;
            }
            if (resdata.hasOwnProperty('Error')) {
              console.log("Status", resdata.Status);
              this.CommonServices.showError(resdata.Error);
              this.CommonServices.loaderForDdr = false;
            }
            this.isFPMissCase = false;
            this.allDCData[this.DEFAULT_NDE_ID] = resdata;
            if (this.allDCData != undefined) {
              //sessionStorage.removeItem("transactionFlow_");
              // sessionStorage.setItem("transactionFlow_" ,LZString.compress(JSON.stringify(this.allDCData)));
            }
            //console.log(JSON.stringify(this.allDCData));
            this.jsonforflowmap = this.allDCData[this.DEFAULT_NDE_ID].dtoList;
            if (this.jsonforflowmap) {
              this.jsonData = this.mergeDataForTransactionFlow(this.jsonforflowmap);
              this.removeUnusedAsync();
            }
            if (this.CommonServices.isIntegratedFlowpath) {
              this.CommonServices.showTransactionFlowmap = true;
              this.CommonServices.openFlowMapTab = true;
              this.CommonServices.jsonData = this.jsonData;
            }

            else {
              setTimeout(() => {
                if (this._router.url.indexOf("/home/ddrCopyLink") != -1)
                  this._router.navigate(['/home/ddrCopyLink/Ddrtransactionflowpmap']);
                else if (this._router.url.indexOf("/home/ED-ddr") != -1)
                  this._router.navigate(['/home/ED-ddr/Ddrtransactionflowpmap'])
                else
                  this._router.navigate(['/home/ddr/Ddrtransactionflowpmap']);
              }, 1000);
            }
            // this.CommonServices.loaderForDdr = false;
            //console.log("this.jsondata", this.jsonData);
            // createFlowMap();
          },
          error => {
            this.CommonServices.loaderForDdr = false;
            this.CommonServices.openFlowpath = true;

            this.CommonServices.showError('Query taking more time than ' + this.CommonServices.ajaxTimeOut + ' ms to give response');
          }
        );
      }



    }
  }
  checkRootFp(): any {

    return new Promise<void>((resolve, reject) => {
      if (!this.showOrigFlowmap && !this.isFirstRoot) {
        this.countLoaderRoot = 1;
        if (!this.multiDCMissRootFp) {
          this.multiDCMissRootFp = true;
          let count = 1;
          this.ndeInfoData.forEach((val, index) => {
            if (!this.isFirstRoot) {
              var IPPort = "";
              if (this._ddrData.nodeKey === '1') {
                IPPort = location.protocol + "//" + location.host + "/tomcat/" + val.displayName;
              }
              else {
                if (val.ndeProtocol)
                  IPPort = val.ndeProtocol + "://" + val.ndeIPAddr + ":" + val.ndeTomcatPort;
                else
                  IPPort = "//" + val.ndeIPAddr + ":" + val.ndeTomcatPort;
              }
              var dcTestRun;
              if (val.ndeTestRun)
                dcTestRun = val.ndeTestRun;
              else
                dcTestRun = this.urlParam.testRun;

              let ndId = val.ndeId;

              if (!ndId && ndId != 0) {
                ndId = this.DEFAULT_NDE_ID;
              }
              let urlForFpCheck = IPPort + "/netdiagnostics/v1/cavisson/netdiagnostics/ddr/trxFlowMap/rootFPCheck?cmdArgs=" + encodeURIComponent("--testrun " + dcTestRun + this.cmdArgs) + "&ndeId=" + ndId;
              this.ddrRequest.getDataInStringUsingGet(urlForFpCheck).pipe(timeout(this.CommonServices.ajaxTimeOut)).subscribe(
                data => {
                  this.missRootFpArr += LZString.decompressFromEncodedURIComponent(data);
                  if (LZString.decompressFromEncodedURIComponent(data) === 'true') {
                    console.log("else case");
                    count++;
                    resolve();
                    return;
                  }
                  else if (count == this.ndeInfoData.length)
                    resolve();
                  else
                    count++;
                },
                error => {
                  if (this.countLoaderRoot == this.ndeInfoData.length) {
                    this.CommonServices.loaderForDdr = false;
                  }
                  console.log("false case 2", this.countLoaderRoot);
                  if (count == this.ndeInfoData.length)
                    resolve();
                  this.countLoaderRoot++;
                  count++;
                }
              );
            }
            else
              resolve();
          });
        }
        else
          resolve();
      }
      else
        resolve();
    });
  }


  startProcessing() {
    console.log("Process Start .............");
    clearInterval(this.processingInterval);

    if (this.allDCData != undefined) {
      //sessionStorage.removeItem("transactionFlow_");
      //sessionStorage.setItem("transactionFlow_" + this.childFlowpatthData, JSON.stringify(this.allDCData));
    }
    if (this.allDCData[this.DEFAULT_NDE_ID] == undefined) //New Format where DC are merged
    {
      for (var i = 0; i < this.ndeInfoData.length; i++) {
        var val = this.ndeInfoData[i];

        if (this.allDCData[val.ndeId] != undefined && this.allDCData[val.ndeId].dtoList != undefined && this.allDCData[val.ndeId].dtoList.length > 0) {
          this.jsonforflowmap = this.jsonforflowmap.concat(this.allDCData[val.ndeId].dtoList);
        }
        else {
          console.log(" Error in NDE :" + val.ndeId + " , Data : " + this.allDCData[val.ndeId]);
        }
      }
    }
    else //Old Format where ndeId is -1 by default
    {
      this.jsonforflowmap = this.allDCData[this.DEFAULT_NDE_ID].dtoList;
    }
    this.jsonData = this.mergeDataForTransactionFlow(this.jsonforflowmap);
    this.removeUnusedAsync();
    if (this.CommonServices.isIntegratedFlowpath) {
      this.CommonServices.showTransactionFlowmap = true;
      this.CommonServices.openFlowMapTab = true;
      this.CommonServices.jsonData = this.jsonData;
    }
    else {
      setTimeout(() => {
        this._router.navigate(['/home/ddr/Ddrtransactionflowpmap']);
      }, 1000);
    }
    //console.log("this.json data", this.jsonData);
    //createFlowMap();
  }


  trimString(str) {
    return str.replace(/^\s+/g, '').replace(/\s+$/g, '');
  }
  //TODO - Merge Data 
  dataforaggre
  mergeDataForTransactionFlow(json) {
    this.duplicateSeqNum = [];//blank value in case of   
    var startTime = new Date().getTime();
    //console.log(" get mergeDataForTransactionFlow is start , startTime is  "+startTime);
    // Sort ASC
    //console.log("sort json", json);
    console.log('json isssss ', json, '', this.compareDESC);
    if(!json) {
      this.CommonServices.loaderForDdr = false;
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
    // console.log("aggregate for data >>>>>>",this.dataforaggre);
    // console.log("dataforaggre", JSON.stringify(this.dataforaggre));
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
        if (!val.urlName.startsWith("JMSC")) {
          val.level = "1.e" + Number(this.getLevelForErrCase()) + Number(this.firstLevel);// commenting firstLevel
          this.isFPMissCase = true;
        }
        else
          val.level = "1.p" + Number(this.getLevelForErrCase()) + Number(this.firstLevel);  //JMSC
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
    if (val.callOutList && val.callOutList.length > 0) {
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
              if (this.duplicateSeqNum.indexOf(jsonLocalObj.beginSeqNum.trim()) == -1)// checking condition for duplicate sequence no
              {
                jsonLocalObj.backEndDuration = callOutVal.backEndDuration;
                jsonLocalObj.totalNetworkDelay = callOutVal.totalNetworkDelay;
                callOutVal.alreadyUsed = true;
                jsonLocalObj.isAlreadyUsed = true;
                this.duplicateSeqNum.push(jsonLocalObj.beginSeqNum.trim());
              }
              else {
                callOutVal.alreadyUsed = true;
                jsonLocalObj.isAlreadyUsed = true;
                jsonLocalObj.backEndDuration = undefined;
                jsonLocalObj.totalNetworkDelay = undefined;
              }

              this.dataforaggre.push(jsonLocalObj);
              console.log("this.jsonforflowmap[k].callOutList ", this.jsonforflowmap[k].callOutList, this.jsonforflowmap[k].callOutList.length);
              if (this.jsonforflowmap[k].callOutList && this.jsonforflowmap[k].callOutList.length > 1)
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
            newObject["previousFlowPathInstance"] = val.previousFlowPathInstance;
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
            newObject["totalNetworkDelay"] = "-1";
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
            newObject["totalNetworkDelay"] = callOutVal.totalNetworkDelay;
            if (callOutVal.mapDBCallouts != undefined) {
              console.log("Adding new Entry for DB Callouts ", callOutVal.mapDBCallouts, "checkk ", callOutVal.backendId);
              newObject["dbCallOuts"] = callOutVal.mapDBCallouts;
              var e = this.getDBErrorCount(callOutVal.mapDBCallouts);
              val.childErCount = e;
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
  }
  transactionDataList
  //This Function will be called after parent-child linkage from Remote NDE
  getDataWithParentChild(json, coordinatesData) {
    //get aggregate node information
    this.transactionDataList = this.getAggregateBackendMap(json);
    //sessionStorage.setItem("transactionDataList",JSON.stringify(this.transactionDataList));
    console.log("Aggregation Done ...", this.transactionDataList);
    //console.log("after", JSON.stringify(this.transactionDataList));

    //create JSON format from aggregate data node
    var nodeData = this.prepareJSON(this.transactionDataList, coordinatesData);
    console.log("prepareJSON node data length - " + nodeData);
    // console.log(JSON.stringify(nodeData));
    return nodeData;
  }

  errParentLevel = 0;
  setLevelForErrCase(incParLvl) {
    if (incParLvl != undefined)
      this.errParentLevel = incParLvl;
  }
  getLevelForErrCase() {
    return this.errParentLevel;
  }

  checkInterval = 0;
  timeOutArr = [];
  //to start processing
  checkForCriteria() {
    if (this.checkInterval >= this.CommonServices.ajaxTimeOut) {
      console.log("  WARNING : waiting response from  some nde's  ,time out occured  =   " + this.checkInterval);
      console.log("ndeInfoData.. " + this.ndeInfoData);
      for (var i = 0; i < this.ndeInfoData.length; i++) {
        var val = this.ndeInfoData[i];
        console.log("val " + val);

        //incase of all dc datas not coming we can find this case of dtolist undefined
        if (this.allDCData[val.ndeId] == undefined || (this.allDCData[val.ndeId].dtoList == undefined) || this.allDCData[val.ndeId].dtoList.length == 0) {
          // console.log("here is ...display name .." + val.displayName);
          this.timeOutArr.push(val.displayName);
        }
      }
      this.startProcessing(); //forcefully
    }
    else {
      var gotResponseFromNDE = true;
      //check for response
      this.ndeInfoData.forEach((val) => {
        if (this.allDCData[val.ndeId] != undefined) {
          console.log(" Got response from  ID  : " + val.ndeId);
        }
        else {
          console.log(" Waiting response from  ID  : " + val.ndeId);
          gotResponseFromNDE = false;
        }
      });


      if (gotResponseFromNDE == true) {
        console.log(" Got response from  all  , hence start processing ");
        setTimeout(() => { this.startProcessing(); }, 300); //got response from all NDE's
      }
      else {
        this.checkInterval += 5000;
        console.log(" waiting response from  some nde's  , hence waiting interval =   " + this.checkInterval);
      }
    }
  }
  replaceAll(str, find, replace) {
    //console.log("str is  "+str);
    return str.replace(new RegExp(find.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), replace);
  }
  getDBErrorCount(dbCalllouts) {
    var errorCount = 0;
    var dbCallouts = []
    for (let i = 0; i < dbCalllouts.length; i++) {
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
    // console.log("transaction list after", JSON.stringify(transactionList));
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

    if (coordinatesData == undefined || coordinatesData == "")
      this.setZigZagPosition(nodeData);
    else
      this.setActualCoordinates(nodeData, coordinatesData);

    return nodeData;
  }
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
      "totalNetworkDelay": "-1",
      "avgNetworkDelay": "",
      "prevFlowpathInstance": ""
    };

    //console.log("val.level  "+val.level);
    //replace the level "." by "_"
    console.log("val.level", val.level, val);
    console.log("aggregateInfoProperties", aggregateInfoProperties);
    console.log("this.replaceAll", this.replaceAll(val.level, ".", "_"));
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
      if (val.callOutType == "T") {
        aggregateInfoProperties.resourceId = val.resourceId;
        aggregateInfoProperties.totalNetworkDelay = val.totalNetworkDelay;
        aggregateInfoProperties.avgNetworkDelay = val.totalNetworkDelay
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


        if (this.allDCData[val.ndeId].backends != undefined)
          aggregateInfoProperties.mappedAppName = this.allDCData[val.ndeId].backends[val.backEndId];

        if (this.allDCData[val.ndeId].backendsActualName != undefined)
          aggregateInfoProperties.backendActualName = this.allDCData[val.ndeId].backendsActualName[val.backEndId];
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
    else if ((aggregateInfoProperties.backendActualName && !aggregateInfoProperties.backendActualName.startsWith("JMSP")) || (val.urlName && val.urlName != "-" && !val.urlName.startsWith("JMSC")))
      aggregateInfoProperties.sourceId = this.getMergedSource(aggregateInfoProperties.id.substring(0, aggregateInfoProperties.id.lastIndexOf("_")));
    else if (aggregateInfoProperties.backendActualName && aggregateInfoProperties.backendActualName.startsWith("JMSP")) {
      aggregateInfoProperties.sourceId = this.getMergedSource(aggregateInfoProperties.id.substring(0, aggregateInfoProperties.id.lastIndexOf("_")));
      this.jmsSourceId = aggregateInfoProperties.id;
      // aggregateInfoProperties.backendActualName = aggregateInfoProperties.backendActualName.substring(5,aggregateInfoProperties.backendActualName.length);
      // aggregateInfoProperties.mappedAppName = aggregateInfoProperties.mappedAppName.substring(5,aggregateInfoProperties.mappedAppName.length)
      // console.log("JMSP case ", aggregateInfoProperties);
    }
    else if (val.urlName && val.urlName.startsWith("JMSC")) {
      if (val.callOutType !== "t")
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

    let instanceTypeTopology: string = val.instanceTypeTopology
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
        aggregateInfoProperties.icon = "db.png";
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
    else if (instanceTypeTopology.toLowerCase() == "php") {
      aggregateInfoProperties.icon = "php.png";
      aggregateInfoProperties.instanceType = "php";

    }
    else if (instanceTypeTopology.toLowerCase() == "go") {
      aggregateInfoProperties.icon = "go.png";
      aggregateInfoProperties.instanceType = "go";

    }
    else if (instanceTypeTopology.toLowerCase() == "python") {
      aggregateInfoProperties.icon = "python.png";
      aggregateInfoProperties.instanceType = "python";

    }
    else {
      aggregateInfoProperties.icon = "java.png";
      aggregateInfoProperties.instanceType = "java";
    }

    return aggregateInfoProperties;

  }
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
  //This function set node on browser in ZIGZAG form
  setZigZagPosition(arrTierList) {
    var top = 70;
    var left = 300;
    var count = 0;
    arrTierList.forEach((val, index) => {
      var aggregateInfoProperties = val;
      if (count % 2 == 0) {
        aggregateInfoProperties.left = left;
        if (count > 0)
          aggregateInfoProperties.top = count * 70 + 90;
        else
          aggregateInfoProperties.top = top;
      }
      else if (count % 2 != 0) {
        aggregateInfoProperties.top = arrTierList[count - 1].top;
        aggregateInfoProperties.left = arrTierList[count - 1].left + 450;
      }
      count++;
    });
  }

  //This function used to read the co-ordinates and put it in map
  readCoordinate(coordinates) {
    var coordinateMap = {};
    var data = coordinates.split("|");
    for (var i = 0; i < data.length; i++) {
      var key = data[i].substring(0, data[i].indexOf(","));
      var value = data[i].substring(data[i].indexOf(",") + 1, data[i].length);

      coordinateMap[key] = value;
    }

    return coordinateMap;
  }

  //This method shows the position of their nodes on screen.
  setActualCoordinates(aggTierList, coordinatesData) {
    var cordinateMap = this.readCoordinate(coordinatesData);
    aggTierList.forEach((val, index) => {
      /* iterate through array or object */
      var aggregateInfoProperties = val;
      var nodeId = aggregateInfoProperties.id;
      var cordinateString = cordinateMap[nodeId]; //check here
      var x = 0;
      var y = 0;
      if (cordinateString != undefined) {
        var arr = cordinateString.split(",");
        x = parseInt(arr[0]);
        y = parseInt(arr[1]);
      }

      aggregateInfoProperties.left = x;
      aggregateInfoProperties.top = y;

    });
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
      if (val.backEndDuration)
        aggInfoPropertiesValue.cumBackendDuration += val.backEndDuration;
      //In case if backend percentage is zero and fpDuration has some value, in order to show
      // that Backend is taking time we will show the fpDuration as backendDuration 
      if (val.backEndDuration && val.backEndDuration == 0 && val.fpDuration != 0) {
        aggInfoPropertiesValue.cumBackendDuration += val.fpDuration;
      }
      aggInfoPropertiesValue.count++;
      aggInfoPropertiesValue.erCount += val.erCount;
      aggInfoPropertiesValue.statusCODE += val.statusCODE;
      aggInfoPropertiesValue.avgBackendDuration = (aggInfoPropertiesValue.cumBackendDuration / aggInfoPropertiesValue.count);
      if (val.callOutType == "T") {
        aggInfoPropertiesValue.resourceId = val.resourceId;
        if (aggInfoPropertiesValue.totalNetworkDelay && aggInfoPropertiesValue.totalNetworkDelay != "-1") {
          aggInfoPropertiesValue.totalNetworkDelay += val.totalNetworkDelay;
          aggInfoPropertiesValue.avgNetworkDelay = aggInfoPropertiesValue.totalNetworkDelay / aggInfoPropertiesValue.count;
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
  getRequestData(url) {
    console.log(" coming hefr", url)

    return this.ddrRequest.getDataUsingGet(url);

  }
  netForestURL
  timeVarianceForNetForest
  getNetForestLink() {
    let url = this.hosturl + 'netdiagnostics/v1/cavisson/netdiagnostics/ddr/config/NetForestUrl';

    this.ddrRequest.getDataInStringUsingGet(url).subscribe(data => {
      this.netForestURL = data;
      if (data != undefined) {
        url = this.hosturl + 'netdiagnostics/v1/cavisson/netdiagnostics/ddr/config/NetDiagnosticsQueryTimeVariance';
        this.ddrRequest.getDataInStringUsingGet(url).subscribe(data => {
          this.timeVarianceForNetForest = data;
        })
      }
    })
  }

  asyncCalls = [];
  spliceforA = [];
  splicefora = [];
  isAsync: boolean = false;
  asyncJsonForNonMergeCase = [];

  supportAsync(dataToDraw, dataToView) {
    this.asyncCalls = [];
    this.spliceforA = [];
    this.splicefora = []
    let json;
    this.jsonDataToDraw = [];
    this.asyncJsonForNonMergeCase = [];
    json = dataToDraw
    let len = json.length;
    this.asyncJsonForNonMergeCase = JSON.parse(JSON.stringify(this.jsonData));
    for (let i = 0; i < this.asyncJsonForNonMergeCase.length; i++) {
      if (this.asyncJsonForNonMergeCase[i]["callOutType"] == "a") {
        this.asyncJsonForNonMergeCase.splice(i, 1)
      }
    }
    for (let i = 0; i < len; i++) {

      if (json[i]["callOutType"] == "A") {
        json[i]["isAsync"] = true;
        if (json[i]["backendType"] != "KAFKA") {
          for (let k = 0; k < json.length - 1; k++) {
            if (json[k]["flowpathInstance"] == json[i]["flowpathInstance"] && json[k]["callOutType"] == "-") {
              console.log("commmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm")
              json[i]["id"] = json[k]["id"];
              json[i]["sourceId"] = json[k]["id"];
              this.asyncCalls.push(json[i])
              this.isAsync = true;
              this.spliceforA.push(json[i])
              break;
            }
          }
        }
      }
      else if (json[i]["callOutType"] == "a") {
        this.spliceforA.push(json[i])
      }
      else {
        json[i]["isAsync"] = false;
      }
    }

    for (let i = 0; i < this.spliceforA.length; i++) {
      for (let k = 0; k <= json.length - 1; k++) {
        if (this.spliceforA[i]["flowpathInstance"] == json[k]["flowpathInstance"] && this.spliceforA[i]["mappedAppName"] == json[k]["mappedAppName"]) {
          json.splice(k, 1)
        }
      }
    }

    for (let i = 0; i < dataToView.length; i++) {
      if (dataToView[i]["callOutType"] == "A" && dataToView[i]["backendType"] != "KAFKA") {
        dataToView.splice(i, 1)
      }
    }
    let arr = [];
    arr.push(dataToView);
    this.jsonDataToDraw = [...json, ...this.asyncCalls]
    for (let i = 0; i < this.jsonDataToDraw.length; i++) {
      for (let k = 1; k < this.jsonDataToDraw.length; k++) {
        console.log("true case")
        if (this.jsonDataToDraw[i]["id"] == this.jsonDataToDraw[k]["id"] && this.jsonDataToDraw[i]["sourceId"] == this.jsonDataToDraw[k]["sourceId"] && this.jsonDataToDraw[i]["callOutType"] == "t" && this.jsonDataToDraw[k]["callOutType"] == "A") {
          this.jsonDataToDraw[i]["AsyncCount"] = (this.jsonDataToDraw[i]["AsyncCount"] + this.jsonDataToDraw[k]["count"] || this.jsonDataToDraw[k]["count"])
          this.jsonDataToDraw[i]["AsyncDur"] = (this.jsonDataToDraw[i]["AsyncDur"] + this.jsonDataToDraw[k]["avgBackendDuration"] || this.jsonDataToDraw[k]["avgBackendDuration"])
          this.jsonDataToDraw[i]["isAsync"] = true;
        }
      }
    }
    arr.push(this.jsonDataToDraw)
    // this.jsonData = json;
    return arr;



  }

  removeUnusedAsync() {
    let json;
    json = this.getParsedJson();
    let len = json.length;
    json = JSON.parse(JSON.stringify(json));
    for (let i = 0; i < json.length; i++) {
      if (json[i]["callOutType"] == "a") {
        json.splice(i, 1)
      }
    }

    this.jsonData = json;
  }
  resetFlag() {
    this.CommonServices.loaderForDdr = true;
    this.isFirstRoot = false;
    this.isRootFpMissing = false;
    this.showOrigFlowmap = false;
    this.isFpCheckMiss = true;

  }
}
export interface FlowpathDataInterface {
  tierName: string;
  tierId: string;
  serverName: string;
  serverId: string;
  appName: string;
  appId: string;
  urlName: string;
  urlIndex: string;
  flowpathInstance: string;
  prevFlowpathInstance: string;
  startTime: string;
  fpDuration: string;
  methodsCount: string;
  urlQueryParamStr: string;
  statusCode: string;
  callOutCount: string;
  threadId: string;
  btCatagory: string;
  correlationId: string;
  btCpuTime: string;
  startTimeInMs: string;
  id: number;
  orderId: string;
  totalError: string;
  nvSessionId: string;
  ndSessionId: string;
  nvPageId: string;
  dbCallCounts: string;
  coherenceCallOut: string;
  jmsCallOut: string;
  threadName: string;
  Instance_Type: string;
}
