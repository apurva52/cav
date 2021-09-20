import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MessageService, SelectItem, TreeNode } from 'primeng/api';
import { Router } from '@angular/router';
import * as _ from "lodash";
import { MetricConfData } from '../../../../generic-gdf/containers/metric-configuration-data';
import { JMXMonData, JMXConnectionParams } from '../containers/jmx-mon-data';
import { MetricHierarchyData } from '../../../../generic-gdf/containers/metric-hierarchy-data';
import * as JMX_MON_CONSTANTS from '../constants/configure-cmd-mon-constant';
import { MonitorupdownstatusService } from '../../../service/monitorupdownstatus.service';
import { CustomMonitorService } from '../services/custom-monitor.service';	
import { UtilityService } from '../../../../monitor-up-down-status/service/utility.service';
import { APIData } from '../containers/api-data';
import * as COMPONENT from '../../add-monitor/constants/monitor-configuration-constants';

@Component({
  selector: 'app-configure-jmx-monitor',
  templateUrl: './configure-jmx-monitor.component.html',
  styleUrls: ['./configure-jmx-monitor.component.css']
})
export class ConfigureJmxMonitorComponent implements OnInit {

  jmxtableData: MetricConfData[] = [];
  reqData:APIData = new APIData();
  jmxMonData:JMXMonData = new JMXMonData();
  jmxConnParam:JMXConnectionParams = new JMXConnectionParams();
  files: TreeNode[];
  lazyFiles: TreeNode[];
  arrMetricConf: any;
  cols: any;
  selectedFile: TreeNode;
  summeryTable: any[];
  flag: boolean = false;
  dataFlag: boolean = false;    //when data is not present then only table will be visible
  /* Decorator wires up blockUI instance*/
  //@BlockUI() blockUI: NgBlockUI;
  categoryList: any[] = [];// list of categories 
  cusCat: string = ''; // custom category name
  bPathList: SelectItem[];// basePath list items
  domainName: string = '';  //Domain Name
  metricKeyList: SelectItem[];    //used to fill data in metric configuration table
  filterList: SelectItem[];   //filter list eg: equals, greater than etc
  bsPathName: string[] = [];   // basePath node's value
  nodeCount: number = 0;   //used to hold the basePath list count
  editModeTreeData: any = [];  //used to hold edit time treeNode data
  count: number = 0;   //used for filling data in treenode to open the tree in edit mode.
 // _dialogForNewRelicMon: MatDialogRef<CavJmxConnectionComponent>;	
  isConnectionBreak:boolean = false;
  jmxConnDialog: boolean = false;
  disableFields: boolean;
  loading: boolean;
  
  constructor(private router: Router, //private monConfServiceObj: MonConfigurationService,
    // utlSerObj: UtilityService, private cmsObj: CustomMonitorService,
    private msgServiceObj: MessageService,
   //private _dialog: MatDialog,
   private customMonService:CustomMonitorService,
   private monUpDown:MonitorupdownstatusService,
   
    ) { }

