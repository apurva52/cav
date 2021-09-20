import { Injectable, Injector } from '@angular/core';
import { Store } from 'src/app/core/store/store';
// import * as URL from '../constants/mon-url-constants';
// import { RestApiService } from './rest-api.service';
// import { MonDataService } from './mon-data.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import * as _ from "lodash";
import { Subject } from 'rxjs';
import { HealthCheckMonData } from '../configure-monitors/add-monitor/containers/health-check-data';
import { GlobalProps } from '../configure-monitors/add-monitor/containers/global-prop';
// import { Store } from '@ngrx/store';
// import { ColorCodeData } from '../containers/color-code-data';
// import * as COLOR_CODE from '../constants/colorcode-constants';
// import { TableData } from '../containers/table-data';
// import { MessageService } from './message.service';
// import { BlockUI, NgBlockUI } from 'ng-block-ui'; // Import BlockUI decorator & optional NgBlockUI type
// import * as COMPONENT from '../constants/mon-component-constants';
// import * as HEADERS_LIST from '../constants/tableheader-constants';
// import * as CHECK_MON_DROPDOWN_LIST from '../constants/check-mon-dropdown-constants';
// import { UtilityService } from './utility.service';
// import { HideShowMonitorData } from '../containers/hide-show-monitor-data';
// import * as LOGCONSTANT from '../constants/log-monitor-constant';
// import * as MODE from '../constants/mon-constants';
// import { MonMetricPriorityService } from './mon-metric-priority.service';
// import { ServerConfigData } from '../containers/server-config-data';
// import { MonConfigData } from '../containers/mon-config-data';
// import { Subject } from 'rxjs';
// import { HealthCheckMonData } from '../containers/health-check-data';
// import { GlobalProps } from '../containers/global-prop';
// import { SelectItem } from 'primeng/api';
// import *as LONG_ARG from '../constants/longArguments-constants';

@Injectable({
  providedIn: 'root',
})
export class MonConfigurationService extends Store.AbstractService {
  topoName: string = "NA";
  isFromBreadCrumb: boolean = false;
  private profileName: string = "NA";
  private profileDesc: string = 'NA';
  private priority: string = '';
  isAppNamePresent: boolean = false;
  monTierTreeTableData: any[] = null;
  tierHeaderList: any[] = null;
  compArgData: any[]; //hold components array of components
  saveMonitorData: {} = {}; // Used to hold the configured data of monitor
  selectedRow: {} = {}; //Used to hold selected row object of treetabledata
  checkBoxStateArr: any[] = []; //Used to hold checkBoxState
  hideShowMonList: any[] = []; // Used to store list of monitors to show or hide
  //   hideShowMonData: HideShowMonitorData;
  scrollPositionVal: number = 0;
  colList: any[] = [];
  //   @BlockUI() blockUI: NgBlockUI;
  monitorCategory: string; //This variable is used to set category name for monitor
  isFromAdd: boolean = false; //This flag is used for add functionality in show hidden monitor case
  tierListObj: Object = {}; //Exclude Tier List
  isTierGroup: boolean = false;
  //   serverConfData: ServerConfigData;
  //   monConfigData: MonConfigData; 
  headerForRTC: string; // this is used to show the header for rtc dialog box for success or failure
  showdialog: boolean = false; //this flag is used to show the dialog box on success or failure for runtime changes.
  msgForRTC: string = ""; // this is used to show the messages for succcess/failure when runtime changes are applied.
  isFromCustomMonBack: boolean = false;   //this flag is used for reloading the treetable data in monitor configuration screen after navigating from Available NF monitor screen
  //   public autoFillMetricInfo = new Subject<any>();
  //   public $metricInfo = this.autoFillMetricInfo.asObservable();
  //   public autoFillMetricHierarchy = new Subject<any>();
  //   public $metricHierchy = this.autoFillMetricHierarchy.asObservable();
  metricData: any[]; // metric data received after command is executed in Commmand Based monitor
  metricHier: any[]; // metric hierarchy received after command is executed in Commmand Based monitor
  mType: number; // custom category type.
  //   public saveMonitorConf = new Subject<boolean>();
  //   public $saveMonitorConf = this.saveMonitorConf.asObservable();
  //   public changeOutPutType = new Subject<boolean>();
  //   public $changeOutPutType = this.changeOutPutType.asObservable()
  //Added for health check monitor from deployment UI

  globalProps: GlobalProps;
  tierName: string = "";
  serverName: string = "";
  isFromHealthCheckDailog: boolean = false;
  public isFromHealthChkEdit = new Subject<boolean>();
  public $isFromHealthChkEditMode = this.isFromHealthChkEdit.asObservable();
  public isFromHCSave = new Subject<boolean>();
  public $isFromHCSave = this.isFromHCSave.asObservable();
  healthCheckData: HealthCheckMonData;
  //   sysDef: number = -1;
  //   public isFromEditMode = new Subject<boolean>();
  //   public $isFromEditMode = this.isFromEditMode.asObservable();
  //   serverList:SelectItem[];

  rTier: boolean = false;
  rServer: boolean = false;
  driverCls: string = '';
  showSID: boolean = false;
  showSn: boolean = false;
  dbQuery: string = "";
  //   sslTypeList:SelectItem[];
  gdfName: string = "";
  authMode: string = "";

  constructor() {
    super();
  }


  //   getDataFromServerTierMonitors(): Promise<any> {
  //     this.messageService.progressBarEmit({ flag: true, color: 'primary' });
  //     this.blockUI.start();

  //     let url = this.monDataService.getserviceURL() + URL.GET_TIER_MONITORS_DATA;
  //     let params = new HttpParams()
  //       .set('topoName', sessionStorage.getItem('topoName'))
  //       .set('jsonName', sessionStorage.getItem('profileName'))
  //       .set('userName', this.monDataService.getUserName())
  //       .set('testRun', this.monDataService.getTestRunNum().toString())
  //       .set('monMode', this.monDataService.getMonMode().toString())
  //       .set('role', this.monDataService.$userRole)
  //       .set('productKey', this.monDataService.getProductKey())

  //     return this.http.get(url, { params })
  //       .map(res => <any>res).toPromise()
  //       .then(res => {
  //         this.messageService.progressBarEmit({ flag: false, color: 'primary' });
  //         this.blockUI.stop();
  //         this.tierHeaderList = res["tierList"];
  //         let data = res["treeTableData"]["data"];
  //         this.modifyDataForColorMode(data);
  //         this.monTierTreeTableData = data;
  //       }).
  //       catch((error: any) => { this.monDataService.closeAllSessionAndLogin(error) })
  //   }

  public clearSessionVariable() {
    sessionStorage.removeItem('profileName');
    sessionStorage.removeItem('topoName');
    sessionStorage.removeItem('profDesc');
    sessionStorage.removeItem('monMode');
    sessionStorage.removeItem('testRun');
  }

  public restoreVariableFromSession() {
    if (sessionStorage.getItem('profileName') != null) {
      this.profileName = sessionStorage.getItem('profileName').toString();
    }

    if (sessionStorage.getItem('topoName') != null) {
      this.topoName = sessionStorage.getItem('topoName').toString();
    }

    if (sessionStorage.getItem('profDesc') != null) {
      this.profileDesc = sessionStorage.getItem('profDesc').toString();
    }

    // if (sessionStorage.getItem('monMode') != null) {
    //   this.monDataService.setMonMode(Number(sessionStorage.getItem('monMode')));
    // }

    // if (sessionStorage.getItem('testRun') != null) {
    //   this.monDataService.setTestRunNum(Number(sessionStorage.getItem('testRun')));
    // }
  }

  //   public setVariableInSession(calledFrom) {
  //     this.clearSessionVariable();
  //     if (calledFrom == 0 || calledFrom == 2) { // Edit
  //       sessionStorage.setItem('profileName', this.profileName);
  //       sessionStorage.setItem('topoName', this.topoName);
  //       sessionStorage.setItem('profDesc', this.profileDesc);
  //       sessionStorage.setItem('monMode', this.monDataService.getMonMode().toString())
  //     }
  //     else { // testRun mode
  //       let txSession = JSON.parse(localStorage.getItem('monitorGUI'));
  //       if (txSession['monMode'] !== null && txSession['monMode'] !== undefined) {
  //         sessionStorage.setItem('monMode', txSession['monMode']);
  //       }
  //       if (txSession['profileName'] !== null && txSession['profileName'] !== undefined) {
  //         sessionStorage.setItem('profileName', txSession['profileName']);
  //       }
  //       if (txSession['topoName'] !== null && txSession['topoName'] !== undefined) {
  //         sessionStorage.setItem('topoName', txSession['topoName']);
  //       }
  //       if (txSession['testRunNumber'] !== null && txSession['testRunNumber'] !== undefined) {
  //         sessionStorage.setItem('testRun', txSession['testRunNumber']);
  //       }
  //     }
  //   }

