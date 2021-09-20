import { Component, OnInit, ElementRef, OnChanges, Input, ChangeDetectorRef, ViewChild, Renderer2 } from '@angular/core';
// import * as jQuery from 'jquery';
import { DdrTxnFlowmapDataService } from './../../services/ddr-txn-flowmap-data.service';
declare var jsPlumb: any;
//import { DdrTransactioIndividualInfoService } from './../../services/ddr-transactio-individual-info.service';
import { CommonServices } from './../../services/common.services';
import { CavTopPanelNavigationService } from '../../../tools/configuration/nd-config/services/cav-top-panel-navigation.service';
import { Router } from '@angular/router';
import { CavConfigService } from "../../../tools/configuration/nd-config/services/cav-config.service";
import { MenuItem, ContextMenu } from 'primeng/primeng';
import { DdrDataModelService } from "../../../tools/actions/dumps/service/ddr-data-model.service";
import { DdrBreadcrumbService } from './../../services/ddr-breadcrumb.service';
import * as  CONSTANTS from './../../constants/breadcrumb.constants';
import { DdrAggFlowmapService } from './../../services/ddr-agg-flowmap.service';
import * as moment from 'moment';
import 'moment-timezone';
// import { BROWSER_SANITIZATION_PROVIDERS } from '../../../../../../node_modules/@angular/platform-browser/src/browser';


@Component({
  selector: 'app-ddr-tier-merge-view',
  templateUrl: './ddr-tier-merge-view.component.html',
  styleUrls: ['./ddr-tier-merge-view.component.css']
})
export class DdrTierMergeViewComponent implements OnInit {
  dataToDraw = [];
  reCreateDiv: boolean = true;
  tooltipForNodes: any;
  maxX: number;
  maxY: number;
  shiftFactor: number;
  ctx: any;
  heightHeaderBox: number;
  arr_id_x_y: any;
  widthOfTooltip: any;
  heightOfTooltip: number;
  ContextMenuItems: MenuItem[];
  @ViewChild('contextRef') public contextRef: ContextMenu;
  objofCurrentnode: any;
  ContextMenuItemsForExceeption: MenuItem[];
  btId: any;

  constructor(
    public aggFlowmapService: DdrAggFlowmapService, 
    private _router: Router, 
    private DdrBreadcrumbService: DdrBreadcrumbService, 
    private CommonServices: CommonServices, 
    private changeDetection: ChangeDetectorRef, 
    private el: ElementRef, 
    public  _ddrData: DdrDataModelService 
    ) { }



