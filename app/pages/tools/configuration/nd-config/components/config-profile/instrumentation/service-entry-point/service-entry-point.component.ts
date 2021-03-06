import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ConfirmationService, SelectItem } from 'primeng/api';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { KeywordList } from '../../../../containers/keyword-data';

import { ConfigKeywordsService } from '../../../../services/config-keywords.service';
import { ConfigUtilityService } from '../../../../services/config-utility.service';

import { ServiceEntryPoint } from '../../../../containers/instrumentation-data';

import { ImmutableArray } from '../../../../utils/immutable-array';

import { descMsg  , addMessage , editMessage} from '../../../../constants/config-constant';

import { deleteMany, ConfigUiUtility, cloneObject} from '../../../../utils/config-utility';

@Component({
  selector: 'app-service-entry-point',
  templateUrl: './service-entry-point.component.html',
  styleUrls: ['./service-entry-point.component.css']
})
export class ServiceEntryPointComponent implements OnInit {

  @Output()
  keywordData = new EventEmitter();

  @Input()
  profileId: number;
  /**It store service entry data */
  serviceEntryData: ServiceEntryPoint[];
  selectedServiceEntryData: ServiceEntryPoint[];

  entryPoints: Object;

  /**It stores table data for showing in GUI */
  serviceEntrypointTableData: ServiceEntryPoint[];

  /**It store service entry data for add*/
  serviceEntryPointDetail: ServiceEntryPoint;
  entryPointType: SelectItem[];
  @Input()
  saveDisable: boolean = false;

  /**These are those keyword which are used in current screen. */
  keywordList = ['NDEntryPointsFile'];

  /**It is used as flag to open or close dialog */
  displayNewService: boolean = false;

  addEditServiceEntryDialog: boolean = false;
  isNewServiceEntryPoint: boolean;

  subscription: Subscription;

  
  javaTypeEntryPointName = ["ATGServlet", "ApacheJsperService", "AsyncHttpService", "EntryForJBOSS", "EntryForWebLogicJSP", "ErrorPageEntry", "Generic", "glassFishJersey", "HessianCallOut", "HttpServletService", "jerseyCall", "jettyEntry", "JsAutoInject", "JMSCall", "kafkac", "kafkaCustom" ,"PlayEntryPoint", "SpringWebFlux", "NETTY", "UNDERTOW"];
  javaTypeEntryPointId = ["11", "3", "15", "8", "2", "9", "6", "5", "10", "1", "4", "19", "14", "7", "17", "18", "13", "20", "21", "16"];
  dotNetTypeEntryPoint = ["HttpServletService", "TXExit"];
  dotNetTypeEntryPointId = ["1", "12"];

  agentType: string = "";
  type: boolean;
  isProfilePerm: boolean;
  checkboxtrue: boolean = true;

  argumentIndexSelecetItem: SelectItem[] = [];

    DATA_TYPE = {
    BOOLEAN: 'Z',
    SHORT: 'S',
    INTEGER: 'I',
    STRING: 'Ljava/lang/String;',
    BYTE: 'B',
    FLOAT: 'F',
    DOUBLE: 'D',
    LONG: 'J',
    CHAR: 'C',
    VOID: 'V'
  };

  DATA_TYPE_ARR = [
    this.DATA_TYPE.BOOLEAN,
    this.DATA_TYPE.SHORT,
    this.DATA_TYPE.INTEGER,
    this.DATA_TYPE.STRING,
    this.DATA_TYPE.BYTE,
    this.DATA_TYPE.FLOAT,
    this.DATA_TYPE.DOUBLE,
    this.DATA_TYPE.LONG,
    this.DATA_TYPE.CHAR,
    this.DATA_TYPE.VOID
  ];

  //To show/hide filters
  isSerEntryPntFilters : boolean = true;
  isEnableColumnFilter : boolean; 

