import { Component, OnInit, EventEmitter, Output, ChangeDetectorRef } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng';
import { MonitorupdownstatusService } from '../../../service/monitorupdownstatus.service';
import { CloudMonitorData } from '../containers/cloud-monitor-data';
import * as CLOUD_MON from '../../../../monitor-up-down-status/constants/mon-rest-api-constants';
import { NewRelicConfigDTO } from '../containers/newRelicConfigDTO';
import { TableData } from '../containers/table-data';
import { cloudMonitorService } from '../services/cloud-monitors-service';
import { ImmutableArray } from '../../../../generic-gdf/services/immutable-array';
import { Location } from '@angular/common';


@Component({
  selector: 'app-cav-mon-newrelic',
  templateUrl: './cav-mon-newrelic.component.html',
  styleUrls: ['./cav-mon-newrelic.component.scss']
})
export class CavMonNewrelicComponent implements OnInit {

  /* This flag is used to make dialog for show hidden monitors visible */
  displayDialog: boolean = true;

  cloudMonitorData: CloudMonitorData[] = [];
  newRelicConfigDTO: NewRelicConfigDTO[] = [];
  formData: NewRelicConfigDTO;
  isFromEdit: boolean = false;
  akey: string = "";    //old api key on update
  qkey: string = "";    //old api key on update
  runTimeMode: number;
  modeStatus: boolean = false;
  userRole: string;   // used to restrict guest user
  profileName: string;
  /*This is used to hold the test run number*/
 // _dialogFileRef: MatDialogRef<CavMonStatsComponent>;
  excludeMon: any;    //for exclude namespace
  tempAccNameArr = [];    //this arryay is used for unique account name
  selectAccKey: string;

  isShowFilter: boolean;
  @Output()
  showFilterEvent = new EventEmitter<boolean>();
  productType: string = "";    //added for handeling serverName entry in the basis of product type
  serverName: string = "";
  cols:any[];
  gMonId: string = "-1";
  oID: string = "-1";
  operation: string = "add";  //check if it add/update mode
  rejectVisible: boolean = true;
  acceptLable: string = "Yes";
  loading: boolean = false;
  gdfDetail: {};
  display: boolean;

  constructor(private cloudMonitors:cloudMonitorService, private monitorupdownService: MonitorupdownstatusService,private _location: Location,
    private messageService: MessageService, private cd: ChangeDetectorRef, private confirmationService: ConfirmationService) { }

  ngOnInit() {
    this.productType = this.cloudMonitors.getProductType();
   // this.userRole = this.dataService.userRole;    // used to restrict guest user
   // this.profileName = this.monConfigurationService.getProfileName();
    // if (this.dataService.monModeStatus() != undefined)
    //   this.modeStatus = this.dataService.monModeStatus();
    // else {
    //   if (this.dataService.getMonMode() == MODE.VIEW_MODE || this.dataService.getMonMode() == MODE.TEST_RUN_MODE)
    //     this.modeStatus = true;
    // }

    this.formData = new NewRelicConfigDTO();

    this.cloudMonitors.getNewRelicProfile().subscribe(data => {
      let that = this;
      this.newRelicConfigDTO = data;
      this.newRelicConfigDTO.map(function (each) {
        that.validateAccount(each.aNKey);
      })
    })

    this.cloudMonitors.getCloudMonitor(CLOUD_MON.CLOUD_NEW_RELIC).subscribe(data => {
      if (data != null){
        this.cloudMonitorData = data.data;
        this.gMonId = data.gMonId;
        this.oID = data.id;
      }
    });

    this.cols = [
      {field:'aNKey', header:'Account Name'},
      {field:'accId', header:'Account ID'}

    ]
  }