  //   modifyDataForColorMode(data) {
  //     let that = this;
  //     data.map(function (eachMon) {
  //       let rowObj = eachMon["data"];
  //       for (var tier in rowObj) {
  //         let value = rowObj[tier];   //here value = {chk: false, color: -1}
  //         that.updateColorName(value);
  //       }
  //     })
  //   }

  getMonitorCategoryName() {
    if (sessionStorage.getItem("categoryName") != null)
      this.monitorCategory = sessionStorage.getItem("categoryName");
    else
      sessionStorage.setItem("categoryName", this.monitorCategory)

    return this.monitorCategory;
  }

  getCompArgsData() {
    return this.compArgData;
  }

  //   updateColorName(value) {
  //     if (value != null && value.hasOwnProperty('color'))
  //       value['colorName'] = ColorCodeData.getColor(value['color']);
  //   }

  //   /**** This method sends request to server for getting  *****/
  //   getChildNodes(categoryName, id): Promise<any> {
  //     let url = this.monDataService.getserviceURL() + URL.GET_CHILD_NODES;

  //     let params = new HttpParams()
  //       .set('topoName', this.topoName)
  //       .set('jsonName', this.profileName)
  //       .set('categoryName', categoryName)
  //       .set('categoryId', id)
  //       .set('userName', this.monDataService.getUserName())
  //       .set('testRun', this.monDataService.getTestRunNum().toString())
  //       .set('monMode', this.monDataService.getMonMode().toString())
  //       .set('role', this.monDataService.$userRole)
  //       .set('productKey', this.monDataService.getProductKey())

  //     return this.http.get(url, { params })
  //       .map(res => <any>res).toPromise()
  //       .then(res => {
  //         this.modifyDataForColorMode(res);

  //         let nodeData = _.find(this.monTierTreeTableData, function (each) { return each['data'][COMPONENT.MONITOR_NAME] == categoryName });
  //         if (nodeData.data[COMPONENT.MONITOR_STATE]) {
  //           let subCateList = [];
  //           res.map(function (each) {
  //             each[COMPONENT.MONITOR_STATE] = nodeData[COMPONENT.MONITOR_STATE];
  //             subCateList.push(each.data[COMPONENT.MONITOR_NAME])
  //           })

  //           this.hideShowMonList.map(function (each) {
  //             if (each['category'] == 'categoryName')
  //               each['subCategory'] = subCateList;
  //           })

  //         }
  //         return nodeData["children"] = res;
  //       }).
  //       catch((error: any) => { this.monDataService.closeAllSessionAndLogin(error) })
  //   }

  //   getComponentData(drivenJsonName, id, monName, tierName, monType, isSystemDefined): Promise<any> {
  //     this.messageService.progressBarEmit({ flag: true, color: 'primary' });
  //     this.blockUI.start();
  //     let url = this.monDataService.getserviceURL() + URL.GET_COMPONENTS + "?menuDrivenJsonName=" + drivenJsonName;

  //     let params = new HttpParams()
  //       .set('topoName', this.topoName)
  //       .set('jsonName', this.profileName)
  //       .set('userName', this.monDataService.getUserName())
  //       .set('testRun', this.monDataService.getTestRunNum().toString())
  //       .set('monMode', this.monDataService.getMonMode().toString())
  //       .set('role', this.monDataService.$userRole)
  //       .set('productKey', this.monDataService.getProductKey())
  //       .set('monName', monName)
  //       .set('tierName', tierName)
  //       .set('monType', monType)
  //       .set('sysDefined', isSystemDefined)

  //     return this.http.get(url, { params })
  //       .map(res => <any>res).toPromise()
  //       .then(res => {
  //         this.messageService.progressBarEmit({ flag: false, color: 'primary' });
  //         this.blockUI.stop();
  //         this.addComponentsData(id, res)
  //         let obj = {};
  //         obj['data'] = res,
  //           obj['id'] = id;
  //         this.setCompArgsData(obj);
  //         this.store.dispatch({ type: "ADD_COMPONENTS_DATA", payload: obj });
  //       }).
  //       catch((error: any) => { this.monDataService.closeAllSessionAndLogin(error) })
  //   }

  //   getMonConfiguredData(topoName, jsonName, monName, tierName): Promise<any> {
  //     this.messageService.progressBarEmit({ flag: true, color: 'primary' });
  //     this.blockUI.start();
  //     let url = this.monDataService.getserviceURL() + URL.GET_MON_CONFIGURED_DATA +
  //       "&topoName=" + topoName +
  //       "?tierName=" + tierName +
  //       "&jsonName=" + jsonName +
  //       "&monitorName=" + monName +
  //       "&userName=" + this.monDataService.getUserName +
  //       "&role=" + this.monDataService.$userRole +
  //       "&productKey=" + this.monDataService.getProductKey();

  //     let params: HttpParams = new HttpParams();

  //     return this.http.get(url, { params })
  //       .map(res => <any>res).toPromise()
  //       .then(res => {
  //         this.blockUI.stop();
  //         this.messageService.progressBarEmit({ flag: false, color: 'primary' });
  //         if (res != null || res.length != 0)
  //           this.addUpdateSaveMonitorDataObj(res, tierName, monName);

  //       }).
  //       catch((error: any) => { this.monDataService.closeAllSessionAndLogin(error) })
  //   }

  //   addUpdateSaveMonitorDataObj(configuredData, tierName, monName) {
  //     let tableData = [];
  //     this.modifyDataFromServer(configuredData)
  //     let obj = { "tier": tierName, "data": tableData, "monName": monName }
  //     this.saveConfiguredData(obj)
  //   }

  modifyDataFromServer(data) {
  }

  setMonTierTreeTableData(compData) {
    this.monTierTreeTableData = compData;
  }

  /**
   * Add compArgsJson to selected node if treetable data
   * @param id  = id of selected row
   * @param data = compArgsJson data i.e components Data  of selected monitor
   */
  addComponentsData(id, data) {
    let arrId = id.split(".");
    /***getting parent  Node if selected node is any of the child node ****/
    let rowData = _.find(this.monTierTreeTableData, function (each) { return each['data']['id'] == arrId[0] });
    if (arrId.length > 1) {
      let childNodes = rowData["children"];
      rowData = _.find(childNodes, function (each) { return each['data']['id'] == id });
    }
    rowData["data"]["compArgsJson"] = data;
  }

  /**here we are maintaining the state of all checkboxes as changed by the user ***/
  addUpdateCheckBoxStateArr(tierVal, key) {
    let isEntryExist: boolean = false;
    let colorMode = tierVal['color'];

    for (let i = 0; i < this.checkBoxStateArr.length; i++) {
      if (Object.keys(this.checkBoxStateArr[i])[0] == key) {
        isEntryExist = true;
        this.checkBoxStateArr[i][key] = tierVal['chk'];
        this.checkBoxStateArr[i]['colorMode'] = colorMode;
        break;
      }
    }
    if (!isEntryExist) {
      let obj = { [key]: tierVal['chk'], 'colorMode': colorMode }
      this.checkBoxStateArr.push(obj)
    }
  }

  getChkBoxStateArr() {
    return this.checkBoxStateArr;
  }
  setHideShowMonList(data) {
    this.hideShowMonList = data;
  }
  getHideShowMonList() {
    return this.hideShowMonList;
  }
  setCompArgsData(data) {
    this.compArgData = data;
  }
  getTierHeaderList(): any[] {
    return this.tierHeaderList;
  }
  getMonTierTableData(): any[] {
    return this.monTierTreeTableData;
  }
  getTopoName(): string {
    if (sessionStorage.getItem("topoName") != null)
      this.topoName = sessionStorage.getItem("topoName");
    else
      sessionStorage.setItem("topoName", this.topoName);

    return this.topoName;
  }
  setTopoName(topoName: string) {
    this.topoName = topoName;
    sessionStorage.setItem("topoName", this.topoName);
  }
  getProfileName(): string {
    if (sessionStorage.getItem("profileName") != null) {
      this.profileName = sessionStorage.getItem("profileName");
    }
    else
      sessionStorage.setItem("profileName", this.profileName);

    return this.profileName;
  }

  setProfileName(profileName: string) {
    this.profileName = profileName;
    sessionStorage.setItem("profileName", this.profileName)
  }

  getProfileDesc(): string {
    return this.profileDesc;
  }

  setProfileDesc(profileDesc: string) {
    this.profileDesc = profileDesc;
  }

  getPriority() {
    return this.priority;
  }

  setPriority(priority: string) {
    this.priority = priority;
  }
  setSelectedRow(data) {
    this.selectedRow = data;
    sessionStorage.setItem("selectedRow", JSON.stringify(this.selectedRow))
  }

  getSelectedRow(): object {
    if (Object.keys(this.selectedRow).length == 0) {
      if (sessionStorage.getItem("selectedRow") != null)
        this.selectedRow = JSON.parse(sessionStorage.getItem("selectedRow"));
    }
    return this.selectedRow;
  }

