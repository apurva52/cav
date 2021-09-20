import { Component, OnInit , ElementRef, OnChanges, Input, ChangeDetectorRef, ViewChild, Renderer2} from '@angular/core';
import * as jQuery from 'jquery';
import { DdrTxnFlowmapDataService } from './../../services/ddr-txn-flowmap-data.service';
declare var jsPlumb: any;
import { DdrTransactioIndividualInfoService } from './../../services/ddr-transactio-individual-info.service';
import { CommonServices } from './../../services/common.services';
import { CavTopPanelNavigationService } from '../../../tools/configuration/nd-config/services/cav-top-panel-navigation.service';
import { Router } from '@angular/router';
import { CavConfigService } from "../../../tools/configuration/nd-config/services/cav-config.service";
import {MenuItem, ContextMenu} from 'primeng/primeng';
import { DdrDataModelService } from "../../../tools/actions/dumps/service/ddr-data-model.service";
import { DdrBreadcrumbService } from './../../services/ddr-breadcrumb.service';
import * as  CONSTANTS from './../../constants/breadcrumb.constants';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
import 'moment-timezone';
import { DDRRequestService } from '../../services/ddr-request.service';
import * as Highcharts from 'highcharts';

import { LZString } from './../../services/common.services';
import { BreadcrumbService } from 'src/app/core/breadcrumb/breadcrumb.service';

 //declare var LZString: any;

@Component({
  selector: 'app-ddr-transaction-flowmap',
  templateUrl: './ddr-transaction-flowmap.component.html',
  styleUrls: ['./ddr-transaction-flowmap.component.css']
})
export class DdrTransactionFlowmapComponent implements OnInit, OnChanges {
  highcharts = Highcharts;
  dataToDraw; //array which holds the json data from services to create flowmap.
  tableDialogDisplay: boolean = false;
  nodeColor = "err-page-node"; //css class to apply on nodes
  tooltipForNodes;   //to show tooltip on nodes.it contains elements
  popupTitle = ""; //to show tittle of dialog box on db click
  showClipboard = false; //to show tittle of dialog box on db click
  col = [];  // array to hold the columns of table
  transactionTableArray = [];
  urlParam: any;
  headerInfo: any;
  ContextMenuItems: MenuItem[];
  strTitle: string;

  isTooltip: boolean = false;

  showSelfLoop: boolean = false;  //to show and hide the dom element of jsPlumb  on the basis of user choice
  selfLoppedDataToDraw: any = []; //it holds the json for  data part in case of thread merging
  selfLoppedDataToDrawToView: any = []; //it holds the json for  html view in case of thread merging
  isFromMain: boolean = false;
  dataOfFlowpathROw: any;  //its holds the row data of Flowpath table from which user entered into flowmap 
  popupFooter: any;   //
  popupFilter: any;
  displayTFMPopUp: boolean = false;
  displayShowRelatedGraph = false;
  isFromContextMenu: boolean = false;
  ContextMenuItemsForExceeption: MenuItem[] = [];
  entryFPI: any;  //to hold the first flow path instance of json
  @Input() columnData;
  reCreateDiv = false;
  grapghData: any; //For Show Related Data
  graphJson: any;
  chart: Object;
  options: Object;
  options1: Object;
  headerForSRG: string;
  cols = [];
  cols1 = [];
  cols2 = [];
  showmore: boolean = false;
  showmore1: boolean = false;
  // ColumnRowData: any;
  // ColumnRowData1: any;
  graphTableArray = [];
  tableDialogDisplay1 = false;
  singleMergeGraph = false;
  rowDataForSRG: any;
  displaySamplePopup = false;
  startSample = '5';
  endSample = '5';
  graphMessage: String;
  graphData: any;
  totalGraph: number;
  tabularViewPopUpHeight: number;
  showAutoInstrPopUp: boolean = false;
  argsForAIDDSetting: any[];

  aggRenameArray = {};
  aggColOrder = [];
  aggDownloadJson: any;
  httpDialog: boolean = false;
  httpDialogTable: boolean = false;
  httpRequestArrBody1: any;
  httpRequestArrBody2 = [];
  httpRequestArrBody: any;
  httpResponseArrBody: any;
  httpResponseArrBody1: any;
  httpResponseArrBody2 = [];
  queryId: any;
  breadcrumb: BreadcrumbService;

  @ViewChild('contextRef') public contextRef: ContextMenu;
  drilInfoData: any;
  constructor(
    public flowmapData: DdrTxnFlowmapDataService,
    private _render: Renderer2,
    private nodeTabledataService: DdrTransactioIndividualInfoService,
    public CommonServices: CommonServices,
    private _navService: CavTopPanelNavigationService,
    private _router: Router,
    private _ddrData: DdrDataModelService,
    private breadcrumbService: DdrBreadcrumbService,
    private _cavConfigService: CavConfigService,
    private http: HttpClient,
    private el: ElementRef,
    private changeDetection: ChangeDetectorRef,
    private ddrRequest: DDRRequestService,
    breadcrumb: BreadcrumbService
  ) {
    this.breadcrumb = breadcrumb;
    this.dataOfFlowpathROw = this.flowmapData.paramsForFlowMap;
    // changeDetection.detach();
    // setInterval(() => {
    //   this.changeDetection.detectChanges();
    // }, 0);
  }

  ngOnChanges() {
    try {
      if (this._ddrData.splitViewFlag)
        this._ddrData.setInLogger('DDR::Flowpath', 'Transaction Flow', "Open Transaction Flowmap");
      console.log('this.contextRef = ', this.contextRef);
      this.reCreateDiv = false;
      console.log("changeDetector =" , this.changeDetection);
      this.changeDetection.detectChanges();
      this.reCreateDiv = true;
      this.CommonServices.isToLoadSideBar = false;
      // this.breadcrumbService.setBreadcrumbs(CONSTANTS.BREADCRUMB_ITEMS.TRANSACTION_FLOWMAP);
      if (sessionStorage.getItem("jsonDatatoDraw" + this.flowmapData.childFlowpatthData) != undefined) {
        this.dataToDraw = JSON.parse(LZString.decompress(sessionStorage.getItem("jsonDatatoDraw")));

      }
      //getting json data form service and passing to dtatTodraw
      else {
        console.log("json to draw")
        this.dataToDraw = this.flowmapData.jsonData;
        //sessionStorage.setItem("jsonDatatoDraw",LZString.compress(JSON.stringify(this.dataToDraw))) ;
      }
      this.CommonServices.loaderForDdr = false;
      this.nodeColor = "err-page-node";
      console.log("this.ghgh", this.dataToDraw);
      this.urlParam = this.CommonServices.getData();
      let checkFlag = this.showHeaderInfo(this.dataToDraw[0]);
      if (!checkFlag)
        return;

      //this.strTitle = 'Transaction Flowmap - '+ this.urlParam.testRun;
      /**This method used for thread merging and showing js plumb connections by default */
      this.getSelfLoopJsonData();
      this.tableDialogDisplay1 = false;
      this.displayShowRelatedGraph = false;
      this.singleMergeGraph = false;
      this.displaySamplePopup = false;
      this.randomNumber();
    }
    catch (e) {
      console.log("check error ", e);
      return;
    }
  }


  ngOnInit() {
    if (!this._ddrData.splitViewFlag) {
      this.CommonServices.isToLoadSideBar = true;
      // this.breadcrumbService.setBreadcrumbs(CONSTANTS.BREADCRUMB_ITEMS.TRANSACTION_FLOWMAP);
      this.breadcrumb.add({label: 'Transaction Flowmap', routerLink: '/ddr/Ddrtransactionflowpmap'});
      this.CommonServices.loaderForDdr = false;
      if (sessionStorage.getItem("jsonDatatoDraw" + this.flowmapData.childFlowpatthData) != undefined) {
        this.dataToDraw = JSON.parse(LZString.decompress(sessionStorage.getItem("jsonDatatoDraw")));

      }
      //getting json data form service and passing to dtatTodraw
      else {
        this.dataToDraw = this.flowmapData.jsonData;
        //sessionStorage.setItem("jsonDatatoDraw",LZString.compress(JSON.stringify(this.dataToDraw))) ;
      }
      this.nodeColor = "err-page-node";
      console.log("this.ghgh", this.dataToDraw);
      this.urlParam = this.CommonServices.getData();

      this.showHeaderInfo(this.dataToDraw[0]);
      //this.strTitle = 'Transaction Flowmap - '+ this.urlParam.testRun;
      /**This method used for thread merging and showing js plumb connections by default */
      this.getSelfLoopJsonData();
      this.randomNumber();
    }
    this.cols1 = [{ field: "value", header: "Request Body" }];
    this.cols2 = [{ field: "value", header: "Response Body" }];
  }


