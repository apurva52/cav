import { Component, OnInit, OnDestroy, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CavConfigService } from '../../../../configuration/nd-config/services/cav-config.service';
import { SelectItem } from 'primeng/primeng';
import { Message, ConfirmationService, MenuItem } from 'primeng/api';
import { RetentionPolicyCommonService } from '../../services/retention-policy-common.service';
import * as moment from 'moment';
import { headerFormatPipe } from './headerFormatPipe'
import { SessionService } from 'src/app/core/session/session.service';
import { DashboardRESTDataAPIService } from '../../../../actions/dumps/service/dashboard-rest-data-api.service';
import { EllipsisPipe } from 'src/app/shared/pipes/ellipsis/ellipsis.pipe';
import { MessageService } from 'primeng';
import { FileManagerComponent } from 'src/app/shared/file-manager/file-manager.component';

@Component({
  selector: 'app-retention-policy-main',
  templateUrl: './retention-policy-main.component.html',
  styleUrls: ['./retention-policy-main.component.css'],
  providers: [EllipsisPipe]
})

export class RetentionPolicyMainComponent implements OnInit {

  cols: any;
  cols2: any;
  cleanPath: any[] = [];
  ComponentData: any[] = [];
  enableDisableRetentionPolicy: boolean;
  enableDisableRecycleBin: boolean = false;
  logFilesize: string = '10';
  recyclebinTimeOptions: SelectItem[] = [];
  recyclebinTime = '';
  logLevelOptions: SelectItem[] = [];
  logLevel = '';
  testRunOptions: SelectItem[] = [];
  testRun = '';
  chipsForTestRun: string[];
  timeOptions: SelectItem[] = [];
  timeModel = '';
  componentModel = '';
  compStartDate = '';
  compEndDate = '';
  customisedTimeModel = '';
  startDate = '';
  endDate = '';
  timeForCustomPath: number;
  chipsForNegativeDate: string[];
  msgs: Message[] = [];
  ndeForDropDown = [];
  ndeForTime = [];
  NonNdeForDropDown = [];
  NonNdeForTime = [];
  tabIndex = 0;
  cleanupDetailsName: string = "";
  cleanupDetailsTime: string = "";
  columns: any[];
  loglevel: string = "";
  logFileSize = "";
  // dateArray = [];
  dateString = '';
  compName = "";
  compArray = [];
  dateAraay = [];
  dateName = "";
  cleanUpdates: any[] = [];

  // Wires up BlockUI instance
  //@BlockUI() blockUI: NgBlockUI;
  x
  retentionMode: string;
  recycleBinTime: string;
  negativeDays = '';
  text1: any;
  customCleanUpPath: any;
  customCleanUpVal: any;
  enableRetentionPolicy: boolean;
  cleanupNegativeDaysTime = "";
  date4 = [];
  date1 = '';
  date2 = '';
  date3 = '';
  date5 = [];
  date6 = [];

  backupPath = '';
  controller = '';
  cleanupNegativeDaysName = "";
  globalColumns: any[];
  configuration = {};
  timeJson = {};
  pathJson = {};
  componentJson = {};
  componentJson1 = {};
  pathString = '';
  pathVal = '';

  auditLogFile = '10';
  auditLogFileSize = '10';
  cleanUpPathName = "abc";
  cleanupPathValue = "xyz";
  configurationResult = [];
  testrunArray = [];
  negativeDateArray = [];
  openBrowser: boolean = false;
  componentName: any;
  dates: any;
  columns1: any[];
  combinedDates = '';
  openFileExplorerDialog: boolean;
  sub3: any;
  checked1: boolean = false;
  compStartDateBoth = '';
  timearrForJson = [];
  timearrjsn = '';
  isOcx: boolean = false;
  isUpdate: boolean = true;
  index: number;
  ndeDateArr = [];
  ndeMonthArr = [];
  disableEdit: boolean = false;
  iseditComp: boolean = false;
  updatedPath: boolean = false;
  pathIndex: number;
  static readonly ROUTE_DATA_BREADCRUMB = 'breadcrumb';
  breadcrumb: MenuItem[];
  isUpload: boolean = false;
  @ViewChild('fileManager', { read: FileManagerComponent })
  fileManager: FileManagerComponent;
  fileAndFolderPath: string;

  constructor(
    public _cavConfig: CavConfigService,
    public _cavApi: DashboardRESTDataAPIService,
    public confirmationService: ConfirmationService,
    public _retentionPolicyCommonService: RetentionPolicyCommonService,
    private sessionService: SessionService,
    private messageService: MessageService,
    private ref: ChangeDetectorRef
  ) {
    this.cols = [
      { field: 'path', header: 'Clean Path' },
      { field: 'time', header: 'Time' },
    ];

    this.columns = [
      { field: 'col1', header: 'graph_data' },
      { field: 'col2', header: 'har_file' },
      { field: 'col3', header: 'pagedump' },
      { field: 'col4', header: 'na_traces' },
      { field: 'col5', header: 'db_agg' },
      { field: 'col6', header: 'ocx' },
      { field: 'col7', header: 'test_data' },
      { field: 'col8', header: 'dbg_tr' },
      { field: 'col9', header: 'arch_tr' },
      { field: 'col10', header: 'tr' },
      { field: 'col11', header: 'csv' },
      { field: 'col12', header: 'access_log' },
      { field: 'col13', header: 'raw_data' },
      { field: 'col14', header: 'gen_tr' },
      { field: 'col15', header: 'reports' },
      { field: 'col16', header: 'configs' },
    ]

    this.columns1 = [
      { field: 'componentName', header: 'Component Name' },
      { field: 'dates', header: 'Dates' }
    ]

    this.cols2 = [
      { label: 'Select Component', value: 'Select Component' },
      { label: 'Raw Data', value: 'raw_data' },
      { label: 'Processed data', value: 'csv' },
      // { label: 'Reports', value: 'reports' },
      { label: 'Testrun', value: 'tr' },
      { label: 'Archive Testrun', value: 'arch_tr' },
      { label: 'Generator Testrun', value: 'gen_tr' },
      { label: 'Metric Data', value: 'graph_data' },
      { label: 'Resource Timing', value: 'har_file' },
      { label: 'Page Dumps', value: 'pagedump' },
      { label: 'Diagnostics data', value: 'test_data' },
      { label: 'Aggregated Drill Down Data', value: 'db_agg' },
      // { label: 'User session replay data', value: 'ocx' },
      { label: 'Drill Down Data', value: 'na_traces' },
      { label: 'Cavisson Product Logs', value: 'access_log' },
      { label: 'Reports', value: 'reports' },
      { label: 'Configs', value: 'configs' }
    ]
  }