  clearData() {
    this.topoName = 'mosaic_stress_as1';
    this.profileName = 'test';
    this.profileDesc = "NA";
    this.monTierTreeTableData = null;
    this.tierHeaderList = null;
    this.saveMonitorData = {};
    this.compArgData = null;
    this.selectedRow = {};
    this.checkBoxStateArr = [];
    this.monitorCategory = '';
    this.tierListObj = {};
  }

  /**Method to call service to download(import) selected profile  */
  //   getMprof(topoName, profileName) {
  //     let url = `${URL.IMPORT_PROFILE}` + "?topoName=" + `${topoName}` + "&profileName=" + `${profileName}` + "&userName=" + this.monDataService.getUserName + "&role=" + this.monDataService.$userRole + "&productKey=" + this.monDataService.getProductKey();
  //     return this._restApi.getDataByGetReq(url);
  //   }

  //   saveConfiguredData(data) {
  //     if (this.saveMonitorData != null && this.saveMonitorData[data.tier] != null) {
  //       let isMonObjExist: boolean = false;
  //       let tierObj = JSON.parse(JSON.stringify(this.saveMonitorData[data.tier]))
  //       if (tierObj[data.monName] != null) {
  //         isMonObjExist = true;
  //         tierObj[data.monName] = [];
  //         let arr = data.data;
  //         arr.map(function (each) {
  //           tierObj[data.monName].push(each)
  //         })
  //         this.saveMonitorData[data.tier][data.monName] = [];
  //         this.saveMonitorData[data.tier][data.monName] = tierObj[data.monName];
  //       }
  //       if (!isMonObjExist && data.data.length != 0) {
  //         this.saveMonitorData[data.tier][data.monName] = data.data   //new entry of monitor Object
  //       }
  //     }
  //     else {
  //       if (this.saveMonitorData == null)
  //         this.saveMonitorData = {};

  //       if (data.data.length != 0) {
  //         this.saveMonitorData[data.tier] = {};
  //         this.saveMonitorData[data.tier][data.monName] = data.data;
  //       }
  //     }
  //   }

  //   /*** Send Request to Server  ****/
  //   sendRequestToServer(data, topoName, jsonName, priority, mpData, newProfileName) {
  //     let url = this.monDataService.getserviceURL() + URL.SAVE_DATA + "?productKey=" + this.monDataService.getProductKey();

  //     let params = {
  //       'topoName': this.topoName,
  //       'profileName': this.profileName,
  //       'userName': this.monDataService.getUserName(),
  //       'testRunNum': this.monDataService.getTestRunNum().toString(),
  //       'monMode': this.monDataService.getMonMode().toString(),
  //       'tierMonConf': data,
  //       'profileDesc': this.profileDesc,
  //       'role': this.monDataService.$userRole,
  //       'priority': this.priority,
  //       'metricPriorityInfo': mpData,
  //       'newProfileName': newProfileName
  //     };
  //     return this._restApi.getDataByPostReq(url, params)
  //   }

  /**
   * 
   * @param id Function to get the row from treetabledata on basis of Id
   */
  getSelectedRowOfTreeTableDataById(id) {
    let rowData = _.find(this.monTierTreeTableData, function (each) {
      return each.id == id
    })
    return rowData;
  }

  //Function used for updating colorMode and colorName as per operation performed
  //   updateColorModeAndName(data, tierName) {
  //     let checkBoxState = data[tierName]['chk'];
  //     let colorMode = this.getColorMode(data, checkBoxState, tierName)
  //     let tierVal = data[tierName];
  //     tierVal['color'] = colorMode;
  //     this.updateColorName(tierVal);
  //     //updating checkboxStateArr used in validation
  //     let key = data[COMPONENT.MONITOR_NAME] + ":" + tierName;
  //     this.addUpdateCheckBoxStateArr(tierVal, key);
  //     tierVal['exTier'] = this.getExcludeTierName(data, tierName);
  //   }

  //   getMonitorsStats(gdfName, username) {
  //     let url = this.monDataService.getserviceURL() + URL.GET_MONITORS_STATS + "?gdfName=" + gdfName + "&userName=" + this.monDataService.getUserName + "&role=" + this.monDataService.$userRole + "&productKey=" + this.monDataService.getProductKey();
  //     return this._restApi.getDataByGetReq(url);
  //   }

  //   getMonitorsStatsList(gdfNameList) {
  //     let url = this.monDataService.getserviceURL() + URL.GET_MONITORS_STATS_LIST + "?gdfNameList=" + gdfNameList + "&userName=" + this.monDataService.getUserName() + "&role=" + this.monDataService.$userRole + "&productKey=" + this.monDataService.getProductKey();
  //     return this._restApi.getDataByGetReq(url);
  //   }

  //   getMonitorConfiguartion(drivenJsonName, monName, tierName, monType) {
  //     this.blockUI.start();
  //     let url = this.monDataService.getserviceURL() + URL.GET_MONITORS_CONFIG;
  //     let params = new HttpParams()
  //       .set('topoName', this.topoName)
  //       .set('jsonName', this.profileName)
  //       .set('menuDrivenJson', drivenJsonName)
  //       .set('monitorName', monName)
  //       .set('tierName', tierName)
  //       .set('userName', this.monDataService.getUserName())
  //       .set('testRun', this.monDataService.getTestRunNum().toString())
  //       .set('monMode', this.monDataService.getMonMode().toString())
  //       .set('role', this.monDataService.$userRole)
  //       .set('productKey', this.monDataService.getProductKey())
  //       .set('monType', monType)

  //     let that = this;
  //     return this.http.get(url, { params })
  //       .map(res => <any>res).toPromise()
  //       .then(res => {
  //         this.blockUI.stop();
  //         if (res != null && res.length != 0) {
  //           this.modifyTableDataByMonType(res);
  //           if (this.saveMonitorData[tierName] != null)
  //             this.saveMonitorData[tierName][monName] = res;
  //           else {
  //             let monConfigData: any = {};
  //             monConfigData[monName] = res;
  //             this.saveMonitorData[tierName] = monConfigData;
  //           }
  //         }
  //       }).
  //       catch((error: any) => { this.monDataService.closeAllSessionAndLogin(error) })
  //   }

  //   /**
  //     *  Here res is the configured mon data 
  //     *  This method is called so as the value  of options can be 
  //     *  mapped to fields of respective monitors
  //     *  @param res 
  //     */
  //   modifyTableDataByMonType(res) {
  //     let that = this;
  //     res.map(function (each) {
  //       if (each['type'] != null && each['type'] != 0)  // for all monitor except Check Mon, server signature and log monitor
  //       {
  //         let valArr = each["options"].trim().split(" ");
  //         let hdrList = [];
  //         if (each['type'] == COMPONENT.CHECK_MON_TYPE)                             // means monitor is Check Monitor
  //           hdrList = HEADERS_LIST.chkMonHdrList;
  //         if (each['type'] == COMPONENT.BATCH_JOBS_TYPE)                             // for batch jobs
  //           hdrList = HEADERS_LIST.btchJobsList;
  //         else if (each['type'] == COMPONENT.SERVER_SIGNATURE_TYPE)
  //           hdrList = HEADERS_LIST.serverSignatureHdrList;

  //         else if (each['type'] == COMPONENT.LOG_PATTERN_TYPE || each['type'] == COMPONENT.LOG_DATA_MON_TYPE) {
  //           that.modifyLogPatternData(each, valArr);
  //           return null;
  //         }
  //         else if (each['type'] == COMPONENT.CUSTOM_MON_TYPE) // for custom monitor the field values are set using this method
  //         {
  //           that.modifyCustomMonitorData(each, valArr);
  //           return null;
  //         }

  //         //Handled cases for 'Check Monitor'
  //         if (each['type'] == COMPONENT.CHECK_MON_TYPE) {
  //           let dataArr: string[] = [COMPONENT.FROM_EVENT, COMPONENT.PHASE_NAME, COMPONENT.FREQUENCY, COMPONENT.PERIODICITY, COMPONENT.END_EVENT, COMPONENT.COUNT, COMPONENT.CHECK_MON_PROG_NAME];

  //           each[COMPONENT.END_PHASE_NAME] = 'NA';
  //           for (let ii = 0; ii < dataArr.length; ii++) {
  //             each[dataArr[ii]] = 'NA';
  //             if (valArr[ii] == undefined)
  //               continue;

  //             if (dataArr[ii] == COMPONENT.COUNT && valArr[ii - 1] == '3') {
  //               each[COMPONENT.END_PHASE_NAME] = valArr[ii];
  //             }
  //             else if (dataArr[ii] == COMPONENT.CHECK_MON_PROG_NAME) {
  //               each[dataArr[ii]] = decodeURIComponent(valArr[ii]);
  //             }
  //             else {
  //               each[dataArr[ii]] = valArr[ii];
  //             }
  //           }
  //         }

