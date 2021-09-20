import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { SelectItem, ConfirmationService, TreeNode, MessageService } from 'primeng/api';
import { UtilityService } from '../../../services/utility.service';
import { ImmutableArray } from '../../../services/immutable-array';
import * as _ from "lodash";
import { GenericGDFData } from '../../../containers/generic-gdf-data';
import { MetricHierarchyData } from '../../../containers/metric-hierarchy-data';
import * as GDF_DROPDOWN from '../../../constants/generic-gdf-dropdown-constants';
import * as TABLEHEADER from '../../../constants/generic-gdf-tableheader';
import * as GEN_GDF from '../../../constants/generic-gdf-constants';
import { GenericGdfService } from '../../../services/generic-gdf-service';
import { ChangeDetectorRef } from '@angular/core';
import { CustomMonitorService } from 'src/app/pages/monitor-up-down-status/configure-monitors/add-custom-monitor/services/custom-monitor.service';
//import { customMonitorService } from 'src/app/pages/monitor-up-down-status/configure-monitors/add-custom-monitor/services/custom-monitor.service';
//import { MonitorupdownstatusService } from 'src/app/pages/monitor-up-down-status/service/monitorupdownstatus.service';
// import { MonConfigurationService } from '../../../../monitor/services/mon-configuration.service';
// import { CustomMonitorService } from '../../../../monitor/services/custom-monitor.service';
// import { MessageService } from '../../../../monitor/services/message.service';
// import * as COMPONENT from '../../../../monitor/constants/mon-component-constants';
import * as COMPONENT from '../../../../monitor-up-down-status/configure-monitors/add-custom-monitor/constants/mon-component-constants';
import * as MSGCOMPONENT from '../../../../monitor-up-down-status/configure-monitors/add-monitor/constants/monitor-configuration-constants';

const TIER = "Tier";
const SERVER = "Server";
const NO_HIERARCHY_MSG = "Select Metric Hierarchy to delete";

@Component({
  selector: 'app-metric-hierarchy',
  templateUrl: './metric-hierarchy.component.html',
  styleUrls: ['./metric-hierarchy.component.scss'],
  providers: [ConfirmationService],
  encapsulation: ViewEncapsulation.None,
})

export class MetricHierarchyComponent implements OnInit {

  @Input() item = new GenericGDFData();
  @Input() showMetHierCols: any;
  @Output() tableData = new EventEmitter();

  gdfInfo: GenericGDFData //gdf information
  hrchicaltableData: MetricHierarchyData[] = [];
  hrData: MetricHierarchyData; // table value of metric hierarchy data table.
  hierarchicaList: SelectItem[] // list of hierarchical view
  filterList: SelectItem[]; //_filter list can be positive and negative filters
  countInHrTable: number = 0;
  showHrDailog: boolean = false;
  confirmationService: any;
  isFromEdit: boolean = false;
  tempId: number = 0; //variable is used to hold temporary id of the selected row of metric hierarchy table used in EDIT functionality
  selectedHr: MetricHierarchyData[]; //This variable is used to store the selected metric hierarchy.
  dailogHeader: string = ''; // dailog header for metric Hierarchy
  cols: any[] = [];
  metricList: SelectItem[]; // metric type list used in GDF
  customMetric: string = ''; // variable to hold custom metric type 
  useTier: boolean = false; // checkbox value for use Tier
  useServer: boolean = false; // checkbox value for use Server
  subscription: Subscription;
  changeOTypeSubscription: Subscription;

  /**Flag variables for showing fields on basis of visibility of column in datatable */
  displayMetaData: boolean = true;
  displayDefVal: boolean = true;
  displayKeyInd: boolean = true;
  displayFilterType: boolean = true;
  displayFilter: boolean = true;
  displayHr: boolean = true;
  displayVectorPrefix: boolean = true;
  displayVectorSuffix: boolean = true;
  keyIndexLabel: string = 'Field Number';// show by default label for Key/index in add metric hierarchy dialog
  treeNodeValue: TreeNode[];

  checked1: boolean = false;
  vectorValue: string = 'indexKey'; // radiobutton default value is "Field Number". Other option is 'defVal'.
  autofill: Subscription;
  indexList: SelectItem[];
  monType: string = '';  //monitor type (nf/cmd/statsd)
  mKeyList: SelectItem[];   //it is column keyList in metric hierarchy
  rejectVisible: boolean = true;
  acceptLable: string = "Yes";

