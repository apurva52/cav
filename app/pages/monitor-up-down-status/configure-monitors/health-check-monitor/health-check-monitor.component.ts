import { Component, OnInit, Input, ChangeDetectorRef, ViewChild } from '@angular/core';
import { MonConfigurationService } from '../../../monitor-up-down-status/service/mon-configuration.service';
import * as _ from "lodash";
import { UtilityService } from '../../../monitor-up-down-status/service/utility.service';
import { HealthCheckMonData } from '../../../monitor-up-down-status/configure-monitors/add-monitor/containers/health-check-data';
import { HealthCheckTableData } from '../../../monitor-up-down-status/configure-monitors/add-monitor/containers/health-check-tabledata';
import { ImmutableArray } from '../../../monitor-up-down-status/configure-monitors/add-monitor/containers/immutable-array';
import { MonDataService } from '../../service/mon-data.service';
import { GlobalProps } from '../../../monitor-up-down-status/configure-monitors/add-monitor/containers/global-prop';
import { HealthCheckParams } from '../../../monitor-up-down-status/configure-monitors/add-monitor/containers/health-check-params';
import * as COMPONENT from '../../../monitor-up-down-status/configure-monitors/add-monitor/constants/monitor-configuration-constants';
import { TableData } from '../../../monitor-up-down-status/configure-monitors/add-monitor/containers/table-data';
import { Subscription } from 'rxjs';
import { ConfirmationService, MessageService, TreeNode } from 'primeng';
import { CustomMonitorService } from '../add-custom-monitor/services/custom-monitor.service';
import { MonitorupdownstatusService } from '../../service/monitorupdownstatus.service';
import { ConfiguredMonitorInfoComponent } from '../configured-monitor-info/configured-monitor-info.component';
import { Location } from '@angular/common';

@Component({
  selector: 'app-health-check-monitor',
  templateUrl: './health-check-monitor.component.html',
  styleUrls: ['./health-check-monitor.component.scss']
})

export class HealthCheckMonitorComponent implements OnInit {
  @ViewChild(ConfiguredMonitorInfoComponent) monInfoChild: ConfiguredMonitorInfoComponent;
  @Input()
  item: TableData;
  /* Available Tree nodes. */
  nodes: TreeNode[];
  displayDialog: boolean = true; //This flag is used to make dialog for show hidden monitors visible
  healthCheckTableData: HealthCheckTableData
  showdialog: boolean = false;
  checked: boolean = false; //This flag is used to bind value of the checkbox
  isFromTest: boolean = false;
  tierList: any[] = [];
  serverList: any[] = [];
  tierHeadersList: any[] = [];
  heathCheckMonData: HealthCheckMonData;
  heathCheckMonitorData: TreeNode[] = [];
  tierNode: HealthCheckTableData;
  serverNode: HealthCheckTableData;
  healthChkTypeNode: HealthCheckTableData;
  healthCheckList: any[] = []; //This variable is used to store the options for the health check type
  topoName: string;
  userName: string;
  testRunNumber: number;
  monName: string;
  profileName: string;
  mjsonName: string;
  globalProps: GlobalProps;
  healthCheckParam: HealthCheckParams;
  tempId: number = 0; //This variable is used to hold temporary id of the selected row of gdf details table used in EDIT functionality 
  selectedFile: TreeNode;
  uniqueKey: any[] = [];
  editMode: boolean = false;
  enableHealthCheckMon: boolean = false; //flag variable for checkbox to enable health check monitor
  enableOverallServerHealthStats: boolean = true; //flag variable for checkbox to enable Overall server health stats monitor
  tierNameList: any[] = [];
  allTierServerList = {};
  selectedRowId: string;
  selectedRowkey;  // this is used to hold the key combination for the selected row having tier,server,health check type and instance name in case of HTTP and socket
  selectedRowDataForEdit; // used to hold the selected row data at EDIT time.
  runTimeMode: number;
  userRole: string;   // used to restrict guest user
  showTestPatternDailog: boolean = false; // show test pattern dailog
  testPatternVal: any[] = []; // datatable value for Matched Tier datatable
  modeStatus: boolean = false;
  enableServerHealthExt: boolean = false; //flag variable for checkbox to enable server health extended stats(V2) monitor.
  enableOverallExt: boolean = false; //flag variable for checkbox to enable Overall server health extended stats(V2) monitor
  gdfNameforHC: string = ''; // variable to pass the gdf name for each of agentless monitors.
  contentList: any[] = []; //This variable is used to store the options for the Content Matching
  methodList: any[] = []; //This variable is used to store the options for the Method (get/post)
  isFromHealthCheckDailog: boolean = false;
  subscription: Subscription;
  saveSubscription: Subscription;
  tableInfo: any[] = []; // array for sending columns index user wants to show in UI.
  agentTierList: any[] = []; // added for agent tier list dropdown
  agentServerList: any[] = []; // added for agent server list dropdown
  loading: boolean = false; // loading spinner.
  serverHealthEnable: boolean = true; // flag for enable/disable of server health monitor
  agentServer: string = "";
  agentTier: string = "";
  profileDesc: any;
  tierName: any;
  serverName: any;
  rejectVisible: boolean = true;
  acceptLable: string = "Yes";
  operation: string = "add";  //check if it add/update mode
  gMonId: string = "-1";
  objectId: string = "-1";  // Object ID
  addEditLabel: string = "Add";
  techName = "healthCheck";
  deleteMonConf: Subscription; // to detect delete operation
  tableTierCol:any[];
  constructor(private monConfServiceObj: MonConfigurationService,
    private monitorupdownService: MonitorupdownstatusService,
    private cd: ChangeDetectorRef,
    private confirmationService: ConfirmationService,
    private customMonService: CustomMonitorService,
    public monDataService: MonDataService,
    private messageService: MessageService,
    private _location: Location,
  ) { }

