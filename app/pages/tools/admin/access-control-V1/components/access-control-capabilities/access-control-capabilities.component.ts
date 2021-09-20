import { Component, OnInit, ViewChild } from '@angular/core';
import { CanComponentDeactivate, AccessControlRoutingGuardService } from '../../services/access-control-routing-guard.service';
import { Observable } from 'rxjs';
import { ModelWinDataInfo } from '../../containers/model-win-data-info';
import { MODEL_ACTION_CANCEL, MODEL_ACTION_OK } from '../../constants/access-control-constants';
import { TreeNodeDataInfo } from '../../containers/capability-tree';
import { CapabilityTreeNodeInfo, } from '../../interfaces/capability-tree-node-info';
import { CapabilitiesResponse, Permissions, RequestTableData } from '../../containers/capabilities-response';
import { Subscription } from 'rxjs';
import { AccesControlDataService } from '../../services/acces-control-data.service';
import {
  CAPABILITY_LIST_AVAILABLE, NEW_CAPABILITY_DATA_AVAILABLE, CUSTOM_NEXT_LEVEL_DATA_AVAILABLE_FOR_OLD, CUSTOM_NEXT_LEVEL_DATA_AVAILABLE, CAPABILITY_DELETED_SUCESSFULLY, UPDATE_CAPABILTY_DATA_AVAILABLE
} from '../../constants/access-control-constants';
import { AccessControlConfigDataServiceService } from '../../services/access-control-config-data-service.service';
import { CapabilityConstant } from '../../constants/capability-constants';
import { CapabilityCustomPermissionInfo, CapabilityCustomPermissioncontainer } from '../../interfaces/capability-custom-permission-info';
import { AccessControlFeaturePermService } from '../../services/access-control-feature-perm.service';
import { ConfirmationService, MessageService } from 'primeng';
import { ObjectUtility } from 'src/app/shared/utility/object';

@Component({
  selector: 'app-access-control-capabilities',
  templateUrl: './access-control-capabilities.component.html',
  styleUrls: ['./access-control-capabilities.component.css']
})
export class AccessControlCapabilitiesComponent implements OnInit, CanComponentDeactivate {

  modelInfo = new ModelWinDataInfo();
  windowHeight = (window.innerHeight - 138) + "px"
  resTreeData: TreeNodeDataInfo[]
  selectednodesforRead = [];
  selectednodesForReadWrite = [];
  capabilities: any = [];
  permission: string;
  selectedCapability: any;
  capabilityName = '';
  capabilityDesc = '';
  dataSubscription: Subscription;
  addNewCapabilityData: any;
  capabilityId = -1;
  errorMessage: any = [];
  addNewCapabilityFlag = false;
  enableDisableComboBox = [];
  customComboBoxData = [];
  selectedComboBoxData = [];
  isToRequestNextlevel = true;
  highlightedCapability = [];
  permissionTable: CapabilityCustomPermissionInfo[];
  enableMultipleselect = [false];
  capabilityconst = new CapabilityConstant();
  systemDefaultsenable = true;
  capabilitytype: string = '';
  defaultDropDownFirstlevel = [];
  defaultDropdownlastlevel = [];
  defaultDropdownlastlevelforAdvanced = []
  previousValue: any;
  aclPermissionfrdisable = false;
  deletecapabiltyFlag = false;
  tableHeaderInfo: any[];
  globalFilterFields: string[] = [];
  rejectVisible: boolean = true;
  acceptLable: string = 'Ok';
  noRecordMsg: boolean =false;
  loadResTree: boolean = false;
  @ViewChild('tableselect') tableSelect: any;
  @ViewChild('tableelmnt') tableElement: any;
  constructor(private _routingguard: AccessControlRoutingGuardService,
    private _dataservice: AccesControlDataService,
    private _config: AccessControlConfigDataServiceService,
    private _featurePerm: AccessControlFeaturePermService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService) {
    if (parseInt(sessionStorage.aclAccessRight) <= 4) {
      this.aclPermissionfrdisable = true;
    }

    this._dataservice.fetchCapabiltyDatafromService();
    this.customComboBoxData[this.customComboBoxData.length] = [this.capabilityconst.SOURCE_TIER, this.capabilityconst.SOURCE_PROJECT, this.capabilityconst.SOURCE_ADVANCED];
    this.defaultDropDownFirstlevel = [this.capabilityconst.SOURCE_TIER, this.capabilityconst.SOURCE_PROJECT, this.capabilityconst.SOURCE_ADVANCED];
    this.defaultDropdownlastlevel = [this.capabilityconst.PERMISSION_READ_ONLY, this.capabilityconst.PERMISSION_READ_WRITE];
    this.defaultDropdownlastlevelforAdvanced = [this.capabilityconst.PERMISSION_READ_ONLY, this.capabilityconst.PERMISSION_READ_WRITE, this.capabilityconst.PERMISSiON_NO_PERM];
  }

  ngOnInit() {
    try {
      this.tableHeaderInfo = [
        { header: 'Capabilities', valueField: 'capabilityName', isSort: true },
      ];
      this.globalFilterFields = ['capabilityName'];
      this.dataSubscription = this._dataservice.AccesscontrolCapabilityInfoProvider$.subscribe(
        action => {
          this.updatedataInService(action);
        });

      this.enable_Disabledeletecapabilityfromsession()
    } catch (e) {
      console.error('Error while getting data from Service  ', e);
    }

  }