  deleteNodeNumber: any[] = [];
  //used in html template
  // TYPE_DB = COMPONENT.DB_TYPE;
  // TYPE_STATSD = COMPONENT.STATSD_TYPE;
  // TYPE_CMD = COMPONENT.CMD_TYPE;

  constructor(private cms: ConfirmationService,
    private cd: ChangeDetectorRef,
    private customMonService:CustomMonitorService,
    private genericServiceObj: GenericGdfService,
    private msgService:MessageService
    ) { }

  ngOnInit() {
    this.monType = this.customMonService.monType
    this.gdfInfo = new GenericGDFData();
    this.getDropDownList();
    this.displayTableColumns(this.showMetHierCols);
    this.subscription = this.customMonService.$saveMonitorConf.subscribe((res) => {
      if (res) {
        this.createMetricHierarchy()
      }
    });

    this.changeOTypeSubscription = this.customMonService.$changeOutPutType.subscribe((res) => {
      if (res) {
        this.changeTableHeader(res);
      }
    });
  if(this.customMonService.monType == "db"){
    // this.customMonService.monType = "";
  //   this.metricList = [{
  //     label : 'Application Metrics',
  //     value : 'Application Metrics'
  //  },
  //  {
  //    label : 'System Metrics',
  //     value : 'System Metrics'
  //  },
  //  {
  //   label : 'Postgres Metrics',
  //    value : 'Postgres Metrics'
  // },

  // {
  //   label : 'Oracle Metrics',
  //    value : 'Oracle Metrics'
  // },
  // {
  //   label : 'MySQL Metrics',
  //    value : 'MySQL Metrics'
  // },
  // {
  //   label : 'Microsoft SQL Metrics',
  //    value : 'Microsoft SQL Metrics'
  // },
  // {
  //   label : 'IBM DB2 Metrics',
  //   value : 'IBM DB2 Metrics'
  // },
  //  {
  //    label : 'Custom Metrics',
  //     value : 'Custom Metrics'
  //  }
   
  //  ]
  }
  // else{
  //   this.metricList = [{
  //     label : 'Application Metrics',
  //     value : 'Application Metrics'
  //  },
  //  {
  //    label : 'System Metrics',
  //     value : 'System Metrics'
  //  },
  //  {
  //    label : 'Custom Metrics',
  //     value : 'Custom Metrics'
  //  }
   
  //  ]
  // }

    let that = this;
    //case of EDIT MODE
    if (this.item['gdfInfo']['depMHComp'].length > 0) {
      this.hrchicaltableData = this.item['gdfInfo']['depMHComp'];
      this.hrchicaltableData.map(function (item) {
        that.getFilterDropdownLabel(item)
      })

    }
    this.getMetricDescriptionValue(this.item['gdfInfo'])

    this.autofill = this.customMonService.$metricHierchy.subscribe((res) => {
      if (res) {
        this.hrchicaltableData = res;
        this.getMetricHierarchyTree();
        this.emitTableData()
      }
    })
    this.getMetricHierarchyTree();

    if (this.monType != 'statsd' && this.monType != 'db' ) {
      if (this.item['oType'] == "2") //Output type (string-1/keyValue-2/JSON-3/JMX-4)
      {
        this.onEditchangeTableHeader("Column Key");
      }
      else {
        this.onEditchangeTableHeader("Field Number");
      }
    }

    //used for filling data to columnKey dropdown in edit mode for statsd monitor
    if (this.customMonService.isFromEdit && this.monType == 'statsd') {
      this.onEditFillKeyIndex();
    }
  }

  //Method called when component is loaded initially to get list of all the dropdowns.
  getDropDownList() {
    this.hierarchicaList = UtilityService.createListWithKeyValue(GDF_DROPDOWN.HR_LABEL, GDF_DROPDOWN.HR_VALUE);
    this.filterList = UtilityService.createListWithKeyValue(GDF_DROPDOWN.FILTER_LABEL, GDF_DROPDOWN.FILTER_VALUE);
    if(this.monType == COMPONENT.DB_TYPE)
      this.metricList = UtilityService.createListWithKeyValue(GDF_DROPDOWN.METRIC_DB_LIST_LABEL, GDF_DROPDOWN.METRIC_DB_LIST_VALUE);
    else
      this.metricList = UtilityService.createListWithKeyValue(GDF_DROPDOWN.METRIC_LIST_LABEL, GDF_DROPDOWN.METRIC_LIST_VALUE);
  }