  ngOnInit() {
    this.tableTierCol = [
      { field: "tierName", header: 'Tier Name' }
    ]

    this.tableInfo = [
      { field: "tierInfo", header: 'Tier Information', visible: true },
      { field: "monInfo", header: 'Monitors', visible: true },
    ]

    this.isFromHealthCheckDailog = this.monConfServiceObj.IsFromHealthCheckDailog(); // if true that means it is from health check monitor button

    this.tierHeadersList = this.customMonService.getTierHeaderList();
    let tierNameList = [];
    this.tierHeadersList.map(function (each) {
      if (each.value > -1) {
        tierNameList.push(each.label)
      }
    })

    this.tierNameList = tierNameList;
    this.tierList = this.agentTierList = UtilityService.createDropdown(tierNameList);
    this.tierList = this.tierList.concat({ label: COMPONENT.OTHERS_KEY, value: COMPONENT.OTHERS_KEY });

    this.globalProps = new GlobalProps();
    this.monitorupdownService.setHealthCheckTreeTableData(this.heathCheckMonitorData);
    let that = this;
    this.heathCheckMonData = new HealthCheckMonData();

    //creating dropdown list for health check type
    let healthChkLabel = ['Ping', 'HTTP', 'Socket'];
    let healthCheckVal = ['Ping', 'Http', 'Socket'];
    this.healthCheckList = UtilityService.createListWithKeyValue(healthChkLabel, healthCheckVal);

    //creating dropdown list for health check type
    let contentLabel = ['None', 'Text', 'Pattern'];
    let contentVal = ['0', '1', '2'];
    this.contentList = UtilityService.createListWithKeyValue(contentLabel, contentVal);

    //creating dropdown list for health check type
    let methodLabel = ['get', 'post'];
    let methodVal = ['get', 'post'];
    this.methodList = UtilityService.createListWithKeyValue(methodLabel, methodVal);

    this.saveSubscription = this.monConfServiceObj.$isFromHCSave.subscribe((res) => {
      if (res) {
        // clear tree structure data on save from the configuration screen
        that.heathCheckMonitorData = [];
        that.monitorupdownService.setHealthCheckTreeTableData(that.heathCheckMonitorData);
        that.heathCheckMonitorData = [...that.heathCheckMonitorData]
      }
    });
    
    this.monitorupdownService.getConfigInfo(COMPONENT.TECH_HEALTH_CHECK).subscribe(res => {
      this.monInfoChild.getTableData(res)
    })
    
    
    if (this.monitorupdownService.gMonId !== "-1") {
      this.loading = true;
      this.monitorupdownService.getHealthChkMonData(this.monitorupdownService.gMonId).subscribe(res=>{
        res['gMonId'] = this.monitorupdownService.gMonId;
        res['objID'] = "-1";
        this.editData(res);
    })
     }

   // Bug 110416
   this.deleteMonConf = this.monitorupdownService.$deleteMonConf.subscribe((res) => {
    if(res){
      this.resetFormOnSave();
    }
 });
  }

  /**
   * Need to create in case of data receiving from server
   * @param heathCheckMonitorData 
   */
  createUniqueKeyForInstanceValidations(heathCheckMonitorData) {
    let uniqueKey = [];
    let that = this;
    heathCheckMonitorData.map(function (each) {
      let tierName = each['data']['nodeName'];
      let serverList = each['children'];
      serverList.map(function (each) {
        let serverName = each['data']['nodeName'];
        let healthChkList = each['children'];
        healthChkList.map(function (eachType) {
          let helthChkTypeName = eachType['data']['nodeName'];
          let key = tierName + serverName + helthChkTypeName + eachType['data']['instanceInfo'][0]['instName'];
          uniqueKey.push(key);

          if (that.tierNameList.indexOf(tierName) == -1) {
            eachType['data']['instanceInfo'][0]['customServerName'] = serverName;
            eachType['data']['instanceInfo'][0]['customTierName'] = tierName;
          }
        })
      })
    })
    this.uniqueKey = uniqueKey;
  }

  getServerListData(tierId) {
    this.loading = true;
    this.monitorupdownService.getServerList(tierId)
      .subscribe(data => {
        this.loading = false;
        let dName = [];
        let sName = [];
        data.map(each => {
          if (each['id'] >= 0) {
            sName.push(each['sName']);
            dName.push(each['dName']);
          }
        })

        this.serverList = UtilityService.createListWithKeyValue(dName, sName);
        this.cd.detectChanges();

      })
  }


  onTierChange(tierName) {
    let tierInfo;
    if (tierName != COMPONENT.OTHERS_KEY) // if tier is Others that means no request to be sent to the server for getting the tierlist.
    {
      tierInfo = _.find(this.tierHeadersList, function (each) { return each['label'] === tierName })
      this.heathCheckMonData.patternEnable = false; // for bug 79429- UNABLE TO CONFIGURE HTTPS HEALTH CHECK TYPE IN GUI.
      this.patternEnableDisable(this.heathCheckMonData.patternEnable); // for bug 79429- UNABLE TO CONFIGURE HTTPS HEALTH CHECK TYPE IN GUI.
    }

    /*** To get the server list in the dropdown ****/
    /*** Here unshift is used to insert element at 0 position of array 
     *** if Others is slectede for tiername then there should not be any request send to the server for getting the serverList**/

    if (tierInfo) {
      this.getServerListData(tierInfo.value)
    }
    this.heathCheckMonData.host = '';
  }

  // dialogCloseEvent($evt?: any) {
  //   if (this.dialogRef) {
  //     this.dialogRef.close();
  //   }
  // }

  ngOnDestroy() {
    this.monConfServiceObj.clearHideShowMonList();
    this.monitorupdownService.gMonId = "-1"
    if (this.subscription)
      this.subscription.unsubscribe();

    if (this.saveSubscription)
      this.saveSubscription.unsubscribe();

    if(this.deleteMonConf)
      this.deleteMonConf.unsubscribe();
    
  }


  validateData(heathCheckMonData) {
    if (heathCheckMonData.healthCheckType == "Socket" || heathCheckMonData.healthCheckType == "Http") {
      // for bug 61507 - instance name is mandatory in case of use topology option also.
      if (heathCheckMonData.instName == '') {
        // this.messageService.errorMessage("Please fill Instance Name");
        this.messageService.add({ severity: COMPONENT.SEVERITY_ERROR, summary: COMPONENT.SUMMARY_ERROR, detail: 'Please fill Instance Name' });
        return false;
      }
    }

    /*Check for whether tier is selected or not*/
    if (heathCheckMonData.tierName == '') {
      // this.messageService.errorMessage("Please select Tier");
      this.messageService.add({ severity: COMPONENT.SEVERITY_ERROR, summary: COMPONENT.SUMMARY_ERROR, detail: 'Please select Tier' });
      return false;
    }

    /*Check for whether server is selected or not*/
    if (heathCheckMonData.tierName != "Others" && heathCheckMonData.serverName == '') {
      // this.messageService.errorMessage("Please select Server");
      this.messageService.add({ severity: COMPONENT.SEVERITY_ERROR, summary: COMPONENT.SUMMARY_ERROR, detail: 'Please select Server' });
      return false;
    }


    return true;
  }


  saveData() {
    let validateData = this.validateData(this.heathCheckMonData);
    if (!validateData) {
      return;
    }

    this.validateHttpData();

    /**This is to validate custom tier name in case when pattern is enabled
     * Custom tier name is alphanumeric and can contain only asterisk.
     */
    if (this.heathCheckMonData.patternEnable) {
      let validateTierName = this.validateTierPattern(this.heathCheckMonData.customTierName);
      if (!validateTierName) {
        // this.messageService.errorMessage("Enter valid tier name. &#013;No special characters except (* and -) are allowed.")
        this.messageService.add({ severity: COMPONENT.SEVERITY_ERROR, summary: COMPONENT.SUMMARY_ERROR, detail: 'Enter valid tier name. &#013;No special characters except (* and -) are allowed.' });
        return;
      }
    }


    //case when user does not change instance name in EDIT mode and update any of the rest fields.
    if (this.editMode) {
      this.deleteKeyEntryfromUniqueKeyArr(this.selectedRowkey)
    }

    /**
     * These method is added as 
     * per the bug-id:51240
     */
    if (this.heathCheckMonData.tierName == 'All Tiers') {
      let that = this;
      if (this.allTierServerList != null && Object.keys(this.allTierServerList).length == 0) {
        this.tierHeadersList.map(function (eachTier) {
          if (eachTier.id <= -1)  //to skip "ALl Tier" && tierGroup 
            return null;

          this.monitorupdownService.getServerList(eachTier.id).subscribe(data => {
            that.allTierServerList[eachTier.name] = data;
          })
        })
        setTimeout(() => {
          this.createNodesForAllTierServer();
          this.heathCheckMonData = new HealthCheckMonData;
        }, 2000);
      }
      else { //case where we have map of tier and all serverlists .
        this.createNodesForAllTierServer();
        this.heathCheckMonData = new HealthCheckMonData;
      }
    }
    else if (this.heathCheckMonData.serverName == 'COMPONENT.ALL_SERVERS_KEY') {
      let that = this;
      this.serverList.map(function (eachServer) {
        if (eachServer.value != 'COMPONENT.ALL_SERVERS_KEY') {
          that.heathCheckMonData.serverName = eachServer.value;
          that.setHostServerName(eachServer.label);     //eachServer.label  = serverDisplayName(serverName)
          that.saveAndCreateTreeTableData();
        }
      })
      this.heathCheckMonData = new HealthCheckMonData;
    }
    else {
      this.saveAndCreateTreeTableData();
      this.heathCheckMonData = new HealthCheckMonData;
    }
  }