  updatedataInService(action) {
    if (action == CAPABILITY_LIST_AVAILABLE) {
      this.capabilities = this._dataservice.$capabilityData;
      setTimeout(() => {
        if(this.capabilities && this.capabilities.length == 0 )
           this.noRecordMsg = true;
         else
            this.noRecordMsg = false; 
       }, 1000);
      let index = this.capabilities.map(function (e) { return e.capabilityName; }).indexOf('Admin');
      if (index > -1) {
        let event;
        event = { 'data': this.capabilities[index] };
        this.highlightedCapability = this.capabilities[index]
        this.onSelectCapability(event, false);
      }
    }
    else if (action == NEW_CAPABILITY_DATA_AVAILABLE) {
      this.addNewCapabilityData = this._dataservice.$newcapabilitydefaultData;
      this.selectedCapability = {};
      this.highlightedCapability = [];
      this.customComboBoxData = [];
      this.customComboBoxData[this.customComboBoxData.length] = [this.capabilityconst.SOURCE_TIER, this.capabilityconst.SOURCE_PROJECT, this.capabilityconst.SOURCE_ADVANCED];
      this.selectedComboBoxData = [];
      this.onSelectCapability(this.addNewCapabilityData, true);
      this.addNewCapabilityFlag = true;

    }
    else if (action == CUSTOM_NEXT_LEVEL_DATA_AVAILABLE) {
      let list = this._dataservice.$nextlevelComboboxData;
      if (list.data.length > 0) {
        if (list.source == this.capabilityconst.SOURCE_PROJECT || list.source == this.capabilityconst.TYPE_SUBPROJECT || list.source == 'Feature') {
          if (!((list.source == this.capabilityconst.TYPE_SUBPROJECT || list.source == 'Feature') && list.data[0] == 'All')) { list.data.splice(0, 0, "All"); }
        }

        if(this.selectedComboBoxData[1] && this.selectedComboBoxData[1] == "Alert")
          list.data = removeDepricatedFeatureFromAlert(list.data);

        this.customComboBoxData[this.customComboBoxData.length] = list.data;
        if (list.source == 'Tier' || list.source == 'SubProject' || list.source == 'Feature') {

          this.enableMultipleselect.push(true)

        }
        else {
          this.enableMultipleselect.push(false);
        }

      }
      else {

        if (list.source == 'Feature') {
          if (Array.isArray(this.selectedComboBoxData[this.selectedComboBoxData.length - 1])) {
            let featureList = this.selectedComboBoxData[this.selectedComboBoxData.length - 1];
            featureList = [...featureList]
            let featureListstring = this.selectedComboBoxData[this.selectedComboBoxData.length - 1].toString();
            if (featureList[0] == 'All') {
              featureList = this.customComboBoxData[this.customComboBoxData.length - 1];
              featureList = [...featureList];
              featureList.splice(0, 1);
              featureListstring = featureList.toString();
            }

            this.customComboBoxData[this.customComboBoxData.length] = this._featurePerm.fetchPermissionbyfeature(featureListstring, false)
          }

        }
        else {
          this.customComboBoxData[this.customComboBoxData.length] = [this.capabilityconst.PERMISSION_READ_ONLY, this.capabilityconst.PERMISSION_READ_WRITE];
        }
        this.isToRequestNextlevel = false;
      }
    } else if (action == UPDATE_CAPABILTY_DATA_AVAILABLE) {
      this.resetAllChanges()
    }

  }

