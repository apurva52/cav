import { Component, OnInit, EventEmitter, Output, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';

import * as CLOUD_MON from '../../../../monitor-up-down-status/constants/mon-rest-api-constants';
import { ConfirmationService, MessageService, SelectItem } from 'primeng';

import { ImmutableArray } from '../../../../generic-gdf/services/immutable-array';
import * as _ from "lodash";
import { CloudMonitorData } from '../containers/cloud-monitor-data';
import { AzureConfigDTO } from '../containers/azure-config-data';
import { cloudMonitorService } from '../services/cloud-monitors-service';
import { TableData } from '../containers/table-data';
import { MonitorupdownstatusService } from '../../../service/monitorupdownstatus.service';
import { Location } from '@angular/common';


@Component({
  selector: 'app-cav-mon-azure',
  templateUrl: './cav-mon-azure.component.html',
  styleUrls: ['./cav-mon-azure.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationService],
})




export class CavMonAzureComponent implements OnInit {

  /* This flag is used to make dialog for show hidden monitors visible */
  displayDialog: boolean = true;
  oldKeyName: string;    //for sending old Access key on update
  cloudMonitorData: CloudMonitorData[] = [];
  azureConfigDTO: AzureConfigDTO[] = [];
  formData: AzureConfigDTO;
  isFromEdit: boolean = false;
  sKey: string;    //old secret key on update
  runTimeMode: number;
  modeStatus: boolean = false;
  userRole: string;   // used to restrict guest user
  profileName: string;
  /*This is used to hold the test run number*/
  // _dialogFileRef: MatDialogRef<CavMonStatsComponent>;
  excludeMon: any;    //for exclude namespace
  monNameList: any[] = []; //list for exclude monName dropdown
  tempAccNameArr = [];    //this arryay is used for unique account name
  selectAccKey: string;

  isShowFilter: boolean;
  @Output()
  showFilterEvent = new EventEmitter<boolean>();
  productType: string = "";    //added for handeling serverName entry in the basis of product type
  serverName: string = "";
  cols: any[];
  gMonId: string = "-1";
  oID: string = "-1";
  operation: string = "add";  //check if it add/update mode
  rejectVisible: boolean = true;
  acceptLable: string = "Yes";
  loading = false;
  gdfDetail: {  };
  display: boolean;

  constructor(
    private cloudMonitors: cloudMonitorService, private monitorupdownService: MonitorupdownstatusService,
    private messageService: MessageService, private cd: ChangeDetectorRef, private _location: Location,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit() {
    //this.productType = this.cloudMonitors.getProductType();
    // this.userRole = this.dataService.userRole;    // used to restrict guest user
    //this.profileName = this.monConfigurationService.getProfileName();
    // if(this.dataService.monModeStatus() != undefined)
    // this.modeStatus = this.dataService.monModeStatus();
    // else
    // {
    // if(this.dataService.getMonMode() == MODE.VIEW_MODE || this.dataService.getMonMode()  == MODE.TEST_RUN_MODE)
    //   this.modeStatus = true;
    // }  

    this.formData = new AzureConfigDTO();

    this.cloudMonitors.getAzureProfile().subscribe(data => {
      let that = this;
      this.azureConfigDTO = data;
      this.azureConfigDTO.map(function (each) {
        that.validateAccount(each.aNKey);
      })
    })

    this.cloudMonitors.getCloudMonitor(CLOUD_MON.CLOUD_AZURE).subscribe(data => {
      if (data != null) {
        let value = [];
        this.cloudMonitorData = data.data;
        this.gMonId = data.gMonId;
        this.oID = data.id;
        for (let i = 0; i < this.cloudMonitorData.length; i++) {
          this.monNameList.push({ label: this.cloudMonitorData[i].monName, value: this.cloudMonitorData[i].monName })
        }
        // this.monNameList = UtilityService.createListWithKeyValue(value, value);
      }
    });

    // if (this.dataService.getMonMode() == MODE.RUNTIME_MODE)
    // {
    //   this.runTimeMode = MODE.RUNTIME_MODE;
    //  }
    //  else if(this.dataService.getMonMode() == MODE.VIEW_MODE || this.dataService.getMonMode() == MODE.TEST_RUN_MODE)
    //  {
    //   this.runTimeMode = MODE.TEST_RUN_MODE;
    //  }
    //  else if(this.dataService.getMonMode() == MODE.EDIT_MODE)
    //  {
    //   this.runTimeMode = MODE.EDIT_MODE;
    //  }

    //  if(this.productType == COMPONENT.PRODUCTMODE_ND)
    //   this.serverName = COMPONENT.SERVERNAME_ND;
    //  else
    //   this.serverName = COMPONENT.SERVERNAME_NS;
    this.cols = [
      { field: 'aNKey', header: 'Account Name' },
      { field: 'cId', header: 'Client ID' },
      { field: 'tId', header: 'Tenant ID' }
    ]
  }

  addData() {
    if(this.validateAccount(this.formData.aNKey))
    {
      alert("Duplicate Account Name");
      return false;
    }

    if (this.excludeMon != undefined) {
      let str = '';
      for (var i = 0; i < this.excludeMon.length; i++) {
        if (str != '')
          str = str + "," + this.excludeMon[i];
        else
          str = this.excludeMon[i];
      }
      this.formData.exNameSpace = str;
    }

    if (!this.isFromEdit) {
      this.sKey = '';
      /**If already an entry exists in the table then we need to assign id according to the id for the last entry in the table*/
      if (this.azureConfigDTO.length != 0) {
        let lastRowId = this.azureConfigDTO[this.azureConfigDTO.length - 1];
        this.formData.id = lastRowId.id + 1;
      }
      else
        this.formData.id = 0; // id for the first row entry in the table 

      //to insert new row in table ImmutableArray.push() is created as primeng 4.0.0 does not support above line 
      this.azureConfigDTO = ImmutableArray.push(this.azureConfigDTO, this.formData);
    }
    else {
      this.azureConfigDTO = ImmutableArray.replace(this.azureConfigDTO, this.formData, this.getSelectedRowIndex(this.formData["id"]))
      this.isFromEdit = false; // to change the form button from UPDATE -> ADD when update is already done.
      //this.messageService.successMessage("Configuration for " + "Azure Monitor" + " has been updated successfully");
    }
    this.loading = true;
    this.cloudMonitors.saveAzureProfile('0', this.sKey, this.formData)
      .subscribe(res => {
        this.messageService.add({severity:'success', summary: 'Success', detail: 'Account' +" Added Successfully"});
        this.loading = false;
        this.cd.detectChanges();
      });
    this.clearFormFields();
  }

  /*This method is used to delete selected rows*/
  deleteSpecificConfig(rowData) 
  {
    const me = this;
    me.rejectVisible = true;
    me.acceptLable = "Yes";
    this.confirmationService.confirm({
      message: "Are you sure to delete the selected configuration(s)?",
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.loading = true;
        this.cloudMonitors.saveAzureProfile("1", "", rowData)
        .subscribe(res => {
          this.messageService.add({severity:'success', summary: 'Success', detail: 'Azure Account' +" Deleted Successfully"});
          this.loading = false;
          this.cd.detectChanges();
          // this.awsMonData = data;
        });
        let arrId = [];
        arrId.push(rowData.id) // push selected row's id 
        this.azureConfigDTO = this.azureConfigDTO.filter(function(val)
        {
          return arrId.indexOf(val.id) == -1;  //value to be deleted should return false
        })
        this.clearFormFields();
      },
      reject: () => {
      }
    });
  }

  /**This method returns selected row on the basis of Id */
  getSelectedRowIndex(data): number {
    let index = this.azureConfigDTO.findIndex(each => each["id"] == data)
    return index;
  }

  clearFormFields() {
    this.isFromEdit = false;
    this.excludeMon = '';
    this.selectAccKey = '';
    this.formData = new AzureConfigDTO();
  }

  editData(rowData) {
    this.isFromEdit = true;
    this.formData = new AzureConfigDTO();
    this.formData = Object.assign({}, rowData);
    if (this.formData.exNameSpace != undefined && this.formData.exNameSpace != "")
      this.excludeMon = this.formData.exNameSpace.split(",");
    this.sKey = this.formData.cS;
    this.selectAccKey = this.formData.aNKey;

  }

  // dialogCloseEvent($evt?: any) {
  //   if (this.dialogRef) {
  //     this.dialogRef.close();
  //   }
  // }

  closeConfiguration() {
    this.formData = new AzureConfigDTO(); // for clearing form fields.
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
      each['acMonList'].map(monName => {
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
      "techName": CLOUD_MON.CLOUD_AZURE,
      "appName": "default",
      "opr": this.operation,
      "gMonId": this.gMonId,
      "tierInfo": tierServerInfo,
      "body": reqBody
    };

    this.loading = true;
    this.monitorupdownService.saveMonitorConfiguration(finalReqBody, CLOUD_MON.CLOUD_AZURE, this.oID).subscribe(res => {
      if (res['status']) {
        if (this.gMonId == "-1") {
          window.location.reload();
        }
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Azure' + " Added Successfully" });
        this.loading = false;
        this.cd.detectChanges();
      }
    });
  }

  addUpdateCheckBoxStateArr(enabled, key) {
    let isEntryExist: boolean = false;

    // for (let i = 0; i < this.monConfigurationService.checkBoxStateArr.length; i++) {
    //   if (Object.keys(this.monConfigurationService.checkBoxStateArr[i])[0] == key) {
    //     isEntryExist = true;
    //     this.monConfigurationService.checkBoxStateArr[i][key] = enabled;
    //     this.monConfigurationService.checkBoxStateArr[i]['colorMode'] = 4;
    //     break;
    //   }
    // }

    // if (!isEntryExist) {
    //   let obj = { [key]: enabled, 'colorMode': 4 }
    //   this.monConfigurationService.checkBoxStateArr.push(obj)
    // }
  }

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
        // if(this.monConfigurationService.saveMonitorData == null || this.monConfigurationService.saveMonitorData['Cavisson'] == null)
        //   this.monConfigurationService.saveMonitorData['Cavisson']= {};
        // let monName = rowData['acMonList'][i];
        // this.monConfigurationService.saveMonitorData['Cavisson'][monName]= [
        // {'appName': "default",'enable': true,'groupId': -1,'id': 0,'serverName': this.serverName}
        // ];
      }
      let obj = { "tier": 'Cavisson', "data": tableData, "monName": rowData['acMonList'][i] }
      // this.monConfigurationService.saveConfiguredData(obj);    
      this.addUpdateCheckBoxStateArr(rowData['enabled'], key)
    }
  }

  validateAccount(accName) {
    if (this.selectAccKey == accName)
      return false;

    let keyFound = _.find(this.tempAccNameArr, function (each) { return each == accName })

    /** Check whether account name already exist or not in the tempAccNameArr
      * if found then return else add the key to the tempAccNameArr
      */
    if (keyFound)
      return true;
    else {
      this.tempAccNameArr.push(accName);
      return false
    }
  }

  showFilter() {
    this.isShowFilter = !this.isShowFilter;
    this.showFilterEvent.emit(this.isShowFilter);
  }
  navToPreviousPage(){
    if (this.monitorupdownService.routeFlag) {
      this.monitorupdownService.flag = true;
    }
    this._location.back();
  }
}