  setHostServerName(serverName) {
    if (this.heathCheckMonData.healthCheckType != "Http") {
      let actualServerName = serverName.substring(serverName.indexOf("(") + 1, serverName.length)
      if (actualServerName.substr(-1) == ")")
        actualServerName = actualServerName.substring(0, actualServerName.length - 1);

      this.heathCheckMonData.host = actualServerName;
    }
  }

  createNodesForAllTierServer() {
    for (var key in this.allTierServerList) {
      let serverList = this.allTierServerList[key];
      let newServerList = UtilityService.createListWithKeyValue(serverList["label"], serverList["value"]);

      this.heathCheckMonData.tierName = key;
      let that = this;
      newServerList.map(function (eachServer) {
        that.heathCheckMonData.serverName = eachServer.value;
        that.setHostServerName(eachServer.label);
        that.saveAndCreateTreeTableData();
      })
    }
  }

  getNodeId(treeTableData) {
    let newId = "0";
    if (treeTableData != null && treeTableData.length != 0) {
      newId = treeTableData[treeTableData.length - 1]["id"];
      let arrSplitId = (newId + "").split(".");
      newId = arrSplitId[arrSplitId.length - 1];
    }
    newId = newId != null ? newId : "0";
    return Number(newId);
  }

  /*this method is used to add data for the health check mon*/
  saveAndCreateTreeTableData() {
    let treeTableData = this.monitorupdownService.getHealthCheckTreeTableData();
    this.tierNode = new HealthCheckTableData();

    let tierName;
    let serverName;
    let arr = [];
    let newHealthChkMonDataOj = Object.assign({}, this.heathCheckMonData);
    arr.push(newHealthChkMonDataOj);

    if (this.heathCheckMonData.tierName != "Others") {
      tierName = this.heathCheckMonData.tierName;
      serverName = this.heathCheckMonData.serverName;
    }
    else {
      tierName = this.heathCheckMonData.customTierName;
      serverName = this.heathCheckMonData.customServerName;
      if (this.heathCheckMonData.patternEnable) {
        serverName = "COMPONENT.ALL_SERVERS_KEY"
        this.heathCheckMonData.customServerName = "COMPONENT.ALL_SERVERS_KEY";
      }
    }

    let healthCheckTypeName = this.heathCheckMonData.healthCheckType;
    let tierObj = _.find(treeTableData, function (each) {
      return each.data.nodeName == tierName
    });
    if (tierObj == null) {
      let id = this.getNodeId(treeTableData) + 1 + "";
      let arr2 = [];
      // let newHealthChkMonDataOj2 = Object.assign({},this.heathCheckMonData);
      // arr2.push(newHealthChkMonDataOj2);
      let tierNode = {
        "nodeName": tierName,
        "arguments": this.heathCheckMonData.enableTier ? "true" : "false",
        "leaf": false,
        "instanceInfo": arr2,
        "enabled": true
      }

      let arr3 = [];
      //  let newHealthChkMonDataOj3 = Object.assign({},this.heathCheckMonData);
      //  arr3.push(newHealthChkMonDataOj3); 
      let serverNode = {
        "nodeName": serverName,
        "arguments": this.heathCheckMonData.enableServer ? "true" : "false",
        "leaf": false,
        "instanceInfo": arr3,
        "enabled": true
      }


      this.healthChkTypeNode = new HealthCheckTableData();
      this.healthChkTypeNode.nodeName = healthCheckTypeName;
      let healthChkTypeString = this.createHealthTypeString(this.heathCheckMonData);

      let healthChkTypeNode = {
        "nodeName": this.heathCheckMonData.healthCheckType,
        "arguments": healthChkTypeString,
        "instanceInfo": arr,
        "leaf": true,
        "enabled": false
      }

      let key = tierName + serverName + healthCheckTypeName + this.heathCheckMonData.instName;
      this.uniqueKey.push(key);

      let serChildArr = [];
      let healthChkTypeArr = [];
      healthChkTypeArr.push({
        "id": id + ".1.1",
        "data": healthChkTypeNode,
        "children": [],
        "leaf": true
      })


      let that = this;
      serChildArr.push({
        "id": id + ".1",
        "data": serverNode,
        "children": healthChkTypeArr,
        "leaf": false
      })


      let newTierNode = {
        "id": id,
        "data": tierNode,
        "leaf": false,
        "children": serChildArr,
      }

      /**
        * Case in EDIT MODE when user updates any specific tier and server and changes
        * it to new tier and server whose entry does not exist in the treetable
        * then we need to delete that selected row for edit and add new entry
        */
      if (this.editMode) {
        this.deleteEntryOnUpdate();
      }

      this.heathCheckMonitorData = ImmutableArray.push(this.heathCheckMonitorData, newTierNode);
      this.monitorupdownService.setHealthCheckTreeTableData(this.heathCheckMonitorData);
      // this.heathCheckMonData = new HealthCheckMonData();
    }
    else {
      //alredy tier Node is  there now checking for server Node alreday exist or not
      if (tierObj.children.length != 0) {
        let serverArr = tierObj.children;
        let existingServerNode = _.find(serverArr, function (each) {
          return each.data.nodeName == serverName
        });
        if (existingServerNode != null) {
          let typeNodeArr = existingServerNode.children;
          let healthChkTypeArr = typeNodeArr;
          let healthChkNodeId = existingServerNode['id'] + "." + (this.getNodeId(Object.assign([], healthChkTypeArr)) + 1);

          if (healthChkTypeArr.length != 0) {
            let that = this;
            let healthCheckTypeObj = {};

            if (healthCheckTypeName == "Ping") // in case of ADD in PING we need to check on the basis of health check type and for HTTP and SOCKET we use id
              healthCheckTypeObj = _.find(healthChkTypeArr, function (each) {
                return each.data.nodeName == healthCheckTypeName
              });
            else {

              healthCheckTypeObj = _.find(healthChkTypeArr, function (each) {
                return each['id'] == that.selectedRowId
              });
            }

            if (healthCheckTypeObj == null) {
              let key = tierName + serverName + healthCheckTypeName + this.heathCheckMonData.instName;
              if (healthCheckTypeName != "Ping" && this.uniqueKey.indexOf(key) != -1) {
                // this.messageService.errorMessage("This health check  is already configured on tier " + tierName + " server " + serverName + " and  instance " + this.heathCheckMonData.instName);
                this.messageService.add({ severity: COMPONENT.SEVERITY_ERROR, summary: COMPONENT.SUMMARY_ERROR, detail: 'This health check  is already configured on tier' + tierName + ' server ' + serverName + ' and  instance ' + this.heathCheckMonData.instName });
                this.editMode = false;
                return;
              }
              this.addhealthCheckNode(existingServerNode, this.heathCheckMonData, healthChkNodeId)

              if (this.editMode) {
                this.deleteEntryOnUpdate();
              }
              this.uniqueKey.push(key)
            }
            else // when healthCheckTypeObj is not empty
            {
              /**
               * cases for ADD and EDIT in health check type PING
               */
              if (healthCheckTypeName == "Ping") {
                let key = tierName + serverName + healthCheckTypeName + this.heathCheckMonData.instName;
                if (!this.editMode) // ADD MODE for PING
                {
                  // this.messageService.errorMessage("This health check  is already configured on tier " + tierName + " and server " + serverName);
                  this.messageService.add({ severity: COMPONENT.SEVERITY_ERROR, summary: COMPONENT.SUMMARY_ERROR, detail: 'This health check  is already configured on tier ' + tierName + ' and server ' + serverName });
                  this.editMode = false;
                  return false;
                }
                else  // EDIT MODE for PING
                {
                  if (this.uniqueKey.indexOf(key) != -1) // if key combination already exists then prompt error msg else update
                  {
                    // this.messageService.errorMessage("This health check is already configured on tier " + tierName + " and server " + serverName);
                    this.messageService.add({ severity: COMPONENT.SEVERITY_ERROR, summary: COMPONENT.SUMMARY_ERROR, detail: 'This health check is already configured on tier ' + tierName + ' and server ' + serverName });
                    this.uniqueKey.push(this.selectedRowkey); // no action in this case is performed but at starting of this method this key is deleted from uniqueKeyArr
                    this.editMode = false;
                    return;
                  }
                  this.updateHealthCheckType(healthCheckTypeObj, this.heathCheckMonData); // update treetable info for PING
                  this.uniqueKey.push(key);
                }
              }
              else {
                /**
                 *  Cases for ADD and EDIT in HTTP and SOCKET
                 */
                let key = tierName + serverName + healthCheckTypeName + this.heathCheckMonData.instName;
                if (this.editMode) // EDIT MODE for HTTP And SOCKET
                {
                  if (this.uniqueKey.indexOf(key) != -1) {
                    // this.messageService.errorMessage("This health check  is already configured on tier " + tierName + " server " + serverName + " and  instance " + this.heathCheckMonData.instName);
                    this.messageService.add({ severity: COMPONENT.SEVERITY_ERROR, summary: COMPONENT.SUMMARY_ERROR, detail: 'This health check  is already configured on tier ' + tierName + ' server ' + serverName + ' and  instance ' + this.heathCheckMonData.instName });
                    this.uniqueKey.push(this.selectedRowkey); // no action in this case is performed but at starting of this method this key is deleted from uniqueKeyArr
                    this.editMode = false;
                    return;
                  }
                  this.updateHealthCheckType(healthCheckTypeObj, this.heathCheckMonData);
                  this.uniqueKey.push(key);
                }
                else // for ADD in HTTP and SOCKET
                {
                  if (this.uniqueKey.indexOf(key) != -1) // if key combination of tier, server,health check type and instance name already exists then do not add that entry
                  {
                    // this.messageService.errorMessage("This health check  is already configured on tier " + tierName + " server " + serverName + "and  instance " + this.heathCheckMonData.instName);
                    this.messageService.add({ severity: COMPONENT.SEVERITY_ERROR, summary: COMPONENT.SUMMARY_ERROR, detail: 'This health check  is already configured on tier ' + tierName + ' server ' + serverName + 'and  instance ' + this.heathCheckMonData.instName });
                    this.uniqueKey.push(this.selectedRowkey);
                    this.editMode = false;
                    return;
                  }
                  else // if entry of the key does not exist then add new node 
                  {
                    this.uniqueKey.push(key);
                    this.addhealthCheckNode(existingServerNode, this.heathCheckMonData, healthChkNodeId);
                  }
                }
              }
            }
          }
          else
            this.addhealthCheckNode(existingServerNode, this.heathCheckMonData, healthChkNodeId);
        }
        else {
          /**
           * Case for ADD and EDIT when for existing tier and there is change in server node
           */
          this.addServerNode(tierObj, this.heathCheckMonData);
          if (this.editMode) // if EDIT MODE the delete the existing server node and add new node 
          {
            this.deleteEntryOnUpdate();
          }
        }
      }
      else {
        this.addServerNode(tierObj, this.heathCheckMonData);
      }
    }
    if (!this.editMode) {
      // this.messageService.successMessage("You have successfully added health check monitor");
      this.messageService.add({ severity: COMPONENT.SEVERITY_SUCCESS, summary: COMPONENT.SUMMARY_SUCCESS, detail: 'You have successfully added health check monitor' });
    }
    else {
      // this.messageService.successMessage("You have successfully updated health check monitor");
      this.messageService.add({ severity: COMPONENT.SEVERITY_SUCCESS, summary: COMPONENT.SUMMARY_SUCCESS, detail: 'You have successfully updated health check monitor. ' });
      this.editMode = false;
    }
    this.heathCheckMonitorData = [...this.heathCheckMonitorData]


    if (!this.isFromHealthCheckDailog) {
      this.monConfServiceObj.setHealthCheckData(this.heathCheckMonitorData);
      this.monConfServiceObj.setGlobalHCProps(this.globalProps);
    }

  }