  onSelectCapability(event, addNewFlag) {
    let istoUpdate = true;
    if (this.selectedCapability != undefined && Object.keys(this.selectedCapability).length > 0) {
      let permission = this.selectedCapability.permissions.permissionType;
      if (permission == this.capabilityconst.PERMISSION_CUSTOM) {
        if (this.checkblankPermission(this.selectedCapability.permissions.resTableData)) {
          this.showError("Blank Permission are not allowed .Please select Permission or remove permission");
          return;
        }
      }
      if (this.validateDataforCapabilites()) {

        if (!addNewFlag && this.addNewCapabilityFlag) {
          if (!window.confirm("Are you sure want to discard new capabilities")) {
            return
          }

        }
        if (!addNewFlag && !this.addNewCapabilityFlag) {
          istoUpdate = false;
        }

      }
      else if (this.selectedCapability.capabilityID == 0 && this.addNewCapabilityFlag) {

        this.addNewCapabilityFlag = false;
        this.selectedCapability.capabilityName = this.capabilityName;
        this.selectedCapability.capabilityDesc = this.capabilityDesc;

        this.capabilities.push(this.selectedCapability);
        this.capabilities = [... this.capabilities];
      }
      else {
        if (istoUpdate) {

          this.selectedCapability.capabilityName = this.capabilityName;
          this.selectedCapability.capabilityDesc = this.capabilityDesc;
          this.selectedCapability.permissions.resTableData = this.permissionTable;
        }
        this.addNewCapabilityFlag = false;
      }
    }

    if (addNewFlag) {
      this.selectedCapability = event;
    }
    else {
      this.selectedCapability = event.data;
    }
    let treeData = this.selectedCapability.permissions.resTreeData;
    this.permission = this.selectedCapability.permissions.permissionType;
    this.capabilityName = this.selectedCapability.capabilityName;
    this.capabilityDesc = this.selectedCapability.capabilityDesc;
    this.capabilityId = this.selectedCapability.capabilityID;
    this.capabilitytype = this.selectedCapability.capabilityType;
    this.customComboBoxData = [];
    this.customComboBoxData[this.customComboBoxData.length] = [this.capabilityconst.SOURCE_TIER, this.capabilityconst.SOURCE_PROJECT, this.capabilityconst.SOURCE_ADVANCED];
    this.selectedComboBoxData = [];
    this.enableMultipleselect = [];
    this.enableMultipleselect = [false];
    this.isToRequestNextlevel = true;
    if (this.capabilitytype == 'System') {
      this.systemDefaultsenable = true;
    }
    else {
      this.systemDefaultsenable = false;
    }
    if (!('traversed' in this.selectedCapability)) {
      this.selectedCapability.selectednodesforRead = [];
      this.selectedCapability.selectednodesForReadWrite = [];
    }
    let selectedNodes = []
    this.selectednodesforRead = [];
    this.selectednodesForReadWrite = [];

    if (this.permission == this.capabilityconst.PERMISSION_READ_ONLY) {
      if ("traversed" in this.selectedCapability) {
        this.selectednodesforRead = this.selectedCapability.selectednodesforRead;
        this.resTreeData[0].expanded = false;
        this.resTreeData = this.selectedCapability.permissions.resTreeData;
      }
      else {
        this.selectedCapability.traversed = true;   // "tarversed" key added explicitly 
        let defaultTreeNode = new Array<any>();
        defaultTreeNode[0] = { label: "Tiers", children: [], checked: false, leafNode: false, type: 'default' }
        defaultTreeNode[0].children = treeData;
        defaultTreeNode = this.getRequiredTreeDataFormat(defaultTreeNode, null, selectedNodes, null);
        this.selectedCapability.permissions.resTreeData = defaultTreeNode;

        this.resTreeData = this.selectedCapability.permissions.resTreeData
        this.selectedCapability.selectednodesforRead = selectedNodes;
        this.selectednodesforRead = this.selectedCapability.selectednodesforRead;
      }
    }
    else if (this.permission == this.capabilityconst.PERMISSION_READ_WRITE) {
      if ("traversed" in this.selectedCapability) {
        this.selectednodesForReadWrite = this.selectedCapability.selectednodesForReadWrite;
        this.resTreeData = this.selectedCapability.permissions.resTreeData;
      }
      else {
        this.selectedCapability.traversed = true;   // "tarversed" key added explicitly 
        let defaultTreeNode = new Array<any>();
        defaultTreeNode[0] = { label: "Tiers", children: [], checked: false, leafNode: false, type: 'default' }
        defaultTreeNode[0].children = treeData;
        defaultTreeNode = this.getRequiredTreeDataFormat(defaultTreeNode, null, selectedNodes, null);
        this.selectedCapability.permissions.resTreeData = defaultTreeNode;
        this.resTreeData = defaultTreeNode;
        this.selectedCapability.selectednodesForReadWrite = selectedNodes;
        this.selectednodesForReadWrite = this.selectedCapability.selectednodesForReadWrite;
      }


    }
    else if (this.permission == this.capabilityconst.PERMISSION_CUSTOM) {

      this.permissionTable = this.selectedCapability.permissions.resTableData;


      if (!('traversedtable' in this.selectedCapability)) {
        this.selectedCapability.traversedtable = false;
        for (let i = 0; i < this.permissionTable.length; i++) {
          this.permissionTable[i].comboboxlist = [];
          this.permissionTable[i].selectedcomboboxlist = [];
          this.permissionTable[i].comboboxlist.push(this.defaultDropDownFirstlevel)
          this.permissionTable[i].selectedcomboboxlist.push({ "value": this.permissionTable[i].source, type: 'default' })
          if (this.permissionTable[i].source == this.capabilityconst.SOURCE_TIER) {
            let arrval = { 'value': [], type: '' }

            arrval.value = this.permissionTable[i].selectedTierList
            arrval.type = this.capabilityconst.SOURCE_TIER;

            this.permissionTable[i].comboboxlist.push(this.permissionTable[i].tierList);
            this.permissionTable[i].selectedcomboboxlist.push(arrval);
          }
          else if (this.permissionTable[i].source == this.capabilityconst.SOURCE_PROJECT) {
            //  let permaddedcomboboxlist = new Array();
            let arrval = { 'value': [], type: '' }
            let stringval = { "value": '', type: "" }
            stringval.value = this.permissionTable[i].selectedProjectList[0]
            stringval.type = this.capabilityconst.SOURCE_PROJECT;
            if (this.permissionTable[i].projectList != null && this.permissionTable[i].projectList[0] != 'All')
              this.permissionTable[i].projectList.splice(0, 0, 'All');

            if (this.permissionTable[i].projectList != null && this.permissionTable[i].subProjList[0] != 'All') {
              this.permissionTable[i].subProjList.splice(0, 0, 'All');
            }



            this.permissionTable[i].comboboxlist.push(this.permissionTable[i].projectList);
            this.permissionTable[i].selectedcomboboxlist.push(stringval);
            if (this.permissionTable[i].subProjList != null) {
              this.permissionTable[i].comboboxlist.push(this.permissionTable[i].subProjList);
              arrval.value = this.permissionTable[i].selectedSubProjList;
              arrval.type = this.capabilityconst.TYPE_SUBPROJECT
              this.permissionTable[i].selectedcomboboxlist.push(arrval)
            }
          } else if (this.permissionTable[i].source == this.capabilityconst.SOURCE_ADVANCED) {
            let arrval = { 'value': [], type: '' }
            let stringval = { "value": '', type: "" }
            stringval.value = this.permissionTable[i].selectedComponentList[0]
            stringval.type = this.capabilityconst.TYPE_COMPONENT;
            this.permissionTable[i].comboboxlist.push(this.permissionTable[i].componentList);
            this.permissionTable[i].selectedcomboboxlist.push(stringval);
            if (this.permissionTable[i].featureList != null) {

              if(stringval.value && stringval.value == "Alert")
              {
                this.permissionTable[i].featureList = removeDepricatedFeatureFromAlert(this.permissionTable[i].featureList);
                this.permissionTable[i].selectedFeatureList = removeDepricatedFeatureFromAlert(this.permissionTable[i].selectedFeatureList);
              }

              this.permissionTable[i].comboboxlist.push(this.permissionTable[i].featureList);
              arrval.value = this.permissionTable[i].selectedFeatureList
              arrval.type = this.capabilityconst.TYPE_FEATURE
              this.permissionTable[i].selectedcomboboxlist.push(arrval)
            }



          }
          if (this.permissionTable[i].source == this.capabilityconst.SOURCE_ADVANCED) {

            if (this.permissionTable[i].featureList != null && this.permissionTable[i].featureList[0] != 'All') {
              this.permissionTable[i].featureList.splice(0, 0, 'All');
            }
            let length = this.permissionTable[i].selectedcomboboxlist.length - 1;
            if (Array.isArray(this.permissionTable[i].selectedcomboboxlist[length].value)) {

              let featureList = this.permissionTable[i].selectedcomboboxlist[length].value;
              featureList = [...featureList]
              let featureListstring = this.permissionTable[i].selectedcomboboxlist[length].value.toString();
              if (featureList[0] == 'All') {
                featureList = this.permissionTable[i].comboboxlist[length];
                featureList = [...featureList];
                featureList.splice(0, 1);
                featureListstring = featureList.toString();
              }
              let defaultcapabilities = false
              if (this.capabilityName == this.capabilityconst.ADMIN_CAPABILITY || this.capabilityName == this.capabilityconst.BUSINESS_CAPABILITY || this.capabilityName == this.capabilityconst.READALL_CAPABILITY || this.capabilityName == this.capabilityconst.READWRITEALL_CAPABILITY) {
                defaultcapabilities = true
              }
              let permission = this._featurePerm.fetchPermissionbyfeature(featureListstring, defaultcapabilities);
              this.permissionTable[i].comboboxlist.push(permission);
            }

          } else {
            this.permissionTable[i].comboboxlist.push(this.defaultDropdownlastlevel);
          }
          this.permissionTable[i].selectedcomboboxlist.push({ "value": this.permissionTable[i].permission, type: "accessType" })

        }
      }

    }

  }
  nodeSelect(event) {
    this.selectedCapability.selectednodesforRead = this.selectednodesforRead;
    this.selectedCapability.selectednodesForReadWrite = this.selectednodesForReadWrite;
  }
  nodeExpand(){
    this.loadResTree = true;
    setTimeout(()=>{
      this.loadResTree = false;  
    },450*this.resTreeData[0].children.length)
  }
  getRequiredTreeDataFormat(treeNodeInfo: CapabilityTreeNodeInfo[], parentHierarchy: string[], selectedNodes, parentNode) {
    try {

      /* Container format of tree data. */
      let treeNodes = new Array();
      let c = 0
      /* Iterating tree nodes. */
      for (let i = 0; i < treeNodeInfo.length; i++) {

        /* Create new tree node. */
        let treeNode = new TreeNodeDataInfo();
        treeNode.label = treeNodeInfo[i].label;
        treeNode.toolTip = treeNodeInfo[i].type;
        treeNode.leaf = treeNodeInfo[i].leafNode;
        treeNode.checked = treeNodeInfo[i].checked;

        treeNode.parent = parentNode
        treeNode.partialSelected = false;
        treeNode.expanded = true;

        /*Checking for parent hierarchy. */
        if (parentHierarchy == null) {
          treeNode.data = new Array().concat(treeNode.label);

        } else {
          treeNode.data = parentHierarchy.concat(treeNode.label);

        }
        /* Icon Selection. */
        // switch (treeNodeInfo[i].type) {
        //   case 'Environment':
        //     {
        //       treeNode.icon = 'fa-hdd-o';
        //       treeNode.styleClass = 'accesscontrol-environment-node';
        //       break;
        //     }
        //   case 'DC':
        //     {
        //       treeNode.icon = 'fa-newspaper-o';
        //       treeNode.styleClass = 'accesscontrol-tree-group-node';
        //       break;
        //     }
        //   case 'Tier':
        //     {
        //       treeNode.icon = 'fa-cogs';
        //       treeNode.styleClass = 'accesscontrol-tree-tier-node';
        //       break;
        //     }

        //   default:
        //     treeNode.icon = 'fa-hdd-o';
        //     treeNode.styleClass = 'accesscontrol-tree-default-node';
        // }
        if (treeNode.checked) {
          treeNode.partialSelected = false;
          treeNode.fullyselected = true;
          c = c + 1;
          if (c == treeNodeInfo.length) {
            if (treeNode.parent != undefined) {
              treeNode.parent.partialSelected = false;
              treeNode.parent.fullyselected = true;
            }
            treeNode.fullyselected = true;
            selectedNodes.push(treeNode.parent);


          }
          else {
            if (treeNode.parent != undefined) {
              treeNode.parent.partialSelected = true;
              treeNode.parent.fullyselected = false;
            }
          }
          let node: TreeNodeDataInfo
          selectedNodes.push(treeNode);

        }

        /*Checking if current node has sub nodes. */
        if (Array.isArray(treeNodeInfo[i].children)) {
          treeNode.children = this.getRequiredTreeDataFormat(treeNodeInfo[i].children, treeNode.data, selectedNodes, treeNode);
        }


        /* checking for leaf node. */
        /** Adding tree node in array. */
        treeNodes.push(treeNode);
      }
      let count = 0;
      let fullyselectedcount = 0
      for (let i = 0; i < treeNodes.length; i++) {


        if (treeNodes[i].parent != undefined) {
          if (treeNodes[i].fullyselected) {
            fullyselectedcount++
          }

          if (treeNodes[i].partialSelected) {

            count++;
            if (count == treeNodes.length) {
              if (fullyselectedcount == treeNodes.length) {
                treeNodes[i].parent.partialSelected = false;
              }
              else {
                treeNodes[i].parent.partialSelected = true;
              }
              selectedNodes.push(treeNodes[i].parent);
            }

            else {
              treeNodes[i].parent.partialSelected = true;
            }
          }
        }
      }
      return treeNodes;
    } catch (e) {

      return null;
    }
  }
  addNewCapabilty() {
    this._dataservice.fetchNewCapabilityData();
    this.nodeExpand();
  }
  onPermissionTypeChange() {
    this.resTreeData[0].expanded = false;
    this.selectedCapability.permissions.permissionType = this.permission;
    if (this.permission == this.capabilityconst.PERMISSION_READ_ONLY) {
      let selectedNodes = []
      if ("traversed" in this.selectedCapability) {
        this.selectednodesforRead = this.selectedCapability.selectednodesforRead;
        this.resTreeData = this.selectedCapability.permissions.resTreeData;
      }
      else {
        let treeData = this.selectedCapability.permissions.resTreeData;
        this.selectedCapability.traversed = true;   // "tarversed" key added explicitly 
        let defaultTreeNode = new Array<any>();
        defaultTreeNode[0] = { label: "Tiers", children: [], checked: false, leafNode: false, type: 'default' }
        defaultTreeNode[0].children = treeData;
        defaultTreeNode = this.getRequiredTreeDataFormat(defaultTreeNode, null, selectedNodes, null);
        this.resTreeData = defaultTreeNode;
        this.selectedCapability.permissions.resTreeData = defaultTreeNode;
        this.selectedCapability.selectednodesforRead = selectedNodes;
        this.selectednodesforRead = this.selectedCapability.selectednodesforRead;
      }
    }
    else if (this.permission == this.capabilityconst.PERMISSION_READ_WRITE) {
      let selectedNodes = []
      if ("traversed" in this.selectedCapability) {
        this.resTreeData = this.selectedCapability.permissions.resTreeData;
        this.resTreeData[0].expanded = false;
        this.selectednodesForReadWrite = this.selectedCapability.selectednodesForReadWrite;
      }
      else {
        let treeData = this.selectedCapability.permissions.resTreeData;
        this.selectedCapability.traversed = true;   // "tarversed" key added explicitly 
        let defaultTreeNode = new Array<any>();
        defaultTreeNode[0] = { label: "Tiers", children: [], checked: false, leafNode: false, type: 'default' }
        defaultTreeNode[0].children = treeData;
        defaultTreeNode = this.getRequiredTreeDataFormat(defaultTreeNode, null, selectedNodes, null);
        this.resTreeData = defaultTreeNode;
        this.selectedCapability.permissions.resTreeData = defaultTreeNode;
        this.selectedCapability.selectednodesForReadWrite = selectedNodes;
        this.selectednodesForReadWrite = this.selectedCapability.selectednodesforRead;
      }
    }
    else if (this.permission == this.capabilityconst.PERMISSION_CUSTOM) {
      if (this.selectedCapability.permissions.resTableData == null) {
        this.selectedCapability.traversedtable = false;
        this.selectedCapability.permissions.resTableData = new Array<any>()
      }
      this.permissionTable = this.selectedCapability.permissions.resTableData;
    }
  }

