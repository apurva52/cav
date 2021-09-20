import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { filter, map } from '../../../../../node_modules/rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { CommonServices } from './common.services'
import { DdrBreadcrumbService } from './ddr-breadcrumb.service';
import * as  CONSTANTS from '../constants/breadcrumb.constants';
import { resolve } from 'q';

@Injectable()
export class DdrAggFlowmapService {
  mergeJson = {} //to hold the flowpath's data in json format
  initJson; // to hold the server reponse i.e complete json
  jsonData = []; //final json to draw UI 
  jsonDataForTierMergetoView = [];
  jonDataForTierMergeToDraw = [];
  mergeRFData = [];
  mergeChildData = {};
  mapOfIt = {};
  startTime;
  endTime;
  btName = "";
  isRefreshCase: boolean = false;
  enableAggView: any;
  tierName = "";
  rootFpMiss: boolean;

  constructor(private _router: Router, private http: HttpClient, private CommonServices: CommonServices, private DdrBreadcrumbService: DdrBreadcrumbService) {

    //console.log("json for agg", this.initJson);

  }
   /*
   *This method get keyword for view agg flopmap
   */
  getKeyForView(url) {
      this.http.get(url).subscribe(res => {
      let data = <any> res
      this.enableAggView = data;     
  });
  }
  /*
   *This method creates final json from json which is recieved from server
   */
  createFirstLevelJson(url) {
    return new Promise((resolve, reject) => {
      this.mergeJson = {}
      this.initJson;
      this.jsonData = [];
      this.jsonDataForTierMergetoView = [];
      this.jonDataForTierMergeToDraw = [];
      this.mergeRFData = [];
      this.mergeChildData = {};
      this.mapOfIt = {};
      this.mergeBts = {};
      this.mergeTiers = {};
      this.mergeServers = {};
      this.mergeapps = {};
      this.mergeIps = {};
      this.mapofIDs = {};
      this.mapOfRIds = {};
      this.idForBackends = 1000;
      this.parentTierID = "";
      this.mapOfUsedTiers = {};
      this.tempJson = [];
      this.processItLater = [];
      if (!url) {
        url = sessionStorage.getItem("aggUrl");
      }
      else {
        sessionStorage.setItem("aggUrl", url);
      }

      this.http.get(url).subscribe(res => {
        let data = <any>res
        this.jsonData = [];
        this.initJson = data;

        this.mergeDCData();

        //iterating the childs to create parent and child relationsship json
        if (Object.keys(this.mergeChildData).length > 0 && Object.keys(this.mergeChildData).length == this.mergeRFData.length) {
          Object.keys(this.mergeChildData).forEach((k, i) => {
            this.createCPrelation(k, this.mergeRFData, this.mergeChildData)
          });
        }
        else if ((Object.keys(this.mergeChildData).length > 0 && Object.keys(this.mergeChildData).length < this.mergeRFData.length)) {
          for (let i = 0; i < this.mergeRFData.length; i++) {
            let isChildPresent: boolean = false;
            isChildPresent = this.checkChildPresentForRP(this.mergeRFData[i]["F"])
            if (isChildPresent) {
              this.createCPrelation(this.mergeRFData[i]["F"], this.mergeRFData, this.mergeChildData)
            }
            else {
              this.createCPrelation(this.mergeRFData[i]["F"], this.mergeRFData, this.mergeChildData)
            }

          }

        }
        else {
          this.mergeRFData.map((obj, i) => {
            this.createCPrelation(obj.F, this.mergeRFData, this.mergeChildData)
          })

        }



        this.createIdforJson()
        this.creteSourceIdforJson();
        this.createJsonForTierMerge();
        this.filterOutUnusedTiers();
        this.createChildForTiers()
        this.mergeChildWithTiers()
        this.createCordinatesTierMerge();
        this.mergeAllTierData()
        this.DdrBreadcrumbService.parentComponent = CONSTANTS.BREADCRUMB_ITEMS.BTTREND;

        if (this.CommonServices.isFromEd) {
          if (this.isRefreshCase) {
            this._router.navigate(['/ddr/DdrAggFlowmapComponent']);
          }
          else {
            this._router.navigate(['/ddr/DdrTierMergeViewComponent']);
          }

        }
        else {
          if (this.isRefreshCase) {
            this._router.navigate(['/ddr/DdrAggFlowmapComponent']);
          }
          else {
            this._router.navigate(['/ddr/DdrTierMergeViewComponent']);
          }
        }
        resolve(this.jsonDataForTierMergetoView);
       // console.log("final json", this.jsonData);
        //console.log("final json", this.jsonDataForTierMergetoView);
      })

    })

  }


