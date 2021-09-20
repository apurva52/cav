import { Component, AfterViewInit, OnInit, ElementRef, OnChanges, Input, ChangeDetectorRef, ViewChild, Renderer2 } from '@angular/core';
import * as jQuery from 'jquery';
import { DdrTxnFlowmapDataService } from './../../services/ddr-txn-flowmap-data.service';
declare var jsPlumb: any;
//import { DdrTransactioIndividualInfoService } from './../../services/ddr-transactio-individual-info.service';
import { CommonServices } from './../../services/common.services';
import { CavTopPanelNavigationService } from '../../../tools/configuration/nd-config/services/cav-top-panel-navigation.service';
import { Router } from '@angular/router';
import { CavConfigService } from "../../../tools/configuration/nd-config/services/cav-config.service";
// import { MenuItem, ContextMenu } from 'primeng/primeng';
import { DdrDataModelService } from "../../../tools/actions/dumps/service/ddr-data-model.service";
import { DdrBreadcrumbService } from './../../services/ddr-breadcrumb.service';
import * as  CONSTANTS from './../../constants/breadcrumb.constants';
import { HttpClient } from '@angular/common/http';
import { DdrAggFlowmapService } from './../../services/ddr-agg-flowmap.service';
import * as moment from 'moment';
import 'moment-timezone';


//import { LZString } from './../../services/common.services';
//import { jCaptcha } from './../../services/common.services';

//declare var LZString: any

@Component({
  selector: 'app-ddr-agg-flowmap',
  templateUrl: './ddr-agg-flowmap.component.html',
  styleUrls: ['./ddr-agg-flowmap.component.css']
})
export class DdrAggFlowmapComponent implements OnInit {
  dataToDraw = [];

  constructor(
    public flowmapData: DdrTxnFlowmapDataService, 
    private _render: Renderer2, 
    //private nodeTabledataService: DdrTransactioIndividualInfoService, 
    private CommonServices: CommonServices, 
    private _navService: CavTopPanelNavigationService,
    private _router: Router, 
    private _ddrData: DdrDataModelService, 
    private breadcrumbService: DdrBreadcrumbService, 
    private _cavConfigService: CavConfigService, 
    private http: HttpClient, private el: ElementRef, 
    private changeDetection: ChangeDetectorRef,
    public aggFlowmapService: DdrAggFlowmapService
    ) {

  }

  ngOnInit() {
    this.aggFlowmapService.getDataForAgg().then(data => {
      this.dataToDraw = this.aggFlowmapService.jsonData;
      this.CommonServices.loaderForDdr = false;
      this.breadcrumbService.setBreadcrumbs("DdrAggFlowmapComponent")
      setTimeout(() => {
        this.creteflowmap(this.dataToDraw);
        this.showHeaderInfo();
      }, 600)
     
    })

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
      let agentID;
      instance.registerConnectionType("basic", basicType);
      jsonDataToDraw.forEach((obj, index) => {

        // suspend drawing and initialise.
        instance.batch(function () {

          // make all the window divs draggable
          instance.draggable(jsPlumb.getSelector(".flowchart-demo .window"), { grid: [20, 20] });
          // THIS DEMO ONLY USES getSelector FOR CONVENIENCE. Use your library's appropriate selector
          // method, or document.querySelectorAll:
          //  jsPlumb.draggable(jsPlumb.querySelectorAll(".window"), {containment:[5,130,99999,99999]});
          //instance.draggable(jQuery(".window"),{ containment: jQuery('flowmap-box')});
          if (obj.cType == "P" || obj.cType == "OP" || obj.cType == "C") {
            let callCount;
            if(obj.pF == 0 || obj.F == obj.pF){
              callCount = "";
            }
            else {
              callCount =  "," + getCalls(obj.count);
            }
            instance.connect({
              source: obj.sourceId + "",
              target: obj.id + "",
              // connectorStyle: connectorPaintStyle,
              hoverPaintStyle: { stroke: "red" },
              anchors: [["Perimeter", { shape: "Circle" }], ["Perimeter", { shape: "Rectangle" }]],
              deleteEndpointsOnDetach: false,
              detachable: false,
              connector: "Straight",
              overlays: [
                ["Arrow", { location: 0.3, width: 6, length: 5 }],
                ["Arrow", { location: 0.9, width: 6, length: 5 }],

                ["Label", { label: "<a style='color:black !important' id='label" + obj.id + "'><center>" + getBtName(obj.btI) + callCount + "," + timeFormatter(obj.D) + "ms" + "</center><span id='labela" + obj.id + "'></span></a>", location: 0.5, id: "myLabel", cssClass: " greenLabel" }]],
            });
          }
          else {
          
            instance.connect({
              source: obj.sourceId + "",
              target: obj.id + "",
              // connectorStyle: connectorPaintStyle,
              hoverPaintStyle: { stroke: "red" },
              anchors: [["Perimeter", { shape: "Circle" }], ["Perimeter", { shape: "Rectangle" }]],
              deleteEndpointsOnDetach: false,
              detachable: false,
              connector: "Straight",
              overlays: [
                ["Arrow", { location: 0.3, width: 6, length: 5 }],
                ["Arrow", { location: 0.9, width: 6, length: 5 }],
                ["Label", { label: "<a style='color:black !important' id='label" + obj.id + "'><center>" + getIpName(obj.t) + "," + getCalls(obj.count) + "," + timeFormatter(obj.D) + "ms" + "</center><span id='labela" + obj.id + "'></span></a>", location: 0.5, id: "myLabel", cssClass: " greenLabel" }]],

            });
           
          }
        })
      });

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

      function getBtName(btId) {
        for (let prop in that.aggFlowmapService.mergeBts) {

          if (prop == btId) {
            return that.aggFlowmapService.mergeBts[prop]
          }
        }
      }

      function getIpName(type) {
        return that.aggFlowmapService.getBackendTypeName(type)
      }
    })
  }
  labelNode = '';
  showHeaderInfo() {
    this.labelNode = '';
    let dat = new Date(this.aggFlowmapService.startTime);
    let str = dat.toLocaleString();
    dat = new Date(this.aggFlowmapService.endTime);
    let end = dat.toLocaleString()

    this.labelNode = "<b>BT :</b> " + this.aggFlowmapService.btName + ",&nbsp <b>Start Date/Time :</b> " + str + ",&nbsp <b>End Date/Time :</b> " + end;



    setTimeout(() => {
      var d = document.getElementById('filterAgg');
      d.innerHTML = this.labelNode;
    }, 400)

  }


}
