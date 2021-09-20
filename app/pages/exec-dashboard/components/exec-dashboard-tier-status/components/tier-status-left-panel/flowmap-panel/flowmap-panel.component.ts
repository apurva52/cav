import { ExecDashboardChartProviderService } from './../../../../../services/exec-dashboard-chart-provider.service';
import { Component, Renderer2, ElementRef, ViewChild, AfterViewInit, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FlowchartComponent } from './flowchart/flowchart.component';
import { jsPlumbToolkit, Surface } from 'jsplumbtoolkit';
import { jsPlumbService } from 'jsplumbtoolkit-angular';
import { Subscription, from } from 'rxjs';

import { TierStatusDataHandlerService } from '../../../services/tier-status-data-handler.service';
import { TierStatusMenuHandlerService } from '../../../services/tier-status-menu-handler.service';
import { TierStatusCommonDataHandlerService } from '../../../services/tier-status-common-data-handler.service';
import { ExecDashboardConfigService } from './../../../../../services/exec-dashboard-config.service';
import { ExecDashboardCommonRequestHandler } from './../../../../../services/exec-dashboard-common-request-handler.service';
import { TierStatusTimeHandlerService } from '../../../services/tier-status-time-handler.service';
import { ExecDashboardDownloadService } from './../../../../../services/exec-dashboard-download.service';
import { ConfirmationService,MessageService } from 'primeng';
import {
  TIER_INFO_JSON, CRITICAL, NORMAL, IP_NORMAL, MAJOR, RENAME_GROUP,
  DELETE_GROUP, TIER_INFO, DEFAULT_FLOWMAP, RENAME_FLOWMAP,
  SAVE_ONLINE_FLOWMAP, SAVE_FLOWMAP_COORDINATES, RENAME_TIERNAME,
  SHARED_FLOWMAP, DELETE_FLOWMAP, ONLINE_COPY_FLOWINFO, GLOBAL_RENAMING,
  nonZeroIP
} from '../../../const/url-const';
import { ExecDashboardUtil } from '../../../../../utils/exec-dashboard-util';
import {
  Router, ActivatedRoute, Params,
  Event as RouterEvent,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError
} from '@angular/router'
import { ObjectKeys } from '../../../utils/ts-enum';

//Importing DdrDataModelService to set values for ddr Data
import { SelectItem } from 'primeng/primeng';
import { CavConfigService } from 'src/app/pages/tools/configuration/nd-config/services/cav-config.service';
import { DdrDataModelService } from 'src/app/pages/tools/actions/dumps/service/ddr-data-model.service';
import { DashboardService } from 'src/app/shared/dashboard/service/dashboard.service';

@Component({
  selector: 'app-flowmap-panel',
  templateUrl: './flowmap-panel.component.html',
  styleUrls: ['./flowmap-panel.component.css']
})
export class FlowmapPanelComponent implements AfterViewInit, OnInit {

  @ViewChild(FlowchartComponent) flowchart: FlowchartComponent;
  @ViewChild('ctrlMenu') panelMenu: any;
  @ViewChild('overlay') overView: any;
  tpsDdisplayModal : boolean;
  resposnHeader : string = 'Tps';




  toolkitId: string; // Contains the toolkitID of jsplumb-toolkit
  toolkit: jsPlumbToolkit; // contains jsplumb-toolkit object. we can access all the nodes, edges, etc using toolkit object
  toolkitParams: Object;
  isAdminUser : boolean = false;
  // jsonObject: any[] = [];
  dataSubscription: Subscription; // subscriber responsible to catch all the actions performed with flowmap like rightclicked, showdashboard, etc.
  rightClickSubscription: Subscription; // subscriber assigns _dataHandlerService.$rightClickNode -> the complete node object
  tierStatusData: any; // Contains all the node data available for current time period
  nodesArray: any[] = []; // contains all the sources and targets of all the nodes
  nodeInterval: any; // This contains the slideshow connection interval object
  surface: Surface; // contains the jsplumb-surface object. Used in autofit, circular, zoom, etc.
  surfaceId: any = 'flowchartSurface'; // this value never changes. It is used to get the jsplumb surface object

  groupTierToggle: boolean = false; // Flag to show/hide the un(group) dialog
  tierList: any[] = []; // contains all the non-filtered tiers
  tierToGroupList: any[] = []; // unused variable
  groupList: any[] = []; // holds all the available groups
  selectedTierGroup: string = '';
  isCreateGrp: boolean = false;
  newGrpName: string = '';
  globalData: any;
  fullFlowMapData: any;
  sShowCurrentNode: string = '';
  tierInfoToggle: boolean = false;
  groupDialogHeader: string = '';
  sourceHeader: string = '';
  targetHeader: string = '';
  flowmapList: any[] = [];
  selectedFlowMap: string = 'default';
  copyFlowmapToggle: boolean = false;

  newFlowmapName: string = '';
  responseTime: string = '';
  symbolList: any[] = [];
  configureFlowmapToggle: boolean = false;
  renameIPToggle: boolean = false;
  showIpDialog: boolean = false;
  // table data for ps
  tableArr = [];
  // charts data 
  chartsData = [];
  // server info
  serverInfo: any
  // table data for top 10 BT transactions.
  BTtableArr = [];
  btDetailArr = [];
  objectKeys = ObjectKeys;

  // TierList (excluding groups and IPs)
  tierListExGroup: any[] = [];
  tierListUnGroup: any[] = [];
  tierListExInstances: any[] = [];
  tiersList: any[] = [];
  unGroupTiersList: any[] = [];

  //for creating clone of last saved hidden/visible tier
  visiTier = [];
  hideTier = [];

  // hide integration tiers.
  hideIntegrationTiersList: Object = {};
  isfilter: boolean = false;

  dbItems: any = [];
  nodeInfo: any = [];

  //to open undo renaming dialog
  isUndoRenamingDialog: boolean = false;
  
  //to show renamed ip names in data table
  renamedIPArr = [];
  selectedIP = [] // to show selected IP anmes from Undo Renaming dialog
  emptyTable : boolean = true;
   //Flag to show Full Flowmap on basis of flag : dbClickflag ,if it is true then show FullFlowMap of selected Tier otherwise don't
   dbClickflag: boolean;
   isUptoNlevel: boolean;

   // code by santosh maurya
   tabpanel: boolean = false;
   tabpanelBtn: boolean = false;
   isLegenddisplay :boolean = false;
   entityLevel: string= "Instance";
   disbleTooltip:boolean=false; //to show/hide tier info dialog tooltip bug 85119
  tierName: any;
  

   clickEvent(){
    this.tabpanel = !this.tabpanel;  
    this.tabpanelBtn = !this.tabpanelBtn;
    this.isLegenddisplay = true;     
    }

  items = [
    {
      "label": "DrillDown",
      "items": [
        { "label": "Flowpaths By Response Time" },
        { "label": "Flowpaths By Callout Error" },
        {
          "label": "DB Queries", "items": []
        },
        { "label": "Hotspots" }, { "label": "Methods By Response Time" },
        { "label": "Exceptions" },
        { "label": "BT IP Summary" }
      ]
    },
    {
      "label": "Top 10 Transactions By",
      "items": [
        { "label": "TPS" },
        { "label": "Response" }
      ]
    },
    {
      "label": "Group",
      "items": [
        { "label": "Group Tier" }
      ]
    },
    { "label": "Show Dashboard" },
    { "label": "Show Tier Info" },
    {
      "label": "Show Flowmap For Selected Tier",
      "items": [
        { "label": "upto 1 level" },
        { "label": "upto n level" }
      ]
    },
    { "label": "Hide Tier Integration" },
    { "label": "Change Icon" },
    { "label": "Instance Recycle History" },
    { "label": "Search By" }
  ];

  non_jsp_items = [ // made a duplicate of item array buz of bug 81119(hiding JSP page).
    {
      "label": "DrillDown",
      "items": [
        { "label": "Flowpaths By Response Time" },
        { "label": "Flowpaths By Callout Error" },
        {
          "label": "DB Queries", "items": []
        },
        { "label": "Hotspots" }, { "label": "Methods By Response Time" },
        { "label": "Exceptions" },
        { "label": "BT IP Summary" }
      ]
    },
    {
      "label": "Top 10 Transactions By",
      "items": [
        { "label": "TPS" },
        { "label": "Response" }
      ]
    },
    {
      "label": "Group",
      "items": [
        { "label": "Group Tier" }
      ]
    },
    { "label": "Show Dashboard" },
    { "label": "Show Tier Info" },
    {
      "label": "Show Flowmap For Selected Tier",
      "items": [
        { "label": "upto 1 level" },
        { "label": "upto n level" }
      ]
    },
    { "label": "Hide Tier Integration" },
    { "label": "Change Icon" },
    { "label": "Search By" }
  ];

  item2 = [{ "label": "DrillDown", "items": [{ "label": "Flowpaths By IP Response Time" }, { "label": "Flowpaths By IP" }, { "label": "Call Details" }] }, { "label": "Rename Integration Point" }, { "label": "Map Integration Point To Tier" }, { "label": "Change Icon" }, { "label": "Hide Integration Point" }, { "label": "Reset Integration Point Names" },{ "label": "Rename multiple IP(s)" }];

  item3 = [
    {"label": "DrillDown",
    "items": [
      { "label": "Flowpaths By Response Time" },
      { "label": "Flowpaths By Callout Error" },
      {
        "label": "DB Queries", "items": []
      },
      { "label": "Hotspots" },
      { "label": "Methods By Response Time" },
      { "label": "Exceptions" },
      { "label": "BT IP Summary" }
    ]
  },
  {
    "label": "Top 10 Transactions By",
    "items": [
      { "label": "TPS" },
      { "label": "Response" }
    ]
  },
  { "label": "Open Full Flowmap" },
  { "label": "Show Dashboard" }
];

  item4 = [{ "label": "DrillDown" }];

  NdItem = [
    { "label": "Show Flowmap For Selected Tier" },
    { "label": "Change Icon" },
    { "label": "Hide Tier Integration" },
    { "label": "Show Tier Info" },
    { "label": "Show Dashboard" }];

  logicalEntityItems = [
    { "label": "Rename Integration  Point" },
    { "label": "Map Integration Point To Tier" },
    { "label": "Change Icon" },
    { "label": "Hide Integration Point" }];

  drillDownItems: any = [];
  // item on which drill down occured 
  // selectedMenuNode: string = '';
  // selectedMenuActualNameNode: string = '';
  // previous value
  previouslySelectedNodeForSelectedTier: string = '';
  previouslySelectedNodeForGroup: string = '';
  previouslySelectedNodeForDashboard: string = '';
  uploadedFile: any = '';

  selectedFlowMapList: string[] = [];
  defaultFlowmap: string ;
  systemDefaultFlowmap : string ;
  selectedRows = [];

  //map integration flag to show/hide
  mapIntPointToggle = false;
  mapIntPtTiers;
  selectedNewName: string = ''; // this is bind with the map integration point to tier dropdown selected item

  configTps: string = '';
  configRes: string = '';
  configCpu: string = '';
  drpTps: string = '>=';
  drpCpu: string = '>=';
  drpRes: string = '>=';
  // hiddenTiers: any = [];
  newObject: any = [];
  transType = 0;
  className: string = 'FlowmapPanelComponent';

  paramObj: any = {};
  typeStr: string = '';
  uploadUrl: string = '';
  rightClickedNode: string = "";
  cUnit = 'Calls/Sec';

  //  for new custom dialog
  showDialog: boolean = false;
  dialogHeader: string;
  dialogFooter: string;
  dialogPropertyObject: Object = {};

  showRenameGroup: boolean = false;
  renamedGroupName: string;

  labelCharacters: number = 15;
  callsUnit: any = 'seconds'

  showDeleteGroup: boolean = false;
  tierToHideList: any[] = [];
  configuredTierList: any[] = [];
  _selectedDCList: string[] = [];
  _selectedDC: string = '';
  isInstanceLevel = false;
  all_selected: boolean = false;//All select option in ManageDialogBox

  constructor(public _dataHandlerService: TierStatusDataHandlerService, private $jsplumb: jsPlumbService,
    private elementRef: ElementRef, private http: HttpClient, private _chartProvider: ExecDashboardChartProviderService,
    public _menuHandler: TierStatusMenuHandlerService,
    public _tsCommonHandler: TierStatusCommonDataHandlerService,
    private router: Router, private _cavConfig: CavConfigService,
    private renderer: Renderer2,
    private _config: ExecDashboardConfigService,
    private _commonRequestHandler: ExecDashboardCommonRequestHandler,
    private _timeHandler: TierStatusTimeHandlerService, private _ddrData: DdrDataModelService,
    private _execDashboardUtil: ExecDashboardUtil,
    private confirmationService: ConfirmationService,
    public _downloaddService: ExecDashboardDownloadService,
    private _dashboardService : DashboardService,
    private messageService:MessageService) {
    this.toolkitId = 'flowchart'; // this.elementRef.nativeElement.getAttribute('toolkitId');
    // Getting data from time period
    this.rightClickSubscription = this._dataHandlerService.$rightClickObs.subscribe(res => {
      this._dataHandlerService.$rightClickNode = res; // setting the jsplumb node object right clicked
    })
    this.dataSubscription = this._dataHandlerService.$tsProvider.subscribe(data => {
      if (data === 'AUTO_LAYOUT' || data === 'AUTO_FIT_LAYOUT' || data === 'CIRCULAR_LAYOUT') {
        this.handleLftPanelAction(data);
      }
      else if (data === 'TOGGLE_SELECTION') {
        if(this._tsCommonHandler.$_isFullFlowPath)
          this.dbClickflag = true;
        else{
          this.dbClickflag = false;
        }
        const prevSelectedNode = this.sShowCurrentNode.toString();
        this.sShowCurrentNode = this._dataHandlerService.$selectedMenuNode;
        // this.jsonObject['edges'] = [];  need to think about it.
        if (prevSelectedNode == this._dataHandlerService.$selectedMenuNode) {
          this.slideShowConnections();
        } else {
          this.setConnectionCallToggle(false); // disable slideshow
          this.updateEdges(); // show connections
        }
        this._dataHandlerService.getTierData();
        let _: { item: any } = { item: {} };
        _['item']['label'] = 'showdashboard';
        if (this._dataHandlerService.$showDashboard) {
          this.handleDrillDown(_);
        }
      }
      // on changes in connection type by radio button
      else if (data === 'CONNECTION_CLICK') {
        this.onConnectionChanges();
      }
      // on changes in value type (current/average) by radio button
      else if (data === 'VALUE_TYPE_CHANGE') {
        /**  need to make changes in value type - current/average & calling service
         * and redrawing flowmap
         */
        this.getFlowmapDatafromServer();
      }
      else if (data == "SEARCH_NODES") { // calls from left-panel component to get visible nodes
        let nodes = this.toolkit.getNodes();
        this._dataHandlerService._config.emmitSubscription({message: "GET_NODES_FROM_FLOWMAP", data: nodes});
      }
      else if (data === 'FLOWMAP_CHANGED') {
        this.toolkit.clear()
        this.getFlowmapDatafromServer();
      }
      else if (data == 'FROM_STORE_VIEW') {
        this._dataHandlerService.$isStoreView = true;
        this._dataHandlerService.getOnlineFlowMapList(() => {
          this._dataHandlerService.getDataForFirstCall(() => { this.getFlowmapDatafromServer(); this.handleLftPanelAction('AUTO_FIT_LAYOUT') });
        });
      }
      else if (data == 'MULTIDC') {
        this.toolkit.clear();
        this._dataHandlerService.getOnlineFlowMapList(() => {
          this._dataHandlerService.getDataForFirstCall(() => { this.getFlowmapDatafromServer(); this.handleLftPanelAction('AUTO_FIT_LAYOUT') });
        });
      }
      else if (data == 'REFRESH_DATA') {
        if(this._dataHandlerService.continuousMode)
          this.runInContinuousMode()
      }
      else if (data['msg'] === 'OUTPUT_NODE_RIGHT_CLICK' || data['msg'] === 'ACTION_NODE_RIGHT_CLICK') {
        //Code to Show Tier Integration and Hide Tier Integration on basis of node present in hideIntegrationTiersList
        let name = data['obj']['name'];
        let tempItem;
        if (data['obj']['entity'] == '0') {
		  this._dataHandlerService.isNonNd = false;
	      let securityMode = sessionStorage.getItem('enableSecurityMode');
          if(securityMode == '1'){
            tempItem = this.non_jsp_items;
          }
          else{
            tempItem = this.items;
          }
          let data = this._dataHandlerService.$hideIntegrationTiersList
          //Handling label on basis of state of selectedMenu Node
          if (this._dataHandlerService.hideTierIntForselectedMenuNode) {
            tempItem[6]['label'] = 'Show Tier Integration';
          }
          else if (!this._dataHandlerService.hideTierIntForselectedMenuNode) {
            if (this._dataHandlerService.$hideIntegrationTiersList.hasOwnProperty(name)) {
              tempItem[6]['label'] = 'Show Tier Integration';
            }
            else {
              tempItem[6]['label'] = 'Hide Tier Integration';
            }
          }
        }
        this.panelMenu.show(data['event']);
        if (data['msg'] === 'OUTPUT_NODE_RIGHT_CLICK') {
          this.isInstanceLevel = data['isInstanceLevel']
          this._dataHandlerService.$selectedMenuNode = data['obj']['id'];
          this._dataHandlerService.$selectedMenuActualNameNode = data['obj']['actualTierName'];
          this._dataHandlerService.$selectedMenuNodeEntity = data['obj']['entity'];
          this.rightClickedNode = data['obj']['actualTierName'];
          let tempItem = this.item2.slice();
          if (this._tsCommonHandler.flowMapMode == '2') {
            let tempInstance = this._dataHandlerService.$tierStatusData['callData'][0]['actualTierName'];
            if (tempInstance === this._dataHandlerService.$selectedMenuNode) {
              tempItem = this.item3.slice();
              if (_dataHandlerService.$showDashboard && this._dataHandlerService.$selectedMenuNode === this.previouslySelectedNodeForDashboard) {
                tempItem[tempItem.length-1]['label'] = 'Hide Dashboard';
              }
              else {
                // Show Dashboard
                tempItem[tempItem.length-1]['label'] = 'Show Dashboard';
              }
              if( this._dataHandlerService.isNonNd)
                tempItem.splice(0,2);
              else
	    this.onTierRightClick(data['obj'].actualTierName, tempItem)
            }
            else {
              tempItem = this.item4;
            }
          }
          else {

          }
          //for logical entity type
          if (data['obj']['entity'] == 4) {
            tempItem = this.logicalEntityItems;
          } else if (data['obj'].entity == 3) {
            tempItem = this.removeItemsForJMSType(tempItem);
          }
          // add event to item
          this.drillDownItems = this.addEventToItems(tempItem);
        }
        else if (data['msg'] === 'ACTION_NODE_RIGHT_CLICK') {

          //for context menu items(db related)
          // if (data['obj'].entity == 0) {
          //   this.onTierRightClick(data['obj'].actualTierName, this.items)
          // }
          // this._dataHandlerService.$rightClickObs.subscribe(res => {
          //   this._dataHandlerService.$rightClickNode = res; // setting the jsplumb node object right clicked
          // })

          this.rightClickedNode = data['obj']['name'];
          this._dataHandlerService.$selectedMenuNode = data['obj']['id'];
          this._dataHandlerService.$selectedMenuActualNameNode = data['obj']['actualTierName'];
          this._dataHandlerService.$selectedMenuNodeEntity = data['obj']['entity'];
          this._dataHandlerService.$selectedNodeDCName = data['obj']['dc'];
	        let tempItem;
          //let tempItem = this.items;
	        let securityMode = sessionStorage.getItem('enableSecurityMode');
          if(securityMode == '1'){ 
            tempItem = this.non_jsp_items;
          }
          else{
            tempItem = this.items;
          }
          if (data['obj'].hasOwnProperty('groupName')) {
            tempItem[2]['items'] = [];
            tempItem[2]['items'].push({ 'label': 'UnGroup Tier' });
            tempItem[2]['items'].push({ 'label': 'Rename Group' });
            tempItem[2]['items'].push({ 'label': 'Delete Group' });
          } else {
            tempItem[2]['items'] = [];
            tempItem[2]['items'].push({ 'label': 'Group Tier' });
          }
          if (this._dataHandlerService.$selectedMenuNode === this.previouslySelectedNodeForSelectedTier && this._dataHandlerService.$isSingleTierMode == true) {
            tempItem[5]['label'] = 'Show Full Flowmap';
            delete tempItem[5]['items'];
          }
          else {
            tempItem[5]['label'] = 'Show Flowmap For Selected Tier';
            tempItem[5]['items'] = [
              { "label": "upto 1 level" },
              { "label": "upto n level" }
            ]
          }
          if (_dataHandlerService.$showDashboard && this._dataHandlerService.$selectedMenuNode === this.previouslySelectedNodeForDashboard) {
            tempItem[3]['label'] = 'Hide Dashboard';
          }
          else {
            // Show Dashboard
            tempItem[3]['label'] = 'Show Dashboard';
          }

          // For non nd type tiers.
          if (data['obj']['entity'] === 1) {
            tempItem = this.NdItem;
            this._dataHandlerService.isNonNd = true;
            
            if (this._dataHandlerService.$selectedMenuNode === this.previouslySelectedNodeForSelectedTier) {
              tempItem[0]['label'] = 'Show Full Flowmap';
            }
            else {
              tempItem[0]['label'] = 'Show Flowmap For Selected Tier';
            }
            if (this._dataHandlerService.$hideIntegrationTiersList.hasOwnProperty(name)) {
              tempItem[2]['label'] = 'Show Tier Integration';
            }
            else {
              tempItem[2]['label'] = 'Hide Tier Integration';
            }
	    //to handle show/hide dashboard of non nd tiers 
            if (_dataHandlerService.$showDashboard && this._dataHandlerService.$selectedMenuNode === this.previouslySelectedNodeForDashboard) {
              tempItem[4]['label'] = 'Hide Dashboard';
            }
            else {
              // Show Dashboard
              tempItem[4]['label'] = 'Show Dashboard';
            }
          }
          else if (data['obj'].entity == 0) {
            if(securityMode != '1')
              tempItem = this.onTierRightClick(data['obj'].actualTierName, this.items)
            else
              tempItem = this.onTierRightClick(data['obj'].actualTierName, this.non_jsp_items)
          }
          // addEventToItems
          this.drillDownItems = this.addEventToItems(tempItem);
          this.paramObj = { ...(data as object)};
        }
      }
      else if (data['msg'] === 'OPEN_ACTION_OVERLAY') {
        this.transType = 0;
        this.showOverlay(data, this.transType);
      }
      else if (data['msg'] === 'CALL_DETAILS_IP') {
        this.showIpDialog = true;
	this.isfilter = false;
        if(this.cUnit == "Calls/Min"){
          let newData = data['data'];
            for(let i = 0; i< newData.length; i ++){

              newData[i].cps = newData[i].cps / 60
              
            }

            data['data'] = newData;
        }
        this.tableArr = data['data'];
      }
      else if (data['msg'] === 'TIMEPERIOD_CHANGED') {
        this.getFlowmapDatafromServer();
      }
      else if (data['msg'] === 'REFLECT_LAYOUT') {
        this._tsCommonHandler.filterData((filtereddata) => {
          this.fullFlowMapData = this.createJsonForTierStatus(filtereddata);
          let tempData = Object.assign({}, this.fullFlowMapData);
          tempData['edges'] = [];
          this.loadToolkit(tempData)

        }, data['json'], this._dataHandlerService.$selectedFlowmap);
      }
      else {
        this._dataHandlerService.getOnlineFlowMapList(() => {
          this._dataHandlerService.getDcInfo((data) => {
            if (data == null) return;
            this.getDefaultTierInfoCall(() => { });
          });
        });
      }
    });
  } // end of construtor.