  ngOnInit() {
    this.aggFlowmapService.getData().then(data => {
      this.dataToDraw = this.aggFlowmapService.jsonDataForTierMergetoView;
      this.DdrBreadcrumbService.setBreadcrumbs("DdrTierMergeViewComponent");
      console.log("dat", this.dataToDraw, this.aggFlowmapService.jonDataForTierMergeToDraw)
      this.CommonServices.loaderForDdr = false;
      setTimeout(() => {
        this.creteflowmap(this.aggFlowmapService.jonDataForTierMergeToDraw)
        this.showHeaderInfo();
      }, 500)
     
    })

  if(this._ddrData.testRunTr)
    this._ddrData.testRun = this._ddrData.testRunTr;
  }
  creteflowmap(jsonDataToDraw) {

    //passing the referrence to use with function inside function
    var that = this;
    jsPlumb.ready(() => {

      var instance = window['jsp'] = jsPlumb.getInstance(
        {
          Container: "canvas",
          Endpoint: ["Dot", { radius: 2 }],
          EndpointStyle: { fillStyle: "#567567" },
          //Anchor: "Continuous",
          connector: "Straight",
          // connectorStyle: connectorPaintStyle,

        }

      );
      var basicType = {
        connector: "Straight",
        paintStyle: { stroke: "red", strokeWidth: 4 },
        hoverPaintStyle: { stroke: "blue" },
        overlays: [
          "Arrow"
        ]
      };
      let agentID,count;
      count=0;
      let urlName= this.aggFlowmapService.btName;
      console.log("this.aggFlowmapService.btName",this.aggFlowmapService.btName);
      instance.registerConnectionType("basic", basicType);
      jsonDataToDraw.forEach((obj, index) => {

        console.log("jfvhfdhvghdfv", obj)
        if(count == 0)
         obj["sourceId"] = "root";
         obj["ID"] = count.toString();
        // suspend drawing and initialise.
        console.log("checkkk", obj["sourceId"]);
        instance.batch(function () {
      
          // make all the window divs draggable
          instance.draggable(jsPlumb.getSelector(".flowchart-demo .window"), { grid: [20, 20] });
          // THIS DEMO ONLY USES getSelector FOR CONVENIENCE. Use your library's appropriate selector
          // method, or document.querySelectorAll:
          //  jsPlumb.draggable(jsPlumb.querySelectorAll(".window"), {containment:[5,130,99999,99999]});
          //instance.draggable(jQuery(".window"),{ containment: jQuery('flowmap-box')});
          if (!(obj.sourceId == obj.targetID)) {
            if (!obj.cType) {
              var dynamicAnchors = [[0.2, 0, 0, -1], [1, 0.2, 1, 0],
                "Top", "Bottom"];
              instance.connect({
                source: obj.sourceId + "",
                target: obj.targetID + "",
                // connectorStyle: connectorPaintStyle,

                hoverPaintStyle: { stroke: "red" },
                Anchor: dynamicAnchors,
                anchors: [["Perimeter", { shape: "Rectangle" }], ["Perimeter", { shape: "Rectangle" }]],
                deleteEndpointsOnDetach: false,
                detachable: false,
                connector: "Straight",
                overlays: [
                  ["Arrow", { location: 0.3, width: 6, length: 5 }],
                  ["Arrow", { location: 0.9, width: 6, length: 5 }],
                 ["Label", { label: "<a style='color:black !important' id='label" + obj.ID + "'>" + getBtName(obj) + "<span id='labela" + obj.ID + "'></span></a>", location: 0.5, id: "myLabel", cssClass: " greenLabel" }]],
              });
            }
            // else if(!obj.cType && (obj.sourceId == "root")) {
            //   var dynamicAnchors = [[0.2, 0, 0, -1], [1, 0.2, 1, 0],
            //     "Top", "Bottom"];
            //   instance.connect({
            //     source: obj.sourceId + "",
            //     target: obj.targetID + "",
            //     // connectorStyle: connectorPaintStyle,

            //     hoverPaintStyle: { stroke: "red" },
            //     Anchor: dynamicAnchors,
            //     anchors: [["Perimeter", { shape: "Rectangle" }], ["Perimeter", { shape: "Rectangle" }]],
            //     deleteEndpointsOnDetach: false,
            //     detachable: false,
            //     connector: "Straight",
            //     overlays: [
            //       ["Arrow", { location: 0.3, width: 6, length: 5 }],
            //       ["Arrow", { location: 0.9, width: 6, length: 5 }],

            //       ["Label", { label: "<a style='color:black !important' id='label" + obj.ID + "'><center>BT:" + getBT(obj.BtID) + "," + getCalls(obj.count) + ",<br/> Avg. Resp. Time=" + timeFormatter(Number(obj.Tduration)/Number(obj.count)) + "ms </br>" + "</center><span id='labela" + obj.ID + "'></span></a>", location: 0.5, id: "myLabel", cssClass: " greenLabel" }]],
            //   });
            // }
            else {
              if (obj.t && obj.t != -1) {
                instance.connect({
                  source: obj.sourceId + "",
                  target: obj.targetID + "",
                  // connectorStyle: connectorPaintStyle,
                  hoverPaintStyle: { stroke: "red" },
                  anchors: [["Perimeter", { shape: "Circle" }], ["Perimeter", { shape: "Rectangle" }]],
                  deleteEndpointsOnDetach: false,
                  detachable: false,
                  connector: "Straight",
                  overlays: [
                    ["Arrow", { location: 0.3, width: 6, length: 5 }],
                    ["Arrow", { location: 0.9, width: 6, length: 5 }],
                    ["Label", { label: "<a style='color:black !important' id='label" + obj.ID + "'><center>" + getIpName(obj.t) + ", " + obj.count + " calls, Avg. Response Time=" + timeFormatter(obj.AvgD) + " ms </br>" + "</center><span id='labela" + obj.ID + "'></span></a>", location: 0.5, id: "myLabel", cssClass: "newLabel" }]],

                });
              }
              else {
                let element = document.getElementById(obj.targetID)
                element.parentNode.removeChild(element);
              }
            }
            count++;
          }
// for tool tip on lable
if((obj.sourceId != obj.targetID)){
  //self invoked method for creating tooltip div for label of connections
  (function tooltipMethod() {
    console.log("self invoked", obj,obj.id);
    var labelID = "label" + obj.ID;
    var innerlabelid = "labela" + obj.ID;
    var divBox = "<div style=''>";
    if (obj.t)
      divBox += "<b>Type: </b>" + getIpName(obj.t) + "<br/>";
    let len = ((obj.count).toString().split(",")).length;
    if(len>1){
     divBox += getBtName(obj,true);      
    }
    else{
    divBox += "<b>Total Calls: </b>" + Number(obj.count).toLocaleString() +"<br/>";
    if (obj.erc != undefined && !isNaN(obj.erc)) {
      divBox += "<b>Success Calls: </b>" + Number(obj.count - obj.erc).toLocaleString()+"<br/>";
      divBox += "<b>Error Calls: </b>" + Number(obj.erc).toLocaleString()+"<br/>";
      divBox += "<b>Avg. Response Time: </b>" + timeFormatter(Number(obj.Tduration)/Number(obj.count))+ "ms "+"<br/>";
    }
    }
    // if (obj.sourceId == "root") {
    //   if (Number(Math.round(obj.AvgDuration)) == 0)
    //     divBox += "<b>Avg. Response Time : </b> < 1 ms</span>"+"<br/>";
    //   else
    //     divBox += "<b>Avg Response Time : </b>" + Number(Math.round(obj.AvgDuration)).toLocaleString() + " ms"+"<br/>";
    // }
    if (obj.callOutType == "t")//handle both cases When cumBackenduration and min is equal or not  cumBackendDuartion is max duartion
    {

      if (Number(obj.cumBackendDuration) == 0) 
        divBox += "<b>Max Duration: </b>< 1 ms<br/>";
      else
        divBox += "<b>Max Duration: </b>" + Number(obj.cumBackendDuration).toLocaleString() + " ms" + "<br/>";

      if (Number(obj.min) == 0)
        divBox += "<b>Min Duration: </b>< 1 ms<br/>";
      else
        divBox += "<b>Min Duration: </b>" + Number(obj.min).toLocaleString() + " ms" + "<br/>";


    }
    else if (obj.cumBackendDuration != obj.avgBackendDuration) {

      // if (Number(obj.cumBackendDuration) == 0)
      //   divBox += "<b>Total Duration: </b>< 1 ms<br/>";
      // else
      //   divBox += "<b>Total Duration: </b>" + Number(obj.cumBackendDuration).toLocaleString() + " ms" + "<br/>";

      // if (Number(obj.avgBackendDuration) == 0)
      //   divBox += "<b>Avg. Callout Time : </b>< 1 ms"+"<br/>";
      // else
      //   divBox += "<b>Avg. Callout Time : </b>" + Number(obj.avgBackendDuration).toLocaleString() + " ms" + "<br/>";

    }
    // else {
    //   if (obj.AvgD == 0)
    //     divBox += "<b>Callout Time : </b>< 1 ms" +"<br/>";
    //   else
    //     divBox += "<b>Callout Time : </b>" + Number(obj.AvgD).toLocaleString() + " ms" +"<br/>";

    // }
//               console.log(obj.backendType+"---------------backendType----");
      if(obj.callOutType == "T" && obj.backendType === 'HTTP' )
      {
       if(obj.totalNetworkDelay != "-1"){
        if(obj.totalNetworkDelay ==0)
        divBox += "<b>Total Network Delay : </b>< 1 ms<br/>";
        else
         divBox += "<b>Total Network Delay : </b>"+Number(obj.totalNetworkDelay).toLocaleString()+" ms<br/>";
         if(obj.totalNetworkDelay != obj.avgNetworkDelay)
            divBox += "<b>Avg. Network Delay : </b>"+Number(obj.avgNetworkDelay).toLocaleString() +" ms<br/>";
       }
  
     }
    // if (obj.avgBackendDuration >= 0 && obj.callOutType != "t")
    //    divBox += "<b>Percentage: </b>" + bakendPercentage +"<br/>";
    divBox += "</div>";

    setTimeout(() => {
      /*
       *getting element of overlay i.e anchor tag
       *appending tooltip div to anchor tag which is inside overlay div.
       *adding tooltip class to the anchor tag to show tooltip div on hover.
       */
      var d = document.getElementById(innerlabelid);
      d.innerHTML = d.innerHTML + divBox;
      document.getElementById(labelID).classList.add("tooltipsforlabel");
      /*
      * getting parent element of anchor tag of overlay which is dynamically created by jsplumb
      *adding event listener on overlays 
      * and adding z index to those div's on mouse enter and removing  on mose leave.
       */
      let parentElement = document.getElementById(labelID).parentElement;
      document.getElementById(parentElement.id).addEventListener("mouseenter", function setzindexofoverlays(obj) {
        document.getElementById(parentElement.id).style.zIndex = "22";
      });
      document.getElementById(parentElement.id).addEventListener("mouseleave", function setzindexofoverlaysonleave(obj) {
        document.getElementById(parentElement.id).style.zIndex = "19";
      });

    }, 0)

  }());
}

        })
      });
      function getBtName(obj, tooltip?) {
        let d ="";
        let arrBt = obj.BtID.toString().split(",");
        let arrCount = (obj.count).toString().split(",");
        let avTime = (obj.Tduration).toString().split(",");
        let arrErr = (obj.erc).toString().split(",");
        let len = arrBt.length;
        for(let k = 0; k<len; k++){
        if(!tooltip)
        {
         if(len == 1)
           d += "<center>BT:" + getBT(arrBt[k]) + "," + getCalls(arrCount[k]) + ",Avg. Response Time :" + timeFormatter(Number(avTime[k])/Number(arrCount[k])) + "ms " + "</center>";
          else{
            let count =0;
            for(let i = 0; i<len; i++){
             count += Number(arrCount[i]);
            }
           d += "<center>" + len + " BT, " + count +  " calls</center>";
           break;
          }
          }
         else{
         if(!arrErr[k])
          arrErr[k] = "0";
         d +=  "<b>BT:</b>" + getBT(arrBt[k]) + "," + "<b>Success Calls:</b>" + (Number(arrCount[k]) - Number(arrErr[k])) +"," + "<b>Error Calls:</b>" + arrErr[k] + ",Avg. Response Time :" + timeFormatter(Number(avTime[k])/Number(arrCount[k])) + "ms ";
         }
         if(k != len-1)
          d += "</br>";
        }
        return d;
      }
      function getBT(btId : string){
        for(let k=0 ; k < that.aggFlowmapService.initJson.length ; k++){
          if(that.aggFlowmapService.initJson[k].bts[btId])
           {
             return that.aggFlowmapService.initJson[k].bts[btId];
           }
        }
      }

      function getIpName(type) {
        return that.aggFlowmapService.getBackendTypeName(type)
      }
      function getCalls(count) {
        if (count < 2) {
          let lab = count + " call"
          return lab;
        }
        else if (count == 2 || count > 2) {
          let lab = count + " calls";
          return lab;
        }
      }

      function timeFormatter(value) {
        if (!isNaN(value) && value % 1 != 0) {
          value = (Number(value)).toFixed(2).toLocaleString();
        }
        return value;
      }

    })
  }
  openAgg() {
    this.DdrBreadcrumbService.parentComponent = "DdrTierMergeViewComponent";
    this.CommonServices.loaderForDdr = true;
    if (this.CommonServices.isFromEd) {
      this._router.navigate(['/ddr/DdrAggFlowmapComponent']);
    }
    else {
      this._router.navigate(['/ddr/DdrAggFlowmapComponent']);
    }
  }
  trimTextForLarge(text) {
    try {
      if (text.length > 12)
        text = text.substring(0, 12) + "..";
      return text;
    }
    catch (err) {
      return "";
    }
  }