  //         //Handled cases for Batch Jobs
  //         else if (each['type'] == COMPONENT.BATCH_JOBS_TYPE) {
  //           let dataArr: string[] = [COMPONENT.CHECK_MON_PROG_NAME, COMPONENT.FROM_EVENT, COMPONENT.PHASE_NAME, COMPONENT.FREQUENCY, COMPONENT.PERIODICITY, COMPONENT.END_EVENT, COMPONENT.COUNT, COMPONENT.SUCCESS_CRITERIA, COMPONENT.BATCH_LOG_FILE_NAME, COMPONENT.COMMAND_NAME, COMPONENT.BATCH_SEARCH_PATTERN, COMPONENT.F1, COMPONENT.F2, COMPONENT.F3, COMPONENT.F4, COMPONENT.F5, COMPONENT.F6];

  //           each[COMPONENT.END_PHASE_NAME] = 'NA';
  //           for (let ii = 0; ii < dataArr.length; ii++) {
  //             each[dataArr[ii]] = 'NA';
  //             if (valArr[ii] == undefined)
  //               continue;

  //             if (dataArr[ii] == COMPONENT.COUNT && valArr[ii - 1] == '3') {
  //               each[COMPONENT.END_PHASE_NAME] = valArr[ii];
  //             }
  //             else if (dataArr[ii] == COMPONENT.CHECK_MON_PROG_NAME) {
  //               each[dataArr[ii]] = decodeURIComponent(valArr[ii]);
  //             }
  //             else if (dataArr[ii] == COMPONENT.BATCH_SEARCH_PATTERN) {
  //               each[dataArr[ii]] = decodeURIComponent(valArr[ii]);
  //             }
  //             else if (dataArr[ii] == COMPONENT.BATCH_LOG_FILE_NAME) {
  //               each[dataArr[ii]] = decodeURIComponent(valArr[ii]);
  //             }
  //             else if (dataArr[ii] == COMPONENT.COMMAND_NAME) {
  //               each[dataArr[ii]] = decodeURIComponent(valArr[ii]);
  //             }
  //             else {
  //               each[dataArr[ii]] = valArr[ii];
  //             }
  //           }
  //         }

  //         //Else Setting data for rest of the cases
  //         else {
  //           for (let i = 0; i <= hdrList.length - 1; i++) {
  //             if (i == 0 || hdrList[i].field.includes("_ui"))  // skip the name field and those field which are having  "_ui" appended in the name 
  //               continue;

  //             if (i <= valArr.length) {

  //               if (hdrList[i]['isUrlEncode'])
  //                 each[hdrList[i].field] = decodeURIComponent(valArr[i - 1]);
  //               else
  //                 each[hdrList[i].field] = valArr[i - 1];
  //             }
  //             else
  //               each[hdrList[i].field] = "NA";
  //           }
  //         }
  //       }

  //       if (each.type == COMPONENT.CHECK_MON_TYPE) // for check monitor need to get label for displaying in the ui 
  //         that.modifyDataForCheckMonDropDown(HEADERS_LIST.chkMonHdrList, each);
  //       else if (each.type == COMPONENT.BATCH_JOBS_TYPE) // for batch jobs need to get label for displaying in the ui 
  //         that.modifyDataForCheckMonDropDown(HEADERS_LIST.btchJobsList, each);

  //     })
  //   }

  //   /* Method is used to get headerList for getting label for each selected option from the dropdown lsit */
  //   modifyDataForCheckMonDropDown(hdrList, formData) {
  //     let that = this;
  //     hdrList.map(function (eachObj) {
  //       that.getDropDownLabelForCheckMon(formData, eachObj)
  //     })
  //   }

  //  //this method is called when we have to set the data for the log pattern monitor at the time of edit
  //   modifyLogPatternData(each, valArr) {
  //     each['fileNameSelection'] = valArr[0];  //it will hold the file name selection "-f"
  //     if (valArr[1].startsWith("__journald")) {
  //       each['fileNameSelection'] = "-f __journald";
  //       if (!valArr[2].includes("-u"))
  //         each['journalType'] = "all";
  //       else {
  //         each['journalType'] = "-u";
  //         let value = decodeURIComponent(valArr[2]);
  //         let specificJournalValArr = value.split("-u");
  //         each["fileName"] = specificJournalValArr[1];
  //       }
  //     }
  //     else
  //       each['fileName'] = decodeURIComponent(valArr[1]);

  //     /** Now  valArr[2] = "-h "  **/
  //     if (valArr[2] == "-h")   //for number of header lines in log data monitor
  //       each["headerLines"] = valArr[3];

  //     if (valArr[4] == LOGCONSTANT.TRAILING_CHAR)  //for Trailing character "-T"
  //       each["trailingChar"] = valArr[5];

  //     if (valArr[6] == LOGCONSTANT.LOG_LINE_PATTERN_ARG) //for log line pattern "-j" for bug 77321.
  //       each["logLinePattern"] = decodeURIComponent(valArr[7]);

  //     // for bug 80307- for multiple file support in log data monitor
  //     if (valArr[8] == "-y")
  //       each["readMulFile"] = valArr[9];

  //     if (each['type'] == COMPONENT.LOG_PATTERN_TYPE) {
  //       //for bug 80307- for multiple file support in log pattern monitor
  //       if (valArr[2] == "-y")
  //         each["readMulFile"] = valArr[3];

  //       this.modifyDataForCheckMonDropDown(HEADERS_LIST.logPatternMonList, each);
  //     }

  //     //support of -N option for log pattern and log data monitor
  //     let instanceCountIndex = valArr.indexOf("-N")
  //     if (instanceCountIndex != -1)
  //       each['instCount'] = valArr[instanceCountIndex + 1];

  //     //support of -W option for log pattern and log data monitor
  //     let dumpServerLogs = valArr.indexOf("-W")
  //     if (dumpServerLogs != -1)
  //       each['dumpServer'] = true;
  //   }

  //   /**
  //    *  This method is used to get the dropdown label for the corresponding value as selected from the dropdown lisy 
  //    * @param formData 
  //    * @param eachObj  = Each  Object of tableheader list
  //    */
  //   getDropDownLabelForCheckMon(formData, eachObj) {
  //     if (eachObj.field == COMPONENT.FROM_EVENT || eachObj.field == COMPONENT.FREQUENCY || eachObj.field == COMPONENT.END_EVENT || eachObj.field == COMPONENT.RUN_OPTIONS || eachObj.field == COMPONENT.SUCCESS_CRITERIA) {
  //       let key = eachObj.field;
  //       if (!key.includes("_ui") || formData[key] != '') {
  //         let list = [];

  //         if (key == COMPONENT.FROM_EVENT)
  //           list = UtilityService.createListWithKeyValue(CHECK_MON_DROPDOWN_LIST.EXECUTE_TIME_LABEL, CHECK_MON_DROPDOWN_LIST.EXECUTE_TIME_VALUE);
  //         else if (key == COMPONENT.FREQUENCY)
  //           list = UtilityService.createListWithKeyValue(CHECK_MON_DROPDOWN_LIST.FREQUENYCY_LABEL, CHECK_MON_DROPDOWN_LIST.FREQUENYCY_VALUE);
  //         else if (key == COMPONENT.END_EVENT)
  //           list = UtilityService.createListWithKeyValue(CHECK_MON_DROPDOWN_LIST.END_EVENT_LABEL, CHECK_MON_DROPDOWN_LIST.END_EVENT_VALUE);
  //         else if (key == COMPONENT.RUN_OPTIONS)
  //           list = UtilityService.createListWithKeyValue(CHECK_MON_DROPDOWN_LIST.RUN_OPTION_LABEL, CHECK_MON_DROPDOWN_LIST.RUN_OPTION_VALUE);
  //         else if (key == COMPONENT.SUCCESS_CRITERIA)
  //           list = UtilityService.createListWithKeyValue(CHECK_MON_DROPDOWN_LIST.SUCCESS_CRITERIA_LABEL, CHECK_MON_DROPDOWN_LIST.SUCCESS_CRITERIA_VALUE);

  //         let obj = _.find(list, function (item) { return item.value == formData[key] })

  //         let newKey = key + "_ui";

  //         if (obj.value != 'NA') // skipping those values from the list which have value as NA.when no option is selected from the dropdown it is having value as "NA"
  //           formData[newKey] = obj.label; // add an entry in the formData when value is not "NA"
  //         else {
  //           formData[newKey] = obj.value;
  //         }
  //         // otherwise set "NA" as its value to be displayed in the ui.
  //       }
  //     }
  //   }