  mergeBts = {};
  mergeTiers = {};
  mergeServers = {};
  mergeapps = {};
  mergeIps = {};
  mergeDCData() {
    this.mergeRFData = [];
    this.mergeChildData = {};
    this.mergeBts = {};
    let len = this.initJson.length;
    for (let i = 0; i < len; i++) {
      let data = this.initJson[i]["data"]["0"];
      if(data.length > 0 && data.length >= Object.keys(this.initJson[i]["data"]).length - 1) {
       this.rootFpMiss = false;
       break;
      }
      else if(data.length == 0 && i == len -1){
       this.rootFpMiss = true;
       return;
      }
      else 
       this.rootFpMiss = true;
    }
    for (let i = 0; i < len; i++) {
      if(!this.initJson[i]["data"])
        continue;
      let data = this.initJson[i]["data"]["0"]
      let childData = this.initJson[i]["data"];
      delete childData['0'];


      //console.log("child Data", JSON.stringify(childData));
      let btData = this.initJson[i]["bts"];
      let serverData = this.initJson[i]["srvrs"];
      let tierData = this.initJson[i]["tiers"];
      let appData = this.initJson[i]["insts"];
      let ipsData = this.initJson[i]["ips"];

      if (Object.entries(childData).length > 0 && childData.constructor === Object) {
        if (Object.keys(this.mergeChildData).length > 0) {
          Object.keys(this.mergeChildData).forEach(element => {
            for (let k in childData) {
              if (element == k) {
                this.mergeChildData[element] = [...this.mergeChildData[element], ...childData[k]]
              }
            }
          });
        }
        else {
          this.mergeChildData = Object.assign(childData, this.mergeChildData)
        }
      }
      // this.mergeChildData = Object.assign(childData, this.mergeChildData)


      //console.log("child Data  AfterMerging", childData, this.mergeChildData);

      if (data.length > 0)
        this.mergeRFData = [...this.mergeRFData, ...data];

      if (Object.entries(btData).length > 0)
        this.mergeBts = { ...this.mergeBts, ...btData };

      if (Object.entries(appData).length > 0)
        this.mergeapps = { ...this.mergeapps, ...appData }

      if (Object.entries(tierData).length > 0)
        this.mergeTiers = { ...this.mergeTiers, ...tierData }


      if (Object.entries(serverData).length > 0)
        this.mergeServers = { ...this.mergeServers, ...serverData };

      if (ipsData) {
        if (Object.entries(ipsData).length > 0)
          this.mergeIps = { ...this.mergeIps, ...ipsData }
      }
    }
  }

  /**
   * 
   * @param parent 
   * @param child 
   * @param childDetail
   * this method create child- parent relation single json
   * parent :- objects from the list other than data[0]
   * child :- object from data[0] which will be connected from entry node
   */
  createCPrelation(parent: string, child, childDetail) {
    //console.log(parent, child, childDetail)
    let keys = Object.keys(child)
    for (let i = 0; i < keys.length; i++) {
      if (parent == child[i]["F"]) {
        child[i]["isFromEntry"] = true;
        child[i]["cType"] = "P";
        child[i]["pBCount"] = child[i]["ipc"];
        if (childDetail[parent])
          child[i]["pCCount"] = childDetail[parent].length;

        this.mapOfIt[child[i]["tI"]] = child[i]["iT"];
        this.jsonData.push(child[i]);
        if (child[i]["ipc"] && child[i]["ipc"] > 0 && child[i]["ips"]) {
          this.createBackend(child[i], child[i]["ipc"], i, child[i]["tI"]);
        }
        if (childDetail[parent] && childDetail[parent].length > 0)
          this.creteChildForParent(childDetail[parent], parent);

        break;
      }
      else {
        if (i == keys.length - 1) {
          let obj = { "F": parent, "cType": "OP", "isFromEntry": true, "pCount": childDetail[parent].length };
          this.jsonData.push(obj);
          if (childDetail[parent].length > 0)
            this.creteChildForParent(childDetail[parent], parent);

        }
        else {
          continue;
        }

      }
    }

  }
  /**
   * 
   * @param obj 
   * @param ipCount 
   * This methid append backends in json for parent
   * obj:- parent obj(data[0])
   * ipCount :- number of backends
   */
  createBackend(obj, ipCount, index, tI) {
    let objNew = obj["ips"];
    objNew.sort(this.compare)
    let lastType = "";
    let lastId = "";
    for (let i = 0; i < objNew.length; i++) {
      let str = (objNew[i].D).toString();
       if(str.indexOf("-") != -1){
         continue;
       }
      if (i == 0) {
        objNew[i]["cType"] = "PB";
        lastType = objNew[i]["t"];
        lastId = objNew[i]["i"];
        objNew[i]["count"] = 1;
        objNew[i]["tI"] = tI;
        this.jsonData.push(objNew[i]);

      }
      else {
        if (lastType == objNew[i]["t"] && objNew[i]["i"] == lastId) {
          this.jsonData[this.jsonData.length - 1]["count"] = Number(this.jsonData[this.jsonData.length - 1]["count"]) + 1;
          this.jsonData[this.jsonData.length - 1]["D"] = Number(this.jsonData[this.jsonData.length - 1]["D"]) + Number(objNew[i]["D"])
        }
        else {
          objNew[i]["cType"] = "PB";
          lastType = objNew[i]["t"]
          lastId = objNew[i]["i"];
          objNew[i]["count"] = 1;
          objNew[i]["tI"] = tI;
          this.jsonData.push(objNew[i]);
        }

      }

    }
  }

  /**
   * 
   * @param obj 
   * It cretes child for parent
   * obj : -data[flowpathkeys]
   */
  creteChildForParent(obj, parent) {
    for (let i = 0; i < obj.length; i++) {
      if (parent == obj[i]["F"]) {
        console.log("do nothing");
      }
      else {
        obj[i]["cType"] = "C";
        obj[i]["cBCount"] = obj[i]["ipc"];
        obj[i]["count"] = 1;
        this.jsonData.push(obj[i]);

        if (obj[i]["ipc"] > 0 && obj[i]["ips"] != undefined) {
          this.createBackendForChild(obj[i]["ips"], obj[i]["tI"])
        }
      }

    }
  }

