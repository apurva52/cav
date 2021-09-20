import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdvSettings } from '../containers/adv-settings.data';
import { SelectItem, ConfirmationService, MessageService } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { CustMonInfo } from '../containers/cust-mon-info';
import { NFGlobalData } from '../containers/nf-global-data';
import { NFSettings } from '../containers/nf-setting-data';
import { APIData } from '../containers/api-data';
import { CustomMonitorService } from '../services/custom-monitor.service';
import { MetricInfoData } from '../containers/configure-cmd-mon-data';
import { UtilityService } from '../../../service/utility.service';
import * as COMPONENT from '../../add-monitor/constants/monitor-configuration-constants';


@Component({
  selector: 'app-configure-log-metric-mon',
  templateUrl: './configure-log-metric-mon.component.html',
  styleUrls: ['./configure-log-metric-mon.component.css']
})
export class ConfigureLogMetricMonComponent implements OnInit {
  hrField: string;
  dName: string;
  gdfInfoTable: any;
  query: string = "";
  outPut: string;
  metricField: string;
  graphNm: string;
  gD: string;
  apiData: APIData
  custMonInfo: CustMonInfo = new CustMonInfo();
  nfMonData: NFGlobalData = new NFGlobalData();
  nfS: NFSettings; // for mapping with Global Settings to NF Settings fieldset
  tierList: any[];
  showdialog: boolean = false;
  tableData: any[] = [];  //hierarchyTable data
  gdfInfoDataTable: any[] = [] //metric configuration table
  nFSecure: boolean = false;  //secure checkbox value in nf setting fieldset 
  mH: string = ""; // variable to store metric hierarchy to be send at save time
  envList: any[] = []; // environment list
  idxList: any[] = []; //index pattern list
  ddList: SelectItem[];    //saved query list
  metricHierarchyArr: any; // to store the hierarchy information from the query executed.
  metricConfigurationArr: any; //to store the metric configuration information from the query executed.
  SI: boolean; //sample interval checkbox
  count: number = 0;   //to not show time dialog when data is not present
  savedQueryName: string;    //for savedQuery
  showDateDialog: boolean = false;
  metGrpName: string = ''; // temporary variable to store group name
  showErrorDialog: boolean = false; // flag for showing error message dailog on execute query click
  userRole: string;   // used to restrict guest user
  noEdit: boolean = false;
  cols: any[];
  column: any[];
  loading: boolean = false;
  rejectVisible: boolean = true;
  acceptLable: string = "Yes";
  constructor(private router: Router,
    private cnfrmMsg: ConfirmationService,
    private datePipe: DatePipe,
    private customMonService: CustomMonitorService,
    private msgService: MessageService,
  ) { }

  ngOnInit() {
    this.apiData = new APIData();
    this.nfMonData = this.customMonService.globalNFData;
    this.getSecureVal(this.nfMonData.protocol)
    this.nfS = new NFSettings();
    let protocol = this.customMonService.getProtocol(this.nFSecure) // getting protocol on basis of 'Use Secure' checkBox value.
    if (this.customMonService.isFromEdit) // check whether UI is from "ADD" or "EDIT"  mode
    {
      this.SI = true;
      this.custMonInfo = Object.assign({}, this.customMonService.getNfEditData)
      if (this.custMonInfo.adv == null && this.custMonInfo.adv == undefined)
        this.custMonInfo.adv = new AdvSettings();

      if (this.custMonInfo.nf == null && this.custMonInfo.nf == undefined)
        this.custMonInfo.nf = new NFGlobalData();

      if (this.customMonService.getNfEditData.adv.interval == -1) {
        this.SI = false;
        this.custMonInfo.adv.interval = null;
      }

      this.query = this.custMonInfo.nf.query;
      this.metGrpName = this.custMonInfo.gdfInfo.grpN;
      this.getMetricConfTableDataAtEdit(this.custMonInfo.gdfInfo.metricInfo) // fill metric configuration table in edit mode 
      this.getMetricHierarchyTableDataAtEdit(this.custMonInfo);  // fill metric hierarchy table in edit mode 

      this.nfMonData = this.customMonService.getNfEditData.nf  //added this to fill data in NF Setting at edit mode when global settings and NF settings are different
    }
    this.fillNFSettingInfoData(protocol)

    this.cols = [
      { field: 'hrField', header: 'Heirarchy Component Name' },
      { field: 'dName', header: 'Display Name' }
    ]
    this.column = [
      { field: 'metricField', header: 'Metric Name' },
      { field: 'graphNm', header: 'Metric Display Name' },
      { field: 'gD', header: 'Metric Description' }
    ]
  }