  onCheckBoxChange(data, value) {
    data.data.arguments = value + "";
  }

  addServerNode(tierObj, heathCheckMonData) {
    //When tierName is 'Others' then servername should be customServerName as provided by the user.
    let newHealthChkNode = Object.assign({}, this.heathCheckMonData);
    let arr = [];
    arr.push(newHealthChkNode)

    let serverNodeData = {
      "nodeName": this.heathCheckMonData.serverName != '' ? this.heathCheckMonData.serverName : this.heathCheckMonData.customServerName,
      "arguments": this.heathCheckMonData.enableServer ? "true" : "false",
      "leaf": false,
      "instanceInfo": arr,
      "enabled": true
    }

    let id = tierObj.id + "." + (this.getNodeId(Object.assign([], tierObj.children)) + 1);
    let serverNode = {
      "id": id,
      "data": serverNodeData,
      "children": [],
      "leaf": false
    }

    let healthChkID = serverNode.id + "." + (this.getNodeId(Object.assign([], serverNode.children)) + 1);
    this.addhealthCheckNode(serverNode, heathCheckMonData, healthChkID);
    tierObj.children.push(serverNode)
  }


  addhealthCheckNode(serverNode, healthCheckDataMon, id) {
    let healthChkTypeString = this.createHealthTypeString(healthCheckDataMon);
    let arr = [];
    let newHealthChkNode = Object.assign({}, this.heathCheckMonData);
    arr.push(newHealthChkNode);
    let healthChkTypeNode = {
      "nodeName": this.heathCheckMonData.healthCheckType,
      "arguments": healthChkTypeString,
      "instanceInfo": arr,
      "leaf": true
    }

    serverNode.children.push({
      "id": id,
      "data": healthChkTypeNode,
      "children": [],
      "leaf": true
    })


  }

