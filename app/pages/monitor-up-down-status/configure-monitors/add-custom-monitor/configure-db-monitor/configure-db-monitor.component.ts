import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import * as _ from "lodash";
import { UtilityService } from '../../../service/utility.service';
import * as DB_MON_CONSTANTS from '../constants/configure-cmd-mon-constant';
import { MonitorupdownstatusService } from "../../../service/monitorupdownstatus.service";
import { MetricConfData } from '../../../../generic-gdf/containers/metric-configuration-data';
import { MetricHierarchyData } from '../../../../generic-gdf/containers/metric-hierarchy-data';
import { APIData } from '../containers/api-data';
import { CustomMonitorService } from '../services/custom-monitor.service';
import { DbMonData } from '../containers/db-mon-data';
import * as COMPONENT from '../../add-monitor/constants/monitor-configuration-constants';

@Component({
  selector: 'app-configure-db-monitor',
  templateUrl: './configure-db-monitor.component.html',
  styleUrls: ["./configure-db-monitor.component.scss"],
})
export class ConfigureDbMonitorComponent implements OnInit {

  apiData: APIData
  arrMetricConf: any[] = []; // array for showing metric configuration columns
  arrMetricHier: any[] = []; // array for showing metric hierarchy columns
  categoryList: any[] = [];// list of categories 
  cusCat: string = ''; // custom category name
  tierList: any[] = [];// for storing tier list obj 
  serverList: any[] = []; // contains serverlist for dropdown in run query dailog
  showRundialog: boolean = false;   //for selecting tier & server
  rs: string = '';
  cols: any[];
  queryOpTable: any[];   //data of query output table
  driverClassList: any[] = []; // driver class dropdown list
  dbInfoData: any = {};
  _tierId: string = ""; // tier id 
  serverIdList: any = []; // server id list
  serverNameList: any = []; // to store server list values
  noEdit: boolean = false;
  collapsed: boolean;
  reqData: APIData
  tierHeadersList: any[];
  dbMonData: DbMonData = new DbMonData();
  loading: boolean = false;
  constructor(private router: Router,
    private customMonService: CustomMonitorService,
    private monUpDownService: MonitorupdownstatusService,
    private msgServiceObj: MessageService
  ) { }

  ngOnInit() {
    this.apiData = new APIData(); // initialising component data binding fields.

    this.arrMetricHier = [
      { field: '_metadata', header: 'Metric Hierarchy Component', visible: false },
      { field: '_keyInd_ui', header: 'Column Key', visible: false },
    ]

    this.arrMetricConf = [
      { field: '_mN', header: 'Metric Name', visible: false },
      { field: '_unit', header: 'Unit', visible: false },
      { field: '_metKeyIdx_ui', header: 'Column Key', visible: false },
      { field: '_metType', header: 'Metric Type', visible: true },
      { field: '_dT', header: 'Data type', visible: false },
      { field: '_mF', header: 'Metric Formula', visible: false },
      { field: '_metDesc', header: 'Description', visible: false },

    ]
    let that = this;
    this.customMonService.openDbUI().subscribe(res => {
      this.dbInfoData = res;
      this.createDropdownForDb(this.dbInfoData);
      if (that.customMonService.isFromEdit) {
        that.onDbChange(this.dbMonData.dC);
      }
    });

    if (this.customMonService.isFromEdit) // check whether UI is from "ADD" or "EDIT"  mode
    {
      //this.customMonService.isFromEdit = false
      this.dbMonData = Object.assign({}, this.customMonService.getDbEditData)
      let str = this.dbMonData.output.split("\n");
      let splitByComma = str[0].split("%SEP%");   //header of table
      let tableCol = [];
      for (let i = 0; i < splitByComma.length - 1; i++) {
        tableCol[i] = { field: splitByComma[i], header: splitByComma[i] };
      }
      this.cols = tableCol;   //table column headers
      this.customMonService.outputLength = 0;
      if (this.dbMonData.dbServer)
        this.rs = this.dbMonData.host;
        this.onTierChange(this.dbMonData.qryTier);
    }

    this.apiData['dbMonData'] = this.dbMonData;
  }