  getSavedQuery(query) {
    this.query = query
  }

  //method calls when user clicks Execute button
  getQueryData() {
    this.nfMonData.reqType = "POST";
    let protocol = this.customMonService.getProtocol(this.nFSecure)
    if (this.custMonInfo.nf.query == undefined || this.custMonInfo.nf.query.trim() == "") {
      this.msgService.add({ severity: COMPONENT.SEVERITY_ERROR, summary: COMPONENT.SUMMARY_ERROR, detail: "Query can't be blank" })
      return false;
    }

    if (this.custMonInfo.nf.tier == "") {
      this.msgService.add({ severity: COMPONENT.SEVERITY_ERROR, summary: COMPONENT.SUMMARY_ERROR, detail: "Please select tier" })
      return false;
    }

    if(this.nfS.sT == "" || this.nfS.eT == "")
    {
      this.nfS.sT = "";
      this.nfS.eT = "";
    }

    if((this.nfS.eT) < (this.nfS.sT))
    {
      this.count = 0
      this.msgService.add({ severity: COMPONENT.SEVERITY_ERROR, summary: COMPONENT.SUMMARY_ERROR, detail: "End date should be greater than start date" })
      return false;
    }

    this.nfS.sT = this.datePipe.transform(this.nfS.sT,"dd/MM/yyyy hh:mm")
    this.nfS.eT = this.datePipe.transform(this.nfS.eT,"dd/MM/yyyy hh:mm")

    if(this.nfS.sT == undefined || this.nfS.eT == undefined)
    {
      this.nfS.sT = "";
      this.nfS.eT = "";
    }

    if(this.showDateDialog && this.nfS.sT == "")
    {
      this.msgService.add({ severity: COMPONENT.SEVERITY_ERROR, summary: COMPONENT.SUMMARY_ERROR, detail: "Specify start date" })
      return;
    }

    if(this.showDateDialog && this.nfS.eT == "")
    {
      this.msgService.add({ severity: COMPONENT.SEVERITY_ERROR, summary: COMPONENT.SUMMARY_ERROR, detail: "Specify end date" })
      return;
    }

    this.custMonInfo.nf.sT = this.nfS.sT;
    this.custMonInfo.nf.eT = this.nfS.eT;

    //added for sending query in request body 
    this.nfMonData.query = this.custMonInfo.nf.query;
    this.nfMonData.tier = this.custMonInfo.nf.tier;
    this.nfMonData.eT = this.nfS.eT; // for bug - 112937 
    this.nfMonData.sT =  this.nfS.sT; // for bug - 112937 
    this.nfMonData.protocol = protocol;
    this.apiData['nfGlobalDto'] = this.nfMonData;
    this.apiData['custMonInfo'] = this.custMonInfo;
    this.loading = true;
    this.customMonService.getMetricHierarchyData(this.apiData).subscribe(data => {
      if (data != null) {
        this.outPut = data['res'];
        if (data['status'] != "false") {
          this.count = 0;
           this.nfS.eT = "";
           this.nfS.sT = "";

          this.showDateDialog = false;// to hide the div after time is filled 
          this.metricHierarchyArr = data['hr'];
          this.metricConfigurationArr = data['ml'];
          this.loading = false;
        }
        else {
          this.showErrorDialog = true;
          this.outPut = "";
          this.nfS.eT = "";
          this.nfS.sT = "";
          this.loading = false;
        }
      }
    })
  }

