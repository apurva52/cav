import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { MetricConfData } from '../../../containers/metric-configuration-data';
import { ImmutableArray } from '../../../services/immutable-array';
import { ConfirmationService, SelectItem, Message, MessageService } from 'primeng/api';
import { UtilityService } from '../../../services/utility.service';
import * as GDF_DROPDOWN from '../../../constants/generic-gdf-dropdown-constants';
import * as GEN_GDF from '../../../constants/generic-gdf-constants';
import * as TABLEHEADER from '../../../constants/generic-gdf-tableheader';
import * as _ from "lodash";
import { Subscription } from 'rxjs';
import { GenericGDFMetricInfo } from '../../../containers/generic-gdf-metric-data';
//import { AdvanceMetricConfigurationComponent } from '../advance-metric-configuration/advance-metric-configuration.component';
//import { MatDialogRef, MatDialog } from '@angular/material';
import { GenericGdfService } from '../../../services/generic-gdf-service';
import { GenericGdfMessageService } from '../../../services/generic-gdf-message.service';
import { CustomMonitorService } from 'src/app/pages/monitor-up-down-status/configure-monitors/add-custom-monitor/services/custom-monitor.service';
//import { CustomMonitorService } from 'src/app/pages/monitor-up-down-status/configure-monitors/add-custom-monitor/services/custom-monitor.service';
//import { MonitorupdownstatusService } from 'src/app/pages/monitor-up-down-status/service/monitorupdownstatus.service';
//import { CustomMonitorService } from 'src/app/pages/monitor-up-down-status/configure-monitors/add-custom-monitor/services/custom-monitor.service';

// import { MonConfigurationService } from '../../../../monitor/services/mon-configuration.service';
// import { CustomMonitorService } from '../../../../monitor/services/custom-monitor.service';
// import * as COMPONENT from '../../../../monitor/constants/mon-component-constants';
import * as COMPONENT from '../../../../monitor-up-down-status/configure-monitors/add-custom-monitor/constants/mon-component-constants';
import { AdvanceMetricConfigurationComponent } from '../advance-metric-configuration/advance-metric-configuration.component';
import * as MSGCOMPONENT from '../../../../monitor-up-down-status/configure-monitors/add-monitor/constants/monitor-configuration-constants';

const NO_OUTPUT_MSG = "Run command/script for auto fill.";
const NO_HEADER_LINE_MSG = "Provide header line for auto fill";
const NO_CONF_MSG = "Select Metric Configuration to delete";
const MON_TYPE_DB = "db";
const MON_TYPE_STATSD = "statsd";
const MON_TYPE_JMX = "jmx";

@Component({
  selector: 'app-metric-configuration',
  templateUrl: './metric-configuration.component.html',
  styleUrls: ['./metric-configuration.component.scss']
})
export class MetricConfigurationComponent implements OnInit {

  @Input() showMetConfCols: any;
  @Input() item: any;
  @Input()  autofillMetricInfo: any[]; // receives input from parent component on auto fill to show metric informations
  @Output() mConfTableData = new EventEmitter();
  @Output() displayChange = new EventEmitter();
  showMConfDailog: boolean = false // flag for metric configuration dailog box
  mConf: MetricConfData
  mConfTable: MetricConfData[] = [] // metric configuration table values 
  isFromEdit: boolean = false; // flag whether user is in 'ADD'/'EDIT' mode.
  count: number = 0; // variable to keep count of rows addition in table
  tempId: number;
  mTList: SelectItem[]; //metric type list 
  dailogHeader: string = ''; // metric configuration dailog header
  selectedMConf: MetricConfData[];
  mFlist: SelectItem[]; //metric formulae list 
  dTList: SelectItem[]; //data type list 
  cols: any[];
  subscription: Subscription;