  getDefaultTierInfoCall(callback) {
    this._dataHandlerService.getTierStatusDataFromServer((d) => {
      this.fullFlowMapData = this.createJsonForTierStatus(d);
      this.showDefaultConnections();
      callback();
    });
  }

  ngOnInit() {
    // this.isAdminUser = sessionStorage.getItem('isAdminUser');
    this.isAdminUser = this._dashboardService.getUserPermissions();
    this._dataHandlerService.$showDashboard = false
    // This code gets the id of jsplumb and gets the instance through which we fill data
    this.toolkit = this.$jsplumb.getToolkit(this.toolkitId, this.toolkitParams);
    
    if(this._dataHandlerService.$selectedMenuNode != ''){ // to keep track of previously selected node
      this.previouslySelectedNodeForSelectedTier = this._dataHandlerService.$selectedMenuNode;
    }
    // clearing the flowmap
    this.toolkit.clear();
    this.toolkitParams = {
      nodeFactory: (type: string, data: any, callback: Function) => {
        // REMOVED CODE
      },
      beforeStartConnect: (node: any, edgeType: string) => {
        return { label: '...' };
      }
    };

    if (sessionStorage.getItem('isMultiDCMode') == "true") {
      this._tsCommonHandler.flowMapDir = '.flowmapsAll';
      this._dataHandlerService.getDcInfo((data) => {
        if (data == null) return;
        this._dataHandlerService.getOnlineFlowMapList(() => {
          this._dataHandlerService.getOnlineFlowmapInfo((data) => {
            if (data != undefined && data != true) {
              let jsonStructure = this._dataHandlerService.stringToJSON(data);
              this._tsCommonHandler.updateServiceParameters(jsonStructure);
            }
            // else {
            //   this._tsCommonHandler.cleanServiceParameters();
            // }
              this._dataHandlerService.getDataForFirstCall(() => this.getFlowmapDatafromServer());
	    });
        })
      });
    } else {
      this._tsCommonHandler.flowMapDir = '.flowmaps';
      this._dataHandlerService.getOnlineFlowMapList(() => {
        this._dataHandlerService.getOnlineFlowmapInfo((data) => {
          if (data != undefined && data != true) {
            let jsonStructure = this._dataHandlerService.stringToJSON(data);
            this._tsCommonHandler.updateServiceParameters(jsonStructure);
          }
          //else {
          //  this._tsCommonHandler.cleanServiceParameters();
          //}
           this._dataHandlerService.getDataForFirstCall(() => this.getFlowmapDatafromServer());
        });
      })
    }


    // For default drilldwn
    // this.drillDownItems = this.items;
    // this._menuHandler.resetDDRArguments();//to reset ddrdata after flowmap load
  }

  ngOnDestroy(): void {
    // closing the slideshow connection
    this.setConnectionCallToggle(false);
    this.rightClickSubscription.unsubscribe();
    this.dataSubscription.unsubscribe();
    sessionStorage.EDSelectedFlowmap = undefined;
  }

  getFlowmapDatafromServer(isFromInstance?: boolean, urlPath?: string) {
    console.log('isFromInstance ',isFromInstance,' urlPath ',urlPath);
    if (this._tsCommonHandler.flowMapMode !='2') 
      this.disbleTooltip = false;
    this._dataHandlerService.$noLoadDetected = false;
    let tempFlowmapName = this._dataHandlerService.$selectedFlowmap;
    let tempReqVecName = this._tsCommonHandler.reqVecName;
    let tempLoginName = this._config.$userName;
    if (this._tsCommonHandler.flowMapMode == '2') {
      tempFlowmapName = tempFlowmapName + '/' + this._tsCommonHandler.reqVecName + '/Server/Instance/';
      tempLoginName = tempReqVecName + '/Server/Instance/';
    }

    let url = this._config.$getHostUrl + TIER_INFO + `?GRAPH_KEY=${this._config.$actTimePeriod}&reqTestRunNum=${this._config.$testRun}&sessLoginName=${tempLoginName}&valueType=${this._tsCommonHandler.valueType}&flowMapName=${tempFlowmapName}&dcName=${this._tsCommonHandler.dcName}&resolution=${this._tsCommonHandler.resolution}&serverType=${this._tsCommonHandler.serverType}&nonZeroIP=${this._tsCommonHandler.nonZeroIP}&globalRenaming=${this._tsCommonHandler.globalRenaming}&isAll=${this._tsCommonHandler.dcName}&isIncDisGraph=${this._config.$isIncDisGraph}`
      + `&reqVecName=${tempReqVecName}`;
    url = this._dataHandlerService.getMultiDCsUrl(this._cavConfig.$eDParam);
    if (this._dataHandlerService.$isStoreView) {
      url = this.replaceUrlParam(url, "dcName", this._cavConfig.$eDParam.dcName)
      url = this.replaceUrlParam(url, "isAll", this._cavConfig.$eDParam.dcName)
      url = this.replaceUrlParam(url, "reqTestRunNum", this._cavConfig.$eDParam.testRun)
      url += `&ofn=${this._cavConfig.$eDParam.ofn}&appName=${this._cavConfig.$eDParam.appName}&storeName=${this._cavConfig.$eDParam.storeName}&storeAlertType=${this._cavConfig.$eDParam.storeAlertType}&strSpecialDay=${this._cavConfig.$eDParam.strSpecialDay}`
    }
     if (this._tsCommonHandler.flowMapMode == '2' && isFromInstance == undefined) {
       url = this.replaceUrlParam(url, "dcName", sessionStorage.instanceDC);     //for bug 77997
       console.log("flowMapMode is" ,this._tsCommonHandler.flowMapMode, "Dc name is ",sessionStorage.instanceDC);
       url = url + `&requestType=instanceFlowMap`
     }
    if (urlPath && urlPath.trim().length) {
      url = urlPath;
    }
    if (this._dataHandlerService.$flowmapLoadedFirstTime) { // checking if flowmap loaded for first time
      url += '&firstTimeLoaded=true';
      this._dataHandlerService.$flowmapLoadedFirstTime = false; // setting tier status loaded for first time to false
    }
    this._execDashboardUtil.progressBarEmit({ flag: true, forceWait: true });
    this.http.get(url + `&productKey=${this._config.productKey}`).pipe(res => <any>res).subscribe((data) => {
      if (data.hasOwnProperty('nodeInfo') && data['nodeInfo'].length) {
        this.storeFlowmapData(data);
        this.groupList = ExecDashboardUtil.createSelectItem(this._dataHandlerService.$groupList);
        this.flowmapList = ExecDashboardUtil.createSelectItem(this._dataHandlerService.$flowmapList);
        this._tsCommonHandler.lastSampleTime = data['endTimeStamp'];
        this._dataHandlerService.$noLoadDetected = false;
      } else {
        data = {}
        this.fullFlowMapData = {}
        this._dataHandlerService.$noLoadDetected = true;
        this.toolkit.clear();
      }
      this.tierStatusData = data;

      let isRunning:boolean=false;
      //to disable refresh in case of offline test
      if(data.hasOwnProperty('isRunning'))
        isRunning = data['isRunning'].toLowerCase().includes("true")?true:false;
      else
        isRunning = true;      

      /*to take final  decision on the basis of isRunning and GraphTimeKey
       continous mode is not available in case of
       1. Event Day
       2. Yesterday
       3. Last Week Same Day
       4. Custom Date
      */
       let isRunningTime = true;
       if(sessionStorage.EDappliedTimePeriodKey)
        isRunningTime= sessionStorage.EDappliedTimePeriodKey.toLowerCase().includes('last') && !sessionStorage.EDappliedTimePeriodKey.toLowerCase().includes('week');
       this._dataHandlerService.continuousMode = isRunning && isRunningTime;
       console.log("ContinuousMode: ", isRunning && isRunningTime);

      this._dataHandlerService.$tierStatusData = data;
      this._tsCommonHandler.filterDataBasedOnOptions((data) => {
        this.fullFlowMapData = this.createJsonForTierStatus(data);
        // Code to slice data from fullFlowMapData if any selected node tier Integration is present in hideIntegrationTiersList
        let selectedNodeList = Object.keys(this._dataHandlerService.$hideIntegrationTiersList).filter(e => {
          if (!(e.includes('nodeInfo') || e.includes('edgeInfo'))) {
            return e;
          }
        });
        
	let length = selectedNodeList.length - 1;
        let flag = false;
        for (let key in selectedNodeList) {
          this.hideTierIntegration("update", selectedNodeList[key], flag);
          if (length == +key) { //to load updated data in toolkit only for last element in selectedNodeList
            flag = true;
            this.hideTierIntegration("update", selectedNodeList[key], flag);
          }
        }
	
	// checking if previously selected node exists in the update call of node info. setting first tier if no nodes selected previously
        if (this.fullFlowMapData.nodes.filter(e => e.actualTierName == this._dataHandlerService.$selectedNode).length == 0) {
          this._dataHandlerService.$selectedNode = Object.keys(data).length ? data['nodeInfo'][0].actualTierName : data;
          this.toolkit.setSelection(this.toolkit.getNode(this._dataHandlerService.$selectedNode));
        }
        if (this.isUptoNlevel && this._dataHandlerService.$isSingleTierMode) {
          this.showOnlyTierFlowMapUptoNLevel(false);
        }
        else if (this._dataHandlerService.$isSingleTierMode) {
          this.showOnlyTierFlowMap(false);
        }
        else {
          this.onConnectionChanges()
        }
        this._dataHandlerService.getTierData();

        //Previously,the all data comes at single point in UI so to overcome this the below method is invoked
        // this.createJsonForAutoFit();
      }, this._dataHandlerService.$tierStatusData, this._dataHandlerService.$hideIntegrationTiersList);
    },
      error => {
        this._execDashboardUtil.progressBarEmit({ flag: false, forceWait: false });
      });
    this.symbolList = ExecDashboardUtil.createSelectItem(['>=', '<=']);
  }

  showDefaultConnections() {
    let tempData = Object.assign({}, this.fullFlowMapData);
    tempData['edges'] = [];
    this.loadToolkit(tempData);
    this.slideShowConnections();
  }

  ngAfterViewInit() {

  }

