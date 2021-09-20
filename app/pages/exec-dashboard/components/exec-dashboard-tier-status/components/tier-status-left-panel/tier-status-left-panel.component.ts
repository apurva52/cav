// import { SelectItem } from './../../../../../ddr/interfaces/selectitem';
import { TierStatusDataHandlerService } from './../../services/tier-status-data-handler.service';
import { TierStatusCommonDataHandlerService } from '../../services/tier-status-common-data-handler.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ExecDashboardUtil } from '../../../../utils/exec-dashboard-util';
import { SelectItemGroup, Dropdown } from 'primeng';

interface TierModel {
  data?: any;
  children?: TierModel[];
  leaf?: boolean;
  expanded?: boolean;
  index?: number;
}

@Component({
  selector: '[app-tier-status-left-panel]',
  templateUrl: './tier-status-left-panel.component.html',
  styleUrls: ['./tier-status-left-panel.component.css']
})
export class TierStatusLeftPanelComponent implements OnInit {
  
  toggle : boolean = false;
  className: string = "TierStatusLeftPanelComponent";
  isGridView: boolean = false;
  flowMapName: string = this._dataHandlerService.$selectedFlowmap ? this._dataHandlerService.$selectedFlowmap : 'default';
  isRefreshMode: boolean = true;
  isContinuousMode: boolean = true;
  isMinimize: boolean = true;
  selectedDCName;
  isAllExist: boolean = false;
  connectionCall: string;
  valueType: string;
  flowmaparr: any[] = [];
  isProgressBar: boolean = false;
  color = 'primary';

  @ViewChild('nodeSearchDropdown', { read: Dropdown, static : false})
  _nodeSearchDropdown: Dropdown;

//for Grid View
  gridData: TierModel[] = [];
  data: any;
  isAllExpanded: boolean = false;
  columns: any[] = [];
  expandedRows: any[] = [];
  sortedRow: { index: number, sortState: boolean } = null; // index : index of the column, sortState : 1-> ascending, 2-> descending
  isMultiDCEnable: boolean = sessionStorage.getItem('isMultiDCMode') == "true"?true:false;
  dcList: any[] = [];
  private progressSpinnerForcewait: boolean = false; // This flag is used to show the spinner untill all the nodes are rendered in the flowmap
  constructor(public _dataHandlerService: TierStatusDataHandlerService, public _tsCommonHandler: TierStatusCommonDataHandlerService,
    private configUtilityService: ExecDashboardUtil) {
    this.configUtilityService.progressBarProvider$.subscribe(data=> {
      //For resolve this error in Dev Mode add Timeout method -> Error: ExpressionChangedAfterItHasBeenCheckedError: Expression has changed after it was checked.
      setTimeout(()=>{
        // The spinner will not stop untill the forcewait flag is sent false in the loadtoolkit() method of flowmap panel component
        this.progressSpinnerForcewait = data["forceWait"] == undefined?this.progressSpinnerForcewait:data["forceWait"];
        if (data["flag"]) {
          this.isProgressBar = true;
        } else if (data["flag"] == false && !this.progressSpinnerForcewait) {
          this.isProgressBar = false;
        }
        // this.color = flag["color"];
      }, 10); // timeout set to 10ms to overcome the DOM renderer parsing error
      
    });
   }
  toggleDashboard() {
    this._dataHandlerService.$showDashboard = !this._dataHandlerService.$showDashboard;
  }

  ngOnInit() {
    this.connectionCall = this._dataHandlerService.$connectionCall;
    this.valueType = this._dataHandlerService.$valueType;
    this.dcList = this._dataHandlerService.cavConfig.getDCInfoObj().map(e=> {return {label: e.dc, value: e.dc, disabled: false}})
  }

  /** method to change view in left panel
   * ex- flow map to grid view and vice versa
   */
  changeView() {
    this._dataHandlerService.$isShowGridView = !this._dataHandlerService.$isShowGridView ;
    this.isGridView = !this.isGridView;
  }