  /**Flag variables for showing fields on basis of visibility of column in datatable */
  displayMetricName: boolean = true;
  displayMetricType: boolean = true;
  displayKeyInd: boolean = true;
  displayDataType: boolean = true;
  displayMetricFormula: boolean = true;
  displayMetricDesc: boolean = true;
  //_dialogForAdvanceMetric: MatDialogRef<AdvanceMetricConfigurationComponent>;
  keyIndexLabel: string = 'Field Number';// show by default label for Key/index in add metric configuration dialog
  changeOTypeSubscription: Subscription;
  indexList: SelectItem[];
  tempArrOfIndex: any[];
  public message: Message[] = [];
  autofill: Subscription;
  displayUnit: boolean = true; // for displaying unit column
  monType:string = '';    //monitor type (nf/cmd/statsd)
  isColumnGrouping = false;   //used for show/hide columns in jmx UI	
  selectedCols: string[] = []; // ngModel value for the column list dropdown	
  columnOptions = [];	
  jmxDataFlag:boolean = false;
  rejectVisible: boolean;
  acceptLable: string;
  advanceMetricConfDialog:boolean 
  @ViewChild(AdvanceMetricConfigurationComponent) advMetricConf: AdvanceMetricConfigurationComponent;

  constructor(private cms: ConfirmationService,
    //private _dialog: MatDialog,
    private genericSerObj: GenericGdfService,
    private msgServiceObj: GenericGdfMessageService,
    private customMonService:CustomMonitorService,
    private msgService:MessageService
    ) { }

  ngOnInit() {
    this.jmxDataFlag = this.customMonService.jmxDataFlag;
    this.monType = this.customMonService.monType;
   //this.msgService.add$.subscribe(data => this.message = data);
    this.mConf = new MetricConfData();
    this.displayTableColumns(this.showMetConfCols);
    this.getDropdownList();
    this.subscription = this.customMonService.$saveMonitorConf.subscribe((res) => {
      if (res) {
        this.getMetricInfo();
      }
    });
    
    this.changeOTypeSubscription = this.customMonService.$changeOutPutType.subscribe((res) => {
      if (res) {
        this.changeTableHeader(res);
      }
    });

    if (this.item['gdfInfo']['metricInfo'].length > 0) {
      let metricInfo = this.item['gdfInfo']['metricInfo'];
      let that = this;
      that.indexList = []
        metricInfo.map(function (each) {
        that.mConf = new MetricConfData(); 
        that.mConf = each['depMConf'][0];
        that.indexList.push({ label: that.mConf._metKeyIdx, value: that.mConf._metKeyIdx });
        if(that.monType == MON_TYPE_DB){
          that.getColKeyDropdownLabel(that.mConf);
        }
        that.mConfTable.push(that.mConf);
        that.genericSerObj.setMConfTable(that.mConfTable);// for showing metric configuration tree node in metric hierarchy tree at edit mode
      })
    }

    //data that is saved in config file will be checked in metric table in jmx UI
    if(this.monType == MON_TYPE_JMX && this.customMonService.isFromEdit)	{
      this.selectedMConf = this.mConfTable.filter(value => value._isChk);
    }

    this.selectedMConf = this.mConfTable.filter(value => value._isChk);

    this.autofill = this.customMonService.$metricInfo.subscribe((res) => {
      if (res) {
        this.genericSerObj.setMConfTable(res);
        this.mConfTable = res;
        //when user opens UI then all rows will be selected	
        if(this.monType == MON_TYPE_JMX)
          this.selectedMConf = this.mConfTable.filter(value => value._isChk);
      }
    })
      
      if(this.monType == MON_TYPE_STATSD)
        this.keyIndexLabel = "Metric Pattern"; // show in add dailog 
      else if(this.monType == MON_TYPE_DB)
        this.keyIndexLabel = "Column Key"; // show in add dailog 
      else if (this.item['oType'] == "2") //Output type (string-1/keyValue-2/JSON-3/JMX-4)
        this.onEditchangeTableHeader("Column Key");
      else if(this.monType == MON_TYPE_JMX){	
          this.keyIndexLabel = "Metric Key"; // show in add dailog 	
          this.generatColumns(); 	
        }
      else
        this.onEditchangeTableHeader("Field Number");

  }