  //   getColorMode(data, checkBoxState, tierName) {
  //     let monName = data[COMPONENT.MONITOR_NAME];
  //     if (checkBoxState)                                                      //checked
  //     {
  //       //added check to handle case for getting green color code when checkbox was checked in case of health check deployment monitor
  //       if (data[COMPONENT.DRIVEN_JSON_NAME] != 'NA' || data["monType"] == COMPONENT.HEALTH_CHECK_TYPE ||
  //          data["mType"] == COMPONENT.STATSD_MON_TYPE ||  data["mType"] == COMPONENT.CMD_MON_TYPE || 
  //          data["mType"] == COMPONENT.DB_MON_TYPE || data["mType"] == COMPONENT.JMX_MON_TYPE)                                   //comp present  
  //       {
  //         let monObj = this.saveMonitorData[tierName];
  //         if (monObj != null && monObj[monName] != null && monObj[monName].length != 0)  //case when user fist configured then removve it safer side
  //         {
  //           return COLOR_CODE.CHECKED_COMPPRESENT_ISCONFIGURED;
  //         }
  //         else {
  //           return COLOR_CODE.CHECKED_COMPPRESENT_NOTCONFIGURED;
  //         }
  //       }
  //       else //case of System monitors which do not require configurations
  //       {
  //         return COLOR_CODE.CHECKED_COMPNOPRESENT_NOTCONFIGURED;
  //       }
  //     }
  //     else {
  //       if (data[COMPONENT.DRIVEN_JSON_NAME] != 'NA')                                   //comp present  
  //       {
  //         let monObj = this.saveMonitorData[tierName];
  //         if (monObj != null && monObj[monName] != null && monObj[monName].length != 0)  //case when user fist configured then removve it safer side
  //         {
  //           return COLOR_CODE.UNCHECKED_COMPPRESENT_ISCONFIGURED
  //         }
  //         else {
  //           return COLOR_CODE.UNCHECKED_COMPPRESENT_NOTCONFIGURED;
  //         }
  //       }
  //       else //case of System monitors which do not require configurations
  //       {
  //         let data = this.saveMonitorData[tierName];
  //         if (data != null && data[monName] != null && data[monName].length != 0)
  //           return COLOR_CODE.UNCHECKED_COMPNOPRESENT_ISCONFIGURED;
  //         else
  //           return COLOR_CODE.UNCHECKED_COMPNOPRESENT_NOTCONFIGURED;
  //       }
  //     }
  //   }

  //   getExcludeTierName(data, tierName) {
  //     let monName = data[COMPONENT.MONITOR_NAME] || '';
  //     let monObjArr: TableData[] = (this.saveMonitorData[tierName]) ? (this.saveMonitorData[tierName][monName] || []) : [];
  //     let excludeStr = '';
  //     let dummyStr: string[] = [];
  //     for (let i = 0; i < monObjArr.length; i++) {
  //       let tmpStr = monObjArr[i].excludeTier || '';
  //       let arr: string[] = tmpStr.split(',');

  //       for (let ii = 0; ii < arr.length; ii++) {
  //         let data: string = arr[ii];
  //         if (data.startsWith(COMPONENT.EX_TIER_PREFIX)) {
  //           data = data.substring(3);
  //         }

  //         data = data.trim();
  //         if (dummyStr.indexOf(data) == -1)
  //           dummyStr.push(data);
  //       }
  //     }

  //     excludeStr = dummyStr.join(',');
  //     return excludeStr;
  //   }

  //   /*Method to send request to the server to start test for a monitor*/
  //   testMonitor(data, topoName, jsonName, tierName, monName) {
  //     let url = this.monDataService.getserviceURL() + URL.TEST_MONITOR + "?productKey=" + this.monDataService.getProductKey();

  //     let dataForServer = {
  //       "topoName": topoName,
  //       "profileName": jsonName,
  //       "userName": this.monDataService.getUserName(),
  //       "tierName": tierName,
  //       "monName": monName,
  //       "monConfigDTO": data,
  //       "role": this.monDataService.$userRole
  //     }

  //     return this._restApi.getDataByPostReq(url, dataForServer);
  //   }

  //   hideMonitors(monTierTreeTableData) {
  //     let url = this.monDataService.getserviceURL() + URL.HIDE_MONITORS + "?productKey=" + this.monDataService.getProductKey();
  //     let dataForServer = {
  //       'operation': "hide",
  //       'hideShowMonList': this.hideShowMonList,
  //       'topoName': this.topoName,
  //       'profileName': this.profileName,
  //       'userName': this.monDataService.getUserName(),
  //       'testRunNum': this.monDataService.getTestRunNum().toString(),
  //       'monMode': this.monDataService.getMonMode().toString(),
  //       'role': this.monDataService.$userRole
  //     };
  //     return this._restApi.getDataByPostReq(url, dataForServer)
  //   }

  //   getHiddenMonitorList() {
  //     let url = this.monDataService.getserviceURL() + URL.SHOW_HIDDEN_MON + "?productKey=" + this.monDataService.getProductKey();
  //     return this._restApi.getDataByGetReq(url);
  //   }

  //   /*service to show hidden monitors back in the tree table */
  //   showHiddenMonitors(monTierTreeTableData) {
  //     let url = this.monDataService.getserviceURL() + URL.HIDE_MONITORS + "?productKey=" + this.monDataService.getProductKey();
  //     let dataForServer = {
  //       'operation': "show",
  //       'hideShowMonList': this.hideShowMonList,
  //       'topoName': this.topoName,
  //       'profileName': this.profileName,
  //       'userName': this.monDataService.getUserName(),
  //       'testRunNum': this.monDataService.getTestRunNum().toString(),
  //       'monMode': this.monDataService.getMonMode().toString(),
  //       'role': this.monDataService.$userRole
  //     };
  //     this._restApi.getDataByPostReq(url, dataForServer).subscribe(data => {
  //       this.monTierTreeTableData = data["treeTableData"]["data"];
  //       this.monTierTreeTableData = [...this.monTierTreeTableData];
  //       this.messageService.successMessage("You have successfully unhidden the monitor(s)")
  //     })
  //   }

  clearHideShowMonList() {
    this.hideShowMonList = [];
  }

  //   /** Method to send request to the server to get Tier list for the selected topology */
  //   getTierList(topoName) {
  //     let url = this.monDataService.getserviceURL() + URL.GET_TIER_LIST_URL + '?topoName=' + `${topoName}` + "&productKey=" + this.monDataService.getProductKey();
  //     return this._restApi.getDataByGetReq(url);
  //   }

  //   setScrollPositionVal(value) {
  //     this.scrollPositionVal = value;
  //   }

  //   getScrollPositionVal() {
  //     return this.scrollPositionVal;
  //   }

  //   setIsTierGroup(isTierGroup) {
  //     this.isTierGroup = isTierGroup;
  //   }

  //   addTierGroupMap(tierName, arr) {
  //     this.tierListObj[tierName] = arr;
  //   }

  //   updateDBSourceConfig() {
  //     let url = window.location.origin + '/DashboardServer/dbMonitoring/DBQueryStats/updateDbSourceConfig?testRun=' + this.monDataService.getTestRunNum();
  //     this.http.get(url).subscribe();
  //   }

  //   setColumnList(colList) {
  //     this.colList = colList;
  //   }

  //   //This method is used to set the value of the custom monitor in edit mode 
  //   modifyCustomMonitorData(each, val) {
  //     for (let i = 0; i < val.length; i++) {
  //       if (val[i] == "-s")
  //         each['snmpHost'] = val[i + 1];

  //       if (val[i] == "-c")
  //         each['com'] = val[i + 1];

  //       if (val[i] == "-v")
  //         each['ver'] = val[i + 1];

  //       if (val[i] == "-u")
  //         each['user'] = val[i + 1];

  //       if (val[i] == "-I")
  //         each['sl'] = val[i + 1];

  //       if (val[i] == "-a")
  //         each['authPro'] = val[i + 1];

  //       if (val[i] == "-A")
  //         each['authParams'] = val[i + 1];

  //       if (val[i] == "-x")
  //         each['encryPr'] = val[i + 1];

  //       if (val[i] == "-X")
  //         each['privParams'] = val[i + 1];

  //       if (val[i] == "-i")
  //         each['interval'] = val[i + 1];
  //     }
  //   }

  //   saveMonitorsConfigurationData() {
  //     const monMetricPriorityService = this.injector.get(MonMetricPriorityService);
  //     let validateVal = this.validateMonConfiguredData();
  //     if (this.monDataService.getMonMode() != MODE.RUNTIME_MODE && validateVal != null && !validateVal) {
  //       this.messageService.errorMessage("Please configured the enabled monitors first !!!!");
  //       return;
  //     }

  //     let configuredData = JSON.parse(JSON.stringify(this.saveMonitorData));
  //     let that = this;
  //     let checkBoxStateArr = this.getChkBoxStateArr();
  //     let newTierData = {};
  //     for (var key in configuredData) {

  //       let monList = configuredData[key];
  //       for (var monName in monList) {
  //         let serverMonList = [];
  //         let serverConfList = monList[monName];