  constructor(private configKeywordsService: ConfigKeywordsService, private configUtilityService: ConfigUtilityService, private confirmationService: ConfirmationService, private store: Store<KeywordList>) {

    this.agentType = sessionStorage.getItem("agentType");
    this.type = this.agentType == "Java" ? true : false;
    this.subscription = this.store.select(store => store["keywordData"]).subscribe(data => {
      var keywordDataVal = {}
      this.keywordList.map(function (key) {
        keywordDataVal[key] = data[key];
      })
      this.entryPoints = cloneObject(keywordDataVal);
    });

  }

    cols = [
    { field: 'checkbox', header: '' },
    { field: 'entryType', header: 'Service Entry Type' },
    { field: 'name', header: 'Service Entry Name' },
	  { field: 'enabled', header: 'Enable Instrumentation' },
	  { field: 'desc', header: 'Description' },
	  { field: 'isCustomEntry', header: 'Category' }
    ];

    cols1 = [
      { field: 'checkbox', header: '' },
      { field: 'entryType', header: 'Type' },
      { field: 'module', header: 'Module' },
      { field: 'name', header: 'Name' },
      { field: 'enabled', header: 'Enabled' },
      { field: 'desc', header: 'Description' },
      { field: 'isCustomEntry', header: 'Category' }
      ];

  ngOnInit() {
    this.isProfilePerm = +sessionStorage.getItem("ProfileAccess") == 4 ? true : false;
    this.loadServiceEntryPoint();

    if (this.profileId == 1 || this.profileId == 777777 || this.profileId == 888888)
      this.saveDisable = true;

    if (this.agentType == "Java")
      this.entryPointType = ConfigUiUtility.createListWithKeyValue(this.javaTypeEntryPointName, this.javaTypeEntryPointId);
    else if (this.agentType == "Dot Net")
      this.entryPointType = ConfigUiUtility.createListWithKeyValue(this.dotNetTypeEntryPoint, this.dotNetTypeEntryPointId);
    else
      this.loadEntryPointTypeList();
  }
  /**It loads service entry data  */
  loadServiceEntryPoint() {
    this.configKeywordsService.getServiceEntryPointList(this.profileId)
      .subscribe(data => {
        this.serviceEntryData = data;
        console.log("SERVICE ENTRY DATA =========> ", this.serviceEntryData);
      });
  }

  /**This method is called when we click on Add button to open dialog  */
  openServiceEntryDialog() {
    this.serviceEntryPointDetail = new ServiceEntryPoint();
    this.isNewServiceEntryPoint = true;
    this.addEditServiceEntryDialog = true;
  }
  /**It adds data in dropdown of Entry type service */
  loadEntryPointTypeList() {
    // EntryPointType contains some values then return. no need to get data from server.
    if (this.entryPointType)
      return;
    this.entryPointType = [];
    let arr = [];
    this.configKeywordsService.getEntryPointTypeList()
      .subscribe(entryPointTypeList => {
        for (let i = 0; i < entryPointTypeList.length; i++) {
          arr.push(entryPointTypeList[i].entryTypeName);
        }
        arr.sort();
        for (let i = 0; i < arr.length; i++) {
          for (let j = 0; j < entryPointTypeList.length; j++) {
            if (arr[i] == entryPointTypeList[j].entryTypeName) {
              this.entryPointType.push({ label: arr[i], value: entryPointTypeList[j].entryTypeId });
            }
          }
        }
      });
  }

  /**It stores the dialog data back to the backend */
  saveServiceEntryPointService(): void {
    //When add new Service Entry Point
    if (this.isNewServiceEntryPoint) {
      //Check for service entry point name already exist or not
      if (!this.checkServiceEntryPointNameAlreadyExist()) {
        this.saveServiceEntry();
        this.loadEntryPointTypeList();
        return;
      }
    }
    //When add edit service entry point
    else {
      if (this.selectedServiceEntryData[0].name != this.serviceEntryPointDetail.name) {
        if (this.checkServiceEntryPointNameAlreadyExist())
          return;
      }
      this.editServiceEntry();
      this.loadEntryPointTypeList();
    }
  }