  getDropdownList() {
    this.mTList = UtilityService.createListWithKeyValue(GDF_DROPDOWN.METRIC_TYPE_LABEL, GDF_DROPDOWN.METRIC_TYPE_VALUE);

    if(this.monType == MON_TYPE_DB)
      this.mFlist = UtilityService.createListWithKeyValue(GDF_DROPDOWN.METRIC_DB_FORMULA_LABEL, GDF_DROPDOWN.METRIC_DB_FORMULA_VALUE);
    else
      this.mFlist = UtilityService.createListWithKeyValue(GDF_DROPDOWN.METRIC_FORMULA_LABEL, GDF_DROPDOWN.METRIC_FORMULA_VALUE);

    if(this.monType == MON_TYPE_STATSD)
      this.dTList = UtilityService.createListWithKeyValue(GDF_DROPDOWN.STATS_DATA_TYPE_LABEL, GDF_DROPDOWN.STATS_DATA_TYPE_VALUE);
    else if(this.monType == MON_TYPE_JMX && !this.jmxDataFlag){	
      this.dTList = UtilityService.createListWithKeyValue(GDF_DROPDOWN.JMX_DATA_TYPE_LABEL, GDF_DROPDOWN.JMX_DATA_TYPE_VALUE);	
    }
    else
      this.dTList = UtilityService.createListWithKeyValue(GDF_DROPDOWN.DATA_TYPE_LABEL, GDF_DROPDOWN.DATA_TYPE_VALUE);
  }

  displayTableColumns(showColumns) {
    if (showColumns.length == 0) // for default case
      this.cols = TABLEHEADER.METRIC_CONF_HEADER_LIST;
    else
    {
      this.cols = showColumns; // in case of specific monitor
    }
  }

  addMConf() {
    this.dailogHeader = "Add Metric Configuration"
    this.showMConfDailog = true;
    this.isFromEdit = false;
    this.showDailogFields(this.cols);
    this.clearMConfDailog();
    if (this.item.output != ""){
      if(this.monType == MON_TYPE_DB)
        this.fillKeyIndexData(this.item['output']);   //creating keyIndex dropdown for db monitor
      else if(this.monType == MON_TYPE_JMX){
        this.mConf._dT = "";
        }
      else
        this.getIndexListForOutput();
    }
    else {
      let data = [];
      this.indexList = UtilityService.createDropdown(data);
    }
  }

  /**Method called when edit is clicked in metric configuration table */
  editMConf(rowData) {
    this.dailogHeader = "Edit Metric Configuration"
    this.isFromEdit = true;
    this.showMConfDailog = true;
    this.showDailogFields(this.cols);
    this.tempId = rowData["id"];
    this.mConf = Object.assign({}, rowData)
    //creating keyIndex dropdown for db monitor
    if(this.monType == MON_TYPE_DB && this.item['output'] != "")
    {
        this.fillKeyIndexData(this.item['output']);
    }
    else if(this.monType == MON_TYPE_JMX && this.jmxDataFlag){
      this.displayKeyInd = false;
      this.displayDataType = false;
    }
  }

  /**Method to show input fields in Add/Edit metric configuration dialog */
  showDailogFields(cols) {
    let that = this;
    cols.map(function (each) {
      if (each[TABLEHEADER.FIELD] == TABLEHEADER.METRIC_GROUP_NAME && each[TABLEHEADER.VISIBLE]) {
        that.displayMetricName = false;
      }
      if (each[TABLEHEADER.FIELD] == TABLEHEADER.METRIC_KEY_INDEX && each[TABLEHEADER.VISIBLE]) {
        that.displayKeyInd = false;
      }
      if (each[TABLEHEADER.FIELD] == TABLEHEADER.METRIC_TYPE && each[TABLEHEADER.VISIBLE]) {
        that.displayMetricType = false;
      }
      if (each[TABLEHEADER.FIELD] == TABLEHEADER.DATA_TYPE && each[TABLEHEADER.VISIBLE]) {
        that.displayDataType = false;
      }
      if (each[TABLEHEADER.FIELD] == TABLEHEADER.METRIC_FORMULA && each[TABLEHEADER.VISIBLE]) {
        that.displayMetricFormula = false;
      }
      if (each[TABLEHEADER.FIELD] == TABLEHEADER.METRIC_DESC && each[TABLEHEADER.VISIBLE]) {
        that.displayMetricDesc = false;
      }

      if (each[TABLEHEADER.FIELD] == TABLEHEADER.UNIT && each[TABLEHEADER.VISIBLE]) {
        that.displayUnit = false;
      }
    })
  }