  saveCapabilities() {
    if (this.selectedCapability != undefined && Object.keys(this.selectedCapability).length > 0) {
      if (this.validateDataforCapabilites()) {
        return;
      }
      else if (this.selectedCapability.capabilityID == 0 && this.addNewCapabilityFlag) {

        this.addNewCapabilityFlag = false;
        this.selectedCapability.capabilityName = this.capabilityName;
        this.selectedCapability.capabilityDesc = this.capabilityDesc;
        this.capabilities.push(this.selectedCapability);
        this.capabilities = [... this.capabilities];

      }
      else {
        this.selectedCapability.capabilityName = this.capabilityName;
        this.selectedCapability.capabilityDesc = this.capabilityDesc;
        this.selectedCapability.permissions.resTableData = this.permissionTable
      }
    }
    let resarray = new Array();

    for (let i = 0; i < this.capabilities.length; i++) {
      if (this.capabilities[i].capabilityType == 'System') {
        continue;
      }
      if ('traversed' in this.capabilities[i] || 'traversedtable' in this.capabilities[i]) {
        let data = new CapabilitiesResponse();
        data.capabilityName = this.capabilities[i].capabilityName;
        data.capabilityDesc = this.capabilities[i].capabilityDesc;
        data.capabilityID = this.capabilities[i].capabilityID;
        data.capabilityType = this.capabilities[i].capabilityType;
        data.permissions = new Permissions();
        data.permissions.permissionType = this.capabilities[i].permissions.permissionType;
        let tabledata = [];
        if (data.permissions.permissionType == this.capabilityconst.PERMISSION_READ_ONLY) {
          let selectedNodes = this.capabilities[i].selectednodesforRead;

          // let list =[];
          for (let j = 0; j < selectedNodes.length; j++) {
            if (selectedNodes[j].leaf) {
              tabledata.push(selectedNodes[j].label);
            }
          }
          data.permissions.reqTableData = new Array<RequestTableData>();
          let requestTabledata = new RequestTableData();
          requestTabledata.source = "Tier"
          requestTabledata.tierList = tabledata;
          requestTabledata.accessType = this.capabilityconst.PERMISSION_READ_ONLY
          data.permissions.reqTableData.push(requestTabledata);
          resarray.push(data);

        }
        else if (data.permissions.permissionType == this.capabilityconst.PERMISSION_READ_WRITE) {
          let selectedNodes = this.capabilities[i].selectednodesForReadWrite;
          for (let j = 0; j < selectedNodes.length; j++) {
            if (selectedNodes[j].leaf) {
              tabledata.push(selectedNodes[j].label);
            }
          }
          data.permissions.reqTableData = new Array<RequestTableData>();
          let requestTabledata = new RequestTableData();
          requestTabledata.source = this.capabilityconst.SOURCE_TIER
          requestTabledata.tierList = tabledata
          requestTabledata.accessType = this.capabilityconst.PERMISSION_READ_WRITE;
          data.permissions.reqTableData.push(requestTabledata);
          resarray.push(data);

        }
        else if (data.permissions.permissionType == this.capabilityconst.PERMISSION_CUSTOM) {
          data.permissions.reqTableData = new Array<RequestTableData>();
          let restTabledata = this.capabilities[i].permissions.resTableData;


          for (let i = 0; i < restTabledata.length; i++) {
            let selectedcomboboxlist = restTabledata[i].selectedcomboboxlist;
            let reqTableData = new RequestTableData;

            for (let j = 0; j < selectedcomboboxlist.length; j++) {
              if (selectedcomboboxlist[j].value == '') {
                this.showError("Blank Permission are not allowed .Please select Permission or remove permission");
                return;
              }
              if (selectedcomboboxlist[j].type == 'default') {
                reqTableData.source = selectedcomboboxlist[j].value;
              }
              else if (selectedcomboboxlist[j].type == this.capabilityconst.SOURCE_TIER) {
                reqTableData.tierList = selectedcomboboxlist[j].value;
              }
              else if (selectedcomboboxlist[j].type == this.capabilityconst.TYPE_COMPONENT) {
                reqTableData.component = selectedcomboboxlist[j].value;
              }
              else if (selectedcomboboxlist[j].type == this.capabilityconst.TYPE_FEATURE) {

                if(reqTableData.component == "Alert")
                  selectedcomboboxlist[j].value = updateFeatureListArray(selectedcomboboxlist[j].value);

                reqTableData.featureList = selectedcomboboxlist[j].value;
              }
              else if (selectedcomboboxlist[j].type == "accessType") {
                reqTableData.accessType = selectedcomboboxlist[j].value;
              }
              else if (selectedcomboboxlist[j].type == this.capabilityconst.SOURCE_PROJECT) {
                reqTableData.projectName = selectedcomboboxlist[j].value;
              }
              else if (selectedcomboboxlist[j].type == this.capabilityconst.TYPE_SUBPROJECT) {
                reqTableData.subProjList = selectedcomboboxlist[j].value;
              }

            }
            data.permissions.reqTableData.push(reqTableData);
          }
          resarray.push(data);
        }


      }
    }

    if (resarray.length > 0) {
      this._dataservice.saveDataforCapability(resarray);
    } else {
    }
  }