  saveServiceEntry(): void {
    if (this.serviceEntryPointDetail.desc != null) {
      if (this.serviceEntryPointDetail.desc.length > 500) {
        this.configUtilityService.errorMessage(descMsg);
        return;
      }
    }

    for (let i = 0; i < this.entryPointType.length; i++) {
      if (this.serviceEntryPointDetail.entryTypeId == this.entryPointType[i].value) {
        this.serviceEntryPointDetail.entryType = this.entryPointType[i].label;
      }
    }
    let that = this;
    let filePath;
    this.serviceEntryPointDetail.fqm = this.serviceEntryPointDetail.fqm.trim();
    this.serviceEntryPointDetail.agent = this.agentType;
    if (this.serviceEntryPointDetail.module == null) {
      this.serviceEntryPointDetail.module = "-";
    }
    this.configKeywordsService.addServiceEntryPointData(this.serviceEntryPointDetail, this.profileId)
      .subscribe(data => {
        //Insert data in main table after inserting service in DB
        // this.serviceEntryData.push(data);

        this.serviceEntryData = ImmutableArray.push(this.serviceEntryData, data);
        this.configUtilityService.successMessage(addMessage);
      });
    this.addEditServiceEntryDialog = false;
  }

  /**Used to enabled/Disabled Service Entry Points */
  enableToggle(rowData: ServiceEntryPoint) {
    if (this.saveDisable == true) {
      return;
    }
    let filePath;
    this.configKeywordsService.enableServiceEntryPointList(rowData.id, rowData.enabled).subscribe(
      data => {
        if (rowData.enabled == true) {
          this.configUtilityService.infoMessage("Service entry point is enabled successfully.");
        }
        else {
          this.configUtilityService.infoMessage("Service entry point is disabled successfully.");
        }
      }
    );


  }
  /**
   * Method to delete custom service entry points
   */
  deleteServiceEntryPoint(): void {
    if (!this.selectedServiceEntryData || this.selectedServiceEntryData.length < 1) {
      this.configUtilityService.errorMessage("Select row(s) to delete");
      return;
    }
    /**
     * Check if selected row(s) contain pre-defined Service Entry Point(s)
     */
    let selectedEntry = this.selectedServiceEntryData;
    let arrAppIndex = [];
    for (let index in selectedEntry) {
      arrAppIndex.push(selectedEntry[index].isCustomEntry);
    }
    let i: number;
    for (i = 0; i < 11; i++) {
      if (arrAppIndex[i] == false) {
        this.configUtilityService.errorMessage("Predefined Service Entry Point(s) can't be deleted");
        return;
      }
    }

    this.confirmationService.confirm({
      message: 'Do you want to delete the selected row?',
      header: 'Delete Confirmation',
      icon: 'fa fa-trash',
      accept: () => {
        //Get Selected Applications's AppId
        let selectedApp = this.selectedServiceEntryData;
        let arrAppIndex = [];
        for (let index in selectedApp) {
          arrAppIndex.push(selectedApp[index].id);
        }

        this.configKeywordsService.deleteServiceEntryData(arrAppIndex, this.profileId)
          .subscribe(data => {
            this.deleteServiceEntryData(arrAppIndex);
            this.selectedServiceEntryData = [];
            this.configUtilityService.infoMessage("Deleted Successfully");
          })
      },
      reject: () => {
      }
    });
  }
  /**This method is used to delete  from Data Table */
  deleteServiceEntryData(arrAppIndex) {
    let rowIndex: number[] = [];

    for (let index in arrAppIndex) {
      rowIndex.push(this.getServiceEntry(arrAppIndex[index]));
    }
    this.serviceEntryData = deleteMany(this.serviceEntryData, rowIndex);
  }

  /**This method returns selected application row on the basis of selected row */
  getServiceEntry(appId: any): number {
    for (let i = 0; i < this.serviceEntryData.length; i++) {
      if (this.serviceEntryData[i].id == appId) {
        return i;
      }
    }
    return -1;
  }