  ngOnInit() {
    this.jmxConnParam = this.customMonService.getJmxConnParam();
   this.dataFlag = this.customMonService.jmxDataFlag;
    this.arrMetricConf = [
      { field: '_mN', header: 'Metric Name', visible: false, width: '18%' },
      { field: '_metKeyIdx', header: 'Metric Key', visible: false, width: '18%' },
      { field: '_dT', header: 'Data type', visible: false, width: '18%' },
      { field: '_rD', header: 'Readable', visible: true, width: '8%' },
      { field: '_wR', header: 'Writable', visible: true, width: '8%' },
      { field: '_metDesc', header: 'Description', visible: false, width: '30%' },
    ]

    if (this.customMonService.isFromEdit) // check whether UI is from "ADD" or "EDIT"  mode
    {
      //this.customMonService.isFromEdit = false;
      this.flag = true;
      let isCustomCat = false;
     this.jmxMonData = Object.assign({}, this.customMonService.getJMXEditData);
      this.getFilterListAtEdit(this.jmxMonData);  //getting filter list at edit
      this.getBasePath(this.jmxMonData.objNameUI);
    }
  
    let file = this.customMonService.treeData;
    if (this.dataFlag) {
      let obj = this.getVectorNode(file);
      this.files = obj;
    }
    else {
      this.flag = true;
      this.arrMetricConf = [
        { field: '_mN', header: 'Metric Name', visible: false, width: '21%' },
        { field: '_metKeyIdx', header: 'Metric Key', visible: false, width: '21%' },
        { field: '_dT', header: 'Data type', visible: false, width: '25%' },
        { field: '_metDesc', header: 'Description', visible: false, width: '24%' },
      ]
    }
    if (this.customMonService.isFromEdit && this.dataFlag) {
      let bsPathName = [];
      this.openChildNodeInEdit(bsPathName);
    }

    this.reqData['jmxMonData'] = this.jmxMonData;
    
    this.filterList = UtilityService.createListWithKeyValue(JMX_MON_CONSTANTS.JMX_FILTER_LIST_LABEL, JMX_MON_CONSTANTS.JMX_FILTER_LIST_VALUE);
  }

  nodeSelect(event) {
    this.flag = true;
    let attributeDataArr = [];
    if (event.node.children.length == 0) {
      this.getBasePath(event.node.objName);
      this.jmxMonData.objNameUI = event.node.objName;
    }
    if (event.node.data != null) {
      Object.keys(event.node.data).map(function (each) {
        if (each.includes(".")) {
          event.node.data[each]['Name'] = each;
          event.node.data[each]['Description'] = each;
          attributeDataArr.push(event.node.data[each]);
        }
        else {
          attributeDataArr.push(event.node.data[each]);
        }
      })
      this.autoFillMetricHierarchy(attributeDataArr);
    }
    else {
      let nodeNameArr = [];
      this.getNodeName(event.node, nodeNameArr);
      if (event.node.data == null && event.node.children.length == 0) {
        this.customMonService.getChildMbeans(this.domainName, nodeNameArr, this.customMonService.jmxMonitorConnectionKey).subscribe((res) => {
          if (res[1] == null) {
          }
          else {
            event.node.data = res[1];
            event.node.children = [];
            Object.keys(res[1]).map(function (each) {
              if (each.includes(".")) {
                res[1][each]['Name'] = each;
                res[1][each]['Description'] = each;
                attributeDataArr.push(res[1][each]);
              }
              else {
                attributeDataArr.push(res[1][each]);
              }
            })
            setTimeout(() => {
              this.autoFillMetricHierarchy(attributeDataArr);
            }, 0);
          }
        })
      }
    }
    this.jmxMonData.metricKey = "";
    this.jmxMonData.operator = "";
  }

  loadNode(event) {
    let nodeNameArr = [];
    this.getNodeName(event.node, nodeNameArr);
    if (event.node.children[0]['label'] != "" || event.node.data != null) {
    }
    else {
      this.customMonService.getChildMbeans(this.domainName, nodeNameArr, this.customMonService.jmxMonitorConnectionKey).subscribe((res) => {
        if (res[1] == null || Object.keys(res[1].length != 0)) {
          let obj = this.getChildNode(res[0])
          event.node.children = obj;
        }
        else {
          event.node.data = res[1];
          event.node.children = [];
          let attributeDataArr = [];
          Object.values(res[1]).map(function (each) {
            attributeDataArr.push(each);
          })
          setTimeout(() => {
            this.autoFillMetricHierarchy(attributeDataArr);
          }, 0);
        }
      })
    }
  }