  ngOnInit() {
    this.breadcrumb = [
      { label: 'Home' },
      { label: 'Admin' },
      { label: 'Data Retention & Cleanup' },
    ]
    this.checkForOcx();
    this.setDefaultFields();
    this.getData();
    this.ndeConfigurationData();
    this._retentionPolicyCommonService.getTestRun();
    this.getConfiguration();
    this.addPathwithBroadCaster();
    // $(document).ready(function () {
    //   $(".click-strips").click(function () {
    //     $(this).parents('.rowBlock').find('.content-body').slideToggle(100);
    //     $(this).parents('.rowBlock').toggleClass('activeBlock')
    //     $(this).toggleClass('active');
    //   })
    // });
  }

  checkForOcx() {
    try {
      if (sessionStorage.getItem('productType') == 'netvision') {
        this.isOcx = true;
      }
      else {
        this.isOcx = false;
      }
    }
    catch (error) {
      console.error("Error in hiding Ocx", error)
    }
  }

  browserMethod() {
    // this.openFileExplorerDialog = true;
    // this.openBrowser = true;
    try {
      this.fileManager.open(true, this.isUpload, "", true);
      this.ref.detectChanges();
    } catch (error) {
      console.error("error in opening File Manager --->> ", error);
    }
  }

  customSort(event) {

    event.data.sort((data1, data2) => {
      let value1 = new headerFormatPipe().transform(data1[event.field]);
      let value2 = new headerFormatPipe().transform(data2[event.field]);

      let result = null;
      // let temp1;
      // let temp2;

      // Sorting null values
      if (value1 == null && value2 != null)
        result = -1;
      else if (value1 != null && value2 == null)
        result = 1;
      else if (value1 == null && value2 == null)
        result = 0;
      else {
        //Checking fields individually and sort data accordingly.

        if (event['field'] == 'componentName') {
          //for string type fields
          result = value1.localeCompare(value2);
        }
        else if (event['field'] == 'path') {
          result = value1.localeCompare(value2);
        }
      }
      return (event.order * result);
    });
  }

  startProg() {
    try {
      //   this.ngProgress.start();
    }
    catch (error) {
      console.error("error in starting progress bar", error);
    }
  }

  destroyProg() {
    try {
      //   this.ngProgress.complete();
    }
    catch (error) {
      console.error("error in destroying  progress bar", error);
    }
  }

  addingPath() {

    let samePath: boolean;
    for (let i = 0; i < this.cleanPath.length; i++) {
      if (this.cleanPath[i]['path'] == (this.text1)) {
        samePath = true;
      }
    }
    if (this.text1 == undefined || this.text1 == '') {
      //  this.msgs = [{ severity: 'warn', summary: 'Warning', detail: 'Path is Empty' }];
      this.showWarn("Path is Empty.");
    }
    else if (this.timeModel == undefined || this.timeModel == '') {
      //  this.msgs = [{ severity: 'warn', summary: 'Warning', detail: 'Please enter time' }];
      this.showWarn("Please enter time.");
    }
    else if (this.timeForCustomPath == 0 || this.timeForCustomPath == null) {
      // this.msgs = [{ severity: 'warn', summary: 'Warning', detail: 'Time cant be zero/empty' }];
      this.showWarn("Time cant be zero/empty.");
    }
    else if (samePath) {
      // this.msgs = [{ severity: 'warn', summary: 'Warning', detail: 'Path already exist.' }];
      this.showWarn("Path already exist.");
    }
    else {
      let timePush;
      let tmarr;
      for (let i = 0; i < this.timeOptions.length; i++) {
        if (this.timeModel == this.timeOptions[i].value) {
          timePush = this.timeOptions[i].value;
          tmarr = this.timeOptions[i].value;
        }
      }
      this.customisedTimeModel = this.timeForCustomPath + timePush;
      this.timearrjsn = this.timeForCustomPath + tmarr;
      this.timearrForJson.push(this.timearrjsn);
      this.timeJson = {
        "path": this.text1,
        "time": this.customisedTimeModel
      }

      this.cleanPath.push(this.timeJson);
      //this.msgs = [{ severity: 'success', summary: 'Success', detail: 'Path added Successfully' }];
      this.showSuccess("Path added Successfully.");
      this.dateString = String(this.timeForCustomPath) + this.timeModel;
      // this.dateArray.push(this.dateString);
      // tmArr.push(this.cleanPath['path']);
      // tmVal.push(this.cleanPath['time']);
      // this.pathString=tmArr.join('|');
      // this.pathVal=tmVal.join('|');
      //      this.timeVariable =this.timeForCustomPath + " " +this.timeModel;\
      this.text1 = '';
      this.timeModel = '';
      this.timeForCustomPath = null;
    }
  }

