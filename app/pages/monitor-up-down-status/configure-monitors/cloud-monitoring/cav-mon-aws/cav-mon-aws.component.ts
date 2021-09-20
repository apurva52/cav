import { Component, OnInit, EventEmitter, Output, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { ConfirmationService, MessageService, SelectItem } from 'primeng';
import * as CLOUD_MON from '../../../../monitor-up-down-status/constants/mon-rest-api-constants';
import { Router } from '@angular/router';


import { ImmutableArray } from '../../../../generic-gdf/services/immutable-array';
import * as _ from "lodash";
import { CloudMonitorData } from '../containers/cloud-monitor-data';
import { AWSConfigDTO } from '../containers/aws-config-data';
import { cloudMonitorService } from '../services/cloud-monitors-service';
import { TableData } from '../containers/table-data';
import { MonitorupdownstatusService } from '../../../service/monitorupdownstatus.service';
import { UtilityService } from '../../../service/utility.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-cav-mon-aws',
  templateUrl: './cav-mon-aws.component.html',
  styleUrls: ['./cav-mon-aws.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationService]

})
export class CavMonAwsComponent implements OnInit {

  //cloudMonitorData:CloudMonitorData[] = [];
  cloudMonitorData: any = {}
  regionList: any[] = []; //list for region dropdown
  displayDialog: boolean = true;
  awsMonData: AWSConfigDTO[] = [];
  formData: AWSConfigDTO;
  isFromEdit: boolean = false;
  modeStatus: boolean = false;
  userRole: string;   // used to restrict guest user
  runTimeMode: number;
  profileName: string;
  /*This is used to hold the test run number*/
  headerForKey: string = "AWS Access Key";

  region: any;
  oldKeyName: string;    //for sending old Access key on update
  count: number = 0;   //  applying RTC on first add and last delete
  index: number = 0;   // for Access Key header change
  excludeMon: any;    //for exclude namespace
  monNameList: any[] = []; //list for exclude monName dropdown
  selectAccKey: string;
  tempAccNameArr = [];    //this arryay is used for unique account name

  isShowFilter: boolean;
  @Output()
  showFilterEvent = new EventEmitter<boolean>();
  productType: string = "";    //added for handeling serverName entry in the basis of product type
  serverName: string = "";
  cols: any[];
  // loading: boolean = false;
  gMonId: string = "-1";
  oID: string = "-1";
  operation: string = "add";  //check if it add/update mode
  rejectVisible: boolean = true;
  acceptLable: string = "Yes";
  loading:boolean = false;
  display: boolean;
  gdfDetail: {  };

  constructor(private router: Router, private confirmationService: ConfirmationService,
    private cloudMonitors: cloudMonitorService, private monitorupdownService: MonitorupdownstatusService,private _location: Location,
    private messageService: MessageService, private cd: ChangeDetectorRef) { }

  ngOnInit() {
    //this.productType = this.cloudMonitors.getProductType();
    this.formData = new AWSConfigDTO();
    this.cloudMonitors.getAWSRegions()
      .subscribe(data => {
        if (data != null) {
          this.regionList = UtilityService.createListWithKeyValue(Object.keys(data), Object.keys(data));
          this.regionList.sort((a, b) => a.label.localeCompare(b.label));
        }
      })

    this.cloudMonitors.getAWSProfile().subscribe(data => {
      let that = this;
      this.awsMonData = data;
      console.log("aws data--------------------------------->",this.awsMonData)
      this.awsMonData.map(function (each) {
        that.validateAccount(each.aNKey);
        if (each.pPort == -1) {
          each.pPort = null;
        }
      })
    })

    this.cloudMonitors.getCloudMonitor(CLOUD_MON.CLOUD_AWS).subscribe(data => {
      if (data != null) {
        let value = [];
        this.cloudMonitorData = data.data;
        this.gMonId = data.gMonId;
        this.oID = data.id;
        for (let i = 0; i < this.cloudMonitorData.length; i++) {
          this.monNameList.push({ label: this.cloudMonitorData[i].monName, value: this.cloudMonitorData[i].monName })
          // value[i] = this.cloudMonitorData.data[i]['monName'];
        }
        //this.monNameList = UtilityService.createListWithKeyValue(value, value);
      }

    });

    //this.userRole = this.dataService.userRole;    // used to restrict guest user
    //this.profileName = this.monConfigurationService.getProfileName();
    // if(this.dataService.monModeStatus() != undefined)
    // this.modeStatus = this.dataService.monModeStatus();
    // else
    // {
    // if(this.dataService.getMonMode() == MODE.VIEW_MODE || this.dataService.getMonMode()  == MODE.TEST_RUN_MODE)
    //   this.modeStatus = true;
    // }  

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
    //    this.serverName = COMPONENT.SERVERNAME_ND;
    //  else
    //    this.serverName = COMPONENT.SERVERNAME_NS;

    this.cols = [
      { field: 'aNKey', header: 'AWS Account Name'},
      { field: 'aKey', header: this.headerForKey },
      { field: 'region', header: 'AWS Region(s)' }
    ]

  }