  saveFinalData() {
    this.getMSettings();         // For Maintenance Settings(getting current host,port,protocol)
    if (!this.validataGlobalData(this.globalProps)) {
      return;
    }
    this.heathCheckMonData = new HealthCheckMonData();
  }

  // For Maintenance Settings(getting current host,port,protocol)
  getMSettings() {
    this.globalProps.mPro = window.location.protocol;
    this.globalProps.mHost = window.location.hostname;
    if (window.location.port != "") {
      this.globalProps.mPort = window.location.port;
    }
    else {
      if (window.location.protocol == "http:")
        this.globalProps.mPort = "80";
      else if (window.location.protocol == "https:")
        this.globalProps.mPort = "443";
      else
        console.log("Invalid Protocol");
    }
  }

  validataGlobalData(globalData) {
    if (globalData.pingPkt == null || globalData.pingPkt == '') {
      // this.messageService.errorMessage("Enter Packet value for Ping health check settings")
      this.messageService.add({ severity: COMPONENT.SEVERITY_ERROR, summary: COMPONENT.SUMMARY_ERROR, detail: 'Enter Packet value for Ping health check settings' });
      return false;
    }

    if (globalData.pingIntrvl == null || globalData.pingIntrvl == '') {
      this.messageService.add({ severity: COMPONENT.SEVERITY_ERROR, summary: COMPONENT.SUMMARY_ERROR, detail: 'Enter Interval for Ping health check settings' });
      return false;
    }

    if (globalData.pingIntrvl == null || globalData.pingTP == '') {
      this.messageService.add({ severity: COMPONENT.SEVERITY_ERROR, summary: COMPONENT.SUMMARY_ERROR, detail: 'Enter Thread Pool value for Ping health check settings' });
      return false;
    }

    if (globalData.httpSc == null || globalData.httpSc == '') {
      this.messageService.add({ severity: COMPONENT.SEVERITY_ERROR, summary: COMPONENT.SUMMARY_ERROR, detail: 'Enter Status code for Http health check settings' });
      return false;
    }


    if (globalData.httpCTO == null || globalData.httpCTO == '') {
      // this.messageService.errorMessage("Enter Connection Time Out value for Http health check settings")
      this.messageService.add({ severity: COMPONENT.SEVERITY_ERROR, summary: COMPONENT.SUMMARY_ERROR, detail: 'Enter Connection Time Out value for Http health check settings' });
      return false;
    }

    if (globalData.httpRTO == null || globalData.httpRTO == '') {
      this.messageService.add({ severity: COMPONENT.SEVERITY_ERROR, summary: COMPONENT.SUMMARY_ERROR, detail: 'Enter Response Time Out value for Http health check settings' });
      return false;
    }

    if (globalData.sockeTo == null || globalData.sockeTo == '') {
      this.messageService.add({ severity: COMPONENT.SEVERITY_ERROR, summary: COMPONENT.SUMMARY_ERROR, detail: 'Enter  Time Out value for Socket health check settings' });
      return false;
    }
    return true;
  }

  /*
   * This method is called when user clicks on the edit option 
   * for updating the selected treetable configuration.
   */

  editHealthMonData(rowData) {
    this.selectedRowDataForEdit = rowData
    let selectedRowId = rowData.id;
    /**
     * It is used to delete the server/tier node in case of edit and adding new tier/server node
     * used in method "deleteExistingRowInEdit""
     */
    this.selectedRowId = selectedRowId;
    let selectedRowIdArr = selectedRowId.split(".");
    let selectedRow = rowData.data.instanceInfo[0];

    let newSelectedRowObj = Object.assign({}, selectedRow)
    let tierObj = _.find(this.tierList, function (each) {
      return each['value'] == selectedRow.tierName
    })
    if (tierObj == null || tierObj == undefined) {
      if (selectedRow.tierName != "Others") {   //as when comes from server selectedRow.tierName = "Others" 
        newSelectedRowObj.customTierName = selectedRow.tierName;
        newSelectedRowObj.customServerName = selectedRow.serverName;
        newSelectedRowObj.tierName = "Others";
        newSelectedRowObj.serverName = "";
      }
    }

    this.heathCheckMonData = newSelectedRowObj;

    let tierName = this.heathCheckMonData.tierName;
    if (this.serverList.length == 0) {
      let serverList = this.allTierServerList[tierName];
      if (serverList != null) {
        this.serverList = UtilityService.createListWithKeyValue(serverList["label"], serverList["value"]);
      }
      else {
        //case of data when comes from server
        if (tierName != "Others") // if tier is Others that means no request to be sent to the server for getting the tierlist.
        {
          tierObj = _.find(this.tierHeadersList, function (each) { return each['label'] == tierName })
          if (tierObj != null)
            this.getServerListData(tierObj.value)
        }
      }
    }

    else // need to this again for getting serverlist on edit 
    {
      if (tierName != "Others") // if tier is Others that means no request to be sent to the server for getting the tierlist.
      {
        tierObj = _.find(this.tierHeadersList, function (each) { return each['label'] == tierName })
        if (tierObj != null)
          this.getServerListData(tierObj.value)

      }
    }
    if (tierName == 'Others')
      this.selectedRowkey = this.heathCheckMonData.customTierName + this.heathCheckMonData.customServerName + this.heathCheckMonData.healthCheckType + this.heathCheckMonData.instName
    else
      this.selectedRowkey = this.heathCheckMonData.tierName + this.heathCheckMonData.serverName + this.heathCheckMonData.healthCheckType + this.heathCheckMonData.instName;

    let flag = this.compareVal(newSelectedRowObj);

    this.heathCheckMonData.overideGlobalSettings = flag;
    this.editMode = true;
  }

  deleteNode(nodeArr, idToDelete) {
    nodeArr = nodeArr.filter(function (val) {
      return idToDelete.indexOf(val['id']) == -1;
    })
    return nodeArr;
  }

  deleteTierNode(selectedTierNodeId) {
    this.heathCheckMonitorData = this.deleteNode(this.heathCheckMonitorData, selectedTierNodeId);
    this.monitorupdownService.setHealthCheckTreeTableData(this.heathCheckMonitorData);


    //after update/delete need to set data in service for health check monitor deployment screen
    if (!this.isFromHealthCheckDailog) {
      this.monConfServiceObj.setHealthCheckData(this.heathCheckMonitorData);
      this.monConfServiceObj.setGlobalHCProps(this.globalProps);
    }
  }

  deleteServerNode(arrSplitId, arrId) {
    let tierNodeObj = this.getTierObj(arrSplitId);
    tierNodeObj.children = this.deleteNode(tierNodeObj.children, arrId)
    this.heathCheckMonitorData = [...this.heathCheckMonitorData] // for bug 62945 - updating data on performing delete operation
    this.monitorupdownService.setHealthCheckTreeTableData(this.heathCheckMonitorData);


    //after update/delete need to set data in service for health check monitor deployment screen
    if (!this.isFromHealthCheckDailog) {
      this.monConfServiceObj.setHealthCheckData(this.heathCheckMonitorData);
      this.monConfServiceObj.setGlobalHCProps(this.globalProps);
    }
  }