  /**Method called when save is clicked in add metric configuration dailog box */
  saveMetricConf() {
    let that = this;
    let status = false;
    if(this.keyIndexLabel == 'Field Number'){
      if(that.mConf._metKeyIdx == ""){
        that.msgService.add({severity:MSGCOMPONENT.SEVERITY_ERROR, summary: MSGCOMPONENT.SUMMARY_ERROR,detail:'Please provide field number'});
        return
      }
      if (!/^([0-9]*$)$/.test(that.mConf._metKeyIdx)) {
        that.msgService.add({severity:MSGCOMPONENT.SEVERITY_ERROR, summary: MSGCOMPONENT.SUMMARY_ERROR,detail:'Field number is not valid Please provide numeric value'});
        return
      }
    }

    if (!this.isFromEdit) {
      this.mConfTable.map(each => {
        if (each._mN.trim() == that.mConf["_mN"].trim()) {
          that.msgService.add({severity:MSGCOMPONENT.SEVERITY_ERROR, summary: MSGCOMPONENT.SUMMARY_ERROR,detail:`Duplicate Metric Name ${each._mN}`});
          status = true;
          return;
         }
        else if (each._metKeyIdx == that.mConf["_metKeyIdx"]) {
          if(each._metKeyIdx_ui){
            that.msgService.add({severity:MSGCOMPONENT.SEVERITY_ERROR, summary: MSGCOMPONENT.SUMMARY_ERROR, detail:`Duplicate Column key ${each._metKeyIdx_ui}`});
          }
          else{
            that.msgService.add({severity:MSGCOMPONENT.SEVERITY_ERROR, summary: MSGCOMPONENT.SUMMARY_ERROR, detail:`Duplicate Column key ${each._metKeyIdx}`});
          }
          status = true;
          return;
        }
      })
      if (status) {
        return false;
      }
      this.mConf["id"] = this.mConfTable.length + 1;
      if(this.monType == MON_TYPE_DB){
        this.getColKeyDropdownLabel(this.mConf);
      } 
      else if(this.monType == MON_TYPE_JMX && this.mConf._dT == ""){
       that.msgService.add({severity:MSGCOMPONENT.SEVERITY_ERROR, summary: MSGCOMPONENT.SUMMARY_ERROR, detail:"Select Data type"});
        return;
        }
      this.mConfTable = ImmutableArray.push(this.mConfTable, this.mConf);
      this.count = this.count + 1;
    }
    else {
      this.mConfTable.map(each => {
        if(each.id == this.mConf["id"]){
          return;
        }
        if (each._mN.trim() == that.mConf["_mN"].trim()) {
          that.msgService.add({severity:MSGCOMPONENT.SEVERITY_ERROR, summary: MSGCOMPONENT.SUMMARY_ERROR, detail:`Duplicate Metric Name ${each._mN}`});
          status = true;
          return;
         }
        else if (each._metKeyIdx == that.mConf["_metKeyIdx"]) {
          if(each._metKeyIdx_ui){
            that.msgService.add({severity:MSGCOMPONENT.SEVERITY_ERROR, summary: MSGCOMPONENT.SUMMARY_ERROR, detail:`Duplicate Column key ${each._metKeyIdx_ui}`});
          }
          else{
            that.msgService.add({severity:MSGCOMPONENT.SEVERITY_ERROR, summary: MSGCOMPONENT.SUMMARY_ERROR, detail:`Duplicate Column key ${each._metKeyIdx}`});
          }
          status = true;
          return;
        }
      })
      if (status) {
        return false;
      }
      this.mConf["id"] = this.tempId;
      if(this.monType == MON_TYPE_DB){
        if(this.mConf._metKeyIdx == ''){
          this.msgService.add({severity:MSGCOMPONENT.SEVERITY_ERROR, summary: MSGCOMPONENT.SUMMARY_ERROR, detail:"Please fill out Column Key"});
          return;
        }
        this.getColKeyDropdownLabel(this.mConf);
      } 
      this.mConfTable = ImmutableArray.replace(this.mConfTable, this.mConf, this.getSelectedRowIndex())
    }

    this.genericSerObj.setMConfTable(this.mConfTable);
    this.showMConfDailog = false;
    this.clearMConfDailog();
    this.mConfTableData.emit(this.mConfTable);
  }

  /*This method returns selected row on the basis of Id */
  getSelectedRowIndex(): number {
    let index = this.mConfTable.findIndex(each => each["id"] == this.tempId)
    return index;
  }

  clearMConfDailog() {
    this.mConf = new MetricConfData();
  }