  /**
   * this method is used to get the selected metrices from TPS,Res,CPU and Err and 
   * to show and hide the values of the same
   * @param value 
   */
  disableSystemMetrix(i) {
    this._dataHandlerService.$enabeSystemMetrices[i]['metrics'] = !this._dataHandlerService.$enabeSystemMetrices[i]['metrics'];
    console.log(' value of from symmetry', this._dataHandlerService.$enabeSystemMetrices[i]['name'], this._dataHandlerService.$enabeSystemMetrices[i]['metrics']);
  }

  /**
   * Method to start and stop refreshing the page
   */
  refresMode(flag: boolean) {
    this._dataHandlerService.isRefreshMode = flag;
    this._dataHandlerService.$isRefreshMode = flag;
  }

  /**method to minimize and maximize the Tier-status flowmap window */
  minMax() {
    this._dataHandlerService.$isMinMax = !this._dataHandlerService.$isMinMax;
    this._dataHandlerService.$isMinimize = true;
  }

  /**
   * method to handle multiple request on dc selection
   */
  private dcSelectionTimeoutObject = null;
  onDCSelection() {
    clearTimeout(this.dcSelectionTimeoutObject);
    this.dcSelectionTimeoutObject = setTimeout(() => {
      if (this._dataHandlerService.$MultiDCsArr.length <= 1) {
        if (this._dataHandlerService.$dcList.length != 0 && this._dataHandlerService.$MultiDCsArr.length == 0) {
          this._dataHandlerService.$MultiDCsArr = [this._dataHandlerService.$dcList[0].value]
        }
        this._dataHandlerService.$isAllDCs = false;
        this._dataHandlerService.commonTierHandler.serverType = 0;
        this._dataHandlerService.$multiDCMode = false;
        this._dataHandlerService.commonTierHandler.flowMapDir = '.flowmaps';
	this._dataHandlerService.commonTierHandler.dcName = this._dataHandlerService.$MultiDCsArr.toString();
	this._dataHandlerService.$servletName = 'DashboardServer';
	this._dataHandlerService._config.$setHostUrl = this._dataHandlerService.$DCsInfo.map(e=> {if (e.dc == this._dataHandlerService.$MultiDCsArr.toLocaleString()) return e.protocol+"://"+e.ip+":"+e.port+"/";else return false}).filter(e=>e).toLocaleString();
	this._dataHandlerService.cavConfig.$eDParam.testRun = this._dataHandlerService.$DCsInfo.filter(e=> e.dc == this._dataHandlerService.$MultiDCsArr.toLocaleString())[0].testRun;
      } else if (this._dataHandlerService.$MultiDCsArr.length > 1) {
        this._dataHandlerService.$isAllDCs = true;
        this._dataHandlerService.$multiDCMode = true;
        this._dataHandlerService.commonTierHandler.serverType = 1;
        this._dataHandlerService.commonTierHandler.flowMapDir = '.flowmapsAll';
	this._dataHandlerService.commonTierHandler.dcName = 'ALL';
	this._dataHandlerService.$servletName = 'IntegratedServer';
	this._dataHandlerService._config.$setHostUrl = this._dataHandlerService.$DCsInfo.map(e=> {if(e.isMaster==true) return e.protocol+"://"+e.ip+":"+e.port+"/";else return false}).filter(e=> e).toLocaleString();
	this._dataHandlerService.cavConfig.$eDParam.testRun = this._dataHandlerService.$DCsInfo.filter(e=> e.isMaster)[0].testRun;
      }
      // Calling Observer of Flowmap-panel.component.ts to update the flowmap content
      this._dataHandlerService.getTSData('MULTIDC');
    },1000);
    sessionStorage.EDSelectedFlowmap = undefined;
  }


  autoLayout() {
    console.log('autoLayout called ');
    let msg = 'AUTO_LAYOUT';
    this._dataHandlerService.leftPanelLayoutHandler(msg);
  }

  autoFitLayout() {
    console.log('autoFitLayout called ');
    let msg = 'AUTO_FIT_LAYOUT';
    this._dataHandlerService.leftPanelLayoutHandler(msg);
  }