  fillTableData() {
    if (this.outPut != '') {
      if (this.tableData.length != 0 && this.gdfInfoDataTable.length != 0) {
        this.rejectVisible = true;
        this.acceptLable = "Yes";
        this.cnfrmMsg.confirm({
          message: "You have unsaved changes.Are you sure to change the query?",
          header: 'Confirmation',
          icon: 'fa fa-question-circle',
          accept: () => {
            this.showdialog = false;
            this.createHierarchyTableData(this.metricHierarchyArr);
            this.createMetricInfoTableData(this.metricConfigurationArr);
          },
          reject: () => {
          }
        });
      }
      else {
        this.showdialog = false;
        this.createHierarchyTableData(this.metricHierarchyArr);
        this.createMetricInfoTableData(this.metricConfigurationArr);
      }
    }
    else {
      // this.messageService.errorMessage("Execute query to fetch metric information")	
    }
  }
  //here data is coming as array
  createHierarchyTableData(data) {
    let arr = [];
    let str = "";
    for (let i = 0; i < data.length; i++) {
      let obj = {};
      obj['hrField'] = data[i];
      obj['dName'] = data[i];

      if (obj['dName']) {
        str = str + obj['dName'] + ">";
      }
      arr.push(obj);
    }
    str = str.substring(0, str.length - 1);
    this.mH = str
    this.custMonInfo.gdfInfo.mD = str;
    this.tableData = arr;
  }

  //data is array of metric names 
  createMetricInfoTableData(data) {
    let arr = [];
    for (let i = 0; i < data.length; i++) {
      let obj = {};
      obj['graphNm'] = data[i];
      obj['gD'] = data[i];
      obj['metricField'] = data[i];

      arr.push(obj);
    }
    this.gdfInfoDataTable = arr;
  }

  //saves final data
  saveMonitorsConfiguration() {
    let pattern = /[> ]/;
    for (let i = 0; i < this.tableData.length; i++) {
      let str = this.tableData[i]['dName'];
      if (pattern.test(str.trim())) {
        this.msgService.add({ severity: COMPONENT.SEVERITY_ERROR, summary: COMPONENT.SUMMARY_ERROR, detail: "Space and > are not allowed in display name" })
        return false;
      }
      if (this.tableData[i]['dName'].trim() == "") {
        this.msgService.add({ severity: COMPONENT.SEVERITY_ERROR, summary: COMPONENT.SUMMARY_ERROR, detail: "Display Name can't be blank" })
        return false;
      }
    }
    for (let i = 0; i < this.gdfInfoDataTable.length; i++) {
      if (this.gdfInfoDataTable[i]['graphNm'].trim() == "") {
        this.msgService.add({ severity: COMPONENT.SEVERITY_ERROR, summary: COMPONENT.SUMMARY_ERROR, detail: "Metric Display Name can't be blank" })
        return false;
      }
      if (this.gdfInfoDataTable[i]['gD'].trim() == "") {
        this.gdfInfoDataTable[i]['gD'] = this.gdfInfoDataTable[i]['metricField'];;
      }
    }
    if (!this.validateTableData())
      return

    this.nfMonData.tier = this.custMonInfo.nf.tier;
    this.nfMonData.sT = this.custMonInfo.nf.sT;
    this.nfMonData.eT = this.custMonInfo.nf.eT;
    //this.cmsObj.getProtocol(this.nFSecure)
    this.custMonInfo.nf = this.nfMonData; // save NF setting data 
    this.custMonInfo.nf.query = this.query;
    this.custMonInfo.gdfInfo.mD = this.mH; // save metric hierarchy in gdfInfo
    this.getHierarchyInfo(this.tableData, this.custMonInfo)
    this.getMetricInfo(this.gdfInfoDataTable, this.custMonInfo);
    this.custMonInfo.monN = this.custMonInfo.gdfInfo.grpN
    if (!this.SI) {
      this.custMonInfo.adv.interval = -1;
    }
    this.apiData['nfGlobalDto'] = this.nfMonData;
    this.apiData['custMonInfo'] = this.custMonInfo;
    this.apiData['nf'] = this.nfS;
    if (this.customMonService.isFromEdit)
      this.apiData.objectId = this.customMonService.objectID;
    this.loading = true;
    this.customMonService.saveLogMetricConfiguration(this.apiData).subscribe(data => {
      if (data['status']) {
        this.msgService.add({ severity: COMPONENT.SEVERITY_SUCCESS, summary: COMPONENT.SUMMARY_SUCCESS, detail: data['msg'] })
        this.apiData = new APIData()
        this.tableData = []; // clearing metric hierarchy table
        this.gdfInfoDataTable = []; // clearing metric configuration table
        this.loading = false;
        setTimeout(() => {
          this.router.navigate(["/custom-monitors/availCustMon/nf"]);
        })
      }
      else {
        this.msgService.add({ severity: COMPONENT.SEVERITY_ERROR, summary: COMPONENT.SUMMARY_ERROR, detail: data['msg'] })
        this.loading = false;
      }
    })
  }