  addToChip() {
    try {
      let currntDate: any;
      currntDate = moment(new Date());
      if (this.checked1) {
        if ((Date.parse(this.compEndDate) < Date.parse(this.compStartDateBoth))) {
          //  this.msgs = [{ severity: 'warn', summary: 'Warning', detail: 'Start Date can not be greater than End Date' }];
          this.showWarn("Start Date can not be greater than End Date.");
        }
        else if (this.cleanUpdates.includes(moment(new Date(this.compStartDateBoth)).format('YYYY/MM/DD') + ":" + moment(new Date(this.compEndDate)).format('YYYY/MM/DD'), 0)) {
          //  this.msgs = [{ severity: 'warn', summary: 'Warning', detail: 'Specified Date already added' }];
          this.showWarn("Specified Date already added.");
        }
        else if (this.compStartDateBoth == 'Invalid date' || this.compStartDateBoth == undefined || this.compStartDateBoth == '') {
          // this.msgs = [{ severity: 'warn', summary: 'Warning', detail: 'Please enter start date' }];
          this.showWarn("Please enter start date.");
        }
        else if (this.compEndDate == 'Invalid date' || this.compEndDate == undefined || this.compEndDate == '') {
          // this.msgs = [{ severity: 'warn', summary: 'Warning', detail: 'Please enter End date' }];
          this.showWarn("Please enter End date.");
        }
        // else if(((Date.parse(this.compStartDateBoth) < Date.parse(currntDate))))
        // {
        //   this.msgs = [{ severity: 'warn', summary: 'Warning', detail: 'Start Date cant be less than Current Date' }];
        // }
        // else if(((Date.parse(this.compEndDate) < Date.parse(currntDate))))
        // {
        //   this.msgs = [{ severity: 'warn', summary: 'Warning', detail: 'End Date cant be less than Current Date' }];
        // }
        else {
          this.combinedDates = moment(new Date(this.compStartDateBoth)).format('YYYY/MM/DD') + ":" + moment(new Date(this.compEndDate)).format('YYYY/MM/DD');
          this.cleanUpdates.push(this.combinedDates);
        }
      }

      if (!this.checked1) {
        if (this.cleanUpdates.includes(moment(new Date(this.compStartDate)).format('YYYY/MM/DD'), 0)) {
          // this.msgs = [{ severity: 'warn', summary: 'Warning', detail: 'Specified Date already added' }];
          this.showWarn("Specified Date already added.");
        }
        else if (this.compStartDate == 'Invalid date' || this.compStartDate == undefined) {
          // this.msgs = [{ severity: 'warn', summary: 'Warning', detail: 'Please enter start date' }];
          this.showWarn("Please enter start date.");
        }
        // else if(((Date.parse(this.compStartDate) < Date.parse(currntDate))))
        // {
        //   this.msgs = [{ severity: 'warn', summary: 'Warning', detail: 'Start Date cant be less than Current Date' }];
        // }
        else {
          this.combinedDates = moment(new Date(this.compStartDate)).format('YYYY/MM/DD');
          this.cleanUpdates.push(this.combinedDates);
        }

      }
    }
    catch (error) {
      console.error("Error in adding data to the input chip");
    }
  }

  addComponent() {
    try {
      let newComp: boolean = true;
      let newIndex;
      for (let i = 0; i < this.ComponentData.length; i++) {
        if (this.componentModel == this.ComponentData[i]['componentName']) {
          newIndex = i;
          newComp = false;
          // this.msgs = [{ severity: 'warn', summary: 'Warning', detail: 'Component already exists' }];
        }
      }

      if (this.componentModel == 'Select Component' || this.componentModel == '') {
        //  this.msgs = [{ severity: 'warn', summary: 'Warning', detail: 'Please Choose any Component' }];
        this.showWarn("Please Choose any Component.");
      }
      else {
        if (!newComp) {
          for (let j = 0; j < this.cleanUpdates.length; j++) {
            if (this.ComponentData[newIndex]['dates'].includes(this.cleanUpdates[j])) {
              //  this.msgs = [{ severity: 'warn', summary: 'Warning', detail: 'Date already exist for the component' }];
              this.showWarn("Date already exist for the component.");
              return;
            }
          }

          this.dateName = this.ComponentData[newIndex]['dates'] + "," + this.cleanUpdates.join(",");
          this.ComponentData[newIndex]['dates'] = this.dateName;
          //  this.msgs = [{ severity: 'success', summary: 'Success', detail: 'Component added Successfully' }];
          this.showSuccess("Component added Successfully.");
        }
        else {
          this.dateName = this.cleanUpdates.join(",");
          this.componentJson = {
            "componentName": this.componentModel,
            "dates": this.dateName
          }
          this.ComponentData.push(this.componentJson);
          // this.msgs = [{ severity: 'success', summary: 'Success', detail: 'Component added Successfully' }];
          this.showSuccess("Component added Successfully.");
        }
        this.componentModel = "Select Component";
        this.cleanUpdates = [];
      }

      this.compStartDate = '';
      this.compStartDateBoth = '';
      this.compEndDate = '';
    }
    catch (error) {
      console.error("error in adding component", error);
    }
  }

  deleteInComponentTable(index) {
    this.ComponentData.splice(index, 1);
  }

  editComp(val) {
    try {
      this.disableEdit = true;
      this.isUpdate = false;
      this.index = val;
      let arr = [];
      arr = this.ComponentData[val]['dates'].split(',');
      this.componentModel = this.ComponentData[val]['componentName'];
      for (let i = 0; i < arr.length; i++) {
        this.cleanUpdates.push(arr[i]);
      }
    }
    catch (error) {
      console.error("error in editing component data", error)
    }

  }

  editPath(rowIndex) {
    try {
      this.pathIndex = rowIndex;
      this.iseditComp = true;
      this.text1 = this.cleanPath[rowIndex]['path'];
    }
    catch (error) {
      console.error("Error in editing Path", error);
    }
  }

  updatePath() {
    let updatedDate = '';
    if (this.timeModel == undefined || this.timeModel == '') {
      //  this.msgs = [{ severity: 'warn', summary: 'Warning', detail: 'Please enter time' }];
      this.showWarn("Please enter time.");
    }
    else if (this.timeForCustomPath == null || this.timeForCustomPath == undefined || this.timeForCustomPath == 0) {
      //  this.msgs = [{ severity: 'warn', summary: 'Warning', detail: 'Custom path time can not be Zero/empty' }];
      this.showWarn("Custom path time can not be Zero/empty.");
    }
    else {
      this.updatedPath = true;
      updatedDate = this.timeForCustomPath + this.timeModel;
      this.cleanPath[this.pathIndex]['time'] = updatedDate;
      this.timearrForJson[this.pathIndex] = updatedDate;
      this.iseditComp = false;
      this.text1 = "";
      this.timeForCustomPath = 0;
      this.timeModel = '';
      //this.msgs = [{ severity: 'success', summary: 'Success', detail: 'Path updated successfully' }];
      this.showSuccess("Path updated successfully.");
    }
  }

  cancelUpdateForP() {
    this.iseditComp = false;
    this.text1 = '';
    this.timeModel = '';
    this.timeForCustomPath = 0;
  }

  updateComp() {
    try {
      this.disableEdit = false;
      this.ComponentData[this.index]['dates'] = this.cleanUpdates.join(',');
      //  this.msgs = [{ severity: 'success', summary: 'Success', detail: 'Component updated successfully' }];
      this.showSuccess("Component updated successfully.");
      this.isUpdate = true;
      this.cleanUpdates = [];
      this.componentModel = "Select Component";
    }
    catch (error) {
      console.error("error in updating the component", error)
    }
  }

  cancelUpdate() {
    try {
      this.disableEdit = false;
      this.isUpdate = true;
      this.componentModel = "Select Component";
      this.cleanUpdates = [];
    }
    catch (error) {
      console.error("error in cancelling Update", error);
    }
  }