  deleteHealthChkTypeNode(arrSplitId, arrId) {
    let tierNodeObj = this.getTierObj(arrSplitId);
    let serverNodeObj = this.getServerObj(arrSplitId, tierNodeObj.children);
    serverNodeObj.children = this.deleteNode(serverNodeObj.children, arrId)
    if (this.editMode) {
      if (serverNodeObj.children.length == 0 && tierNodeObj.children.length != 0) {
        let arrId = [];
        arrId.push(serverNodeObj.id) // push selected row's id 
        let arrSplitId = serverNodeObj.id.split(".");
        this.deleteServerNode(arrSplitId, arrId)
      }

      if (tierNodeObj.children.length == 0) // delete tier when no server and health check type is present
      {
        this.deleteTierNode(tierNodeObj['id'])
      }
    }
    this.heathCheckMonitorData = [...this.heathCheckMonitorData] // for bug 62945 - updating data on performing delete operation
    this.monitorupdownService.setHealthCheckTreeTableData(this.heathCheckMonitorData);

    //after update/delete need to set data in service for health check monitor deployment screen
    if (!this.isFromHealthCheckDailog) {
      this.monConfServiceObj.setHealthCheckData(this.heathCheckMonitorData);
      this.monConfServiceObj.setGlobalHCProps(this.globalProps);
    }
  }


  getServerObj(arrSplitId, serverNodeArr) {
    let serverNodeObj = _.find(serverNodeArr, function (each) {
      let serverId = each['id'].split(".");
      return serverId[1] == arrSplitId[1];
    })
    return serverNodeObj;

  }

  getTierObj(arrSplitId) {
    let tierNodeObj = _.find(this.heathCheckMonitorData, function (each) {
      return each['id'] == arrSplitId[0]
    })
    return tierNodeObj;
  }

  getAndDeleteNodeSelected(selectedNode) {
    let selectedNodeId = selectedNode.id;
    let arrId = [];
    arrId.push(selectedNodeId) // push selected row's id 

    let arrSplitId = selectedNodeId.split(".");
    if (arrSplitId.length == 1) {
      this.deleteTierNode(arrId)
    }
    else if (arrSplitId.length == 2) {
      this.deleteServerNode(arrSplitId, arrId)
    }
    else if (arrSplitId.length == 3) {
      let dataObj = selectedNode.data.instanceInfo[0];
      let key = dataObj.tierName + dataObj.serverName + dataObj.healthCheckType + dataObj.instName;
      this.deleteHealthChkTypeNode(arrSplitId, arrId)
      this.deleteKeyEntryfromUniqueKeyArr(key) // to delete the entry from the unique key arr when deletes a particular node 
    }
  }

  /*This method is used to start the test*/
  startTest() {
    this.isFromTest = true;     // this is used for ignoring success saved message
    if (this.heathCheckMonitorData.length == 0) {
      this.messageService.add({ severity: COMPONENT.SEVERITY_ERROR, summary: COMPONENT.SUMMARY_ERROR, detail: 'Enter Health Check Monitor Data to start the test' });
      return false;
    }

    this.confirmationService.confirm({
      message: COMPONENT.START_TEST_MSG + " " + " health check monitor" + '?',
      header: 'Test Monitor Confirmation',
      icon: 'fa fa-question-circle',
      accept: () => {
        this.profileName = this.monConfServiceObj.getProfileName();
        this.userName = this.monDataService.userName;
        this.topoName = this.monConfServiceObj.topoName;
        this.getMSettings();
      },

      reject: () => {
      }
    });

  }

  /*This method is used to delete selected rows*/
  deleteHealthMonData(rowData) {
    let that = this;
    that.rejectVisible = true;
    that.acceptLable = "Yes";
    this.confirmationService.confirm({
      message: COMPONENT.DELETE_SPECIFIC_CONFIGURATION,
      header: 'Delete Confirmation',
      icon: 'fa fa-trash',
      accept: () => {
        that.getAndDeleteNodeSelected(rowData);
        this.resetFields()
      },
      reject: () => {
      }
    });

  }

  overrideGlobalSettings(value) {
    this.heathCheckMonData.httpUrl = '';
    this.heathCheckMonData.httpUser = '';
    this.heathCheckMonData.httpPwd = '';
    this.heathCheckMonData.httpCTO = 10;
    this.heathCheckMonData.httpRTO = 30;
    this.heathCheckMonData.statusCode = "2xx";
    this.heathCheckMonData.pingIntrvl = 0.2;
    this.heathCheckMonData.pingPkt = 5;
    this.heathCheckMonData.sockeTo = 10;
    this.heathCheckMonData.pingInterval = 1;
    this.heathCheckMonData.sktInterval = 1;
    this.heathCheckMonData.httpInterval = 1;

  }


  /**
   * This method is used when user wants to edit
   * at tier/server level and add new tier server node .
   * Then at that case ,since user is performing edit functionalities,old node need to be deleted.
   */

  deleteExistingRowInEdit(rowData) {
    this.getAndDeleteNodeSelected(rowData);
  }

  updateHealthCheckType(healthCheckTypeNode, healthCheckMonData) {
    this.createArguments(healthCheckTypeNode, healthCheckMonData)
    this.editMode = false;
  }

  createArguments(healthCheckTypeNode, healthCheckMonData) {
    let healthChkTypeString = this.createHealthTypeString(healthCheckMonData);
    healthCheckTypeNode.data.arguments = healthChkTypeString;
    healthCheckTypeNode.data.nodeName = healthCheckMonData.healthCheckType // added when in EDIT mode health check type is changed.
    let arr = [];
    arr.push(healthCheckMonData);
    healthCheckTypeNode.data.instanceInfo = arr;
  }