  /**Method called when we want to add metric Hierarchy */
  addHierachy() {
    this.dailogHeader = 'Add Metric Hierarchy';
    this.showHrDailog = true;
    this.isFromEdit = false;
    this.showDailogFields(this.cols);
    this.clearHrDailog();

    //creating keyIndex dropdown for db monitor
    if(this.monType == COMPONENT.DB_TYPE && this.item['output'] != null)
    {
        this.fillKeyIndexData(this.item['output']);
    }
    /**
    * this check is used when user click on add metric heirarchy button so columnKey dropdown should be filled
    * according to metric syntax in statsd monitor
    */
    if (this.monType == COMPONENT.STATSD_TYPE && this.item['ms'] != '' && this.hrchicaltableData.length == 0) {
      let arr = this.getKeyIndexData();
      this.mKeyList = UtilityService.createDropdown(arr);   //creating dropdown for keyIndex
    }
    else if (this.monType == COMPONENT.STATSD_TYPE && this.hrchicaltableData.length != 0) {
      this.mKeyList.length = 0;
    }
  }

  displayTableColumns(showColumns) {
    if (showColumns.length == 0) // for default case
      this.cols = TABLEHEADER.METRIC_HIER_HEADER_LIST;
    else{
      this.cols = showColumns; // in case of specific monitor
    }
  }

  /**Method to show input fields in Add/Edit hierarchy dialog */
  showDailogFields(cols) {
    let that = this;
    cols.map(function (each) {
      if (each[TABLEHEADER.FIELD] == TABLEHEADER.METRIC_GROUP_NAME && each[TABLEHEADER.VISIBLE]) {
        that.displayMetaData = false;
      }
      if (each[TABLEHEADER.FIELD] == TABLEHEADER.DEF_VAL && each[TABLEHEADER.VISIBLE]) {
        that.displayDefVal = false;
      }
      if (each[TABLEHEADER.FIELD] == TABLEHEADER.KEY_INDEX && each[TABLEHEADER.VISIBLE]) {
        that.displayKeyInd = false;
      }
      if (each[TABLEHEADER.FIELD] == TABLEHEADER.FILTER_TYPE && !each[TABLEHEADER.VISIBLE]) {
        that.displayFilterType = false;
      }
      if (each[TABLEHEADER.FIELD] == TABLEHEADER.FILTER && each[TABLEHEADER.VISIBLE]) {
        that.displayFilter = false;
      }
      if (each[TABLEHEADER.FIELD] == TABLEHEADER.HIERARICAL_VIEW && !each[TABLEHEADER.VISIBLE]) {
        that.displayHr = false;
      }
    })
  }