  isContainCapability(capabilityName, capabilityId) {
    let containsCapabiltyName = false;
    for (let i = 0; i < this.capabilities.length; i++) {
      if (capabilityId == this.capabilities[i].capabilityID) {
        continue;
      }

      if (capabilityName.toLowerCase() == this.capabilities[i].capabilityName.toLowerCase()) {
        containsCapabiltyName = true;
        break;
      }
    }
    return containsCapabiltyName;
  }

  validateDataforCapabilites() {
    let testregex = /[ $%^*()+\=\[\]{};':"\\|,<>\/?]/;
    if (this.capabilityName == '' || this.capabilityName == null) {
      this.showError("Blank Capability Name is not Allowed ,Please Specify Capability Name.");
      return true;
    }
    else if (this.capabilityDesc == '' || this.capabilityDesc == null) {
      this.showError("Blank Capability Description is not Allowed ,Please Specify Capability Description.");
      return true;
    } else if (this.capabilityDesc.length > 256) {
      this.showError("Capability Description cannot be greater than 256 character.");
      return true;
    }
    else if (!/^[A-Z,a-z]/.test(this.capabilityName)) {
      this.showError("Capability Name should start with Alphabet.");
      return true;
    }
    else if (this.isContainCapability(this.capabilityName, this.capabilityId)) {
      this.showError("Capability Name Already Exist ,Please Specify New Capabilty Name.");
      return true;
    } else if (this.capabilityName.length < 4 || this.capabilityName.length > 30) {
      this.showError("Please use between 4 and 30 characters for capability name.Please use only letters (a-z), numbers, and special character (periods ,!,-,_,@,#,& ) for capability name.");
      return true;
    } else if (this.capabilityName.indexOf('..') >= 0) {
      this.showError("Capability name cannot have consecutive periods for eg 'Cavisson..'");
      return true;
    } else if (testregex.test(this.capabilityName)) {
      this.showError("Please use only letters (a-z), numbers, and special character (only periods ) for Capability name.");
      return true;
    }


    else {
      return false;
    }
  }

  deleteCapabiliity(event) {
    this.removeGroupDetails(event);
  }


  deleteRowFromtable(index) {
    this.permissionTable.splice(index, 1);
  }
  deleteSelectedRow(deleteSelectedRow, index) {
    this.selectedCapability.permissions.resTableData.splice(index, 1);
    this.permissionTable = this.selectedCapability.permissions.resTableData;
    this.permissionTable = [...this.permissionTable];
  }

  resetAllChanges() {
    this._dataservice.fetchCapabiltyDatafromService();
    this.highlightedCapability = [];
    this.selectedCapability = {};
    this.capabilityName = '';
    this.capabilityId = -1;
    this.capabilityDesc = '';
    this.customComboBoxData = [];
    this.customComboBoxData[this.customComboBoxData.length] = [this.capabilityconst.SOURCE_TIER, this.capabilityconst.SOURCE_PROJECT, this.capabilityconst.SOURCE_ADVANCED]
    this.resTreeData = [];
    this.permissionTable = [];
    this.selectedComboBoxData = [];
    this.isToRequestNextlevel = true;
    this.systemDefaultsenable = true;
    this.enableMultipleselect = [false];

  }
  onSelectCustomlevel(index, levelName) {

    let level = '';
    let path = '';
    if (this.isToRequestNextlevel || index < this.customComboBoxData.length - 1) {
      this.isToRequestNextlevel = true;
      if (index == this.customComboBoxData.length - 1) {
      }
      else {
        this.customComboBoxData.splice(index + 1, this.customComboBoxData.length);
        this.selectedComboBoxData.splice(index + 1, this.selectedComboBoxData.length);
        this.enableMultipleselect.splice(index + 1, this.enableMultipleselect.length)

      }
      if ((this.selectedComboBoxData.length - 1) == 0) {
        level = this.selectedComboBoxData[index];

      }
      else {
        path = this.selectedComboBoxData[index];
        level = this.selectedComboBoxData[0];
        if (level == this.capabilityconst.SOURCE_ADVANCED) {
          if (index > 1) {

            if (path[0] == 'All') {
              this.selectedComboBoxData[index] = ['All'];
              path = 'All';
            }
          }
        }
        if (level == this.capabilityconst.SOURCE_PROJECT) {
          if (index > 1) {

            if (path[0] == 'All') {

              // let multipleproj = this.customComboBoxData[index]
              // multipleproj =[...multipleproj];
              // multipleproj.splice(0,1);0

              this.selectedComboBoxData[index] = ['All'];
              path = 'All' + ',*';
            } else {

              path = path + ',' + this.selectedComboBoxData[index - 1];
            }
          }
        }
      }

      this._dataservice.fetchNextlevelOfIndices(level, path, true);

    }
  }

  onMultipleValueSelect(index, levelName) {

    if (this.tableElement.panelOpen) {
      return;
    }
    if (levelName.length > 0) {
      this.onSelectCustomlevel(index, levelName)
    }
  }

  addCustomPermissioninTable() {
    let lastelementslected = this.selectedComboBoxData[this.selectedComboBoxData.length - 1]

    if (lastelementslected == this.capabilityconst.PERMISSION_READ_ONLY ||
      lastelementslected == this.capabilityconst.PERMISSION_READ_WRITE ||
      lastelementslected == this.capabilityconst.PERMISSiON_NO_PERM ||
      lastelementslected == this.capabilityconst.PERMISSIONLOW ||
      lastelementslected == this.capabilityconst.PERMISSIONMEDIUM || lastelementslected == this.capabilityconst.PERMISSIONHIGH) {
      if (!this.isToRequestNextlevel) {
        let addnewrow = new CapabilityCustomPermissioncontainer()
        addnewrow.comboboxlist = [...this.customComboBoxData];
        addnewrow.selectedcomboboxlist = new Array<any>();
        let level = 'default'

        let stringarr = { "value": '', 'type': '' }
        if (this.checkDuplicatePermission(this.permissionTable, this.selectedComboBoxData, false, -1)) {
          this.showError("Duplicate Permission is not allowed.");
          return;
        }
        for (let i = 0; i < this.selectedComboBoxData.length; i++) {
          let arr = { "value": [], type: '' };
          arr.value = this.selectedComboBoxData[i];
          if (this.selectedComboBoxData[i] == this.capabilityconst.SOURCE_PROJECT) {
            arr.type = 'default';
            level = this.capabilityconst.SOURCE_PROJECT
          }
          else if (level == this.capabilityconst.SOURCE_PROJECT) {
            arr.type = this.capabilityconst.SOURCE_PROJECT
            level = this.capabilityconst.TYPE_SUBPROJECT;
          }
          else if (level == this.capabilityconst.TYPE_SUBPROJECT) {
            arr.type = this.capabilityconst.TYPE_SUBPROJECT
            level = 'accessType';
          }
          else if (level == 'accessType') {
            arr.type = 'accessType'
          }
          else if (this.selectedComboBoxData[i] == this.capabilityconst.SOURCE_ADVANCED) {
            arr.type = 'default';
            level = this.capabilityconst.TYPE_COMPONENT;
          }
          else if (level == this.capabilityconst.TYPE_COMPONENT) {
            arr.type = this.capabilityconst.TYPE_COMPONENT
            level = this.capabilityconst.TYPE_FEATURE;
          }
          else if (level == this.capabilityconst.TYPE_FEATURE) {
            arr.type = this.capabilityconst.TYPE_FEATURE
            level = 'accessType';
          }
          else if (this.selectedComboBoxData[i] == this.capabilityconst.SOURCE_TIER) {
            arr.type = 'default';
            level = this.capabilityconst.SOURCE_TIER;

          }
          else if (level = this.capabilityconst.SOURCE_TIER) {
            arr.type = this.capabilityconst.SOURCE_TIER
            level = 'accessType';
          }
          addnewrow.selectedcomboboxlist.push(arr);
        }


        this.permissionTable.push(addnewrow);
        this.customComboBoxData = [];
        this.customComboBoxData[this.customComboBoxData.length] = [this.capabilityconst.SOURCE_TIER, this.capabilityconst.SOURCE_PROJECT, this.capabilityconst.SOURCE_ADVANCED];
        this.selectedComboBoxData = [];
        this.enableMultipleselect = [];
        this.enableMultipleselect = [false];
        this.isToRequestNextlevel = true;

      }
    }

  }

  editComboboxTable(permTableindx, selComboBoxindx, isMutiple) {
    if (this.tableSelect.panelOpen) {
      return;
    }
    let istoSplice = true;
    let level;
    let path;
    let previousValueType = this.permissionTable[permTableindx].selectedcomboboxlist[selComboBoxindx];
    if (this.previousValue != undefined && isMutiple) {
      if (this.previousValue.type == previousValueType.type) {
        let presentValue = this.permissionTable[permTableindx].selectedcomboboxlist[selComboBoxindx].value.toString()
        if (this.previousValue.value.toString() == presentValue || presentValue == '') {
          istoSplice = false;
        }
        else {
          istoSplice = true
        }
      }
    }

    if (previousValueType.value == this.capabilityconst.PERMISSION_READ_ONLY ||
      previousValueType.value == this.capabilityconst.PERMISSION_READ_WRITE ||
      previousValueType.value == this.capabilityconst.PERMISSiON_NO_PERM || previousValueType.value == this.capabilityconst.PERMISSIONHIGH ||
      previousValueType.value == this.capabilityconst.PERMISSIONMEDIUM ||
      previousValueType.value == this.capabilityconst.PERMISSIONLOW) {
      let duplicate = this.checkDuplicatePermission(this.permissionTable, this.permissionTable[permTableindx], true, permTableindx)
      if (duplicate) {
        istoSplice = true;
        selComboBoxindx = selComboBoxindx - 1;
        this.showError("Duplicate Permission is not allowed.");
      }
    }
    if (istoSplice) {
      this.permissionTable[permTableindx].comboboxlist.splice(selComboBoxindx + 1, this.permissionTable[permTableindx].comboboxlist.length)
      let spliceelements = this.permissionTable[permTableindx].selectedcomboboxlist.splice(selComboBoxindx + 1, this.permissionTable[permTableindx].selectedcomboboxlist.length)
      level = this.permissionTable[permTableindx].selectedcomboboxlist[0].value;
      if (this.permissionTable[permTableindx].selectedcomboboxlist[selComboBoxindx].type == this.capabilityconst.TYPE_SUBPROJECT || this.permissionTable[permTableindx].selectedcomboboxlist[selComboBoxindx].type == this.capabilityconst.TYPE_FEATURE) {
        path = this.permissionTable[permTableindx].selectedcomboboxlist[selComboBoxindx].value

        if (path[0] == 'All') {

          this.permissionTable[permTableindx].selectedcomboboxlist[selComboBoxindx].value = ['All']
        }
      }
      path = this.permissionTable[permTableindx].selectedcomboboxlist[selComboBoxindx].value.toString();
      if (path == this.capabilityconst.SOURCE_TIER || path == this.capabilityconst.SOURCE_PROJECT || path == this.capabilityconst.SOURCE_ADVANCED) {
        path = '';
      }
      if (this.permissionTable[permTableindx].selectedcomboboxlist[selComboBoxindx].type == this.capabilityconst.TYPE_SUBPROJECT) {

        path = path + ',' + '*#';

      }

      if (this.permissionTable[permTableindx].selectedcomboboxlist[selComboBoxindx].type != 'accessType') {
        this._dataservice.fetchNextlevelOfIndices(level, path, false);

        try {
          let dataSubscription = this._dataservice.AccesscontrolCapabilityInfoProvider$.subscribe(
            action => {

              dataSubscription.unsubscribe();
              if (action == CUSTOM_NEXT_LEVEL_DATA_AVAILABLE_FOR_OLD) {

                let nexlevelData = this._dataservice.$nextlevelComboboxData;

                if (nexlevelData.data.length != 0) {
                  if (nexlevelData.source == this.capabilityconst.SOURCE_PROJECT || nexlevelData.source == this.capabilityconst.TYPE_SUBPROJECT || nexlevelData.source == this.capabilityconst.TYPE_FEATURE) {
                    if (!((nexlevelData.source == this.capabilityconst.TYPE_SUBPROJECT || nexlevelData.source == this.capabilityconst.TYPE_FEATURE) && nexlevelData.data[0] == 'All')) { nexlevelData.data.splice(0, 0, "All"); }
                  }
                  this.permissionTable[permTableindx].comboboxlist.push(nexlevelData.data);
                  if (nexlevelData.source == this.capabilityconst.TYPE_SUBPROJECT || nexlevelData.source == this.capabilityconst.TYPE_FEATURE || nexlevelData.source == this.capabilityconst.SOURCE_TIER) {
                    this.permissionTable[permTableindx].selectedcomboboxlist.push({ 'value': [], type: nexlevelData.source })
                  } else {
                    this.permissionTable[permTableindx].selectedcomboboxlist.push({ 'value': '', type: nexlevelData.source })
                  }
                  dataSubscription.unsubscribe();
                }
                else {
                  if (nexlevelData.source == 'Feature') {
                    let selectedcombolength = this.permissionTable[permTableindx].selectedcomboboxlist.length;
                    if (Array.isArray(this.permissionTable[permTableindx].selectedcomboboxlist[selectedcombolength - 1].value)) {
                      let featureList = this.permissionTable[permTableindx].selectedcomboboxlist[selectedcombolength - 1].value;
                      featureList = [...featureList]
                      let featureListstring = this.permissionTable[permTableindx].selectedcomboboxlist[selectedcombolength - 1].value.toString();
                      if (featureList[0] == 'All') {
                        featureList = this.permissionTable[permTableindx].comboboxlist[selectedcombolength - 1];
                        featureList = [...featureList];
                        featureList.splice(0, 1);
                        featureListstring = featureList.toString();
                      }

                      let permission = this._featurePerm.fetchPermissionbyfeature(featureListstring, false);
                      this.permissionTable[permTableindx].comboboxlist.push(permission);
                    }
                  }
                  else {
                    this.permissionTable[permTableindx].comboboxlist.push(this.defaultDropdownlastlevel);
                  }

                  this.permissionTable[permTableindx].selectedcomboboxlist.push({ 'value': '', type: 'accessType' })
                  dataSubscription.unsubscribe();
                }

              }

              dataSubscription.unsubscribe();

            }

          )


        } catch (e) {
          console.error('Error while getting data from Service  ', e);
        }

      }
    }

  }
  onopenCombobox(presentValue) {
    if (this.tableSelect.panelOpen) {
      this.previousValue = { ...presentValue };
    }
  }

  checkDuplicatePermission(permissionArray, newPermission, flag, index) {
    let convertednewvalue
    if (flag) {
      convertednewvalue = newPermission.selectedcomboboxlist.map(function (e) { return e.value });
      convertednewvalue = this.convertObjectArayintoStringArray(convertednewvalue)
    } else {
      convertednewvalue = this.convertObjectArayintoStringArray(newPermission)
    }
    for (let i = 0; i < permissionArray.length; i++) {
      if (i != index) {
        let elementarray = permissionArray[i].selectedcomboboxlist.map(function (e) { return e.value });
        let convertedoldvalues = this.convertObjectArayintoStringArray(elementarray);
        for (let j = 0; j < convertednewvalue.length; j++) {
          let istoCheckstring = convertedoldvalues.toString();

          if (istoCheckstring.endsWith(this.capabilityconst.PERMISSiON_NO_PERM) ||
            istoCheckstring.endsWith(this.capabilityconst.PERMISSION_READ_ONLY) ||
            istoCheckstring.endsWith(this.capabilityconst.PERMISSION_READ_WRITE) || istoCheckstring.endsWith(this.capabilityconst.PERMISSIONLOW)
            || istoCheckstring.endsWith(this.capabilityconst.PERMISSIONMEDIUM) || istoCheckstring.endsWith(this.capabilityconst.PERMISSIONHIGH)) {
            if (istoCheckstring.includes(convertednewvalue[j])) {
              return true;
            }
          }
        }
      }
    }
    return false;

  }

  convertObjectArayintoStringArray(permissionArray) {
    let stringarray = [];
    let tempArray = permissionArray.map(function (e) {
      if (Array.isArray(e)) {
        return '*'
      }
      return e
    })

    let index = tempArray.indexOf('*');
    let toiterateArray = permissionArray[index];
    let string = tempArray.toString();
    for (let i = 0; i < toiterateArray.length; i++) {

      stringarray.push(string.replace('*', toiterateArray[i]))
    }

    return stringarray;
  }

  canDeactivate(): boolean | Observable<boolean> | Promise<boolean> {

    // if (this._auth.$canDeactivatelogoutFlag) {
    //   this._auth.$canDeactivatelogoutFlag = false;
    //   return true
    // }

    if (localStorage.$isTopreventConfirmBox == 'true') {
      return true;
    }

    this._dataservice.showConfirmBox("Are you sure you want to navigate away from this tab?", "Warning", true, '171px');
    // this.blockUI.stop();
    let modelsubscription = this._dataservice.modelActionProvider$.subscribe(
      actn => {

        modelsubscription.unsubscribe();
        if (actn.modelAction == MODEL_ACTION_OK) {
          // this.blockUI.stop();
          this.modelInfo.modelAction = MODEL_ACTION_OK;

          this._routingguard.handleModelAction(this.modelInfo);
          this._dataservice.navigateTab.next(true);

          return true;
        }
        else if (actn.modelAction == MODEL_ACTION_CANCEL) {
          this.modelInfo.modelAction = MODEL_ACTION_CANCEL
          this._routingguard.handleModelAction(this.modelInfo);
          this._dataservice.navigateTab.next(false);
          return false;
        }


      })
    return this._dataservice.naviagateTabProvider;
  }


  ngOnDestroy() {
    this.dataSubscription.unsubscribe();
  }

  checkblankPermission(resTableData) {
    for (let i = 0; i < resTableData.length; i++) {
      if (resTableData[i].selectedcomboboxlist == undefined) {
        return false;
      }
      let index = resTableData[i].selectedcomboboxlist.map(function (e) {
        if (Array.isArray(e.value)) {

          return e.value.toString();
        }
        return e.value
      }).indexOf('');

      if (index > -1) {
        return true;
      }
    }
    return false;
  }

  enable_Disabledeletecapabilityfromsession() {

    if (sessionStorage.getItem("deleteCapability") == undefined) {

      sessionStorage.setItem("deleteCapability", "false");

    } else if (sessionStorage.getItem("deleteCapability") == "true") {
      this.deletecapabiltyFlag = true;
    }
    else {
      this.deletecapabiltyFlag = false
    }
  }

  showSuccess(msg) {
    this.messageService.add({ severity: 'success', summary: 'Success Message', detail: msg });
  }

  showError(msg) {
    this.messageService.add({ severity: 'error', summary: 'Error Message', detail: msg });
  }

  removeGroupDetails(event) {
    const me = this;
    me.rejectVisible = true;
    me.acceptLable = 'Ok';

    me.confirmationService.confirm({
      message: 'Are you sure you want to delete ?',
      header: 'Delete Capability',
      icon: 'pi pi-info-circle',
      accept: () => {
        if (event.capabilityID == 0) {
          let deleteCapabilitydataIndex = this.capabilities.map(function (e) { return e.capabilityName; }).indexOf(event.capabilityName);
          this.capabilities.splice(deleteCapabilitydataIndex, 1);

          this.capabilities = [...this.capabilities];
          this.showSuccess("Capability Deleted Sucessfully.");
        }
        else {

          this._dataservice.deleteCapabiltyfromCapabilitylist(event.capabilityID);
          try {
            let dataSubscription = this._dataservice.AccesscontrolCapabilityInfoProvider$.subscribe(
              action => {
                if (action == CAPABILITY_DELETED_SUCESSFULLY) {
                  let deleteCapabilitydataIndex = this.capabilities.map(function (e) { return e.capabilityID; }).indexOf(event.capabilityID);
                  this.capabilities.splice(deleteCapabilitydataIndex, 1);

                  this.capabilities = [...this.capabilities];
                  this.showSuccess("Capability Deleted Sucessfully.");
                }
                dataSubscription.unsubscribe();
              });

          } catch (e) {
            console.error('Error while getting data from Service  ', e);
          }
        }
        this.capabilityName = '';
        this.capabilityDesc = '';
      },
      reject: () => { },
    });
  }
}

function removeDepricatedFeatureFromAlert(data: any) {
  let allList = ObjectUtility.duplicate(data);
  data = [];

  for(let li = 0; li < allList.length; li++)
  {
    if(allList[li] != "Alert Policy" && allList[li] != "Alert Baseline")
    {
      if(allList[li] == "Alert Settings")
        data.push("Alert Configuration");
      else
        data.push(allList[li]);
    }
  }

  return data;
}

function updateFeatureListArray(data: any[]): any {
  for(let index in data)
  {
    if(data[index] == "Alert Configuration")
    {
      data[index] = "Alert Settings";
      break;
    }
  }

  return data;
}