  createHealthTypeString(healthCheckMonData) {

    let healthChkTypeString = '';
    if (this.heathCheckMonData.healthCheckType == "Ping") {
      if (!this.heathCheckMonData.patternEnable) {
        healthChkTypeString = "Host = " + this.heathCheckMonData.host;
      }

      if (this.heathCheckMonData.pingPkt != null && this.heathCheckMonData.pingPkt != -1)
        healthChkTypeString = healthChkTypeString + ", Packet Count = " + this.heathCheckMonData.pingPkt;

      if (this.heathCheckMonData.pingIntrvl != null && this.heathCheckMonData.pingIntrvl != 0)
        healthChkTypeString = healthChkTypeString + ", Wait Interval = " + this.heathCheckMonData.pingIntrvl;

    }

    else if (this.heathCheckMonData.healthCheckType == "Socket") {
      healthChkTypeString = "Host = " + this.heathCheckMonData.host +
        ", Port = " + this.heathCheckMonData.port +
        ", Instance Name = " + this.heathCheckMonData.instName;
      if (this.heathCheckMonData.sockeTo != null && this.heathCheckMonData.sockeTo != -1)
        healthChkTypeString = healthChkTypeString + ", Connection Timeout = " + this.heathCheckMonData.sockeTo;

      if (this.heathCheckMonData.user != null)
        healthChkTypeString = healthChkTypeString + ", User Name = " + this.heathCheckMonData.user;

      if (this.heathCheckMonData.pwd != null)
        healthChkTypeString = healthChkTypeString + ", Password = " + this.heathCheckMonData.pwd;
    }

    else if (this.heathCheckMonData.healthCheckType == "Http") {
      healthChkTypeString = "Url = " + this.heathCheckMonData.url;

      if (this.heathCheckMonData.portForURL != null && this.heathCheckMonData.portForURL != undefined && this.heathCheckMonData.portForURL != -1)
        healthChkTypeString = healthChkTypeString + ", Port for URL  = " + this.heathCheckMonData.portForURL;

      if (this.heathCheckMonData.httpsEnable)
        healthChkTypeString = healthChkTypeString + ", Secure Protocol = " + this.heathCheckMonData.httpsEnable;

      if (this.heathCheckMonData.instName != "")
        healthChkTypeString = healthChkTypeString + ", Instance = " + this.heathCheckMonData.instName;

      if (this.heathCheckMonData.user != null) {
        healthChkTypeString = healthChkTypeString + ", User Name = " + this.heathCheckMonData.user;
      }

      if (this.heathCheckMonData.pwd != null) {
        healthChkTypeString = healthChkTypeString + ", Password = " + this.heathCheckMonData.pwd;
      }
      if (this.heathCheckMonData.httpCTO != null && this.heathCheckMonData.httpCTO != -1) {
        healthChkTypeString = healthChkTypeString + ", Connection Timeout =" + this.heathCheckMonData.httpCTO;
      }
      if (this.heathCheckMonData.httpRTO != null && this.heathCheckMonData.httpCTO != -1) {
        healthChkTypeString = healthChkTypeString + ", Response Timeout = " + this.heathCheckMonData.httpRTO;
      }
      if (this.heathCheckMonData.cntMatch != '0') {
        healthChkTypeString = healthChkTypeString + ", Content Matching = " + this.heathCheckMonData.cntMatch;
      }
      if (this.heathCheckMonData.header != "") {
        healthChkTypeString = healthChkTypeString + ", HTTP Header = " + this.heathCheckMonData.header;
      }
    }
    if (this.heathCheckMonData.patternEnable) {
      /**
        * Case :-Initially custom tier and server and host are provided.
        * In ideal case for edit, if we enable pattern then for server name it should come "All server"
        * and host should be blank, so setting it to blank.
        */
      this.heathCheckMonData.host = '';

      healthChkTypeString = healthChkTypeString + ", Enable Pattern = " + this.heathCheckMonData.patternEnable;
    }

    if (healthChkTypeString.charAt(0) == ",") {
      healthChkTypeString = healthChkTypeString.substring(1, healthChkTypeString.length)
    }
    return healthChkTypeString;
  }



  /*This method is called when user clicks on cancel button to close the configuration without making any changes.
  * This method shows a new form to perform ADD operation.
  */
  closeConfiguration() {
    this.heathCheckMonData = new HealthCheckMonData(); // for clearing form fields.
    this.editMode = false;
  }

  /*Method called when server is selected from dropdown list*/
  onServerChange(serverName) {
    this.heathCheckMonData.host = ''
    let serverSelected = _.find(this.serverList, function (each) { return each['value'] == serverName })

    if (serverSelected['label'] != "COMPONENT.ALL_SERVERS_KEY") // skip this part when from the serverlist option all server is selected
      this.setHostServerName(serverSelected['label']);

  }

  /*This method is used to delete the entry of the key combination(tier + server + healthCheck type + instance name) in case of HTTP and socket*/
  deleteKeyEntryfromUniqueKeyArr(key) {
    let arr = [];
    arr.push(key);
    this.uniqueKey = this.uniqueKey.filter(function (val) { //for case of editing the row not changing the instance name in case of HTTP and socket
      return arr.indexOf(val) == -1;
    })
  }

  /** This method is used to validate custom tier name provided by the user.
    * Custom tier name can contain only alpha-numeric characters and asterisk in special characters.
    */
  validateTierPattern(value) {
    if (/^[a-zA-Z0-9*-]*$/.test(value)) //Bug 61514 - supported special characters like -
      return true;

    return false;
  }

  /**
   *  Method called when EDIT functionality is performed for updating with the new values.
   */
  deleteEntryOnUpdate() {
    this.deleteExistingRowInEdit(this.selectedRowDataForEdit);
  }

  /**Method called when health check type is changed */
  onTypeChange(hcType) {
    this.heathCheckMonData = new HealthCheckMonData();
    this.heathCheckMonData.healthCheckType = hcType; // for getting configuration fields corresponding to each health check type on changing from dropdown.
  }

  /**
   * This method is called at edit time when user wants to edit any health check monitor configuration.
   * In this method we compare health check monitor configuration data with the global properties for 
   * the checkbox value of the override global settings property.
   * @param instanceInfo 
   */
  compareVal(instanceInfo): boolean {
    let flag = false;
    this.globalProps = new GlobalProps();
    if (instanceInfo.healthCheckType == 'Ping') {
      if ((instanceInfo.pingIntrvl != undefined && instanceInfo.pingIntrvl > 0) || (instanceInfo.pingPkt != undefined && instanceInfo.pingPkt > 0)) {
        flag = true
      }
    }
    else if (instanceInfo.healthCheckType == 'Http') {
      if ((instanceInfo.httpUrl != null) && (instanceInfo.httpUser != null) && (instanceInfo.httpPwd != null) && (instanceInfo.httpCTO > 0) && (instanceInfo.httpRTO > 0) &&
        (instanceInfo.statusCode != undefined && instanceInfo.statusCode != 'NA') && (instanceInfo.httpInterval != 1)) {
        flag = true;
      }
    }
    else if (instanceInfo.healthCheckType == 'Socket') {
      if (instanceInfo.sockeTo != undefined && instanceInfo.sockeTo > 0) {
        flag = true;
      }
    }
    return flag;
  }

  /*This method is used to apply changes at runtime*/
  confirmApplyRunTimeChanges() {
    this.confirmationService.confirm({
      message: 'Are you sure to apply run-time changes?',
      header: 'Apply Runtime Changes',
      icon: 'fa fa-question-circle',
      accept: () => {
        this.saveFinalData();
      },
      reject: () => { }
    });

  }

  /**
   * This method is used to match the pattern provided in the custom tier name
   * @param customTierName 
   */
  // testPattern(customTierName) {
  //   // this.healthChkMonServiceObj.matchTierPattern(customTierName).then(data=>{
  //   // this.testPatternVal = data;
  //   this.showTestPatternDailog = true;
  // }

  testPattern(customTierName){
    this.customMonService.matchTierPattern(customTierName).subscribe(data=>{
        this.testPatternVal = data;
        this.showTestPatternDailog = true;
        this.cd.detectChanges()
    })
  
  }

  /**Closing the match pattern dailog */
  closePatternTest() {
    this.showTestPatternDailog = false;
  }

  /**
   * Method added to open the monitor stats dialog box to show stats for each of the agentless monitors.
   * Bug id - 73838
   * @param gdfNameforHC 
   * @param HCMonName 
   */
  showHCStatsInfo(gdfNameforHC, HCMonName) {
    let monInfo = new Array();
    monInfo['gdfName'] = gdfNameforHC;
  }

  /**Method called to invoke on checkbox click in Use topology in case of 'Others' tier. */
  patternEnableDisable(patternEnable) {
    if (!patternEnable) {
      this.heathCheckMonData.portForURL = null;
      this.heathCheckMonData.httpsEnable = false;
    }
  }