  validateTableData() {
    if (this.nfMonData.pPort == 0 || this.nfMonData.pPort == -1) {
      this.nfMonData.pPort = null;
    }
    if (this.query == '') {
      this.msgService.add({ severity: COMPONENT.SEVERITY_ERROR, summary: COMPONENT.SUMMARY_ERROR, detail: "Query not provided. Fill query or select it from Saved Query list to get metric information" })
      return false;
    }

    if (this.tableData.length == 0) {
      this.msgService.add({ severity: COMPONENT.SEVERITY_ERROR, summary: COMPONENT.SUMMARY_ERROR, detail: "Metric Hierarchy is mandatory. Execute query to get metric hierarchy" })
      return false;
    }

    if (this.gdfInfoDataTable.length == 0) {
      this.msgService.add({ severity: COMPONENT.SEVERITY_ERROR, summary: COMPONENT.SUMMARY_ERROR, detail: "Metric Configuration is mandatory. Execute query to get metric configuration" })
      return false;
    }
    return true;
  }

  getHierarchyInfo(dataTableValues, formValues) {
    let str = ''
    let strhrField = '';
    dataTableValues.map(function (each) {
      if (each['dName']) {
        str = str + each['dName'].trim() + ">";
      }
      if (each['hrField']) {
        strhrField = strhrField + each['hrField'] + ">";
      }
    })
    str = str.substring(0, str.length - 1);
    strhrField = strhrField.substring(0, strhrField.length - 1);
    formValues.gdfInfo.mD = str.trim();
    formValues.aM = strhrField;
  }

  getMetricInfo(dataTableValues, formValues) {
    let list = [];
    dataTableValues.map(function (each) {
      let arr: MetricInfoData = new MetricInfoData();
      arr['graphNm'] = each.graphNm.trim();
      arr['gD'] = each.gD.trim();
      arr['dC'] = each.metricField.trim();
      list.push(arr);
    })
    formValues.gdfInfo.metricInfo = list;
  }

  openExecuteDailog() {
    this.count = 0;
    this.showdialog = true;
    this.custMonInfo.nf.query = this.query
    let tierHeaderList = this.customMonService.getTierHeaderList()
    let tierNameList = [];
    tierHeaderList.map(function (each) {
      if (each.value > -1) // for skipping tierGroups 
      {
        tierNameList.push(each.label)
      }
    })

    this.tierList = UtilityService.createDropdown(tierNameList);
  }

  clearFieldsOfExecuteDialog() {
    this.nfMonData.query = "";
    this.nfMonData.tier = "";
    if (this.outPut != "") //clear only if it contains data
      this.outPut = "";
  }

  makeMetricHierarchy(str) {
    str = str + ">";
    return str;
  }

  getMetricHierarchyTableDataAtEdit(custMonInfo) {
    let str = custMonInfo.gdfInfo.mD;
    let strhrfield = custMonInfo.aM;
    str = str.split('>');
    strhrfield = strhrfield.split('>');
    for (let i = 0; i < str.length; i++) {
      let tableVal = {};
      tableVal['hrField'] = strhrfield[i];
      tableVal['dName'] = str[i];
      this.tableData.push(tableVal);
    }
  }