  delete(index) {
    this.cleanPath.splice(index, 1);
    this.timearrForJson.splice(index, 1);
  }

  saveConfiguration() {
    try {
      //  this.startProg()
      let json = this.configuration;
      // let user = sessionStorage.getItem('sesLoginName');
      let user = this.sessionService.session.cctx.u;
      let ip = this._cavConfig.$serverIP + 'ProductUI/productSummary/servicesStats/ConfigureRetentionPolicy?&user=' + user;
      let temp = this._cavApi.getDataFromRESTUsingPOSTReq(ip, '', json).subscribe(
        result => {
          //     this.destroyProg();
          if (result['status'] == "SUCCESS") {
            // this.msgs = [{ severity: 'success', summary: 'Success', detail: 'Configuration Saved Successfully' }];
            this.showSuccess("Configuration Saved Successfully.");
          }
          if (result['status'] == "Error") {
            // this.msgs = [{ severity: 'error', summary: 'Error', detail: 'Error in Saving Configuration' }];  
            this.showError("Error in Saving Configuration.");
          }
        },
        error => {
          //  this.destroyProg();
          //  this.msgs = [{ severity: 'error', summary: 'Error', detail: 'Error in Saving Configuration' }];   
          this.showError("Error in Saving Configuration.");
          temp.unsubscribe();
        },
        () => {
          // this.destroyProg();
          temp.unsubscribe();
        });
    } catch (error) {
      //   this.destroyProg();
      console.error('error in Saving Configuration', error);
    }
  }

  getConfiguration() {
    try {
      //  this.startProg();
      let user = sessionStorage.getItem('sesLoginName');
      let ip = this._cavConfig.$serverIP + 'ProductUI/productSummary/servicesStats/getRetentionPolicyConfig';
      let temp = this._cavApi.getDataByRESTAPI(ip, '').subscribe(
        result => {
          this.destroyProg();
          if (result != '' && result != undefined && result['status'] != 'Error') {
            this.configurationResult = result;
            // this.enableDisableRetentionPolicy = this.configurationResult['enableRetentionPolicy'];
            if (this.configurationResult['enableRetentionPolicy'] == 'true')
              this.enableDisableRetentionPolicy = true;
            else
              this.enableDisableRetentionPolicy = false;
            this.loglevel = this.configurationResult['logLevel'];
            this.logFilesize = this.configurationResult['logFileSize'];
            if (this.configurationResult['retentionMode'] != undefined) {
              this.retentionMode = this.configurationResult['retentionMode'];
            }
            else {
              this.retentionMode = "";
            }
            // this.enableDisableRecycleBin = this.configurationResult['enableRetentionPolicy'];
            // if (this.configurationResult['recycleBinTime'] != undefined || this.configurationResult['recycleBinTime'] != null) {
            //   this.enableDisableRecycleBin = true;
            //   // this.recyclebinTime = this.configurationResult['recycleBinTime'];
            // }
            if (this.configurationResult['recycleBinTime'] != undefined || this.configurationResult['recycleBinTime'] != null || this.configurationResult['recycleBinTime'] != '') {
              this.enableDisableRecycleBin = true;
              this.recyclebinTime = this.configurationResult['recycleBinTime'];
            }
            else
              this.enableDisableRecycleBin = false;
            // if(this.configurationResult['negativeDays'] != '' || this.configurationResult['negativeDays'] != null || this.configurationResult['negativeDays'] != undefined)
            // {
            //   this.negativeDateArray = this.configurationResult['negativeDays'].split('|');
            // }
            this.chipsForNegativeDate = [];
            let negDateArr = [];

            if (this.configurationResult['negativeDays'] != "" && this.configurationResult['negativeDays'] != undefined && this.configurationResult['negativeDays'] != null) {
              if (this.configurationResult['negativeDays'].includes('|')) {
                for (let i = 0; i < (this.configurationResult['negativeDays'].split('|')).length; i++) {
                  negDateArr.push((this.configurationResult['negativeDays'].split('|'))[i]);

                }
              }
              else {
                negDateArr.push(this.configurationResult['negativeDays']);

              }
              for (let i = 0; i < negDateArr.length; i++) {

                this.chipsForNegativeDate.push(negDateArr[i]);
              }
            }
            this.auditLogFile = this.configurationResult['auditLogFileSize'];

            // This block is for getting component data into table.
            this.ComponentData = [];
            if (this.configurationResult['cleanupNegativeDaysTime'].length > 0) {
              for (let i = 0; i < this.configurationResult['cleanupNegativeDaysTime'].length; i++) {
                if (this.configurationResult['cleanupNegativeDaysName'][i] == 'logs' || this.configurationResult['cleanupNegativeDaysName'][i] == 'db')
                  continue;
                this.componentJson1 = {
                  "componentName": this.configurationResult['cleanupNegativeDaysName'][i],
                  "dates": this.configurationResult['cleanupNegativeDaysTime'][i]
                }
                this.ComponentData.push(this.componentJson1);
              }
            }
            // This block is for getting path data into table.
            this.cleanPath = [];
            if (this.configurationResult['customCleanUpPath'].length > 0) {
              for (let i = 0; i < this.configurationResult['customCleanUpPath'].length; i++) {
                this.pathJson = {
                  "path": this.configurationResult['customCleanUpPath'][i],
                  "time": this.configurationResult['customCleanUpVal'][i]
                }
                this.cleanPath.push(this.pathJson);
                this.timearrForJson.push(this.configurationResult['customCleanUpVal'][i]);
              }
            }
            for (let i = 0; i < this.configurationResult['cleanupPathValue'].length; i++) {
              this.ndeForTime[i] = this.configurationResult['cleanupPathValue'][i].substring(0, this.configurationResult['cleanupPathValue'][i].length - 1);
              this.ndeForDropDown[i] = this.configurationResult['cleanupPathValue'][i].substring(this.configurationResult['cleanupPathValue'][i].length - 1);
            }
          }
          else {
            this.destroyProg();
            // this.msgs = [{ severity: 'error', summary: 'Error', detail: 'Error in geting configuration' }];
            this.showError("Error in geting configuration.");
          }
        },
        error => {
          this.destroyProg();
          //this.msgs = [{ severity: 'error', summary: 'Error', detail: 'Error in geting configuration' }];
          this.showError("Error in geting configuration'.");
          temp.unsubscribe();
        },
        () => {
          this.destroyProg();

          temp.unsubscribe();
        });
    }
    catch (error) {
      this.destroyProg();
      // this.msgs = [{ severity: 'error', summary: 'Error', detail: 'Error in geting configuration' }];
      this.showError("Error in geting configuration.");
      console.error('error in getData()');
    }

  }