  /**Method called when save is clicked in add hierarchy dailog box */
  saveHierarchy() {
    let that = this;
    if((this.monType == COMPONENT.STATSD_TYPE || this.monType == COMPONENT.DB_TYPE) && this.hrData._keyInd == '')
    {
      this.msgService.add({severity:MSGCOMPONENT.SEVERITY_ERROR, summary: MSGCOMPONENT.SUMMARY_ERROR,detail:"Please fill out Column Key"});
      return;
    }
    /**If already entries exists in the table then we need to assign
     * id according to the id for the last entry in the table
     */
    if (this.hrchicaltableData.length != 0) {
      let lastRowId = this.hrchicaltableData[this.hrchicaltableData.length - 1];
      this.countInHrTable = lastRowId.id + 1;
    }
    else
      this.countInHrTable = 0; // id for the first row entry in the table 

    let status = false;
    if (!this.isFromEdit) {
      this.hrchicaltableData.map(each => {
        if (each._metadata.trim() == that.hrData["_metadata"].trim()) {
          that.msgService.add({severity:MSGCOMPONENT.SEVERITY_ERROR, summary: MSGCOMPONENT.SUMMARY_ERROR,detail:`Duplicate Metric Hierarchy Component '${each._metadata}'`});
          status = true;
          return;
         }
        else if (each._keyInd == that.hrData["_keyInd"]) {
          if(each._keyInd_ui){
            that.msgService.add({severity:MSGCOMPONENT.SEVERITY_ERROR, summary: MSGCOMPONENT.SUMMARY_ERROR,detail:`Duplicate Column key '${each._keyInd_ui}'`});
          }
          else
           that.msgService.add({severity:MSGCOMPONENT.SEVERITY_ERROR, summary: MSGCOMPONENT.SUMMARY_ERROR,detail:`Duplicate Column key '${each._keyInd}'`});  
          status = true;
          return;
        }
      })
      if(status) {
        return false;
      }
      this.hrData["id"] = this.countInHrTable;

      this.getFilterDropdownLabel(this.hrData) // getting dropdown label in UI.
      this.hrchicaltableData = ImmutableArray.push(this.hrchicaltableData, this.hrData);
    }
    else {
      this.hrchicaltableData.map(each => {
        if(each.id == this.hrData["id"]){
          return;
        }
        if (each._metadata.trim() == that.hrData["_metadata"].trim()) {
          that.msgService.add({severity:MSGCOMPONENT.SEVERITY_ERROR, summary: MSGCOMPONENT.SUMMARY_ERROR,detail:`Duplicate Metric Hierarchy Component '${each._metadata}'`});
          status = true;
          return;
         }
        else if (each._keyInd == that.hrData["_keyInd"]) {
          if(each._keyInd_ui){
           that.msgService.add({severity:MSGCOMPONENT.SEVERITY_ERROR, summary: MSGCOMPONENT.SUMMARY_ERROR,detail:`Duplicate Column key '${each._keyInd_ui}'`});
          }
          else
            that.msgService.add({severity:MSGCOMPONENT.SEVERITY_ERROR, summary: MSGCOMPONENT.SUMMARY_ERROR,detail:`Duplicate Column key '${each._keyInd}'`});  
          status = true;
          return;
        }
      })
      if(status) {
        return false;
      }
      this.hrData["id"] = this.tempId;
      this.getFilterDropdownLabel(this.hrData) // getting dropdown label in UI.
      this.hrchicaltableData = ImmutableArray.replace(this.hrchicaltableData, this.hrData, this.getSelectedRowIndex())
    }

    this.showHrDailog = false; // after save close dailog
    this.clearHrDailog(); // // after save clear dailog fields
    this.getMetricHierarchyTree(); // getting Tier/Server in tree structure
    this.emitTableData();
  }



  /*This method returns selected row on the basis of Id */
  getSelectedRowIndex(): number {
    let index = this.hrchicaltableData.findIndex(each => each["id"] == this.tempId)
    return index;
  }

  clearHrDailog() {
    this.hrData = new MetricHierarchyData();
  }

  deleteHierarchy(rowData) {
    // this.cms.confirm({
    //   message: 'Are you sure to delete the selected metric hierarchy?',
    //   header: 'Delete Confirmation',
    //   icon: 'fa fa-trash',
    //   accept: () => {
    //     let arrId = [];

    //     arrId.push(rowData.id) // push selected row's id 

    //     this.hrchicaltableData = this.hrchicaltableData.filter(function (val) {
    //       return arrId.indexOf(val.id) == -1;  //value to be deleted should return false
    //     })
    //     this.emitTableData();
    //     this.getMetricHierarchyTree();
    //   },
    //   reject: () => {
    //   }
    // });
    const me = this;
    me.rejectVisible = true;
    me.acceptLable = "Yes";
    me.cms.confirm({
  
      message: 'Do you want to delete this data?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
     
      accept: () => {
        let arrId = [];
            arrId.push(rowData.id) // push selected row's id 
    
            this.hrchicaltableData = this.hrchicaltableData.filter(function (val) {
              return arrId.indexOf(val.id) == -1;  //value to be deleted should return false
            })
            this.emitTableData();
            this.getMetricHierarchyTree();
      },
      reject: () => { },
    });
    me.cd.detectChanges();
  }

  /**Method called when edit is clicked in metric configuration table */
  editHierarchy(rowData) {
    this.dailogHeader = 'Edit Metric Hierarchy';
    this.isFromEdit = true;
    this.showHrDailog = true;
    this.showDailogFields(this.cols);
    this.tempId = rowData["id"];
    this.hrData = Object.assign({}, rowData)
    //creating keyIndex dropdown for db monitor
    if(this.monType == COMPONENT.DB_TYPE && this.item['output'] != null)
    {
        this.fillKeyIndexData(this.item['output']);
    }
  }