  //         let monType = COMPONENT.STD_MON_TYPE;
  //         if (monName == COMPONENT.CHECK_MON)
  //           monType = COMPONENT.CHECK_MON_TYPE;

  //         if (monName == COMPONENT.BATCH_JOBS)
  //           monType = COMPONENT.BATCH_JOBS_TYPE;

  //         else if (monName == COMPONENT.SERVER_SIGNATURE)
  //           monType = COMPONENT.SERVER_SIGNATURE_TYPE;


  //         else if (monName == COMPONENT.LOG_PATTERN_MONITOR)
  //           monType = COMPONENT.LOG_PATTERN_TYPE;

  //         else if (monName == COMPONENT.GET_LOG_FILE)
  //           monType = COMPONENT.GET_LOG_FILE_TYPE;

  //         else if (monName == COMPONENT.LOG_DATA_MON)
  //           monType = COMPONENT.LOG_DATA_MON_TYPE;

  //         //added for snmp monitor (name should be as shown in the monitor treetable).
  //         else if (monName == COMPONENT.SNMP_MON)
  //           monType = COMPONENT.CUSTOM_MON_TYPE;

  //         else if (monName == COMPONENT.SERVER_HEALTH_EXTENDED_V2)
  //           monType = COMPONENT.HEALTH_CHECK_TYPE;

  //         /*** for json based monitors,data pattern is different */
  //         let tempObj = {};
  //         let sysDef = -1; //for bug 58611 - system defined command monitors = 1; user defined command monitors = 0; others = -1
  //         serverConfList.map(function (eachServerConf) {
  //           //added check for NF monitor to handle case for not setting monType as it custom monitor name
  //           //need to type check for setting custom monitor type in case of log metric, Command Monitor , System monitors
  //           if (eachServerConf.type != null && eachServerConf.type != undefined
  //             &&
  //             (eachServerConf.type == COMPONENT.NF_MON_TYPE ||
  //               eachServerConf.type == COMPONENT.CMD_MON_TYPE || eachServerConf.type == COMPONENT.SYSTEM_REST_TYPE ||
  //               eachServerConf.type == COMPONENT.HEALTH_CHECK_TYPE || eachServerConf.type == COMPONENT.STATSD_MON_TYPE ||
  //               eachServerConf.type == COMPONENT.DB_MON_TYPE || eachServerConf.type == COMPONENT.JMX_MON_TYPE)) {
  //             if (eachServerConf.type == COMPONENT.NF_MON_TYPE)
  //               monType = COMPONENT.NF_MON_TYPE;
  //             if (eachServerConf.type == COMPONENT.CMD_MON_TYPE)
  //               monType = COMPONENT.CMD_MON_TYPE;
  //             if (eachServerConf.type == COMPONENT.SYSTEM_REST_TYPE)
  //               monType = COMPONENT.SYSTEM_REST_TYPE;
  //             if (eachServerConf.type == COMPONENT.HEALTH_CHECK_TYPE)
  //               monType = COMPONENT.HEALTH_CHECK_TYPE;
  //             if (eachServerConf.type == COMPONENT.STATSD_MON_TYPE)
  //               monType = COMPONENT.STATSD_MON_TYPE;
  //             if (eachServerConf.type == COMPONENT.DB_MON_TYPE)
  //               monType = COMPONENT.DB_MON_TYPE;
  //             if (eachServerConf.type == COMPONENT.JMX_MON_TYPE)
  //               monType = COMPONENT.JMX_MON_TYPE;
  //           }
  //           sysDef = eachServerConf.sysDef;
  //           /****Here key = serverName ,enabled ***/
  //           let key = eachServerConf["serverName"] + "," + true + "," + eachServerConf["instance"];
  //           if (monType == COMPONENT.GET_LOG_FILE_TYPE || monType == COMPONENT.SERVER_SIGNATURE_TYPE)
  //             key = eachServerConf["serverName"] + "," + true + "," + eachServerConf["name"];

  //           if (!tempObj.hasOwnProperty(key))
  //             tempObj[key] = [];

  //           tempObj[key].push(eachServerConf);
  //         });

  //         serverMonList = that.createEachConfObject(tempObj, monType);

  //         /**** getting state of monitor at tier level *****/
  //         let chkBoxStateKey = monName + ":" + key;   //here key is tierName
  //         let val = false;
  //         for (let i = 0; i < checkBoxStateArr.length; i++) {
  //           if (checkBoxStateArr[i].hasOwnProperty(chkBoxStateKey)) {
  //             val = checkBoxStateArr[i][chkBoxStateKey];
  //           }
  //         }

  //         let obj = {};
  //         this.monConfigData = new MonConfigData();
  //         this.monConfigData.isEnabled = val;
  //         this.monConfigData.monType = monType;
  //         this.monConfigData.sysDef = sysDef;
  //         this.monConfigData.serverDTOList = serverMonList;
  //         // this.monConfigData.logParserGdfData = this.logParserGdfList;

  //         obj[monName] = this.monConfigData;

  //         /***handling case when 2 monitors are configured on same tier  ***/
  //         if (newTierData[key] != null) {
  //           newTierData[key][monName] = obj[monName];
  //         }
  //         else
  //           newTierData[key] = obj;
  //       }
  //     }
  //     this.sendRequestToServer1(newTierData, monMetricPriorityService.savedMpData);
  //   }

  //   validateMonConfiguredData(): boolean {
  //     let checkBoxStateArr = this.getChkBoxStateArr();
  //     let flag = checkBoxStateArr.map(function (each) {
  //       if (each[Object.keys(each)[0]]) {
  //         if (each['colorMode'] == COLOR_CODE.CHECKED_COMPPRESENT_NOTCONFIGURED)
  //           return false;
  //         else
  //           return true;
  //       }
  //       else
  //         return true;
  //     })

  //     return flag[0];
  //   }

  //   createEachConfObject(tempObj, monType) {
  //     let serverMonList = [];

  //     for (var key in tempObj) {
  //       this.serverConfData = new ServerConfigData();
  //       let arrValues = key.split(",");

  //       this.serverConfData.serverName = arrValues[0];
  //       this.serverConfData.isEnabled = arrValues[1];

  //       if (arrValues[2] != null && arrValues[2] != "undefined" && monType !== COMPONENT.GET_LOG_FILE_TYPE && monType !== COMPONENT.SERVER_SIGNATURE_TYPE)
  //         this.serverConfData[COMPONENT.INSTANCE_NAME] = arrValues[2]

  //       let valueData = tempObj[key];
  //       this.serverConfData.gdfDetailsList = valueData[0]["gdfDetails"];
  //       this.serverConfData.gdfName = valueData[0][COMPONENT.GDF_NAME];
  //       this.serverConfData.runOptions = valueData[0][COMPONENT.RUN_OPTIONS];
  //       this.serverConfData.metric = valueData[0][COMPONENT.METRIC];
  //       this.serverConfData.excludeTier = valueData[0][COMPONENT.EXCLUDE_TIER];
  //       this.serverConfData.actualServerName = valueData[0][COMPONENT.ACTUAL_SERVER_NAME]
  //       this.serverConfData.agent = valueData[0][COMPONENT.AGENT]; // add for support of agent type tag 
  //       this.serverConfData.excludeServer = valueData[0][COMPONENT.EXCLUDE_SERVER]
  //       this.serverConfData.tierForAnyServer = valueData[0][COMPONENT.TIER_FOR_ANY_SERVER]	  //add for support of destination tier server
  //       this.serverConfData.tierGroupForAnyServer = valueData[0][COMPONENT.TIER_GROUP_FOR_ANY_SERVER]   //add for support of destination tier server

  //       let that = this;

  //       valueData.map(function (each) {
  //         each["options"] = each["options"].trim();
  //         //this is to handle the case for windows monitor     
  //         if (each["options"].startsWith('/')) {
  //           let optionsArgs: string = each["options"];
  //           let arsArr: string[] = optionsArgs.replace(/\s+/g, ' ').split(' ');
  //           let optionStr = '';
  //           for (let index = 0; index < arsArr.length; index++) {
  //             if (index == 0)
  //               optionStr = arsArr[index] + arsArr[index + 1];
  //             else {
  //               optionStr += COMPONENT.SPACE_SEPARATOR + arsArr[index] + arsArr[index + 1];
  //             }
  //             index += 1;
  //           }
  //           if (optionStr) {
  //             each["options"] = optionStr;
  //           }
  //         }
  //         that.serverConfData.monName = each["name"];
  //         let appObj = {
  //           "appName": each[COMPONENT.APP_NAME],
  //           "excludeAppName": each[COMPONENT.EXCLUDE_APP_NAME],
  //           "options": each[COMPONENT.OPTION_KEY],
  //           "oldOptions": each[COMPONENT.OLD_OPTION_KEY],
  //           "javaHome": each[COMPONENT.JAVA_HOME],
  //           "classPath": each[COMPONENT.CLASS_PATH],
  //           "gdfName": valueData[0][COMPONENT.GDF_NAME],
  //           "runOption": valueData[0][COMPONENT.RUN_OPTIONS],
  //           "metaData": valueData[0][COMPONENT.META_DATA],
  //           "dvm": valueData[0][COMPONENT.DVM_NAME],
  //           "configPath": valueData[0][COMPONENT.CONFIG_FILE_NAME],
  //           "progName": valueData[0][COMPONENT.PROG_NAME],
  //           "useAgent": valueData[0][COMPONENT.USE_AGENT_NAME],
  //           "pgm": valueData[0][COMPONENT.PROGRAM_TYPE],
  //           "runProc":each[COMPONENT.RUN_AS_PROCESS],
  //         }
  //         that.serverConfData.appDTOList.push(appObj);
  //       })
  //       serverMonList.push(this.serverConfData);
  //     }
  //     return serverMonList;
  //   }