  // dialogCloseEvent($evt?: any) {
  //   if (this.dialogRef) {
  //     this.dialogRef.close();
  //   }
  // }

  addData() {

    if(this.validateAccount(this.formData.aNKey))
    {
      alert("Duplicate Account Name");
      return false;
    }

    if (this.region != undefined) {
      let str = '';
      for (var i = 0; i < this.region.length; i++) {
        if (str != '')
          str = str + "," + this.region[i];
        else
          str = this.region[i];
      }
      this.formData.region = str;
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

    if (this.index == 0) {
      this.formData.dRole = "";
      this.formData.dAccID = "";
    }
    else {
      this.formData.aKey = "";
      this.formData.sKey = "";
    }

    if (this.formData.pPort == null || this.formData.pPort <= 0) {
      this.formData.pPort = null;
    }

    if (!this.isFromEdit)    //add mode
    {
      this.oldKeyName = '';
      /**If already an entry exists in the table then we need to assign id according to the id for the last entry in the table*/
      if (this.awsMonData.length != 0) {
        let lastRowId = this.awsMonData[this.awsMonData.length - 1];
        this.formData.id = lastRowId.id + 1;
      }
      else
        this.formData.id = 0; // id for the first row entry in the table 

      //to insert new row in table
      this.awsMonData = ImmutableArray.push(this.awsMonData, this.formData);
    }
    else {   //edit mode
      this.awsMonData = ImmutableArray.replace(this.awsMonData, this.formData, this.getSelectedRowIndex(this.formData["id"]))
      this.isFromEdit = false; // to change the form button from UPDATE -> ADD when update is already done.
      // this.messageService.successMessage("Configuration for " + "AWS Monitor" + " has been updated successfully");
    }
    this.loading = true;
    this.cloudMonitors.saveAWSProfile(this.formData.tType, "0", this.oldKeyName, this.formData)
      .subscribe(res => {
        this.messageService.add({severity:'success', summary: 'Success', detail: 'AWS' +" Added Successfully"});
        this.loading = false;
        this.cd.detectChanges();
        // this.awsMonData = data;
      });
    this.clearFormFields();
  }

  editData(rowData) {
    this.isFromEdit = true;
    this.formData = new AWSConfigDTO();
    this.formData = Object.assign({}, rowData);
    if (this.formData.region != undefined && this.formData.region != "")
      this.region = this.formData.region.split(",");
    if (this.formData.exNameSpace != undefined && this.formData.exNameSpace != "")
      this.excludeMon = this.formData.exNameSpace.split(",");
    if (this.formData.dAccID == '')
      this.oldKeyName = this.formData.aKey;
    else
      this.oldKeyName = this.formData.dAccID;
    this.selectAccKey = this.formData.aNKey;
    if (this.formData.pPort <= 0) {
      this.formData.pPort = null;
    }
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
        me.loading = true;
        this.cloudMonitors.saveAWSProfile("", "1", this.oldKeyName, rowData)
        .subscribe(res => {
          this.messageService.add({severity:'success', summary: 'Success', detail: 'AWS' +" Deleted Successfully"});
          // this.awsMonData = data;
          me.loading = false
          me.cd.detectChanges();
        });
        let arrId = [];
        arrId.push(rowData.id) // push selected row's id 
        this.awsMonData = this.awsMonData.filter(function(val)
        {
          return arrId.indexOf(val.id) == -1;  //value to be deleted should return false
        })
        this.clearFormFields();
      },
      reject: () => {
      }
    });
  }

  clearFormFields() {

    this.formData = new AWSConfigDTO();
    this.region = '';
    this.excludeMon = '';
    this.isFromEdit = false;
    this.selectAccKey = '';
  }

  /**This method returns selected row on the basis of Id */
  getSelectedRowIndex(data): number {
    let index = this.awsMonData.findIndex(each => each["id"] == data)
    return index;
  }

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
      "techName": CLOUD_MON.CLOUD_AWS,
      "appName": "default",
      "opr": this.operation,
      "gMonId": this.gMonId,
      "tierInfo": tierServerInfo,
      "body": reqBody
    };

    this.loading = true;
    this.monitorupdownService.saveMonitorConfiguration(finalReqBody, CLOUD_MON.CLOUD_AWS, this.oID).subscribe(res => {
      if(res['status']){
        if(this.gMonId == "-1"){
          window.location.reload();
        }
        this.messageService.add({severity:'success', summary: 'Success', detail: 'AWS' +" Added Successfully"});
        this.loading = false;
        this.cd.detectChanges();
      }
    });
  }

  // when user changes the checkbox true/false
  // onCheckBoxChange(rowData) {
  //   for (let i = 0; i < rowData['acMonList'].length; i++) {

  //     let key = rowData['acMonList'][i] + ":" + "Cavisson";
  //     let tableData: TableData[] = [];
  //     if (rowData['enabled']) {
  //       let tableDataObj: TableData;
  //       tableDataObj = new TableData();
  //       tableDataObj.appName = "default";
  //       tableDataObj.options = "";
  //       tableDataObj.serverName = this.serverName;
  //       tableDataObj.id = 0;
  //       tableDataObj.arguments = "";
  //       tableData.push(tableDataObj);
  //     }
  //     else {
  //       // if(this.monConfigurationService.saveMonitorData == null || this.monConfigurationService.saveMonitorData['Cavisson'] == null)
  //       //     this.monConfigurationService.saveMonitorData['Cavisson']= {};
  //       let monName = rowData['acMonList'][i];
  //       // this.monConfigurationService.saveMonitorData['Cavisson'][monName]= [
  //       //   {'appName': "default",'enable': true,'groupId': -1,'id': 0,'serverName': this.serverName}
  //       // ];
  //     }

  //     let obj = { "tier": 'Cavisson', "data": tableData, "monName": rowData['acMonList'][i] }
  //     //this.monConfigurationService.saveConfiguredData(obj);    

  //     this.addUpdateCheckBoxStateArr(rowData['enabled'], key)
  //   }


  // }

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
  // addUpdateCheckBoxStateArr(enabled, key) {
  //   let isEntryExist: boolean = false;

  //   // for (let i = 0; i < this.monConfigurationService.checkBoxStateArr.length; i++) {
  //   //   if (Object.keys(this.monConfigurationService.checkBoxStateArr[i])[0] == key) {
  //   //     isEntryExist = true;
  //   //     this.monConfigurationService.checkBoxStateArr[i][key] = enabled;
  //   //     this.monConfigurationService.checkBoxStateArr[i]['colorMode'] = 4;
  //   //     break;
  //   //   }
  //   // }

  //   // if (!isEntryExist) {
  //   //   let obj = { [key]: enabled, 'colorMode': 4 }
  //   //   this.monConfigurationService.checkBoxStateArr.push(obj)
  //   // }
  // }

  closeConfiguration() {
    this.formData = new AWSConfigDTO(); // for clearing form fields.
    this.isFromEdit = false;
  }

  handleChange(e) {
    this.index = e.index;
    if (this.index == 0) {
      this.headerForKey = "AWS Access Key";
    }
    else {
      this.headerForKey = "AWS Role Name";
    }

    this.cols = [
      { field: 'aNKey', header: 'AWS Account Name'},
      { field: 'aKey', header: this.headerForKey },
      { field: 'region', header: 'AWS Region(s)' }
    ]
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