  autoFillMetricHierarchy(dataNode) {
    let arr = [];
    let mkeyList = [];
    mkeyList.unshift("--Select Metric Key--");
    for (let j = 0; j < dataNode.length; j++) {
      let obj = new MetricConfData();
      obj['_mN'] = dataNode[j]['Name'];
      obj['_metKeyIdx'] = dataNode[j]['Name'];
      obj['_metDesc'] = dataNode[j]['Description'];
      obj['_rD'] = dataNode[j]['Readable'];
      obj['_wR'] = dataNode[j]['Writable'];
      obj['_dT'] = dataNode[j]['Type'];
      if(dataNode[j]['Type'].includes("String") || dataNode[j]['Type'].includes("ObjectName"))
        obj['_isChk'] = false;
      else
      {
        if(dataNode[j]['Type'].includes("CompositeData") && !dataNode[j]['Name'].includes("."))
          obj['_isChk'] = false;  
        else
          obj['_isChk'] = true; 
      }
      if(obj['_dT'].includes('CompositeData') && !obj['_metKeyIdx'].includes('.'))
        obj['disabled'] = true;
      obj['id'] = j;
      if(dataNode[j]['Type'].includes("int") || dataNode[j]['Type'].includes("long") || dataNode[j]['Type'].includes("double"))
        mkeyList.push(dataNode[j]['Name']);
      if (obj._mN != '') {
        arr.push(obj);
      }
    }
    this.metricKeyList = UtilityService.createDropdown(mkeyList);
    this.customMonService.autoFillMetricInfoData(arr);
  }

  saveJMXMonConf() {
    //let gdfPrefix = this.cmsObj.gdfPrefixCustomMon(MON_CONSTANT.JMX_TYPE)
    this.jmxMonData.connParams = this.customMonService.getJmxConnParam();
    this.createMetadata();
    this.customMonService.saveMonitorConfProvider(true);
    this.reqData.objectId = this.customMonService.objectID;
    //adding custom category name to category tag in json backend
    if (this.jmxMonData.cat == 'addNewTechnology') {
      this.jmxMonData.cat = this.jmxMonData.cusCat;
    }
    
    if (this.jmxMonData.bsPath == "") {
      this.msgServiceObj.add({severity:COMPONENT.SEVERITY_ERROR,summary:COMPONENT.SUMMARY_ERROR,detail:"Please select Metric Hierarchy"});
      return false;
    }

    if((this.jmxMonData.metricKey || this.jmxMonData.operator) && this.jmxMonData.filterVal == undefined){
     this.msgServiceObj.add({severity:COMPONENT.SEVERITY_ERROR,summary:COMPONENT.SUMMARY_ERROR,detail:"Provide Filter value"});
      return false;
    }
    
    this.jmxMonData.gdfInfo.metricInfo = this.jmxMonData.gdfInfo.metricInfo.filter(function (val) {
     
      return val.depMConf[0]['_isChk'];
    })
   
    if (!this.customMonService.validateConfigurationData(this.jmxMonData)){
    return false;
    }
    
    // if(this.cmsObj.isFromEdit){
    //   this.cmsObj.saveCustomMonConfAtEdit(this.jmxMonData, gdfPrefix);
    // }
    // else{
    //   this.cmsObj.checkDuplicateGDFForCustomMon(gdfPrefix,this.jmxMonData);
    // }
    this.jmxMonData.monN = this.jmxMonData.gdfInfo.grpN
      this.reqData['jmxMonData'] = this.jmxMonData;
      this.loading = true
    this.customMonService.saveJMXData(this.reqData).subscribe(data=>{
      if(data['status']){
        this.msgServiceObj.add({severity:COMPONENT.SEVERITY_SUCCESS, summary: COMPONENT.SUMMARY_SUCCESS,detail:data['msg']})
    this.reqData = new APIData(); // for clearing fields of the form after save
    this.loading = false
    setTimeout(()=>{
           this.router.navigate(["/custom-monitors/availCustMon/jmx"]);
          },500)
      }
      else{
        this.msgServiceObj.add({ severity: COMPONENT.SEVERITY_ERROR, summary: COMPONENT.SUMMARY_ERROR, detail: data['msg'] })
        this.loading = false;
      }
          })
  }