  /**
   * 
   * @param obj 
   * It cretes backend for childs
   * obj : - ips of child
   */
  createBackendForChild(obj, tI) {
    obj.sort(this.compare)
    let lastType = "";
    for (let i = 0; i < obj.length; i++) {
       let str = (obj[i].D).toString();
       if(str.indexOf("-") != -1){
         continue;
       }
      if (i == 0) {
        obj[i]["cType"] = "CB";
        lastType = obj[i]["t"]
        obj[i]["count"] = 1;
        obj[i]["tI"] = tI;
        this.jsonData.push(obj[i]);

      }
      else {
        if (lastType == obj[i]["t"]) {
          this.jsonData[this.jsonData.length - 1]["count"] = Number(this.jsonData[this.jsonData.length - 1]["count"]) + 1;
          this.jsonData[this.jsonData.length - 1]["D"] = Number(this.jsonData[this.jsonData.length - 1]["D"]) + Number(obj[i]["D"])
        }
        else {
          obj[i]["cType"] = "CB";
          lastType = obj[i]["t"]
          obj[i]["count"] = 1;
          obj[i]["tI"] = tI;
          this.jsonData.push(obj[i]);
        }

      }

    }
  }
  compare(a, b) {
    if (a.t < b.t)
      return -1;
    if (a.t > b.t)
      return 1;
    return 0;

  }
  /**
   * this method creates the soucrce id and target id for every node
   * these ids used by js plumb to make a connecton
   * Target id is same as as its id od node
   * To Do -  this method will also add some info to every node like instance type, servername , app name , instance name
   */
  creteSourceIdforJson() {

    let lastPId = 0;
    let lastChildId = 0;
    let childCount = 0;


    let levelCount = 2;
    let flag = false;
    let lim = 0;
    let left = 300;
    let top = 0;
    let tempL = 0;
    let tempT = 0;
    let name: string = "";


    this.jsonData.forEach((obj, index) => {
      childCount = 0;
      if (obj["cType"] == "PB" || obj["cType"] == "CB" || obj["cType"] == "C") {
        lim++;

        if (lim == 1) {
          left = 300 * levelCount;
          top = top - 100;
        }
        else if (lim <= 3) {
          top = top + 100;
          if (lim == 3) {
            flag = true;
            tempT = top;
          }
        }
        else {
          lim = 1;
          tempT = top;
          levelCount++;
          left = 300 * levelCount;
          top = top - 150;
          flag = true;
        }
      }

      if (obj['isFromEntry'] == true && (obj["cType"] == "P" || obj["cType"] == "OP")) {
        lim = 0;
        left = 300;
        levelCount = 2;
        if (flag)
          top = tempT;
        flag = false;
        top = top + 200;
        obj['sourceId'] = "root";
        lastPId = obj["id"];
        obj["sN"] = this.getServerName(obj["sI"])
        obj["aN"] = this.getAppName(obj["aI"])
        obj["tN"] = this.getTierName(obj["tI"])
        childCount = obj["pBCount"] + obj["pCCount"];
        obj['left'] = left + 'px';
        obj['top'] = top + 'px';
        obj["icon"] = (obj.iT).toString().toUpperCase() + "new.png";
        obj["displayName"] = obj["sN"] + ":" + obj["aN"];

      }
      else if (obj["cType"] == "PB") {
        obj['left'] = left + 'px';
        obj['top'] = top + 'px';
        obj['sourceId'] = lastPId;
        obj["icon"] = this.setIconForIpcalls(obj);
        obj["displayName"] = this.setIpNames(obj.i);
      }
      else if (obj["cType"] == "C") {
        obj['left'] = left + 'px';
        obj['top'] = top + 'px';
        obj['sourceId'] = this.setId(obj);
        lastChildId = obj['id'];
        obj["sN"] = this.getServerName(obj["sI"])
        obj["aN"] = this.getAppName(obj["aI"])
        obj["tN"] = this.getTierName(obj["tI"])
        obj["icon"] = (obj.iT).toString().toUpperCase() + "new.png";
        obj["displayName"] = obj["sN"] + ":" + obj["aN"];
      }
      else if (obj["cType"] == "CB") {
        obj['left'] = left + 'px';
        obj['top'] = top + 'px';
        obj['sourceId'] = lastChildId;
        obj["icon"] = this.setIconForIpcalls(obj)
        obj["displayName"] = this.setIpNames(obj.i);
      }
    })

    console.log("id json", this.jsonData);
  }
  getServerName(id) {

    return this.mergeServers[id]

  }
  getAppName(id) {

    return this.mergeapps[id]

  }

  getTierName(id) {

    return this.mergeTiers[id]

  }

  getBackendName(id) {

  }
  /**
   * this method creates the map of ids for all the elemnts in json for agg
   */
  mapofIDs = {};
  mapOfRIds = {};
  createIdforJson() {
    let count = 0;
    this.jsonData.forEach(obj => {
      obj["id"] = count;
      obj["targetId"] = count;
      if (obj.cType == "P" || obj.cType == "OP" || obj.cType == "C") {
        this.mapofIDs[obj.F] = count
      }
      if (obj.cType == "P" || obj.cType == "OP") {
        this.mapOfRIds[obj.F] = count
      }
      count++;
    })
  }
  /**
   * 
   * @param obj this method sets the source id for every object
   */
  setId(obj) {
    if (this.mapofIDs[obj.jpF] && this.mapofIDs[obj.jpF] != undefined) {
      return this.mapofIDs[obj.jpF]
    }
    else {
      return this.mapOfRIds[obj.pF];
    }

  }