  getMetricConfTableDataAtEdit(custMonMetricInfo) {
    for (let i = 0; i < custMonMetricInfo.length; i++) {
      let tableVal = {};
      tableVal['metricField'] = custMonMetricInfo[i].dC;  // set graph name from dc as it is used as dependent component
      tableVal['graphNm'] = custMonMetricInfo[i].graphNm;
      tableVal['gD'] = custMonMetricInfo[i].gD;

      this.gdfInfoDataTable.push(tableVal)
    }
  }

  /**
   * Method to fetch environment list and index pattern list in NF Settings fieldset.
   */
  fillNFSettingInfo(isSecure) {
    let protocol = this.customMonService.getProtocol(isSecure) // getting protocol on basis of 'Use Secure' checkBox value.

    //Getting list of env. & index pattern on basis of host and port provided.
    this.nfMonData.protocol = protocol;
    this.customMonService.getIndxList(this.nfMonData).subscribe(data => {
      if (data != null) {
        if (data['status'] == "true") {
          // this.envList = UtilityService.createDropdown(data["env"]);
          // this.idxList  =  UtilityService.createDropdown(data["id"]);
        }
        else {
          //this.messageService.errorMessage(data['msg'])
        }
      }
    })
    this.nfS = this.nfMonData; // deep clone - assigning global NF data to the NF Setting class variables

    //assign proxy port to null if port is 0 or -1 
    if (this.nfMonData.pPort == 0) {
      this.nfMonData.pPort = null;
    }

    if (this.nfMonData.pPort == -1) {
      this.nfMonData.pPort = null;
    }
  }

  ngOnDestroy() {
    this.customMonService.isFromEdit = false;
  }

  //Method called when group desc is blank, so we will it with metric group name 
  validateMon() {
    if (this.custMonInfo.gdfInfo.gD == "" && this.custMonInfo.gdfInfo.grpN.length < 64) {
      this.custMonInfo.gdfInfo.gD = this.custMonInfo.gdfInfo.grpN
    }

  }

  //Method called when cancel is clicked in execute query dailog box 
  closeExecuteDialog() {
    this.showdialog = false;
    this.showDateDialog = false; //if open close date time dailog box
  }

  showDateTimeFields() {
    this.showErrorDialog = false;
    this.showDateDialog = true;
  }

  fillNFSettingInfoData(protocol) {
    this.nfS = Object.assign({}, this.nfMonData);
    if (this.nfMonData.pPort == -1) {
      this.nfMonData.pPort = null;
    }
    this.nfS.pPort = this.nfMonData.pPort;
    if (this.nfMonData.pPort == 0) {
      this.nfMonData.pPort = null;
    }

    this.nfMonData.protocol = protocol;

    this.envList = []
    this.idxList = []
    this.envList.push({ label: '--Select--', value: '' }, { label: this.nfMonData.env, value: this.nfMonData.env });
    this.idxList.push({ label: '--Select--', value: '' }, { label: this.nfMonData.idx, value: this.nfMonData.idx });
  }

  //for validating NF monitor fields
  validateNFData() {
    if (this.custMonInfo.gdfInfo.grpN.length > 64) {
      //	this.messageService.errorMessage("Metric Group Name should be less than 64 characters");
      return false;
    }
    if (this.nfMonData.host.length > 64) {
      //   this.messageService.errorMessage("Host name should be less than 64 characters");
      return false;
    }

    if (this.nfMonData.pHost != null && this.nfMonData.pHost.length > 64) {
      // this.messageService.errorMessage("Proxy Host name should be less than 64 characters");
      return false;
    }

    if (this.nfMonData.pUser != null && this.nfMonData.pUser.length > 32) {
      // this.messageService.errorMessage("Proxy Username should be less than 32 characters");
      return false;
    }

    if (this.nfMonData.pUser != null && this.nfMonData.pPwd.length > 32) {
      // this.messageService.errorMessage("Proxy Password should be less than 32 characters");
      return false;
    }
    return true;
  }

  //Method to get the value of secure checkbox from protocol if protocol http then secure is false 
  getSecureVal(protocol) {
    if (protocol == "https")
      this.nFSecure = true;
    else
      this.nFSecure = false;
  }

}