  columnClick(val, event, x) {
    console.log("column index", val, event, x);

  }

  cancelConf() {
    try {
      this.getConfiguration();
    }
    catch (error) {
      console.error("Error in cancel Configuration", error);
    }
  }

  /**Subscriber for receiving data from server
   */
  getData() {
    try {
      let temp = this._retentionPolicyCommonService.retentionPolicyInfo.subscribe(
        result => {
          if (this._retentionPolicyCommonService.action == 'GETTR') {

            if (result != '' && result != undefined) {
              for (let i = 0; i < result.length; i++) {
                this.testRunOptions.push(result[i]);
              }
            }
          }

        }, error => {
          console.error("error in getting data", error)
          temp.unsubscribe();

        }, () => {
          temp.unsubscribe();
        }
      );
    } catch (error) {
      console.error('error in getting subscriber data', error);
    }
  }

  /**For Initialising Default Fields in Dropdown */
  setDefaultFields() {
    try {
      this.backupPath = '/home/cavisson/backup';
      this.controller = 'work'
      this.logFilesize = '10';
      this.enableDisableRecycleBin = false;
      this.recyclebinTimeOptions.push({ 'label': '--Select Time--', 'value': 'Select Time' });
      this.recyclebinTimeOptions.push({ 'label': '1 Day', 'value': '1d' });
      this.recyclebinTimeOptions.push({ 'label': '2 Day', 'value': '2d' });
      this.recyclebinTimeOptions.push({ 'label': '3 Day', 'value': '3d' });
      this.recyclebinTimeOptions.push({ 'label': '4 Day', 'value': '4d' });
      this.recyclebinTimeOptions.push({ 'label': '5 Day', 'value': '5d' });
      this.recyclebinTimeOptions.push({ 'label': '6 Day', 'value': '6d' });
      this.recyclebinTimeOptions.push({ 'label': '7 Day', 'value': '7d' });
      this.recyclebinTime = 'Select Time';
      // this.logLevelOptions.push({ 'label': '0', 'value': '0' });
      this.logLevelOptions.push({ 'label': '1', 'value': '1' });
      this.logLevelOptions.push({ 'label': '2', 'value': '2' });
      this.logLevelOptions.push({ 'label': '3', 'value': '3' });
      this.logLevelOptions.push({ 'label': '4', 'value': '4' });
      // this.timeOptions.push({ 'label': '--Select Time--', 'value': '' });
      this.timeOptions.push({ 'label': 'Year', 'value': 'y' });
      this.timeOptions.push({ 'label': 'Month', 'value': 'm' });
      this.timeOptions.push({ 'label': 'Week', 'value': 'w' });
      this.timeOptions.push({ 'label': 'Day', 'value': 'd' });
      this.timeModel = '';
      this.logLevel = '1';
      this.testRunOptions.push({ 'label': '--Select Test Run--', 'value': 'select Test Run' });
      this.testRun = 'select Test Run';
      this.chipsForTestRun = [];
      this.startDate = '';
      this.endDate = '';
      this.timeForCustomPath = 0;
      this.chipsForNegativeDate = [];
      this.retentionMode = "";
      this.ndeForDropDown = ['m', 'm', 'm', 'm', 'y', 'w', 'm', 'm', 'd', 'm', 'm', 'm', 'm', 'w', 'm', 'd'];
      this.ndeForTime = [3, 1, 1, 1, 1, 2, 1, 2, 1, 3, 1, 1, 1, 2, 1, 1];
      this.ndeDateArr = ['3', '1', '1', '1', '1', '2', '1', '2', '1', '3', '1', '1', '1', '2', '1', '1'];
      this.ndeMonthArr = ['m', 'm', 'm', 'm', 'y', 'w', 'm', 'm', 'd', 'd', 'm', 'm', 'm', 'w', 'm', 'd'];

      // this.NonNdeForDropDown = ['weeks', 'month', 'weeks', 'month', 'month', 'month', 'month'];
    }
    catch (error) {
      console.error("error in initialising default value in array", error);
    }
  }

  checkUpperLimit() {
    try {
      console.log("Print val", this.ndeForDropDown, this.ndeForTime);
      this.ndeConfigurationData();
      let limitArr = [];
      let nameArr = [];
      // 3y,12m,12m,1y,12m,3m,12m,4w,3y,12m,6m,3m,1m

      limitArr = [1095, 365, 365, 365, 365, 90, 365, 365, 28, 1095, 365, 180, 90, 30, 365];
      let showLimitArr = ['3 Year', '1 Year', '1 Year', '1 Year', '1 Year', '3 Month', '1 Year', '1 Year', '4 Weeks', '3 Year', '1 Year', '6 Month', '3 Month', '1 Month', '1 Year']
      nameArr = ['Metric Data', ' Resource Timing', 'Page Dumps', 'Drill Down Data', 'Aggregated Drill Down Data', 'User Session Replay Data', 'Diagnostics Data', 'Reports', 'Debug Testrun', 'Archive Testrun', 'TR', 'Processed Data', 'Cavisson Product Logs', 'Raw Data', 'Configs'];
      let multiplier;
      for (let i = 0; i < 15; i++) {
        if (this.ndeForDropDown[i] == 'd') {
          multiplier = (this.ndeForTime[i]);
        }
        else if (this.ndeForDropDown[i] == 'm') {
          multiplier = (this.ndeForTime[i]) * 30;
        }
        else if (this.ndeForDropDown[i] == 'w') {
          multiplier = (this.ndeForTime[i]) * 7;
        }
        else {
          multiplier = (this.ndeForTime[i]) * 365;
        }
        if (multiplier > limitArr[i]) {
          // this.msgs = [{ severity: 'warn', summary: 'Warning', detail: `The upper limit for ${nameArr[i]} is ${showLimitArr[i]}` }];
          // this.msgs = [{ severity: 'error', summary: 'Error', detail: `The upper limit for ${nameArr[i]} is ${showLimitArr[i]} ` }];
          this.showError(`The upper limit for ${nameArr[i]} is ${showLimitArr[i]}.`);
          return;
        }
      }
      this.saveConfiguration();
    }
    catch (error) {
      console.error("error in matching upper Limit", error);
    }
  }