  /**Method to delete selected hierarchies*/
  deleteAllConfig() {
    const me = this;
    me.rejectVisible = true;
    me.acceptLable = "Yes";
    /* This flag is used to check whether any row is selected for delete or not*/
    let noRowSelected: boolean = false;

    if (this.selectedHr == undefined || this.selectedHr.length == 0)
      noRowSelected = true;

    if (this.hrchicaltableData.length == 0) {
      this.msgService.add({severity:MSGCOMPONENT.SEVERITY_ERROR, summary: MSGCOMPONENT.SUMMARY_ERROR,detail:NO_HIERARCHY_MSG});
      return;
    }

    this.cms.confirm({
      message: (noRowSelected) ? GEN_GDF.DELETE_ALL : GEN_GDF.DELETE_SPECIFIC,
      header: 'Delete Confirmation',
      icon: 'fa fa-trash',
      accept: () => {

        let arrId = [];
        if (noRowSelected)
          this.selectedHr = this.hrchicaltableData; // if no row is selected then set the whole table data in the selected table data to perform delete

        this.selectedHr.map(function (each) {
          arrId.push(each.id); // push items to be deleted
        })

        this.hrchicaltableData = this.hrchicaltableData.filter(function (val) {
          return arrId.indexOf(val.id) == -1;  //value to be deleted should return false
        })

        /**clearing object used for storing data ****/
        this.selectedHr = [];

        //Updating table values 
        this.emitTableData();

        this.getMetricHierarchyTree();
      },
      reject: () => {
        this.selectedHr = [];
      }
    });

  }
  createMetricHierarchy() {
    //Handle case for setting metric in case of custom metrics
    if (this.item['gdfInfo']['mV'] == 'Custom Metrics') {
      this.item['gdfInfo']['mV'] = this.customMetric;
    }

    let mD = '';
    //Below poc is added as discussed for sending "Tier>Server" on basis of checkbox value
    if (this.useTier)
      mD = mD + TIER + ">";

    if (this.useServer)
      mD = mD + SERVER + ">";

    if(this.monType == 'statsd' && this.item['idnt'] != '')
    {
      mD = mD + "Application Name" + ">";
    }  

    let str = "";
    let that = this;
    for (let i = 0; i < that.hrchicaltableData.length; i++) {
      let obj = {};
      obj['_metadata'] = that.hrchicaltableData[i]._metadata;
      obj['_hr'] = that.hrchicaltableData[i]._hr;
      if (i != that.hrchicaltableData.length - 1) {
        obj['_hr'] = that.hrchicaltableData[i + 1]._hr;
      }

      if (obj['_metadata']) {
        if (obj['_hr'] == '1')
          str = str + obj['_metadata'] + "_";
        else
          str = str + obj['_metadata'] + ">";
      }
    }
    str = str.substring(0, str.length - 1);
    if (str != '')
      mD = mD + str;
    else
      mD = mD.substring(0, mD.length - 1); // if mD contains only tier/server then it will be Tier>Server> , so need to skip last character

    this.item['gdfInfo']['mD'] = mD;

    this.tableData.emit(this.item['gdfInfo']);
  }

  ngOnDestroy() {
    if (this.subscription)
      this.subscription.unsubscribe();

    if (this.changeOTypeSubscription)
      this.changeOTypeSubscription.unsubscribe();

    //setting to default field values of add hierarchy dailog 
    this.displayMetaData = true;
    this.displayDefVal = true;
    this.displayKeyInd = true;
    this.displayFilterType = true;
    this.displayFilter = true;
    this.displayHr = true;
  }

  changeTableHeader(outputType) {
    //Note:- added width for alignment issue when changing columns 
    this.keyIndexLabel = outputType; // show in add dailog 
    let newCols = [
      { field: '_metadata', header: 'Metric Hierarchy Component', visible: false, width: '200px' },
      { field: '_keyInd', header: outputType, visible: false, width: '200px' },
    ]
    this.displayTableColumns(newCols);

    //clearing tables if output type is changed
    this.hrchicaltableData = [];
    this.item['gdfInfo']['depMHComp'] = this.hrchicaltableData;
    this.tableData.emit(this.item['gdfInfo']['depMHComp'])
  }

  //Method called on checkbox check-uncheck for 'use tier'
  onTierChange(val) {
      this.item["tier"] = val;
      if (!val) {
        this.useServer = val;
        this.item["server"] = val;
      }

    //Added calling of method to update tree structure
    this.getMetricHierarchyTree();
  }

  //Method called on checkbox check-uncheck for 'use server'
  onServerChange(val) {
      this.item["server"] = val;

    //Added calling of method to update tree structure
    this.getMetricHierarchyTree();
  }