  setIconForIpcalls(obj) {
    let type = obj.t;

    if (type == 2 || type == 10) //checking For DB callOut && supporting ADO.Net BackendType (10 for ADO.Net)
    {
      return "DATABASEnew.png";
    }
    else if (type == 9) //checking Cassandra DB callOut
    {
      return "CASSANDRAnew.png";
    }
    else if (type == 15) {
      return "MONGODBnew.png";
    }
    else if (type == 16) {
      return "REDISnew.png";
    }
    else if (type == 19) {
      return "DATABASEnew.png";
    }
    else if (type == 22) //checking ftp callOut
    {
      return "FTPnew.png";
    }
    else if (type == 23) //checking ftp callOut
    {
      return "KAFKAnew.png"
    }
    else if (type == -3) //checking ftp callOut
    {
      return "BACKENDnew.png"
    }
    else {
      return "backend.png";
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
      return "ADO.NET";
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
    else if (backendType == -3)
      return "Thread";
    else if (backendType == -1)
      return "Thread";
    else if (backendType == -5)
      return "Async";
    else
      return backendTypeName;
  }

  setIpNames(obj) {

    return this.encodeHTMLStr(this.mergeIps[obj])


  }

  //This method is used to encode HTML characters
  encodeHTMLStr(str) {
    var returnString = "";
    if (str != undefined && str != "")
      returnString = str.toString().replace(/&#044;/g, ",").replace(/&#58;/g, ":").replace(/&#46;/g, ".").replace(/&#010;/g, "\n").replace(/&#039;/g, "\'")
        .replace(/&#034;/g, "\"").replace(/&#092;/g, "\\").replace(/&#124;/g, "|").replace(/&#123;/g, "{").replace(/&#125;/g, "}").replace(/&#126;/g, "~").replace(/&#11/g, "").replace(/&#12/g, "");

    return returnString;
  }

  /**
   * this method creates the json  to merge the tiers
   */
  createJsonForTierMerge() {
    this.tempJson = [];
    this.createIDForTiers()
    let parent;
    let lastTi;
    this.jsonData.forEach((obj) => {
      if ((obj.F) && (obj.pF) && (obj.pF == 0 || obj.F == obj.pF)) {
        lastTi = obj["tI"]
        parent = obj;
        return;
      }
      else if (obj.cType == "C") {
        lastTi = obj["tI"]
      }
      else if (obj.cType == "PB" || obj.cType == "CB") {
        let newObj = JSON.parse(JSON.stringify(obj))
        newObj["tI"] = lastTi;
        this.mergeChildsForTiers(newObj)
        // this.tempJson.push(newObj);
      }

    })

    this.checkAndCreateJson();
   // console.log("jsonfortiermerge", this.jonDataForTierMergeToDraw)

  }
  parentTierID;
  /**
   * this method creates json fot tier merge view data
   * @param obj t
   * @param parent 
   */
  checkAndCreateJson() {
    let newObj;
    let lastParent;
    this.jsonData.map((val) => {
      newObj = null;
      if ((val.cType == "P" || val.cType == "OP") && (val.pF == 0 || val.pF == val.F)) {
        lastParent = val;
        this.parentTierID = val["tI"];
        this.valiateBt(val, val)
      }
      else if (val.cType == "C") {
        newObj = this.getParent(val);
        if (!newObj) {
          newObj = lastParent
        }
        this.parentTierID = newObj["tI"];
        this.valiateBt(val, newObj)
      }
    })



  }
  /**
   * this method creates id for all the tiers.
   */
  createIDForTiers() {
    let count = 0;
    for(let i =0 ; i<this.jsonData.length; i++){
      for (let prop in this.mergeTiers) {
        if(this.jsonData[i].tI == prop && this.jsonData[i].tN){
         let obj = { "tI": prop, "id": count, "cType": this.jsonData[i].cType }
         this.jsonDataForTierMergetoView.push(obj);
         count++;
        }
      }
      // if(this.jsonDataForTierMergetoView.length == Object.keys(this.mergeTiers).length){
      //   break;
      // }
    } 
  }
  mapOfUsedTiers = {};
  valiateBt(obj, newObj) {
    if (this.jonDataForTierMergeToDraw.length > 0) {
      let index = this.checkForParent(this.parentTierID, obj["tI"],obj["btI"]);
      if (index == undefined) {
        let objFr = {};
        objFr["tI"] = obj["tI"];
        objFr["tN"] = this.getTierName(objFr["tI"])
        if(obj["sourceId"] == 'root'){
          objFr["sourceId"] = "root";
        }
        else
         objFr["sourceId"] = this.returnSourceID(newObj["tI"]);
        objFr["targetID"] = this.returnTargetID(obj["tI"]);
        objFr["BtID"] = obj["btI"];
        objFr["count"] = 1;
        objFr["Tduration"] = obj["D"];
        objFr["AvgDuration"] = obj["D"];
        objFr["pTi"] = this.parentTierID;
        objFr["icon"] = obj["icon"];
        objFr["erc"] = obj["erc"];
        this.jonDataForTierMergeToDraw.push(objFr)
        this.mapOfUsedTiers[objFr["sourceId"]] = true;
        this.mapOfUsedTiers[objFr["targetID"]] = true;
      }
      else {
        let objFr = {};
        let val = this.jonDataForTierMergeToDraw[index];

        if (val["tI"] == obj["tI"] && val["BtID"] == obj["btI"] && val["pTi"] == this.parentTierID) {
          val["count"] = val["count"] + 1;
          val["Tduration"] = val["Tduration"] + obj["D"];
       if (obj.erc != undefined && !isNaN(obj.erc))
        val["erc"] = Number(val["erc"]) + Number(obj["erc"]);  
	val["AvgDuration"] = val["Tduration"] / val["count"];
        }
        else if (val["tI"] == obj["tI"] && val["BtID"] == obj["btI"] && val["pTi"] != this.parentTierID) {
          objFr["tI"] = obj["tI"];
          if(obj["sourceId"] == 'root'){
            objFr["sourceId"] = "root";
          }
          else
           objFr["sourceId"] = this.returnSourceID(newObj["tI"]);
          objFr["targetID"] = this.returnTargetID(obj["tI"]);
          objFr["BtID"] = obj["btI"];
          objFr["count"] = 1;
          objFr["Tduration"] = obj["D"];
          objFr["AvgDuration"] = obj["D"];
          objFr["pTi"] = this.parentTierID;
          objFr["tN"] = this.getTierName(objFr["tI"])
          objFr["tN"] = this.getTierName(objFr["tI"])
          objFr["icon"] = obj["icon"]
          objFr["erc"] = obj["erc"];
          this.jonDataForTierMergeToDraw.push(objFr)
          this.mapOfUsedTiers[objFr["sourceId"]] = true;
          this.mapOfUsedTiers[objFr["targetID"]] = true;
        }
        else if (val["tI"] == obj["tI"] && val["BtID"] != obj["btI"]) {
          objFr["tI"] = obj["tI"];
          if(obj["sourceId"] == 'root'){
            objFr["sourceId"] = "root";
          }
          else
           objFr["sourceId"] = this.returnSourceID(newObj["tI"]);
          objFr["targetID"] = this.returnTargetID(obj["tI"]);
          objFr["BtID"] = obj["btI"];
          objFr["count"] = 1;
          objFr["Tduration"] = obj["D"];
          objFr["AvgDuration"] = obj["D"];
          objFr["tN"] = this.getTierName(objFr["tI"])
          objFr["icon"] = obj["icon"];
          objFr["erc"] = obj["erc"];
          this.jonDataForTierMergeToDraw.push(objFr)
          this.mapOfUsedTiers[objFr["sourceId"]] = true;
          this.mapOfUsedTiers[objFr["targetID"]] = true;
        }
        else {
          objFr["tI"] = obj["tI"];
          if(obj["sourceId"] == 'root'){
            objFr["sourceId"] = "root";
          }
          else
           objFr["sourceId"] = this.returnSourceID(newObj["tI"]);
          objFr["targetID"] = this.returnTargetID(obj["tI"]);
          objFr["BtID"] = obj["btI"];
          objFr["count"] = 1;
          objFr["Tduration"] = obj["D"];
          objFr["AvgDuration"] = obj["D"];
          objFr["tN"] = this.getTierName(objFr["tI"])
          objFr["icon"] = obj["icon"]
          objFr["erc"] = obj["erc"];
          this.jonDataForTierMergeToDraw.push(objFr)
          this.mapOfUsedTiers[objFr["sourceId"]] = true;
          this.mapOfUsedTiers[objFr["targetID"]] = true;
        }
      }
    }
    else {
      let objFr = {};
      objFr["tI"] = obj["tI"];
      objFr["tN"] = this.getTierName(objFr["tI"])
      if(obj["sourceId"] == 'root'){
        objFr["sourceId"] = "root";
      }
      else
       objFr["sourceId"] = this.returnSourceID(newObj["tI"]);
      objFr["targetID"] = this.returnTargetID(obj["tI"]);
      objFr["BtID"] = obj["btI"];
      objFr["count"] = 1;
      objFr["Tduration"] = obj["D"];
      objFr["AvgDuration"] = obj["D"];
      objFr["pTi"] = this.parentTierID;
      objFr["icon"] = obj["icon"];
      objFr["erc"] = obj["erc"];
      this.jonDataForTierMergeToDraw.push(objFr);
      this.mapOfUsedTiers[objFr["sourceId"]] = true;
      this.mapOfUsedTiers[objFr["targetID"]] = true;
    }
  }

  returnSourceID(id) {
    let tierID;
    let len = this.jsonDataForTierMergetoView.length
    for (let i = 0; i <= len - 1; i++) {
      if (this.jsonDataForTierMergetoView[i]["tI"] == id) {
        tierID = this.jsonDataForTierMergetoView[i]["id"];
        break;
      }
    }
    return tierID;
  }
  returnTargetID(id) {
    let tierID;
    let len = this.jsonDataForTierMergetoView.length
    for (let i = 0; i <= len - 1; i++) {
      if (this.jsonDataForTierMergetoView[i]["tI"] == id) {
        tierID = this.jsonDataForTierMergetoView[i]["id"];
        break;
      }
    }
    return tierID;
  }

  checkForParent(pTid, tId,btId) {
    let id
    let len = this.jonDataForTierMergeToDraw.length
    for (let i = 0; i <= len - 1; i++) {
      if (this.jonDataForTierMergeToDraw[i]["tI"] == tId && this.jonDataForTierMergeToDraw[i]["pTi"] == pTid && this.jonDataForTierMergeToDraw[i]["BtID"] == btId ) {
        id = i;
        break;
      }
    }
    return id;
  }

  // createCordinatesTierMerge() {
  //   var cordinate = [];
  //   var centerPoint = {};
  //   var flowmapDivHeight = $("#flowMapDiv").height(); // Get Flowmap Div Height
  //   var flowmapDivWidth = $("#flowMapDiv").width();   // Get Flowmap Div Width
  //   var distanceX = flowmapDivHeight / 2 - (flowmapDivHeight * .1);
  //   var distanceY = flowmapDivWidth / 2 - (flowmapDivWidth * .1);

  //   centerPoint.X = distanceX + 20; // It is distance from top side
  //   centerPoint.Y = distanceY; // It is distance from left side

  //   var nodeCount = json.nodeInfo.length; // Total No. of node
  //   var nodeAngel = 360 / nodeCount; // Calculating nodes angel
  //   var increasedAngel = 0;

  //   for (var i = 0; i < nodeCount; i++) {
  //     var angle = (increasedAngel * Math.PI / 180);
  //     cordinate[0] = Math.round(centerPoint.X + distanceX * Math.sin(angle));
  //     cordinate[1] = Math.round(centerPoint.Y + distanceY * Math.cos(angle));

  //     json.nodeInfo[i].cordinate[0] = cordinate[0];
  //     json.nodeInfo[i].cordinate[1] = cordinate[1];
  //     increasedAngel = increasedAngel + nodeAngel;
  //   }

  // }
  /**
   * this method creates coordinates of for the  tier boxes.
   */
  createCordinatesTierMerge() {
    let lastPId = 0;
    let lastChildId = 0;
    let childCount = 0;


    let levelCount = 2;
    let flag = false;
    let lim = 0;
    let leftTr = 580;
    let leftback = 0;
    let topTr = -80;
    let topback = 0;
    let tempL = 0;
    let tempT = 0;
    let name: string = "";
    let collout = 0;
    let positionTr = 1;
    let positionback = 1;
    
    this.arrangeInParentChildForm(this.jsonDataForTierMergetoView).then(()=>{
    this.jsonDataForTierMergetoView.forEach((obj, index) => {
      // childCount = 0;
      // if (obj["cType"] == "PB"  || obj["cType"] == "CB" || obj["cType"] == "C") {

      //   lim++;
      //   if (lim == 1) {
      //     left = 300 * levelCount;
      //     top = top;
      //   }
      //   else if (lim <= 3) {
      //     top = top + 100;
      //     if (lim == 3) {
      //       flag = true;
      //       tempT = top;
      //     }
      //   }
      //   else {
      //     lim = 1;
      //     tempT = top;
      //     levelCount++;
      //     left = 300 * levelCount;
      //     top = top - 150;
      //     flag = true;
      //   }
      // }

      if((obj["cType"] == "P" || obj["cType"] == "OP" ||  obj["cType"] == "C")) {
        obj["icon"] = this.returnIconForTier(obj["tI"])
        obj["tierClass"] = true;
        obj["ovalClass"] = false;
        lim = 0;
        if(positionTr == 1) {
          if(topback > 0 && topback > topTr)
           topTr = topback + 160 ;
          else
           topTr = topTr + 200;
          leftTr = leftTr - 210;
          positionTr = 0;
          topback = topTr;
          leftback = leftTr;
        }
        else{
         if(topback > 0 && topback > topTr)
          topTr = topback + 160 ;
         else
          topTr = topTr + 200;
          leftTr = leftTr + 220;
          positionTr = 1;
          topback = topTr;
          leftback = leftTr;
        }
        obj['left'] = leftTr + 'px';
        obj['top'] = topTr + 'px';
        positionback = 1;
        topback = topback - 140;
        leftback = leftback + 600;
      }
      else{
        if(positionback == 1) {
          topback = topback + 40;
          leftback = leftback - 160;
          positionback = 0;
        }
        else{
          topback = topback + 40;
          leftback = leftback + 160;
          positionback = 1;
        }
        obj["tierClass"] = false;
        obj["ovalClass"] = true;
        obj['left'] = leftback + 'px';
        obj['top'] = topback + 'px';
      }
    }) 
  });
    //console.log("id json", this.jsonDataForTierMergetoView);
  /* var top = 70;
     var left = 300;
    var count = 0;
    var topTcOdd = 30;
    var leftTcOdd = 40;
    var countTcOdd = 0;
    var topTcEven  = 115;
    var leftTcEven =820 ;
    var countTcEven = 0;
    this.jsonDataForTierMergetoView.forEach((val, index) => {
      if (!(val["cType"])) {
        val["icon"] = this.returnIconForTier(val["tI"])
        val["tierClass"] = true;
        val["ovalClass"] = false;
        if (count % 2.forEach((val, index) => {
      if (!(val["cType"])) {
        val["icon"] = this.returnIconForTier(val["tI"])
        val["tierClass"] = true;
        val["ovalClass"] = false;
        if (count % 2 == 0) {
          val["cordinate"] = "even";
          val["left"] = left + "px";
          if (count > 0)
            val["top"] = (count * 70 + 90) + "px";
          else
            val["top"] = top + "px";
        }
        else if (count % 2 != 0) {
          val["cordinate"] = "odd";
          val["top"] = this.jsonDataForTierMergetoView[count - 1].top;
          let left = this.jsonDataForTierMergetoView[count - 1].left.split('px')[0];
          val["left"] = (Number(left) + 450)
          val["left"] = val["left"] + "px"
        }
        count++;
      }
      else {
        val["tierClass"] = false;
        val["ovalClass"] = true;
        let coordinate = this.checkCoordinates(val["tI"]);
        if (coordinate == "even") {
          if (countTcOdd < 7) {
            val["top"] = topTcOdd + "px";
            val["left"] = leftTcOdd + "px";
            topTcOdd += 90
            countTcOdd++;
            count++;
          }
          else {
            val["top"] = topTcOdd + "px";
            val["left"] = (leftTcOdd) + "px";
            leftTcOdd += 30
            countTcOdd++;
            count++;
          }

        }
        else if (coordinate == "odd") {
          if (countTcEven < 7) {
            val["top"] = topTcEven + "px";
            val["left"] = leftTcEven + "px";
            topTcEven += 90
            countTcEven++;
            count++;
          }
          else {
            val["top"] = topTcEven + "px";
            val["left"] = leftTcEven + "px";
            leftTcEven -= 30
            countTcEven++;
            count++;
          }
        }
        // if (countTc < 5) {
        //   this.checkFor
        //   val["top"] = topTc + "px";
        //   val["left"] = leftTc + "px";
        //   topTc += 90
        //   countTc++;
        // }
        // else if (countTc >= 5 && countTc < 9) {
        //   topTc = 30;
        //   val["top"] = topTc + "px";
        //   val["left"] = (leftTc + 1120) + "px";
        //   topTc += 90
        //   countTc++;
        // }
        // else if (countTc >= 9 && countTc < 19) {
        //   val["top"] = topTc + "px";
        //   leftTc = 100;
        //   val["left"] = leftTc + "px";
        //   leftTc += 180
        //   countTc++;
        // }
        // else if (countTc > 17 && countTc < 24) {
        //   val["top"] = topTc + "px";
        //   val["left"] = leftTc + "px";
        //   topTc -= 70
        //   countTc++;
        // }
      }

    }); */
  }
  arrangeInParentChildForm(obj){
    return new Promise<void>((resolve, reject) => {
      try {
    let newObj = [];
    let count = 0;
    obj.forEach((valu,index) => {
      if(valu["cType"] == "P" || valu["cType"] == "OP" || valu["cType"] == "C"){
        newObj[count] = valu;
        count++;
        obj.forEach((val) => {
          if(valu["tI"] == val["tI"] && !(val["cType"] == "P" || val["cType"] == "OP" || val["cType"] == "C")){
            newObj[count] = val;
            count++;
          }
        });
        if(count == obj.length){
          resolve();
        }
      }
    });
    if(this.jsonDataForTierMergetoView.length == newObj.length){
      this.jsonDataForTierMergetoView = newObj;
      //console.log("check data in ",this.jsonDataForTierMergetoView, newObj);
      resolve();
    }
    else{
     //console.log("check data out ",this.jsonDataForTierMergetoView, newObj);
     resolve();
    }
  }
  catch(e){
    console.log("Error is ",e);
    resolve();
  }
  });
  }
  /**
   * this method  remove those tiers from json , where there in no transactions,
   * on the basis of used tiers map (mapOfUsedTiers)
   */
  filterOutUnusedTiers() {

    let temp = [];
    this.jsonDataForTierMergetoView.forEach((obj) => {
      let val = this.mapOfUsedTiers[obj.id];
      if (val) {
        obj["tN"] = this.getTierName(obj.tI)
        temp.push(obj);
      }
    })
    //console.log(this.mapOfUsedTiers, temp)
    this.jsonDataForTierMergetoView = temp;
  }
  idForBackends = 1000;
  tempJson = [];
  processItLater = [];
  createChildForTiers() {
    this.tempJson.forEach((objNew) => {
      objNew["targetID"] = this.idForBackends;
      objNew["id"] = this.idForBackends;
      this.idForBackends++;
      if (this.jonDataForTierMergeToDraw.length > 0) {
        for (let i = 0; i < this.jonDataForTierMergeToDraw.length; i++) {
          if (objNew["tI"] == this.jonDataForTierMergeToDraw[i]["tI"]) {
            objNew["sourceId"] = this.jonDataForTierMergeToDraw[i]["targetID"]
            break;
          }
        }
      }
    })

  }

  mergeChildWithTiers() {
    this.jonDataForTierMergeToDraw = [...this.jonDataForTierMergeToDraw, ...this.tempJson];
    this.jsonDataForTierMergetoView = [...this.jsonDataForTierMergetoView, ...this.tempJson];
  }


  mergeChildsForTiers(obj) {
    //console.log( " tempjson  before : " + JSON.stringify(this.tempJson)); 
	if (this.tempJson.length < 1) {
      obj["AvgD"] = obj["D"]/obj["count"];
      obj["count"] = (obj["count"] || 1)
      if (obj.erc != undefined && !isNaN(obj.erc))
        obj.erc = Number(obj.erc);
      this.tempJson.push(obj)
    }
    else {
      for (let i = 0; i < this.tempJson.length; i++) {
        if (obj.t == this.tempJson[i]["t"] && obj.tI == this.tempJson[i]["tI"] && obj.displayName == this.tempJson[i]["displayName"]) {
        var oldcount = this.tempJson[i]["count"];  
	this.tempJson[i]["count"] = (this.tempJson[i]["count"] + (obj.count || 1));
          this.tempJson[i]["AvgD"] = (obj.D + this.tempJson[i]["AvgD"]*oldcount)/this.tempJson[i]["count"];
	  this.tempJson[i]["D"] = this.tempJson[i]["D"] + obj.D;
        if (obj.erc != undefined && !isNaN(obj.erc))
          this.tempJson[i]["erc"] = this.tempJson[i]["erc"] + Number(obj.erc);
	
          break;
        }
        else if (i == this.tempJson.length - 1) {
          obj["AvgD"] = obj["D"]/obj["count"];
          obj["count"] = (obj["count"] || 1);
       if(obj.erc != undefined && !isNaN(obj.erc))
          obj.erc = Number(obj.erc);
          this.tempJson.push(obj)
          break;
        }
      }
    }
  }

  returnIconForTier(tI) {
    // let icon = this.mapOfIt[tI];
    // return icon.toString().toUpperCase() + ".png"
    for (let i = 0; i < this.jonDataForTierMergeToDraw.length; i++) {
      if (this.jonDataForTierMergeToDraw[i]["tI"] == tI) {
        return this.jonDataForTierMergeToDraw[i]["icon"]
      }
    }
  }
  checkCoordinates(tI) {
    for (let i = 0; i < this.jsonDataForTierMergetoView.length; i++) {
      if (this.jsonDataForTierMergetoView[i]["tI"] == tI) {
        return this.jsonDataForTierMergetoView[i]["cordinate"]
      }
    }
  }

  getParent(val) {
    for (let i = 0; i < this.jsonData.length; i++) {
      if ((this.jsonData[i]["cType"] == "C" || this.jsonData[i]["cType"] == "P") && val.jpF == this.jsonData[i]["F"]) {
        return this.jsonData[i]
      }
    }
  }

  mergeAllTierData() {
    let tempJson = [];
    this.jonDataForTierMergeToDraw.map((val) => {
      if (!val["cType"]) {
        if (tempJson.length > 0) {
          let index = this.checkForSame(val, tempJson);
          if (index == undefined) {
            tempJson.push(val);
          }
          else {
            let newObj = JSON.parse(JSON.stringify(val));
            tempJson[index];
 tempJson[index]["BtID"] = tempJson[index]["BtID"] + "";
	    console.log("tempjson btid : " + tempJson[index]["BtID"] );
console.log("newobj btid : " + newObj["BtID"] );
	    if(!tempJson[index]["BtID"].includes(newObj["BtID"])) {
		tempJson[index]["BtID"] = tempJson[index]["BtID"] + "," + newObj["BtID"]
            
	    tempJson[index]["Tduration"] = tempJson[index]["Tduration"] + "," +newObj["Tduration"]
            tempJson[index]["count"] = tempJson[index]["count"] + "," + newObj["count"];
            tempJson[index]["AvgDuration"] =tempJson[index]["AvgDuration"] +newObj["Tduration"]/newObj["count"];// tempJson[index]["Tduration"] / tempJson[index]["count"];
          }
	else{
	
		/*get the old values , calculate new values and update
		var bti = getindex(tempJson[index]["BtID"],newObj["BtID"]);
		var TDurS = getvalatindex(tempJson[index]["Tduration"] , bti);
		var TCountS = getvalatindex(tempJson[index]["count"] ,bti);
		var TDur = Number(TDurS.trim());
		var TCount = Number(TCountS.trim());
		TDur = TDur + newObj["Tduration"];
		TCount = TCount + newObj["count"];*/
		
		
		
		 
	}
}
        }
        else {
          tempJson.push(val);
        }
      }
      else {
        tempJson.push(val);
      }


    })

    this.jonDataForTierMergeToDraw = tempJson;
  }

  checkForSame(val, tempJson) {
    let id;
    for (let i = 0; i < tempJson.length; i++) {
      if (val["sourceId"] == tempJson[i]["sourceId"] && val["targetID"] == tempJson[i]["targetID"]) {
        id = i;
        break;
      }
    }
    return id;
  }

  getData() {
    return new Promise((resolve, reject) => {
      if (this.jsonDataForTierMergetoView.length > 0 || this.rootFpMiss) {
        resolve(this.jsonDataForTierMergetoView);
      }
      else {
        let url;
        this.isRefreshCase = false;
        this.getHeaderDetails();
        this.createFirstLevelJson(url).then((data) => resolve(data));
      }
    })
  }

  getDataForAgg() {
    return new Promise((resolve, reject) => {
      if (this.jsonData.length > 0) {
        resolve(this.jsonData);
      }
      else {
        let url;
        this.getHeaderDetails();
        this.isRefreshCase = true;
        this.CommonServices.loaderForDdr = true;
        this.createFirstLevelJson(url).then((data) => resolve(data));
      }
    })
  }
  checkChildPresentForRP(F) {
    let res = this.mergeChildData[F];
    if (!res) {
      return false;
    }
    else {
      return true;
    }
  }
  getHeaderDetails() {
    let url = sessionStorage.getItem("aggUrl");
    let data = url.split("&");
    this.startTime = Number(data[2].split("=")[1]);
    console.log("startTime", this.startTime)
    this.endTime = Number(data[3].split("=")[1]);
    this.btName = data[5].split("=")[1];

  }
  getTruncatedURL(name) {
    let str = "";
      
    if (name == '-')
      return '';

    if (name.length <= 32 )
      return name;

    str = name.substring(0, 16) + "..." + name.substring(name.length - 16, name.length);
    return str;
  }
}