  circularLayout() {
    console.log('circularLayout called ');
    let msg = 'CIRCULAR_LAYOUT';
    this._dataHandlerService.leftPanelLayoutHandler(msg);
  }
  saveAsFlowMap() {
    this._dataHandlerService.$saveAsFlowmap = true;
  }
  saveFlowMap() {
      let owner;
    if(this._dataHandlerService.$selectedFlowmap == "default"){//checking separately bcuz flowMapJsonArr do not have default flowmap entry
      owner = true;
    }

    this._dataHandlerService.$flowMapJsonArr.map(e => {
      if (this._dataHandlerService.$selectedFlowmap == e.name) {
        owner = e.owner
      }
    });

    if (!owner) {
      this.showInfoMsg(sessionStorage.sesLoginName + " don't have Permission to Save '" + this._dataHandlerService.$selectedFlowmap + "' Flowmap", 'error', 'Error');
      return;
    }
    this._dataHandlerService.$saveFlowmap = true;
  }

  onConnectionClick() {
    // alert('hello tima ' + this.connectionCall);
    this._dataHandlerService.$connectionCall = this.connectionCall;
    let msg = 'CONNECTION_CLICK';
    this._dataHandlerService.leftPanelLayoutHandler(msg);
  }

  onValueTypeChange() {
    // alert('hello tima tima ' + this.valueType);
    // this._dataHandlerService.$valueType = this.valueType;
    this._tsCommonHandler.valueType = this.valueType;
    let msg = 'VALUE_TYPE_CHANGE';
    this._dataHandlerService.leftPanelLayoutHandler(msg);
  }

  getFlowMapList(event) {
    //Filter out object having non-blank label
    this.flowmaparr = this._dataHandlerService.$flowmapList.filter(obj => obj['label'] != '');

    if (this.flowmaparr.length == 0) {
      this._dataHandlerService.$flowmapList = [{ lable: "Default Flowmap", value: "default", selected: true }];
      this.flowmaparr = this._dataHandlerService.$flowmapList;
    }
    else {
      let tempArr = [];
      let n = this._dataHandlerService.$flowmapList.length;
      for (let i = 1; i < n; i++) { //push flowmap in temp array except the default(0th index)
        tempArr.push(this._dataHandlerService.$flowmapList[i]);
      }
      this._dataHandlerService.commonSort(tempArr, "label");//sorts the flowmap list in lexicographical order
      tempArr.splice(0, 0, this._dataHandlerService.$flowmapList[0]);//putting the default flowmap at index 0
      this._dataHandlerService.$flowmapList = [...tempArr];//assigning the temp array to original flowmap array
    }
  }
  
  nodes: SelectItemGroup[] = []; // search nodes list
  private searchDropdownObject = null;
  /**
   * Renders the search node dropdown called on search icon click
   * @param event event object of the search icon click
   * @param data the nodes list dropdown object
   */
  showSearchNodes(event, data) {
    // this.searchDropdownObject = data; // storing the search dropdown object to a instance variable
    // this._dataHandlerService.searchNodesDropdownList = {display: ""};
    // if (data.el.nativeElement.style.display == "inherit" &&  this._dataHandlerService.showSearch) { // check if dropdown already shown
    //   data.el.nativeElement.style.display = "none"; // hide dropdown
    // } else {
      let commonSubscriber = this._dataHandlerService._config.$commonSubscription.subscribe((response) => {  // this calls when doing some common handlings
        if (response["message"] == "GET_NODES_FROM_FLOWMAP") { // check if all visible nodes received from flowmap-panel component
          this._dataHandlerService.showSearch=true;
          // data.el.nativeElement.style.display = "inherit"; // make dropdown visible
          let NDTiers = []; // stores all the ND tiers in a group
          let NonNDTiers = []; // stores all the NonND tiers in a group
          let IPs = []; // stores all the integration points in a group
          response["data"].forEach(e=> { // iterate all the nodes received from flowmap-panel
            if (e.data.entity == 0) { // check if ND tiers
              NDTiers.push({label: e.data.id, value: e.data.id, entityType: 0});
            } else if (e.data.entity == 1) { // check if NonND tiers
              NonNDTiers.push({label: e.data.id, value: e.data.id, entityType: 1});
            } else { // push to IP otherwise
              IPs.push({label: e.data.id, value: e.data.id, entityType: e.data.entity});
            }
          })
          this.nodes = [];
          if (NDTiers.length) this.nodes.push({label: "Application Agent Node", items: NDTiers});
          if (NonNDTiers.length) this.nodes.push({label: "Machine Agent Node", items: NonNDTiers});
          if (IPs.length) this.nodes.push({label: "Integration Point", items: IPs});
          this.searchNodePlaceholder = "Search Node";
          // data.el.nativeElement.children[0].style.maxWidth = "350px"; // fix the dropdown width to handle nodes with large names
	        // data.el.nativeElement.children[0].style.marginTop = "-2%";
          // data.el.nativeElement.children[0].click(); // show the list in the dropdown
        }
      })
      this._dataHandlerService.leftPanelLayoutHandler("SEARCH_NODES"); // get the toolkit nodes
      commonSubscriber.unsubscribe(); // clear commonSubscriber from memory
    // }
  }