  getFilterDropdownLabel(hrData) {
    if (hrData['_filter'] != '') {
      if (hrData['_filter'] == '+')
        hrData['_filter_ui'] = "Positive Filter";
      else
        hrData['_filter_ui'] = "Negative Filter";
    }

    if (hrData['_hr'] != '') {
      if (hrData['_hr'] == '1') {
        hrData['_linked'] = true;
        hrData['_hr_ui'] = "Multiple(_)";
      }
      else
        hrData['_hr_ui'] = "Multilevel(>)";
    }

    if(this.monType == 'db'){
      this.fillKeyIndexData(this.item['output']); 
      let colKeyInfo = _.find(this.mKeyList, function (each) {
        return each['value'] ==  hrData['_keyInd']})
        if(colKeyInfo){
          hrData['_keyInd_ui'] = colKeyInfo.label;
        }
    }  
  }


  /**
 * Method called to get Use tier and Use server value 
 * @param gdfInfo 
 */
  getMetricDescriptionValue(gdfInfo) {
    if (gdfInfo.mV != 'Application Metrics' && gdfInfo.mV != 'System Metrics' 
    && gdfInfo.mV != 'Postgres Metrics' && gdfInfo.mV != 'Oracle Metrics'
    && gdfInfo.mV != 'MySQL Metrics' && gdfInfo.mV != 'Microsoft SQL Metrics'
    &&gdfInfo.mV != 'IBM DB2 Metrics') {
      this.customMetric = gdfInfo.mV;
      this.item['gdfInfo']['mV'] = "Custom Metrics";
    }

    let mD = gdfInfo.mD;

    if (mD != "") {
      if (mD.includes("Server")) {
        this.useServer = true;
      }

      if (mD.includes("Tier")) {
        this.useTier = true;
      }
    }
    else
      this.useServer = this.useTier = true;
  }

//  Recursive method for setting children node for each vectors 
  recursiveVectorNode(parentVectorNode) {
    if (parentVectorNode.children.length == 0)
      return parentVectorNode;
    else
      return this.recursiveVectorNode(parentVectorNode.children[0])
  }

  // Method called when user clicks on the link icon to link the rows in the metric hierarchy table data
  linkRow(rowData) {
    if (!rowData._linked) {
      rowData._linked = true;
      rowData['_hr'] = '1';
    }
    else {
      rowData._linked = false;
      rowData['_hr'] = '2';
    }

    if (rowData.id != 0)
      this.getLinkedVectors();

  }

  //Method called to create the link between the row clicked and the one above the selected row.
  getLinkedVectors() {
    this.getMetricHierarchyTree()
  }

  refreshTree() {
    this.getMetricHierarchyTree();
  }

  getMetricChildrenArr(tableData,vecNodeIndex) {
    let arr = [];
    let that = this;
    let counter = 0;
    let data = that.customMonService.getMetricData();
    tableData.map(function (item) {
      let childObj = {};
      //in add mode showing metricNode with data and in edit mode showing it without data
      childObj['label'] = data && data.length != 0 ? item._mN + " (" + data[vecNodeIndex][counter] + ")" : item._mN;
      childObj['data'] = data && data.length != 0 ? item._mN + " (" + data[vecNodeIndex][counter] + ")" : item._mN;
      childObj['icon'] = "fa fa-bar-chart"
      arr.push(childObj);
      counter++;
    })
    return arr;
  }

  getMetricHierArr(tableData,vecNodeIndex) {
    let arr = [];
    let that = this;
    let counter = 0;
    let data = that.customMonService.getMetricHierarchy();
    tableData.map(function (item) {
      let childObj = {};
      //in add mode showing vectorNode with data and in edit mode showing it without data
      childObj['label'] = data && data.length != 0 ? item._metadata + "(" + data[vecNodeIndex][counter] + ")" : item._metadata;
      childObj['data'] = data && data.length != 0 ? item._metadata + "(" + data[vecNodeIndex][counter] + ")" : item._metadata;
      arr.push(childObj);
      counter++;
    })
    return arr;
  }

  addTierTree() {
    this.getMetricHierarchyTree();
  }

  addServerTree() {
    this.getMetricHierarchyTree();
  }

  //  Method called to emit data to parent component when changes are done in metric-hierarchy table.
  emitTableData() {
    this.item['gdfInfo']['depMHComp'] = this.hrchicaltableData;
    this.tableData.emit(this.item['gdfInfo']);
  }

