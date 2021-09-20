import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ViewEncapsulation, SimpleChange,Input
} from '@angular/core';
import { Router } from '@angular/router';

// import { DdrTxnFlowmapDataService } from './../../services/ddr-txn-flowmap-data.service';
import { CommonServices } from '../../services/common.services';
import { DDRRequestService } from '../../services/ddr-request.service';
// import { CompareMethodTimingComponent } from "../compare-method-timing/compare-method-timing.component";
// import { FlowPathService } from "../../flow-path/service/flow-path.service";
import { Location } from '@angular/common';
import { BreadcrumbService } from 'src/app/core/breadcrumb/breadcrumb.service';

@Component({
  selector: 'app-ddr-compare-flowpath',
  templateUrl: './ddr-compare-flowpath.component.html',
  styleUrls: ['./ddr-compare-flowpath.component.css']
})

export class DdrCompareFlowpathComponent implements OnInit {
  selectedFilter =
    'Tier=RHEL,BT=/DashboardService/RestService,StartTime=06/26/20 16:40:00, EndTime=06/26/20 20:38:56, BT Type=All';
showMCT:boolean=false;
showHotspot:boolean=false;
showDB:boolean=false;
showMT:boolean=true;
loading: boolean = false;
// @Input('comparedFpInfo') compareFPInfo;
showExceptions:boolean=false;
//showTF1:boolean=false;
//showTF2:boolean=false;
txndataToDraw:Object[]=[];
queryParams:Object[]=[];
cols:any[]=[];
  compareFPInfo: any;
  // breadcrumb: { label: string; }[];
  breadcrumb: BreadcrumbService;
  columns: any[];
// compareFPInfo: any[];
  constructor(
    // private flowmapData: DdrTxnFlowmapDataService,
        private commonServices:CommonServices, 
        private ddrRequest:DDRRequestService, private router: Router, private loaction: Location,
        breadcrumb: BreadcrumbService) {
          this.breadcrumb = breadcrumb;
         }