  /**For showing Edit Service Entry Point dialog */
  openEditServiceEntryDialog(): void {

    if (!this.selectedServiceEntryData || this.selectedServiceEntryData.length < 1) {
      this.configUtilityService.errorMessage("Select a row to edit");
      return;
    }
    else if (this.selectedServiceEntryData.length > 1) {
      this.configUtilityService.errorMessage("Select only one row to edit");
      return;
    }

    /**
      * Check if selected row(s) contain pre-defined Service Entry Point(s)
      */
    let selectedEntry = this.selectedServiceEntryData;
    let arrAppIndex = [];
    for (let index in selectedEntry) {
      arrAppIndex.push(selectedEntry[index].isCustomEntry);
    }
    let i: number;
    for (i = 0; i < 11; i++) {
      if (arrAppIndex[i] == false) {
        this.configUtilityService.errorMessage("Predefined Service Entry Point can't be edited");
        return;
      }
    }

    this.serviceEntryPointDetail = new ServiceEntryPoint();
    this.isNewServiceEntryPoint = false;
    this.addEditServiceEntryDialog = true;
    this.serviceEntryPointDetail = Object.assign({}, this.selectedServiceEntryData[0]);
    this.serviceEntryPointDetail.entryTypeId = this.selectedServiceEntryData[0].entryTypeId.toString();
    //Argument'll check only for "kafkaCustom" service entry type
    if(this.serviceEntryPointDetail.entryType == 'kafkaCustom')
	    this.validateArgAndGetArgumentsNumberList(this.serviceEntryPointDetail.fqm);
  }

  /**This method is used to validate the name of Service entry point is already exists. */
  checkServiceEntryPointNameAlreadyExist(): boolean {
    for (let i = 0; i < this.serviceEntryData.length; i++) {
      if (this.serviceEntryData[i].name == this.serviceEntryPointDetail.name) {
        this.configUtilityService.errorMessage("Service entry point name already exist");
        return true;
      }
    }
  }

  editServiceEntry(): void {

    if (this.serviceEntryPointDetail.desc != null) {
      if (this.serviceEntryPointDetail.desc.length > 500) {
        this.configUtilityService.errorMessage(descMsg);
        return;
      }
    }

    for (let i = 0; i < this.entryPointType.length; i++) {
      if (this.serviceEntryPointDetail.entryTypeId == this.entryPointType[i].value) {
        this.serviceEntryPointDetail.entryType = this.entryPointType[i].label;
      }
    }

    this.serviceEntryPointDetail.fqm = this.serviceEntryPointDetail.fqm.trim();
    if (this.serviceEntryPointDetail.module == null) {
      this.serviceEntryPointDetail.module = "-";
    }
    this.configKeywordsService.editServiceEntryPointData(this.serviceEntryPointDetail, this.profileId)
      .subscribe(data => {
        let index = this.getServiceEntryPoint();
        this.serviceEntryData = ImmutableArray.replace(this.serviceEntryData, data, index);
        this.serviceEntryPointDetail.entryType = data.entryType
        this.configUtilityService.successMessage(editMessage);
      });

    this.addEditServiceEntryDialog = false;
    this.selectedServiceEntryData = [];
  }