  //   sendRequestToServer1(configuredData, mpData) {
  //     this.showdialog = false;
  //     const monMetricPriorityService = this.injector.get(MonMetricPriorityService);
  //     this.sendRequestToServer(configuredData, this.getTopoName(), this.getProfileName(), this.getPriority(), mpData, "").subscribe(res => {
  //       if (res['msg'] != "Success") {
  //         this.messageService.errorMessage(res['msg']);
  //         return;
  //       }
  //       else {
  //         if (this.monDataService.getMonMode() == MODE.RUNTIME_MODE) {
  //           if (res['rtcStatus'] != undefined && res['rtcStatus']) {
  //             this.updateDBSourceConfig(); // To update db server info in mssql
  //             this.showdialog = true;
  //             this.headerForRTC = "Success"
  //             this.msgForRTC = "Runtime Changes are applied successfully";
  //           }
  //           else {
  //             this.showdialog = true;
  //             this.headerForRTC = "Failure";
  //             this.msgForRTC = res['ErrMsg'];
  //             return;
  //           }
  //         }
  //         this.messageService.successMessage(this.getProfileName() + " profile has been saved successfully for " + this.getTopoName())
  //       }
  //       monMetricPriorityService.setMetricPriorityData(null); // for clearing the variable used for saving metric priority data.   
  //     })
  //   }

  //   /** Method to send request to the server to get Tiers and count of tiers for the selected topology */
  //   getSummaryData(topoName, profileName) {
  //     let url = this.monDataService.getserviceURL() + URL.GET_SUMMARY_DETAILS + '?topoName=' + `${topoName}` + "&jsonName=" + `${profileName}` + "&testRun=" + this.monDataService.getTestRunNum().toString() + '&monMode=' + this.monDataService.getMonMode().toString() + '&userName=' + this.monDataService.getUserName() + "&productKey=" + this.monDataService.getProductKey();
  //     return this._restApi.getDataByGetReq(url);
  //   }

  //   /** Method to send request to the server to get servers, monitors and monitor arguments for the selected topology */
  //   getServerData(topoName, tierName, profileName) {
  //     let url = this.monDataService.getserviceURL() + URL.GET_SERVER_DETAILS + '?topoName=' + `${topoName}` + "&jsonName=" + `${profileName}` + "&testRun=" + this.monDataService.getTestRunNum().toString() + '&monMode=' + this.monDataService.getMonMode().toString() + '&userName=' + this.monDataService.getUserName() + '&tierName=' + tierName + "&productKey=" + this.monDataService.getProductKey();
  //     return this._restApi.getDataByGetReq(url);
  //   }

  //   autoFillMetricInfoData(val) {
  //     this.autoFillMetricInfo.next(val);
  //   }

  //   autoFillMetricHierarchyData(val) {
  //     this.autoFillMetricHierarchy.next(val);
  //   }

  //   setMetricData(data) {
  //     this.metricData = data;
  //   }

  //   getMetricData() {
  //     return this.metricData;
  //   }

  //   setMetricHierarchy(data) {
  //     this.metricHier = data;
  //   }

  //   getMetricHierarchy() {
  //     return this.metricHier;
  //   }

  //   getCustomCategoryType() {
  //     return this.mType;
  //   }

  //   setCustomCategoryType(data) {
  //     return this.mType = data;
  //   }

  //   saveMonitorConfProvider(val) {
  //     this.saveMonitorConf.next(val);
  //   }

  //   OTypeChange(val) {
  //     this.changeOutPutType.next(val);
  //   }

  //   getCloudMonitors(cloudType) {
  //     let url = this.monDataService.getserviceURL() + URL.GET_CLOUD_MONITORS + "?productKey=" + this.monDataService.getProductKey() + "&cloudType=" + cloudType;
  //     let params = {
  //       'topoName': this.topoName,
  //       'profileName': this.profileName,
  //       'userName': this.monDataService.getUserName(),
  //       'testRunNum': this.monDataService.getTestRunNum().toString(),
  //       'monMode': this.monDataService.getMonMode().toString(),
  //       'profileDesc': this.profileDesc,
  //       'role': this.monDataService.$userRole,
  //     };
  //     return this._restApi.getDataByPostReq(url, params)
  //   }

  //   /** Method to send request to the server to get AWS profile */
  //   getAWSProfile() {
  //     let url = this.monDataService.getserviceURL() + URL.GET_AWS_PROFILE + "?productKey=" + this.monDataService.getProductKey() + "&userName=" + this.monDataService.getUserName()
  //       + "&role=" + this.monDataService.$userRole;

  //     return this._restApi.getDataByPostReq(url)
  //   }
  //   saveAWSProfile(keymode, operation, oldKey, data) {
  //     let url = this.monDataService.getserviceURL() + URL.SAVE_AWS_PROFILE + "?productKey=" + this.monDataService.getProductKey() + "&keyMode=" + keymode + "&role=" + this.monDataService.$userRole + "&operation=" + operation + "&oldKeyName=" + oldKey + "&userName=" + this.monDataService.getUserName();
  //     return this._restApi.getDataByPostReq(url, data);
  //   }

  //   getAWSRegions() {
  //     let url = this.monDataService.getserviceURL() + URL.GET_AWS_REGIONS + "?productKey=" + this.monDataService.getProductKey() + "&role=" + this.monDataService.$userRole + "&userName=" + this.monDataService.getUserName();
  //     return this._restApi.getDataByGetReq(url);
  //   }

  //   /** Method to send request to the server to get Azure profile */
  //   getAzureProfile() {
  //     let url = this.monDataService.getserviceURL() + URL.GET_AZURE_PROFILE + "?productKey=" + this.monDataService.getProductKey() + "&userName=" + this.monDataService.getUserName()
  //       + "&role=" + this.monDataService.$userRole;
  //     return this._restApi.getDataByPostReq(url)
  //   }

  //   saveAzureProfile(operation, oldSKey, data) {
  //     let url = this.monDataService.getserviceURL() + URL.SAVE_AZURE_PROFILE + "?productKey=" + this.monDataService.getProductKey() + "&oldSecret=" + oldSKey + "&role=" + this.monDataService.$userRole + "&operation=" + operation + "&userName=" + this.monDataService.getUserName();
  //     return this._restApi.getDataByPostReq(url, data);
  //   }

  IsFromHealthCheckDailog() {
    return this.isFromHealthCheckDailog;
  }
  SetIsFromHealthCheckDailog(data) {
    return this.isFromHealthCheckDailog = data;
  }

  setHealthCheckData(data) {
    return this.healthCheckData = data;
  }
  getHealthCheckData() {
    return this.healthCheckData;
  }

  setGlobalHCProps(data) {
    return this.globalProps = data;
  }
  getGlobalHCProps() {
    return this.globalProps;
  }

  //   getTierName() {
  //     return this.tierName;
  //   }
  //   setTierName(data) {
  //     return this.tierName = data;
  //   }

  //   getServerName() {
  //     return this.serverName;
  //   }
  //   setServerName(data) {
  //     return this.serverName = data;
  //   }

  //   /** Method to send request to the server to get Tier list for the selected topology */
  saveHCCustomMonConf(healthCheckdata, globalProps, enableHealthCheckMon) {
    // let url = this.monDataService.getserviceURL() + "saveApplyHCMonOnTierServer" + "?productKey=" + this.monDataService.getProductKey();
    // let cache = [];
    // let data = [];
    // let returnData;
    // returnData = healthCheckdata.map(function (each) {
    //   let data2: {};
    //   data2 = JSON.stringify(each, function (key, value) {
    //     if (typeof value === 'object' && value !== null) {
    //       if (cache.indexOf(value) !== -1) {
    //         // Circular reference found, discard key
    //         return;
    //       }
    //       // Store value in our collection
    //       cache.push(value);
    //     }
    //     return value;
    //   });

    //   data.push(data2);
    //   return data2;
    // });
    // let test = data.map(function (each) {
    //   return JSON.parse(each);
    // })

    // let params = {
    //   'topoName': this.topoName,
    //   'jsonName': this.profileName,
    //   'userName': this.monDataService.getUserName(),
    //   'testRunNum': this.monDataService.getMonMode().toString() == '0' ? -1 : this.monDataService.getTestRunNum().toString(),
    //   'monMode': this.monDataService.getMonMode().toString(),
    //   'customConfiguratons': { "data": test },
    //   'globalConfiguration': globalProps,
    //   'enabled': enableHealthCheckMon,
    //   'role': this.monDataService.$userRole,
    //   'profileDesc': this.profileDesc,
    //   'tier': this.tierName,
    //   'server': this.serverName
    // };

    // return this._restApi.getDataByPostReq(url, params)
  }