  openRunDialog() {
    if (this.dbMonData.dC == "") {
      this.msgServiceObj.add({ severity: COMPONENT.SEVERITY_ERROR, summary: COMPONENT.SUMMARY_ERROR, detail: "Select Driver Class" });
      return;
    }

    if (this.dbMonData.query == "") {
      this.msgServiceObj.add({ severity: COMPONENT.SEVERITY_ERROR, summary: COMPONENT.SUMMARY_ERROR, detail: "Enter Query to run" });
      return;
    }
    this.showRundialog = true;
    this.tierHeadersList = this.customMonService.getTierHeaderList();
    let tierNameList = []
    this.tierHeadersList.map(function (each) {
      if (each.value > -1) // for skipping tierGroups and All tiers
        tierNameList.push(each.label)
    })
    this.tierList = UtilityService.createDropdown(tierNameList);
  }

  // Method called to save DB mon configuration when 'Save' button is clicked.
  saveDBMonConf() {
    this.customMonService.saveMonitorConfProvider(true);
    //adding custom category name to category tag in json backend
    if (this.dbMonData.cat == 'addNewTechnology') {
      this.dbMonData.cat = this.dbMonData.cusCat;
    }

    if (!this.customMonService.validateConfigurationData(this.dbMonData))
      return false;
    this.dbMonData.encripDbData = decodeURIComponent(this.dbMonData.encripDbData);
    this.dbMonData.monN = this.dbMonData.gdfInfo.grpN;
    this.apiData['dbMonData'] = this.dbMonData;
    this.apiData.objectId = this.customMonService.objectID;
    this.loading = true;
    this.customMonService.saveDb(this.apiData).subscribe(res => {
      if (res['status']) {
        this.msgServiceObj.add({ severity: COMPONENT.SEVERITY_SUCCESS, summary: COMPONENT.SUMMARY_SUCCESS, detail: res['msg'] })
        this.apiData = new APIData(); // for clearing fields of the form after save
        this.dbMonData = new DbMonData();
        setTimeout(() => {
          this.router.navigate(["/custom-monitors/availCustMon/db"]);
        }, 500)
      }
      else {
        this.msgServiceObj.add({ severity: COMPONENT.SEVERITY_ERROR, summary: COMPONENT.SUMMARY_ERROR, detail: res['msg'] })
        this.loading = false;
      }
    })

  }

  //Method called when run button is click to make DB connection and execute query.
  runQuery() {
    let ip;
    if (this.dbMonData.qryTier == "") {
      this.msgServiceObj.add({ severity: COMPONENT.SEVERITY_ERROR, summary: COMPONENT.SUMMARY_ERROR, detail: DB_MON_CONSTANTS.ERROR_MSG_FOR_RUN_CMD_ON_TIER });
      return;
    }

    if (this.dbMonData.qryTier != "" && this.dbMonData.qryServer == "") {
      this.msgServiceObj.add({ severity: COMPONENT.SEVERITY_ERROR, summary: COMPONENT.SUMMARY_ERROR, detail: DB_MON_CONSTANTS.ERROR_MSG_FOR_RUN_CMD_ON_SERVER });
      return;
    }

    if (!this.dbMonData.dbServer) {
      // this.dbMonData.host = this.dbMonData.qryServer;
      this.dbMonData.host = "localhost";
      this.rs = "";
    }
    else {
      this.dbMonData.host = this.rs;
    }
    let that = this;
    this.apiData['dbMonData'] = this.dbMonData;
    this.loading = true;
    this.customMonService.runDBQuery(this.apiData).subscribe(data => {
      if (data['status']) {
        this.loading = false;
        this.dbMonData.output = data['result']
        that.fillDataTable(this.dbMonData.output);
      }
      else {
        if (data['result'] != null) {
          this.loading = false;
          this.msgServiceObj.add({ severity: COMPONENT.SEVERITY_ERROR, summary: COMPONENT.SUMMARY_ERROR, detail: data['result'] });
        }
      }
    })
    this.showRundialog = false;
  }

  onTierChange(tier) {
    let tierInfo = _.find(this.customMonService.getTierHeaderList(), function (each) { return each['label'] == tier })

    /*** To get the server list in the dropdown ****/
    /*** Here unshift is used to insert element at 0 position of array 
     *** if Others is slectede for tiername then there should not be any request send to the server for getting the serverList**/

    if (tierInfo != undefined) {
      this.getServerListData(tierInfo.value)
    }
  }