  deleteMConf(rowData) {
    console.log("delete dialog=====>")
    const me = this;
    me.rejectVisible = true;
    me.acceptLable = "Yes";
    this.cms.confirm({
      message: 'Are you sure to delete the selected metric configuration?',
      header: 'Delete Confirmation',
      icon: 'fa fa-trash',
      accept: () => {
        let arrId = [];
        arrId.push(rowData.id) // push selected row's id 
        this.mConfTable = this.mConfTable.filter(function (val) {
          return arrId.indexOf(val.id) == -1;  //value to be deleted should return false
        })
      },
      reject: () => {
      }
    });

    this.genericSerObj.setMConfTable(this.mConfTable); //setting table value 
  }


  /**Method to delete selected hierarchies*/
  deleteAllConf() {
    const me = this;
    me.rejectVisible = true;
    me.acceptLable = "Yes";
    /* This flag is used to check whether any row is selected for delete or not*/
    let noRowSelected: boolean = false;
    if (this.selectedMConf == null || (this.selectedMConf != null && this.selectedMConf.length == 0))
      noRowSelected = true;

    if(this.mConfTable.length == 0)
    {
      this.msgService.add({severity:MSGCOMPONENT.SEVERITY_ERROR, summary: MSGCOMPONENT.SUMMARY_ERROR, detail:NO_CONF_MSG});
      return;
    }  

    this.cms.confirm({
      message: (noRowSelected) ? GEN_GDF.DELETE_ALL_CONF : GEN_GDF.DELETE_SPECIFIC_CONF,
      header: 'Delete Confirmation',
      icon: 'fa fa-trash',
      accept: () => {

        let arrId = [];
        if (noRowSelected)
          this.selectedMConf = this.mConfTable; // if no row is selected then set the whole table data in the selected table data to perform delete

        this.selectedMConf.map(function (each) {
          arrId.push(each.id); // push items to be deleted
        })

        this.mConfTable = this.mConfTable.filter(function (val) {
          return arrId.indexOf(val.id) == -1;  //value to be deleted should return false
        })
        /**clearing object used for storing data ****/
        this.selectedMConf = [];
      },
      reject: () => {
        this.selectedMConf = [];
      }
    });
    this.genericSerObj.setMConfTable(this.mConfTable); //setting table value 
  }

  getMetricInfo() {
    let list = [];
    let that = this;
    this.mConfTable.map(function (each) {
      // Below code is used for saving metric information in DTO at server side.
      let arr: GenericGDFMetricInfo = new GenericGDFMetricInfo();
      arr['graphNm'] = each._mN.trim();
      if(that.monType == MON_TYPE_JMX)
        arr['dT'] = "sample";
      else
        arr['dT'] = each._dT;  
      arr['fL'] = each._mF;
      arr['gT'] = each._metType; // graph Type - scalar/vector
      arr['gD'] = each._metDesc.trim();
      arr['unit'] = each._unit; //added units for graph
      if (each.dF != "")
        arr['f3'] = each.dF; //derived formula
      else
        arr['f3'] = "NA";


      let depCompObj: MetricConfData = new MetricConfData();
      depCompObj['_mN'] = each._mN;
      depCompObj['_metKeyIdx'] = each._metKeyIdx;
      depCompObj['_metType'] = each._metType;
      depCompObj['_metDesc'] = each._metDesc.trim();
      depCompObj['_dT'] = each._dT;
      depCompObj['_mF'] = each._mF;
      depCompObj['dF'] = each.dF;
      depCompObj['advPattern'] = each.advPattern;
      depCompObj['_unit'] = each._unit; //added units for graph
      depCompObj['_isChk'] = each._isChk;
      arr['depMConf'].push(depCompObj);
      list.push(arr);
    })
    this.item.gdfInfo.metricInfo = list;
  }

  ngOnDestroy() {
    if (this.subscription)
      this.subscription.unsubscribe();

    if (this.changeOTypeSubscription)
      this.changeOTypeSubscription.unsubscribe();

    if (this.autofill)
      this.autofill.unsubscribe();

    this.displayMetricName = true;
    this.displayKeyInd = true;
    this.displayMetricType = true;
    this.displayDataType = true;
    this.displayMetricFormula = true;
    this.displayMetricDesc = true;
    this.displayUnit = true;
    this.genericSerObj.setMConfTable([]);
  }