  getVectorNodeObj(tableData,vecNodeIndex) {
    let vectorParentNode;
    let vectorParentArr;
    let that = this;
    vectorParentArr = this.getMetricHierArr(tableData,vecNodeIndex);
      vectorParentNode = {
        "label": vectorParentArr[0]['label'],
        "expanded": true,
        "data": vectorParentArr[0]['data'],
        "children": []
    }
    let metricChildArray;
    if (that.genericServiceObj.getMConfTable() && that.genericServiceObj.getMConfTable().length != 0)
      metricChildArray = this.getMetricChildrenArr(that.genericServiceObj.getMConfTable(),vecNodeIndex);
    let obj;
    for (let i = 1; i < tableData.length; i++) {
      obj = this.recursiveVectorNode(vectorParentNode);
       // if(tableData[i]._hr == '1' && (!obj['label'].includes("_")))	
      if (tableData[i]._hr == '1') {
        obj['label'] = obj['label'] + "_" + vectorParentArr[i]['label'],
          obj['expanded'] = true,
          obj['data'] = obj['data'] + "_" + vectorParentArr[i]['data'],
          obj['children'] = []
      }
      else {
        obj['children'][0] = {
          "label": tableData[i]._hr == '1' ? vectorParentArr[i-1]['label'] + "_" + vectorParentArr[i]['label'] : vectorParentArr[i]['label'],
          "expanded": true,
          "data": tableData[i]._hr == '1' ? vectorParentArr[i-1]['data'] + "_" + vectorParentArr[i]['data'] : vectorParentArr[i]['data'],
          "children": []
        }
      }
      if (i == tableData.length - 1) {
        if (tableData[i]._hr == '1') {
          obj['label'] = obj['label'],
            obj['expanded'] = true,
            obj['data'] = obj['data'],
            obj['children'] = metricChildArray
        }
        else {
          obj['children'][0] = {
            "label": vectorParentArr[i]['label'],
            "expanded": true,
            "data": vectorParentArr[i]['data'],
            "children": metricChildArray,
          }
        }
      }
    }
    return vectorParentNode;
  }

  getMetricHierarchyTree() {
    let obj = {};
    let treeNodeArr = []
    let treeDataArr = []; //data is array of objects

    let metricTypeObj;
    if (this.item['gdfInfo']['mV'] != '') {
      metricTypeObj = {
        "label": this.item['gdfInfo']['mV'] != 'Custom Metrics' ? this.item['gdfInfo']['mV'] : this.customMetric,
        "expanded": true,
        "data": this.item['gdfInfo']['mV'],
        "children": [],
      }
    }

    let metricGrpObj;
    if (this.item['gdfInfo']['grpN'] != '') {
      metricGrpObj = {
        "label": this.item['gdfInfo']['grpN'],
        "expanded": true,
        "data": this.item['gdfInfo']['grpN'],
        "children": [],
      }
    }
   
    let metricAppObj;
    if(this.monType == 'statsd' && this.item['idnt'] != '')
    {
      metricAppObj = {
        "label": this.item['idnt'] ,
        "expanded": true,
        "data": this.item['idnt'] ,
        "children": [],
      }
    }
  
    let tierNodeObj;
    if (this.useTier) {
      tierNodeObj = {
        "label": "Tier",
        "expanded": true,
        "data": "Tier",
        "children": [],
      } 
    }

    let serverNodeObj;

    if (this.useServer) {
      serverNodeObj = {
        "label": "Server",
        "expanded": true,
        "data": "Server",
        "children": [],
      }
    }

    let vectorNodeObj;    
    if (this.hrchicaltableData.length != 0) {
      //used for edit mode and statsd monitor
      if(this.customMonService.outputLength == 0){
        vectorNodeObj = this.getVectorNodeObj(this.hrchicaltableData,0)
        if (this.useServer) {
          if (vectorNodeObj)
            serverNodeObj['children'][0] = vectorNodeObj;
     }
      }
      //used to create multiple vector nodes for output data
      for(let i=0 ; i<this.customMonService.outputLength ; i++){
        vectorNodeObj = this.getVectorNodeObj(this.hrchicaltableData,i)
        //if use server is checked then push 
        if (this.useServer) {
         if (vectorNodeObj)
            serverNodeObj['children'][i] = vectorNodeObj;
    }
        if(i == 1)
          break;
      }
    }
    if (this.useServer){
      if (tierNodeObj)
      tierNodeObj['children'][0] = serverNodeObj;
     else
      tierNodeObj = serverNodeObj;
    }

    if (this.useTier && serverNodeObj == undefined && vectorNodeObj != undefined){
      tierNodeObj['children'][0] = vectorNodeObj;
  }

    //if UseTier and UseServer both are uncheck, and only vectors are present then , tree should contains only vectors
    if (!tierNodeObj && !serverNodeObj && vectorNodeObj){
      tierNodeObj = vectorNodeObj;
    }
    //Adding vectors node to metric Application Name in statsd monitor 
     if (this.monType == 'statsd' && metricAppObj)
     metricAppObj['children'][0] = tierNodeObj

    //Adding vectors node to metric grp 
     if (this.monType == 'statsd' && metricGrpObj)
      metricGrpObj['children'][0] = metricAppObj
    else if(metricGrpObj)
      metricGrpObj['children'][0] = tierNodeObj

    //Adding metricGrp with vectors to metric Type node
    if (metricTypeObj)
      metricTypeObj['children'][0] = metricGrpObj;

    if (metricTypeObj)
      treeDataArr.push(metricTypeObj);
      
    if (treeDataArr.length > 0)
      obj['data'] = treeDataArr;

    if (obj != undefined)
      treeNodeArr.push(obj)

    if (treeNodeArr.length > 0)
      this.treeNodeValue = treeNodeArr[0].data;
  }