  getServerListData(tierId) {
    this.monUpDownService.getServerList(tierId)
      .subscribe(res => {
        if (res != null) {
          let sName = [];
          let dName = [];
          res.map(each => {
            if (each['id'] >= 0) {
              sName.push(each['sName']);
              dName.push(each['dName']);
            }
          })
          this.serverList = UtilityService.createListWithKeyValue(dName, sName);
        }
      })
  }

  ngOnDestroy() {
    this.customMonService.isFromEdit = false;
    this.customMonService.objectID = "-1";
    //setting MetricHierarchy and MetricData array to blank. 
    this.customMonService.setMetricHierarchy([]);
    this.customMonService.setMetricData([]);
    this.noEdit = false;
  }

  getActualServerName(serverList, selectedServerName) {
    let serverSelectedObj = _.find(serverList, function (each) { return each['value'] == selectedServerName })
    let serverLabel = serverSelectedObj['label']
    let actualServerName;
    actualServerName = serverLabel.substring(serverLabel.indexOf("(") + 1, serverLabel.length)
    if (actualServerName.substr(-1) == ")")
      actualServerName = actualServerName.substring(0, actualServerName.length - 1);

    return actualServerName;
  }

  fillDataTable(output) {
    let str = output.split("\n");
    this.customMonService.outputLength = str.length - 2;
    let splitByComma = str[0].split("%SEP%");   //header of table
    let splitDataLine = str[1].split("%SEP%");
    let tableCol = [];
    let arr = [];
    for (let i = 0; i < splitByComma.length - 1; i++) {
      tableCol[i] = { field: splitByComma[i], header: splitByComma[i] };
    }
    this.cols = tableCol;   //table column headers

    for (let j = 1; j < str.length - 1; j++) {
      let obj = {};
      let splitForField = str[j].split("%SEP%");
      for (let k = 0; k < splitForField.length - 1; k++) {
        obj[splitByComma[k]] = splitForField[k];
      }
      arr.push(obj);
    }
    this.queryOpTable = arr;
    this.customMonService.createMetricHierarchyData(str, "%SEP%");
    this.autoFillMetricHierarchy(splitByComma, splitDataLine);
  }

  autoFillMetricHierarchy(splitByDelimiter, dataLineWithValues) {
    let arr = [];
    let arr1 = [];
    for (let j = 0; j < dataLineWithValues.length - 1; j++) {
      let metricHierObj = new MetricHierarchyData();
      let obj = new MetricConfData();
      if (isNaN(dataLineWithValues[j])) {
        metricHierObj._metadata = splitByDelimiter[j].trim();
        metricHierObj._keyInd_ui = splitByDelimiter[j].trim();
        metricHierObj._keyInd = (j + 1).toString();
        metricHierObj.id = j;
      }
      else {
        obj['_mN'] = splitByDelimiter[j].trim();
        obj['_metKeyIdx'] = (j + 1).toString();
        obj['_metKeyIdx_ui'] = splitByDelimiter[j].trim();
        obj['_metDesc'] = splitByDelimiter[j].trim();
        obj['id'] = j;
      }
      if (metricHierObj._metadata != '')
        arr.push(metricHierObj)

      if (obj._mN != '')
        arr1.push(obj);
    }

    this.customMonService.autoFillMetricInfoData(arr1);
    this.customMonService.autoFillMetricHierarchyData(arr);
  }

  //to create driver class dropdown
  createDropdownForDb(output) {
    let dcLabelArray = [];
    let dcValueArray = [];
    for (let i = 0; i < output.length; i++) {
      dcLabelArray[i] = output[i]["name"];
      dcValueArray[i] = output[i]["value"];
    }
    this.driverClassList = UtilityService.createListWithKeyValue(dcLabelArray, dcValueArray);
  }

  //when user changes driver class
  onDbChange(item) {
    let data;
    for (let i = 0; i < this.dbInfoData.length; i++) {
      if (item == this.dbInfoData[i]['value']) {
        data = this.dbInfoData[i]['data'];
        this.dbMonData.port = this.dbInfoData[i]['port'];
      }
    }
    let configureData = JSON.stringify(data);

    configureData = encodeURIComponent(configureData);
    this.dbMonData.encripDbData = configureData;
    if (item == 'mssql')
      this.dbMonData.authMode = "0";
    else
      this.dbMonData.authMode = "";

    if (item == 'oracle')
      this.dbMonData.connectData = "sid";
    else
      this.dbMonData.connectData = "";
  }
}