  /**
   * This method called when search node dropdown shows
   */
  unselectNodeOnDropdownShow(dropdown) {
    dropdown.selectedOption = {};
  }
  private stylesTagQueue: any[] = []; // stores all the styles tag index added in DOM
  searchNodePlaceholder = "Search node" // search node dropdown placeholder text
  /**
   * called when change an item from search node dropdown list
   * @param nodeId id used by jsplumb
   */
  bounceUpNode(nodeId: any, dropdown: any){
    if (nodeId == undefined) {
      return;
    }
    let nodeElement = document.querySelector("div[data-jtk-node-id='"+nodeId+"']"); // get the element from DOM using the provided id
    this.removeStyleFromDOM(nodeElement.id);
    let queueLength = this.stylesTagQueue.length;
    this.stylesTagQueue.push({nodeId: nodeElement.id})
    setTimeout(()=> { // settimeout used to give DOM some rendering time
      let borderWidth = "4px";
    let borderColor = "#0eb7da";
    let positionPixels = "-15px"; // default position for tiers
    if (nodeElement["className"].includes("output-node")) {
      positionPixels = "-7px"; // set position for integration points
    }
    let customStyles = `div#${nodeElement.id}::before,div#${nodeElement.id}::after{content:"";position:absolute;width:130%;height:130%;left:${positionPixels};top:${positionPixels};border-radius:50%;}div#${nodeElement.id}::before{border:${borderWidth} solid transparent;}div#${nodeElement.id}::before{border-top-color:${borderColor};border-right-color:${borderColor};border-bottom-color:${borderColor};border-left-color:${borderColor};border-left:${borderWidth} solid ${borderColor};transition:border-top-color 0.2s linear,border-right-color 0.2s linear 0.1s,border-bottom-color 0.1s linear 0.15s,border-left-color 0.2s linear 0.2s;}`; // css to show border
    let styleElement = document.createElement("style"); // create a style tag
    styleElement.type  = "text/css"; 
    styleElement.innerText = customStyles;
    document.head.appendChild(styleElement); // add to DOM
      nodeElement["style"]["z-index"] = this._dataHandlerService.$globalZIndex; // show selected node at the top
      let disappearCircleCSS = `\ndiv#${nodeElement.id}::before{border-color:transparent!important;border-top-color:${borderColor};border-right-color:${borderColor};border-bottom-color:${borderColor};border-left-color:${borderColor};transition:border-left-color 10s linear,border-bottom-color 10s linear 0.1s,border-right-color 10s linear 0.2s,border-top-color 10s linear 0.3s;}div#${nodeElement.id}::before{border-color:transparent!important;border-top-color:${borderColor};border-right-color:${borderColor};border-bottom-color:${borderColor};border-left-color:${borderColor};transition:border-left-color 10s linear,border-bottom-color 10s linear 0.1s,border-right-color 10s linear 0.2s,border-top-color 10s linear 0.3s;}`; // css to remove border
      styleElement.innerText += disappearCircleCSS; // append to DOM
      let styleTags = document.head.getElementsByTagName("style"); // get all style elemets avaiable in DOM
      this.stylesTagQueue[queueLength].index = styleTags.length; // enqueue list
      let tmpValue = dropdown.value;
      dropdown.selectedOption = {}
      this.searchNodePlaceholder = tmpValue;
    }, 100)
    this.stylesTagQueue[queueLength].timerID = setTimeout(()=>{ // remove all the animation
      this.removeStyleFromDOM(nodeElement.id)
    }, 12000)
  }