  creteflowmap(jsonDataToDraw) {
    console.log(jsonDataToDraw, "hfbvdhbf")
    //passing the referrence to use with function inside function
    var that = this;
    jsPlumb.ready(() => {
      // this is the paint style for the connecting lines..
      // var connectorPaintStyle = {
      //     strokeWidth: 2,
      //     stroke: "#61B7CF",
      //     joinstyle: "round",
      //     outlineStroke: "white",
      //     outlineWidth: 2,
      //     paintStyle: { stroke: "red", strokeWidth: 4 },
      //     hoverPaintStyle: { stroke: "blue" },
      //     overlays: [
      //         "Arrow"
      //     ]
      // },
      // .. and this is the hover style.
      //    var     connectorHoverStyle = {
      //             strokeWidth: 3,
      //             stroke: "#216477",
      //             outlineWidth: 5,
      //             outlineStroke: "white"
      //         },
      //         endpointHoverStyle = {
      //             fill: "#216477",
      //             stroke: "#216477"
      // }
      //creating instance of jsplumb with some default properties
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
      let agentID;
      instance.registerConnectionType("basic", basicType);
      jsonDataToDraw.forEach((obj, index) => {
        if (obj.instanceType == 'NodeJS') {
          agentID = obj.id;
        }
        if (index == 0) {
          this.entryFPI = obj.flowpathInstance;
        }
        // suspend drawing and initialise.
        instance.batch(function () {

          // make all the window divs draggable
          instance.draggable(jsPlumb.getSelector(".flowchart-demo .window"), { grid: [20, 20] });
          // THIS DEMO ONLY USES getSelector FOR CONVENIENCE. Use your library's appropriate selector
          // method, or document.querySelectorAll:
          //  jsPlumb.draggable(jsPlumb.querySelectorAll(".window"), {containment:[5,130,99999,99999]});
          //instance.draggable(jQuery(".window"),{ containment: jQuery('flowmap-box')});
          if (obj.sourceId != obj.id) {

            if (agentID == obj.sourceId) {
              console.log('coming for nodejs', obj.sourceId, agentID)
              instance.connect({
                source: obj.sourceId,
                target: obj.id,
                cssClass: getConncetionClass(),
                anchors: [["Perimeter", { shape: "Circle" }], ["Perimeter", { shape: "Rectangle" }]],
                hoverPaintStyle: { stroke: "red" },
                deleteEndpointsOnDetach: false,
                detachable: false,
                connector: "Straight",
                paintStyle: { strokeWidth: 2, stroke: "blue", dashstyle: "2 4" },
                overlays: [
                  ["Arrow", { location: 0.3, width: 6, length: 5 }],
                  ["Arrow", { location: 0.9, width: 6, length: 5 }],
                  ["Label", { label: "<div class='smallCircle'><span style='font-size:10px;'><b>" + obj.index + "</b></span></div>", id: "label", location: 0.5 }],
                  ["Label", { label: "<a style='color:black !important' id='label" + obj.id + "'><center>" + labelForconnection() + "</center><center title='" + geturlquery() + "' >" + geturlquery() + "</center><span id='labela" + obj.id + "'></span></a>", location: 0.5, id: "myLabel", cssClass: "" + getclassForlabel() + "" }]],
              });
            }
            else {
              if (obj.backendType === 'JMS_ATG') {
                instance.connect({
                  source: obj.sourceId,
                  target: obj.id,
                  cssClass: getConncetionClass(),
                  anchors: [["Perimeter", { shape: "Circle" }], ["Perimeter", { shape: "Rectangle" }]],
                  hoverPaintStyle: { stroke: "#2693FF" },
                  deleteEndpointsOnDetach: false,
                  detachable: false,
                  connector: "Straight",
                  paintStyle: { strokeWidth: 2, stroke: "blue", dashstyle: "2 4" },
                  overlays: [
                    ["Arrow", { location: 0.3, width: 6, length: 5 }],
                    ["Arrow", { location: 0.9, width: 6, length: 5 }],
                    ["Label", { label: "<div class='smallCircle'><span style='font-size:10px;'><b>" + obj.index + "</b></span></div>", id: "label", location: 0.5 }],
                    ["Label", { label: "<a style='color:black !important' id='label" + obj.id + "'><center>" + labelForconnection() + "</center><center title='" + geturlquery() + "' >" + geturlquery() + "</center><span id='labela" + obj.id + "'></span></a>", location: 0.5, id: "myLabel", cssClass: "" + getclassForlabel() + "" }]],
                });

              }
              else {
                instance.connect({
                  source: obj.sourceId,
                  target: obj.id,
                  cssClass: getConncetionClass(),
                  // connectorStyle: connectorPaintStyle,
                  hoverPaintStyle: { stroke: "red" },
                  anchors: [["Perimeter", { shape: "Circle" }], ["Perimeter", { shape: "Rectangle" }]],
                  deleteEndpointsOnDetach: false,
                  detachable: false,
                  connector: "Straight",
                  overlays: [
                    ["Arrow", { location: 0.3, width: 6, length: 5 }],
                    ["Arrow", { location: 0.9, width: 6, length: 5 }],
                    ["Label", { label: "<div class='smallCircle'><span style='font-size:10px;'><b>" + obj.index + "</b></span></div>", id: "label", location: 0.5 }],
                    ["Label", { label: "<a style='color:black !important' id='label" + obj.id + "'><center>" + labelForconnection() + "</center><center title='" + geturlquery() + "' >" + geturlquery() + "</center><span id='labela" + obj.id + "'></span></a>", location: 0.5, id: "myLabel", cssClass: "" + getclassForlabel() + "" }]],
                });
              }
            }
          }

          if (obj.sourceId == obj.id && obj.isAsync == false && obj.callOutType == "t") {
            instance.connect({
              source: obj.sourceId,
              target: obj.id,
              cssClass: getConncetionClass(),
              type: basicType,
              anchor: "Continuous",
              // connectorStyle: connectorPaintStyle,
              hoverPaintStyle: { stroke: "red" },
              deleteEndpointsOnDetach: false,
              detachable: false,
              overlays: [
                ["Arrow", { location: 0.3, width: 6, length: 5 }],
                ["Arrow", { location: 0.9, width: 6, length: 5 }],
                ["Label", { label: "<div class='smallCircle'><span style='font-size:10px;'><b>" + obj.index + "</b></span></div>", id: "label", location: 0.5 }],
                ["Label", { label: "<a style='color:black !important'>  Total Thread calls = " + obj.count + " </br>  Total Response time = " + obj.fpDuration + " ms </a>", id: "myLabel", cssClass: "" + getclassForlabel() + "" }]
              ]
            });


          }
          else if (obj.sourceId == obj.id && obj.callOutType == "t" && obj.isAsync == true) {
            instance.connect({
              source: obj.sourceId,
              target: obj.id,
              cssClass: getConncetionClass(),
              type: basicType,
              anchor: "Continuous",
              // connectorStyle: connectorPaintStyle,
              hoverPaintStyle: { stroke: "red" },
              deleteEndpointsOnDetach: false,
              detachable: false,
              overlays: [
                ["Arrow", { location: 0.3, width: 6, length: 5 }],
                ["Arrow", { location: 0.9, width: 6, length: 5 }],
                ["Label", { label: "<div class='smallCircle'><span style='font-size:10px;'><b>" + obj.index + "</b></span></div>", id: "label", location: 0.5 }],
                ["Label", { label: "<a style='color:black !important'> " + getLabelForAsync(obj) + " </br> " + getLabelForThread(obj) + " </a>", id: "myLabel", cssClass: "" + getclassForlabel() + "" }]
              ]
            });
          }
          function getLabelForAsync(obj) {
            let lab = "";
            lab = "Total Async Calls = " + obj["AsyncCount"] + ", Total Response Time = " + obj["AsyncDur"] + " ms";
            return lab;

          }
          function getLabelForThread(obj) {
            let lab = "";
            lab = "Total Thread Calls = " + obj["count"] + ", Total Response Time = " + obj["fpDuration"] + " ms";
            return lab;
          }
          if (obj.sourceId != obj.id) {
            //self invoked method for creating tooltip div for label of connections
            (function tooltipMethod() {
              let bakendPercentage = "0";
              if (obj.backendPercentage || Number(obj.backendPercentage) == 0) {
                if (Number(obj.backendPercentage) > 100) {
                  bakendPercentage = '100%***';
                }
                else {
                  bakendPercentage = Number(obj.backendPercentage).toFixed(1) + '%';
                }

              }
              console.log("self invoked");
              var labelID = "label" + obj.id;
              var innerlabelid = "labela" + obj.id;
              var divBox = "<div style=''>";
              if (obj.backendType != 'OTHER')
                divBox += "<b>Type: </b>" + obj.backendType + "<br/>";

              divBox += "<b>Total Calls: </b>" + Number(obj.count).toLocaleString() + "<br/>";
              if (obj.erCount != undefined && !isNaN(obj.erCount)) {
                divBox += "<b>Success Calls: </b>" + Number(obj.count - obj.erCount).toLocaleString() + "<br/>";
                divBox += "<b>Error Calls: </b>" + Number(obj.erCount).toLocaleString() + "<br/>";
              }

              if (obj.sourceId == "root") {
                if (Number(Math.round(obj.avgFpDuration)) == 0)
                  divBox += "<b>Response Time : </b> < 1 ms</span>" + "<br/>";
                else
                  divBox += "<b>Response Time : </b>" + Number(Math.round(obj.avgFpDuration)).toLocaleString() + " ms" + "<br/>";
              }
              else if (obj.callOutType == "t")//handle both cases When cumBackenduration and min is equal or not  cumBackendDuartion is max duartion
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

                if (Number(obj.cumBackendDuration) == 0)
                  divBox += "<b>Total Duration: </b>< 1 ms<br/>";
                else
                  divBox += "<b>Total Duration: </b>" + Number(obj.cumBackendDuration).toLocaleString() + " ms" + "<br/>";

                if (Number(obj.avgBackendDuration) == 0)
                  divBox += "<b>Avg. Callout Time : </b>< 1 ms" + "<br/>";
                else
                  divBox += "<b>Avg. Callout Time : </b>" + Number(obj.avgBackendDuration).toLocaleString() + " ms" + "<br/>";

              }
              else {
                if (obj.avgBackendDuration == 0)
                  divBox += "<b>Callout Time : </b>< 1 ms" + "<br/>";
                else
                  divBox += "<b>Callout Time : </b>" + Number(obj.avgBackendDuration).toLocaleString() + " ms" + "<br/>";

              }
              //               console.log(obj.backendType+"---------------backendType----");
              if (obj.callOutType == "T" && obj.backendType === 'HTTP') {
                if (obj.totalNetworkDelay != "-1") {
                  if (obj.totalNetworkDelay == 0)
                    divBox += "<b>Total Network Delay : </b>< 1 ms<br/>";
                  else
                    divBox += "<b>Total Network Delay : </b>" + Number(obj.totalNetworkDelay).toLocaleString() + " ms<br/>";
                  if (obj.totalNetworkDelay != obj.avgNetworkDelay)
                    divBox += "<b>Avg. Network Delay : </b>" + Number(obj.avgNetworkDelay).toLocaleString() + " ms<br/>";
                }

              }
              if (obj.avgBackendDuration >= 0 && obj.callOutType != "t")
                divBox += "<b>Percentage: </b>" + bakendPercentage + "<br/>";
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
          function getConncetionClass() {
            //if((that.flowmapData.missFPId != undefined && that.flowmapData.missFPId == obj.id && that.flowmapData.isFPMissCase != false)){
            //    if(obj.id && obj.id.includes("e")){ 
            if (obj.id) {
              var idarr = obj.id.split('_');
              var lastid = idarr[idarr.length - 1];
              if (lastid.includes("e") && obj.callOutType != "t") {
                return "redLine";
              }
            }
          }
          function getConncetionClassforAsync() {
            return "greenLine"
          }

          //it returns url query in shorter tooltipStrformat
          function geturlquery() {
            return that.flowmapData.getTruncatedURL(obj.urlQueryParmStr)
          }
          //it returns the label for each connection 
          function labelForconnection() {
            var lbl = ""; //lable for showing required info
            var dur = "";
            var delay = "";
            var callLabel = "call";

            let bakendPercentage = "0";

            if (obj.backendPercentage || Number(obj.backendPercentage) == 0) {
              if (Number(obj.backendPercentage) > 100) {
                bakendPercentage = '100%***';
              }
              else {
                bakendPercentage = Number(obj.backendPercentage).toFixed(1) + '%';
              }

            }
            if (Number(obj.count) > 1)
              callLabel = "calls"

            if (obj.cumBackendDuration == obj.avgBackendDuration)  // if cumulative and average time equal
            {
              if (Number(obj.avgBackendDuration) == 0)
                dur = "< 1 ms";
              else
                dur = Number(obj.avgBackendDuration).toLocaleString() + " ms";
            }
            else if (obj.callOutType == "t" && obj.cumBackendDuration != obj.min) {
              if (Number(obj.cumBackendDuration) == 0 && Number(obj.min) == 0)
                dur = "< 1 ms , < 1 ms";
              else
                dur = Number(obj.cumBackendDuration).toLocaleString() + " ms" + ", " + Number(obj.min).toLocaleString() + " ms";
            }
            else {
              if (Number(obj.cumBackendDuration) == 0 && Number(obj.avgBackendDuration) == 0)
                dur = "< 1 ms , < 1 ms";
              else
                dur = Number(obj.cumBackendDuration).toLocaleString() + " ms" + ", " + Number(obj.avgBackendDuration).toLocaleString() + " ms";
            }
            if (obj.totalNetworkDelay != "-1") {
              if (obj.totalNetworkDelay == obj.avgNetworkDelay) {
                if (Number(obj.totalNetworkDelay) == 0)
                  delay = ", < 1 ms";
                else
                  delay = ", " + Number(obj.totalNetworkDelay).toLocaleString() + " ms";
              }
              else
                delay = ", " + Number(obj.avgNetworkDelay).toLocaleString() + " ms";
            }
            if (obj.sourceId == "root") {
              if (Number(Math.round(obj.avgFpDuration)) == 0)
                lbl = "< 1 ms";
              else
                lbl = Number(Math.round(obj.avgFpDuration)).toLocaleString() + " ms";
            }
            else if (obj.callOutType == "t")
              lbl = "Thread Call (" + (obj.count).toLocaleString() + "&nbsp;" + callLabel + "), " + dur;
            else if (obj.callOutType == "A")
              lbl = "Async Call (" + (obj.count).toLocaleString() + "&nbsp;" + callLabel + "), " + dur;
            else if (obj.backendType == "OTHER") {
              if (obj.avgBackendDuration >= 0)
                lbl = (obj.count).toLocaleString() + "&nbsp;" + callLabel + ", " + dur + " (" + bakendPercentage + ")";
              else
                lbl = (obj.count).toLocaleString() + "&nbsp;" + callLabel;
            }
            else {

              if (obj.avgBackendDuration >= 0)
                lbl = obj.backendType + " (" + (obj.count).toLocaleString() + "&nbsp;" + callLabel + "), " + dur + " (" + bakendPercentage + ")";
              else
                lbl = obj.backendType + " (" + (obj.count).toLocaleString() + "&nbsp;" + callLabel + ")";
              //console.log("obj.backendType-------------"+obj.backendType); 
              if (obj.callOutType === "T" && obj.backendType === 'HTTP')
                lbl += delay;
            }
            var queryParm;
            if (obj.urlQueryParmStr == "-" && obj.urlQueryParamStr == undefined)
              queryParm = "";
            else
              queryParm = obj.urlQueryParmStr;
            var url;
            if (obj.url == "-")
              url = "";
            else
              // var url = trimText(queryParm, 25);
              url = queryParm;

            return lbl

          }


          //it returns the css class name for overlays
          function getclassForlabel() {
            /*
             Changes for error case, if there is one or more flowpath(s) is missing in current Trx than we will indicate it by "RedLine" in GUI.
             RedLine will represent fp is missing, we will connect child flowpath with it grand parentfp because parent fp is missing.
             */
            var label;
            if ((obj.erCount != undefined && obj.erCount > 0)) //This Check is applied for error flowpaths --|| (BTCATEGORY == "Errors" && obj.sourceId == "root")
              return label = "redLabel";
            else
              return label = "greenLabel";
          }
          //self invoked function to return the css clas for nodes
          (function setCss() {
            /*
             Changes for error case, if there is one or more flowpath(s) is missing in current Trx than we will indicate it by "RedLine" in GUI.
             RedLine will represent fp is missing, we will connect child flowpath with it grand parentfp because parent fp is missing.
             */
            var label;
            if (obj.flowPathType == "4") {
              document.getElementById(obj.id).classList.remove("node");
              document.getElementById(obj.id).classList.add('err-page-node');
            }
            if (obj.exceptionCount > 0) {
              document.getElementById(obj.id).classList.remove("node");
              document.getElementById(obj.id).classList.add('err-node');//This Check is applied for error flowpaths --|| (BTCATEGORY == "Errors" && obj.sourceId == "root")
            }
          }());

          //This method is used to encode HTML characters
          function encodeHTMLStr(str) {
            var returnString = "";
            if (str != undefined && str != "")
              returnString = str.toString().replace(/&#044;/g, ",").replace(/&#58;/g, ":").replace(/&#46;/g, ".").replace(/&#010;/g, "\n").replace(/&#039;/g, "\'")
                .replace(/&#034;/g, "\"").replace(/&#092;/g, "\\").replace(/&#124;/g, "|").replace(/&#123;/g, "{").replace(/&#125;/g, "}").replace(/&#126;/g, "~").replace(/&#11/g, "").replace(/&#12/g, "");

            return returnString;
          }
          //to replace the heading name in case of thread callout with "-" mapped name
          that.generateNodeheading(obj);
          //listen for clicks on connections, and offer to delete connections on click.
          if (that.flowmapData.isFPMissCase != false) {
            //jQuery('.tableTitle').append('<div id="fpMissDiv" style="float:right;"><img id="fpMissMsg" src="/netstorm/images/warning.png" style="height:20px;width:20px;float:left;"/></div>');
            // console.log('values',that.flowmapData.isFPMissCase,that.flowmapData.isFpCheckMiss)
            that.popupForFpMiss();
          }
          else {
            console.log('remove the warning div as it is not required')
            let elm = document.getElementById('missFpCase')
            if (elm) {
              elm.innerHTML = '';
              elm.classList.remove("warnMesgclass");
            }
            //  document.getElementById('dwnldbtn1').style.top = '0px'
            //  document.getElementById('dwnldbtn2').style.top = '0px'
          }

          instance.bind('click', function (conn, originalEvent) {
            // if (confirm("Delete connection from " + conn.sourceId + " to " + conn.targetId + "?"))
            //   instance.detach(conn);
            // conn.toggleType("basic", basicType);
          });

          instance.bind('connectionDrag', function (connection) {
            console.log('connection ' + connection.id + ' is being dragged. suspendedElement is ', connection.suspendedElement, ' of type ', connection.suspendedElementType);
            console.log("start");
          });

          instance.bind('connectionDragStop', function (connection) {
            console.log('connection ' + connection.id + ' was dragged');
            console.log("stopped");
          });


          instance.bind('connectionMoved', function (params) {
            console.log('connection ' + params.connection.id + ' was moved');
          });
        });

        jsPlumb.fire('jsPlumbDemoLoaded', instance);

      });
      // instance.draggable(jQuery(".window"),{containment:[50,110,99999,99999]});
    })
    this.ContextMenuItems = [
      {
        label: 'DB Request Report',
        command: (event) => {

          this.openDBReports(this.objofCurrentnode);
        }
      },
      {
        label: 'Method Timing Report',
        command: (event) => {
          this.openMethodTimingReport(this.objofCurrentnode);
        }
      },
      {
        label: 'HotSpot Thread Details',
        command: (event) => {
          this.openHotspotReport(this.objofCurrentnode);
        }
      },
      {
        label: 'Method Call Details',
        command: (event) => {
          this.openMethodCallingTree(this.objofCurrentnode, undefined);
        }
      },
      {
        label: 'Current Instance Log',
        command: (event) => {
          this.openNetForest(this.objofCurrentnode.flowpathInstance, '0', this.flowmapData.paramsForFlowMap.correlationId)
        }
      },
      {
        label: 'All Instance Log',
        command: (event) => {
          this.openNetForest(this.objofCurrentnode.flowpathInstance, '1', this.flowmapData.paramsForFlowMap.correlationId)
        }
      },
      {
        label: 'Show Related Graph',
        command: (event) => {
          this.openShowRelatedGraph(this.objofCurrentnode);
        }
      },
      {
        label: 'Http Report',
        command: (event) => {
          this.openHttpReport(this.objofCurrentnode);
        }
      },

    ];
    this.ContextMenuItemsForExceeption = [
      {
        label: 'DB Request Report',
        command: (event) => {

          this.openDBReports(this.objofCurrentnode);
        }
      },
      {
        label: 'Method Timing Report',
        command: (event) => {
          this.openMethodTimingReport(this.objofCurrentnode);
        }
      },
      {
        label: 'HotSpot Thread Details',
        command: (event) => {
          this.openHotspotReport(this.objofCurrentnode);
        }
      },
      {
        label: 'Method Call Details',
        command: (event) => {
          this.openMethodCallingTree(this.objofCurrentnode, undefined);
        }
      },
      {
        label: 'Exception Report',
        command: (event) => {
          this.isFromContextMenu = true;
          this.openExceptionReport(this.objofCurrentnode);
        }
      },
      {
        label: 'Current Instance Log',
        command: (event) => {
          this.openNetForest(this.objofCurrentnode.flowpathInstance, '0', this.flowmapData.paramsForFlowMap.correlationId)
        }
      },
      {
        label: 'All Instance Log',
        command: (event) => {
          this.openNetForest(this.objofCurrentnode.flowpathInstance, '1', this.flowmapData.paramsForFlowMap.correlationId)
        }
      },
      {
        label: 'Show Related Graph',
        command: (event) => {
          this.openShowRelatedGraph(this.objofCurrentnode);
        }
      },
      {
        label: 'Http Report',
        command: (event) => {
          this.openHttpReport(this.objofCurrentnode);
        }
      },
    ];

    this.flowmapData.getNetForestLink()
  }


  //to show tooltip on node on mouse enter
  ShowtooltiponHover(name) {
    document.getElementById(name.id).style.zIndex = "22";
    this.tooltipForNodes = this.fortooltipofNode(name);
  }
  //to remove tooltip on mouse leave from node
  removeTooltip(name) {
    console.log('this.conted = ', this.contextRef);
    this.isTooltip = false;
    document.getElementById(name.id).style.zIndex = "20";
  }

  //it creates the tooltip div for nodes
  fortooltipofNode(obj) {

    var i = obj.mergedArrayIndex;
    var tooltipStr = "";
    var node = "";
    var nodeColor = "node";

    if (obj.flowPathType == "4")
      nodeColor = "err-page-node";

    if (obj.exceptionCount > 0)
      nodeColor = "err-node";
    var strEndTime = Number(obj.startTimeInMs) + Number(obj.fpDuration);
    if (obj.tierName != '-') {
      tooltipStr += "<b>Tier:</b>&nbsp;" + obj.tierName + "<br/><b>Server</b>:&nbsp;" + obj.serverName + "<br/><b>Instance:</b>&nbsp;" + obj.appName + "<br/> <b>Start Time:</b>&nbsp;" + obj.startDateTime;
      if (obj.cumFpDuration != obj.avgFpDuration) {

        //  node += "<div id='" + obj.id + "' class='" + nodeColor + " window' style='top:" + obj.top + "px; left:" + obj.left + "px;' ondblclick=openPopupTable('" + obj.key + "','" + obj.backendType + "','" + obj.depth + "','" + obj.urlName + "','" + obj.sourceId + "','" + obj.instanceType + "','" + obj.urlIndex + "','" + obj.id + "')>";
        if (Number(obj.cumFpDuration) == 0)
          tooltipStr += "<br/><img src='./assets/images/response_legend.png' class='nodeIcon' >&nbsp;<b>Total Duration:</b>&nbsp; < 1 ms <br/><img src='./assets/images/cumulative.png' width='16' height='16' class='nodeIcon' >&nbsp;<b>Avg.Duration:</b>&nbsp;< 1 ms";
        else
          tooltipStr += "<br/><img src='./assets/images/response_legend.png' class='nodeIcon' >&nbsp;<b>Total Duration:</b>&nbsp;" + Number(obj.cumFpDuration).toLocaleString() + "ms" + "<br/><img src='./assets/images/cumulative.png'  width='16' height='16'  class='nodeIcon' >&nbsp;<b>Avg.Duration:</b>&nbsp;" + Number(obj.avgFpDuration).toLocaleString() + " ";
      }
      else {
        // node += "<div id='" + obj.id + "' class='" + nodeColor + " window' style='top:" + obj.top + "px; left:" + obj.left + "px;'    ondblclick=openPopupTable('" + obj.key + "','" + obj.backendType + "','" + obj.depth + "','" + obj.urlName + "','" + obj.sourceId + "','" + obj.instanceType + "','" + obj.urlIndex + "','" + obj.id + "')>";
        if (Number(obj.avgFpDuration) == 0)
          tooltipStr += "<br/><img src='./assets/images/response_legend.png' class='nodeIcon' >&nbsp;<b>Total Duration:</b>&nbsp;< 1 ms";
        else
          tooltipStr += "<br/><img src='./assets/images/response_legend.png' class='nodeIcon' >&nbsp;<b>Total Duration:</b>&nbsp;" + Number(obj.avgFpDuration).toLocaleString() + "ms";
      }
      tooltipStr += "<br/><b>Percentage:</b>&nbsp;" + Number(obj.percentage).toFixed(1) + " %";

    }
    else if ((obj.id).startsWith("queue")) {
      // node += "<div id='" + obj.id + "' class='node window' style='top:" + obj.top + "px; left:" + obj.left + "px;'>";
      if (obj.mappedAppName != this.encodeHTMLStr(obj.backendActualName)) {
        tooltipStr += "<b>Name:</b>&nbsp;" + obj.mappedAppName + "(" + obj.backendActualName + ")";
      }
      else {
        tooltipStr += "<b>Name:</b>&nbsp;" + obj.backendActualName;
      }

    }
    else {
      // node += "<div id='" + obj.id + "' class='" + nodeColor + " window' style='top:" + obj.top + "px; left:" + obj.left + "px;' ondblclick=openPopupTable('" + obj.key + "','" + obj.backendType + "','" + obj.depth + "','" + obj.url + "','" + obj.sourceId + "','" + obj.instanceType + "','" + obj.urlIndex + "','" + obj.id + "')>";
      if (obj.mappedAppName != this.encodeHTMLStr(obj.backendActualName) && obj.mappedAppName != '-') {
        //node += "<div id='"+obj.id+"' class='node window' style='top:"+obj.top+"px; left:"+obj.left+"px;'  ondblclick=openPopupTable('"+obj.key+"','"+obj.backendType+"','"+obj.depth+"','"+obj.url+"','"+sourceId+"','"+obj.instanceType+"','"+obj.urlIndex+"','"+obj.id+"')>";
        tooltipStr += "<b>Name:</b>&nbsp;" + obj.mappedAppName + "(" + obj.backendActualName + ")";
      }
      else if (obj.mappedAppName == '-') {
        console.log('coming for tool tip', obj);
        let objForReplacement
        this.dataToDraw.forEach((val, index) => {
          if (val.id == obj.sourceId) {
            objForReplacement = this.dataToDraw[index]
          }
        });

        tooltipStr += "<b>Tier:</b>&nbsp;" + objForReplacement.tierName + "<br/><b>Server</b>:&nbsp;" + objForReplacement.serverName + "<br/><b>Instance:</b>&nbsp;" + objForReplacement.appName + "<br/>";
      }
      else {
        // node += "<div id='"+obj.id+"' class='node window' style='top:"+obj.top+"px; left:"+obj.left+"px;' ondblclick=openPopupTable('"+obj.key+"','"+obj.backendType+"','"+obj.depth+"','"+obj.url+"','"+sourceId+"','"+obj.instanceType+"','"+obj.urlIndex+"','"+obj.id+"')>";
        tooltipStr += "<b>Name:</b>&nbsp;" + obj.backendActualName;
      }
    }
    return tooltipStr
  }
  //This method is used to encode HTML characters
  encodeHTMLStr(str) {
    var returnString = "";
    if (str != undefined && str != "")
      returnString = str.toString().replace(/&#044;/g, ",").replace(/&#58;/g, ":").replace(/&#46;/g, ".").replace(/&#010;/g, "\n").replace(/&#039;/g, "\'")
        .replace(/&#034;/g, "\"").replace(/&#092;/g, "\\").replace(/&#124;/g, "|").replace(/&#123;/g, "{").replace(/&#125;/g, "}").replace(/&#126;/g, "~").replace(/&#11/g, "").replace(/&#12/g, "");

    return returnString;
  }


  // headingForNodes: string = "";
  generateNodeheading(obj) {
    if (obj.mappedAppName != this.encodeHTMLStr(obj.backendActualName) && obj.mappedAppName != '-') {
      //do nothing 
      return;
    }
    else if (obj.mappedAppName == '-') {
      let objForReplacement
      this.dataToDraw.forEach((val, index) => {
        if (val.id == obj.sourceId) {
          objForReplacement = this.dataToDraw[index]
        }
      });
      //this is to replace  the  the heading of node in this specila case
      let parentElement = document.getElementById(obj.id);
      let headingElemnet = parentElement.lastElementChild;
      headingElemnet.innerHTML = "<div class='nodeRight'>" + "<div style='text-align: center;color: #0c5207;font-weight: bold;font-size: 10px;padding-top: 11px;width: 185px;height:20px;'> " + objForReplacement.serverName + ":" + objForReplacement.mappedAppName + "</div>" + "<div style='text-align: center;margin-top:6px;font-size: 10px;width:183px;'>" + "</div></div>"
    }
    else {
      return;
    }

  };

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

  /*Method is used get host url*/
  getHostUrl(): string {
    var hostDcName;
    if (this._ddrData.isFromtrxFlow) {
      hostDcName = "//" + this._ddrData.hostTr + ":" + this._ddrData.portTr;
      this.urlParam.testRun = this._ddrData.testRunTr;
      //   return hostDCName;
    }
    else {
      hostDcName = this._ddrData.getHostUrl();
      // if (this._navService.getDCNameForScreen("trxFlow") === undefined)
      //   hostDcName = this._cavConfigService.getINSPrefix();
      // else
      //   hostDcName = this._cavConfigService.getINSPrefix() + this._navService.getDCNameForScreen("trxFlow");

      // if (hostDcName.length > 0) {
      //   sessionStorage.removeItem("hostDcName");
      //   sessionStorage.setItem("hostDcName", hostDcName);
      // }
      // else
      //   hostDcName = sessionStorage.getItem("hostDcName");
    }
    console.log('hostDcName =', hostDcName);
    return hostDcName;
  }


  /* Auto Instrumentation DDAI */
  openAutoInstDialog() {
    console.log('this.flowmapData.paramsForFlowMap>>>>>>>>>>>>****', this.flowmapData.paramsForFlowMap);

    let testRunStatus;
    let instanceType;
    let url = this.getHostUrl() + '/' + this.urlParam.product + '/v1/cavisson/netdiagnostics/ddr/getTestRunStatus?testRun=' + this.urlParam.testRun;
    //console.log('url *** ', url);
    this.ddrRequest.getDataUsingGet(url).subscribe(res => {
      // console.log("data for tr status === " , res);
      testRunStatus = <any>res;
      testRunStatus = testRunStatus.data;
      if (testRunStatus.length != 0) {
        this.showAutoInstrPopUp = true;
        if (this.flowmapData.paramsForFlowMap.Instance_Type.toLowerCase() == 'java')
          instanceType = 'Java';
        else if (this.flowmapData.paramsForFlowMap.Instance_Type.toLowerCase() == 'dotnet')
          instanceType = 'DotNet';

        this.argsForAIDDSetting = [this.flowmapData.paramsForFlowMap.appName, this.flowmapData.paramsForFlowMap.appId, instanceType, this.flowmapData.paramsForFlowMap.tierName,
        this.flowmapData.paramsForFlowMap.serverName, this.flowmapData.paramsForFlowMap.serverId, "-1", this.flowmapData.paramsForFlowMap.urlName, "DDR", testRunStatus[0].status, this.urlParam.testRun];
        console.log('this.argsForAIDDSetting>>>>>>>>>>>>****', this.argsForAIDDSetting);
      }
      else {
        this.showAutoInstrPopUp = false;
        alert("Could not start instrumentation, test is not running")
        return;
      }
    });
  }

  startInstrumentation(result) {
    this.showAutoInstrPopUp = false;
    alert(result);
  }

  closeAIDDDialog(isCloseAIDDDialog) {
    this.showAutoInstrPopUp = isCloseAIDDDialog;
  }


  createColumnArray(...argument) {
    let columnobj = [];
    for (let i = 0; i < argument.length; i++) {

      columnobj[i] = { field: argument[i], header: this.returnHeader(argument[i]), Width: this.colWidth, colAlignment: this.colAlignment, sortable: this.sortable, action: this.returnAction(argument[i]) };
    }
    console.log(columnobj);
    return columnobj;
  }
  objofCurrentnode
  //to dispaly the table on db click on nodes
  showDialogTable(obj) {
    this.drilInfoData = obj;
    this.popupFilter = '';
    this.popupFooter = '';
    this.popupTitle = ' ';
    this.CommonServices.loaderForDdr = true;
    let objForTable = obj;
    this.objofCurrentnode = obj;
    this.transactionTableArray = [];
    this.popupTitle = "";
    //jsonData = this.flowmapData.jsondataforTable;
    //var backendInfo = this.nodeTabledataService.getSourceDetails(obj.sourceId, obj.passedURL, obj.urlIndex, obj.id);
    //this.nodeTabledataService.showPopupFilters(backendInfo);

    let backENDType = this.flowmapData.getBackendType(obj.key, obj.backendType);
    let columns = [];
    this.col = this.createColumnArray('URL', 'Min', 'Max', 'Average', 'Count');
    let statusCodeIndex;
    console.log("backENDType", backENDType, obj.instanceType, obj.backend);
    this.showClipboard = false;
    if (backENDType == 3 || backENDType == 6)//3-coherence 5-memcache 6-cloudant
    {
      this.col = this.createColumnArray('Call', 'Min', 'Max', 'Average', 'Count');
      statusCodeIndex = -1;
      this.popupTitle = "Coherence Call Stats";
    }

    else if (backENDType == 5) //5-memcache 
    {
      this.col = this.createColumnArray('Call', 'Min', 'Max', 'Average', 'Count');
      statusCodeIndex = -1;
      this.popupTitle = "Memcache Call Stats";

    }
    else if (backENDType == 2 || backENDType == 10 || backENDType == 15 || backENDType == 16 || backENDType == 18 || backENDType == 19 || backENDType == 25) {
      this.col = this.createColumnArray('Query', 'Min', 'Max', 'Average', 'Count', 'ExecutionTime', 'errorCount', 'totalTime');
      // console.log("db columnnn",this.col);
      statusCodeIndex = 8;
      this.showClipboard = true;
      this.popupTitle = "DB Requests";


    }
    else if (backENDType == 22) {
      this.col = this.createColumnArray('Command', 'Min', 'Max', 'Average', 'Count', 'ExecutionTime', 'errorCount', 'statusCODE');
      // console.log("db columnnn",this.col);
      statusCodeIndex = 7;
      this.popupTitle = "FTP Commands";

    }
    else if (backENDType == 9) {
      this.col = this.createColumnArray('Query', 'Min', 'Max', 'Average', 'Count', 'errorCount');
      statusCodeIndex = 6;
      this.popupTitle = "Cassandra DB Request Tracing";
    }
    else if (obj.instanceType == 'backend' && obj.backendType == 'HTTP') {
      this.col = this.createColumnArray('URL', 'Min', 'Max', 'Average', 'Count', 'errorCount', 'statusCODE');
      statusCodeIndex = 6;
      this.popupTitle = "Call Stats";
    }
    else if (obj.instanceType == 'backend' || backENDType == 23 || backENDType == 24 || backENDType == 26 || backENDType == 11 || backENDType == 12 || backENDType == 13 || backENDType == 14) {
      this.col = this.createColumnArray('Min', 'Max', 'Average', 'Count', 'errorCount', 'stat0usCODE');
      statusCodeIndex = 5;
      this.popupTitle = "Call Stats";
    }

    /* else if(queueName != undefined)  //jms queues
     {
        this.col = ['URL','StartTime','Duration','FPInstance','CorrID','CpuTime','errorCount','statusCODE']; 
            statusCodeIndex = 7; 
    }*/
    else if (backENDType == 1 || obj.passedurl != '-') {
      this.col = this.createColumnArray('URL', 'StartTime', 'Duration', 'FPInstance', 'CorrID', 'CpuTime', 'errorCount', 'statusCODE', 'gcpause', 'Action');
      statusCodeIndex = 7;
      this.popupTitle = "Transaction Tracing Detail";
      //jQuery("#ui-dialog-title-popupTable").html("<b>FlowPaths</b>");
    }
    else {
      this.col = this.createColumnArray('backendType', 'backendSubType', 'Min', 'Max', 'Average', 'Count');
      this.popupTitle = "Transaction Tracing Detail";

    }
    let urlDb = sessionStorage.getItem('ipWithProd');
    var flag = 0;
    this.nodeTabledataService.getIndividualGroupedInfo(obj.backendType, obj.depth, obj.key, this.flowmapData.transactionDataList, sessionStorage.getItem('dashboardTestRun'), this.flowmapData.hosturl || urlDb)
      .then((json: any) => {
        console.log("getIndividualGroupedInfo", JSON.stringify(json));
        if (backENDType == 23 || backENDType == 24 || backENDType == 26 || backENDType == 11 || backENDType == 12 || backENDType == 13 || backENDType == 14) {
          json = json.splice(0, 1)
        }
        var data = [];
        if (!JSON.stringify(json).includes("gcpause")) {
          this.col.splice(8, 1);
        }
        for (let j = 0; j < json.length; j++) {
          /*  if(json[j].url && json[j].url.startsWith("JMSC")){
              json[j].url = json[j].url.substring(5,json[j].url.length);
              json[j].urlQueryParmStr = json[j].urlQueryParmStr.substring(5,json[j].urlQueryParmStr.length);
              console.log(" json[j].url " ,json[j].url)
            }
            else if(json[j].urlName && json[j].urlName.startsWith("JMSC")){
              json[j].urlName = json[j].urlName.substring(5,json[j].urlName.length);
              json[j].urlQueryParmStr = json[j].urlQueryParmStr.substring(5,json[j].urlQueryParmStr.length);
              console.log(" json[j].urlName " ,json[j].urlName)
            } */
          if (json[j].statusCODE != "" && json[j].statusCODE != undefined && json[j].statusCODE != "-" && json[j].statusCODE != "0" && json[j].statusCODE != "NaN")
            flag = flag + 1;

          var obj = {};
          obj['ExecutionTime'] = (json[j].avg * json[j].count).toFixed(2);
          if (json[j].min < 0)
            json[j].min = 0;
          if (json[j].max < 0)
            json[j].max = 0;
          if (json[j].avg < 0)
            json[j].avg = 0;
          if (json[j].flowPathInstance < 0)
            json[j].flowPathInstance = 0;
          if (backENDType == 3 || backENDType == 5 || backENDType == 6) {
            if (isNaN(Number(json[j].avg))) {
              continue;
            }
            if (json[j].backendSubType == "") {
              obj['Call'] = + json[j].backendSubType + "'>" + "get0() or fetch0()"
            }
            else
              obj['Call'] = json[j].backendSubType;
            obj['Min'] = json[j].min;
            obj['Max'] = json[j].max;
            obj['Average'] = Number(json[j].avg).toFixed(2);
            if (json[j].count != undefined)
              obj['Count'] = json[j].count.toLocaleString();

            data.push(obj);
            this.popupFooter = 'Minimu Execution Time = ' + json[j].min;
            this.popupFilter = '';

          }
          else if (backENDType == 2 || backENDType == 10 || backENDType == 15 || backENDType == 16 || backENDType == 18 || backENDType == 19 || backENDType == 25) {
            obj['Query'] = json[j].backendQuery;

            obj['Min'] = json[j].min;
            obj['Max'] = json[j].max;
            obj['Average'] = Number(json[j].avg).toFixed(2);
            /*if(json[j].backendName !=undefined )
           obj.Backend = "<span  title = '"+json[j].backendName+"'>"+json[j].backendName+"</span>";*/
            if (json[j].count != undefined)
              obj['Count'] = json[j].count.toLocaleString();

            if (json[j].errorCount > 0 && json[j].errorCount != undefined)
              obj['errorCount'] = Number(json[j].errorCount);
            else
              obj['errorCount'] = " 0";

            obj['statusCODE'] = json[j].statusCODE;

            obj['totalTime'] = (Number(json[j].avg) * Number(json[j].count)).toFixed(2);

            console.log(obj);
            data.push(obj);
            if (j == 0)
              this.popupFooter = 'Query : ' + json[j].backendQuery;

            this.popupFilter = '';


          }
          else if (backENDType == 22) {
            obj['Command'] = json[j].backendQuery;

            obj['Min'] = json[j].min;
            obj['Max'] = json[j].max;
            obj['Average'] = Number(json[j].avg).toFixed(2);
            /*if(json[j].backendName !=undefined )
           obj.Backend = "<span  title = '"+json[j].backendName+"'>"+json[j].backendName+"</span>";*/
            if (json[j].count != undefined)
              obj['Count'] = json[j].count.toLocaleString();

            if (json[j].errorCount > 0 && json[j].errorCount != undefined)
              obj['errorCount'] = Number(json[j].errorCount);
            else
              obj['errorCount'] = " 0";

            obj['statusCODE'] = json[j].statusCODE;
            console.log(obj);
            data.push(obj);
            if (j == 0)
              this.popupFooter = 'Command : ' + json[j].backendQuery;

            this.popupFilter = '';
          }
          else if (backENDType == 9) {
            obj['Query'] = json[j].backendQuery;
            obj['Min'] = json[j].min;
            obj['Max'] = json[j].max;
            obj['Average'] = Number(json[j].avg).toFixed(2);
            obj['Count'] = json[j].count;
            if (json[j].errorCount > 0 && json[j].errorCount != undefined)
              obj['errorCount'] = Number(json[j].errorCount);
            else
              obj['errorCount'] = "0";
            obj['statusCODE'] = json[j].statusCODE;
            data.push(obj);
            if (j == 0)
              this.popupFooter = 'Query : ' + json[j].backendQuery;

            this.popupFilter = '';

          }
          else if (objForTable.instanceType == 'backend' && backENDType == 1) {
            obj['URL'] = json[j].resourceName;
            obj['Min'] = json[j].min;
            obj['Max'] = json[j].max;
            obj['Average'] = Number(json[j].avg).toFixed(2);

            /*if(json[j].backendName !=undefined )
           obj.Backend = "<span title = '"+json[j].backendName+"'>"+json[j].backendName+"</span>";*/
            obj['Count'] = json[j].count;
            if (json[j].errorCount > 0 && json[j].errorCount != undefined)
              obj['errorCount'] = Number(json[j].errorCount);
            else
              obj['errorCount'] = "0";
            obj['statusCODE'] = json[j].statusCODE;
            data.push(obj);
            if (j == 0 && json[j].resourceName != '-') {
              this.popupFooter = 'URL = ' + json[j].resourceName;
            }
            else if (j == 0) {
              this.popupFooter = 'Minimum Execution Time = ' + json[j].min;
            }
            this.setpopupFilter();

          }
          else if (objForTable.instanceType == 'backend' || backENDType == 23 || backENDType == 24 || backENDType == 26 || backENDType == 11 || backENDType == 12 || backENDType == 13 || backENDType == 14) {
            obj['Min'] = json[j].min;
            obj['Max'] = json[j].max;
            obj['Average'] = Number(json[j].avg).toFixed(2);

            /*if(json[j].backendName !=undefined )
           obj.Backend = "<span title = '"+json[j].backendName+"'>"+json[j].backendName+"</span>";*/
            obj['Count'] = json[j].count;
            if (json[j].errorCount > 0 && json[j].errorCount != undefined)
              obj['errorCount'] = Number(json[j].errorCount);
            else
              obj['errorCount'] = "0";
            obj['statusCODE'] = json[j].statusCODE;
            data.push(obj);
            if (j == 0)
              this.popupFooter = 'Minimum Execution Time = ' + json[j].min;
            this.setpopupFilter();

          }
          /* else if( queueName != undefined)
           {
                popupTitle = "<b>Queue:&nbsp&nbsp</b>" +queueName ;
               
                obj.URL = "<span  title = '"+json[j].URL+"'>"+json[j].URL+"</span>"; 
                 if(json[j].min != undefined && json[j].min != "")
                  obj.Min = Number(json[j].min);
                 if(json[j].max != undefined && json[j].max != "")
                  obj.Max = Number(json[j].max).toLocaleString();
                  obj.Average=Number(json[j].avg).toFixed(2);
                 
                  obj.FPInstance = json[j].flowPathInstance;
                  obj.StartTime = json[j].startTime;
                  obj.Duration = json[j].fpDuration.toLocaleString();
                  obj.CorrID = json[j].correlationid;
                  obj.CpuTime = Math.round(json[j].btcputime);
                  obj.URL = "<span  title = '"+json[j].urlQueryParmStr+"'>"+json[j].urlQueryParmStr+"</span>";
                  var strEndTime = Number(json[j].startTimeInMs) + Number(json[j].fpDuration);
              
                  if(json[j].errorCount > 0 && json[j].errorCount != undefined)    
                    obj.errorCount= Number(json[j].errorCount).toLocaleString();
                  else
                   obj.errorCount="0&nbsp;";
                  
                  if(json[j].count != undefined && json[j].count != "" )
                    obj.Count =Number(json[j].count).toLocaleString();
                  data.push(obj);
               } */
          else if (backENDType == 1 || objForTable.passedURL != '-') {
            this.popupTitle = "FlowPaths " + "( " + "Tier: " + json[j].tierName + ", " + "Server: " + json[j].serverName + ", " + "Instance : " + json[j].appName + " )";



            // jQuery("#ui-dialog-title-popupTable").html("<b>FlowPaths&nbsp&nbsp</b>" +"( " +"<b>Tier: </b>" +json[j].tierName + "<b>&nbsp&nbspServer: </b>"+json[j].serverName +"<b>&nbsp&nbspInstance : </b>" +json[j].appName +" )");
            obj['URL'] = json[j].url;
            if (json[j].min != undefined && json[j].min != "")
              obj['Min'] = Number(json[j].min);
            if (json[j].max != undefined && json[j].max != "")
              obj['Max'] = Number(json[j].max).toLocaleString();
            obj['Average'] = Number(json[j].avg).toFixed(2);
            /*  obj.Tier = json[j].tierName;
             obj.Server = json[j].serverName;
             obj.Instance = json[j].appName; */
            obj['FPInstance'] = json[j].flowPathInstance;
            obj['StartTime'] = json[j].startTime;
            obj['Duration'] = json[j].fpDuration.toLocaleString();
            if (json[j].gcpause == "1")
              obj['gcpause'] = "Yes";
            else
              obj['gcpause'] = "No";
            if (json[j].correlationid != undefined)
              obj['CorrID'] = json[j].correlationid;
            else
              obj['CorrID'] = "-";
            obj['CpuTime'] = Math.round(json[j].btcputime);
            obj['URL'] = json[j].urlQueryParmStr;
            var strEndTime = Number(json[j].startTimeInMs) + Number(json[j].fpDuration);
            if (json[j].errorCount > 0 && json[j].errorCount != undefined)
              obj['errorCount'] = Number(json[j].errorCount);
            else
              obj['errorCount'] = "0";
            obj['statusCODE'] = json[j].statusCODE;

            data.push(obj);
            if (j == 0)
              this.popupFooter = 'URL = ' + json[j].url;

            this.popupFilter = '';

          }
          else {
            //col = ['BackendType', 'BackendSubType', 'Min','Max', 'Average', 'Count'];
            obj['BackendType'] = json[j].backendType + "'>" + json[j].backendType;
            if (json[j].backendSubType != undefined)
              obj['BackendSubType'] = json[j].backendSubType + "'>" + json[j].backendSubType;
            obj['Min'] = json[j].min;
            obj['Max'] = json[j].max;
            obj['Average'] = Number(json[j].avg).toFixed(2);

            /*if(json[j].backendName !=undefined )
              obj.Backend = "<span title = '"+json[j].backendName+"'>"+json[j].backendName+"</span>";*/

            obj['Count'] = json[j].count;
            data.push(obj);
            if (j == 0)
              this.popupFooter = 'Minimum Execution Time = ' + json[j].min;

            this.popupFilter = '';

          }
        }
        if (flag == 0 && statusCodeIndex != -1) {
          this.col.splice(statusCodeIndex, 1);
        }
        if (data[0] != undefined && data[0].FPInstance != undefined)
          this.col.splice(3, 3);

        this.tableDialogDisplay = true;
        this.tableDialogDisplay1 = false;
        this.singleMergeGraph = false;
        this.displaySamplePopup = false;
        this.dbCalloutDetails = data;
        setTimeout(() => {
          console.log("data for table", this.col, data);
          this.createTable(this.col, data);
        }, 200)
      });

    this.CommonServices.loaderForDdr = false;
  }



  dbCalloutDetails = [];
  colWidth = "";
  colAlignment = "";
  sortable = "false";
  sortField = "";
  returnHeader(col) {
    if (col == 'Min' || col == 'Max') {
      col = col + " (ms)";//Name to be displayed as header
      this.colWidth = "60";
      this.colAlignment = "right";
      this.sortable = "true";

    }
    else if (col == 'ExecutionTime') {
      col = "Execution Time (ms)";//Name to be displayed as header
      this.colWidth = "90";
      this.colAlignment = "right";
      this.sortable = "custom";
      // this.sortField = "ExecutionTime";
    }
    else if (col == 'Average') {
      col = col + " (ms)";//Name to be displayed as header
      this.colWidth = "65";
      this.colAlignment = "right";
      this.sortable = "custom";
      this.sortField = "Average";
    }
    else if (col == 'Count') {
      col = "count(s)";//Name to be displayed as header    
      this.colWidth = "50";
      this.colAlignment = "right";
      this.sortable = "custom";
      //   this.sortField = "Count";
    }
    else if (col == 'call') {
      col = "Call Type";//Name to be displayed as header    
      this.colWidth = "50";
      this.sortable = "true";
    }
    else if (col == 'Query') {
      col = "Query   ";//Name to be displayed as header    
      this.colWidth = "255";
      this.colAlignment = "left";
      this.sortable = "false";
    }
    else if (col == 'Command') {
      col = "Command   ";//Name to be displayed as header
      this.colWidth = "240";
      this.colAlignment = "left";
      this.sortable = "false";
    }
    else if (col == 'gcpause') {
      col = "GC Pause";//Name to be displayed as header    
      this.colWidth = "30";
      this.colAlignment = "right";
      this.sortable = "custom";
      //   this.sortField = "Count";
    }

    /*  else if(col == 'Tier')
     {
    col = "Tier";//Name to be displayed as header    
     this.colWidth = 200;
     }
     else if(col == 'Server')
     {
    col = "Server";//Name to be displayed as header    
     this.colWidth = 200;
     }
     else if(col == 'Instance')
     {
    col = "Instance";//Name to be displayed as header    
     this.colWidth = 200;
     } */
    else if (col == 'FPInstance') {
      col = "Flowpath ID";//Name to be displayed as header    
      this.colWidth = "105";
      this.colAlignment = "left";
      this.sortable = "true";
    }
    else if (col == 'Duration') {
      col = "Duration(ms)";//Name to be displayed as header    
      this.colWidth = "70";
      this.colAlignment = "right";
      this.sortable = "true";
      // this.sortField = "Duration";
    }
    else if (col == 'StartTime') {
      col = "Start Time";//Name to be displayed as header    
      this.colWidth = "100";
      this.sortable = "custom";
    }
    else if (col == 'URL') {
      col = "url";//Name to be displayed as header    
      this.colWidth = "200";
      this.colAlignment = "left";
      this.sortable = "true";
    }
    else if (col == 'CpuTime') {
      col = "CPU Time(ms)";//Name to be displayed as header    
      this.colWidth = "64";
      this.colAlignment = "right";
      this.sortable = "true";
    }
    else if (col == 'CorrID') {
      col = "CorrID";//Name to be displayed as header    
      this.colWidth = "90";
      this.sortable = "true";
    }
    else if (col == 'Action') {
      col = "Action";//Name to be displayed as header    
      this.colWidth = "70";
      this.sortable = "false";
    }
    else if (col == 'errorCount') {
      col = "Error Count(s)";//Name to be displayed as header   
      this.colWidth = "75";
      this.sortable = "true";
    }
    else if (col == 'statusCODE') {
      col = "Status Code(s)";//Name to be displayed as header   
      this.colWidth = "70";
      this.sortable = "true";
    }
    else if (col == 'BackendSubType') {
      // if (json[0].backendSubType != undefined)
      //    col = "Backend Sub Type";
    } else if (col == 'totalTime') {
      col = 'Total Time(ms)';//Name to be displayed as header    
      this.colWidth = "90";
      this.sortable = "custom";
    } else {
      col = col;//Name to be displayed as header    
      this.colWidth = "90";
      this.sortable = "false";
    }

    return col;
  }

  createTable(columns, data) {
    for (let i = 0; i < data.length; i++) {
      this.transactionTableArray = this.Immutablepush(this.transactionTableArray, data[i]);
    }
  }

  Immutablepush(arr, newEntry) {
    return [...arr, newEntry]
  }
  labelNode = '';
  showHeaderInfo(val) {
    this.labelNode = '';
    if (val.fpDuration || Number(val.avgFpDuration) === 0) {
      let fpDuration = val.fpDuration;
      if (val.avgFpDuration != this.flowmapData.paramsForFlowMap.fpDuration.toString().replace(/,/g, '')) {
        if (Number(this.flowmapData.paramsForFlowMap.fpDuration.toString().replace(/,/g, '')) == 0) {
          this.labelNode = "<b>Tier=</b>" + val.tierName + ",&nbsp;<b>Server=</b>" + val.serverName + ",&nbsp;<b>Instance=</b>" + val.appName + ",&nbsp;<b>BT Type=</b>" + this.getBTCategory(this.flowmapData.paramsForFlowMap.btCatagory) + ",&nbsp;<b>Start Time=</b>" + val.startDateTime + ",&nbsp;<b>Response Time=</b>< 1(ms) ,&nbsp;<b>Entry Response Time=</b>< 1(ms) </label>";
          this.headerInfo = "Tier=" + val.tierName + ", Server=" + val.serverName + ", Instance=" + val.appName + ", BT Type=" + this.getBTCategory(this.flowmapData.paramsForFlowMap.btCatagory) + ", Start Time=" + val.startDateTime + ", Response Time=< 1(ms), Entry Response Time=< 1(ms)";
        }
        else {
          this.labelNode = "<b>Tier=</b>" + val.tierName + ",&nbsp;<b>Server=</b>" + val.serverName + ",&nbsp;<b>Instance=</b>" + val.appName + ",&nbsp;<b>BT Type=</b>" + this.getBTCategory(this.flowmapData.paramsForFlowMap.btCatagory) + ",&nbsp;<b>Start Time=</b>" + val.startDateTime + ",&nbsp;<b>Response Time=</b>" + this.flowmapData.paramsForFlowMap.fpDuration + "&nbsp;(ms) ,&nbsp;<b>Entry Response Time=</b>" + Number(Math.round(val.avgFpDuration)).toLocaleString() + "&nbsp;(ms) </label>";
          this.headerInfo = "Tier=" + val.tierName + ", Server=" + val.serverName + ", Instance=" + val.appName + ", BT Type=" + this.getBTCategory(this.flowmapData.paramsForFlowMap.btCatagory) + ", Start Time=" + val.startDateTime + ", Response Time=" + this.flowmapData.paramsForFlowMap.fpDuration + "(ms), Entry Response Time=" + Number(Math.round(val.avgFpDuration)).toLocaleString() + "(ms)";
        }
      }
      else {
        if (Number(val.avgFpDuration) == 0) {
          this.labelNode = "<b>Tier=</b>" + val.tierName + ",&nbsp<b>;Server=</b>" + val.serverName + ",&nbsp;<b>Instance=</b>" + val.appName + ",&nbsp;<b>BT Type=</b>" + this.getBTCategory(this.flowmapData.paramsForFlowMap.btCatagory) + ",&nbsp;<b>Start Time=</b>" + val.startDateTime + ",&nbsp;<b>Response Time=</b>< 1(ms) </label>";
          this.headerInfo = "Tier=" + val.tierName + ", Server=" + val.serverName + ", Instance=" + val.appName + ", BT Type=" + this.getBTCategory(this.flowmapData.paramsForFlowMap.btCatagory) + ", Start Time=" + val.startDateTime + ", Response Time=< 1(ms)";
        }
        else {
          this.labelNode = "<b>Tier=</b>" + val.tierName + ",&nbsp;<b>Server=</b>" + val.serverName + ",&nbsp;<b>Instance=</b>" + val.appName + ",&nbsp;<b>BT Type=</b>" + this.getBTCategory(this.flowmapData.paramsForFlowMap.btCatagory) + ",&nbsp;<b>Start Time=</b>" + val.startDateTime + ",&nbsp;<b>Response Time=</b>" + Number(val.avgFpDuration).toLocaleString() + "(ms) </label>";
          this.headerInfo = "Tier=" + val.tierName + ", Server=" + val.serverName + ", Instance=" + val.appName + ", BT Type=" + this.getBTCategory(this.flowmapData.paramsForFlowMap.btCatagory) + ", Start Time=" + val.startDateTime + ", Response Time=" + Number(val.avgFpDuration).toLocaleString() + "(ms)"
        }

      }
      setTimeout(() => {
        var d = document.getElementById('forFilter');
        d.innerHTML = this.labelNode;
      }, 400)
      return true;
    }
    else
      return false;
  }

  getBTCategory(category) {
    if (category === '12') {
      category = 'Very Slow';
    }
    if (category === '11') {
      category = 'Slow';
    }
    if (category === '10') {
      category = 'Normal';
    }
    if (category === '13') {
      category = 'Errors';
    }
    if (category === '0') {
      category = 'Other';
    }
    return category;
  }

  ResponseFormatter(resTime: any) {
    if (Number(resTime) && Number(resTime) > 0) {
      return Number(resTime).toLocaleString();
    }
    if (Number(resTime) == 0) {
      return '< 1';
    } else {
      return resTime;
    }
  }

  returnAction(fieldName) {
    if (fieldName == 'Action') {
      return true
    }
    else {
      return false;
    }
  }

  /**
   * Method to Show Related Graph
   */

  openShowRelatedGraph(objForRouting: any) {
    console.log('rowData-->', objForRouting, '----', this.urlParam);
    console.log('start/end sample', this.startSample, '--**--', this.endSample);
    console.log('again coming');
    try {
      this.headerForSRG = 'Related Graphs (Tier: ' + this.objofCurrentnode.tierName + ', Server: ' + this.objofCurrentnode.serverName + ', Instance: ' + this.objofCurrentnode.appName + ')';
      //this.displayShowRelatedGraph = true;
      let reqData = {};
      let endTimeInMs = 0;
      let startTimeInMS = 0;
      if (this.isFromMain) {
        this.objofCurrentnode = objForRouting;
      }
      if (this.objofCurrentnode != undefined) {
        if (objForRouting.StartTime) {
          let dateForStart = new Date(objForRouting.StartTime);
          startTimeInMS = dateForStart.getTime();
          endTimeInMs = Number(startTimeInMS) + parseInt(objForRouting.Duration.replace(/,/g, ''));

        }
        else {
          startTimeInMS = Number(objForRouting.startTimeInMs);
          endTimeInMs = Number(startTimeInMS) + Number((objForRouting.fpDuration).toString().replace(/,/g, ''));
        }

        let flowpathInstance = objForRouting.flowpathInstance || this.objofCurrentnode.flowpathInstance;
        let urlIndex = this.objofCurrentnode.urlIndex;
        let tierId = this.objofCurrentnode.tierId;
        let tierName = this.objofCurrentnode.tierName;
        let serverId = this.objofCurrentnode.serverId;
        let serverName = this.objofCurrentnode.serverName;
        let appId = this.objofCurrentnode.appId;
        let appName = this.objofCurrentnode.appName;
        let strStartTime = startTimeInMS;
        let strEndTime = endTimeInMs;
        console.log('end time', endTimeInMs)

        let relTierName = tierName;
        let relServerName = serverName;
        let relAppName = appName;
        let relStartTime = objForRouting.startDateTime;
        let vectorName = tierName + ">" + serverName + ">" + appName;
        console.log('sample----', this.startSample, '***', this.endSample)
        let ajaxurl = this.getHostUrl() + "/DashboardServer/view/TierInfo.jsp?GRAPH_KEY=" + this.urlParam.strGraphKey + "&reqTestRunNum=" + this.urlParam.testRun +
          "&sessLoginName=netstorm&valueType=average&requestType=edRelatedTableData&reqVecName=" + vectorName +
          "&startDT=" + objForRouting.startDateTime + "&resTime=" + objForRouting.fpDuration + "&startSample=" + this.startSample + "&endSample=" + this.endSample;
        console.log('url___]:', ajaxurl);
        this.ddrRequest.getDataInStringUsingGet(ajaxurl).subscribe(data => {
          let relatedGraphJSON = JSON.parse(data);
          let parts = (relatedGraphJSON.edRelatedGraphData[0].name).replace(/\-/, '&').split('&');
          if (relatedGraphJSON.edRelatedGraphData.length == 0) {
            this.displayShowRelatedGraph = false;
            this.tableDialogDisplay1 = false;
            alert(" There is no related graph in -" + this.urlParam.testRun);
            return 0;
          } else if (relatedGraphJSON.edRelatedGraphData.length == 1 && parts[1].trim() == vectorName) {
            this.displayShowRelatedGraph = false;
            this.tableDialogDisplay1 = false;
            alert(" There is no related graph in - " + this.urlParam.testRun);
            // this.displayShowRelatedGraph = false;
            return 0;
          }
          this.displayShowRelatedGraph = true;
          this.graphJson = relatedGraphJSON;
          var total = relatedGraphJSON.edRelatedGraphData.length;

          var obj = { "total": total, "start": 0, "end": 8, "type": "relatedGraphs" };
          if (total < 9) {
            obj.end = total;
            this.graphMessage = 'Showing 1 to ' + obj.end + ' Graphs out of ' + total + ' Graphs';
          } else {
            this.graphMessage = 'Showing 1 to 9 Graphs out of ' + total + ' Graphs';
          }
          let start = obj.start;
          let end = obj.end;
          jQuery("#secondDiv").hide();
          let flag = false;
          jQuery("#next").on('click', function () {
            flag = true;
            if (total > 9) {
              jQuery("#firstDiv").hide();
              jQuery("#secondDiv").show();
            }
          });
          jQuery("#prev").on('click', function () {
            console.log('inside this---')
            if (flag === true && total > 9) {
              jQuery("#firstDiv").show();
              jQuery("#secondDiv").hide();
            }
          });
          let graphData = [];
          graphData = relatedGraphJSON['edRelatedGraphData'];
          console.log('grapghdata---', relatedGraphJSON);
          // console.log('par******', graphData)
          // let parts = (relatedGraphJSON.edRelatedGraphData[0].name).replace(/\-/, '&').split('&');
          // console.log('parts-', parts)


          console.log('tableData----', relatedGraphJSON.edRelatedTableData);
          if (relatedGraphJSON.edRelatedTableData.length !== 0) {
            // this.tableDialogDisplay1 = true;
            this.graphTableArray = relatedGraphJSON.edRelatedTableData;
            if (this.graphTableArray.length > 4) {
              this.tabularViewPopUpHeight = 300;
            } else {
              this.tabularViewPopUpHeight = 150;
            }
          }

          let getGraphIndex = function (graphName) {
            var idx = -1;
            relatedGraphJSON.edRelatedGraphData.forEach((val, index) => {
              if (val.name == graphName) {
                idx = index;
              }
            })
            return idx;
          };

          let graphArr = [];
          let graphArr1 = [];
          let count = 0;
          console.log('eddata----', relatedGraphJSON.edRelatedTableData)
          relatedGraphJSON.edRelatedTableData.forEach((val, index) => {
            let name = val.graphName;
            let obj = {};
            // console.log('********', name);
            obj['graphName'] = name;
            obj['grapghIndex'] = getGraphIndex(name);
            obj['tierName'] = tierName;
            obj['serverName'] = serverName;
            obj['appName'] = appName;
            obj['startTime'] = relStartTime;
            obj['fpDuration'] = objForRouting.fpDuration;
            obj['KPIDuration'] = encodeURIComponent(val.graphUniqueKeyDTO);
            obj['startSample'] = this.startSample;
            obj['endSample'] = this.endSample;
            obj['ndeId'] = objForRouting.ndeId;
            count += 1;
            // console.log('OBJ----------', obj, count)
            if (total > 9) {
              if (!(count >= 10)) {
                graphArr.push(obj);
              } else {
                graphArr1.push(obj);
              }
            } else {
              graphArr.push(obj);
            }
            // console.log('grapharr---', graphArr);
          })
          console.log('final arr--', graphArr.length, graphArr1.length)
          for (var i = 0; i < total; i++) {
            // this.cretaeChart();
          }
          this.grapghData = graphArr;
          this.graphData = graphArr1;


        });
      }
    } catch (error) {

    }
  }

  saveChart(chartInstance) {
    this.chart = chartInstance;
  }

  /**
   * Popup For setting Samples before and after flowpath
   */

  openSamplePopUp() {
    console.log('rowData----', this.objofCurrentnode);
    // startTime, fpDuration, tierName, serverName, appName, flowpathinstance,ndeId
    this.displaySamplePopup = true;
  }

  applySamplePopUp() {
    console.log('updated Samples', this.startSample, '----', this.endSample)
    this.openShowRelatedGraph(this.objofCurrentnode);
    this.displaySamplePopup = false;
  }

  /**
   * apply default Value on Reset of Sample Time 
   */
  applyDefaultValue() {
    this.startSample = '5';
    this.endSample = '5'
  }

  /**
   * Open All Graphs Case
   */
  openAllGraphs() {
    console.log('inside All Graphs case-------')
    if (this.graphTableArray.length !== 0) {
      this.displayShowRelatedGraph = true
    }
  }

  validateQty(event) {

  }

  /**
   * open Single Graph
   */
  openSingleGraph(rowData: any, graphType: string) {
    this.singleMergeGraph = true;
    console.log('data---->?', rowData)
    console.log('jsondata', this.graphJson, '==', this.grapghData);
    var mainJson = this.graphJson;
    var index = "";
    var appName = "";
    var enableLegend = false;
    if (graphType === 'single') {
      console.log('grapghname', rowData.graphName);
      this.grapghData.forEach((val, idx) => {
        console.log(val.graphName);
        if (rowData.graphName === val.graphName) {
          index = val.grapghIndex;
          appName = val.appName
        }
      });
      console.log('index---', index);
      var length = 0;
      var json = [mainJson.edRelatedGraphData[index]];
      console.log(json);
      var name = json[0].name;
    }



    if (graphType === 'single') {

      var graphUniqueKeyDTO = mainJson.edRelatedTableData[index].graphUniqueKeyDTO;
      let corelName = name.substring(0, name.indexOf("-"));
    } else {
      try {
        json = mainJson.edRelatedGraphData;

        json.forEach((index, val) => {
          if (val['data'] != undefined) {
            length += val['data'].length;
          }
        });
        name = "All Graphs";
        enableLegend = true;
        var startSampleTime = mainJson.edRelatedGraphData[index].data[0][0];
        var endSampleTime = mainJson.edRelatedGraphData[index].data[length - 1][0];
        if (length == 0) {
          alert('No Graph for current Samples!');
          return;
        }
        if (json.length > 0) {
          length = mainJson.edRelatedGraphData[index].data.length;
        }
      } catch (ex) {
        console.log("outer Exp...")
        if (length == 0) {
          alert('No Graph for current Samples!');
          return;

        }
      }

    }

    console.log('Final json and name----', json, '---', name);
    this.options = {
      chart: {
        type: 'spline',
        height: 500,
        width: 570,
        responsive: true,
        zoomType: 'x'
      },
      credits: {
        enabled: false
      },
      title: {
        text: name,
        style: { fontSize: '12px' }
      },
      tooltip: {
        tooltip: {
          formatter: function () {
            return '<b>Time: </b>' + moment.tz(this.x, mainJson['timeZone']).format('MM/DD/YY HH:mm:ss') +
              '<br/ ><b>Value: ' + '</b>' + this.y;
          }
        },
      },
      legend: {
        itemStyle: {
          color: 'rgb(29, 181, 18)',
          fontWeight: 'bold',
          fontSize: '9px'
        },
        itemHoverStyle: {
          color: 'rgb(29, 220, 20)'
        },
        itemDistance: 5,
        padding: 0,
        margin: 0,
        labelFormatter: function () {
          let index = (this.name).indexOf('-');
          if (index !== -1) {
            return (this.name).substring(0, index) + '<br/>' + (this.name).substring(index, (this.name).length);
          } else {
            return this.name;
          }
        },
        enabled: enableLegend
      },
      yAxis: {
        title: {
          text: ''
        },
        min: 0
      },
      xAxis: {
        type: 'time',
        labels: {
          formatter: function () {
            return moment.tz(this.value, mainJson['timeZone']).format('HH:mm:ss');
          },
          style: {
            fontSize: '8px'
          }
        },
        plotBands: [{ // mark the flopath duration #81F822
          color: '#e4f9a6',
          from: mainJson.startTime,
          to: mainJson.endTime
        }]
      },
      series: json
    };

  }


  onhideDialog(event) {
    console.log('event----------', event)
    this.tableDialogDisplay1 = true;
  }

  openMethodTimingReport(objForRouting) {
    this.setIpPort(objForRouting);
    this._ddrData.splitViewFlag = false;
    this.CommonServices.openfptoAggMT = false;
    let reqData = {};
    let endTimeInMs = 0;
    let startTimeInMS = 0;
    if (this.isFromMain) {
      this.objofCurrentnode = objForRouting;
    }
    if (this.objofCurrentnode != undefined) {
      if (objForRouting.StartTime) {

        console.log('(objForRouting.StartTime>>>>', objForRouting.StartTime);
        reqData["Duration"] = objForRouting.Duration.replace(/,/g, '');
        reqData["StartTimeDF"] = objForRouting.StartTime;
      }
      else {
        startTimeInMS = Number(objForRouting.startTimeInMs);
        endTimeInMs = Number(startTimeInMS) + Number((objForRouting.fpDuration).toString().replace(/,/g, ''));
      }

      reqData["flowpathInstance"] = objForRouting.FPInstance || this.objofCurrentnode.flowpathInstance;
      reqData["urlIndex"] = this.objofCurrentnode.urlIndex;
      reqData["tierId"] = this.objofCurrentnode.tierId;
      reqData["tierName"] = this.objofCurrentnode.tierName;
      reqData["serverId"] = this.objofCurrentnode.serverId;
      reqData["serverName"] = this.objofCurrentnode.serverName;
      reqData["appId"] = this.objofCurrentnode.appId;
      reqData["appName"] = this.objofCurrentnode.appName;
      reqData["strStartTime"] = startTimeInMS;
      reqData["strEndTime"] = endTimeInMs;
      console.log('end time', endTimeInMs)
      // reqData["btCatagory"] = this.flowmapData.paramsForFlowMap.btCatagory;
    }
    this.breadcrumbService.parentComponent = CONSTANTS.BREADCRUMB_ITEMS.TRANSACTION_FLOWMAP;
    this.CommonServices.mtData = reqData;
    this.CommonServices.mtFlag = true;
    if (this._router.url.indexOf("/home/ddrCopyLink") != -1)
      this._router.navigate(['/home/ddrCopyLink/methodtiming']);
    else if (this._router.url.indexOf("/home/ED-ddr") != -1)
      this._router.navigate(['/home/ED-ddr/methodtiming']);
    else
    // this._router.navigate(['/home/ddr/methodtiming']);
    this._router.navigate(['/ddr/methodtiming']);
  }

  openDBReports(data) {
    this.setIpPort(data);
    this._ddrData.splitViewFlag = false;
    console.log('data items', this.objofCurrentnode);
    if (this.isFromMain) {
      this.objofCurrentnode = data;
    }
    this.CommonServices.setFPData = this.objofCurrentnode;
    this._ddrData.dbFlag = true;
    this.CommonServices.productName = this.urlParam.product;
    this.CommonServices.testRun = this.urlParam.testRun;
    this.setInStorage(this.objofCurrentnode);
    this.breadcrumbService.parentComponent = CONSTANTS.BREADCRUMB_ITEMS.TRANSACTION_FLOWMAP;
    if (this._router.url.indexOf("/home/ddrCopyLink") != -1)
      this._router.navigate(['/home/ddrCopyLink/flowpathToDB']);
    else if (this._router.url.indexOf("/home/ED-ddr") != -1)
      this._router.navigate(['/home/ED-ddr/flowpathToDB']);
    else
    // this._router.navigate(['/home/ddr/flowpathToDB']);
    this._router.navigate(['/ddr/flowpathToDB']);
  }
  setInStorage(data: any) {
    sessionStorage.removeItem("dbData");
    sessionStorage.removeItem("dbFlag");
    sessionStorage.setItem("dbData", JSON.stringify(data));
    sessionStorage.setItem("dbFlag", "true");
  }
  openHttpReport(objForRouting) {
    this.setIpPort(objForRouting);
    this._ddrData.splitViewFlag = false;
    let reqData = {};
    let endTimeInMs = 0;
    let startTimeInMS = 0;
    if (this.objofCurrentnode != undefined) {
      if (objForRouting && objForRouting.startTimeInMs) {
        startTimeInMS = Number(objForRouting.startTimeInMs);
        endTimeInMs = Number(startTimeInMS) + Number((objForRouting.fpDuration).toString().replace(/,/g, ''));
      }

      reqData["fpInstance"] = objForRouting.FPInstance || this.objofCurrentnode.flowpathInstance;
      reqData["urlIndex"] = this.objofCurrentnode.urlIndex;
      reqData["tierId"] = this.objofCurrentnode.tierId;
      reqData["tierName"] = this.objofCurrentnode.tierName;
      reqData["serverId"] = this.objofCurrentnode.serverId;
      reqData["serverName"] = this.objofCurrentnode.serverName;
      reqData["appId"] = this.objofCurrentnode.appId;
      reqData["appName"] = this.objofCurrentnode.appName;
      reqData["startTimeInMs"] = startTimeInMS;
      reqData["strEndTime"] = endTimeInMs;
      reqData["urlQueryParamStr"] = this.objofCurrentnode.urlQueryParmStr;
      console.log('end time', endTimeInMs)
      // reqData["btCatagory"] = this.flowmapData.paramsForFlowMap.btCatagory;
    }
    this.breadcrumbService.parentComponent = CONSTANTS.BREADCRUMB_ITEMS.TRANSACTION_FLOWMAP;
    this._ddrData.httpData = reqData;
    this.CommonServices.httpData = reqData;
    console.log("There should be reqData for Http report", reqData);
    this.CommonServices.httpFlag = true;
    if (this._router.url.indexOf("/home/ddrCopyLink") != -1)
      this._router.navigate(['/home/ddrCopyLink/httpReqResp']);
    else if (this._router.url.indexOf("/home/ED-ddr") != -1)
      this._router.navigate(['/home/ED-ddr/httpReqResp']);
    else
    // this._router.navigate(['/home/ddr/httpReqResp']);
    this._router.navigate(['/ddr/httpReqResp']);
  }

  mainContextMenu: MenuItem[];
  getNodeDataforRouting(event, obj) {
    if (event.button == 2) {
      this.objofCurrentnode = obj;
      this.drilInfoData = obj;

      setTimeout(() => {
        if (this.flowmapData.netForestURL == undefined || this.flowmapData.netForestURL == null || this.flowmapData.netForestURL == 'undefined' || this.flowmapData.netForestURL == 'NA') {
          if (this.ContextMenuItems.length > 6 && this.ContextMenuItemsForExceeption.length > 7)
            this.ContextMenuItems.splice(4, 2)
          this.ContextMenuItemsForExceeption.splice(5, 2)
        }
        if ((obj.instanceType == 'java' || obj.instanceType == 'dotNet' || obj.instanceType == 'NodeJS' || obj.instanceType == 'php' || obj.instanceType == 'go' || obj.instanceType == 'python') && (obj['exceptionCount'] == 0 || obj['exceptionCount'] == undefined)) {
          this.contextRef.show();
          let nodes = document.getElementById('contextmenu').childNodes;
          let elmHeight = document.getElementById(obj.id).style.top.split('px')[0];
          let elmleft = document.getElementById(obj.id).style.left.split('px')[0];
          // nodes[1]['style'].top = (Number(elmHeight)  + 30) + 'px';
          // nodes[1]['style'].left = (Number(elmleft)  + 30 )+ 'px';
          nodes[0]['style'].top = (Number(elmHeight) + 30) + 'px';
          nodes[0]['style'].left = (Number(elmleft) + 30) + 'px';
          this.mainContextMenu = this.ContextMenuItems
        }
        else if ((obj.instanceType == 'java' || obj.instanceType == 'dotNet' || obj.instanceType == 'NodeJS' || obj.instanceType == 'php' || obj.instanceType == 'go' || obj.instanceType == 'python') && (obj['exceptionCount'] > 0)) {
          this.contextRef.show();
          let nodes = document.getElementById('contextmenu').childNodes;
          let elmHeight = document.getElementById(obj.id).style.top.split('px')[0];
          let elmleft = document.getElementById(obj.id).style.left.split('px')[0];
          // nodes[1]['style'].top = (Number(elmHeight)  + 30) + 'px';
          // nodes[1]['style'].left = (Number(elmleft)  + 30 )+ 'px';
          nodes[0]['style'].top = (Number(elmHeight) + 30) + 'px';
          nodes[0]['style'].left = (Number(elmleft) + 30) + 'px';
          this.mainContextMenu = this.ContextMenuItemsForExceeption
        }
        else {
          return;
        }
      }, 300);
    }

  }
  /**
   * This methos is called when user clicks on the  view thread merge button.
   * 
   * And we created the json for thread merge data as follows: 
   */
  getSelfLoopJsonData() {
    try {
      /**First of all we cloning the main json so that the impact should not be on the main one*/
      this.selfLoppedDataToDraw = JSON.parse(JSON.stringify(this.flowmapData.jsonData));
      /**Here we are making clone object for html view as we need to show less nodes 
       * as compared to original node objects due to self connection nodes
       */
      this.selfLoppedDataToDrawToView = JSON.parse(JSON.stringify(this.flowmapData.jsonData));

      /**Here we making a clone object  for comparission and  maniplation  on json*/
      if (this.selfLoppedDataToDraw) {
        /**Main loop */
        for (let i = 0; i < this.selfLoppedDataToDraw.length; i++) {

          let mainJsonObj = this.selfLoppedDataToDraw[i];
          /**Comparission loop*/
          for (let j = i + 1; j < this.selfLoppedDataToDraw.length; j++) {
            /**Rest manupulate the objects*/
            let compareJsonObj = this.selfLoppedDataToDraw[j];

            /**Buisness logic to create the self loop source and destiation*/
            /**conditions for self loop
             * - App name of both objects must be same.
             * - CalloutType must be 't' of object which is being compared.
             * - SourceId of main object must be same as of  id of  object being compared.
             * - sourceId of main obj must not be same as of source id of compareing object.
             * - In case if appName is '-' and other conditions are true then this object will be egligible for self loop.
              */
            if (mainJsonObj && compareJsonObj && (mainJsonObj.appName == compareJsonObj.appName || compareJsonObj.appName == '-') && compareJsonObj.callOutType == 't' && mainJsonObj.id == compareJsonObj.sourceId && mainJsonObj.sourceId != compareJsonObj.sourceId) {

              /**Here we removing the object from the json which is used for viewing*/
              let indexToRemove = this.getNodeIndex(this.selfLoppedDataToDrawToView, compareJsonObj.id);
              if (this.selfLoppedDataToDrawToView[indexToRemove] && indexToRemove != -1)
                this.selfLoppedDataToDrawToView.splice(indexToRemove, 1);

              /**Chnaging the source id*/
              this.chnageSourceId(this.selfLoppedDataToDraw, compareJsonObj.id, mainJsonObj.id);

              /**Here we giving the parent to the child node*/
              if (this.isSelfObjAlreadyAvail(this.selfLoppedDataToDraw, j, mainJsonObj.id)) {
                this.selfLoppedDataToDraw.splice(j, 1);
                j--;
              }
              else
                compareJsonObj.id = mainJsonObj.id;
            }

          }
        }
        this.showSelfLoop = true;
        let data = this.flowmapData.supportAsync(this.selfLoppedDataToDraw, this.selfLoppedDataToDrawToView);
        this.selfLoppedDataToDraw = data[1];
        this.selfLoppedDataToDrawToView = data[0];
        // this.dataToDraw = this.flowmapData.asyncJsonForNonMergeCase;
        console.log("self data", this.selfLoppedDataToDraw, this.selfLoppedDataToDrawToView)
        setTimeout(() => { this.creteflowmap(this.selfLoppedDataToDraw), 0 });

      } else {
        console.log("Json data is not in proper formate or defined...");
      }

    } catch (err) {
      console.error("Not able to create self loop json because - ", err);
    }
  }

  /**This method is to increase the thread count and giving the value as true and false*/
  isSelfObjAlreadyAvail(selfLoppedDataToDraw, indexToIgnore, idToMatch) {
    try {
      if (selfLoppedDataToDraw) {
        for (let i = 0; i < selfLoppedDataToDraw.length; i++) {
          if (i != indexToIgnore && selfLoppedDataToDraw[i].sourceId == idToMatch && selfLoppedDataToDraw[i].id == idToMatch) {
            selfLoppedDataToDraw[i].count += selfLoppedDataToDraw[indexToIgnore].count;
            selfLoppedDataToDraw[i].fpDuration += selfLoppedDataToDraw[indexToIgnore].fpDuration;

            return true;
          }
        }
      }

      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  }
  /**Thi method gives us the index to splice*/
  getNodeIndex(jsonData, nodeObjId) {
    try {
      if (jsonData && nodeObjId) {
        for (let i = 0; i < jsonData.length; i++) {

          if (jsonData[i].id == nodeObjId)
            return i;
        }
      }
      return -1;
    } catch (err) {
      console.error(err);
      return -1;
    }
  }
  /**This is the methos which changes the source id if we exclude an objects id*/
  chnageSourceId(jsonDataToChange, sourceId, sourceIdToChange) {
    try {
      if (jsonDataToChange) {
        jsonDataToChange.forEach(nodeObj => {
          if (nodeObj) {
            if (nodeObj.sourceId && sourceId && nodeObj.sourceId == sourceId)
              nodeObj.sourceId = sourceIdToChange;
          }
        });
      }
      return jsonDataToChange;
    } catch (err) {
      console.error(err);
      return jsonDataToChange;
    }
  }

  showTransactionData() {
    if (this.showSelfLoop) {
      this.showSelfLoop = false;
      this.dataToDraw = this.flowmapData.asyncJsonForNonMergeCase
      setTimeout(() => { this.creteflowmap(this.flowmapData.asyncJsonForNonMergeCase), 0 });
    }
    else {
      this.getSelfLoopJsonData();
    }
  }
  openReqRespData(data: any) {
    this.setIpPort(data);
    console.log('row data-------------> in flowmap', data);
    let startTime, endTime, fpDuration, url;
    // Adding starttime, endtime,fpduration in the end after all the cases for ajaxcall.
    if (this._ddrData.isFromtrxFlow) {
      url = "testRun=" + this._ddrData.testRunTr;
      console.log("this._ddrData.testRun", this._ddrData.testRun);
    }
    else
      url = "testRun=" + this.urlParam.testRun;
    if (data !== undefined) {
      console.log("else from main", this.objofCurrentnode);
      // this.CommonServices.hsData = this.objofCurrentnode;
      startTime = this.objofCurrentnode.startTimeInMs;
      fpDuration = this.objofCurrentnode.fpDuration;

      if (!data.startTimeInMs && !startTime) {
        let dateForStart = new Date(data.StartTime);
        let startTimeInMS = dateForStart.getTime();
        if (data.Duration) {
          fpDuration = parseInt(data.Duration.replace(/,/g, ''));
        }
        //fpDuration = parseInt(data.Duration.replace(/,/g, ''));
        startTime = startTimeInMS;
        console.log("dateForStart", dateForStart, "startTimeInMS", startTimeInMS, "fpDuration", fpDuration, "startTime", startTime);
      }
      else if (data.Duration) {
        fpDuration = parseInt(data.Duration.replace(/,/g, ''));
      }
      url += '&fpInstance=' + this.objofCurrentnode.flowpathInstance +
        '&tierName=' + this.objofCurrentnode.tierName +
        '&serverName=' + this.objofCurrentnode.serverName +
        '&appName=' + this.objofCurrentnode.appName +
        "&statusCode=" + this.objofCurrentnode.statusCode;
      if (undefined != fpDuration) {

        if (fpDuration == '< 1')
          fpDuration = 0;

        if (fpDuration.toString().includes(','))
          endTime = Number(startTime) + Number(fpDuration.toString().replace(/,/g, ""));
        else
          endTime = Number(startTime) + Number(fpDuration);
      }
      url += "&strStartTime=" + startTime + "&strEndTime=" + endTime +
        '&queryId=' + this.queryId;
      //url += "&btCategory="+this.flowmapData.paramsForFlowMap.btCatagory;
    }

    this.CommonServices.httpData = this.CommonServices.makeObjectFromUrlParam(url);
    var endpoint_url = '';
    if (this._ddrData.isFromtrxFlow) {
      endpoint_url += this._ddrData.protocolTr + "://" + this._ddrData.hostTr + ":" + this._ddrData.portTr + "/" + this.urlParam.product + "/v1/cavisson/netdiagnostics/ddr/httpReportNew?" + url;
    }
    else
      endpoint_url += this.flowmapData.hosturl + this.flowmapData.urlParam.product.replace('/', "") + "/v1/cavisson/netdiagnostics/ddr/httpReportNew?" + url;
    return this.ddrRequest.getDataUsingGet(endpoint_url).subscribe(data => (this.httpData(data)));
  }

  httpData(data) {
    //this.CommonServices.hsData.btCatagory = this.flowmapData.paramsForFlowMap.btCatagory;
    console.log("data after transaction ajax", data);
    this.httpDialog = true;
    for (let i = 0; i < data.reqBodyData.length; i++) {
      this.httpRequestArrBody = data.reqBodyData[i]["ReqBody"];
    }
    for (let i = 0; i < data.respBodyData.length; i++) {
      this.httpResponseArrBody = data.respBodyData[i]["RespBody"];
    }
    console.log("print this.httpRequestArrBody value", this.httpRequestArrBody);
    console.log("print this.httpResponseArrBody value", this.httpResponseArrBody);
  }

  openReqRespDataForCallOut(data: any) {
    this.setIpPort(data);
    console.log('row data-------------> in flowmap', data);
    let startTime, endTime, fpDuration, url;
    // Adding starttime, endtime,fpduration in the end after all the cases for ajaxcall.
    if (this._ddrData.isFromtrxFlow) {
      url = "testRun=" + this._ddrData.testRunTr;
      console.log("this._ddrData.testRun", this._ddrData.testRun);
    }
    else
      url = "testRun=" + this.urlParam.testRun;
    if (data !== undefined) {
      console.log("else from main", this.objofCurrentnode);
      // this.CommonServices.hsData = this.objofCurrentnode;
      startTime = this.objofCurrentnode.startTimeInMs;
      fpDuration = this.objofCurrentnode.fpDuration;

      if (!data.startTimeInMs && !startTime) {
        let dateForStart = new Date(data.StartTime);
        let startTimeInMS = dateForStart.getTime();
        if (data.Duration) {
          fpDuration = parseInt(data.Duration.replace(/,/g, ''));
        }
        //fpDuration = parseInt(data.Duration.replace(/,/g, ''));
        startTime = startTimeInMS;
        console.log("dateForStart", dateForStart, "startTimeInMS", startTimeInMS, "fpDuration", fpDuration, "startTime", startTime);
      }
      else if (data.Duration) {
        fpDuration = parseInt(data.Duration.replace(/,/g, ''));
      }
      url += '&fpInstance=' + this.objofCurrentnode.flowpathInstance +
        '&tierName=' + this.objofCurrentnode.tierName +
        '&serverName=' + this.objofCurrentnode.serverName +
        '&appName=' + this.objofCurrentnode.appName +
        "&statusCode=" + this.objofCurrentnode.statusCode;
      if (undefined != fpDuration) {

        if (fpDuration == '< 1')
          fpDuration = 0;

        if (fpDuration.toString().includes(','))
          endTime = Number(startTime) + Number(fpDuration.toString().replace(/,/g, ""));
        else
          endTime = Number(startTime) + Number(fpDuration);
      }
      url += "&strStartTime=" + startTime + "&strEndTime=" + endTime +
        '&queryId=' + this.queryId;
      //url += "&btCategory="+this.flowmapData.paramsForFlowMap.btCatagory;
    }

    this.CommonServices.httpData = this.CommonServices.makeObjectFromUrlParam(url);
    var endpoint_url = '';
    if (this._ddrData.isFromtrxFlow) {
      endpoint_url += this._ddrData.protocolTr + "://" + this._ddrData.hostTr + ":" + this._ddrData.portTr + "/" + this.urlParam.product + "/v1/cavisson/netdiagnostics/ddr/httpReportNew?" + url;
    }
    else
      endpoint_url += this.flowmapData.hosturl + this.flowmapData.urlParam.product.replace('/', "") + "/v1/cavisson/netdiagnostics/ddr/httpReportNew?" + url;
    endpoint_url += "&resourceId=1";
    return this.ddrRequest.getDataUsingGet(endpoint_url).subscribe(data => (this.httpDataForCallOut(data)));
  }
  httpDataForCallOut(data) {
    //this.CommonServices.hsData.btCatagory = this.flowmapData.paramsForFlowMap.btCatagory;
    console.log("data after transaction ajax", data);
    this.httpDialogTable = true;
    if (data.ReqArray != undefined) {
      for (let i = 0; i < data.ReqArray.length; i++) {
        this.httpRequestArrBody2 = data.ReqArray[i];
      }
      this.httpRequestArrBody1 = this.createTableArr(data.ReqArray);
    }
    if (data.RespArray != undefined) {
      for (let i = 0; i < data.RespArray.length; i++) {
        this.httpResponseArrBody2 = data.RespArray[i];
      }
      this.httpResponseArrBody1 = this.createTableArr(data.RespArray);
    }
    console.log("print this.httpRequestArrBody1 value", this.httpRequestArrBody1);
    console.log("print this.httpResponseArrBody1 value", this.httpResponseArrBody1);
    console.log("print this.httpRequestArrBody2 value", this.httpRequestArrBody2);
    console.log("print this.httpResponseArrBody2 value", this.httpResponseArrBody2);
  }

  randomNumber() {
    this.queryId = (Math.random() * 1000000).toFixed(0);
    console.log("queryId:::::::::::::" + this.queryId);
  }
  createTableArr(reqDataDetail) {
    let data = reqDataDetail;
    let coldata = [];
    let keys = Object.keys(data);
    for (let i = 0; i < keys.length; i++) {
      //console.log("length of data", keys.length);
      coldata[i] = { header: keys[i], value: (decodeURIComponent(data[keys[i]].substring(0, 50)).replace(/\+/g, '')) };
    }
    return coldata;
  }
  onShowMore(eventData) {
    this.showmore = true;
    //  this.ColumnRowData = node;
    //  console.log("The value of req body show more...", this.ColumnRowData);
  }
  onShowMore1(eventData) {
    this.showmore1 = true;
    //  this.ColumnRowData1 = node;
    //  console.log("The value of resp body show more...", this.ColumnRowData1);
  }

  //   openHotspotReport(data: any) {
  //   console.log('row data-------------> in flowmap', data);
  //   if (data !== undefined) {
  //     if (this.isFromMain) {
  //       this.CommonServices.hsData = data;
  //     }
  //     else {
  //       this.CommonServices.hsData = this.objofCurrentnode;
  //       if (!data.startTimeInMs) {
  //         let dateForStart = new Date(data.StartTime);
  //         let startTimeInMS = dateForStart.getTime();
  //         let fpDuration = parseInt(data.Duration.replace(/,/g, ''));
  //         this.CommonServices.hsData.startTimeInMS = startTimeInMS;
  //         this.CommonServices.hsData.fpDuration = fpDuration;
  //         this.CommonServices.hsData.flowpathInstance = data.FPInstance;
  //       }
  //     }

  //     this.CommonServices.hsData.btCatagory = this.flowmapData.paramsForFlowMap.btCatagory;
  //     this.CommonServices.hsFlag = true;
  //     this.breadcrumbService.parentComponent = CONSTANTS.BREADCRUMB_ITEMS.TRANSACTION_FLOWMAP;
  //  if(this._router.url.indexOf("/home/ddrCopyLink") != -1)
  // this._router.navigate(['/home/ddrCopyLink/hotspot']);
  // else if(this._router.url.indexOf("/home/ED-ddr") != -1)
  //  this._router.navigate(['/home/ED-ddr/hotspot']);
  // else
  //   this._router.navigate(['/home/ddr/hotspot']);
  // } 
  // }

  openHotspotReport(data: any) {
    this.setIpPort(data);
    console.log('row data-------------> in flowmap', data);
    let startTime, endTime, fpDuration, url;
    // Adding starttime, endtime,fpduration in the end after all the cases for ajaxcall.
    if (this._ddrData.isFromtrxFlow) {
      url = "testRun=" + this._ddrData.testRunTr;
      console.log("this._ddrData.testRun", this._ddrData.testRun);
    }
    else
      url = "testRun=" + this.urlParam.testRun;
    if (data !== undefined) {
      if (this.isFromMain) {
        console.log("isFromMain>>>> main", data);
        startTime = data.startTimeInMs;
        fpDuration = data.fpDuration;
        url += '&tierId=' + data.tierId +
          '&appId=' + data.appId +
          '&serverId=' + data.serverId +
          '&threadId=' + data.threadId +
          // '&btCategory=' + data.btCatagory +
          '&appName=' + data.appName +
          '&serverName=' + data.serverName +
          '&tierName=' + data.tierName +
          '&flowpathInstance=' + data.flowpathInstance;
        // this.CommonServices.hsData = data;

      }
      else {
        console.log("else from main", this.objofCurrentnode);
        // this.CommonServices.hsData = this.objofCurrentnode;
        startTime = this.objofCurrentnode.startTimeInMs;
        fpDuration = this.objofCurrentnode.fpDuration;

        if (!data.startTimeInMs && !startTime) {
          let dateForStart = new Date(data.StartTime);
          let startTimeInMS = dateForStart.getTime();
          fpDuration = parseInt(data.Duration.replace(/,/g, ''));
          startTime = startTimeInMS;
          console.log("dateForStart", dateForStart, "startTimeInMS", startTimeInMS, "fpDuration", fpDuration, "startTime", startTime);
          // this.CommonServices.hsData.startTimeInMS = startTimeInMS;
          // this.CommonServices.hsData.fpDuration = fpDuration;
          //this.CommonServices.hsData.flowpathInstance = data.FPInstance;  
        }
        else if (data.Duration) {
          fpDuration = parseInt(data.Duration.replace(/,/g, ''));
        }

        url += '&tierId=' + this.objofCurrentnode.tierId +
          '&appId=' + this.objofCurrentnode.appId +
          '&serverId=' + this.objofCurrentnode.serverId +
          //'&strStartTime=' + data.startTimeInMs +
          //'&strEndTime='+ endTime +
          '&threadId=' + this.objofCurrentnode.threadId +
          //'&btCategory=' + this.objofCurrentnode.btCatagory +
          '&appName=' + this.objofCurrentnode.appName +
          '&serverName=' + this.objofCurrentnode.serverName +
          '&tierName=' + this.objofCurrentnode.tierName +
          '&urlIndex=' + this.objofCurrentnode.urlIndex +
          '&instanceType=' + this.objofCurrentnode.instanceType +
          '&flowpathInstance=' + this.objofCurrentnode.flowpathInstance;
      }



      if (undefined != fpDuration) {

        if (fpDuration == '< 1')
          fpDuration = 0;

        if (fpDuration.toString().includes(','))
          endTime = Number(startTime) + Number(fpDuration.toString().replace(/,/g, ""));
        else
          endTime = Number(startTime) + Number(fpDuration);
      }
      url += "&strStartTime=" + startTime + "&strEndTime=" + endTime;
      url += "&btCategory=" + this.flowmapData.paramsForFlowMap.btCatagory;
    }

    this.CommonServices.hotspotFilters = this.CommonServices.makeObjectFromUrlParam(url);
    var endpoint_url = '';
    // if (this.CommonServices.host != undefined && this.CommonServices.host != '' && this.CommonServices.host != null) {
    //   endpoint_url = this.CommonServices.protocol + this.CommonServices.host + ':' + this.CommonServices.port + '/' + this.urlParam.product;
    // } else {
    //   endpoint_url = decodeURIComponent(this.getHostUrl() + '/' + this.urlParam.product);
    // }
    if (this._ddrData.isFromtrxFlow) {
      endpoint_url += this._ddrData.protocolTr + "://" + this._ddrData.hostTr + ":" + this._ddrData.portTr + "/" + this.urlParam.product + "/v1/cavisson/netdiagnostics/ddr/hotspotDataEX?" + url;
    }
    else
      endpoint_url += this.flowmapData.hosturl + this.flowmapData.urlParam.product.replace('/', "") + "/v1/cavisson/netdiagnostics/ddr/hotspotDataEX?" + url;
    return this.ddrRequest.getDataUsingGet(endpoint_url).subscribe(data => (this.hotspotData(data)));
  }

  hotspotData(data) {
    //this.CommonServices.hsData.btCatagory = this.flowmapData.paramsForFlowMap.btCatagory;
    console.log("data after transaction ajax", data);
    if (!data || !data.data || data.data.length == 0) {
      this.displayTFMPopUp = true;
      this.tableDialogDisplay1 = false;
      this.singleMergeGraph = false;
      this.displaySamplePopup = false;
      this._ddrData.isFromtrxFlow = false;
      this._ddrData.splitViewFlag = true;
    }
    else {
      this._ddrData.splitViewFlag = false;
      this.CommonServices.hsFlag = true;
      this.CommonServices.hsData = data;
      this.breadcrumbService.parentComponent = CONSTANTS.BREADCRUMB_ITEMS.TRANSACTION_FLOWMAP;
      if (this._router.url.indexOf("/home/ddrCopyLink") != -1)
        this._router.navigate(['/home/ddrCopyLink/hotspot']);
      else if (this._router.url.indexOf("/home/ED-ddr") != -1)
        this._router.navigate(['/home/ED-ddr/hotspot']);
      else
       // this._router.navigate(['/home/ddr/hotspot']);
       this._router.navigate(['/ddr/hotspot']);
    }
  }

  openMethodCallingTree(data, mergeCase) {
    this.setIpPort(data);
    this._ddrData.splitViewFlag = false;
    console.log('data for method caalling tree', data, this.isFromMain);
    if (data != undefined) {
      console.log("main case" + this.isFromMain);
      if (this.isFromMain) {
        this.CommonServices.mctData = data;
      }
      else {
        this.CommonServices.mctData = this.objofCurrentnode;
        this.CommonServices.mctData['startTime'] = this.objofCurrentnode['startDateTime'];

        this.CommonServices.mctData['mergeCase'] = mergeCase;
        if (!data.startTimeInMs) {
          let dateForStart = new Date(data.StartTime);
          let startTimeInMS = dateForStart.getTime();
          let fpDuration = parseInt(data.Duration.replace(/,/g, ''));
          this.CommonServices.mctData.startTimeInMS = startTimeInMS;
          this.CommonServices.mctData.startTime = data.StartTime;
          this.CommonServices.mctData.fpDuration = fpDuration;
          this.CommonServices.mctData.flowpathInstance = data.FPInstance;
        }
        this.CommonServices.mctData.urlQueryParamStr = this.objofCurrentnode.urlQueryParmStr;

      }
      this.CommonServices.mctFlag = true;
    }
    this.CommonServices.mctData['source'] = "TransactionFlowmap";
    this.breadcrumbService.parentComponent = CONSTANTS.BREADCRUMB_ITEMS.TRANSACTION_FLOWMAP;
    if (this._router.url.indexOf("/home/ddrCopyLink") != -1)
      this._router.navigate(['/home/ddrCopyLink/methodCallingTree']);
    else if (this._router.url.indexOf("/home/ED-ddr") != -1)
      this._router.navigate(['/home/ED-ddr/methodCallingTree']);
    else
    // this._router.navigate(['/home/ddr/methodCallingTree']);
    this._router.navigate(['/ddr/methodCallingTree']);
  }

  onRowClick(event, data){
    console.log('event of on row click',event, data);
    if(data.Query){
      this.popupFooter = 'Query : ' + data.Query;
    }
    else if(data.URL){
       this.popupFooter = 'URL = ' + data.URL;
    }
    else{
      if(data.min){
        this.popupFooter = 'Minimum Execution Time : ' + data.min;
      }

    }
  }
  setpopupFilter() {
    this.popupFilter = " From Tier: " + this.flowmapData.paramsForFlowMap.tierName + ', ' + "From Server: " + this.flowmapData.paramsForFlowMap.serverName + ", " + " From Instance : " + this.flowmapData.paramsForFlowMap.appName + ", " + 'Start Time : ' + this.flowmapData.paramsForFlowMap.startTime;
  }
  //this is method is to open the net forest from context menu when keyword is present in config UI
  openNetForest(flowpathIns, entryInstance, correlationId) {
    this._ddrData.splitViewFlag = false;
    var corrId = "";
    var query = "";
    let NetForestUrl = this.flowmapData.netForestURL;
    let timeVar = this.timeVarianceInMs(this.flowmapData.timeVarianceForNetForest);

    console.log("Time variance from TRX To NF = " + timeVar);
    console.log("Start time in TRX  = " + this.flowmapData.paramsForFlowMap.startTimeInMs);

    var d1 = parseInt(this.flowmapData.paramsForFlowMap.startTimeInMs) - timeVar;
    var d2 = parseInt(this.flowmapData.paramsForFlowMap.startTimeInMs) + parseInt(this.flowmapData.paramsForFlowMap.fpDuration) + timeVar;

    console.log("start time from TRX To NF = " + d1);
    console.log("end time from TRX To NF = " + d2);

    var startTimeISO = new Date(d1).toISOString();
    var endTimeISO = new Date(d2).toISOString();

    //var timeStr = "from:%27"+startTimeISO+"%27,mode:absolute,to:%27"+endTimeISO+"%27";

    if (correlationId != "" && correlationId != 'undefined' && correlationId != "-")
      // corrId = "%20OR%20corRID%3A"+correlationId;
      corrId = "%20AND%20corRID:" + correlationId;
    if (entryInstance == '1') {
      //query = "%27entryFPI%3D"+entryFPI+corrId+"%27";
      query = "entryFPI:" + this.entryFPI + corrId;
    }
    else
      //query = "%27FPI%3D"+flowpathIns+corrId+"%27";
      query = "FPI:" + flowpathIns + corrId;

    // New navigation to NF from Trxn Flowmap -- A-9 migration
      query = query.replace("%20", ' ');
      console.log("The value inside the starttime and endtime and query for the netforest is .......",startTimeISO,endTimeISO,query);
      // this._router.navigate(['/sessions-details'], { queryParams: { sid: nvSessionId  } });
      this._router.navigate(["/home/logs"], { queryParams: { queryStr: query,  startTime : startTimeISO , endTime : endTimeISO}});

    // Commented due to A-9 migartion.
    // if (NetForestUrl != "NA") {

    //   NetForestUrl = NetForestUrl.replace(/startTimeVal/, startTimeISO);
    //   NetForestUrl = NetForestUrl.replace(/endTimeVal/, endTimeISO);
    //   NetForestUrl = NetForestUrl.replace(/queryVal/, query);
    // }
    // else if (NetForestUrl == "NA") {
    //   alert("Please provide ' NetForestUrl ' keyword in config.ini");
    //   return;
    // }
    // console.log("url in trx flow:" + NetForestUrl);
    // window.open(NetForestUrl);
  }
  maxX = 0;
  maxY = 0;
  ctx;
  heightHeaderBox;
  shiftFactor = 100;  //This value is added to each Y cordn as to shift transaction flow diagram downward so that space report title and filter criteria can be made 
  xCor
  yCor
  arr_id_x_y = []; //this is array to store- id, x cordn, y cordn - of each node of jsonData;
  widthOfTooltip
  heightOfTooltip
  getMaxCordinate() {
    let xCor;
    let yCor;
    this.selfLoppedDataToDrawToView.forEach((val, index) => {
      xCor = parseInt(jQuery('#' + val.id).css('left').replace('px', ''));
      yCor = parseInt(jQuery('#' + val.id).css('top').replace('px', ''));

      if (xCor > this.maxX)
        this.maxX = xCor;

      if (yCor > this.maxY)
        this.maxY = yCor;

      this.arr_id_x_y.push([val.id, xCor, parseInt(yCor) + 100])

    });
  }

  downloadReport(type, arg) {

    if (this.showSelfLoop) {
      alert("Please Switch to expanded mode to dowlaod.");
      return;
    }

    let minX = 1400;  //default width of canvas
    let minY = 600;   //default height of canvas

    this.getMaxCordinate();
    let canvas = this.el.nativeElement.querySelector('#canvasforDownload');

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
      this.drawHeader(this.ctx);
      this.makeLines(this.ctx);
      this.makeNodes(this.ctx, arg);
    }


    if (type == 'directDownload') {
      setTimeout(() => {
        document.getElementById("trans")['download'] = "image.png";
        document.getElementById("trans")['href'] = this.el.nativeElement.querySelector("#canvasforDownload").toDataURL("image/png");
        //.replace(/^data:image\/[^;]/, 'data:application/octet-stream');
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
  }

  drawHeader(ctx) {

    var wid = document.getElementById('canvasforDownload')['width'];
    this.heightHeaderBox = 45;

    ctx.strokeStyle = "blue";
    ctx.fillStyle = 'LightSteelBlue';
    ctx.fillRect(0, 0, parseInt(wid), this.heightHeaderBox);
    /*ctx.rect(0,0,wid,45);
        ctx.stroke();
    ctx.font = "15px serif";
        ctx.fillStyle = 'black';	
      ctx.fillText(filterData, 0, 15); */

        var src1 = "./assets/images/logo_circle.png";
        var img = new Image();
        img.onload = function () { ctx.drawImage(img, 1, 1, 160, 40); }
        img.src = src1;

    var mode = "";
    if (sessionStorage.getItem('productType') == 'netdiagnostics')
      mode = "Netdiagnostics";
    else
      mode = "Netstorm";

    var title = mode + " - Transaction Flow - Test Run Number : " + this.urlParam.testRun;
    ctx.font = "bold 22px serif";
    ctx.fillStyle = 'Navy';
    ctx.fillText(title, parseInt(wid) / 3, 2 * this.heightHeaderBox / 3);

  }

  makeLines(ctx) {
    var entryX = 30;                   //X cordn of entry node 
    var entryY = 110 + this.shiftFactor;      //Y cordn of entry node   
    var arr = [];
    var x1, y1;            //(x1,y1) cordn of source of line connecting two nodes
    var padding = 5;
    var font = 15;

    this.dataToDraw.forEach((val, index) => {

      //  if(index == 0)
      //    { 
      //    if(DCNAME != "NA")
      // //       filterData =" DC :"+DCNAME;
      //     filterData += " Tier :"+val.tierName+"  Server: "+val.serverName+"  Instance:"+val.appName+"  BT: "+this.flowmapData.paramsForFlowMap.urlName +"  Start Time: "+val.startDateTime;

      //  if(this.flowmapData.paramsForFlowMap.urlName)
      //     filterData += "  BT Type: "+ this.flowmapData.paramsForFlowMap.btCatagory; 

      //  if(val.avgFpDuration != '<%=responseTime%>')
      //  {
      //     if(Number(<%=responseTime%>).toLocaleString() == 0)
      //       filterData += " Response Time: < 1(ms) Entry Response Time: < 1(ms)";
      //     else
      //   filterData += " Response Time: "+Number(<%=responseTime%>).toLocaleString()+"(ms) Entry Response Time: "+Number(Math.round(val.avgFpDuration)).toLocaleString()+"(ms)";
      //  }
      //  else
      //  {
      // if (Number(val.avgFpDuration) == 0)
      //   filterData += "  Response Time: < 1(ms)";
      // else
      //   filterData += "  Response Time: " + Number(val.avgFpDuration).toLocaleString() + "(ms)";
      // //}

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

      var url = this.flowmapData.getTruncatedURL(queryParm)

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
        ctx.fillText(lbl, ((x + x1) - this.widthOfTooltip) / 2, (y + y1) / 2, this.widthOfTooltip);
      }
      else
        ctx.fillText(lbl, ((x + x1) - this.widthOfTooltip) / 2, (y + y1) / 2, this.widthOfTooltip);

      ctx.fillText(url, ((x + x1) - this.widthOfTooltip) / 2, (y + y1) / 2 + font, this.widthOfTooltip);

      // ctx.fillText(parseInt(index)+1, (X+widthOfTooltip/2), Y);		
    });
  }

  makeNodes(ctx, arg) {
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
          ctx.fillText(Str[j], dx, dy, widthOfTooltip); dy += 15;

        }
      }
    });
  }

  roundedRect(ctx, x, y, width, height, radius, borderColor, boxInfo) {
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

  timeVarianceInMs(time) {
    var timeVarianceInMs = time;
    var timeVarNum = "";

    if (/^[0-9]*h$/.test(time)) //If time is in hour formate- xh eg:2h means 2 hour variance is appliend in configuration file
    {
      timeVarNum = time.substring(0, time.length - 1);
      timeVarianceInMs = parseInt(timeVarNum) * 60 * 60 * 1000;
    }
    else if (/^[0-9]*m$/.test(time))     //If time is in minute formate- xm eg:20m means 20 minute  variance is appliend in configuration file
    {
      timeVarNum = time.substring(0, time.length - 1);
      timeVarianceInMs = parseInt(timeVarNum) * 60 * 1000;
    }
    else if (/^[0-9]*s$/.test(time))  //If time is in second formate- xs eg:200s means 200 second  variance is appliend in configuration file
    {
      timeVarNum = time.substring(0, time.length - 1);
      timeVarianceInMs = parseInt(timeVarNum) * 1000;
    }
    else if (/^[0-9]*ms$/.test(time)) //If time is in millisecond formate- xs eg:200ms means 200 millisecond  variance is appliend in configuration file
    {
      timeVarNum = time.substring(0, time.length - 2);
      timeVarianceInMs = parseInt(timeVarNum);
    }
    else if (/^[0-9]*$/.test(time)) // if there is only number, it is considered as seconds 
    {
      timeVarianceInMs = parseInt(time) * 1000;
    }
    else {
      alert("Please provide value of 'NetDiagnosticsQueryTimeVariance' in proper format in config.ini i.e.- Nh or Nm or Ns or Nms or N where N is a integer ");

      return parseInt('900000'); //if value of ndQueryTimeVariance is not in desired format then NF report will open with default variance time that is 15 minutes(900000ms).

    }
    return parseInt(timeVarianceInMs);
  }
  openExceptionReport(rowData: any) {
    this._ddrData.splitViewFlag = false;
    console.log('rowData-->', rowData);
    if (rowData !== undefined) {
      this.breadcrumbService.parentComponent = CONSTANTS.BREADCRUMB_ITEMS.TRANSACTION_FLOWMAP;
      if (rowData.fpDuration == '< 1') {

        this.CommonServices.flowpathToExData = this.objofCurrentnode;
        // this.CommonServices.flowpathToExData.failedQuery = rowData.Query;
        // this.CommonServices.flowpathToExData.exceptionClassId = this.objofCurrentnode.exceptionClassId;
        this.CommonServices.flowpathToExData.fpDuration = 0;
        //this.CommonServices.flowpathToExData
      } else {
        this.CommonServices.flowpathToExData = this.objofCurrentnode;
        // this.CommonServices.flowpathToExData = rowData.;     
        // this.CommonServices.flowpathToExData.failedQuery = rowData.Query;
        //  this.CommonServices.flowpathToExData.exceptionClassId = this.objofCurrentnode.exceptionClassId;   
      }
    }

    if (this._router.url.indexOf('/home/ddrCopyLink/') != -1) {
      this._router.navigate(['/home/ddrCopyLink/exception']);
    } else if (this._router.url.indexOf('/home/ED-ddr') != -1) {
      this._router.navigate(['/home/ED-ddr/exception']);
    } else {
      this._router.navigate(['/ddr/exception']);
    }
  }
  sortColumnsOnCustom(event, tempData) {
    //for interger type data type
    if (event["field"] == "StartTime") {
      if (event.order == -1) {
        var temp = (event["field"]);
        event.order = 1
        tempData = tempData.sort(function (a, b) {
          var value = Date.parse(a[temp]);
          var value2 = Date.parse(b[temp]);
          return (value2 > value) ? 1 : ((value2 < value) ? -1 : 0);
        });
      }
      else {
        var temp = (event["field"]);
        event.order = -1;
        //asecding order
        tempData = tempData.sort(function (a, b) {
          var value = Date.parse(a[temp]);
          var value2 = Date.parse(b[temp]);
          return (value > value2) ? 1 : ((value < value2) ? -1 : 0);
        });
      }
    }
    else if (event["field"] == "Average") {
      if (event.order == -1) {
        var temp = (event["field"]);
        event.order = 1
        tempData = tempData.sort(function (a, b) {
          var value = Number(a[temp]);
          var value2 = Number(b[temp]);
          return (value2 > value) ? 1 : ((value2 < value) ? -1 : 0);
        });
      }
      else {
        var temp = (event["field"]);
        event.order = -1;
        //asecding order
        tempData = tempData.sort(function (a, b) {
          var value = Number(a[temp]);
          var value2 = Number(b[temp]);
          return (value > value2) ? 1 : ((value < value2) ? -1 : 0);
        });
      }
    }
    else {
      if (event.order == -1) {
        var temp = (event["field"]);
        event.order = 1
        tempData = tempData.sort(function (a, b) {
          var value = Number(a[temp].replace(/,/g, ''));
          var value2 = Number(b[temp].replace(/,/g, ''));
          return (value2 > value) ? 1 : ((value2 < value) ? -1 : 0);
        });
      }
      else {
        var temp = (event["field"]);
        event.order = -1;
        //asecding order
        tempData = tempData.sort(function (a, b) {
          var value = Number(a[temp].replace(/,/g, ''));
          var value2 = Number(b[temp].replace(/,/g, ''));
          return (value > value2) ? 1 : ((value < value2) ? -1 : 0);
        });
      }
    }
    this.transactionTableArray = [];
    //console.log(JSON.stringify(tempData));
    if (tempData) {
      tempData.map((rowdata) => { this.transactionTableArray = this.Immutablepush(this.transactionTableArray, rowdata) });
    }

  }

  popupForFpMiss() {
    var errMsg = "";
    if (this.flowmapData.isFPMissCase != false)
      errMsg = "Warning: One or more flow paths are not captured in the path shown by Red arrow(s).";

    //  if(this.flowmapData.isFpCheckMiss == false)
    //  errMsg ="WARNING: Since entry flowpath is missing hence showing flowmap for only current and it's child flowpaths."


    // this.showErrorNotificationForFpMiss(errMsg);
    // jQuery('#fpMissMsg').on('click',function(){
    //   if (jQuery('.notifyjs-wrapper').length<=0)
    //   showErrorNotificationForFpMiss(errMsg);
    //);
  }


  handleChange(event) {
    console.log('event', event)
    this.flowmapData.showOrigFlowmap = event.checked;
    this.CommonServices.loaderForDdr = true;
    this.flowmapData.isFirstRoot = true;
    console.log('val', this.flowmapData.showOrigFlowmap)
    if (this.flowmapData.showOrigFlowmap) {
      this.flowmapData.isFpCheckMiss = true;
      this.flowmapData.getDataForTxnFlowpath(this.flowmapData.paramsForFlowMap.flowpathInstance, this.flowmapData.paramsForFlowMap)
    }
    else {
      this.flowmapData.isFpCheckMiss = false;
      this.flowmapData.getDataForTxnFlowpath(this.flowmapData.paramsForFlowMap.flowpathInstance, this.flowmapData.paramsForFlowMap)
    }


  }

  waningPopup: boolean = false;
  showWarningMessgae() {
    this.waningPopup = true;
  }

  downloadReportForAgg(reportType) {
    let popuptitle = this.popupTitle;
    console.log('columns are--', this.col);
    this.aggRenameArray = {};
    this.aggColOrder = [];
    this.aggDownloadJson = JSON.parse(JSON.stringify(this.dbCalloutDetails));

    for (let i = 0; i < this.col.length; i++) {
      this.aggRenameArray[this.col[i]['field']] = this.col[i]['header'];
      this.aggColOrder.push(this.col[i]['header']);
    }
    let fieldKeys = Object.keys(this.aggRenameArray);

    this.aggDownloadJson.forEach((val, index) => {
      let keys = Object.keys(val);
      keys.forEach((val1) => {
        if (!fieldKeys.includes(val1)) {
          delete val[val1];
        }
      })
    });

    if (reportType == 'excel') {

      popuptitle = popuptitle.replace(/:/g, '-');

    }


    let downloadObj: Object = {
      downloadType: reportType,
      strSrcFileName: 'DBQueries',
      strRptTitle: popuptitle,
      renameArray: JSON.stringify(this.aggRenameArray),
      colOrder: this.aggColOrder.toString(),
      jsonData: JSON.stringify(this.aggDownloadJson),
      varFilterCriteria: this.popupFilter

    };
    console.log('download Obj---', downloadObj);
    let downloadFileUrl = '';
    downloadFileUrl = this.flowmapData.hosturl + this.flowmapData.urlParam.product.replace('/', "");
    downloadFileUrl += '/v1/cavisson/netdiagnostics/ddr/downloadAngularReport';
    if (sessionStorage.getItem("isMultiDCMode") == "true" && (downloadFileUrl.includes("/tomcat") || downloadFileUrl.includes("/node"))) {
      this.ddrRequest.getDataInStringUsingPost(downloadFileUrl, (downloadObj)).subscribe(res =>
        (this.openDownloadReports(res)));
    }
    else {
      this.ddrRequest.getDataInStringUsingPost(downloadFileUrl, JSON.stringify(downloadObj)).subscribe(res =>
        (this.openDownloadReports(res)));
    }


  }


  openDownloadReports(res) {
    console.log('file name generate ===', res);
    let downloadFileUrl = '';

    downloadFileUrl = (this.flowmapData.hosturl.substring(0, this.flowmapData.hosturl.lastIndexOf("/")) + '/common/' + res);
    window.open(downloadFileUrl);
  }
  showNotification() {
    this.CommonServices.showSuccess('Query has been copied successfully');
  }
  setIpPort(objForRouting) {
    if (this.flowmapData.ndeInfoData.length > 0) {
      for (var i = 0; i < this.flowmapData.ndeInfoData.length; i++) {
        var val = this.flowmapData.ndeInfoData[i];
        if (val.ndeId == this.drilInfoData.ndeId) {
          if (this._ddrData.nodeKey == '1') {
            this._ddrData.protocolTr = location.protocol.split(":")[0];
            this._ddrData.hostTr = location.host.split(":")[0];
            this._ddrData.portTr = location.host.split(":")[1] + "/tomcat/" + val.displayName;
            this._ddrData.dcNameTr = val.displayName;
            if (!location.host.split(":")[1]) {
              if (location.protocol.includes("https"))
                this._ddrData.portTr = "443" + "/" + val.displayName;
              else
                this._ddrData.portTr = "80" + "/" + val.displayName;
            }
            if (val.ndeTestRun)
              this._ddrData.testRunTr = val.ndeTestRun;
            else
              this._ddrData.testRunTr = this._ddrData.testRun;
          }
          else {
            this._ddrData.hostTr = val.ndeIPAddr;
            this._ddrData.portTr = val.ndeTomcatPort;
            this._ddrData.protocolTr = val.ndeProtocol;
            if (val.ndeTestRun)
              this._ddrData.testRunTr = val.ndeTestRun;
            else
              this._ddrData.testRunTr = this._ddrData.testRun;
            this._ddrData.dcNameTr = val.displayName;
          }
          this._ddrData.isFromtrxFlow = true;
          this.CommonServices.host = undefined;
          this.CommonServices.testRun = undefined;
        }
      }
    }
  }
}