  // Method added for validation http fields
  validateHttpData() {
    if (!this.heathCheckMonData.cert) {
      this.heathCheckMonData.keyStrFile = "";
      this.heathCheckMonData.keyStrPwd = "";
      this.heathCheckMonData.trstStrFile = "";
      this.heathCheckMonData.trstStrPwd = "";
    }
    if (this.heathCheckMonData.cntMatch == "0") {
      this.heathCheckMonData.availonMatch = false;
      this.heathCheckMonData.srchStr = "";
      this.heathCheckMonData.srchPttrn = "";
    }
  }

  sendRequestToServer() {
    // if no health check monitor configuration then show error
    if (this.monitorupdownService.getHealthCheckTreeTableData().length == 0) {
      // this.messageService.errorMessage("Please add health check monitor configuration(s)")
      this.messageService.add({ severity: COMPONENT.SEVERITY_ERROR, summary: COMPONENT.SUMMARY_ERROR, detail: 'Please add health check monitor configuration(s)' });
      return;
    }

    if (!this.agentTier) {
      this.messageService.add({ severity: COMPONENT.SEVERITY_ERROR, summary: COMPONENT.SUMMARY_ERROR, detail: "Select Agent Tier." });
      return;
    }

    if (!this.agentServer) {
      this.messageService.add({ severity: COMPONENT.SEVERITY_ERROR, summary: COMPONENT.SUMMARY_ERROR, detail: "Select Agent Server." });
      return;
    }
    let globalProps = this.monConfServiceObj.getGlobalHCProps(); //get existing global properties 

    if(globalProps)
    {
      // For Maintenance Settings(getting current host,port,protocol)
      globalProps.mPro = window.location.protocol;
      globalProps.mHost = window.location.hostname;
      if (window.location.port != "") {
        globalProps.mPort = window.location.port;
      }
      else {
        if (window.location.protocol == "http:")
          globalProps.mPort = "80";
        else if (window.location.protocol == "https:")
          globalProps.mPort = "443";
        else
          console.log("Invalid Protocol");
      }
    }

    let cache = [];
    let data = [];
    let returnData;
    let test;
    if(this.monConfServiceObj.getHealthCheckData()){
      returnData = this.monConfServiceObj.getHealthCheckData().map(function (each) {
        let data2: {};
        data2 = JSON.stringify(each, function (key, value) {
          if (typeof value === 'object' && value !== null) {
            if (cache.indexOf(value) !== -1) {
              // Circular reference found, discard key
              return;
            }
            // Store value in our collection
            cache.push(value);
          }
          return value;
        });
  
        data.push(data2);
        return data2;
      });
      test = data.map(function (each) {
        return JSON.parse(each);
      })
    }
    let saveObj =
    {
      'customConfiguratons': { "data": test },
      'globalConfiguration': globalProps,
      'enableServerHealthExt': this.serverHealthEnable,
      'tier': this.agentTier,
      'server': this.agentServer,
      'opr': this.operation,
      'gMonID': this.gMonId,
    }
    this.loading = true;
    this.monitorupdownService.saveHealthCheckConfiguration(saveObj).subscribe(data => {
      if (data['status']) {
        this.loading = false;
        this.messageService.add({ severity: COMPONENT.SEVERITY_SUCCESS, summary: COMPONENT.SUMMARY_SUCCESS, detail: data['msg'] });
        this.resetFormOnSave();
      }
      else {
        this.loading = false;
        this.messageService.add({ severity: COMPONENT.SEVERITY_ERROR, summary: COMPONENT.SUMMARY_ERROR, detail: data['msg'] });
      }
      //need to call this method here to fix issue of getting diff at runtime when user apply 'ADD&SAVE' and 'SAVE&APPLY' both.
      setTimeout(() => {
        this.monitorupdownService.getConfigInfo(COMPONENT.TECH_HEALTH_CHECK).subscribe(res => {
          this.monInfoChild.getTableData(res)
        })

      })
    })
    this.monConfServiceObj.fromHCSave(true);
  }


  resetFormOnSave() {
    this.agentTier = "";
    this.agentServer = "";
    this.resetUI();
    
  }

  // Method called to emit data at edit mode to the health check monitor component.
  editData(data) {
    this.operation = "update";
    this.addEditLabel = 'Update';
    this.gMonId = data['gMonId'];
    this.objectId = data['objID'];
    this.agentTier = data['tier'];
  
    let tierObj;
    let that = this;
    if (that.agentTier) // if tier is Others that means no request to be sent to the server for getting the tierlist.
    {
      // tierHeadersList contains label for tier name and value for tier id.
      tierObj = _.find(that.tierHeadersList, function (each) { return each['label'] === that.agentTier })

      if (tierObj != null)
        that.getAgentServerList(tierObj.value)
    }
    this.agentServer = data['server'];

    if (data['customConfiguratons'] != null) {
      let tableData = data['customConfiguratons']['data'];
      that.monitorupdownService.setHealthCheckTreeTableData(tableData);
      that.createUniqueKeyForInstanceValidations(tableData);
      that.heathCheckMonitorData = tableData;
    }

    if (data['globalConfiguration'] != null)
      that.globalProps = data['globalConfiguration']

    that.monConfServiceObj.setHealthCheckData(this.heathCheckMonitorData);
    that.monConfServiceObj.setGlobalHCProps(this.globalProps);
    that.cd.detectChanges();
  }

  // on close click of outer main form
  resetUI() {
    this.addEditLabel = 'Add';
    this.gMonId = "-1";
    this.operation = "add";
    this.objectId = "-1";
    this.agentTier = "";
    this.agentServer = "";
    // below clear treetable data in edit mode.
    this.heathCheckMonitorData = [];
    this.monitorupdownService.setHealthCheckTreeTableData(this.heathCheckMonitorData);
    this.heathCheckMonitorData = [...this.heathCheckMonitorData];
    this.closeConfiguration(); // to clear inner form fields in edit mode.
    
  }

  onAgentTierChange(tierName){
      let tierInfo;
      if (tierName != COMPONENT.OTHERS_KEY) // if tier is Others that means no request to be sent to the server for getting the tierlist.
        tierInfo = _.find(this.tierHeadersList, function (each) { return each['label'] === tierName })

      if (tierInfo) 
        this.getAgentServerList(tierInfo.value)
  }

  getAgentServerList(tierId){
    this.loading = true;
    this.monitorupdownService.getServerList(tierId)
      .subscribe(data => {
        this.loading = false;
        let dName = [];
        let sName = [];
        data.map(each => {
          if (each['id'] >= 0) {
            sName.push(each['sName']);
            dName.push(each['dName']);
          }
        })
        sName.unshift("Any");
        dName.unshift("Any");
        this.agentServerList = UtilityService.createListWithKeyValue(dName, sName);
        this.cd.detectChanges();
      })
  }
  //added for bug 111906
  navigateToPage(){
    if (this.monitorupdownService.routeFlag) {
      this.monitorupdownService.flag = true;
    }
    this._location.back();
  }

  //Added for bug 112553 for refreshing the fields during update and delete
  resetFields(){
    this.heathCheckMonData = new HealthCheckMonData();
    this.editMode = false
  }
}