  ngOnInit() {
    this.commonServices.isToLoadSideBar=false;
    this.loading = false;
     this.cols = [
        { field: 'tierName', header: 'Tier', sortable: true, action: false , width: '75'},
        { field: 'serverName', header: 'Server', sortable: true, action: false , width: '75' },
        { field: 'appName', header: 'Instance', sortable: 'custom', action: false , width: '75' },
         { field: 'flowpathInstance', header: 'FlowpathInstance', sortable: 'custom', action: true , width: '150'},
        { field: 'urlName', header: 'Business Transaction', sortable: true, action: true , width: '200'},       
        { field: 'urlQueryParamStr', header: 'URL', sortable: true, action: true , width: '250'},
        { field: 'btCatagory', header: 'Category', sortable: true, action: true , width: '75'},
        { field: 'startTime', header: 'Start Time', sortable: 'custom', action: true , width: '130'},
        { field: 'fpDuration', header: 'Response Time(ms)', sortable: 'custom', action: true , width: '75'},
        { field: 'btCpuTime', header: 'CPU Time(ms)', sortable: 'custom', action: true , width: '75'},
        { field: 'methodsCount', header: 'Methods', sortable: 'custom', action: true , width: '75'},
        { field: 'callOutCount', header: 'CallOuts', sortable: 'custom', action: true , width: '75'},
        { field: 'totalError', header: 'CallOut Errors', sortable: 'custom', action: true , width: '75'},
        { field: 'dbCallCounts', header: 'DB Callouts', sortable: 'custom', action: true , width: '75'},
        { field: 'statusCode', header: 'Status', sortable:'custom', action: true , width: '75'},
        { field: 'correlationId', header: 'Corr ID', sortable:'custom', action: false , width: '75'},
        { field: 'ndSessionId', header: 'ND Session ID', sortable:'custom', action: false , width: '75'},
        { field: 'nvPageId', header: 'NV Page ID', sortable:'custom', action: false , width: '75' },
        { field: 'coherenceCallOut', header: 'Coherence CallOut', sortable:'custom', action: false , width: '75'},
        { field: 'jmsCallOut', header: 'JMS CallOut', sortable:'custom', action: false , width: '75'},
        { field: 'nvSessionId', header: 'NV Session ID', sortable:'custom', action: false , width: '75'},
        { field: 'waitTime', header: 'Wait Time(ms)', sortable:'custom', action: false , width: '75'},
        { field: 'syncTime', header: 'Sync Time(ms)', sortable:'custom', action: false , width: '75'},
        { field: 'iotime', header: 'IO Time(ms)', sortable:'custom', action: false , width: '75'},
        { field: 'suspensiontime', header: 'Suspension Time(ms)', sortable:'custom', action: false , width: '75'},
        { field: 'storeId', header: 'Store ID', sortable:'custom', action: false , width: '75'},
        { field: 'terminalId', header: 'Terminal ID', sortable:'custom', action: false , width: '75'}

      ];
      this.breadcrumb.add({label: 'Comapare Flowpath', routerLink: '/ddr/DdrCompareFlowpath'});
      // this.breadcrumb = [
      //   { label: 'Home' },
      //   { label: 'System' },
      //   { label: 'Drill Down Flow Paths Compare' },
      // ];

      this.compareFPInfo = this.commonServices.compareFlowpathData;
      console.log("COMPARE DATA ===compareFPInfo=> ", this.compareFPInfo);
     /* this.visibleCols = [
        'urlName','urlQueryParamStr','btCatagory','startTime','fpDuration','btCpuTime','methodsCount','callOutCount',
        'dbCallCounts','statusCode'
      ];*/
   // console.log("ngOnInit",this.compareFPInfo);
   /* this.commonServices.compareFPTXNDataObservable$.subscribe((data)=>
    {
        console.log("transaction flow data");
        this.txndataToDraw.push(data['txnData']);
        this.queryParams.push(data['queryParams']);
         if(this.txndataToDraw.length ==1)
         {
         this.showTF1=true;
           this.flowmapData.getDataForTxnFlowpath(this.compareFPInfo[1].flowpathInstance,this.compareFPInfo[1]);
         }
         else if(this.txndataToDraw.length ==2)
          this.showTF2=true;
        
    });*/
    // this.ngOnChanges();
    // this.columns = [
    //     { field: 'flowpathInstance', header: 'FlowpathInstance', sortable: 'custom', action: true , width: '100'},
    //     { field: 'businessTransaction', header: 'Business Transaction', sortable: true, action: true , width: '120'},       
    //     { field: 'url', header: 'URL', sortable: true, action: true , width: '190'},
    //     { field: 'catagoryName', header: 'Category', sortable: true, action: true , width: '70'},
    //     { field: 'startTime', header: 'Start Time', sortable: 'custom', action: true , width: '90'},
    //     { field: 'responseTime', header: 'Response Time(ms)', sortable: 'custom', action: true , width: '115'},
    //     { field: 'cpu', header: 'CPU Time(ms)', sortable: 'custom', action: true , width: '85'},
    //     { field: 'methods', header: 'Methods', sortable: 'custom', action: true , width: '65'},
    //     { field: 'callOuts', header: 'CallOuts', sortable: 'custom', action: true , width: '65'},
    //     { field: 'totalError', header: 'CallOut Errors', sortable: 'custom', action: true , width: '85'},
    //     { field: 'dbCallouts', header: 'DB Callouts', sortable: 'custom', action: true , width: '70'},
    //     { field: 'status', header: 'Status', sortable:'custom', action: true , width: '70'},
    // ];
  }

  ngOnChanges() {
    //this.commonServices.isToLoadSideBar = true;
    this.loading = true;
    this.txndataToDraw=[];
    this.queryParams=[];
   console.log("ngOnChanges",this.compareFPInfo);
   // this.showTF1=false;
   // this.showTF2=false;
  this.handleChange({'index':0});
  }
  handleChange(event)
  {
    console.log(event.index);
   /* if(event.index ==0)
    {
      this.getTransactionFlowData();
    }*/
    if(event.index == 0)
      this.showMT=true;
    else if(event.index == 1)
      this.showDB=true;
    else if(event.index == 2)
      this.showMCT=true;
    else if(event.index==3)
      this.showHotspot=true;
    else if(event.index==4)
      this.showExceptions=true;
  }
getTransactionFlowData()
{
  //  this.flowmapData.getDataForTxnFlowpath(this.compareFPInfo[0].flowpathInstance,this.compareFPInfo[0]);
   //console.log("transaction flow 1 data",this.flowmapData.getParsedJson());
  // this.txndataToDraw.push( this.flowmapData.getParsedJson());
   
 
   // console.log("transaction flow 2 data",this.flowmapData.getParsedJson());
  // this.txndataToDraw.push( this.flowmapData.getParsedJson());
  // console.log(this.txndataToDraw);
  //  this.showTF=true;
}
  back() {
    this.loaction.back();
  }
}