  //autofill details of gdf datatable	
  autoFillData() {
    let arr = [];
    let splitOuputByNewLine;
    let splitByHeaderLine;
    let splitByDelimiter;

    if (!this.validateAutoFill(this.item.output, this.item.hl))
      return false;

    splitOuputByNewLine = this.item.output.split("\n");
    splitByHeaderLine = splitOuputByNewLine[this.item.hl - 1]; // for user 0 headerline is 1 so subtracting 

    let delimiter = this.item['delimiter'];
    if (this.item.delimiter == GEN_GDF.DELIMITER_CUSTOM)
      delimiter = this.item['cD'];

    let newSplitByHeaderLine = splitByHeaderLine.trim().replace(/  +/g, ' ');
    splitByDelimiter = newSplitByHeaderLine.split(delimiter);

    let arr1 = ['--Select--'];
    for (let i = 0; i < splitByDelimiter.length; i++) {
      let obj = new MetricConfData();
      obj['_mN'] = splitByDelimiter[i];
      // Output type (string-1/keyValue-2/JSON-3/JMX-4) of configured monitor
      if (this.item['oType'] != "1") {
        obj['_metKeyIdx'] = splitByDelimiter[i];

        arr1.push(splitByDelimiter[i]);
      }
      else {
        let indexInUI = i + 1;
        obj['_metKeyIdx'] = indexInUI.toString();
        arr1.push(indexInUI.toString()); // to create index list
      }
      obj['_metDesc'] = splitByDelimiter[i];
      obj['id'] = i;
      arr.push(obj);
    }

    this.indexList = UtilityService.createDropdown(arr1);
    this.mConfTable = arr;
    this.mConfTableData.emit(this.mConfTable);
  }

  /**
   * Method called for validation at auto fill 
   * @param output 
   * @param headerLine 
   */
  validateAutoFill(output, headerLine) {
    if (output == undefined || output == '') {
      this.msgService.add({severity:MSGCOMPONENT.SEVERITY_ERROR, summary: MSGCOMPONENT.SUMMARY_ERROR, detail:NO_OUTPUT_MSG});
      return false;
    }

    if (headerLine == undefined || headerLine == '') {
    //  this.msgServiceObj.errorMessage(NO_HEADER_LINE_MSG)
      return false;
    }
    return true;
  }

  //for opening Advance metric configuration component
  openAdvanceDialog(rowData) {
    this.mConf= rowData
    this.advanceMetricConfDialog = true;
  }


  changeTableHeader(outputType) {
    //Note:- added width for alignment issue when changing columns 
    this.keyIndexLabel = outputType; // show in add dailog 

      let newCols;
      newCols = [
        { field: TABLEHEADER.METRIC_GROUP_NAME, header: 'Metric Name', visible: false, width: '120px' },
        { field: TABLEHEADER.UNIT, header: 'Unit', visible: false, width: '200px' },
        { field: TABLEHEADER.METRIC_KEY_INDEX, header: outputType, visible: false, width: '200px' },
        { field: TABLEHEADER.METRIC_TYPE, header: 'Metric Type', visible: true, width: '200px' },
        { field: TABLEHEADER.DATA_TYPE, header: 'Data type', visible: false, width: '200px' },
        { field: TABLEHEADER.METRIC_FORMULA, header: 'Metric Formula', visible: false, width: '200px' },
        { field: TABLEHEADER.METRIC_DESC, header: 'Description', visible: false, width: '200px' }]

    this.displayTableColumns(newCols);

    //clearing tables if output type is changed
    this.mConfTable = [];
    this.item['gdfInfo']['metricInfo'] = this.mConfTable;
    this.mConfTableData.emit(this.item['gdfInfo']['depMHComp'])
  }

  getIndexListForOutput() {
    let splitOuputByNewLine;
    let splitByDelimiter;
    splitOuputByNewLine = this.item.output.split("\n");

    let delimiter = this.item['delimiter'];
    if (this.item.delimiter == GEN_GDF.DELIMITER_CUSTOM)
      delimiter = this.item['cD'];

    let newSplitByHeaderLine = splitOuputByNewLine.trim().replace(/  +/g, ' ');
    splitByDelimiter = newSplitByHeaderLine.split(delimiter);

    let arr1 = [];
    for (let i = 0; i < splitByDelimiter.length; i++) {
      let indexInUI = i + 1;
      arr1.push(indexInUI.toString()); // to create index list
    }
    this.indexList = UtilityService.createDropdown(arr1);
  }