  /**For adding data on p-chips array */
  callOnAddButton(val) {
    try {
      if (val == 'negativeDate') {
        let currentDate: any;
        currentDate = moment(new Date());
        if (this.startDate == "" && this.endDate == "") {
          //this.msgs = [{ severity: 'warn', summary: 'Warning', detail: 'Both Date can not be Blank' }];
          this.showWarn("Both Date can not be Blank.");
        }
        else if (this.startDate != "" && this.endDate == "") {
          // this.msgs = [{ severity: 'warn', summary: 'Warning', detail: 'End  Date can not be Blank' }];
          this.showWarn("End  Date can not be Blank.");
        }
        else if (this.startDate == "" && this.endDate != "") {
          //  this.msgs = [{ severity: 'warn', summary: 'Warning', detail: 'Start Date can not be Blank' }];
          this.showWarn("Start Date can not be Blank.");
        }
        else if ((Date.parse(this.endDate) < Date.parse(this.startDate))) {
          // this.msgs = [{ severity: 'warn', summary: 'Warning', detail: 'Start Date can not be greater than End Date' }];
          this.showWarn("Start Date can not be greater than End Date.");
        }
        else if ((Date.parse(this.startDate) < Date.parse(currentDate))) {
          //  this.msgs = [{ severity: 'warn', summary: 'Warning', detail: 'Start Date can not be less than Current Date' }];
          this.showWarn("Start Date can not be less than Current Date.");
        }
        else if ((Date.parse(this.endDate) < Date.parse(currentDate))) {
          //  this.msgs = [{ severity: 'warn', summary: 'Warning', detail: 'End Date can not be less than Current Date' }];
          this.showWarn("End Date can not be less than Current Date.");
        }
        else {
          let startDate = moment(new Date(this.startDate)).format('YYYY/MM/DD');
          let endDate = moment(new Date(this.endDate)).format('YYYY/MM/DD');
          let negDateToShow = '';

          if (startDate != endDate) {
            negDateToShow = startDate + ":" + endDate;
          }
          if (startDate == endDate && startDate != undefined && endDate != undefined) {
            negDateToShow = startDate;
          }
          if (this.chipsForNegativeDate.includes(negDateToShow)) {
            //this.msgs = [{ severity: 'warn', summary: 'Warning', detail: 'Date already exist' }];
            this.showWarn("Date already exist.");
          }
          else {
            this.chipsForNegativeDate.push(negDateToShow);
            this.startDate = '';
            this.endDate = '';
          }
        }
      }
    }
    catch (error) {
      //   this.log.error("error in initialising default value in array", error);
    }
  }

  // callonadd(val) {

  //     let startDate: string = '';
  //     let i;
  //     console.log("the value of date1", this.date1);
  //     startDate = moment(new Date(this.date1)).format('MM/DD/YYYY');
  //     console.log("the value of date", startDate);
  //     this.values1.push(startDate);
  //     if(this.date4[0] != undefined || this.date4[0] != null && val == '0')
  //     {
  //     this.values2.push(moment(new Date(this.date4[0])).format('MM/DD/YYYY'));
  //     }
  //     // this.values3.push(moment(new Date(this.date4[1])).format('MM/DD/YYYY'));
  //     if(this.date4[1] != undefined || this.date4[1] != null && val == '1')
  //     {
  //     this.values3.push(moment(new Date(this.date4[1])).format('MM/DD/YYYY'));
  //     }
  //     if(this.date4[2] != undefined || this.date4[2] != null && val == '2')
  //     {
  //     this.values4.push(moment(new Date(this.date4[2])).format('MM/DD/YYYY'));
  //     }
  //     if(this.date4[3] != undefined || this.date4[3] != null && val == '3')
  //     {
  //     this.values5.push(moment(new Date(this.date4[3])).format('MM/DD/YYYY'));
  //     }
  //     if(this.date4[4] != undefined || this.date4[4] != null && val == '4')
  //     {
  //     this.values6.push(moment(new Date(this.date4[4])).format('MM/DD/YYYY'));
  //     }
  //     if(this.date4[5] != undefined || this.date4[5] != null && val == '5')
  //     {
  //     this.values7.push(moment(new Date(this.date4[5])).format('MM/DD/YYYY'));
  //     }
  //     if(this.date4[6] != undefined || this.date4[6] != null && val == '6')
  //     {
  //     this.values8.push(moment(new Date(this.date4[6])).format('MM/DD/YYYY'));
  //     }
  //     if(this.date4[7] != undefined || this.date4[7] != null && val == '7')
  //     {
  //     this.values9.push(moment(new Date(this.date4[7])).format('MM/DD/YYYY'));
  //     }
  //     if(this.date4[8] != undefined || this.date4[8] != null && val == '8')
  //     {
  //     this.values10.push(moment(new Date(this.date4[8])).format('MM/DD/YYYY'));
  //     }
  //     if(this.date4[9] != undefined || this.date4[9] != null && val == '9')
  //     {
  //     this.values11.push(moment(new Date(this.date4[9])).format('MM/DD/YYYY'));
  //     }
  //     if(this.date4[10] != undefined || this.date4[10] != null && val == '10')
  //     {
  //     this.values12.push(moment(new Date(this.date4[10])).format('MM/DD/YYYY'));
  //     }
  //     if(this.date4[11] != undefined || this.date4[11] != null && val == '11')
  //     {
  //     this.values13.push(moment(new Date(this.date4[11])).format('MM/DD/YYYY'));
  //     }
  //     if(this.date4[12] != undefined || this.date4[12] != null && val == '12')
  //     {
  //     this.values14.push(moment(new Date(this.date4[12])).format('MM/DD/YYYY'));
  //     }
  //     if(this.date4[13] != undefined || this.date4[13] != null && val == '13')
  //     {
  //     this.values15.push(moment(new Date(this.date4[13])).format('MM/DD/YYYY'));
  //     }
  //     if(this.date4[14] != undefined || this.date4[14] != null && val == '14')
  //     {
  //     this.values16.push(moment(new Date(this.date4[14])).format('MM/DD/YYYY'));
  //     }