  /**
   * Removes the style element added to show the circle after searching a node
   * @param nodeId the node id present in DOM Ex: jsPlumb_2_2
   */
  removeStyleFromDOM(nodeId: string) {
    let styles = document.getElementsByTagName('style')
    for (let i = 0; i < styles.length; i++) {
      if (styles[i].innerText.includes(nodeId)) {
        document.head.removeChild(styles[i]);
        this.stylesTagQueue.splice(i, 1);
      }
    }
    this.stylesTagQueue.forEach((e,index)=>{
      if (e.nodeId == nodeId) {
        clearTimeout(e.timerID);
        this.stylesTagQueue.splice(index,1);
      }
    })
  }
  
  editFlowMap(event, flowmap) {
    event.stopPropagation();
    this._dataHandlerService.$renameFlowMap = true;
    this._dataHandlerService.$oldFmap = flowmap;
  }
getSelectedDCName() {
    if (!this.selectedDCName && this._dataHandlerService.$dcList) {
      this.selectedDCName = [this._dataHandlerService.$dcList[0].value]
  }
}
 checkSelectedDCName() {
    try {
      setTimeout(() => {
        if (this._dataHandlerService.$dcList.length) {
          this.selectedDCName = this._dataHandlerService.$MultiDCsArr.length?this._dataHandlerService.$MultiDCsArr:this._dataHandlerService.$dcList.length?[this._dataHandlerService.$dcList[0].value]:[]
        } else{
          this.checkSelectedDCName()
        }
      }, 500)
    } catch (e) {
      console.error("Error inside checkSelectedDCName" + e)
    }
  }

   showInfoMsg(msg: string, severity: string = 'info', summary: string = 'Message') {
    this._dataHandlerService.msgs = [];
    this._dataHandlerService.msgs.push({ severity: severity, summary: summary, detail: msg });
  }
   initializeGridView() {
    this.data = this._dataHandlerService.$tierStatusData;
    this.columns = [
      { field: 'from', header: 'From', style: { 'width': '120px', 'cursor': 'pointer' }, icon: 'tier' },
      { field: 'to', header: 'To', style: { 'width': '120px' }, icon: 'tier' },
      { field: 'tps', header: 'TPS/CPS', style: { 'width': '50px', 'cursor': 'pointer' }, icon: 'page_legend' },
      { field: 'res', header: 'Res Time', style: { 'width': '50px', 'cursor': 'pointer' }, icon: 'response_legend' },
      { field: 'cpu', header: 'CPU(%)', style: { 'width': '50px', 'cursor': 'pointer' }, icon: 'cpu_legend' },
      { field: 'count', header: 'Count', style: { 'width': '50px', 'cursor': 'pointer' }, icon: 'total-order' },
    ];
    let currentData: any;
    let gridDataIndex: number = 0;
    this.gridData = [];
    let tierArr = [];

    if(this._dataHandlerService.$isSingleTierMode){
    let _n3 = [];
    let _n = this.data.callData.filter(e => e.actualTierName == this._dataHandlerService.$selectedNode)[0];
    if(_n == undefined){
      this.showInfoMsg("No calls for selected flowmap", 'error');
    }
     
    let tierNameArr = _n.actualTierName;
    let temp;

    for (let i = 0; i < _n.length; i++) { // to loop through all the tier in call data which are visible on screen
      _n[i].backEnd.forEach(element=>{
        temp = this.data.callData.filter(e => e.actualTierName == element.name && !tierNameArr.includes(element.name))[0];
        if(temp!= undefined){
          _n.push(temp);
          tierNameArr.push(temp.actualTierName);
        }
      }); 
    }

    //Array containing callData of the tiers in singleMode
    _n3.push(_n);
      tierArr = _n3;
    }
    else{
      tierArr = this.data.callData;
    }

      tierArr.forEach(element => {
        if(element == undefined) 
          return;
        if (element.name.trim() == "")
          return;
        currentData = this.data.nodeInfo.filter(res => res.actualTierName == element.actualTierName)[0];
        console.log("CURRENT DATA------------------------",currentData);
        if (!currentData) return;
        element.backEnd.forEach(innerElement => {
          innerElement.from = "";
          innerElement.to = innerElement.name;
        });
        this.gridData.push(
          {
            data:
            {
              from: element.name,
              to: '',
              actualName: element.actualTierName,
              tps: currentData.pvs,
              res: currentData.res,
              cpu: currentData.cpu,
              count: currentData.count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
              icon: currentData.icon
            },
            children: this.createIPData(element.backEnd, this.data.nodeInfo),
            index: gridDataIndex++,
          });
      });
  }
  