  // Method called to change table header in edit mode 
  onEditchangeTableHeader(outputType) {
    this.keyIndexLabel = outputType; // show in add dailog 
    let newCols;
      newCols = [
        { field: TABLEHEADER.METRIC_GROUP_NAME, header: 'Metric Name', visible: false, width: '120px' },
        { field: TABLEHEADER.UNIT, header: 'Unit', visible: false, width: '200px' },
        { field: TABLEHEADER.METRIC_KEY_INDEX, header: outputType, visible: false, width: '200px' },
        { field: TABLEHEADER.METRIC_TYPE, header: 'Metric Type', visible: true, width: '120px' },
        { field: TABLEHEADER.DATA_TYPE, header: 'Data type', visible: false, width: '200px' },
        { field: TABLEHEADER.METRIC_FORMULA, header: 'Metric Formula', visible: false, width: '200px' },
        { field: TABLEHEADER.METRIC_DESC, header: 'Description', visible: false, width: '200px' }]

    this.displayTableColumns(newCols);
  }

  //creating keyIndex dropdown for db monitor
  fillKeyIndexData(output){
    let str = output.split("\n");
   let splitByComma = str[0].split(COMPONENT.DB_OUTPUT_SEPERATOR);   //header of table
  
    let dcLabelArray = [];
    let dcValueArray = [];
    for(let i=0; i< splitByComma.length-1; i++){
        dcLabelArray[i] =  splitByComma[i].trim();
        dcValueArray[i] =  (i+1).toString();
  }
    this.indexList = UtilityService.createListWithKeyValue(dcLabelArray, dcValueArray);
  }

  getColKeyDropdownLabel(mConf){
    this.fillKeyIndexData(this.item['output']);
    let colKeyInfo = _.find(this.indexList, function (each) {
      return each['value'] ==  mConf['_metKeyIdx']})
      if(colKeyInfo){
        mConf['_metKeyIdx_ui'] = colKeyInfo.label;
      }
  }  

  //is user wants to hide column then isColumnGrouping is false else true
  applyColumnGrouping()	
  {	
    this.isColumnGrouping = !this.isColumnGrouping;	
  }	

  //when user wants to show/hide columns in metric table
  showHideColumnHeader(event)	
  {	
    for(let i = 0; i < this.cols.length; i++){	
      this.cols[i].visible = true;	
    }	
    for(let j = 0; j < event.value.length; j++)	
    {	
      for(let i = 0; i < this.cols.length; i++)	
      {	
        if(event.value[j] === this.cols[i].field)	
          this.cols[i].visible = false;	
      }	
    }
  }

  //method is used to set the options in hide/show dropdown
  generatColumns() {  	
    this.columnOptions = [];	
    for (let i = 0; i < this.cols.length; i++) {	
      this.columnOptions.push({ label: this.cols[i].header, value: this.cols[i].field});	
      this.selectedCols.push(this.cols[i].field);	
    }	
  }	

  //when user selected master checkbox then all rows will be selected
  selectAllRow(checkValue) {	
    if (checkValue) {	
      this.selectedMConf = this.mConfTable.filter((value) => {
        let isCompData = true;
        if(value._dT.includes('CompositeData') && !value._metKeyIdx.includes('.'))
          isCompData = false;
        if(!value._dT.includes('String') && !value._dT.includes('ObjectName') && isCompData)
          return true;
        else
          return false;  
      });	

      this.mConfTable.map(each=>{
        let isCompData = true;
        if(each._dT.includes('CompositeData') && !each._metKeyIdx.includes('.'))
          isCompData = false;
        if(!each._dT.includes('String') && !each._dT.includes('ObjectName') && isCompData)
          each._isChk = checkValue;
      })
    } else {	
      this.selectedMConf = [];	
      this.mConfTable.map(each=>{
          each._isChk = checkValue;
      })
    }	
  }	

  selectRow(checkValue,index) {	
    this.mConfTable[index]._isChk = checkValue;	
  }	
  onDialogClose(event) {
    this.advanceMetricConfDialog  = event;
 }
 addAdvConf() {
   this.advMetricConf.addAdvConf()
  this.advanceMetricConfDialog = false;
}
metricConfTableData(data) {
 this.mConfTable.map(function(each){
   if(each['id']==data.id){
    each['advPattern']= data.advPattern
    each['dF'] = data.dF
   }
 })
}
}