  fromHealthChkEdit(val) {
    this.isFromHealthChkEdit.next(val);
  }

  fromHCSave(val) {
    this.isFromHCSave.next(val);
  }

  //   getGCPProfile() {
  //     let url = this.monDataService.getserviceURL() + URL.GET_GCP_PROFILE + "?productKey=" + this.monDataService.getProductKey() + "&userName=" + this.monDataService.getUserName()
  //       + "&role=" + this.monDataService.$userRole;

  //     return this._restApi.getDataByPostReq(url)
  //   }

  //   /**Method to call service to download(import) selected profile  */
  //   downloadProfile(profileName) {
  //     let url = this.monDataService.getserviceURL() + URL.DOWNLOAD_ACCOUNT + "?jsonName=" + `${profileName}` + "&userName=" + this.monDataService.getUserName() + "&role=" + this.monDataService.$userRole + "&productKey=" + this.monDataService.getProductKey();
  //     return this._restApi.getDataByGetReq(url);
  //   }

  //   deleteGCPFile(jsonName) {
  //     let url = this.monDataService.getserviceURL() + URL.DELETE_ACCOUNT + "?jsonName=" + `${jsonName}` + "&userName=" + this.monDataService.getUserName() + "&productKey=" + this.monDataService.getProductKey();
  //     return this._restApi.getDataByGetReq(url);
  //   }

  //   getSysDef() {
  //     return this.sysDef;
  //   }

  //   setSysDef(data) {
  //     return this.sysDef = data;
  //   }

  //   // Method called to get the list of monitor names in the category list.  //TO DO CHANGE
  //   getCategoryList() {
  //     let treeTableData = this.getMonTierTableData(); //getting treetable data for monitor category name 
  //     let tempArr = [];
  //     treeTableData.map(function (eachItem) {
  //       //skip following custom monitors from category list
  //       if (eachItem['data']['monType'] == -1) {
  //         tempArr.push(eachItem['data']['_mon']);
  //       }
  //     })
  //     tempArr.push("--Add New Technology--");
  //     return tempArr;
  //   }

  //   getDefVal(monName, monType, sysDefined){
  //     let url = this.monDataService.getserviceURL() + URL.DEFAULT_VAL_AT_DEPLOYMENT_API + 
  //              "?topoName=" + this.topoName +"&monName=" + monName  + "&monType=" + monType +"&productKey="+ this.monDataService.getProductKey() +
  //              "&sysDefined=" + sysDefined;
  //     return this._restApi.getDataByGetReq(url);
  //   }

  //   getActualServerName(serverList, selectedServerName) 
  //   {
  //     let serverSelectedObj =_.find(serverList, function (each) { return each['value'] == selectedServerName })
  //     let serverLabel = serverSelectedObj['label'] 
  //     let actualServerName;
  //     if(serverLabel != "All Servers") // skip this part when from the serverlist option "all server" is selected
  //     {
  //       actualServerName = serverLabel.substring(serverLabel.indexOf("(") +1, serverLabel.length)    

  //       if(actualServerName.substr(-1) == ")")
  //         actualServerName = actualServerName.substring(0,actualServerName.length-1);
  //     }
  //     return actualServerName;
  //   }

  //   fromEditModeProvider(val) {
  //     this.isFromEditMode.next(val);
  //   }

  //   getServerList(){
  //     return this.serverList;
  //   }
  //   setServerList(data){
  //     return this.serverList =  data;
  //   }

  //   fillDefValInDBDeployment(data){
  //     for (var i in data) {
  //       if (data.hasOwnProperty(i)) {
  //         if (i == LONG_ARG.LONG_FORMAT_TIER_ARG)
  //           this.rTier = true;
  //         if (i == LONG_ARG.LONG_FORMAT_SERVER_ARG)
  //           this.rServer = true;
  //         if (i == LONG_ARG.LONG_FORMAT_MON_TYPE_ARG )
  //           this.driverCls = data[i];
  //         if(i == LONG_ARG.LONG_FORMAT_AUTH_TYPE_ARG)
  //         {
  //           this.authMode = data[i];
  //           if(data[i] == '0')
  //             this.showSID = true;
  //           else
  //             this.showSID = false
  //         }
  //         if(i == LONG_ARG.LONG_FORMAT_DB_QUERY_ARG)
  //           this.dbQuery = data[i]
  //       }
  //     }
  //   }

  //   createMetricHierarchyData(dataLineWithValues,delimiter){
  //     let tempArr = [];
  //     let tempHierArr = [];
  //     for (let i = 1; i < dataLineWithValues.length; i++){
  //       let dataLineByDelimiter = dataLineWithValues[i].trim().replace(/  +/g, ' ');
  //       let splitDataLine = dataLineByDelimiter.split(delimiter);
  //       let metricArr = [];
  //       let hierarchyArr = [];
  //       splitDataLine.map(function(dataLine){
  //       if (isNaN(dataLine) && dataLine.trim() != "null") {
  //         hierarchyArr.push(dataLine.trim());
  //       }
  //       else {
  //         metricArr.push(dataLine.trim());
  //       }
  //       })
  //       tempHierArr.push(hierarchyArr);
  //       tempArr.push(metricArr);
  //     }
  //     this.setMetricHierarchy(tempHierArr)
  //     this.setMetricData(tempArr)
  //   }

  //   getGdfName(){
  //     return this.gdfName;
  //   }

  //   setGdfName(data){
  //     return this.gdfName = data;
  //   }

  //   /** Method to send request to the server to get NewRelic profile */
  //   getNewRelicProfile() {
  //     let url = this.monDataService.getserviceURL() + URL.GET_NEW_RELIC_PROFILE + "?productKey=" + this.monDataService.getProductKey() + "&userName=" + this.monDataService.getUserName()
  //       + "&role=" + this.monDataService.$userRole;
  //     return this._restApi.getDataByPostReq(url)
  //   }

  //   saveNewRelicProfile(operation, oldKey, oldAPIKey, data) {
  //     let url = this.monDataService.getserviceURL() + URL.SAVE_NEW_RELIC_PROFILE + "?productKey=" + this.monDataService.getProductKey() + "&oldKeyName=" + oldKey + "&oldAPIKeyName=" + oldAPIKey +  "&role=" + this.monDataService.$userRole + "&operation=" + operation + "&userName=" + this.monDataService.getUserName();
  //     return this._restApi.getDataByPostReq(url, data);
  //   }

  //   //Method to get server id from server list
  //   getServerId(list, index) {
  //     let serverId;
  //     if (index != -1) // if not found 
  //     {
  //       serverId = list[index];
  //     }
  //     return serverId;

  //   }

  //   /**Method to call service to test API key and Query API key  */
  //   testAPI(apiData) {
  //     let url = this.monDataService.getserviceURL() + URL.TEST_API_KEY + "?apiKey=" + apiData.apiKey + "&qAPIKey=" + apiData.queryApi + "&accountID=" + apiData.accId + "&productKey="+ this.monDataService.getProductKey();
  //     return this._restApi.getDataByGetReq(url);
  //   }

  //   checkIfDuplicateGdfAPI(groupName, prefix){
  //     let url = this.monDataService.getserviceURL() + URL.CHECK_DUPLICATE_GDF_EXISTS_API +
  //      "?groupName=" + groupName + "&prefix=" + prefix + "&productKey="+ this.monDataService.getProductKey();
  //     return this._restApi.getDataByGetReq(url);
  //   }
  // /** Method to send request to the server to get dynatrace profile */
  // getDTProfile() {
  //   let url = this.monDataService.getserviceURL() + URL.GET_DYNATRACE_PROFILE + "?productKey=" + this.monDataService.getProductKey() + "&userName=" + this.monDataService.getUserName()
  //     + "&role=" + this.monDataService.$userRole;
  //   return this._restApi.getDataByPostReq(url)
  // }
  // saveDTProfile(operation,oldToken, data) {
  //   let url = this.monDataService.getserviceURL() + URL.SAVE_DYNATRACE_PROFILE + "?productKey=" + this.monDataService.getProductKey() +  "&oldToken=" + oldToken +  "&role=" + this.monDataService.$userRole + "&operation=" + operation + "&userName=" + this.monDataService.getUserName();
  //   return this._restApi.getDataByPostReq(url, data);
  // }
}