  getServiceEntryPoint(): number {
    if (this.serviceEntryPointDetail) {
      let ID = this.serviceEntryPointDetail.id;
      for (let i = 0; i < this.serviceEntryData.length; i++) {
        if (this.serviceEntryData[i].id == ID) {
          return i;
        }
      }
    }
    return -1;
  }
  saveServiceEntryOnFile() {
    this.configKeywordsService.saveServiceEntryData(this.profileId)
      .subscribe(data => {
        console.log("return type", data);
//        this.configUtilityService.successMessage("Saved Successfully");
        let filePath;
        this.configKeywordsService.getFilePath(this.profileId).subscribe(data => {

          //For sending Runtime Changes

          filePath = data;
          filePath = filePath + "/NDEntryPointFile.txt";
          this.entryPoints['NDEntryPointsFile'].path = filePath;
          this.keywordData.emit(this.entryPoints);
        });
      })
  }
  // for download Excel, word, Pdf File 
  downloadReports(reports: string) {
    let arrHeader ;
    let arrcolSize;
    let arrAlignmentOfColumn ;
    let arrFieldName ;
    if(this.type){
     arrHeader = { "0": "Service Entry Type", "1": "Service Entry Name", "2": "Enable Instrumentation","3" : "Description" ,"4" : "Category"};
     arrcolSize = { "0": 2, "1": 2, "2": 1 ,"3" :2 ,"4" : 2};
     arrAlignmentOfColumn = { "0": "left", "1": "left", "2": "center" , "3" : "left","4" : "left"};
     arrFieldName = { "0": "entryType", "1": "name", "2": "enabled" , "3" : "desc" , "4" : "entryTypeCategory"};

    for(let i=0;i<this.serviceEntryData.length;i++){
      if(this.serviceEntryData[i].isCustomEntry == true){
        this.serviceEntryData[i].entryTypeCategory = "Custom";
      }
      else{
        this.serviceEntryData[i].entryTypeCategory = "Predefined"
    }
  }
}
  else{
     arrHeader = { "0": "Type", "1": "Module", "2": "Name","3" : "Enabled" ,"4" : "Description","5" : "Category"};
     arrcolSize = { "0": 2, "1": 2, "2": 2 ,"3" : 1 ,"4" : 2,"5" :2};
     arrAlignmentOfColumn = { "0": "left", "1": "left", "2": "left","3" : "center" ,"4" : "left" ,"5" : "left"};
     arrFieldName = { "0": "entryType", "1": "module", "2": "name" , "3" : "enabled" , "4" : "desc","5" : "entryTypeCategory"};

    for(let i=0;i<this.serviceEntryData.length;i++){
      if(this.serviceEntryData[i].isCustomEntry == true){
        this.serviceEntryData[i].entryTypeCategory = "Custom";
      }
      else{
        this.serviceEntryData[i].entryTypeCategory = "Predefined"
      }
    }
  }
    let object =
      {
        data: this.serviceEntryData,
        headerList: arrHeader,
        colSize: arrcolSize,
        alignArr: arrAlignmentOfColumn,
        fieldName: arrFieldName,
        downloadType: reports,
        title: "Service Entry Points",
        fileName: "serviceentry",
      }
    this.configKeywordsService.downloadReports(JSON.stringify(object)).subscribe(data => {
      this.openDownloadReports(data)
    })
  }

  /* for open download reports*/
  openDownloadReports(res) {
    window.open("/common/" + res);
  }

  /**
 * Purpose : To invoke the service responsible to open Help Notification Dialog
 * related to the current component.
 */
  sendHelpNotification() {
  	this.configKeywordsService.getHelpContent("Instrumentation", "Service Entry Point", "");
  }

    validateArgAndGetArgumentsNumberList(fqm) {
      if (fqm == null || fqm == "") {
        this.configUtilityService.errorMessage("Fully qualified method name is empty");
        this.argumentIndexSelecetItem = [];
        return;
      }
        let argStart = fqm.indexOf("(");
        let argEnd = fqm.indexOf(")");
        let args = fqm.substring(argStart + 1, argEnd);
        //flag used for creating string "Ljava/lang/String;"
        let flag = false;
        let length = 0;
        let string = '';
        if (args.length == 0) {
          this.configUtilityService.errorMessage("No Arguments present in Fqm")
        }
        else {
          for (let i = 0; i < args.length; i++) {
            if (args[i] == "L") {
              flag = true;
              string = string + args[i];
              continue;
            }
            else if (flag) {
              if (args[i] == ";") {
                string = string + args[i];
                  length++;
                  string = '';
                  flag = false;
              }
              else
                string = string + args[i];
  
            }
            else {
              if (this.DATA_TYPE_ARR.indexOf(args[i]) == -1) {
                this.configUtilityService.errorMessage("Invalid Argument Data Type")
                return;
              }
              else {
                length++;
              }
            }
          }
        }
        this.argumentIndexSelecetItem = [];
        for (let i = 1; i <= length; i++) {
          this.argumentIndexSelecetItem.push({ 'value': i, 'label': i + '' });
        }
      }

    //Method to show/hide column filters
    showHideColumnFilter() {
    if (this.isSerEntryPntFilters) {
      this.isEnableColumnFilter = true;
      this.isSerEntryPntFilters = false;
    }
    else {
      this.isEnableColumnFilter = false;
      this.isSerEntryPntFilters = true;
    }
  }

}