  addData() {
    if (this.validateAccount(this.formData.aNKey)) {
      alert("Duplicate Account Name");
      return false;
    }

    if (!this.isFromEdit) {
      this.akey = '';
      this.qkey = '';
      /**If already an entry exists in the table then we need to assign id according to the id for the last entry in the table*/
      if (this.newRelicConfigDTO.length != 0) {
        let lastRowId = this.newRelicConfigDTO[this.newRelicConfigDTO.length - 1];
        this.formData.id = lastRowId.id + 1;
      }
      else
        this.formData.id = 0; // id for the first row entry in the table 

      //to insert new row in table ImmutableArray.push() is created as primeng 4.0.0 does not support above line 
      this.newRelicConfigDTO = ImmutableArray.push(this.newRelicConfigDTO, this.formData);
    }
    else {
      this.newRelicConfigDTO = ImmutableArray.replace(this.newRelicConfigDTO, this.formData, this.getSelectedRowIndex(this.formData["id"]))
      this.isFromEdit = false; // to change the form button from UPDATE -> ADD when update is already done.
     // this.messageService.successMessage("Configuration for " + "New Relic Monitor" + " has been updated successfully");
    }
    this.loading = true;
    this.cloudMonitors.saveNewRelicProfile('0', this.akey, this.qkey, this.formData)
      .subscribe(res => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'New Relic Account' + " Added Successfully" });
        this.loading = false;
        this.cd.detectChanges();
      });
    this.clearFormFields();
  }

  /*This method is used to delete selected rows*/
  deleteSpecificConfig(rowData) {
    const me = this;
    me.rejectVisible = true;
    me.acceptLable = "Yes";
    this.confirmationService.confirm({
      message: "Are you sure to delete the selected configuration(s)?",
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.loading = true;
        this.cloudMonitors.saveNewRelicProfile('1', '', '', rowData)
          .subscribe(res => {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'New Relic Account' + " Deleted Successfully" });
            this.loading = false;
            this.cd.detectChanges();
          });
        let arrId = [];
        let selectedAccount = [];
        arrId.push(rowData.id) // push selected row's id 
        selectedAccount.push(rowData.aNKey);

        this.newRelicConfigDTO = this.newRelicConfigDTO.filter(function (val) {
          return arrId.indexOf(val.id) == -1;  //value to be deleted should return false
        })
        this.tempAccNameArr = this.tempAccNameArr.filter(function (val) {
          return selectedAccount.indexOf(val) == -1;  //deleting selected key from tempAccNameArr
        })
        this.clearFormFields();
      },
      reject: () => {
      }
    });
  }

  /**This method returns selected row on the basis of Id */
  getSelectedRowIndex(data): number {
    let index = this.newRelicConfigDTO.findIndex(each => each["id"] == data)
    return index;
  }

  clearFormFields() {
    this.isFromEdit = false;
    this.excludeMon = '';
    this.selectAccKey = '';
    this.formData = new NewRelicConfigDTO();
  }

  editData(rowData) {
    this.isFromEdit = true;
    this.formData = new NewRelicConfigDTO();
    this.formData = Object.assign({}, rowData);
    this.akey = this.formData.apiKey;
    this.qkey = this.formData.queryApi;
    this.selectAccKey = this.formData.aNKey;

  }

  // dialogCloseEvent($evt?: any) {
  //   if (this.dialogRef) {
  //     this.dialogRef.close();
  //   }
  // }

  closeConfiguration() {
    this.formData = new NewRelicConfigDTO(); // for clearing form fields.
    this.isFromEdit = false;
  }

  advanceSettings(rowData) {
    let gdfList = '';
    for(let i=0;i<rowData.gdfInfos.length;i++){
      if(gdfList){
      gdfList = gdfList + "," + rowData['gdfInfos'][i]['gdfName']
      }
      else{
        gdfList = rowData['gdfInfos'][i]['gdfName']
      }
    }
    this.gdfDetail = {
      "dispMonName":rowData['monName'],
      "gdfName":gdfList   
    }
    this.display = true;
  }
  
  onDialogClose(event) {
    this.display = event;
 }

  //saving monitor json
  saveData() {
    let reqBody =
    {
      "isUseGlobal": false,
      "params": {},
      "mon": {}
    }

    this.cloudMonitorData.map(function (each) {
      // for (let i = 0; i < each['acMonList'].length; i++) {
        each['acMonList'].map(monName=>{
          let obj = {
            "options": "",
            "depOptions": "",
            "type": "std",
            "enabled": each['enabled'],
          };
          reqBody['mon'][monName] = obj;
        })
      // }
    })
    let tierServerInfo = [{
      "tier": "Cavisson",
      "server": "NDAppliance"
    }];

    if(this.gMonId != "-1"){
      this.operation = "update";
    }

    let finalReqBody: any = {
      "techName": CLOUD_MON.CLOUD_NEW_RELIC,
      "appName": "default",
      "opr": this.operation,
      "gMonId": this.gMonId,
      "tierInfo": tierServerInfo,
      "body": reqBody
    };
    console.log("this is my final object------->",finalReqBody);

    this.loading = true;
    this.monitorupdownService.saveMonitorConfiguration(finalReqBody, CLOUD_MON.CLOUD_NEW_RELIC, this.oID).subscribe(res => {
      if (res['status']) {
        if (this.gMonId == "-1") {
          window.location.reload();
        }
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'New Relic' + " Added Successfully" });
        this.loading = false;
        this.cd.detectChanges();
      }
    });
  }

  // addUpdateCheckBoxStateArr(enabled, key) {
  //   let isEntryExist: boolean = false;

  //   for (let i = 0; i < this.monConfigurationService.checkBoxStateArr.length; i++) {
  //     if (Object.keys(this.monConfigurationService.checkBoxStateArr[i])[0] == key) {
  //       isEntryExist = true;
  //       this.monConfigurationService.checkBoxStateArr[i][key] = enabled;
  //       this.monConfigurationService.checkBoxStateArr[i]['colorMode'] = 4;
  //       break;
  //     }
  //   }

  //   if (!isEntryExist) {
  //     let obj = { [key]: enabled, 'colorMode': 4 }
  //     this.monConfigurationService.checkBoxStateArr.push(obj)
  //   }
  // }

  // when user changes the checkbox true/false
  onCheckBoxChange(rowData) {
    for (let i = 0; i < rowData['acMonList'].length; i++) {
      let key = rowData['acMonList'][i] + ":" + "Cavisson";
      let tableData: TableData[] = [];
      if (rowData['enabled']) {
        let tableDataObj: TableData;
        tableDataObj = new TableData();
        tableDataObj.appName = "default";
        tableDataObj.options = "";
        tableDataObj.serverName = this.serverName;
        tableDataObj.id = 0;
        tableDataObj.arguments = "";
        tableData.push(tableDataObj);
      }
      else {
        // if (this.monConfigurationService.saveMonitorData == null || this.monConfigurationService.saveMonitorData['Cavisson'] == null)
        //   this.monConfigurationService.saveMonitorData['Cavisson'] = {};
        let monName = rowData['acMonList'][i];
        // this.monConfigurationService.saveMonitorData['Cavisson'][monName] = [
        //   { 'appName': "default", 'enable': true, 'groupId': -1, 'id': 0, 'serverName': this.serverName }
        // ];
      }
      let obj = { "tier": 'Cavisson', "data": tableData, "monName": rowData['acMonList'][i] }
      // this.monConfigurationService.saveConfiguredData(obj);
      // this.addUpdateCheckBoxStateArr(rowData['enabled'], key)
    }
  }

  validateAccount(accName) {
    if (this.selectAccKey == accName)
      return false;

    //let keyFound = _.find(this.tempAccNameArr, function (each) { return each == accName })

    /** Check whether account name already exist or not in the tempAccNameArr
      * if found then return else add the key to the tempAccNameArr
      */
    // if (keyFound)
    //   return true;
    // else {
    //   this.tempAccNameArr.push(accName);
    //   return false
    // }
  }

  showFilter() {
    this.isShowFilter = !this.isShowFilter;
    this.showFilterEvent.emit(this.isShowFilter);
  }

  testApi(data) {
    // this.monConfigurationService.testAPI(data).subscribe(res => {
    //   if(res['status']){
    //     this.messageService.successMessage(res['msg']);
    //   }
    //   else{
    //     this.messageService.errorMessage(res['msg']);
    //   }
    // })
  }
  navToPreviousPage(){
    if (this.monitorupdownService.routeFlag) {
      this.monitorupdownService.flag = true;
    }
    this._location.back();
  }
}