  ngOnDestroy() {
    this.customMonService.isFromEdit = false;
    this.customMonService.treeData = [];
    this.customMonService.objectID = "-1";
    this.files = [];
    this.customMonService.setMetricData([]);
    //this.cmsObj.editNotAllowed = false;
    this.customMonService.jmxDataFlag = false;
    //this.cmsObj.gdfNameAtEdit = "";
    this.jmxMonData = new JMXMonData();
    this.customMonService.disableFields = false;
    this.customMonService.jmxMonitorConnectionKey = "";
    this.customMonService.setJmxConnParam(this.jmxMonData.connParams);
  }

  getVectorNode(node) {
    let vectorParentNode;
    let data = []
    for (let i = 0; i < node.length; i++) {
      vectorParentNode = {
        "label": node[i],
        "key": "Domain",
        "children": [{ 'label': '' }],
        "expandedIcon": "gui gui-folder-open",
        "collapsedIcon": "gui gui-folder",
        "color": "black",
        "data": null
      }
      data.push(vectorParentNode);
    }
    return data;
  }

  getChildNode(node) {
    let vectorParentNode;
    let data = []
    for (let key in node) {
      vectorParentNode = {
        "label": key,
        "key": node[key][0],
        "objName": node[key][2],
        "children": node[key][1] == "true" ? [{ 'label': '' }] : [],
        "expandedIcon": node[key][1] == "true" ? "gui gui-folder-open" : "gui gui-3d",
        "collapsedIcon": node[key][1] == "true" ? "gui gui-folder" : "gui gui-3d",
        "color": "black",
        "data": null
      }
      data.push(vectorParentNode);
    }
    return data;
  }

  getNodeName(node, nodeNameArr) {
    if (node.parent == undefined) {
      this.domainName = node.label;
      return nodeNameArr;
    }
    else {
      nodeNameArr.push(node.label);
      return this.getNodeName(node.parent, nodeNameArr);
    }
  }

  createMetadata() {
    let list = [];
    let mD = '';
    mD = mD + "Tier>" + "Server>" + "Instance>";
    let str = "";
    if (this.bPathList && this.bPathList.length > 0) {
      for (let i = 0; i < this.bPathList.length; i++) {
        let arr: MetricHierarchyData = new MetricHierarchyData();
          arr['id'] = i;
          arr['_metadata'] = this.bsPathName[i];
          arr['_keyInd'] = this.bPathList[i]['value'];
          str = str + this.bPathList[i]['value'] + ">";
          list.push(arr);
      }
    }
    mD = mD + str;
    mD = mD.substring(0, mD.length - 1); // for skipping last character (>)

    this.jmxMonData.gdfInfo.mD = mD;
    this.jmxMonData.gdfInfo.depMHComp = list;

  }

  //used to getting basePath list and thier respective node names
  getBasePath(objName) {
    let bPathLabelArr = [];
    let bPathValuelArr = [];
    let instance = this.jmxConnParam.instance ;
    let that = this;
    let str = objName.split(":");
    this.domainName = str[0];
    let objNameStr = str[1].split(",");
    if(this.jmxConnParam.instance == "Other")
      instance = this.jmxConnParam.custInstance; 
    let bpTmpVal = this.jmxConnParam.tier + ">" + this.jmxConnParam.server + ">" + instance + ">";
    let bpValue = "";
    for(let i=0; i<objNameStr.length; i++){
      let bPathStr = objNameStr[i].split("=");
      bpTmpVal = bpTmpVal + bPathStr[1] + ">";
      let bp = bpTmpVal;
      bPathValuelArr.push(bPathStr[0]);
      that.bsPathName.push(bPathStr[1]);
      for(let j=i+1; j<objNameStr.length; j++){
        bp = bp + "*" + ">";
      }
      bpValue = bp.substring(0, bp.length - 1);
      
      bPathLabelArr.push(bpValue);

    }
    //this.bPathList.push({label:bpValue,value: bpValue})
    this.bPathList = UtilityService.createListWithKeyValue(bPathLabelArr, bPathValuelArr);
    
  }