  //     // for( i=0 ; i<=3; i++)
  //     // {
  //     //   if(i == 0 && (this.date4[0] != undefined || this.date4[0] != null))
  //     //   {
  //     //     this.values2.push(moment(new Date(this.date4[i])).format('MM/DD/YYYY'));
  //     //   }
  //     //   if(i == 1 && (this.date4[1] != undefined || this.date4[1] != null))
  //     //   {
  //     //     this.values3.push(moment(new Date(this.date4[i])).format('MM/DD/YYYY'));
  //     //   }

  //     // }
  //   // if (val == 'endday') {
  //   //   let endDate1: string = '';
  //   //   let endDate2: string = '';
  //   //   let i;
  //   //   endDate1 = moment(new Date(this.date2)).format('MM/DD/YYYY');
  //   //   endDate2 = moment(new Date(this.date3)).format('MM/DD/YYYY');
  //   //   let finalDate = endDate1 + ":" + endDate2;
  //   //   this.values1.push(finalDate);
  //   //   if(this.date5[0] != undefined || this.date5[0] != null)
  //   //   {
  //   //     this.values2.push(moment(new Date(this.date5[i])).format('MM/DD/YYYY') + ":"+ moment(new Date(this.date6[i])).format('MM/DD/YYYY'));
  //   //   }
  //     // for( i=0 ; i<=3; i++)
  //     // {
  //     //   if(i == 0 && (this.date4[0] != undefined || this.date4[0] != null))
  //     //   {
  //     //     this.values2.push(moment(new Date(this.date5[i])).format('MM/DD/YYYY') + ":"+ moment(new Date(this.date6[i])).format('MM/DD/YYYY'));
  //     //   }
  //     //   if(i == 1 && (this.date4[1] != undefined || this.date4[1] != null))
  //     //   {
  //     //     this.values3.push(moment(new Date(this.date5[i])).format('MM/DD/YYYY') + ":"+ moment(new Date(this.date6[i])).format('MM/DD/YYYY'));
  //     //   }

  //     // }

  //   // }
  // }

  //   openFileManager() {
  //     try {
  //       //console.log("comming inside open file manager")
  //       // if(this._perfDashboard.isAddEnvironment)
  //       // {
  //       //  //console.log("comming inside IF")
  //       //   this._perfDashboard.isAddEnvironment = false;
  //       //   this._perfDashboard.addFlag = true;

  //       // }
  //       // if(this._perfDashboard.isUpdateEnvironment)
  //       // {
  //       //  this._perfDashboard.isUpdateEnvironment = false;
  //       //   this._perfDashboard.updateFlag = true;


  //       //console.log("before calling file explorer")
  //       // setTimeout(() => {this.openManager()},500);
  //       this.openManager();

  //    } catch (error) {
  //      console.error('error in opening file explorer', error);
  //    }
  //  }


  //   openManager()
  //  {
  //    try {
  //      //console.log("comming in open manager");
  //      this._dialog.open(RetentionPolicyFileExplorerComponent, { width: '73%', height: '80%' });
  //      this._accessFilePar.$dialog = this._dialog;

  //    } catch (error) {
  //      console.error("error in getting data",error);

  //    }
  //  }

  saveData() {
    try {

      this.checkUpperLimit();
      if (this.tabIndex == 0) {
      }
      else if (this.tabIndex == 1) {
        let check = this.validateAllFields();
        if (!check) {
          return;
        }
        let json = this.createJson();
        console.log("final json ---->>>>", json);
      }
    } catch (error) {
      console.error("eror in saveData ------->>>", error);
    }
  }

  tabChange(event) {
    try {
      this.tabIndex = event.index;
    } catch (error) {
      console.error("error in tabChange ----->>>>>", error);
    }
  }

  validateAllFields() {
    try {

      if (this.ndeForDropDown[0] == "" || this.ndeForDropDown[0] == null || this.ndeForDropDown[0] == undefined) {
        //this.showErrorMsg("Row data is blank");
        this.showError("Row data is blank");
        return false;

      }
      if (this.ndeForDropDown[1] == "" || this.ndeForDropDown[1] == null || this.ndeForDropDown[1] == undefined) {
        //  this.showErrorMsg("Csv Data is blank");
        this.showError("Csv Data is blank");
        return false;
      }
      if (this.ndeForDropDown[2] == "" || this.ndeForDropDown[2] == null || this.ndeForDropDown[2] == undefined) {
        // this.showErrorMsg("Logs is blank");
        this.showError("Logs is blank");
        return false;
      }
      if (this.ndeForDropDown[3] == "" || this.ndeForDropDown[3] == null || this.ndeForDropDown[3] == undefined) {
        //  this.showErrorMsg("DB is blank");
        this.showError("DB is blank");
        return false;
      }
      if (this.ndeForDropDown[4] == "" || this.ndeForDropDown[4] == null || this.ndeForDropDown[4] == undefined) {
        //  this.showErrorMsg("Graph Data is blank");
        this.showError("Graph Data is blank");
        return false;
      }
      if (this.ndeForDropDown[5] == "" || this.ndeForDropDown[5] == null || this.ndeForDropDown[5] == undefined) {
        //    this.showErrorMsg("Har File is blank");
        this.showError("Har File is blank");
        return false;
      }
      if (this.ndeForDropDown[6] == "" || this.ndeForDropDown[6] == null || this.ndeForDropDown[6] == undefined) {
        //   this.showErrorMsg("Page Dump is blank");
        this.showError("Page Dump is blank");
        return false;
      }
      if (this.ndeForTime[0] == "0" || this.ndeForTime[0] == "" || this.ndeForTime[0] == undefined || this.ndeForTime[0] == null) {
        // this.showErrorMsg("Row data value is blank");
        this.showError("Row data value is blank");
        return false;
      }
      if (this.ndeForTime[1] == "0" || this.ndeForTime[1] == "" || this.ndeForTime[1] == undefined || this.ndeForTime[1] == null) {
        //this.showErrorMsg(" Csv Data value is blank");
        this.showError("Csv Data value is blank");
        return false;
      }
      if (this.ndeForTime[2] == "0" || this.ndeForTime[2] == "" || this.ndeForTime[2] == undefined || this.ndeForTime[2] == null) {
        // this.showErrorMsg("Logs value is blank");
        this.showError("Logs value is blank");
        return false;
      }
      if (this.ndeForTime[3] == "0" || this.ndeForTime[3] == "" || this.ndeForTime[3] == undefined || this.ndeForTime[3] == null) {
        // this.showErrorMsg("DB value is blank");
        this.showError("DB value is blank");
        return false;
      }
      if (this.ndeForTime[4] == "0" || this.ndeForTime[4] == "" || this.ndeForTime[4] == undefined || this.ndeForTime[4] == null) {
        //this.showErrorMsg("Graph Data value is blank");
        this.showError("Graph Data value is blank");
        return false;
      }
      if (this.ndeForTime[5] == "0" || this.ndeForTime[5] == "" || this.ndeForTime[5] == undefined || this.ndeForTime[5] == null) {
        //   this.showErrorMsg("Har File value is blank");
        this.showError("Har File value is blank");
        return false;
      }
      if (this.ndeForTime[6] == "0" || this.ndeForTime[6] == "" || this.ndeForTime[6] == undefined || this.ndeForTime[6] == null) {
        // this.showErrorMsg("Page Dump value is blank");
        this.showError("Page Dump value is blank");
        return false;
      }
      return true;
    } catch (error) {
      console.error("error in  validateAllFields -------->>>>", error);
    }
  }