  labelNode = '';
  showHeaderInfo() {
    this.labelNode = '';
    console.log("date n time",this.aggFlowmapService.startTime)
    let dat = new Date(this.aggFlowmapService.startTime);
    console.log("date n time",this.aggFlowmapService.startTime,dat)
    let str = dat.toLocaleString();
    dat = new Date(this.aggFlowmapService.endTime);
    let end = dat.toLocaleString()
    if(this._ddrData.btCategory)
     this.labelNode = "<b>Tier : </b> " + this.aggFlowmapService.tierName + ",&nbsp <b>BT :</b> " + this.aggFlowmapService.btName + ",&nbsp <b>Start Date/Time :</b> " + str + ",&nbsp <b>End Date/Time :</b> " + end + ",&nbsp <b>BT Type :</b> " +this.CommonServices.getBTCategoryName(this._ddrData.btCategory);
    else
    this.labelNode = "<b>Tier : </b> " + this.aggFlowmapService.tierName + ",&nbsp <b>BT :</b> " + this.aggFlowmapService.btName + ",&nbsp <b>Start Date/Time :</b> " + str + ",&nbsp <b>End Date/Time :</b> " + end;



    setTimeout(() => {
      var d = document.getElementById('filterTier');
      d.innerHTML = this.labelNode;
    }, 400)

  }
  //to show tooltip on node on mouse enter
  ShowtooltiponHover(name) {
    document.getElementById(name.id).style.zIndex = "22";
    this.tooltipForNodes = this.fortooltipofNode(name);
  }
  fortooltipofNode(obj: any): any {
    let tooltipStr;
    if (obj.tN && obj.tN != '-')
      tooltipStr = "Tier: " + obj.tN;   
      //tooltipStr = "<b>Tier:</b>&nbsp;" + obj.tN;
    else
      tooltipStr = "Name: " + obj.displayName;
      //tooltipStr = "<b>Name:</b>&nbsp;" + obj.displayName;

      return tooltipStr;
  }
    //to remove tooltip on mouse leave from node
    removeTooltip(name) {
      console.log('this.conted = ',this.contextRef);
      //this.isTooltip = false;
      document.getElementById(name.id).style.zIndex = "20";
    }