  onEditchangeTableHeader(outputType) {
    // for changing tableheader in edit mode 
    this.keyIndexLabel = outputType; // show in add dailog 
    let newCols = [
      { field: '_metadata', header: 'Metric Hierarchy Component', visible: false, width: '200px' },
      { field: '_keyInd', header: outputType, visible: false, width: '200px' }
    ]
    this.displayTableColumns(newCols);
  }

  //this method is used for statsd monitor to split metric syntax to fill data in metric hierarchy table
  autoFillVector() {
    if (this.item['mS'] == "") {
      this.msgService.add({severity:MSGCOMPONENT.SEVERITY_ERROR, summary: MSGCOMPONENT.SUMMARY_ERROR,detail:"Please fill out Metric Syntax"});
      return;
    }

    this.customMonService.outputLength = 0;
    let arr = this.getKeyIndexData();
    if (arr.length != 0)
      this.fillMetricHierarchy(arr);

  }

  //this method is used for statsd monitor to fill data in metric hierarchy table
  fillMetricHierarchy(keyIndexArr) {
    let arr = [];
    for (let j = 0; j < keyIndexArr.length; j++) {
      let metricHierObj = new MetricHierarchyData();

      metricHierObj._metadata = keyIndexArr[j];
      metricHierObj._keyInd = keyIndexArr[j];
      metricHierObj.id = j;

      if (metricHierObj._metadata != '')
        arr.push(metricHierObj)
      
    }
    this.customMonService.autoFillMetricHierarchyData(arr);
  }

 

  // this method returns an array for creating coloumnkey dropdown
  getKeyIndexData() {
    let splitByDot;
    let count = 0;
    let arr = [];
    let str = this.item['mS'];
    splitByDot = str.split(".");
    for (let i = 0; i < splitByDot.length; i++) {
      if (splitByDot[i].startsWith("%") && splitByDot[i].endsWith("%")) {
        arr[i - count] = splitByDot[i].substring(1, (splitByDot[i].length - 1))
      }
      else
        count = count + 1;
    }
    return arr;
  }

  //used for filling data to columnKey dropdown in edit mode for statsd monitor
  onEditFillKeyIndex() {
    let keyIndexArr = [];
    this.hrData._keyInd = '';
    for (let i = 0; i < this.hrchicaltableData.length; i++) {
      keyIndexArr[i] = this.hrchicaltableData[i]._keyInd;
    }
    this.mKeyList = UtilityService.createDropdown(keyIndexArr)
  }

  //creating keyIndex dropdown for db monitor
  fillKeyIndexData(output){
    let str = output.split("\n");
    let splitByComma = str[0].split("%SEP%");   //header of table

    let dcLabelArray = [];
    let dcValueArray = [];
    for(let i=0; i< splitByComma.length-1; i++){
        dcLabelArray[i] =  splitByComma[i].trim();
        dcValueArray[i] =  (i+1).toString();
  }
    this.mKeyList = UtilityService.createListWithKeyValue(dcLabelArray, dcValueArray);
  }

  
}