  /**
   * reation of main json
   */
  createJsonForTierStatus(data) {
    try {
      const tempData = Object.assign({}, data);
      this.globalData = data; //REmove this
      let jsonObject = {};
      jsonObject['nodes'] = [];
      jsonObject['edges'] = [];

      //Filling Nodes
      //getting all nodes info present in flowmap
      let val = this.toolkit.getNodes();
      // Filling nodes
      const _nodesAvailable = val.map(e => e.data.actualTierName);
      let indexofNode = -1;
      for (let i = 0; i < tempData['nodeInfo'].length; i++) {
        let tempObject = this.fillConnectionNode(tempData, i);
        if (tempObject) {
          indexofNode = _nodesAvailable.indexOf(tempData['nodeInfo'][i]['actualTierName'])
          if (indexofNode != -1) {
            tempObject['left'] = val[indexofNode]['data']['left'] ? val[indexofNode]['data']['left'] : tempObject['left'];
            tempObject['top'] = val[indexofNode]['data']['top'] ? val[indexofNode]['data']['top'] : tempObject['top'];
          }
          jsonObject['nodes'].push(tempObject);
        }
      }

      // Filling edges
      for (let i = 0; i < tempData['callData'].length; i++) {
        if (tempData['callData'][i].backEnd.length === 0) {
          continue;
        }
        for (let j = 0; j < tempData['callData'][i].backEnd.length; j++) {
          const tempObject = {};
          if ((tempObject['source'] && tempObject['source'].length == 0) || (tempObject['target'] && tempObject['target'].length == 0)) {
            continue;
          }
          tempObject['source'] = tempData['callData'][i].name;
          tempObject['target'] = tempData['callData'][i].backEnd[j].name;
          let label = this.getLabel(tempData, i, j);
          tempObject['data'] = {
            label: label,
            type: 'connection',
            backEnd: tempData['callData'][i].backEnd
          };
          jsonObject['edges'].push(tempObject);
        }
      }
      this._tsCommonHandler.fillArrayWithCordinates(this._dataHandlerService.$selectedFlowmap, jsonObject['nodes']);
      return jsonObject;
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Filling connection node
   */
  fillConnectionNode(tempData, i, top?: any, left?: any) {
    if (tempData['nodeInfo'][i]['name'] === this._tsCommonHandler.$nodeToHide) {
      return
    }
    const tempObject = {};
    let isInstance = false;
    if (tempData.hasOwnProperty('reqVectorName') && tempData.reqVectorName) {
      if (tempData['nodeInfo'][i]['actualTierName'] === tempData.name) {
        isInstance = true;
      }
    }

    
    const type = (tempData['nodeInfo'][i]['entityType'] === 0 || tempData['nodeInfo'][i]['entityType'] === 1 || isInstance) ? 'action' : 'output';
    const width = (tempData['nodeInfo'][i]['entityType'] === 0 || tempData['nodeInfo'][i]['entityType'] === 1) ? '190' : '190';
    const height = (tempData['nodeInfo'][i]['entityType'] === 0 || tempData['nodeInfo'][i]['entityType'] === 1) ? '60' : '47';
    const imgPath = `./../dashboard/images/${tempData['nodeInfo'][i].icon}`;
    let textLength = this._tsCommonHandler.labelCharacters;
    const trimText = (tempData['nodeInfo'][i]['name'].length > textLength)
      ? tempData['nodeInfo'][i]['name'].substring(0, textLength) + '...' : tempData['nodeInfo'][i]['name'];

    tempObject['id'] = tempData['nodeInfo'][i]['name'];
    tempObject['type'] = type;
    tempObject['text'] = tempData['nodeInfo'][i]['name']; // cordinate
    if (top !== null && top !== undefined) {
      tempObject['top'] = top;
    } else {
      tempObject['top'] = tempData['nodeInfo'][i]['cordinate'][0];
    }
    if (left !== null && left !== undefined) {
      tempObject['left'] = left;
    } else {
      tempObject['left'] = tempData['nodeInfo'][i]['cordinate'][1];
    }
    tempObject['w'] = '190';
    tempObject['entity'] = tempData['nodeInfo'][i]['entityType'];
    tempObject['h'] = height;
    tempObject['trimText'] = trimText;
    tempObject['icon'] = imgPath;
    tempObject['res'] = tempData['nodeInfo'][i].res;
    tempObject['cpu'] = tempData['nodeInfo'][i].cpu;
    tempObject['pvs'] = tempData['nodeInfo'][i].pvs;
    tempObject['border'] = this.getAlertColorCode(tempData['nodeInfo'][i]);
    tempObject['zIndex'] = 100;
    tempObject['actualTierName'] = tempData['nodeInfo'][i].actualTierName;
    tempObject['name'] = tempData['nodeInfo'][i].name;
    tempObject['count'] = tempData['nodeInfo'][i].count;
    tempObject['tsc'] = tempData['nodeInfo'][i].TransactionScorecard;
    tempObject['tooltip'] = tempData['nodeInfo'][i];
    tempObject['dc'] = tempData['nodeInfo'][i].dc;
    tempObject['instance'] = isInstance;
    if (tempData['nodeInfo'][i].hasOwnProperty('groupName')) {
      tempObject['groupName'] = tempData['nodeInfo'][i]['groupName'];
    }
    return tempObject;
  }

  /**
   * Get color border
   */
  getAlertColorCode(tempData) {
    const eventCritical = tempData.eventAlerts.critical;
    const eventMajor = tempData.eventAlerts.major;
    const eventNormal = tempData.eventAlerts.normal;
    const available = tempData.available;
    const intColor = this.calcColorCode(available, eventNormal, eventMajor, eventCritical);
    return intColor;
  }

  /**
   * 
   */
  calcColorCode(available, eventNormal, eventMajor, eventCritical) {
    if (available === '0') {
      return CRITICAL;
    }
  }

  private indexCount: number = 0; // represents the current slideshow tier's index
  slideShowConnections(connectionAvailable = false) {
    try {
      //  for creating connection bw diff nodes.
      
      this.setConnectionCallToggle(false); // disable slide
      if (!this.tierStatusData && this.tierStatusData['callData'].length === 0) {
        return;
      }
      if (!connectionAvailable) {
      this.getConnection(this._dataHandlerService.$tierStatusData); // get connection details
      }
      this.indexCount = 0; // start from first tier
      this.setConnectionCallToggle(true); // enable slide show
      this.prepareAddingEdges(); // show connections
    } catch (error) {
      console.log('error in slideshow');
      console.log(error)
    }

  } // slide method

  /**
   * Toggles connection calls in flowmap
   * @param flag {boolean} show/hide connection calls
   */
  setConnectionCallToggle(flag: boolean) {
    clearInterval(this.nodeInterval); // remove previously running thread that adds connection calls
    this.enableAddingEdge = flag;
  }

  /**
   * Get state of connection calls activity
   * @returns {boolean} returns if slideshow connection active
   */
  getConnectionCallToggle(): boolean {
    return this.enableAddingEdge;
  }
  enableAddingEdge: boolean = false; // flag to show/hide slideshow connection
  /**
   * This method is responsible for slideshow connection.
   * @param timer {number} Slide show connection timer = 5000
   */
  prepareAddingEdges(timer: number = 0) {
    this.nodeInterval = setTimeout(() => {
      if (this.tierStatusData && this.tierStatusData['callData'].length == this.indexCount) { // slide show reaches last tier
        this.indexCount = 0; // start from beginning
        }
        if (this.tierStatusData['callData'][this.indexCount] && this.tierStatusData['callData'][this.indexCount].name) {
        this.sShowCurrentNode = this.tierStatusData['callData'][this.indexCount].name; // set current slide show tier
        }
      this.updateEdges(); // add edges for current tier
        this.indexCount++;
      if(this.getConnectionCallToggle()) { // if slide show enabled
        this.prepareAddingEdges(); // continue slide show
      }
    }, timer);
    }

  /**
   * Creates connection call straight lines
   * @data Whole Tier status data
   */
  getConnection(data: any) {
    try {
      let tempData = data;
      this.nodesArray = [];
      for (let i = 0; i < tempData['callData'].length; i++) {
        if (tempData['callData'][i].backEnd.length === 0) {
          continue;
        }
        for (let j = 0; j < tempData['callData'][i].backEnd.length; j++) {
          const connectionObject = {};
          this.modifyJMSCTarget(tempData['callData'][i], tempData['callData'][i].backEnd[j], connectionObject);
          connectionObject['id'] = tempData['callData'][i].name + '_' + tempData['callData'][i].backEnd[j].actualTierName;
          let label = this.getLabel(tempData, i, j);
          connectionObject['data'] = {
            label: label,
            type: tempData['callData'][i].backEnd[j].producer && tempData['callData'][i].backEnd[j].consumer?'bidirectional':'connection',
            backEnd: tempData['callData'][i].backEnd
          };
          this.nodesArray.push(connectionObject);
        }
      }//for loop
    } catch (error) {
      console.log('error in getConnection');
      console.log(error);
    }
  }

  // Used to add edges in the node to node connection
  updateEdges(isTierConnection: boolean = true) {
    try {
      // remove all edges
      let tempEdges = this.toolkit.getAllEdges();
      for (let i = 10; i < tempEdges.length; i++) {
        this.toolkit.removeEdge(tempEdges[i]);
      }

      //getting all the nodes currently shown in the flowmap
  	const tempNodes  = this.toolkit.getNodes().map(e=>e.data.id); 
       this.nodesArray.filter(e => (e.source == this.sShowCurrentNode || e.target == this.sShowCurrentNode) && e.source.length && e.target.length && tempNodes.includes(e.source) && tempNodes.includes(e.target)).forEach(e =>
	{
           this.toolkit.addEdge(e); 
           //If show full flowpath is true and User Double Click 
           if (this.dbClickflag) {
             let arr = this.methodToAddEdges(e['target']);
             if (arr.length > 0) {
             let arr1 = [];
             for (let obj1 of arr) {
               arr1 = this.methodToAddEdges(obj1);
             }
           }
         }
	});

  
      // add new edges
    } catch (error) {
      console.log('error in updateEdges ');
      console.log(error);
    }
  }

  // modifies JMSC targets
  modifyJMSCTarget(sourceObj: any, targetObj: any, connectionObject: any = null, swapOnly: boolean = false) {
    if (swapOnly) {
      connectionObject.source = targetObj.name;
      connectionObject.target = sourceObj.name;
    } else {
      if (targetObj.consumer) {
        connectionObject.source = targetObj.name;
        connectionObject.target = sourceObj.name;
      } else {
        connectionObject.source = sourceObj.name;
        connectionObject.target = targetObj.name;
      }
    }
  }

  //methodToAddEdges to show full flowpath for selected Node
  methodToAddEdges(e: any): any[] {
    let arr = [];
    for (let obj of this.nodesArray) {
      if (obj['source'] === e) {
        arr.push(obj['target'])
        this.toolkit.addEdge(obj);
      }
    }
    return arr;
  }

  /**
   * Gets the active edges of the toolkit object shown in the flowmap 
   * @param arr array to append the edges(optional)
   */
  getEdgesFromToolkit(arr: any[] = []) {
    this.toolkit.getAllEdges().forEach(e => {
      arr.push({ data: e.data, source: e['source'].id, target: e['target'].id })
    });
    return arr;
  }

  createJsonForCircular() {
    try {
      let tempJsonObject: { nodes: any[], edges: any[] } = { nodes: this.toolkit.getNodes().map(e => e.data), edges: this.getEdgesFromToolkit() };
      var cordinate = [];
      var centerPoint = {};
      var flowmapDivHeight = window.innerHeight; // Get Flowmap Div Height
      var flowmapDivWidth = window.innerHeight;   // Get Flowmap Div Width
      var distanceX = flowmapDivHeight / 2  //  - (flowmapDivHeight * .3);
      var distanceY = flowmapDivWidth / 2 - (flowmapDivWidth * .2);

      centerPoint['X'] = distanceX; // It is distance from top side.
      centerPoint['Y'] = distanceY; // It is distance from left side.

      var nodeCount = tempJsonObject['nodes'].length; // Total No. of node
      var nodeAngel = 360 / nodeCount; // Calculating nodes angel
      var increasedAngel = 0;

      const tempObject = {};
      var angle = 0;
      tempJsonObject.nodes.forEach((e, i) => {
        angle = (increasedAngel * Math.PI / 180);
        cordinate[0] = Math.round(centerPoint['X'] + distanceX * Math.sin(angle));
        cordinate[1] = Math.round(centerPoint['Y'] + distanceY * Math.cos(angle));

        increasedAngel = increasedAngel + nodeAngel;
        tempJsonObject.nodes[i].top = cordinate[1]
        tempJsonObject.nodes[i].left = cordinate[0]
      })

      this.getConnection(this._dataHandlerService.$tierStatusData); // Updating the connection calls array
      this.loadToolkit(tempJsonObject); // updating the flowmap with a circular view
    } catch (error) {
      console.log('error in creatrejsonForCircular ');
      console.log(error);
    }
  }

  createJsonForAutoFit() {
    try {
      let tempAutoFitData = [];
      tempAutoFitData['nodes'] = [];
      let arr1 = this.createJsonForTiers(this.toolkit.getNodes().filter(e => e.data.entity == 0).map(e => e.data));
      let arr2 = this.createJsonForOthers(this.toolkit.getNodes().filter(e => e.data.entity > 0).map(e => e.data));
      tempAutoFitData['nodes'] = [...arr1, ...arr2];
      tempAutoFitData['edges'] = this.getEdgesFromToolkit();
      this.loadToolkit(tempAutoFitData);
    } catch (error) {
      console.log('error in createJsonAutoFit ');
      console.log(error);
    }
  }

  /**
   * Calculates the position of tiers in case of auto layout
   * @param tierNodes tiers to be positioned
   */
  createJsonForTiers(tierNodes: any) {
    try {
      let tempNodeData = [];
      let centerPoint = {};
      const flowmapDivHeight = window.innerHeight; // Get Flowmap Div Height
      const flowmapDivWidth = window.innerHeight;   // Get Flowmap Div Width
      let distanceX = flowmapDivHeight / 3;
      let distanceY = flowmapDivWidth / 4 - (flowmapDivWidth * .1);

      centerPoint['X'] = (flowmapDivHeight / 1.5); // It is distance from top side 20
      centerPoint['Y'] = (flowmapDivWidth / 2) - 130; // It is distance from left side 70

      let nodeAngel = 360 / tierNodes.length; // Calculating nodes angel
      let increasedAngel = 0;

      let angle = 0;
      // for creating different type of nodes.
      tierNodes.forEach(e => {
        angle = (increasedAngel * Math.PI / 180);
        e['left'] = Math.round(centerPoint['X'] + distanceX * Math.sin(angle));
        e['top'] = Math.round(centerPoint['Y'] + distanceY * Math.cos(angle));
        increasedAngel = increasedAngel + nodeAngel;
        tempNodeData.push(e);
      })
      return tempNodeData;
    } catch (error) {
      console.log('error in createJsonForTiers');
      console.log(error);
    }
  }

  /**
   * Calculates the position of non-tier nodes in case of auto layout
   * @param nonTierNodes nodes except for tiers to be positioned
   */
  createJsonForOthers(nonTierNodes: any) {
    try {
      let tempNodeData = []
      let centerPoint = {};
      let flowmapDivHeight = window.innerHeight; // Get Flowmap Div Height
      let flowmapDivWidth = window.innerHeight;   // Get Flowmap Div Width
      let distanceX = flowmapDivHeight / 1.5;
      let distanceY = flowmapDivWidth / 2 - (flowmapDivWidth * .2);

      centerPoint['X'] = distanceX; // It is distance from top side
      centerPoint['Y'] = distanceY; // It is distance from left side

      let nodeCount = nonTierNodes.length // Total No. of node

      let nodeAngel = 360 / nodeCount; // Calculating nodes angle
      let increasedAngel = 0;
      let angle = 0;
      // for creating different type of nodes.
      nonTierNodes.forEach(e => {
        angle = (increasedAngel * Math.PI / 180);
        e['left'] = Math.round(centerPoint['X'] + distanceX * Math.sin(angle));
        e['top'] = Math.round(centerPoint['Y'] + distanceY * Math.cos(angle));
        increasedAngel = increasedAngel + nodeAngel;
        tempNodeData.push(e);
      });
      return tempNodeData;
    } catch (error) {
      console.log('error in createJsonForOther ');
      console.log(error);
    }
  }

  handleLftPanelAction(action) {
    if (action === 'AUTO_LAYOUT') {
      this.flowmapViewChanged = false;
      this.createJsonForAutoFit();
    } else if (action === 'AUTO_FIT_LAYOUT') {
      this.$jsplumb.getSurface(this.surfaceId, (s: Surface) => {
        this.surface = s;
        this.surface.setZoom(1);
        this.surface.zoomToFitIfNecessary();
      });
    } else if (action === 'CIRCULAR_LAYOUT') {
      this.flowmapViewChanged = false;
      this.createJsonForCircular();
    }
  }

  //Comma separated values 
  getCommaSeparatedString(rep) {
    if (rep < 1000) { // return the same number
      return rep;
    }
    return rep.toLocaleString();
  }
  /**
  * Storing Flowmap data in services
  */
  storeFlowmapData(data) {
    let tierList = data['nodeInfo'].map(e => {
      return e.name;
    });
    let tiers = data['nodeInfo'].filter(e => {
      if (e['entityType'] == 0 && e['groupName'] == undefined) {
        return e;
      }
    }).map(e => e['actualTierName']);
    let tierExInstances = data['nodeInfo'].filter(e => {
      if (e['entityType'] == 0) {
        return e;
      }
    }).map(e => {
      if (e['groupName'] !== undefined)
        return e['groupName'];
      else  // groupName
        return e['actualTierName'];
    });
    this._dataHandlerService.$tierList = tierList;
    this.tierList = tierList;
    this.tierListExGroup = tiers;
    this.tierListExInstances = tierExInstances;
  }


  _loadToolkitInterval: any = null;
  /**
   * Load data to toolkit
   */
  loadToolkit(data, autoFit?: boolean, drawEdgesAfterLoad?: boolean) {
    // The loading spinner will not stop untill the forcewait flag is sent false
    this._execDashboardUtil.progressBarEmit({ flag: true, forceWait: true });
    this._loadToolkitInterval = setTimeout(() => {
      try {
      let startTime = Date.now()
      let _t = this.toolkit.getNodes().map(e=>e.data)
    if (_t.length) {
      this.$jsplumb.getSurface(this.surfaceId, (s: Surface) => {
        this.surface = s;
      });
      let _n = data.nodes.map(e=>e.id)
      _t.forEach(e=> {
        if (!_n.includes(e.id)) {
          this.toolkit.removeNode(e.id)
        }
      })
      _t =_t.map(e=>e.id)
      data.nodes.forEach(e=> {
        if (_t.indexOf(e.id) != -1) {
          this.toolkit.updateNode(e.id, e)
          this.surface.setPosition(e.id, e.left, e.top)
        } else {
          this.toolkit.addNode(e)
        }
      })
      if (!this.flowmapViewChanged) this.flowmapViewChanged = true; // value false responsible to maintain a node's position
      if (data.edges.length) {
        this.toolkit.getAllEdges().forEach(e=>this.toolkit.removeEdge(e));
        data.edges.map(e=>this.toolkit.addEdge(e))
      }
    } else {
      this.toolkit.clear();
      this.toolkit.load({ data: data });
    }

    if (autoFit) {
       this.handleLftPanelAction('AUTO_FIT_LAYOUT');
    }
    if (drawEdgesAfterLoad) {
      this.setConnectionCallToggle(false);
      this.getConnection(this._dataHandlerService.$tierStatusData);
      this.updateEdges();
    }
    console.log('Loadtoolkit() completed in ' + (Date.now()-startTime) + ' ms');
      } catch (e) {
        console.error('Error in loadToolkit', e);
      } finally {
        this._execDashboardUtil.progressBarEmit({ flag: false, forceWait: false });
      }
    }, 100);
  }

  /**
   * Group Tier Dialog Toggle
   */
  groupTier() {
    this.newGrpName = ""
    this.groupDialogHeader = 'Add New Group';
    this.sourceHeader = 'Available Tiers';
    this.targetHeader = 'Tiers to be Grouped';
    this.groupList = ExecDashboardUtil.createSelectItem(this._dataHandlerService.$groupList);
    this.isCreateGrp = this.groupList.length?false:true;
    this.tiersList = this.toolkit.getNodes().filter(e => e.data.entity < 2 && !e.data.groupName).map(e => { return { id: e.data.actualTierName } });
    this.unGroupTiersList = [];
    this.groupTierToggle = (!this.groupTierToggle) ? true : false;
  }

  /**
   * Create Group
   */
  createNewGroup() {
    let nodeServerInfo = this._dataHandlerService.getNodePresetURL();
    let url = nodeServerInfo.hostOrigin + this._dataHandlerService.getPresetURLIfExists(nodeServerInfo);
    
    if (!this.isCreateGrp) {
      this.selectedTierGroup = this.selectedTierGroup.trim();
      if (this.selectedTierGroup.length == 0) {
        this.showMsg("Select a valid group", "error", "Error");
        return;
      }
      if (this._dataHandlerService.$isSingleTierMode // checking if flowmap mode is 1
        && this._dataHandlerService.$flowmapForSelectedTierName == this._dataHandlerService.$selectedMenuNode) { // checking if full flowmap shown for the tier is same as the contextmenu shown tier
        this._dataHandlerService.$flowmapForSelectedTierName = this.selectedTierGroup // setting full flowmap tier to the new group 
        this._dataHandlerService.$selectedNode = this.selectedTierGroup // this is set to show informatio for tier in the right panel
        this.previouslySelectedNodeForSelectedTier = this.selectedTierGroup; // Added for bug - 73684; Setting the previously selected node to the current new group name to show "show full flowmap" on contextmenu
        this._tsCommonHandler.$visibleTiers.push(this.selectedTierGroup) // adding new group name into the service variable
      }
      url += `DashboardServer/RestService/KPIWebService/CreateNewGroup` +
        `?sessLoginName=${this._config.$userName}&flowMapDir=${this._tsCommonHandler.flowMapDir}&selectedGroupName=${this.selectedTierGroup}`
        + `&tiersName=${this._dataHandlerService.$selectedMenuNode}&flowMapName=${this._tsCommonHandler.flowMapName}`
    } else {
      if (this.newGrpName.trim().length == 0) {
        this.showMsg("Group name can not be empty", "error", 'Error');
        return;
      } else if (this.unGroupTiersList.length == 0) {
        this.showMsg("Please add tiers to list", "error", 'Error');
        return;
      }
      else if (this._dataHandlerService.$tierList.filter(e => e.includes(this.newGrpName)).length > 0) {
        this.showMsg("Given name already exist", "error", 'Error');
        return;
      }
      let tiers = this.unGroupTiersList.map(e => e.id).join(',');
      if (this.unGroupTiersList.includes(this._dataHandlerService.$flowmapForSelectedTierName)) { // bug - 73684; checking if flowmap shown for selected tier is present in the new group
        this._dataHandlerService.$flowmapForSelectedTierName = this.newGrpName // setting full flowmap tier to the new group 
        this._dataHandlerService.$selectedNode = this.newGrpName // this is set to show informatio for tier in the right panel
        this.previouslySelectedNodeForSelectedTier = this.newGrpName // Added for bug - 73684; Setting the previously selected node to the current new group name to show "show full flowmap" on contextmenu
        this._tsCommonHandler.$visibleTiers.push(this.newGrpName) // adding new group name into the service variable
      }
      url += `DashboardServer/RestService/KPIWebService/CreateNewGroup` + `?sessLoginName=${this._config.$userName}&flowMapDir=${this._tsCommonHandler.flowMapDir}&selectedGroupName=${this.newGrpName}&tiersName=${tiers}&flowMapName=${this._tsCommonHandler.flowMapName}`
    }
    this._execDashboardUtil.progressBarEmit({ flag: true, color: 'warn' });
    this.http.get(url + `&productKey=${sessionStorage.productKey}`).subscribe((data) => {
      this._tsCommonHandler.$visibleTiers = Array.from(new Set([...this._tsCommonHandler.$visibleTiers, ...this.toolkit.getNodes().map(e=>e.data.id).filter(e=>!this.unGroupTiersList.includes(e))])) // Adding all the nodes visible on the flowmap to the service variable
      this._execDashboardUtil.progressBarEmit({ flag: false, color: 'warn' });
      this.getFlowmapDatafromServer();
      this._dataHandlerService.getGroupList()
      this.groupTierToggle = false
    },
      error => {
        this._execDashboardUtil.progressBarEmit({ flag: false, color: 'warn' });
      });
  }

  /**
   * show tier map for selected tier
   * Flag is to handle hide or show tier integration.
   */
  showOnlyTierFlowMap(flag = false, node?: any) {
    this._dataHandlerService.$isSingleTierMode = true;
    let _n = node && node.data && node.data.id ? node.data.id : this._dataHandlerService.$flowmapForSelectedTierName;
    let singleTierObj = [];
    singleTierObj['edges'] = [];
    singleTierObj['nodes'] = [];
    singleTierObj['edges'] = this.nodesArray.filter((e) => {
      return e.source == _n || e.target == _n;
    });

    // Filling Tier Node
    let nodeArr1 = [];
    const _visibleNodes = this._tsCommonHandler.$visibleTiers
    nodeArr1 = this.fullFlowMapData['nodes'].filter((e) => {
      return e.id == _n || _visibleNodes.includes(e.id);
    });

    // Filling Instance node
    let nodeArr2 = [];
    for (let i = 0; i < singleTierObj['edges'].length; i++) {
      for (let j = 0; j < this.fullFlowMapData['nodes'].length; j++) {
        if (this.fullFlowMapData['nodes'][j].id === singleTierObj['edges'][i].source || this.fullFlowMapData['nodes'][j].id === singleTierObj['edges'][i].target) {
          nodeArr2.push(this.fullFlowMapData['nodes'][j]);
        }
      }
    }

    singleTierObj['nodes'] = [...nodeArr1, ...nodeArr2];
    const _t = this._tsCommonHandler.$hiddenTiers; // getting hidden tiers
    if (_t.length) {
      singleTierObj['nodes'] = singleTierObj['nodes'].filter(e => !_t.includes(e.id)) // filtering from all the nodes not in hidden list
      singleTierObj['edges'] = singleTierObj['edges'].filter(e => !_t.includes(e.source) && !_t.includes(e.target)) // filtering sorce and targets of all the edges not present in hidden list
    }
    if (flag) {
      singleTierObj['nodes'] = singleTierObj['nodes'].filter(e => e.actualTierName == this._dataHandlerService.$selectedMenuNode)
      singleTierObj['edges'] = [];
    }
    this.loadToolkit(singleTierObj);  // Updating Node
  }

  /**
  * Show Full Flowmap
  */
  showFullFlowmap() {
    //Below if block to check the flowMapMode
    if (!this._dataHandlerService.$isSingleTierMode) {
      this._dataHandlerService.$isShowGridView = !this._dataHandlerService.$isShowGridView;
      this.toolkit.clear();
    }
    //Assigning false to hideTierIntForselectedMenuNode when showFullFlowmap called
    this._dataHandlerService.hideTierIntForselectedMenuNode = false;
    this._dataHandlerService.$isSingleTierMode = false;
    this._dataHandlerService.$selectedNode = this.fullFlowMapData.nodes[0].id;
    this._tsCommonHandler.flowMapMode = "0";
    this.getFlowmapDatafromServer();
  }

  /** Added*/
  openTierInfo(node, dcName?: string) {
    let tempNode = node;
    this.tierName = tempNode;
    this._selectedDC = dcName;
    let nodeServerInfo = this._dataHandlerService.getNodePresetURL();
    let isAll = nodeServerInfo.servletName=='IntegratedServer' ? 'ALL' : '';
    let url = nodeServerInfo.hostOrigin + this._dataHandlerService.getPresetURLIfExists(nodeServerInfo) + `${nodeServerInfo.servletName}/v2/geoend2end/ExecDashbaord/tierInfo?requestType=donutChartData&tierName=${tempNode}&reqTestRunNum=${nodeServerInfo.testrunNumber}&sessLoginName=${this._config.$userName}&GRAPH_KEY=${this._config.$actTimePeriod}&dcName=${dcName}&resolution=${this._tsCommonHandler.resolution}&serverType=${nodeServerInfo.serverType}&isAll=${isAll}&isIncDisGraph=true`;
    this._execDashboardUtil.progressBarEmit({ flag: true, color: 'warn' });
    this.chartsData = [];
    this.serverInfo = [];
    this.http.get(url + `&productKey=${sessionStorage.productKey}`).subscribe((data) => {
      this._execDashboardUtil.progressBarEmit({ flag: false, color: 'warn' });
      this.chartsData = this._chartProvider.getTierInfoCharts(data);
      if (!this.chartsData) {
        this.chartsData = [];
      }
    },
      error => {
        this._execDashboardUtil.progressBarEmit({ flag: false, color: 'warn' });
      });
    let url2 = nodeServerInfo.hostOrigin + this._dataHandlerService.getPresetURLIfExists(nodeServerInfo) + `${nodeServerInfo.servletName}/v2/geoend2end/ExecDashbaord/tierInfo?requestType=serverInstance&tierName=${tempNode}&reqTestRunNum=${nodeServerInfo.testrunNumber}&GRAPH_KEY=${this._config.$actTimePeriod}&dcName=${dcName}&resolution=${this._tsCommonHandler.resolution}&serverType=${nodeServerInfo.serverType}&isAll=${isAll}&isIncDisGraph=true`
    this._execDashboardUtil.progressBarEmit({ flag: true, color: 'warn' });
    this.http.get(url2 + `&productKey=${sessionStorage.productKey}`).subscribe((data) => {
      this._execDashboardUtil.progressBarEmit({ flag: false, color: 'warn' });
      this.serverInfo = data;
    let entity = this.serverInfo[0].servers[0].instances[0].name;
    if(entity.split("$$")[1])
      this.entityLevel = entity.split("$$")[1];
    else
      this.entityLevel = "Instance";
    console.log("ashish here entityLevel:", this.entityLevel);
    },
      error => {
        this._execDashboardUtil.progressBarEmit({ flag: false, color: 'warn' });
      });
  }

  /**
   * added
   */
  fillUnGroupDialog() {
    this.groupTierToggle = (!this.groupTierToggle) ? true : false;
    let tempNode;
    if (this._dataHandlerService.$selectedMenuNodeEntity === 1) {
      tempNode = 'backend';
    }
    else if (this._dataHandlerService.$selectedMenuNodeEntity === 0) {
      tempNode = 'tier';
    }
    let groupName = this._dataHandlerService.$selectedMenuNode;
    this.groupDialogHeader = 'UnGroup Tier(s)';
    this.sourceHeader = 'Available Tiers in Group';
    this.targetHeader = 'Tiers to be UnGrouped';
    this.tierToGroupList = [];
    let nodeServerInfo = this._dataHandlerService.getNodePresetURL();
    let url = nodeServerInfo.hostOrigin + this._dataHandlerService.getPresetURLIfExists(nodeServerInfo) + `DashboardServer/RestService/KPIWebService/groupTierList?flowMapDir=${this._tsCommonHandler.flowMapDir}&groupName=${groupName}&sessLoginName=${sessionStorage.getItem('sesLoginName')}&node=${tempNode}&flowMapName=${this._dataHandlerService.selectedFlowmap}&globalRenaming=${this._tsCommonHandler.globalRenaming}`
    this._execDashboardUtil.progressBarEmit({ flag: true, color: 'warn' });
    this._execDashboardUtil.progressBarEmit({ flag: false, color: 'warn' });
    this.http.get(url + `&productKey=${sessionStorage.productKey}`)
      .subscribe((data: any) => {
        this.tierListUnGroup = data;
        this.tiersList = data.map(e => { return { id: e } });
        this.unGroupTiersList = [];
      },
        error => {
          this._execDashboardUtil.progressBarEmit({ flag: false, color: 'warn' });
        });
  }

  unGroupTier() {
    let selectedUnGroupTier = this.unGroupTiersList.map(e => e.id).join(',');
    let nodeServerInfo = this._dataHandlerService.getNodePresetURL();
    let url = nodeServerInfo.hostOrigin + this._dataHandlerService.getPresetURLIfExists(nodeServerInfo) + `DashboardServer/RestService/KPIWebService/DeleteGroupTier?flowMapDir=${this._tsCommonHandler.flowMapDir}&deleteGroupTierList=${selectedUnGroupTier}&node=tier&flowMapName=${this._dataHandlerService.selectedFlowmap}&globalRenaming=${this._tsCommonHandler.globalRenaming}`
    this._execDashboardUtil.progressBarEmit({ flag: true, color: 'warn' });
    this.http.get(url + `&productKey=${sessionStorage.productKey}`).subscribe((data) => {
      
      this._execDashboardUtil.progressBarEmit({ flag: false, color: 'warn' });
      if (this._dataHandlerService.$isSingleTierMode) { // checking if flowmap mode is 1
        this._tsCommonHandler.$visibleTiers = Array.from(new Set([...this._tsCommonHandler.$visibleTiers,...this.unGroupTiersList,...this.toolkit.getNodes().map(e=>e.data.id)])) // adding all the nodes visible on the flowmap to the service variable along with the ungrouped tiers. "new Set()"" will return unique entries onl
        if (this.tiersList.length == 0) { // cheking if all the tiers are removed from the current group
          this._dataHandlerService.$flowmapForSelectedTierName = this.unGroupTiersList[0] // setting the first tier of the ungroup list as the selected flowmap tier 
          this._dataHandlerService.$selectedNode = this.unGroupTiersList[0] // this is to show information in the right panel
          this.previouslySelectedNodeForSelectedTier = this.unGroupTiersList[0] // Added for bug - 73684; Setting the previously selected node to the current new group name to show "show full flowmap" on contextmenu
        }
      }
      this.getFlowmapDatafromServer();
      this._dataHandlerService.getGroupList()
      this.groupTierToggle = false
    },
      error => {
        this._execDashboardUtil.progressBarEmit({ flag: false, color: 'warn' });
      });
  }

  saveFlowmap(action: string = 'save') {
    this.copyFlowmap(action)
    this.getFlowmapDatafromServer();
    // to add newely created Flowmap's owner property needed to enable/disable edit icon in FlowmapList
    this._dataHandlerService.$flowMapJsonArr.push({ 'shared': false, 'owner': true, 'name': this._dataHandlerService.$selectedFlowmap, 'selected': true });
    //to add newely created Flowmap's shared property needed in Manage Flowmap Dialog box
    this._dataHandlerService.$sharedFlowMapList.push({ 'name': this._dataHandlerService.$selectedFlowmap, 'shared': false });
  }
  /**
   * method called when user click save option from top panel 
   * ths method also called when save as option is selected
   * @param action 
   */
  copyFlowmap(action?: any) {
    try {

      if (action && action != '') {
        //need to remove
        //why creating a global service object when local variable could work
        // this._dataHandlerService.$tierStatusCordinates = this.getFlowMapCordinates();
        let flowMapObj = this.getFlowMapCordinates(this.toolkit.getNodes().map(e=> e.data), this._dataHandlerService.$tierStatusData.nodeInfo);
        let _showTier = this.toolkit.getNodes().map(e => e.data.id) //getting all the nodes currently shown in the flowmap
        const _setValuesToSession = this._tsCommonHandler.$hiddenTiers.join(","); // getting all the nodes available from last nodeinfo data call
        // 
        if (action == 'saveAs' || action == 'save') {
          //To Hold Temp OldName oldFlowMapName is used
          let oldFlowMapName = this._dataHandlerService.$selectedFlowmap;
          // this._dataHandlerService.$selectedFlowmap = false;
          let dataFromRequest1: any;
          let dataFromRequest2: any;
          let request = {};
          if (action == 'saveAs') {
            request['tierCordinateFileName'] = this.newFlowmapName;
            request['overrideFlow'] = this._tsCommonHandler.overrideFlow;
            this._dataHandlerService.$selectedFlowmap = this.newFlowmapName
            this._tsCommonHandler.$flowMapName = this.newFlowmapName
          }
          else if (action == 'save') {
            request['tierCordinateFileName'] = this._dataHandlerService.$selectedFlowmap;
            request['overrideFlow'] = "true";
          }
          request['globalRenaming'] = this._tsCommonHandler.globalRenaming;
          request['nonZeroIP'] = this._tsCommonHandler.nonZeroIP;
          request['operName'] = 'copyOnlineFlowMap';
          request['GRAPH_KEY'] = this._config.$actTimePeriod;
          request['reqTestRunNum'] = this._cavConfig.$eDParam.testRun;
          request['sessLoginName'] = this._config.$userName;
          request['sessGroupName'] = '';
          request['valueType'] = this._tsCommonHandler.valueType;
          
          request['setValuesToSession'] = _setValuesToSession;
          // removing pvs, cpu & res from filteroptions
          request['filterOption1'] = this._tsCommonHandler.filterOption1.replace(/=|pvs:/g, ""); //setting pvs
          request['filterOption2'] = this._tsCommonHandler.filterOption2.replace(/=|res:/g, ""); // setting response time
          request['filterOption3'] = this._tsCommonHandler.filterOption3.replace(/=|cpu:/g, ""); // setting CPU
          request['filterOption4'] = this._tsCommonHandler.filterOption4; // setting apply filters for IPs also
          request['returnTheseValues'] = '';
          request['flowMapName'] = this._dataHandlerService.$selectedFlowmap;
	  request['isFullFlowPath'] = this._tsCommonHandler.$_isFullFlowPath;
          request['callsUnit'] = this._tsCommonHandler.callsUnit;
          request['labelCharacters'] = this._tsCommonHandler.labelCharacters;
          // request['flowMapName'] = this.newFlowmapName;
          request['flowmapDir'] = this._tsCommonHandler.flowMapDir;
          request['reqVecName'] = this._tsCommonHandler.reqVecName;
          request['flowmapMode'] = this._tsCommonHandler.flowMapMode;
          request['dcName'] = this._tsCommonHandler.dcName;
          request['showTier'] = _showTier.join(",");
          // request['valueType'] =  this._tsCommonHandler.valueType;
          // request['hideIPTiers'] = this._dataHandlerService.$hideIntegrationTiersList;
          let request2 = {};
          request2['sessLoginName'] = this._config.$userName;
          request2['sessGroupName'] = '';
          request2['tierCordinateFileName'] = 'TierCoordinates';
          request2['flowmapType'] = this._tsCommonHandler.flowmapType;
          request2['selectedTierName'] = this._dataHandlerService.$selectedNode;
          request2['testRun'] = this._cavConfig.$eDParam.testRun;
          //request2['flowMapName'] = this.newFlowmapName;
          request2['flowMapName'] = this._dataHandlerService.$selectedFlowmap;;
          request2['flowmapDir'] = this._tsCommonHandler.flowMapDir;
          request2['tierCordinatesData'] = flowMapObj['codinatesArr'];
          let nodeServerInfo = this._dataHandlerService.getNodePresetURL();
          let url = nodeServerInfo.hostOrigin + this._dataHandlerService.getPresetURLIfExists(nodeServerInfo) + SAVE_ONLINE_FLOWMAP + `?name=` + this._dataHandlerService.$selectedFlowmap + `&productKey=${sessionStorage.productKey}`;
          if ((action == "save" && this._dataHandlerService.$selectedFlowmap != "default") || action == "saveAs") {
            this.pushFlowmapToServer((_t) => {
              if (_t.status) {
                if (!_t.response) {
                  if (this._dataHandlerService.$flowmapList && !this._dataHandlerService.$flowmapList.map(e => e.value).includes(this._dataHandlerService.$selectedFlowmap)) {
                    this.showMsg("Flowmap " + this._dataHandlerService.$selectedFlowmap + " already exists for another user!", "error", 'Error');
                    this._dataHandlerService.$selectedFlowmap = oldFlowMapName;
                    this.newFlowmapName = '';
                    return;
                  }
                }
                let nodeServerInfo = this._dataHandlerService.getNodePresetURL();
                let coordinateUrl = nodeServerInfo.hostOrigin + this._dataHandlerService.getPresetURLIfExists(nodeServerInfo) + SAVE_FLOWMAP_COORDINATES + `?productKey=${sessionStorage.productKey}`
                this.pushFlowmapToServer((_t) => {
                  if (_t.status) {
                    this.showMsg("FlowMap" + " " + this._dataHandlerService.$selectedFlowmap + " saved Successfully.");
                    if (action == "saveAs") {
                      if (this._dataHandlerService.$flowmapList && !this._dataHandlerService.$flowmapList.map(e => e.value).includes(this._dataHandlerService.$selectedFlowmap)) {
                        this._dataHandlerService.$flowmapList.push({ "label": this._dataHandlerService.$selectedFlowmap, "value": this._dataHandlerService.$selectedFlowmap })
                      }
                      //Empty the variable so that next time when dialog opens it comes as empty
                      this._dataHandlerService.flowmapList.forEach(e => {
                        if (e.value == this._dataHandlerService.$selectedFlowmap) {
                          e.selected = true
                        }
                        else {
                          e.selected = false
                        }
                      })
                    }
                  } else {
                    console.error('Error saving flowmap', _t.response)
                    this.showMsg("Error saving flowmap", "error", 'Error');
                  }
                }, coordinateUrl, request2)
              } else {
                this.showMsg("Error saving flowmap", "error", 'Error');
              }
            }, url, request);
          } else if (action == "save" && this._dataHandlerService.$selectedFlowmap == "default") {
            let nodeServerInfo = this._dataHandlerService.getNodePresetURL();
            let coordinateUrl = nodeServerInfo.hostOrigin + this._dataHandlerService.getPresetURLIfExists(nodeServerInfo) + SAVE_FLOWMAP_COORDINATES +`?productKey=${sessionStorage.productKey}`
            this.pushFlowmapToServer((_t) => {
              if (_t.status) {
                this.showMsg("FlowMap" + " " + this._dataHandlerService.$selectedFlowmap + " saved Successfully.");
              } else {
                console.error('Error saving flowmap', _t.response)
                this.showMsg("Error saving flowmap", "error", 'Error');
              }
            }, coordinateUrl, request2)
          }
          this.newFlowmapName = '';
        }
      }
    }
    catch (e) {
      console.log(e);
    }
  }

  /**
   * Sends HTTP POST request
   * @method pushFlowmapToServer 
   * @return {status: boolean, response: any} returns callback
   * @param {string} url url to post
   * @param {Object} body the body of post request
   */
  private pushFlowmapToServer(callback, url: string, body: any): any {
    this.http.post<any>(url, body)
      .subscribe(data => {
        callback({ status: true, response: data })
      },
        error => {
          callback({ status: false, response: error })
        })
  }

  configFlowMap() {
    this.configureFlowmapToggle = true;
  }

  /**
   * need to hide the selected node,
   * in classic execdashboard, flowmap is drawn after getting data from server
   * 
   */
  hideIntegrationPoint() {
    try {
      const _t = this._dataHandlerService.$selectedMenuNode;
      this._tsCommonHandler.$hiddenTiers.push(_t); // target integration point will be pushed to the hidden nodes list
      this._dataHandlerService.$configureMetrices.showSpecifiedTier = true; // show-hide nodes panel in configure flowmap will be visible
      this.fullFlowMapData.nodes = this.fullFlowMapData.nodes.filter(e => e.id != _t);
      this.fullFlowMapData.edges = this.fullFlowMapData.edges.filter(e => e.target != _t);
      this.nodesArray = this.nodesArray.filter(e => e.target != _t);
      this.toolkit.removeNode(this.toolkit.getNodes().filter(e => e.data.id == _t)[0]);
    } catch (error) {
      console.log('error in hideIntegrationPoint ');
      console.log(error);
    }
  }

  renameIP() {
    this.renameIPToggle = true;
  }

  /**
   * Rename an integration point
   * @param actualName ActualTierName of node to be renamed
   * @param newName updated name
   */
  renameIPoint(actualName: string, newName: string) {
    newName = newName.trim();
    if (newName === null || newName === undefined || newName.length == 0 || /[!$%^&*()+|~=`\\#{}\[\]";'<>?,]/.test(newName)) {
      this.showMsg('Please provide a valid name', 'error', 'Error');
      return;
    }
    let nodeServerInfo = this._dataHandlerService.getNodePresetURL();
    let url = nodeServerInfo.hostOrigin + this._dataHandlerService.getPresetURLIfExists(nodeServerInfo) + RENAME_TIERNAME + `?requestType=renaming&actualTierName=${actualName}&newTierName=${newName}&currTierName=${this._dataHandlerService.$selectedMenuNode}&flowMapName=${this._dataHandlerService.$selectedFlowmap}&globalRenaming=${this._tsCommonHandler.globalRenaming}&flowMapDir=${this._tsCommonHandler.flowMapDir}`;
    this.http.get(url + `&productKey=${sessionStorage.productKey}`).subscribe((data: any) => {
      if (data) {
        this.renameIPToggle = false;
        this._dataHandlerService.$selectedNode = "";
        this.getFlowmapDatafromServer();
      }
    });
  }


  mapIntegrationPoint() {

    this.mapIntPointToggle = true;
    // getting all the tiers available in tierInfo call data
    this.mapIntPtTiers = ExecDashboardUtil.createSelectItem(
      this._dataHandlerService.$isAllDCs ? this._dataHandlerService.$tierStatusData['nodeInfo'].filter(e => e.entityType < 2).map(e => e.actualTierName.split(",").map(e2 => e2)).toString().split(",") : this._dataHandlerService.$tierStatusData['nodeInfo'].filter(e => e.entityType < 2).map(e => e.actualTierName.split(",")).toString().split(",")
    );
  }

  /**
   * @param actualName The actualTierName of a node
   * @param newNameObj New name to set for the node, the object format is {value: string, label?: string}
   */
  renameMapIntPoint(actualName: string, newNameObj: any) {
    try {
      if (newNameObj == undefined || newNameObj == null || newNameObj.value.length == 0) {
        this.showMsg('Please provide a valid name', 'error', 'Error');
        return;
      }
      let nodeServerInfo = this._dataHandlerService.getNodePresetURL();
      let url = nodeServerInfo.hostOrigin + this._dataHandlerService.getPresetURLIfExists(nodeServerInfo) + RENAME_TIERNAME + `?requestType=mapping&actualTierName=${actualName}&newTierName=${newNameObj.value}&currTierName=${this._dataHandlerService.$selectedMenuNode}&flowMapName=${this._dataHandlerService.$selectedFlowmap}&globalRenaming=${this._tsCommonHandler.globalRenaming}&flowMapDir=${this._tsCommonHandler.flowMapDir}`;
      this.http.get(url + `&productKey=${sessionStorage.productKey}`).subscribe((data: any) => {
        if (data) {
          this.mapIntPointToggle = false;
          this._dataHandlerService.$selectedNode = "";
          this.getFlowmapDatafromServer();
        }
      });
    } catch (error) {
      console.log('error in renameMapIntPoint');
      console.log(error);
    }
  }

  /**
  * on drilldown of backends name.
  */
  drillDownIps() {
    this.showIpDialog = true;
    this._dataHandlerService.getConnectionDetails((data) => {
      this.tableArr = data;
    });
  }

  instanceInfoObj = {}; //Object to keep tier>server>instance name
  tempInstance: any;
  /**
     * Method to get data of instance level node
     * @tierName selected tier name
     * @serverName particular server of that tier
     * @instanceData instance name of that server
     * @dcName datacenter name of that instance
     */
  getInstanceFlowMap(tierName, serverName, instanceData, dcName) {
     this.disbleTooltip=true;
    try {
      //To show/hide Grid View Icon
      this._dataHandlerService.$isShowGridView = !this._dataHandlerService.$isShowGridView;
      this.tempInstance = instanceData['name'];
      if(this.tempInstance.split("$$").length > 1){
        return false;
      } 
      let tempData = {};
      tempData['Tier'] = tierName;
      tempData['Server'] = serverName;
      tempData['Instance'] = this.tempInstance;
      tempData['dc'] = dcName;
      sessionStorage.setItem("instanceDC",dcName); //for bug 77997

      //initialize event data in instanceInfoObj
      this.instanceInfoObj = tempData; // storing the current instance info to use in update calls sent every 2 mins

      this.setConnectionCallToggle(false);
      this.tierInfoToggle = false; // closing 'show tier info' dialog

      // changing current flowmap mode to 2
      this._tsCommonHandler.$flowMapMode = 2; //to denote that we are at Instance level flowmap 
      this._tsCommonHandler.reqVecName = `${tierName}>${serverName}>${this.tempInstance}`
      this.makeInstanceFlowMapData(tempData, true); // making instance level data

    } catch (error) {
      console.log('error in getInstanceFlowMap');
      console.log(error);
    }
  }

  //method to make instance level flwomap data
  makeInstanceFlowMapData(tempData, isFreshClicked?: boolean) {

    try {
      this._dataHandlerService.getInstanceFlowMapData(tempData, (data) => {
        this.fullFlowMapData = this.createJsonForTierStatus(data);
        if (!isFreshClicked) {
        this.getConnection(data);
        }
        this._dataHandlerService.$selectedNode = this.tempInstance; //tierStatusData
        this.sShowCurrentNode = this.tempInstance;
        this.onConnectionChanges(isFreshClicked);
        this._dataHandlerService.$tierStatusData = data; //tierStatusData
        this._dataHandlerService.getTierData();
      });
    } catch (error) {
      console.log('error in makeInstanceFlowMapData');
      console.log(error);
    }
  }

  private isAllConnectionSelected: boolean = false;
  private flowmapViewChanged: boolean = true; // This property is to used inside loadToolkit() method to maintain node's position
  onConnectionChanges(drawEdgesAfterLoad?: boolean) {
    try {
      let tempValue = this._dataHandlerService.$connectionCall;
      let tempData = Object.assign({}, this.fullFlowMapData);
      this.setConnectionCallToggle(false);
      // to show flowmap without connection calls.
      if (tempValue == 'noConnectionCall') {
        tempData['edges'] = [];
        this.toolkit.getAllEdges().map(e => this.toolkit.removeEdge(e));
        this.loadToolkit({ nodes: tempData.nodes, edges: [] }, false, drawEdgesAfterLoad);
      }
      // to show all connection calls 
      else if (tempValue == 'allConnectionCall') {
	tempData = { nodes: tempData.nodes, edges: tempData.edges.filter(e => e.source && e.target) };
	this.loadToolkit(tempData, false, drawEdgesAfterLoad);
        this.isAllConnectionSelected = true;
      }
      // start slideShow
      else if (tempValue == 'slideShowCall') {
        if (this.isAllConnectionSelected) {
          this.toolkit.getAllEdges().map(e => this.toolkit.removeEdge(e));
        }
        this.getConnection(this._dataHandlerService.$tierStatusData); // get connection details
        this.loadToolkit({ nodes: tempData.nodes, edges: this.getEdgesForNode(this.sShowCurrentNode, this.nodesArray) }, false, drawEdgesAfterLoad)
        this.slideShowConnections(true);
      }
    } catch (error) {
      console.log('error in onConnectionChanges');
      console.log(error);
    }
  }

  /**
   * Removes certain elements from the provided context menu options
   */
  private removeItemsForJMSType(items: any[]): any[] {
    let excludeItems: string[] = ["Rename Integration Point", "Map Integration Point To Tier", "Rename multiple IP(s)", "Reset Integration Point Names"];
    return items.filter(e=> !excludeItems.includes(e.label));
  }

  /**
   * This method returns all the filtered edges containing provided source/target id
   * @param {String} nodeId id of the node 
   * @param {Object} edges the list of edges to be filtered
   * @returns {Object[]} returns array of objects
   */
  private getEdgesForNode(nodeId: string, edges: any): any[] {
    const tempNodes = this.toolkit.getNodes().map(e => e.data.id);
    return edges.filter(e => (e.source == nodeId || e.target == nodeId) && (e.source.length && e.target.length && tempNodes.includes(e.source) && tempNodes.includes(e.target)))
  }
  /**
   * method to get the following data from current flowmap
   * cordinates with name
   * actualName array 
   * @param {Object[]} visibleNodes Nodes visible in the toolkit. "toolkit.getNodes().map(e=>e.data)""
   * @param {Object[]} _fullNodes All the available nodes. "_dataHandlerService.$tierStatusData.nodeInfo"
   * @returns Object
   * name array, if grouped then group name will be given instead of actual tiers
   */
  getFlowMapCordinates(visibleNodes: any[], _fullNodes: any[]): any {
    try {
      let arr: any = [];
      let flowMapObj = {};
      let nameArr: any = [];
      let actNameArr: any = [];
        let nodeInfoObj = {};
      let _toolkitNodes = visibleNodes.map(e=> e.actualTierName)
      let _index = -1;
      for (let i = 0; i < _fullNodes.length; i++) {
        _index = _toolkitNodes.indexOf(_fullNodes[i].actualTierName)
        if (_index != -1) {
          _fullNodes[_index].cordinate = [visibleNodes[_index].top, visibleNodes[_index].left];
        } else {
          _index = i;
        }
        nodeInfoObj['name'] = _fullNodes[_index].actualTierName;
        nodeInfoObj['x'] = _fullNodes[_index].cordinate[0];
        nodeInfoObj['y'] = _fullNodes[_index].cordinate[1];
        arr[_index] = nodeInfoObj['name'] + '=' + nodeInfoObj['x'] + ',' + nodeInfoObj['y'];
        actNameArr[_index] = nodeInfoObj['name'];
        nameArr[_index] = _fullNodes[_index].name;
      }

      arr = arr.join("|");
      nameArr = nameArr.join(",");
      actNameArr = actNameArr.join(",");
      flowMapObj['codinatesArr'] = arr;
      flowMapObj['actNameArr'] = actNameArr;
      flowMapObj['nameArr'] = nameArr;
      return flowMapObj;
    }
    catch (e) {
      console.log('getting error inside class = ' + this.className + ' method getFlowMapCordinates', e);
      return {};
    }
  }

  getFlowmap(event, index) {
    let sharedNames = [];
    for (let arr of this._dataHandlerService.$sharedFlowMapList) {
      if (arr.shared) {
        sharedNames.push(arr.name)
      }
    }
    let nodeServerInfo = this._dataHandlerService.getNodePresetURL();
    let url = nodeServerInfo.hostOrigin + this._dataHandlerService.getPresetURLIfExists(nodeServerInfo) + SHARED_FLOWMAP + `?sessLoginName=${this._config.$userName}&sharedFlowData=` + sharedNames + `&flowMapDir=${this._tsCommonHandler.flowMapDir}&dcName=${this._tsCommonHandler.dcName}`;
    this._dataHandlerService.getReqForManageFlowMap(url);
  }

  resetVariable(){
    this.all_selected = false;
    this.selectedRows = [] ; 
  }

  setVariable(){ 
    this.defaultFlowmap = this._dataHandlerService.$defaultFM ; 
    this.systemDefaultFlowmap = this._dataHandlerService.$systemFM;
  }

  setDefaultFlowMap() {
    try {
      if (this.defaultFlowmap == ''&& this.systemDefaultFlowmap =='') {
        this.showMsg("Please select a FlowMap", "error", 'Error');
        return;
      }
      let nodeServerInfo = this._dataHandlerService.getNodePresetURL();
      let url = nodeServerInfo.hostOrigin + this._dataHandlerService.getPresetURLIfExists(nodeServerInfo) + DEFAULT_FLOWMAP + `?flowMapDir=${this._tsCommonHandler.flowMapDir}&sessLoginName=${this._config.$userName}&defaultFM=${this.defaultFlowmap}&systemDefaultFM=${this.systemDefaultFlowmap}&dcName=${this._tsCommonHandler.dcName}`;
      this._commonRequestHandler.getDataFromGetRequest(url, data => {
        if(data){
	this.showMsg("Default Flowmap Set Successfully");
	}
	else{
	this.showMsg("Error in Setting Default Flowmap", 'error', 'Error');
	}
      });
    } catch (error) {
      console.log("error in setDefaultFlowMap");
      console.log(error);
    }
  }

  selectAll(event, name: any) {
    if (this.all_selected) {
      this.selectedRows = this._dataHandlerService.$flowMapJsonArr.filter(e => e.owner).map(e => e.name);
    }
    else {
      this.selectedRows = [];//empty the list if unselect all
    }
    for (let arr of this._dataHandlerService.$flowMapJsonArr) {
      if (arr.owner) {
        arr.check = this.all_selected;
      }
    }
  }

  rowSelection(event, name: any) {
    this.all_selected = false;
    this.selectedRows = [];//empty the list incase all_select option in dialog was used
    for (let arr of this._dataHandlerService.$flowMapJsonArr) {
      if (arr.check) {
        this.selectedRows.push(arr.name)
      }
    }
  }
  removeFlowmap() {
    if (!this.selectedRows || this.selectedRows.length < 1) {
      this.showMsg("Select a row to edit", 'error', 'Error');
      return;
    }
    let arr = [];
    for (let j = 0; j < this._dataHandlerService.$flowMapJsonArr.length; j++) {
      for (let i = 0; i < this.selectedRows.length; i++) {
        if (this._dataHandlerService.$flowMapJsonArr[j].name == this.selectedRows[i]) {
          arr.push(this._dataHandlerService.$flowMapJsonArr[j].name);
          this._dataHandlerService.$flowMapJsonArr.splice(j, 1);
          this._dataHandlerService.$sharedFlowMapList.splice(j, 1);
	   this._dataHandlerService.$setDefaultList.splice(j, 1);//removing selected flowmap from default dropdown list
          //Filtering flowmapList other than deleted one
          this._dataHandlerService.$flowmapList = this._dataHandlerService.$flowmapList.filter(flowMapObj => {
            if (flowMapObj['label'] != this.selectedRows[i]) {
              return flowMapObj;
            }
          })
        }
      }
    }
    //refreshing datatable data;
    this._dataHandlerService.$flowMapJsonArr = [...this._dataHandlerService.$flowMapJsonArr];
    this._dataHandlerService.$sharedFlowMapList = [...this._dataHandlerService.$sharedFlowMapList];
    this._dataHandlerService.$flowmapList = [...this._dataHandlerService.$flowmapList];
    this._dataHandlerService.$setDefaultList = [...this._dataHandlerService.$setDefaultList];
    let nodeServerInfo = this._dataHandlerService.getNodePresetURL();
    let url = nodeServerInfo.hostOrigin + this._dataHandlerService.getPresetURLIfExists(nodeServerInfo) + DELETE_FLOWMAP + `?sessLoginName=${this._config.$userName}&deleteFlowData=` + arr + `&flowMapDir=${this._tsCommonHandler.flowMapDir}&dcName=${this._tsCommonHandler.dcName}`;
    this._dataHandlerService.getReqForManageFlowMap(url);

    //If selected flowmap is deleted, default flowmap is loaded on screen
    if(this.selectedRows.includes(this._dataHandlerService.$selectedFlowmap)){
      this._dataHandlerService.onClickOfFlowmap("default");
      this._dataHandlerService.onSelectFlowmap("default");
    }
  }

  randomVariable($event) {
    this.handleDrillDown($event);
  }

  addEventToItems(item) {
    for (let i = 0; i < item.length; i++) {
      item[i]['command'] = (event) => { this.randomVariable(event) };
      if (item[i].hasOwnProperty('items') && item[i]['items'].length > 0) {
        for (let j = 0; j < item[i]['items'].length; j++) {
          item[i]['items'][j]['command'] = (event) => { this.randomVariable(event) };
          if (item[i]['items'][j].hasOwnProperty('items') && item[i]['items'][j]['items'].length > 0) {
            for (let k = 0; k < item[i]['items'][j]['items'].length; k++) {
              item[i]['items'][j]['items'][k]['command'] = (event) => { this.randomVariable(event) };
              if (item[i]['items'][j]['items'][k].hasOwnProperty('items') && item[i]['items'][j]['items'][k]['items'].length > 0) {
                for (let l = 0; l < item[i]['items'][j]['items'][k]['items'].length; l++) {
                  item[i]['items'][j]['items'][k]['items'][l]['command'] = (event) => { this.randomVariable(event) };
                }
              }
            }
          }
        }
      }
    }
    return item;
  }

  /**
   * method to handle click event on context menu
   * need to make constants for keywords
   */
  handleDrillDown(event) {
    try {
      let selectedItemLabel = ExecDashboardUtil.removeWhiteSpaceFromSpace(event['item']['label']).toLowerCase();
      //to get the selected Tier's Integration point name
      if (event["item"].hasOwnProperty("parent")) {
        this._dataHandlerService.$dbIntegrationName = event["item"]["parent"];
      }
      if (selectedItemLabel === 'upto1level'.toLowerCase() || selectedItemLabel === 'showflowmapforselectedtier') {
        this._dataHandlerService.$listOfSelectedNodeForFlowmap = this._dataHandlerService.selectedNode;
        this.setConnectionCallToggle(false);
        this._tsCommonHandler.$hiddenTiers = []
        this._tsCommonHandler.$visibleTiers = []
        this.previouslySelectedNodeForSelectedTier = this._dataHandlerService.$selectedMenuNode;
        if (this._dataHandlerService.hideTierIntForselectedMenuNode) {
          this._dataHandlerService.$flowmapForSelectedTierName = this._dataHandlerService.$rightClickNode.node.data.id
          this.showOnlyTierFlowMap(true, this._dataHandlerService.$rightClickNode);
        }
        else {
          this._dataHandlerService.$flowmapForSelectedTierName = this._dataHandlerService.$rightClickNode.node.data.id
          this.showOnlyTierFlowMap(false, this._dataHandlerService.$rightClickNode);
        }
        //to  show right panel data  of current tier
        this._dataHandlerService.$selectedNode = this._dataHandlerService.$selectedMenuActualNameNode;
        this._dataHandlerService.getTierData();
      }
      else if (selectedItemLabel === 'uptonlevel'.toLowerCase()) {
        this.isUptoNlevel = true;
        this._dataHandlerService.$listOfSelectedNodeForFlowmap = this._dataHandlerService.selectedNode;
        this.setConnectionCallToggle(false);
        if (this._dataHandlerService.hideTierIntForselectedMenuNode) {
          this._dataHandlerService.$flowmapForSelectedTierName = this._dataHandlerService.$rightClickNode.node.data.id
          this.showOnlyTierFlowMapUptoNLevel(true, this._dataHandlerService.$rightClickNode);
        }
        else {
          this._dataHandlerService.$flowmapForSelectedTierName = this._dataHandlerService.$rightClickNode.node.data.id
          this.showOnlyTierFlowMapUptoNLevel(false, this._dataHandlerService.$rightClickNode);
        }
        //to  show right panel data  of current tier
        this._dataHandlerService.$selectedNode = this._dataHandlerService.$selectedMenuActualNameNode;
        this._dataHandlerService.getTierData();
      }
      /**
       * need to handle --- if called obj and event required here. to display data on overlay
       */
      else if (selectedItemLabel === "tps") {
        // alert('TPS');
        this.tpsDdisplayModal = true;
        this.resposnHeader = 'Tps';
        this.showOverlay(this.paramObj, 0);
        // this.resposnHeader = 'Tps';
        this.panelMenu.hide();
      }
      else if (selectedItemLabel === "response") {
        // alert('response');
        this.tpsDdisplayModal = true
        this.resposnHeader = 'Response'; 
        this.showOverlay(this.paramObj, 1);
        // this.resposnHeader = 'Response';
        this.panelMenu.hide();
      }
      else if (selectedItemLabel === 'showfullflowmap' || selectedItemLabel === 'openfullflowmap') {
        this.previouslySelectedNodeForSelectedTier = '';
        this._dataHandlerService.$listOfSelectedNodeForFlowmap = '';
        this.showFullFlowmap();

        // when user select fullFlowMap then need to hide
        if (this._tsCommonHandler.$flowMapMode == 2) {
          this.previouslySelectedNodeForDashboard = '';
          this._dataHandlerService.$showDashboard = false;
        }
        this._tsCommonHandler.$flowMapMode = 0;
      }
      else if (selectedItemLabel === 'showdashboard') {
        this._dataHandlerService.$showDashboard = true;
        this.previouslySelectedNodeForDashboard = this._dataHandlerService.$selectedMenuNode;
        let tempNode = this._dataHandlerService.$selectedMenuActualNameNode;
        if (this._tsCommonHandler.$flowMapMode === 2) {
          tempNode = this._dataHandlerService.$tierStatusData['reqVectorName'];
        }
        this._dataHandlerService.getDashboardDataForSelectedNode(tempNode, (data) => {
          this._chartProvider.getDashboardData(data);
          /**
           * we need to scroll to bottom of the page when showing chart data of any tier
           */
          setTimeout(() => {
            document.getElementsByClassName("tier-status-lower-panel")[0].scrollIntoView({
              behavior: 'smooth',
              block: "start"
            })
          }, 200)
        });

      }
      else if (selectedItemLabel === 'hidedashboard') {
        this.previouslySelectedNodeForDashboard = '';
        this._dataHandlerService.$showDashboard = false;
      }
      else if (selectedItemLabel === 'changeicon') {
        this._dataHandlerService.$changeIcon = true;
      }
      else if (selectedItemLabel === 'showtierinfo') {
        const _ = this._dataHandlerService.$selectedNodeDCName.split(",")
        this._selectedDCList = _.length > 1 ? _ : []
        this.tierInfoToggle = true;
        //for bug :87567
        this.tabpanel = false;  
        this.tabpanelBtn = false;
        this.openTierInfo(this._dataHandlerService.$selectedMenuActualNameNode, _.length ? _[0] : "");
      }
      else if (selectedItemLabel === 'renameintegrationpoint') {
        this.renameIP();
      }
      else if (selectedItemLabel === 'ungroupintegrationpoint' || selectedItemLabel === 'ungrouptier') {
        this.fillUnGroupDialog();
      }
      else if (selectedItemLabel === 'mapintegrationpointtotier') {
        this.mapIntegrationPoint();
      }
      else if (selectedItemLabel === 'hideintegrationpoint') {
        this.confirmationService.confirm({
          message: 'Do you want to Hide ' + this._dataHandlerService.$selectedMenuNode + ' Integration Point?',
          header: 'Confirmation',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {
            this.hideIntegrationPoint();
          },
          reject: () => {
          }
        });
      }
      else if (selectedItemLabel === 'resetintegrationpointnames') {
        this.openUndoRenamingDialog();
      }
      else if (selectedItemLabel === 'grouptier') {
        this.groupTier();
      }
      else if (selectedItemLabel === 'flowpathsbyresponsetime') {
        console.log("ED : ", this._dataHandlerService);
        this._menuHandler.handleDdrDrillDown(selectedItemLabel, this._dataHandlerService);
      }
      else if (selectedItemLabel === 'flowpathsbycallouterror') {
        // this._navService.addNewNaviationLink('ddr');
        this._menuHandler.handleDdrDrillDown(selectedItemLabel, this._dataHandlerService);
      }
      else if (selectedItemLabel === 'slowdbcallsbyresponsetime') {
        // this._navService.addNewNaviationLink('ddr');
        this._menuHandler.handleDdrDrillDown(selectedItemLabel, this._dataHandlerService);
      }
      else if (selectedItemLabel === 'topdbcallsbycount') {
        // this._navService.addNewNaviationLink('ddr');
        this._menuHandler.handleDdrDrillDown(selectedItemLabel, this._dataHandlerService);
      }
      else if (selectedItemLabel === 'dbcallsbybusinesstransaction') {
        // this._navService.addNewNaviationLink('ddr');
        this._menuHandler.handleDdrDrillDown(selectedItemLabel, this._dataHandlerService);
      }
      else if (selectedItemLabel === 'topdbqueriesbyerrorcount') {
        // this._navService.addNewNaviationLink('ddr');
        this._menuHandler.handleDdrDrillDown(selectedItemLabel, this._dataHandlerService);
      }
      else if (selectedItemLabel === 'hotspots') {
        // this._navService.addNewNaviationLink('ddr');
        this._menuHandler.handleDdrDrillDown(selectedItemLabel, this._dataHandlerService);
      }
      else if (selectedItemLabel === 'methodsbyresponsetime') {
        // this._navService.addNewNaviationLink('ddr');
        this._menuHandler.handleDdrDrillDown(selectedItemLabel, this._dataHandlerService);
      }
      else if (selectedItemLabel === 'exceptions') {
        // this._navService.addNewNaviationLink('ddr');
        this._menuHandler.handleDdrDrillDown(selectedItemLabel, this._dataHandlerService);
      }
      else if (selectedItemLabel === 'btipsummary') {
        // this._navService.addNewNaviationLink('ddr');
        this._menuHandler.handleDdrDrillDown(selectedItemLabel, this._dataHandlerService);
      }
      else if (selectedItemLabel === 'flowpathsbyipresponsetime') {
        this._dataHandlerService.$showResponseDialog = true;
        //this._menuHandler.handleDdrDrillDown(selectedItemLabel, this._dataHandlerService);
      }
      else if (selectedItemLabel === 'flowpathsbyip') {
        this._menuHandler.handleDdrDrillDown(selectedItemLabel, this._dataHandlerService);
      }
      else if (selectedItemLabel === 'calldetails') {
        this.drillDownIps();
      }
      else if (selectedItemLabel === 'drilldown') {
        if (this._tsCommonHandler.$flowMapMode = 2)
          this.drillDownIps();
      }
      else if (selectedItemLabel === 'renamegroup') {
        this.renamedGroupName = this._dataHandlerService.$selectedMenuNode;
        this.showRenameGroup = true;
      }
      else if (selectedItemLabel === 'deletegroup') {
        this.showDeleteGroup = true;
      }
      else if (selectedItemLabel === 'hidetierintegration') {
        this.hideTierIntegration("", "", true);
      }
      else if (selectedItemLabel === 'showtierintegration') {
          this.showTierIntegration();
      }
      else if (selectedItemLabel === 'instancerecyclehistory') {
        let nodeServerInfo = this._dataHandlerService.getNodePresetURL();
        let url = nodeServerInfo.hostOrigin + this._dataHandlerService.getPresetURLIfExists(nodeServerInfo) + "dashboard/view/recycleHistoryHandler.jsp?tierName=" + this._dataHandlerService.$selectedMenuNode + "testRun=" + nodeServerInfo.testrunNumber + "&sesLoginName=" + sessionStorage.getItem('sesLoginName') + "&sessGroupName=" + sessionStorage.getItem('sessGroupName') + "&sessUserType=" + sessionStorage.getItem('sessUserType') + "&ofn=true";
        window.open(url, '_blank');
      }
      else if (selectedItemLabel === 'searchby') {
        //Storing all data of 'nodeInfo' in tempInstance for getting Tier Name
        let tempInstance = this._dataHandlerService.$tierStatusData['nodeInfo'];
        // tempTierList is used to Store all Tiers
        let tempTierList = [];
        for (let i = 0; i < tempInstance.length; i++) {
          if (tempInstance[i]['entityType'] == 0) {
            let tier = tempInstance[i]['actualTierName'].split(",");
            for (let j = 0; j < tier.length; j++) {
              tempTierList.push(tier[j]);
            }
          }
        }
        //Here object is a reference of selected Node
        let object = this.paramObj['obj'];
        let arrTier = [];
        //If a Selected Node is Group ,then it must include groupName as one of its property
        if (object.hasOwnProperty('groupName')) {
          arrTier = object['actualTierName'].split(",");
        }
        else {
          arrTier.push(object['actualTierName']);
        }
        //For Standard Dropdown key-value
        let arrLabelForMode = ['Exact', 'Starts With', 'Ends With', 'Contains'];
        let arrValForMode = ['1', '2', '3', '4'];

        //For Custom Dropdown key-value
        let arrLabelForCustom = ['Equal', 'Starts With', 'Ends With', 'Contains'];
        let arrValForCustom = ['EQ', 'SW', 'EW', 'CON'];

        //Creating Dropdown for Tier Options
        for (let key in tempTierList) {
          this.tierListOption.push({ value: tempTierList[key], label: tempTierList[key] });
        }
        //Empty the variables of Standard
        this.selectedtierList = [];
        this.selectedtierList = [...arrTier];
        this.modeList = [];
        this.modeList = this.createListWithKeyValue(arrLabelForMode, arrValForMode);
        this.flowpathID = '';
        this.correlationID = [];

        //For Operation of Custom 
        this.customDetail = new customData();
        this.operationList = [];
        this.operationList = this.createListWithKeyValue(arrLabelForCustom, arrValForCustom);
        this.customRulesData = [];
        this.selectedtierListForCustom = [...arrTier];
        this.customNameList = [];
        //Array to hold data(splitted data on basis of comma i.e ',') coming from server 
        let arrCustomName = [];
        let nodeServerInfo = this._dataHandlerService.getNodePresetURL();
        let urlName = nodeServerInfo.hostOrigin + this._dataHandlerService.getPresetURLIfExists(nodeServerInfo) + this._config.$productName.toLocaleLowerCase() + ('/v1/cavisson/netdiagnostics/ddr/config/searchByCustomDataOptions');
        //Method : GET ,Getting data from backend to create dropdown for Name in Custom
        this.http.get(urlName + `?productKey=${sessionStorage.productKey}`, { responseType: 'text' })
          .subscribe(data => {
            if (data) {
              arrCustomName = data.toString().split(",");
              this.customNameList = this.createListWithKeyValue(arrCustomName, arrCustomName);
            }
          })

        //For Operation of Logs 
        this.selectedtierListForLogs = [];
        this.selectedtierListForLogs = [...arrTier];

        this.searchByDialog = true;
      }
      else if (selectedItemLabel === 'renamemultipleip(s)') {
        this.renameEndPoints();
      }
    } catch (error) {
      console.log('error in handleDrillDown mapIntegrationPoint');
      console.log(error);
    }
  }

  /**method to rename flowmap */
  renameFMap() {
    if (this._dataHandlerService.$newFlowMapName == '') {
      this.showMsg("Flowmap name can't be empty", "error", 'Error');
      return;
    }
    //Handling Rename flowmap
    if (this._dataHandlerService.$selectedFlowmap == this._dataHandlerService.$oldFmap) {
      this._dataHandlerService.$selectedFlowmap = this._dataHandlerService.$newFlowMapName;
    }
    let nodeServerInfo = this._dataHandlerService.getNodePresetURL();
    let urlRename = nodeServerInfo.hostOrigin + this._dataHandlerService.getPresetURLIfExists(nodeServerInfo) + RENAME_FLOWMAP + `?flowMapDir=${this._tsCommonHandler.flowMapDir}&oldFileName=${this._dataHandlerService.$oldFmap}&newFileName=${this._dataHandlerService.$newFlowMapName}&userName=${this._config.$userName}&dcNames=${this._tsCommonHandler.dcName}`
    this._execDashboardUtil.progressBarEmit({ flag: true, color: 'warn' });
    this.http.get(urlRename + `&productKey=${sessionStorage.productKey}`).subscribe(data => {
      this._execDashboardUtil.progressBarEmit({ flag: false, color: 'warn' });
      if (data == true) {
        let index = this.getIndexInCallData(this._dataHandlerService.$flowMapJsonArr, this._dataHandlerService.$oldFmap, "name");
        this._dataHandlerService.$flowMapJsonArr[index]['name'] = this._dataHandlerService.$newFlowMapName;
        this._dataHandlerService.$flowMapJsonArr = [...this._dataHandlerService.$flowMapJsonArr];
        let i = this.getIndexInCallData(this._dataHandlerService.$flowmapList, this._dataHandlerService.$oldFmap, "label");
        this._dataHandlerService.$flowmapList[i]['label'] = this._dataHandlerService.$newFlowMapName;
        this._dataHandlerService.$flowmapList[i]['value'] = this._dataHandlerService.$newFlowMapName;
        this._dataHandlerService.$flowmapList = [...this._dataHandlerService.$flowmapList];
        this._dataHandlerService.$renameFlowMap = false;
      }
    },
      error => {
        this._execDashboardUtil.progressBarEmit({ flag: false, color: 'warn' });
      });
  }

  //appy Filter on flowmap
  applyFilterOnFlowmap() {
    try {
      //saving hidden and visible FM on save in local varibales

      if (!this.validateConfigFields()) { // checking if applied filter field(s) are not kept blank
        return;
      }
      if (this._tsCommonHandler.globalRenaming == this.useLocalRenaming) {
        this.globalRenaming(null);
      }
      if (this._tsCommonHandler.nonZeroIP == this.showIPwith0Calls) { 
        this.nonZeroIP(null);
      }

      this._tsCommonHandler.globalRenaming = !this.useLocalRenaming
      this._tsCommonHandler.nonZeroIP = !this.showIPwith0Calls; //setting non-zero IP
      this._tsCommonHandler.$visibleTiers = this.visibleTiers.map(e => e.node.id);
      this._tsCommonHandler.$hiddenTiers = this.hiddenTiers.map(e => e.node.id);
      //////////////////////////////////
      this._tsCommonHandler.$applyFilterToIP = this.enableApplyToIPCheck; // setting apply to IPs also option
      this._tsCommonHandler.filterOption1 = 'pvs:' + this.enableTPSCheck + ':' + this.drpTps + ':' + this.configTps; // setting PVS
      this._tsCommonHandler.filterOption2 = 'res:' + this.enableResponseCheck + ':' + this.drpRes + ':' + this.configRes; // setting Response time
      this._tsCommonHandler.filterOption3 = 'cpu:' + this.enableCPUCheck + ':' + this.drpCpu + ':' + this.configCpu; // setting CPU
      this._tsCommonHandler.filterOption4 = this.enableApplyToIPCheck; // setting apply to IPs also option
      //this._tsCommonHandler.callsUnit = this.callsUnit;
      //this._tsCommonHandler.labelCharacters = this.labelCharacters;
      ///////////////////////

      this.toolkit.clear();
      this._dataHandlerService.$editFlowmapToggle = false
      this.getFlowmapDatafromServer();
    } catch (error) {
      console.log('error in applyFilterOnFlowMap')
    }
  }

  //method to handle tier configuration
  applyTierConfig() {
    if (this.validateConfigFields()) {
      let filter1 = '';
      let filter2 = '';
      let filter3 = '';
      let filter4: any;
      let newJson: any = [];
      filter1 = this._dataHandlerService.$configureMetrices.tps + ':' + this.drpTps + ':' + this.configTps;
      filter2 = this._dataHandlerService.$configureMetrices.res + ':' + this.drpRes + ':' + this.configRes;
      filter3 = this._dataHandlerService.$configureMetrices.cpu + ':' + this.drpCpu + ':' + this.configCpu;
      let filtersArrayTobeDeleted: any = [];
      if (filter1.indexOf("true") != -1 || filter2.indexOf("true") != -1 || filter3.indexOf("true") != -1) {
        filter4 = this._dataHandlerService.$configureMetrices.applyToIP;
        filtersArrayTobeDeleted = this.filterBasedOnData(filter1, filter2, filter3, filter4);
      }
      if (filtersArrayTobeDeleted.length > 0) {
        for (let val of filtersArrayTobeDeleted) {
          newJson = this.filterJSON(this._dataHandlerService.$tierStatusData, val);
        }
        newJson = this._dataHandlerService.stringToJSON(newJson);
        this.tierStatusData = newJson;
        this._dataHandlerService.$tierStatusData = newJson;
      }
      var leftTextAreaData = "";

      for (let i = 0; i < this.tierToHideList.length; i++) {
        /* if(document.getElementById('hideShowCheckBox').checked == true)
        hideArrayToBeDeleted.push(leftTextArea[i].value); */
        leftTextAreaData = leftTextAreaData + (this.tierToHideList[i]).trim() + ",";
      }
      leftTextAreaData = leftTextAreaData.substring(0, (leftTextAreaData.length - 1));
      var rightTextAreaData = "";

      for (let i = 0; i < this.configuredTierList.length; i++) {
        //if(hideArrayToBeDeleted.indexOf(rightTextArea[i]) == -1)
        rightTextAreaData = rightTextAreaData + (this.configuredTierList[i]).trim() + ",";
      }
      rightTextAreaData = rightTextAreaData.substring(0, (rightTextAreaData.length - 1));
      this._dataHandlerService.$hideTierObj['hideTier'] = leftTextAreaData.split(',');
      this._dataHandlerService.$configureValues['filterOption1'] = filter1;
      this._dataHandlerService.$configureValues['filterOption2'] = filter2;
      this._dataHandlerService.$configureValues['filterOption3'] = filter3;
      this._dataHandlerService.$configureValues['filterOption4'] = filter4;
      newJson = this.prepareJsonAndRedraw();
      this.fullFlowMapData = this.createJsonForTierStatus(newJson);
      let tempData = { ...this.fullFlowMapData };
      //setting new json node as selected node
      this._dataHandlerService.$selectedNode = newJson['nodeInfo'][0].actualTierName;
      tempData['edges'] = [];
      this.loadToolkit(tempData);
    }
    else {

    }
  }


  validateConfigFields(): boolean {
    let msg = '';
    try {
      if (this.enableTPSCheck && this.configTps == '') { // checking if TPS is checked and input is non-empty
        this.showMsg('Please enter the filter value for TPS', 'error', 'Error');
        return false;
      }
      if (this.enableResponseCheck && this.configRes == '') { // checking if Response time is checked and input is non-empty
        this.showMsg('Please enter the filter value for Response time', 'error', 'Error');
        return false;
      }
      if (this.enableCPUCheck && this.configCpu == '') { // checking if CPU is checked and input is non-empty
        this.showMsg('Please enter the filter value for Cpu', 'error', 'Error');
        return false;
      }
      return true;
    }
    catch (err) {
      console.log('error in validateConfigFields() in class ', this.className);
      console.log(err);
    }
  }

  filterBasedOnData(pvs, res, cpu, isBackendFilter) {
    let newJson = { ...this._dataHandlerService.$tierStatusData };
    let pvsArr = pvs.split(":");
    let resArr = res.split(":");
    let cpuArr = cpu.split(":");
    let newNodeInfo = [];
    let deleteNode = [];
    let retainTier = [];
    let deleteTier = [];

    if (isBackendFilter == false) {
      let tiers = this.getTierNameArrayFromCallData(newJson);
      // $.each(tiers, function (index, val) {
      //need handling for multi filter as well
      for (const val of tiers) {

        let i = this.getIndexInNodeInfo(newJson, val);
        let tierVal = newJson.nodeInfo[i];

        let isTrue = false;
        if ((pvsArr[0] == "true") && this.isNumeric(tierVal.pvs)) {
          if ((eval(tierVal.pvs + pvsArr[1] + pvsArr[2]) == true))
            isTrue = true;
        }
        if ((resArr[0] == "true") && this.isNumeric(tierVal.res)) {
          if ((eval(tierVal.res + resArr[1] + resArr[2]) == true))
            isTrue = true;
        }
        if ((cpuArr[0] == "true") && this.isNumeric(tierVal.cpu)) {
          if (eval(tierVal.cpu + cpuArr[1] + cpuArr[2]) == true)
            isTrue = true;
        }
        if (isTrue == false) {
          deleteTier.push(val);
        }
      }
      return deleteTier;

    }
    else {
      // $.each(newJson.nodeInfo, function (index, val) {
      for (const val of newJson.nodeInfo) {
        var isTrue = false;

        if ((pvsArr[0] == "true") && this.isNumeric(val.pvs)) {
          if ((eval(val.pvs + pvsArr[1] + pvsArr[2]) == true))
            isTrue = true;
        }

        if ((resArr[0] == "true") && this.isNumeric(val.res)) {
          if ((eval(val.res + resArr[1] + resArr[2]) == true))
            isTrue = true;
        }

        if ((cpuArr[0] == "true") && this.isNumeric(val.cpu)) {

          if (eval(val.cpu + cpuArr[1] + cpuArr[2]) == true)
            isTrue = true;
        }

        if (isTrue == false) {
          deleteNode.push(val.name)
        }
      }
      //json.nodeInfo = newNodeInfo;
      //return JSON.stringify(newJson);

      return deleteNode;

    }
  }

  //validate the range of input field i.e check for -ve and range 
  rangeValidation(event){
    if(event.key == '-')
      return false;
    else 
    return true;
  }  

  omit_special_char(event){
    var k;  
    k = event.charCode;
    let num = parseInt(event.target.value + event.key);
    if(num > 86400000){ 
      return false;
    }
    return(k >= 48 && k <= 57); 
  }

  getTierNameArrayFromCallData = (newJson) => {
    if (newJson.callData.length > 0) {
      let tempArr = [];
      // $.each(newJson.nodeInfo, function (index, val) {
      //   /* iterate through array or object */
      //   if (val.entityType == "0")
      //     tempArr.push(val.name);
      // });
      for (const iterator of newJson.nodeInfo) {
        if (iterator.entityType == "0") {
          tempArr.push(iterator.name)
        }
      }
      return tempArr;
    }
    else
      return [];
  }

  getIndexInNodeInfo = (newJson, node) => {
    let index = -1;
    // $.each(newJson.nodeInfo, function (i, val) {
    //   if (val.name == node)
    //     index = i;
    // });
    for (let i in newJson.nodeInfo) {
      if (node == newJson.nodeInfo[i].name) {
        index = +i;
      }
    }
    return index;
  }

  /**method to return true if a field is numeric type */
  isNumeric = (value) => {
    var invalidReqExp = /[^\d]/;
    return (!invalidReqExp.test(value));
  }

  /**method to filter json on the basis of passed json and current node */
  filterJSON = function (json, node) {
    //making deep copy of json object
    this.newObject = { ...json };
    this.deleteFromNodeInfo(node);
    this.deleteFromCallData(node);
    this.deleteFromBackend(node);
    return JSON.stringify(this.newObject);
  }

  //function to get index of given name in object array
  objIndex = (data, name) => {
    let index = -1;
    for (const key in data) {

      // const element = data[key];
      if (data[key].name == name) {
        index = +key;
      }
    }
    return index;
  }

  deleteFromBackend = (node) => {
    try {
      for (const index in this.newObject.callData) {
        const element = this.newObject.callData[index];
        let i = index;
        for (const val of element.backEnd) {
          let j = this.objIndex(this.newObject.calledData[i].backEnd, node);
          if (j != -1)
            // this.newObject.callData[i].backEnd.splice(j, 1);
            this.newObject.callData[i].backEnd = this.immutableSplice(this.newObject.callData[i].backEnd, j, 1);
        }
      }
    }
    catch (e) {
      console.log('error in deleteFromBackend', e);
    }
  }

  deleteFromNodeInfo = (node) => {
    try {
      let index = this.objIndex(this.newObject.nodeInfo, node);
      if (index != -1) {

        this.newObject.nodeInfo = this.immutableSplice(this.newObject.nodeInfo, index, 1);
        this.newObject = [...this.newObject];
      }
    }
    catch (e) {
      console.log('error in deletefromnodeInfo', e);
    }
  }

  deleteFromCallData = (node) => {
    try {
      let index = this.objIndex(this.newObject.callData, node);
      if (index != -1)
      this.newObject.callData = this.immutableSplice(this.newObject.callData, index, 1);
      this.newObject = [...this.newObject];
    }
    catch (e) {
      console.log('error in deleteFromCallData', e);
    }
  }

  /*This function is used to  splice the selcted path*/
  immutableSplice(arr, start, deleteCount, ...items) {
    return [...arr.slice(0, start), ...items, ...arr.slice(start + deleteCount)];
  }

  hideTiers(stringArr) {
    let arr = stringArr.split(',');

    let singleTierObj = [];
    singleTierObj['edges'] = [];
    singleTierObj['nodes'] = [];
    for (let i = 0; i < this.fullFlowMapData['edges'].length; i++) {
      for (const iterator of arr) {
        if (iterator === this.fullFlowMapData['edges'][i].source) {
          singleTierObj['edges'].push(this.fullFlowMapData['edges'][i])
        }
      }
    }
    // Filling Tier Node
    let nodeArr1 = [];
    for (let i = 0; i < this.fullFlowMapData['nodes'].length; i++) {
      for (const iterator of arr) {
        if (iterator === this.fullFlowMapData['nodes'][i].id) {
          nodeArr1.push(this.fullFlowMapData['nodes'][i])
        }
      }
    }
    // nodeArr1 = this.fullFlowMapData['nodes'].filter((e) => {
    //   return e.id === this._dataHandlerService.$selectedMenuNode;
    // });

    // Filling Instance node
    let nodeArr2 = [];
    for (let i = 0; i < singleTierObj['edges'].length; i++) {
      for (let j = 0; j < this.fullFlowMapData['nodes'].length; j++) {
        if (this.fullFlowMapData['nodes'][j].id === singleTierObj['edges'][i].target) {
          nodeArr2.push(this.fullFlowMapData['nodes'][j]);
        }
      }
    }

    singleTierObj['nodes'] = [...nodeArr1];
    return singleTierObj;
  }
  prepareJsonAndRedraw() {
    var start = new Date().getTime();
    var data1 = this._dataHandlerService.$hideTierObj['hideTier'];//getSessionFun(sesStorage, "hideTier").toString();

    let hideTierString = data1;
    var hideFilterTierString = data1;
    var hideArray = new Array();
    hideArray = data1;//hideFilterTierString.split(",");
    var a: any;
    for (var i = 0; i < hideArray.length; i++) {
      a = this.filterJSON({ ...this.tierStatusData }, hideArray[i]);
      var localArray = this.getBackendsToBeDeleted(hideArray[i]);
      localArray.push(hideArray[i]);
      for (var j = 0; j < localArray.length; j++) {
        a = this.filterJSON({ ...this.tierStatusData }, localArray[j]);
        this.tierStatusData = this._dataHandlerService.stringToJSON(a);
        this._dataHandlerService.$tierStatusData = this.tierStatusData;
      }
    }
    return this._dataHandlerService.stringToJSON(a);
  }


  globalRenaming(event) {
    let nodeServerInfo = this._dataHandlerService.getNodePresetURL();
    let url = nodeServerInfo.hostOrigin + this._dataHandlerService.getPresetURLIfExists(nodeServerInfo) + GLOBAL_RENAMING + `?flowMapName=${this._dataHandlerService.$selectedFlowmap}&globalRenaming=${!this._tsCommonHandler.globalRenaming}&flowMapDir=${this._tsCommonHandler.flowMapDir}`;
    this._execDashboardUtil.progressBarEmit({ flag: true, color: 'warn' });
    this.http.get(url + `&productKey=${sessionStorage.productKey}`).subscribe(data => {
      this._execDashboardUtil.progressBarEmit({ flag: false, color: 'warn' });
    },
      error => {
        this._execDashboardUtil.progressBarEmit({ flag: false, color: 'warn' });
      });
    this._tsCommonHandler.globalRenaming = !this._tsCommonHandler.globalRenaming; // setting enable global renaming
  }
  nonZeroIP(event) {
    let nodeServerInfo = this._dataHandlerService.getNodePresetURL();
    let url = nodeServerInfo.hostOrigin + this._dataHandlerService.getPresetURLIfExists(nodeServerInfo) + nonZeroIP + `?flowMapName=${this._dataHandlerService.$selectedFlowmap}&nonZeroIP=${!this._tsCommonHandler.nonZeroIP}&flowMapDir=${this._tsCommonHandler.flowMapDir}`;
    this._execDashboardUtil.progressBarEmit({ flag: true, color: 'warn' });
    this.http.get(url + `&productKey=${sessionStorage.productKey}`).subscribe(data => {
      this._execDashboardUtil.progressBarEmit({ flag: false, color: 'warn' });
    },
      error => {
        this._execDashboardUtil.progressBarEmit({ flag: false, color: 'warn' });
      });
    this._tsCommonHandler.nonZeroIP = !this._tsCommonHandler.nonZeroIP; // setting show non-zero IP
  }
  showOverlay(msg, type) {
    event.stopPropagation();
    if (type == 0) {
      this.typeStr = 'TPS';
    }
    else {
      this.typeStr = 'Response';
    }
    this._dataHandlerService.getTopTransactionData(msg.obj, type, (data) => {
      this.BTtableArr = data[0];
    });
    this.renderer.setStyle(this.overView.nativeElement, 'display', 'block')
    this.renderer.setStyle(this.overView.nativeElement, 'top', (msg.obj.top + 180) + 'px')
    this.renderer.setStyle(this.overView.nativeElement, 'left', (msg.obj.left + 30) + 'px');
  }

  //Method to close the opened overlay
  closeOverLay(event) {
    // event.stopPropagation();
    this.renderer.setStyle(this.overView.nativeElement, 'display', 'none');
  }

  /**
   *method to perform operation on selecting an image to the server for selected tier
   * setting the query params 
   */
  public onSelectImage(evt: any) {
    this.uploadedFile = evt[0];
    let tierName = this.rightClickedNode + '.png';
    let valueType = "iconChange";
    let nodeServerInfo = this._dataHandlerService.getNodePresetURL();
    this.uploadUrl = nodeServerInfo.hostOrigin + this._dataHandlerService.getPresetURLIfExists(nodeServerInfo) + `/DashboardServer/RestService/KPIWebService/changeIcon?valueType=${valueType}&sourceFile=C:\\fakepath\\${evt[0].name}&tierName=${tierName}`
  }
  /**
   * method called if image uploaded successfully
   * after image upload we also have to update the selected node's icon with the uploaded one
   */
  //need to remove ./assets/images/...;
  onImageUpload(event) {
    this.fullFlowMapData['nodes'].forEach((element, index) => {
      if (element.name === this.rightClickedNode) {
        this.fullFlowMapData['nodes'][index].icon = `./../dashboard/images/${this.rightClickedNode}.png`;
        return;
      }
    });
    let tempData = Object.assign({}, this.fullFlowMapData);
    tempData['edges'] = [];
    this.loadToolkit(tempData)
  }
  /**
   * method called if image upload fails
   * @param event 
   */
  onError(event) {
    console.log('image upload fails----', event);
  }

  showBTDialoge(rowData) {
    this._tsCommonHandler.$showBTDialog = !this._tsCommonHandler.$showBTDialog;

    if (this._tsCommonHandler.$showBTDialog == true)
      this.btDetailArr = this.createDataForTable(rowData);


  }
  createDataForTable(rowData) {
    let arr = [];
    for (let r in rowData) {
      let obj = {};
      obj['propertyName'] = r;
      obj['propertyValue'] = rowData[r];
      arr.push(obj);
    }
    return arr;
  }

  closeCommonDialog() {
    // this.showDialog = false
    this.showRenameGroup = false;
    try {

    } catch (error) {
      console.log(error);
    }
  }

  actionOnCommonDialog() {
    let nodeServerInfo = this._dataHandlerService.getNodePresetURL();
    let url = nodeServerInfo.hostOrigin + this._dataHandlerService.getPresetURLIfExists(nodeServerInfo) + RENAME_GROUP + `?flowMapDir=${this._tsCommonHandler.flowMapDir}&flowMapName=${this._tsCommonHandler.flowMapName}&oldGroupName=${this._dataHandlerService.$selectedMenuNode}&newGroupName=${this.renamedGroupName}`;
    try {
      // this.showDialog = false
      this.showRenameGroup = false
      this._commonRequestHandler.getDataFromGetRequest(url, data => {
        if (data === null || data.status === 404 || data === []) {
          console.error('Configuration Not Found', 'error');
          // this.msgs = [];
          // this.msgs.push({ severity: 'error', summary: 'Error Message', detail: 'Configuration Not Found' });
          // return;
        }
        if (this._dataHandlerService.$isSingleTierMode // checking if flowmap mode is 1
          && this._dataHandlerService.$flowmapForSelectedTierName == this._dataHandlerService.$selectedMenuNode) { // checking if full flowmap shown for the tier is same as the contextmenu shown tier
          this._dataHandlerService.$flowmapForSelectedTierName = this.renamedGroupName; // setting full flowmap tier to the new group 
          this._dataHandlerService.$selectedNode = this.renamedGroupName; // this is set to show informatio for tier in the right panel
          this.previouslySelectedNodeForSelectedTier = this.renamedGroupName; // Added for bug - 73684; Setting the previously selected node to the current new group name to show "show full flowmap" on contextmenu
          this._tsCommonHandler.$visibleTiers.push(this.renamedGroupName) // adding new group name into the service variable
        }
        this.getFlowmapDatafromServer();
        this._dataHandlerService.getGroupList()
        this.groupTierToggle = false
      })
    } catch (error) {
      console.log(error);
    }
  }

  action2DeleteGroup() {
    let nodeServerInfo = this._dataHandlerService.getNodePresetURL();
    let url = nodeServerInfo.hostOrigin + this._dataHandlerService.getPresetURLIfExists(nodeServerInfo) + DELETE_GROUP + `?flowMapDir=${this._tsCommonHandler.flowMapDir}&flowMapName=${this._tsCommonHandler.flowMapName}&deleteGroupName=${this._dataHandlerService.$selectedMenuNode}`;
    this._commonRequestHandler.getDataFromGetRequest(url, data => {
      if (data === null || data.status === 404 || data === []) {
        console.error('Configuration Not Found', 'error');
      }
      this.getFlowmapDatafromServer();
      this._dataHandlerService.getGroupList()
      this.showDeleteGroup = false;
    })
    try {
    } catch (error) {
      console.log(error);
    }
  }

  closeDeleteDialog() {
    try {
      this.showDeleteGroup = false;
    } catch (error) {
      console.log(error);
    }
  }

  hideTierIntegration(datafrom, nodeInfo, flag) {
  	try {

      let selectedNode = "";
      if (datafrom == "update" && nodeInfo != undefined) {//This If block is called when Update request is invoked from UI
        selectedNode = nodeInfo;
      }
      else if (datafrom == '' && nodeInfo == '') { //This is for normal hide functionality of Node
        flag = true;
        selectedNode = this._dataHandlerService.$selectedMenuNode;
      }

      let backEndArr = this._dataHandlerService.$tierStatusData.callData.filter(e => e['name'] === selectedNode).map(e => e['backEnd'])[0];
      backEndArr = backEndArr?backEndArr.map(e => e['name']):[];
      let n = backEndArr.length;
      let _visibleNodes = this.toolkit.getNodes().map(e => e.data.id);

      // REMOVING IP'S CONNECTED TO OTHER TIERS
      for (let i = 0; i < n; i++) {
        this._dataHandlerService.$tierStatusData.callData.forEach((element, index) => {
          if (element['name'] != selectedNode && _visibleNodes.includes(element['name'])) {
            element['backEnd'].forEach(e => {
              let index = backEndArr.indexOf(e['name']);
              if (index !== -1) {
                backEndArr.splice(index, 1)
              }
            });
          }
        });
      }

      //LIST TO MAINTAIN WHICH NODES AND EDGES NEED TO BE HIDDEN
      this.hideIntegrationTiersList[this._dataHandlerService.$selectedMenuNode] = backEndArr;
      this._dataHandlerService.$hideIntegrationTiersList[this._dataHandlerService.$selectedMenuNode] = backEndArr;

      //Handling flowmap for selected tier
      if (this._dataHandlerService.$isSingleTierMode) {
        this._dataHandlerService.hideTierIntForselectedMenuNode = true; // on clicking hide tier integration option in dropdown list
        this.removeTiersFromFlowmap(this._dataHandlerService.hideTierIntForselectedMenuNode);
      }
      else {
        this.removeTiersFromFlowmap(flag);
      }

    }
    catch (error) {
      console.log('error in hide integration point ');
      console.log(error);
    }
  }


  //New 
  //Variables to hold node and edge info during Hide Integration
  nodeInfoOfHide = [];
  edgeInfoOfHide = [];
  /**
   * To remove the tiers list from flowmap list 
   * based on hideIntegrationTiersList.
   */
  removeTiersFromFlowmap(flag) {
    try {
      //To store spliced  Node and Edge
      this.nodeInfoOfHide = [];
      this.edgeInfoOfHide = [];
      //Making specific property name for selected Node to hold the specific node and edge data
      let nodeInfo = this._dataHandlerService.$selectedMenuNode + 'nodeInfo';
      let edgeInfo = this._dataHandlerService.$selectedMenuNode + 'edgeInfo';
      let tempData = this.fullFlowMapData;
       let tempTierList = this._dataHandlerService.$hideIntegrationTiersList;
      const tempNodes = this.toolkit.getNodes().map(e => e.data.id); // to get edges of selected Tier
      
      //getting edges of the selected node
      let sourceArr = this.toolkit.getAllEdges().map(e => e['source'].data.id);
      let targetArr = this.toolkit.getAllEdges().map(e => e['target'].data.id);
      let n = sourceArr.length;
      let edgeArr = [];
      for (let index = 0; index < n; index++) {
        let tmpEdges = this.fullFlowMapData['edges'].filter(e => {
          (e && sourceArr[index] == e.source && targetArr[index] == e.target);
        })
        if (tmpEdges.length)
          edgeArr.push(tmpEdges[0]);
      }
      tempData['edges'] = edgeArr;
       
      if (this._dataHandlerService.$isSingleTierMode) { //for handling show flowmap for selected tier, tempdata['nodes'] contains only visible tiers Data in flowmapMapMode 1
        tempData['nodes'] = tempData['nodes'].filter(e => tempNodes.includes(e.id));
      }
 
      for (let obj in tempTierList) {
        if (!(obj.includes("nodeInfo") || obj.includes('edgeInfo'))) {
          if (tempTierList[obj] != undefined && tempTierList[obj].length > 0) {
            for (let i = 0; i < tempTierList[obj].length; i++) {
              let node = tempTierList[obj][i]

              for (let j = 0; j < tempData['nodes'].length; j++) { // LOOP TO HIDE IP WHICH HAVE ONE TO ONE CONNECTION WITH SELECTED TIER
                if (tempData['nodes'][j]['id'] == node) {
                  if (tempData['nodes'][j]['name'] != this._dataHandlerService.$selectedMenuNode) {
                    if (+tempData['nodes'][j]['entity'] > 1) {
                      this.nodeInfoOfHide.push(tempData['nodes'][j]);
                      tempData['nodes'].splice(j, 1);
                    }
                  }
                }
              }
              for (let k = 0; k < tempData['edges'].length; k++) { // LOOP TO HIDE EDGES OF ABOVE HIDDEN IP
                if ((tempData['edges'][k]) && (tempData['edges'][k]['source'] == node || tempData['edges'][k]['target'] == node)) {
                  this.edgeInfoOfHide.push(tempData['edges'][k])
                  tempData['edges'].splice(k, 1);
                }
              }
            }
          }
        }
      }
      this._dataHandlerService.$hideIntegrationTiersList[nodeInfo] = [... this.nodeInfoOfHide];
      this._dataHandlerService.$hideIntegrationTiersList[edgeInfo] = [... this.edgeInfoOfHide];
      //If flag is true then load the data into toolkit
      if (flag) {
        this.loadToolkit(tempData);
      }
    } catch (error) {
      console.log('error in removeTiersFromFlowmap ');
      console.log(error);
    }
  }

  //method to get the backends name to be deleted from main json object based on tier name
  getBackendsToBeDeleted = function (tier) {
    var start = new Date().getTime();
    var backendsName = this.getBackendNameArrayForTier(tier);

    var temp = [...backendsName];
    for (var i = 0; i < backendsName.length; i++) {
      var srcArray = this.getSourceName(backendsName[i]);
      if (srcArray.length == 1 && srcArray[0] == tier) {
        //delete this backend
        let index = temp.indexOf(backendsName[i]);
        var callDataIndex = this.getIndexInCallData(this.tierStatusData.callData, backendsName[i], "name");
        if (index != -1 && callDataIndex == -1) {
          temp.splice(index, 1);
        }
      }
    }
    //delete common backend from backend array
    temp.forEach(function (val, index) {
      let i = backendsName.indexOf(val);

      if (i != -1) {
        backendsName.splice(i, 1);
      }
    });

    var end = new Date().getTime();
    var time = end - start;

    return backendsName;
  }

  //method to get backend names of given name
  getBackendNameArrayForTier = function (node) {
    var arr = this.getBackendArrayForTier(node);
    if (arr != -1) {
      var tempArr = [];
      arr.forEach(function (val, index) {
        tempArr.push(val.name);
      });
      return tempArr;
    }
    else
      return [];
  }

  //getting backend tier object from call data based on node name
  getBackendArrayForTier = function (node) {
    var index = this.getIndexInCallData(this.tierStatusData.callData, node, "name");
    if (index != -1 && index != 'undefined') {
      return this.tierStatusData.callData[index].backEnd;
    }
    else
      return [];
  }

  //method to get index of node in call data array
  getIndexInCallData = function (array, node, key) {
    var index = -1;
    array.forEach(function (val, i) {
      if (val[key] == node)
        index = i;
    });
    return index;
  }

  //method to fetch source node of backend
  getSourceName = function (node) {
    var tempArr = [];
    this.tierStatusData.callData.forEach(function (val, index) {
      // iterate through array or object /
      var source = val.name;
      val.backEnd.forEach(function (val, index) {
        // iterate through array or object 
        if (val.name == node)
          tempArr.push(source);
      });
    });
    return tempArr;
  }

  openUndoRenamingDialog(){
    let url = this._cavConfig.$serverIP + 'DashboardServer/RestService/KPIWebService/ReadTierMapping' + 
    `?flowMapDir=${this._tsCommonHandler.flowMapDir}&flowMapName=${this._tsCommonHandler.flowMapName}&globalRenaming=${this._tsCommonHandler.globalRenaming}`;
    this._execDashboardUtil.progressBarEmit({ flag: true, color: 'warn' });
    this.isUndoRenamingDialog = true;
    this.http.get(url +  `&productKey=${sessionStorage.productKey}`)
    .subscribe(data => {
      this._execDashboardUtil.progressBarEmit({ flag: false, color: 'warn' });
      
      //opening Undo rename dialog
      //Parsing data to json
      let json = this._dataHandlerService.stringToJSON(data);
      let tempArr = []
      // Pushing data in data table
      for(let key in json){
      /* this was tried earlier but we found out the data from backend comes on the basis of globalRenaming check , So 
        no need to check it explicity and increase complexity, that's y simply adding the data(response) in table
        DO NOT REMOVE THIS CODE NEED FOR FUTURE REFERENCE
        */ 
        // if (this._tsCommonHandler.globalRenaming) {
        //   let nodeNames = [];
        //   let tierNames = [];
        //   for (let node of this._dataHandlerService.$tierStatusData.nodeInfo) {
        //     if (node.entityType == '2' || node.entityType == '3') {
        //       nodeNames.push(node.actualTierName)
        //     }
        //     else if(node.entityType == '0' || node.entityType == '1'){
        //       tierNames.push(node.actualTierName)
        //     }
        //   }
        //   if (nodeNames.toString().includes(key)) {
        //     tempArr.push({ 'propertyName': key, 'propertyValue': json[key] });
        //   }
        //   else if(tierNames.toString().includes(json[key])){
        //     tempArr.push({ 'propertyName': key, 'propertyValue': json[key] });
        //   }
        // }
        // else {
        //   tempArr.push({ 'propertyName': key, 'propertyValue': json[key] });
        // }
        tempArr.push({ 'propertyName': key, 'propertyValue': json[key] });
	}
      this.renamedIPArr = tempArr
    },
      error => {
        this._execDashboardUtil.progressBarEmit({ flag: false, color: 'warn' });
      })
  }

  //To save the selected renamed Ip names to their default names
  saveUndoIPNames(){
    if (!this.selectedIP || this.selectedIP.length < 1) {
      this.showMsg("Select atleast one Integration Point to undo", 'error', 'Error');
      return;
    }
    let url = this._cavConfig.$serverIP + 'DashboardServer/RestService/KPIWebService/UndoRenaming' + 
    `?flowMapDir=${this._tsCommonHandler.flowMapDir}&flowMapName=${this._tsCommonHandler.flowMapName}&globalRenaming=${this._tsCommonHandler.globalRenaming}`;

    let selectedIPActualNameList = []

    for(let item of this.selectedIP){
      //pushing actual name in arr to send to backend
      selectedIPActualNameList.push(item.propertyName)
    }

    this.http.post(url + `&productKey=${sessionStorage.productKey}`, selectedIPActualNameList)
    .subscribe(data => {
      this.getFlowmapDatafromServer()
      this.selectedIP = []
      this.isUndoRenamingDialog = false
    })

  }

  downloadReport(reportType: string) {
    try {
      let body: any[] = [];
      let headers = ["From", "To", "Response Time(ms)", "Calls/Sec", "Count", "Errors", "Errors/Sec"];
      body = this.tableArr.map(res => {
        body = [];
        for (let property in res) {
          body.push(res[property]);
        }
        return body;
      });
      let tmpJsonData = [];
      tmpJsonData.push(headers);
      for (let i = 0; i < body.length; i++)
        tmpJsonData.push(body[i]);
      let jsonData = [
        tmpJsonData
      ];
      let documentHeader = "Call Details Report";
      let request = {};
      request['downloadType'] = reportType;
      request['varFilterCriteria'] = "";
      request['strSrcFileName'] = "ED-call-detail-report";
      request['renameArray'] = "";
      request['jsonData'] = jsonData;
      request['header'] = documentHeader;
      let url = this._cavConfig.$serverIP + 'DashboardServer/RestService/KPIWebService/KPIDownloadData' + `?productKey=${sessionStorage.productKey}`;
      let httpOptions: any = {
        responseType: 'text'
      };
      this.http.post(url, request, httpOptions)
        .subscribe((res) => {
          let path = this._cavConfig.$serverIP + 'common/' + res.toString().replace(/(^")|("$)/g, '');
          window.open(path);
        });
    } catch (e) {
      console.log('Error in downloading', e);
    }
  }

  // Method for data update, calls every 2 mins
  runInContinuousMode() {
    this._dataHandlerService.clearTooltipObjects();
    if (this._dataHandlerService.$isRefreshMode) {
      if (this._tsCommonHandler.$flowMapMode === 2) { //Instance level flowmap 
        this.makeInstanceFlowMapData(this.instanceInfoObj);
      }
      else {
        this.getFlowmapDatafromServer(true);
      }
    }
  }

  //When right click event is called===============
  onTierRightClick(actualTierName, items): any {

    let tempItem = items;

    //storing nodes data
    let nodeInfo = this._dataHandlerService.$tierStatusData.nodeInfo

    //storing call out data
    let callData = this._dataHandlerService.$tierStatusData.callData

    //filtering to get all the DB connection
    nodeInfo = nodeInfo.filter(e => {
      return e.ipType == "DB"
    })

    //Filtering ot get the selected nodes object which has DB info
    callData = callData.filter(e => {
      return e.actualTierName.includes(actualTierName)
    })

    // to store the actualtier names of the DB connections
    var actualDBnameList = [];
    //to store all the backend actualtier name of the selected node
    var ipNameList = []

    //storing the actualtier names of the DB connections
    for (let e of callData) {
      for (let e2 of e.backEnd) {
        actualDBnameList.push(e2.actualTierName)
      }
    }

    //storing backend actualtier name of the selected node
    for (let e of nodeInfo) {
      ipNameList.push(e.actualTierName)
    }

    //getting rows the same elements only
    let dbNames = actualDBnameList.filter(x => ipNameList.includes(x));

    //removing duplicates
    dbNames = dbNames.filter(function (elem, index, self) {
      return index === self.indexOf(elem);
    })

    //emptying array
    this.dbItems.length = 0

    //initaizing items
    tempItem[0].items[2].items = []

    //if size is zero that means no db is present then remove DB queries
    // if (dbNames.length == 0) {
    //   tempItem[0].items.splice(2, 1)
    // }

    //If all is selected or any other item rather than of DB Queries is selected then set their parent as NonIP
    let allDBLabel: any = [
      { "label": "Slow DB Calls By Response Time", "parent": "NonIP" },
      { "label": "Top DB Calls By Count", "parent": "NonIP" },
      { "label": "DB Calls By Business Transaction", "parent": "NonIP" },
      { "label": "Top DB Queries By Error Count", "parent": "NonIP" },
    ]
    tempItem[0].items[2].items.push({ "label": "ALL DB", "items": allDBLabel })

    //Pushing the items in the array
    for (let item of dbNames) {
      let allDBLabel: any = [
        { "label": "Slow DB Calls By Response Time", "parent": item },
        { "label": "Top DB Calls By Count", "parent": item },
        { "label": "DB Calls By Business Transaction", "parent": item },
        { "label": "Top DB Queries By Error Count", "parent": item },
      ]
      tempItem[0]["items"][2]["items"].push({ "label": item, "items": allDBLabel })

    }

    return tempItem;
    // addEventToItems
    // this.drillDownItems = this.addEventToItems(tempItem);
  }

  /** Called when clicking on cancel button of Configure FlowMap */
  cancelConfigureDialog() {
    this._dataHandlerService.$editFlowmapToggle = false;
    this._dataHandlerService.$configureMetrices.showSpecifiedTier = false;
    this._tsCommonHandler.$hiddenTiers = this.hideTier
  }


  //Method to close Dialog of Search
  closeSearchByDialog() {
    this.searchByDialog = false;
    this.tierListOption = [];
    this.selectedtierList = [];
    this.correlationID = [];
    this.modeList = [];
    this.selectedtierListForCustom = []
    this.selectedtierListForLogs = [];
    this.flowpathIDForLogs = '';
    this.correlationIDForLogs = '';
    this.pattern = '';
  }

  //Method to search on the basis of selected header (i.e standard,custom and logs)
  searchBy(event) {
    if (event == 'standard') {
      if ((this.flowpathID == '') && (this.correlationID.length == 0)) {
        this.showMsg("Enter either Correlation ID or  FlowpathID", 'error', 'Error');
        return;
      }
      else if (this.flowpathID == '' && this.correlationID.length != 0) {
        this.flowpathID = '';
      }
      else if (this.flowpathID == '' && this.correlationID.length == 0) {
        this.correlationID = [];
      }

      this._ddrData.searchByCustomDataOptions = '';
      this._ddrData.customData = '';

      this._ddrData.correlationId = this.correlationID.join(",");
      this._ddrData.tierName = this.selectedtierList.join(",");
      this._ddrData.flowpathID = this.flowpathID;
      this._ddrData.product = this._config.$productName.toLocaleLowerCase();
      this._ddrData.dcName = this._tsCommonHandler.dcName;
      this._ddrData.strGraphKey = this._config.$actTimePeriod;
      this._ddrData.mode = this.mode;

      this._menuHandler.handleDdrDrillDown("searchByFlowpath", this._dataHandlerService);

    }
    else if (event == 'custom') {
      if (this.selectedtierListForCustom == undefined || this.customRulesData.length == 0) {
        this.showMsg("Please fillup the required field(s)", 'error', 'Error');
        return;
      }

      // finalVal : To make data of custom to send to ddr
      let finalVal = '';
      for (let key in this.customRulesData) {
        finalVal += this.customRulesData[key].name + ':-:' + this.customRulesData[key].value + ':' + this.customRulesData[key].operationName + ':1:';
      }
      finalVal = finalVal.substring(0, finalVal.length - 3);
      let searchByCustomArr = [];
      for (let key in this.customNameList) {
        searchByCustomArr.push(this.customNameList[key].value)
      }
      let searchByCustomDataOptions = searchByCustomArr.join(',');
      this._ddrData.correlationId = '';
      this._ddrData.flowpathID = '';
      this._ddrData.mode = '';

      this._ddrData.tierName = this.selectedtierList.join(",");
      this._ddrData.product = this._config.$productName.toLocaleLowerCase();
      this._ddrData.dcName = this._tsCommonHandler.dcName;
      this._ddrData.strGraphKey = this._config.$actTimePeriod;
      this._ddrData.searchByCustomDataOptions = searchByCustomDataOptions;
      this._ddrData.customData = finalVal;
      this._menuHandler.handleDdrDrillDown("searchByFlowpath", this._dataHandlerService);

    }
    else if (event == 'logs') {
      if (this.correlationIDForLogs == undefined || this.flowpathIDForLogs == undefined || this.pattern == null || this.selectedtierListForLogs == undefined) {
        this.showMsg("Enter the required field(s)", 'error', 'Error');
        return;
      }

      this._ddrData.correlationId = this.correlationIDForLogs
      this._ddrData.tierName = this.selectedtierListForLogs.join(",");
      this._ddrData.flowpathID = this.flowpathIDForLogs;
      this._ddrData.product = this._config.$productName.toLocaleLowerCase();
      this._ddrData.testRun = this._dataHandlerService.cavConfig.$eDParam.testRun;
      this._ddrData.strGraphKey = this._config.$actTimePeriod;
      this._ddrData.pattern = this.pattern;

      this._menuHandler.createParam('searchByFlowpathLogs');
      //Close Dialog of Search FlowPath
      this.closeSearchByDialog();
    }

  }

  //deletimg Custom rules
  deleteCustomRules(): void {
    if (!this.selectedCustomRules || this.selectedCustomRules.length < 1) {
      this.showMsg("Select row(s) to delete", 'error', 'Error');
      return;
    }
    let selectedRules = this.selectedCustomRules;
    let arrArgIndex = [];
    for (let index in selectedRules) {
      arrArgIndex.push(selectedRules[index]);
      if (selectedRules[index].hasOwnProperty('name')) {
        this.customTypeDelete.push(selectedRules[index].name);
      }
    }
    this.deleteCustomRulesFromTable(arrArgIndex);
    this.selectedCustomRules = [];
    if(this.customRulesData.length==0){	
      this.emptyTable = true;	
    }	
    else{	
      this.emptyTable = false;	
    }
  }

  /**This method is used to delete  Custom Rules from Data Table */
  deleteCustomRulesFromTable(arrRulesIndex: any[]): void {
    //For stores table row index
    let rowIndex: number[] = [];
    for (let index in arrRulesIndex) {
      rowIndex.push(this.getCustomRulesIndex(arrRulesIndex[index]));
    }
    this.customRulesData = this.deleteMany(this.customRulesData, rowIndex);
  }

  //To Delete >=1 id's from a table
  deleteMany(array, indexes = []) {
    return array.filter((item, idx) => indexes.indexOf(idx) === -1);
  }

  //to show and hide the filters in Call details dialog
  showFilters() {
  console.log("AAAAAAAAAAAAAAAAAAAAAAAAA", this.tableArr);
    if (this.isfilter)
      this.isfilter = false
    else
      this.isfilter = true
  }


  /**This method returns selected Custom row on the basis of selected row */
  getCustomRulesIndex(appId: any): number {
    for (let i = 0; i < this.customRulesData.length; i++) {
      if (this.customRulesData[i] == appId) {
        return i;
      }
    }
    return -1;
  }

  //For Custom Rule Table
  saveCustomRules() {
    this.emptyTable = false;
    this.customRulesData = ImmutableArray.push(this.customRulesData, this.customDetail);
    this.customDetail = new customData();
  }

  //New
  customRulesData: customData[];
  customDetail: customData;

  selectedCustomRules: customData[];

  /*drop down variable for Operation */
  operationList: SelectItem[];
  customTypeDelete = [];

  //Variables for Standard
  flowpathChk: boolean;
  searchByDialog: boolean;
  selectedtierList: any = [];
  tierListOption: SelectItem[] = [];
  correlationID: any[];
  flowpathID: any = "";
  mode: string;
  /* Assign dropdown values to Mode */
  modeList: SelectItem[] = [];

  //Variables for Custom
  selectedtierListForCustom: any = []
  customNameList: SelectItem[] = [];

  //Variables  for Logs
  pattern: any;
  flowpathIDForLogs: any;
  correlationIDForLogs: any;
  selectedtierListForLogs: any = [];

  //Generic Method to create Dropdown label-value
  createListWithKeyValue(arrLabel: string[], arrValue: string[]): SelectItem[] {
    let selectItemList = [];

    for (let index in arrLabel) {
      selectItemList.push({ label: arrLabel[index], value: arrValue[index] });
    }

    return selectItemList;
  }

  useLocalRenaming: boolean = false;
  showIPwith0Calls: boolean = false;
  enableTPSCheck: boolean = false;
  enableResponseCheck: boolean = false;
  enableCPUCheck: boolean = false;
  enableApplyToIPCheck: boolean = false;
  showOrHideTiersCheck: boolean = false;
  visibleTiers: any[] = [];
  hiddenTiers: any[] = [];
  onConfigureFlowMapShow() {
    this.useLocalRenaming = !this._tsCommonHandler.globalRenaming;
    this.showIPwith0Calls = !this._tsCommonHandler.nonZeroIP;
    this.enableTPSCheck = this._tsCommonHandler.filterOption1.split(":")[1] == "true";
    this.enableResponseCheck = this._tsCommonHandler.filterOption2.split(":")[1] == "true";
    this.enableCPUCheck = this._tsCommonHandler.filterOption3.split(":")[1] == "true";
    this.enableApplyToIPCheck = this._tsCommonHandler.filterOption4;
    let _n = this.toolkit.getNodes().map(e => { return { id: e.data.id, type: e.data.entity } });//getting all the nodes currently shown in the flowmap
    let _n2 = _n.map(e => e.id).filter(e => e.length);//to remove empty names
    let _t = this._dataHandlerService.$tierStatusData.nodeInfo.map(e => { return { id: e.name, type: e.entityType } }).filter(e => e.id.length && !_n2.includes(e.id)) // getting all the nodes available from last nodeinfo data call
    
    let _tmpHiddenTiers: any[] = this._tsCommonHandler.$hiddenTiers; 
    _t = _t.filter(e=> _tmpHiddenTiers.includes(e.id)) // filtering the nodes here, intially for the first time $hiddenTiers will be blank
    this.visibleTiers = _n.map(e => { return { node: e } });
    this.hiddenTiers = _t.map(e => { return { node: e } });
    this.showOrHideTiersCheck = this.hiddenTiers.length != 0; // setting show/hide visible-hidden tiers list in filter dialog
    this.configTps = !!this._tsCommonHandler.filterOption1.split(":")[3] ? this._tsCommonHandler.filterOption1.split(":")[3] : ''; // setting TPS field value
    this.configRes = !!this._tsCommonHandler.filterOption2.split(":")[3] ? this._tsCommonHandler.filterOption2.split(":")[3] : ''; // setting Response time field value
    this.configCpu = !!this._tsCommonHandler.filterOption3.split(":")[3] ? this._tsCommonHandler.filterOption3.split(":")[3] : ''; // setting CPU field value
    
  }

  /**
   * Sorts a data table having numeric column
   * @param {any} event Event information on datatable sort event
   * @param {any} dataTable The Datatable object whose data to be sorted
   */
  customSort(event, dataTable) {
    dataTable.dataToRender = dataTable.dataToRender.sort((data1, data2) => {
      let value1 = data1[event.field]
      let value2 = data2[event.field]
      value1 = value1 == "< 1" ? 0 : value1;
      value2 = value2 == "< 1" ? 0 : value2;
      let result = null;
      if (value1 == null && value2 != null)
        result = -1;
      else if (value1 != null && value2 == null)
        result = 1;
      else if (value1 == null && value2 == null)
        result = 0;
      else
        result = (value1 < value2) ? -1 : (value1 > value2) ? 1 : 0;
      return (event.order * result);
    });
  }

  //To Show Info Message
  showMsg(msg: string, severity: string = 'info', summary: string = 'Message') {
    // this._dataHandlerService.msgs = [];
    // this._dataHandlerService.msgs.push({ severity: severity, summary: summary, detail: msg });
    this.messageService.add({severity: severity, summary: summary, detail: msg});
  }
  //To show the Tier Integration of selected Node(if that node tier had been hidden)
  showTierIntegration() {
     // on clicking hide tier integration option in dropdown list
    this._dataHandlerService.hideTierIntForselectedMenuNode = false;

    let nodeInfo = this._dataHandlerService.$selectedMenuNode + 'nodeInfo';
    let edgeInfo = this._dataHandlerService.$selectedMenuNode + 'edgeInfo';
    this.items[6]['label'] = 'Hide Tier Integration';
    delete this._dataHandlerService.$hideIntegrationTiersList[this._dataHandlerService.$selectedMenuNode];
    delete this._dataHandlerService.$hideIntegrationTiersList[edgeInfo];
    delete this._dataHandlerService.$hideIntegrationTiersList[nodeInfo];
    this.getFlowmapDatafromServer();
  }

  // to download Excel, word, Pdf File 
  onDownload(reports: string) {

    let callsUnit = "Calls/Sec";
    if(this._tsCommonHandler.callsUnit == "minutes")
      callsUnit = "Calls/Min"
    var arrHeader = ['From', "To", "Response Time(ms)", callsUnit, "Count", "Errors", "Errors/Sec"];
    let tempObj = [];
    tempObj.push(arrHeader);
    this.tableArr.forEach(element => {
      let rowArr = [];
      rowArr.push(element.from, element.to, element.response, element.cps, element.count, element.error, element.eps);

      tempObj.push(rowArr);
    });

    let nodeServerInfo = this._dataHandlerService.getNodePresetURL();
    let host = nodeServerInfo.hostOrigin + this._dataHandlerService.getPresetURLIfExists(nodeServerInfo);
    this._downloaddService.commonDownload(reports, "Call Details", "_callDetails" + "_", '', [tempObj], "Executive Dashboard", host);
  }

  getLabel(tempData: any, i: number, j: number) {
    let cps = tempData['callData'][i]['backEnd'][j]['data'][0]['calls'];
    let ms = tempData['callData'][i]['backEnd'][j]["data"][0]['resCalls'];
    let label = "";
    
    let cUnit = 'cps'
    //convert cps to minutes if callsUnit is minutes
    if (this._tsCommonHandler.callsUnit == 'minutes'){
      cps = cps / 60;
      cUnit = 'cpm'
      this.cUnit = "Calls/Min"
    }
    else{
      this.cUnit = "Calls/Sec";
    }
    //CPU Time
    if(cps < 1 && cps > 0){
      cps =  (+cps).toFixed(3);
    }
    else{
      cps = Math.round(cps);
    }
          
    //Response Time
    if(ms < 10 && ms > 0){
      ms = (+ms).toFixed(3);
    }
    else{
      ms = Math.round(ms);
    }

    if (cps >= 0 && ms >= 0) {
      //CPU Time
      if (cps < 1) {
        cps = (+cps).toFixed(3);
      }
      else {
        cps = Math.round(cps);
      }

      //Response Time
      if (ms < 10) {
        ms = (+ms).toFixed(3);
      }
      else {
        ms = Math.round(ms);
      }
      label = "<span id='customOverlay' class='jtk-overlay overlayLabel'>" + cps + " " + cUnit +", " + ms + " ms</span>";
    }
    else if (cps < 0 && ms < 0) {
      label = "<span id='customOverlay' class='jtk-overlay overlayLabel'></span>";
    }
    else if (cps < 0) {
      label = "<span id='customOverlay' class='jtk-overlay overlayLabel'>" + ms + " ms</span>";
    }
    else if (ms < 0) {
      label = "<span id='customOverlay' class='jtk-overlay overlayLabel'>" + cps + " " + cUnit +"</span>";
    }
    else {
      label = "<span id='customOverlay' class='jtk-overlay overlayLabel'></span>"
    }
    return label;
  }

  /**
     * clears all the configurations of currently selected flowmap
     * @returns void
     */
  private clearFlowmapConfig() {
    this._tsCommonHandler.flowMapMode == '0'
    this.groupList = []
    this._dataHandlerService.$hideIntegrationTiersList
    this._dataHandlerService.listOfSelectedNodeForFlowmap = ''
  }

  /**
   * This method replaces a param value of a url string
   * @param {string} url the string URL
   * @param {string} paramName the paramenter name
   * @param {string} paramValue the new value to be changed to
   */
  private replaceUrlParam(url, paramName, paramValue)
  {
      if (paramValue == null) {
          paramValue = '';
      }
      var pattern = new RegExp('\\b('+paramName+'=).*?(&|#|$)');
      if (url.search(pattern)>=0) {
          return url.replace(pattern,'$1' + paramValue + '$2');
      }
      url = url.replace(/[?#]$/,'');
      return url + (url.indexOf('?')>0 ? '&' : '?') + paramName + '=' + paramValue;
  }
  validateResponseTime(data) {
    //let rpnsTime=data.response_time;
    let rpnsTime = 0;
    if (data != "")
      rpnsTime = data;
    this._menuHandler.handleDdrDrillDown(rpnsTime, this._dataHandlerService);
  }

  openFlowpathIPByResp(respTime) {
    if (respTime === '') {
      //this._ddrData.errorMessage("Response time cannot be empty");
      this.showMsg("Response time cannot be empty", 'error', 'Error');
      console.log("Error openFlowpathIPByResp");
      return;
    }

    console.log("openFlowpathIPByResp response time:" + respTime);
    this._menuHandler.handleDdrDrillDown(respTime, this._dataHandlerService);
    this.responseTime = "";


  }
  //Variable for renameEndPoints
  listOfEndPoints: any[] = [];
  listOfRenameEndPoints: any[] = [];
  isRenameEndPoints: boolean;
  commonEndPointName: string
  //Below methods will filter the data for Integartion Point(s) for left panel for Renaming Dialog
  renameEndPoints() {
    this.listOfRenameEndPoints = [];
    this.commonEndPointName = "";
    this.listOfEndPoints = [];
    this._dataHandlerService.$tierStatusData['nodeInfo'].filter(e => {
      if (e['entityType'] > 1 && e['entityType'] != 3) {
        this.listOfEndPoints.push(e['name'])
      }
    })
    this.isRenameEndPoints = true;
  }
  //On clicking on Apply button(i.e from Rename Integration Point(s) Dialog) the below method will be invoked
  applyRenameEndPoints() {
    if (this.listOfRenameEndPoints.length == 0) {
      this.showMsg('Please select at least one integration point(s)', 'error', 'Error');
      return;
    }
    if (this.commonEndPointName == null || this.commonEndPointName == '') {
      this.showMsg('Please enter name', 'error', 'Error');
      return;
    }
    let renameEndPointsArr = [];
    this._dataHandlerService.$tierStatusData['nodeInfo'].filter(e => {
      if (e['entityType'] > 1) {
        if (this.listOfRenameEndPoints.indexOf(e['name']) != -1) {
          renameEndPointsArr.push(e['actualTierName']);
        }
      }
    })
    let actualName = renameEndPointsArr.join(",");
    let newName = this.commonEndPointName;
    let nodeServerInfo = this._dataHandlerService.getNodePresetURL();
    let url = nodeServerInfo.hostOrigin + this._dataHandlerService.getPresetURLIfExists(nodeServerInfo) + RENAME_TIERNAME + `?requestType=renamingIPs&actualTierName=${actualName}&newTierName=${newName}&flowMapName=${this._dataHandlerService.$selectedFlowmap}&globalRenaming=${this._tsCommonHandler.globalRenaming}&flowMapDir=${this._tsCommonHandler.flowMapDir}`;
    this.http.get(url + `&productKey=${sessionStorage.productKey}`).subscribe((data: any) => {
      if (data) {
        this.showMsg('Integration Point(s) renamed successfully');
        this.isRenameEndPoints = false;
        this.commonEndPointName = "";
        this.listOfRenameEndPoints = [];
        this.getFlowmapDatafromServer();
      }
    })
  }
  /**
   * show tier map for selected tier upto N level
   * Flag is to handle hide or show tier integration.
   */
  showOnlyTierFlowMapUptoNLevel(flag = false, node?: any) {
    this._dataHandlerService.$isSingleTierMode = true;
    let _n = node && node.data && node.data.id ? node.data.id : this._dataHandlerService.$flowmapForSelectedTierName;
    let singleTierObj = [];
    singleTierObj['edges'] = [];
    singleTierObj['nodes'] = [];
    singleTierObj['edges'] = this.fullFlowMapData['edges'].filter((e) => {
      return e.source == _n;
    });

    // Filling Tier Node
    let nodeArr1 = [];
    nodeArr1 = this.fullFlowMapData['nodes'].filter((e) => {
      return e.id == _n;
    });

    // Filling Instance node
    let nodeArr2 = [];
    let tempData = { ...this.fullFlowMapData['nodes'] }
    for (let i = 0; i < singleTierObj['edges'].length; i++) {
      for (let j = 0; j < this.fullFlowMapData['nodes'].length; j++) {
        if (this.fullFlowMapData['nodes'][j].id === singleTierObj['edges'][i].target) {
          nodeArr2.push(this.fullFlowMapData['nodes'][j]);
        }
      }
    }

    singleTierObj['nodes'] = [...nodeArr1, ...nodeArr2];
    const _t = this._tsCommonHandler.$hiddenTiers; // getting hidden tiers
    if (_t.length) {
      singleTierObj['nodes'] = singleTierObj['nodes'].filter(e => !_t.includes(e.id)) // filtering from all the nodes not in hidden list
      singleTierObj['edges'] = singleTierObj['edges'].filter(e => !_t.includes(e.source) && !_t.includes(e.target)) // filtering sorce and targets of all the edges not present in hidden list
    }
    this.previouslySelectedNodeForSelectedTier = this._dataHandlerService.$selectedMenuNode;

    let edgeArray = [];
    let tempNodeArray = [];
    for (let nodeEdge of this.nodesArray) {
      for (let singleTierEdge of singleTierObj['edges']) {
        if (nodeEdge['source'] == singleTierEdge['target']) {
          edgeArray.push(nodeEdge);
          if (!tempNodeArray.includes(nodeEdge['source']))
            tempNodeArray.push(nodeEdge['source'])
        }
      }
    }
    let nodeArrToFill = []
    for (let tempEdge of edgeArray) {
      for (let obj of this.fullFlowMapData['nodes']) {
        if (tempEdge['target'] == obj['id']) {
          nodeArrToFill.push(obj);
        }
      }

    }
    singleTierObj['edges'] = [...singleTierObj['edges'], ...edgeArray]
    singleTierObj['nodes'] = [...singleTierObj['nodes'], ...nodeArrToFill]
    this.loadToolkit(singleTierObj);  // Updating Node

    this.fullFlowMapData = singleTierObj; // re-storing fullflowmap data
  }

  /* Validating Number input */
  validateQty(event): boolean {
    if (event.charCode > 31 && (event.charCode < 48 || event.charCode > 57)) {
      return false;
    } else {
      return true;
    }
  }


  /**
   * This method removes a subSet from a set
   * Can be used in case of string[] or Object[]
   * @param {any[]} set The Array that to be subtracted
   * @param {any[]} subSet The Array to be subtracted from set
   * @param {any} objProperty Optional. Property that is to be used to subtract both arrays
   * @returns {any[]} returns the final array
   */
  private subtractArray(set: any[], subSet: any[], objProperty?: any): any[] {
    let retList: any[] = [];
    if (objProperty) { // if removing list from an array of objects
      retList = set.filter(e=> !subSet.includes(e[objProperty]))
    } else { // if removing list from a string array
      retList = set.filter(e=> !subSet.includes(e))
    }
    return retList;
  }

  private getOwnedFlowmapList(obj) {
    obj = obj && obj.length ? [...obj]:[];
    return obj.filter(e=>e.owner).map(e=> {return {label: e.name, value: e.name}})
  }
}
//To push Data into Array
export class ImmutableArray {
  //to add data in table
  static push(arr, newEntry) {
    return [...arr, newEntry]
  }
}
//Used as DTO in Search By feature : Custom
export class customData {
  value: string;
  name: string;
  operationName?: { dropDownVal: string };
}