  showErrorMsg(message) {
    message = message.replace(/\\n/g, "\n");
    this.msgs = [{ severity: 'error', summary: 'Error', detail: message }];
  }

  createJson() {
    try {
      let json = {
        "raw_data_time": this.ndeForTime[0],
        "csv_time": this.ndeForTime[1],
        "logs_time": this.ndeForTime[2],
        "db_time": this.ndeForTime[3],
        "Graph_Data_time": this.ndeForTime[4],
        "Har_File_time": this.ndeForTime[5],
        "Page_Dump_time": this.ndeForTime[6],
      }
      return json;
    } catch (error) {
      console.error("error in createJson ------>>>>", error);
    }
  }

  addPathwithBroadCaster() {
    try {
      this.sub3 = this._retentionPolicyCommonService.getDataObserverForRetention$.subscribe(
        result => {
          this.text1 = result;
          this.openFileExplorerDialog = false;
        },
        error => {
          this.sub3.unsubscribe();
          console.error('error in gettng a result', error);
        },
        () => {
          this.sub3.unsubscribe();
        }
      )
    }
    catch (error) {
      console.error(error);
    };
  }

  ndeConfigurationData() {
    try {
      let arr = [];
      let arr2 = [];
      let arr3 = [];
      let arr4 = [];
      let arr5 = [];
      this.enableRetentionPolicy = this.enableDisableRetentionPolicy;
      for (let i = 0; i < this.columns.length; i++) {

        arr.push(this.columns[i].header);
        if (this.ndeForTime[i] == null || this.ndeForTime[i] == undefined || this.ndeForTime[i] == '') {
          this.ndeForTime[i] = this.ndeDateArr[i];
          this.ndeForDropDown[i] = this.ndeMonthArr[i];
        }
        arr2.push(this.ndeForTime[i] + this.ndeForDropDown[i]);
      }
      arr.push('db', 'logs');
      arr2.push(this.ndeForTime[3] + this.ndeForDropDown[3], this.ndeForTime[11] + this.ndeForDropDown[11]);
      this.logLevel = this.loglevel;

      this.logFileSize = String(this.logFilesize);
      this.cleanupDetailsName = arr.join("|");

      this.cleanupDetailsTime = arr2.join("|");
      this.testRun = this.chipsForTestRun.join("|");
      if (this.enableDisableRecycleBin == false) {
        this.recycleBinTime = "0d";
      }
      else {
        this.recycleBinTime = this.recyclebinTime;
      }
      this.negativeDays = this.chipsForNegativeDate.join("|");

      if (this.text1 != undefined || this.text1 != null) {
        this.globalColumns = this.text1;
      }
      else {
        this.customCleanUpPath = "";
      }
      for (let i = 0; i < this.ComponentData.length; i++) {

        arr3.push(this.ComponentData[i]['dates']);
        arr4.push(this.ComponentData[i]['componentName']);
        if (this.ComponentData[i]['componentName'] == 'access_log') {
          arr3.push(this.ComponentData[i]['dates']);
          arr4.push('logs');
        }
        if (this.ComponentData[i]['componentName'] == 'na_traces') {
          arr3.push(this.ComponentData[i]['dates']);
          arr4.push('db')
        }

      }

      for (let i = 0; i < this.cleanPath.length; i++) {
        arr5.push(this.cleanPath[i]['path']);
        this.pathString = arr5.join('|');

      }
      // this.pathVal = this.dateArray.join('|');
      this.pathVal = this.timearrForJson.join('|');
      this.dateName = arr3.join("|");
      this.compName = arr4.join("|");
      //  this.controller = sessionStorage.getItem('workPath').split('/')[2];
      this.controller = this.sessionService.preSession.controllerName;
      if (this.loglevel == '' || this.loglevel == undefined) {
        this.loglevel = "1";
      }
      if (this.logFilesize == '0' || this.logFilesize == undefined) {
        this.logFileSize = "10"
      }
      if (this.auditLogFile == '0' || this.auditLogFile == undefined) {
        this.auditLogFile = "10"
      }
      if (this.recyclebinTime == 'Select Time' || this.recyclebinTime == undefined) {
        this.recycleBinTime = "0d";
      }
      this.configuration = {
        "enableRetentionPolicy": this.enableDisableRetentionPolicy,
        "logLevel": this.loglevel,
        "logFileSize": this.logFileSize,
        "retentionMode": this.retentionMode,
        "cleanupDetailsName": this.cleanupDetailsName,
        "cleanupDetailsTime": this.cleanupDetailsTime,
        "backupPath": this.backupPath,
        "controller": this.controller,
        "recycleBinTime": this.recycleBinTime,
        "negativeDays": this.negativeDays,
        "cleanupNegativeDaysName": this.compName,
        "cleanupNegativeDaysTime": this.dateName,
        "customCleanUpPath": this.pathString,
        "customCleanUpVal": this.pathVal,
        "auditLogFileSize": this.auditLogFile,
      }
    }
    catch (error) {
      console.error("Error in printing configuration data", error);
    }
  }

  showSuccess(msg) {
    this.messageService.add({ severity: 'success', summary: 'Success Message', detail: msg });
  }

  showError(msg) {
    this.messageService.add({ severity: 'error', summary: 'Error Message', detail: msg });
  }

  showWarn(msg) {
    this.messageService.add({ severity: 'warn', summary: 'Warn', detail: msg });
  }

  pathBind(path: String) {
    this.fileAndFolderPath = path + "";

    if (!path)
      this.showError("Please select a file, not a folder.");

    this.text1 = path;
  }
}