  /*  downloadReport(type, arg) {
      let minX = 1400;  //default width of canvas
      let minY = 600;   //default height of canvas
  
      //this.getMaxCordinate();
      let canvas = this.el.nativeElement.querySelector('#canvasforDownload');
      console.log("check ",canvas);
  
      if (this.maxX < minX)
        canvas['width'] = minX;
      else
        canvas['width'] = this.maxX + 300;   //here 300 px is added as margin (for tooltip purpose)
  
      if (this.maxY < minY)
        canvas['height'] = minY + this.shiftFactor;
      else
        canvas['height'] = this.maxY + 150 + this.shiftFactor;   //here 150 px is added as margin (for tooltip purpose)
  
  
  
      var entryX = 30;      //X zxxxxxxxxxxxxxxxxxxxxxzxzxzxxxxxxzxzxxzxxxxxxxzxxzzxxxxxxzxzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzxxxxxxxxxxxxxxxxxzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzxzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzxxxzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzxzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz of entry node 
      var entryY = 70;      //Y cordn of entry node
  
  
      var font = 15;        //font of text inside tooltip 
      var padding = 5;
  
      if (canvas['getContext']) {
        this.ctx = canvas.getContext("2d");
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(0, 0, canvas['width'], canvas['height']);
        console.log("check 1", this.ctx);
        this.drawHeader(this.ctx);
        this.makeLines(this.ctx);
        this.makeNodes(this.ctx, arg);
      }
  
  
      if (type == 'directDownload') {
        setTimeout(() => {
          let a = document.getElementById("trans");
          let b = this.el.nativeElement.querySelector("#canvasforDownload");

          console.log("before a and b",a,b);

          document.getElementById("trans")['download'] = "image.png";
          document.getElementById("trans")['href'] = this.el.nativeElement.querySelector("#canvasforDownload").toDataURL("image/png");
          //.replace(/^data:image\/[^;]/, 'data:application/octet-stream');
          console.log("after a and b",a,b);
          document.getElementById("trans").click();
        }, 500);
      }
      else if (type == 'openInNewTab') {
        setTimeout(() => {
          document.getElementById("download")['download'] = "image.png";
          var url = this.el.nativeElement.document.getElementById("canvasforDownload").toDataURL("image/png");
          window.open(url, '_blank', 'drillDownReport');
        }, 500);
      }
    }*/
    /*drawHeader(ctx) {
    
      var wid = document.getElementById('canvasforDownload')['width'];
      this.heightHeaderBox = 45;
  
      ctx.strokeStyle = "blue";
      ctx.fillStyle = 'LightSteelBlue';
      ctx.fillRect(0, 0, parseInt(wid), this.heightHeaderBox);
  
      var src1 = "/images/logo.png";
      var img = new Image();
      img.onload = function () { ctx.drawImage(img, 1, 1, 160, 40); }
      img.src = src1;
  
      var mode = "";
      if(sessionStorage.getItem('productType') == 'netdiagnostics')
        mode = "Netdiagnostics";
      else
        mode = "Netstorm";
  
      var title = mode + " -Aggregate Transaction Flow - Test Run Number : " + sessionStorage.getItem('testRun');;
      ctx.font = "bold 22px serif";
      ctx.fillStyle = 'Navy';
      ctx.fillText(title, parseInt(wid) / 3, 2 * this.heightHeaderBox / 3);
  
} */
  /*  makeLines(ctx) {
      var entryX = 30;                   //X cordn of entry node 
      var entryY = 110 + this.shiftFactor;      //Y cordn of entry node   
      var arr = [];
      var x1, y1;            //(x1,y1) cordn of source of line connecting two nodes
      var padding = 5;
      var font = 15;
  
      this.dataToDraw.forEach((val, index) => {
        
        var filterBoxY = this.heightHeaderBox + 10;     //filterBox is used for filter criteria
        var filterBoxWidth = document.getElementById('canvas')['width'];
        var filterBoxHeight = 25;
  
        ctx.strokeStyle = "blue";
        ctx.lineWidth = 1;
        ctx.rect(0, filterBoxY, filterBoxWidth, filterBoxHeight);
        ctx.stroke();
        ctx.font = "17px serif";
        ctx.fillStyle = 'black';
        ctx.fillText(this.headerInfo, 1, filterBoxY + filterBoxHeight - 5);
  
  
        var x = parseInt(jQuery('#' + val.id).css('left').replace('px', ''));
        var y = parseInt(jQuery('#' + val.id).css('top').replace('px', '')) + 100;
  
        var id = val.id;
        var source = val.sourceId;
        // arr.push([id, x, y]);                // push id, x , y cordn in array
  
        if (val.sourceId == "root") {
          x1 = entryX;
          y1 = entryY;
        }
        else {
          for (var i in this.arr_id_x_y) {
            if (this.arr_id_x_y[i][0] == source) {
              x1 = this.arr_id_x_y[i][1];
              y1 = this.arr_id_x_y[i][2];
            }
          }
        }
  
        //make lines connecting nodes
        ctx.beginPath();
        ctx.strokeStyle = 'blue';
        ctx.moveTo(x1, y1);
        ctx.lineTo(x, y);
        ctx.stroke();
  
        //----------- making content of tooltip box of connecting lines to node ---------------
        var lbl = "";   //text for showing on line connecting line
        var dur = "";
        var callLabel = "call"
        if (Number(val.count) > 1)
          callLabel = "calls"
  
        if (val.cumBackendDuration == val.avgBackendDuration)  // if cumulative and average time equal
        {
          if (Number(val.avgBackendDuration) == 0)
            dur = "< 1 ms";
          else
            dur = Number(val.avgBackendDuration).toLocaleString() + " ms";
        }
        else {
          if (Number(val.cumBackendDuration) == 0)
            dur = "< 1 ms , < 1 ms";
          else
            dur = Number(val.cumBackendDuration).toLocaleString() + " ms" + ", " + Number(val.avgBackendDuration).toLocaleString() + " ms";
        }
        if (val.sourceId == "root") {
          if (Number(Math.round(val.avgFpDuration)) == 0)
            lbl = "< 1 ms";
          else
            lbl = Number(Math.round(val.avgFpDuration)).toLocaleString() + " ms";
        }
        else if (val.callOutType == "t")
          lbl = "Thread Call (" + (val.count).toLocaleString() + " " + callLabel + "), " + dur + " (" + Number(val.backendPercentage).toFixed(1) + "%)";
        else if (val.backendType == "OTHER") {
          if (val.avgBackendDuration >= 0)
            lbl = (val.count).toLocaleString() + " " + callLabel + ", " + dur + " (" + Number(val.backendPercentage).toFixed(1) + "%)";
          else
            lbl = (val.count).toLocaleString() + " " + callLabel;
        }
        else {
          if (val.avgBackendDuration >= 0)
            lbl = val.backendType + " (" + (val.count).toLocaleString() + " " + callLabel + "), " + dur + " (" + Number(val.backendPercentage).toFixed(1) + "%)";
          else
            lbl = val.backendType + " (" + (val.count).toLocaleString() + " " + callLabel + ")";
        }
        let queryParm
        if (val.urlQueryParmStr == "-")
          queryParm = "";
        else
          queryParm = val.urlQueryParmStr;
  
        var url = this.aggFlowmapService.getTruncatedURL(queryParm)
  
        //--------------- setting width and height of box according to content -----------------------
        if (ctx.measureText(url).width > ctx.measureText(lbl).width)
          this.widthOfTooltip = ctx.measureText(url).width + padding;
        else
          this.widthOfTooltip = ctx.measureText(lbl).width + padding;
  
        if (index == 0)
          this.widthOfTooltip -= 40;   //need to remove
  
        if (val.urlQueryParmStr == "-")
          this.heightOfTooltip = font + padding;
        else
          this.heightOfTooltip = 2 * font + padding;
  
  
        var X = ((x + x1) - this.widthOfTooltip) / 2;
        var Y = (y + y1) / 2 - font;
        var borderColor = "black";
        if (val.erCount != undefined && val.erCount > 0)
          borderColor = "red";
        else
          borderColor = "green";
        this.roundedRect(ctx, X, Y, this.widthOfTooltip, this.heightOfTooltip, 10, borderColor, '');   // make toottip box on line connecting nodes
  
        //write text in the tooltip box 		
        ctx.font = "15px serif";
        ctx.fillStyle = 'black';
        if (val.sourceId == "root") {
          ctx.fillText(lbl, ((x + x1)) / 2, (y + y1) / 2);
        }
        else
          ctx.fillText(lbl, ((x + x1) - this.widthOfTooltip) / 2, (y + y1) / 2);
          ctx.fillText(url, ((x + x1) - this.widthOfTooltip) / 2, (y + y1) / 2 + font);
  
        // ctx.fillText(parseInt(index)+1, (X+widthOfTooltip/2), Y);		
      });
    } */
  // headerInfo(headerInfo: any, arg1: number, arg2: number) {
  //   throw new Error("Method not implemented.");
  // }
 /* roundedRect(ctx, x, y, width, height, radius, borderColor, boxInfo) {
    ctx.beginPath();
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 1;
    ctx.fillStyle = "white";
    if (boxInfo == "nodeTooltip") {
      var gradient = ctx.createLinearGradient(x, y, x, y + height);
      gradient.addColorStop(0.6, '#ffffff');
      // if(borderColor == "red")
      //   gradient.addColorStop(1, 'red');
      //else
      gradient.addColorStop(1, 'rgb(100,200,255)');
      ctx.fillStyle = gradient;
    }
    // if(borderColor == "red")
    //  ctx.fillStyle = "red"; 
    //ctx.fillStyle = gradient;
    //ctx.fillStyle = "white";
    ctx.moveTo(x, y + radius);
    ctx.lineTo(x, y + height - radius);
    ctx.arcTo(x, y + height, x + radius, y + height, radius);
    ctx.lineTo(x + width - radius, y + height);
    ctx.arcTo(x + width, y + height, x + width, y + height - radius, radius);
    ctx.lineTo(x + width, y + radius);
    ctx.arcTo(x + width, y, x + width - radius, y, radius);
    ctx.lineTo(x + radius, y);
    ctx.arcTo(x, y, x, y + radius, radius);
    ctx.restore();
    ctx.fill();
    ctx.stroke();
    //ctx.fill();
  } */
/*  makeNodes(ctx, arg) {
    var padding = 5;
    var font = 15;
    var entryX = 30;      //X cordn of entry node 
    var entryY = 110 + 100;      //Y cordn of entry node
    var radius = 25;
    var startAngle = 0;
    var endAngle = 2 * Math.PI;
    ctx.beginPath();
    ctx.strokeStyle = "orange";
    ctx.fillStyle = 'orange';
    ctx.arc(entryX, entryY, radius, startAngle, endAngle, false);
    ctx.stroke();
    ctx.fill();
    ctx.font = "bold 12px serif";
    ctx.fillStyle = 'white';
    ctx.fillText("ENTRY", entryX - radius + 3, entryY);
    

    this.dataToDraw.forEach((val, index) => {
      ctx.beginPath();
      var x = parseInt(jQuery('#' + val.id).css('left').replace('px', ''));     // x coordinate
      var y = parseInt(jQuery('#' + val.id).css('top').replace('px', '')) + 100;   // y coordinate

      if (val.instanceTypeTopology != "-" && val.instanceTypeTopology != undefined) {
         var src1 = "/ProductUI/images/" + (val.instanceTypeTopology).toLowerCase() + ".png";
      }
      else
         var src1 = "/ProductUI/images/" + val.icon;

      var img = new Image();
      img.onload = function () { ctx.drawImage(img, x - 17, y - 17, 35, 35); }
      img.src = src1;

      //----------------------------------- make circlular nodes  ------------------------------
      ctx.lineWidth = 5;
      ctx.strokeStyle = "blue";
      ctx.fillStyle = 'white';
      ctx.arc(x, y, radius, startAngle, endAngle, false);
      ctx.stroke();
      ctx.fill();

      //----------------------------------  write names of nodes ----------------------------------
      var txt = this.trimTextForLarge(val.mappedAppName);     //node name

      if (txt == '-') {
        var sourceNodeInfo = this.getSourceNodeInfo(val.sourceId).split("%%");
        txt = sourceNodeInfo[0];
        var tierN = sourceNodeInfo[1];
        var serverN = sourceNodeInfo[2];
        var appN = sourceNodeInfo[3];
      }

      ctx.font = "bold 15px serif";
      ctx.fillStyle = "green";
      ctx.fillText(txt, (x - radius), (y + radius + 17));

      if (arg != "lessDetail") {
        //-------------------------  forming content of tooltip box of node ------------------------
        ctx.font = font + "px serif";
        ctx.fillStyle = "black";
        var Str = [];
        var heightOfTooltip = 0;
        var widthOfTooltip = 190;

        if (val.tierName != '-') {

          Str.push("Tier: " + val.tierName);
          Str.push("Server: " + val.serverName);
          Str.push("Instance: " + val.appName);
          Str.push("Start Time: " + val.startDateTime);
          heightOfTooltip += font * 4;      //for three rows
          if (val.cumFpDuration != val.avgFpDuration) {
            Str.push("Total Duration: " + Number(val.cumFpDuration).toLocaleString() + "ms");
            Str.push("Avg.Duration: " + Number(val.avgFpDuration).toLocaleString() + " ms");
            heightOfTooltip += font * 2;
          }
          else {
            Str.push("Total Duration: " + Number(val.avgFpDuration).toLocaleString() + "ms");
            heightOfTooltip += font * 1;
          }
          Str.push("Percentage: " + Number(val.percentage).toFixed(1) + " %");
          heightOfTooltip += font;
        }
        else if (val.mappedAppName == '-')  //in case of Thread Call
        {

          Str.push("Tier: " + tierN);
          Str.push("Server: " + serverN);
          Str.push("Instance: " + appN);
          heightOfTooltip = 3 * font;
        }
        else {
          if (val.mappedAppName != this.encodeHTMLStr(val.backendActualName)) {
            Str.push("Name: " + val.mappedAppName + "(" + this.encodeHTMLStr(val.backendActualName) + ")");
          }
          else {
            Str.push("Name: " + this.encodeHTMLStr(val.backendActualName));
          }
          widthOfTooltip = ctx.measureText(Str[Str.length - 1]).width;
          heightOfTooltip = font;
        }

        //---------------------------- making tooltip box -----------------------------------
        var dx = x - radius;
        var dy = y + radius + 17;
        var borderColor = "black";
        this.roundedRect(ctx, dx - 5, dy + 2, widthOfTooltip + padding, heightOfTooltip + padding, 10, borderColor, "nodeTooltip");

        //--------------------- writing text inside tooltip box of node --------------------
        dy += 15;
        ctx.font = " 15px serif";
        ctx.fillStyle = "black";
        for (var j = 0; j < Str.length; j++) {
          ctx.fillText(Str[j], dx, dy); dy += 15;

        }
      }
    });
  } */
    //This method is used to encode HTML characters
    encodeHTMLStr(str) {
      var returnString = "";
      if (str != undefined && str != "")
        returnString = str.toString().replace(/&#044;/g, ",").replace(/&#58;/g, ":").replace(/&#46;/g, ".").replace(/&#010;/g, "\n").replace(/&#039;/g, "\'")
          .replace(/&#034;/g, "\"").replace(/&#092;/g, "\\").replace(/&#124;/g, "|").replace(/&#123;/g, "{").replace(/&#125;/g, "}").replace(/&#126;/g, "~").replace(/&#11/g, "").replace(/&#12/g, "");
  
      return returnString;
    }
    getSourceNodeInfo(sourceId) {
      var returnStr = "";
      var sID = '#' + sourceId + ' .nodeHeading';
      var heading = jQuery(sID).text();
      var returnStr = heading;
  
      var spn = jQuery("#" + sourceId + " .tooltips  span").html(); //get the html tooltip content inside <span> of source
      var last = jQuery("#" + sourceId + " .tooltips  span").html().indexOf("<b>Start");
      spn = spn.substring(0, last);
  
      var arr = spn.split("<br>");
      for (var i = 0; i < arr.length - 1; i++) {
        var ar = arr[i].split("&nbsp;");
        returnStr += "%%" + ar[1];
      }
  
      //spn will be of form - sp =     <b>Tier:</b>&nbsp;Tier_13<br><b>Server</b>:&nbsp;10.10.40.13<br><b>Instance:</b>&nbsp;JVM_13<br> 
      return returnStr;
    }
    waningPopup:boolean =false;
    showWarningMessgae(){
      this.waningPopup = true;
    }
    getMenu(obj) {
      this.ContextMenuItems = [
        {
        label: 'Flowpath Report By Response Time',
        command: (event) => {
          this.getUrlInfo(obj).then((data) => {
          this.openReport(obj,"fpduration_desc",data,this.btId);
         });
        }
      },
      {
        label: 'Flowpath Report By CallOut Error',
        command: (event) => {
          this.getUrlInfo(obj).then((data) => {

          this.openReport(obj,"error_callout",data,this.btId);
        });
        }
      },
      {
        label: 'DB Queries',
        command: (event) => {
          this.getUrlInfo(obj).then((data) => {

          this.openReport(obj,"DB",data,this.btId);
        });
        }
      },
      {
        label: 'Hotspots',
        command: (event) => {
          this.getUrlInfo(obj).then((data) => {

          this.openReport(obj,"Hotspots",data,this.btId);
        });
        }
      },
      {
        label: 'Methods By Response Time',
        command: (event) => {
          this.getUrlInfo(obj).then((data) => {

          this.openReport(obj,"Methods",data,this.btId);
        });
        }
      },
      {
        label: 'Exceptions',
        command: (event) => {
          this.getUrlInfo(obj).then((data) => {

          this.openReport(obj,"Exceptions",data,this.btId);
        });
        }
      },
    ];
    }

  getUrlInfo(obj:any){
    for(let k=0; k<this.aggFlowmapService.jonDataForTierMergeToDraw.length; k++){
      if(this.aggFlowmapService.jonDataForTierMergeToDraw[k]["tI"] == obj.tI){
        this.btId = this.aggFlowmapService.jonDataForTierMergeToDraw[k]["BtID"];
        console.log("this.aggFlowmapService.jonDataForTierMergeToDraw[k] ***",this.aggFlowmapService.jonDataForTierMergeToDraw[k]["BtID"]);
        break;
      }
    }
    console.log("working *****1",this.aggFlowmapService.initJson.length);
    return new Promise((resolve, reject) => { 
     for(let i = 0 ; i < this.aggFlowmapService.initJson.length; i++) {
      console.log("working *****",(Object.keys(this.aggFlowmapService.initJson[i].tiers)), "check ",obj.tI);
      for(let j=0; j< (Object.keys(this.aggFlowmapService.initJson[i].tiers)).length ; j++){
        console.log("working *****",(Object.keys(this.aggFlowmapService.initJson[i].tiers))[j], "check ",obj.tI);
      if((Object.keys(this.aggFlowmapService.initJson[i].tiers))[j] == obj.tI){
        console.log("working *****",this.aggFlowmapService.initJson[i].CRI);
       resolve(this.aggFlowmapService.initJson[i].CRI);
       break;
      }
    }
   }
  });
  }
  openReport(objofCurrentnode: any,strOrderBy: any, ipData : any,btId:any) {
    this._ddrData.isFromAgg = true;
    this._ddrData.isFromtrxFlow = true;
    this.CommonServices.fpFilters = "";
   // this._ddrData.testRun = '1447';
    let url = [];
    url = ipData.split("/");
    //url = "http://10.10.40.3:8012/netdiagnostics/v1/cavisson/netdiagnostics" + "/ddr/flowpathreport?";
          // "testRun=" + "1447" + "&tierName=" + objofCurrentnode["tN"]  + "&strStartTime=" + "1551852380000"
          // + "&strEndTime=" + "1551855980000";
    //url += "&flowpathSignature=NA&strGroup=NA&serverName=undefined&appName=undefined&tierId=undefined&serverId=undefined&appId=undefined&threadId=undefined&sqlIndex=undefined&urlName=undefined&btCategory=undefined&flowpathEndTime=undefined&statusCode=-2&object=4&checkBoxValForURLIndexFromURLName=undefined&strOrderBy=error_callout&mode=null&pageIdx=undefined&pageName=undefined&transtx=undefined&script=undefined&sessionIndex=undefined&nsUrlIdx=undefined&location=undefined&access=undefined&userBrowserIndex=undefined&strStatus=undefined&generatorId=undefined&generatorName=undefined&urlNameFC=undefined&customFlag=false&shellForNDFilters=1";
    this._ddrData.protocolTr = url[0].split(":")[0];
    this._ddrData.hostTr = url[2].split(":")[0];
    let displayName = url[7];
    if(sessionStorage.getItem("isMultiDCMode") == "true" && displayName != '-'){
     this._ddrData.dcNameTr = displayName;
     this._ddrData.protocolTr = location.protocol.split(":")[0];
     this._ddrData.portTr = location.host.split(":")[1]  + '/tomcat/' + displayName;
     this._ddrData.hostTr = location.host.split(":")[0];
    }
    else
     this._ddrData.portTr = url[2].split(":")[1];
    if(!this._ddrData.portTr){
     if(this._ddrData.protocolTr == "http")
       this._ddrData.portTr = "80";
     else
       this._ddrData.portTr = "443";
    }
    this._ddrData.product = url[3];
    this._ddrData.testRunTr = url[8];
    this._ddrData.testRun = url[8];
    this._ddrData.tierName = objofCurrentnode["tN"];
    let hostDcName;
    hostDcName = "//" + this._ddrData.host + ":" + this._ddrData.port;
    if(hostDcName && this._ddrData.host)
     sessionStorage.setItem("hostDcName",hostDcName)
    this._ddrData.startTime = this.aggFlowmapService.startTime;
    this._ddrData.endTime = this.aggFlowmapService.endTime;
    this.DdrBreadcrumbService.parentComponent = "DdrTierMergeViewComponent";
    this.CommonServices.isFilterFromSideBar = false;
    if(strOrderBy == 'fpduration_desc' || strOrderBy == 'error_callout'){
     this._ddrData.strOrderBy = strOrderBy;
     this._ddrData.urlIndexAgg = btId;
    if (this._router.url.indexOf("/home/ddrCopyLink/") != -1)
    this._router.navigate(['/home/ddrCopyLink/flowpath']);
    else if (this._router.url.indexOf("/home/ED-ddr") != -1)
    this._router.navigate(['/home/ED-ddr/flowpath']);
    else
    this._router.navigate(['/home/ddr/flowpath']);
    }
    else if(strOrderBy == 'DB'){
      this._ddrData.strOrderBy == "query_count";
      this._ddrData.urlIndex =  btId;
      this._router.navigate(['/home/ddr/dbReport']);
    }
    else if(strOrderBy == 'Hotspots'){
      //this._ddrData.urlIndex =  btId;
      this._ddrData.startTime = this.aggFlowmapService.startTime;
      this._ddrData.endTime = this.aggFlowmapService.endTime;
      this._ddrData.flagForHSToFP = '1';
      this._router.navigate(['/home/ddr/hotspot']);
    }
    else if(strOrderBy == 'Exceptions'){
      this._ddrData.urlIndex =  btId;
      this._router.navigate(['/home/ddr/exception']);
    }
    else if(strOrderBy == 'Methods'){
      this._ddrData.urlIndex =  btId;
      this._router.navigate(['/home/ddr/methodtiming']);
    }
  }
  mainContextMenu : MenuItem[];
  getNodeDataforRouting(event,obj){
    console.log(" inside getnodedataforrouting");
    if(event.button == 2){
      console.log(" inside getnodedataforrouting  222");
    this.objofCurrentnode = obj;
    this.contextRef.show();
    
    setTimeout(()=> {
      // if(this.flowmapData.netForestURL == undefined ||this.flowmapData.netForestURL ==  null || this.flowmapData.netForestURL == 'undefined' || this.flowmapData.netForestURL == 'NA' ){
      //   if(this.ContextMenuItems.length > 5 && this.ContextMenuItemsForExceeption.length > 6)
      //   this.ContextMenuItems.splice(4,2)
      //   this.ContextMenuItemsForExceeption.splice(5,2)
      // }
      //if((obj.instanceType == 'java'||obj.instanceType == 'dotNet'||obj.instanceType == 'NodeJS' ||obj.instanceType == 'php') && (obj['exceptionCount'] == 0 || obj['exceptionCount'] == undefined)){
        this.contextRef.show();
        let nodes =  document.getElementById('contextmenu').childNodes;
        console.log("1",nodes);
        let elmHeight = document.getElementById(obj.id).style.top.split('px')[0];
        let elmleft = document.getElementById(obj.id).style.left.split('px')[0];
        console.log("check top ",elmHeight,elmleft);
       // nodes[0]['style'].top = (Number(elmHeight)  + 30) + 'px';
        //nodes[0]['style'].left = (Number(elmleft)  + 30 )+ 'px';
         nodes[0]['style'].top = (Number(elmHeight)  + 30) + 'px';
         nodes[0]['style'].left = (Number(elmleft)  + 138 )+ 'px';
         console.log("check top q",nodes[0]['style'].top,nodes[0]['style'].left);
        this.mainContextMenu = this.ContextMenuItems;
    //  }
      // else if((obj.instanceType == 'java'||obj.instanceType == 'dotNet'||obj.instanceType == 'NodeJS' || obj.instanceType == 'php') && (obj['exceptionCount'] > 0)){
      //   this.contextRef.show();
      //   let nodes =  document.getElementById('contextmenu').childNodes;
      //   console.log("2",nodes);
      //   let elmHeight = document.getElementById(obj.id).style.top.split('px')[0];
      //   let elmleft = document.getElementById(obj.id).style.left.split('px')[0];
      //   // nodes[1]['style'].top = (Number(elmHeight)  + 30) + 'px';
      //   // nodes[1]['style'].left = (Number(elmleft)  + 30 )+ 'px';
      //   nodes[0]['style'].top = (Number(elmHeight)  + 30) + 'px';
      //   nodes[0]['style'].left = (Number(elmleft)  + 30 )+ 'px';
      //   this.mainContextMenu = this.ContextMenuItemsForExceeption
      // }
      // else{
      //   return;
      // }    
    },300);  
    }
    this.getMenu(obj);
  }
  showDialogTable(obj) {

  }
}