  createIPData(backEnd: any, nodeInfo: any): any {
    let backEndLocal: any[] = [];
    let _: any;
    backEnd.forEach((element, index) => {
      _ = nodeInfo.filter(res => res.actualTierName == element.actualTierName);
      backEndLocal[index] = {
        data: {
          from: "",
          to: element.name,
          tps: element.data[0].calls,
          res: element.data[0].resCalls,
          cpu: "-",
          count: element.data[0].callCount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
          icon: _.length == 0 ?"":_[0].icon 
        }
      };
    });
    return backEndLocal
  }
  updateExpandedRows() {
    let totalRowsExpanded: number = 0;
    this.expandedRows.forEach(() => totalRowsExpanded++)
    this.isAllExpanded = totalRowsExpanded == 0 ? false : true;
  }
  expandAllRows() {
    if (!this.isAllExpanded) {
      this.gridData.forEach((element, index) => {
        this.expandedRows[index] = 1;
      });
      this.isAllExpanded = true;
    } else {
      this.expandedRows = [];
      this.isAllExpanded = false;
    }
  }

  // updates the sortedrow property
  updateSortedIcons(index: number, ) {
    if (this.sortedRow != null) {
      if (this.sortedRow.index == index) {
        this.sortGrid(index, !this.sortedRow.sortState);
      } else {
        this.sortedRow = null;
        this.sortGrid(index, true);
      }
    } else {
      this.sortGrid(index, true);
    }
  }

  // Sorts the table. index is the column, order:- true-> ascending
  sortGrid(index: number, order?: boolean) {
    this.sortedRow = { index: index, sortState: order };
    let field = this.columns[index].field;
    if (index == 0) {
      if (order) {
        this.gridData = this.gridData.sort((a, b) => a.data[field].localeCompare(b.data[field]));
      } else {
        this.gridData = this.gridData.sort((a, b) => b.data[field].localeCompare(a.data[field]));
      }
    } else if (index > 1) {
      if (order) {
        if (index == 5) {
          this.gridData = this.gridData.sort((a, b) => parseInt(a.data[field].replace(/,/g,"")) - parseInt(b.data[field].replace(/,/g,"")));
        } else {
          this.gridData = this.gridData.sort((a, b) => a.data[field] - b.data[field]);
        }
      } else {
        if (index == 5) {
          this.gridData = this.gridData.sort((a, b) => parseInt(b.data[field].replace(/,/g,"")) - parseInt(a.data[field].replace(/,/g,"")));
        } else {
          this.gridData = this.gridData.sort((a, b) => b.data[field] - a.data[field]);
        }
      }
    } else {
      return;
    }
  }

  //called when clicked on a tier in grid view
  updateRightPanelTier(data: any) {
    this._dataHandlerService.$selectedNode = data.actualName;
    this._dataHandlerService.$selectedMenuActualNameNode = data.actualName;
    this._dataHandlerService.$selectedMenuNode = data.from;
    this._dataHandlerService.flowChartActionHandler('TOGGLE_SELECTION');
  }

  ngOnDestroy(): void {
    // hide search dropdown list
    this._dataHandlerService.searchNodesDropdownList = {display: "none"};
  }
} // end of file.