  //method is used to open tree nodes in edit time
  openChildNodeInEdit(bsPathName) {
    this.customMonService.getChildMbeans(this.domainName, bsPathName, this.customMonService.jmxMonitorConnectionKey).subscribe((res) => {
      if (res != null && Object.keys(res[0]).length != 0) {
        this.editModeTreeData.push(res[0]);
      }
      else if(res == null){
        this.isConnectionBreak = true;
        this.getFilterListAtEdit(this.jmxMonData);  //getting filter list at edit
        return;
      }
      if (this.count != this.bsPathName.length) {
        let bsPath = [];
        for (let j = 0; j <= this.count; j++) {
          bsPath.push(this.bsPathName[j]);
        }
        bsPath.reverse();
        this.count = this.count + 1;
        this.openChildNodeInEdit(bsPath);
      }
      else {
        this.count = 0;
        let that = this;
        let obj = this.getChildNode(this.editModeTreeData[0])
        this.files.map(each => {
          if (each.label == that.domainName) {
            each.children = obj;
            each.expanded = true;
            that.fillDataAtEdit(each.children, this.bsPathName);
          }
        })
      }
    })
  }

  //method is used to open tree nodes in edit time
  fillDataAtEdit(node, nodeName) {
    let that = this;
    this.nodeCount = this.nodeCount + 1;
    if (this.editModeTreeData.length >= this.nodeCount) {
      node.map(each => {
        if (each.label == nodeName[this.nodeCount - 1]) {
          let nodeObj = this.getChildNode(this.editModeTreeData[this.nodeCount])
          each.children = nodeObj;
          each.expanded = true;
          if (this.editModeTreeData.length == this.nodeCount) {
            each.color = "blue";    //added to highlight tree node in edit mode
          }
          return that.fillDataAtEdit(each.children, nodeName);
        }
      })
    }
  }

  //method call to open jmx connection dialog in disable mode
  openJMXConDialog(){
    //this.disableFields = true;
    this.jmxConnDialog = true;  
    this.customMonService.disableFields = true;
    
  }

  //setting filterList and meticKeyList at edit
  getFilterListAtEdit(data){
    if (data['gdfInfo']['metricInfo'].length > 0) {
      let metricInfo = data['gdfInfo']['metricInfo'];
      let mkeyList = [];
      let arr = [];
      let that = this;
      mkeyList.unshift("--Select Metric Key--");
        metricInfo.map(function (each) {
        let mConf = new MetricConfData(); 
        mConf = each['depMConf'][0];
        if(that.isConnectionBreak){
          mConf['disabled'] = true;
          mConf['_isChk'] = false;
          arr.push(mConf);
        }
        else{
          if(mConf._dT.includes("int") || mConf._dT.includes("long") || mConf._dT.includes("double")){
            mkeyList.push(mConf._metKeyIdx);
          }
        }
        if(mConf['_dT'].includes('CompositeData') && !mConf['_metKeyIdx'].includes('.'))
          mConf['disabled'] = true;
      })
        this.metricKeyList = UtilityService.createDropdown(mkeyList);
        if(this.isConnectionBreak){
          this.customMonService.autoFillMetricInfoData(arr);
        }
    }
  }

  validateFilterVal(val){
    var pattern = /^[0-9]$/;
    if(pattern.test(val.key) || val.key == "Backspace")
     {
      return true;
     }
     return false;
  }

  //getting object name for savinf in config json on basepath dropdown change
  getObjName(){
    let that = this;
    let finalStr = "";
    let flag = false;
    let str = this.jmxMonData.objNameUI.split(":");
    finalStr = str[0] + ":";
    let objNameStr = str[1].split(",");
    objNameStr.map(function (each) {
      let bPathStr = each.split("=");
      if(!flag){
        finalStr = finalStr + each + ",";
        if(that.jmxMonData.bsPath == bPathStr[0]){
          flag = true;
        }
      }
      else{
        finalStr = finalStr + bPathStr[0] + "=*,";
      }
    })
    this.jmxMonData.objName = finalStr.substring(0, finalStr.length - 1);
  }
  onDialogClose(event) {
    this.jmxConnDialog  = event;
 }
}
