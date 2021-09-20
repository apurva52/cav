import { RelatedmetricsComponent } from './../../metrics/relatedmetrics/relatedmetrics.component';
import { DashboardComponent } from './../../dashboard/dashboard.component';
import { Component, OnInit, ViewEncapsulation, Input, ChangeDetectorRef, ViewChild } from '@angular/core';
import { PageDialogComponent } from '../../page-dialog/page-dialog.component';
import {
  METRIC_DROPDOWN_DATA
} from './service/metric-indices.dummy';
import { Table } from '../../table/table.model';
import { MetricIndices } from './service/metric-indices.model';
import { derivedIndicesService } from './service/metric-indices.service'
import { AppError } from 'src/app/core/error/error.model';
import { Store } from 'src/app/core/store/store';
import { DerivedMetricService } from '../service/derived-metric.service';
import { DerivedMetricComponent } from '../derived-metric.component';
import { hierarchialDataCreatedState, hierarchialDataCreatingErrorState, hierarchialDataCreatingState } from './service/metric-indices.state';
import { hierarchicalData } from './service/metric-indices.model';
import { DashboardTime } from '../../dashboard/service/dashboard.model';
import { SessionService } from 'src/app/core/session/session.service';
import * as _ from 'lodash';
import { AlertConfigurationComponent } from 'src/app/pages/my-library/alert/alert-rules/alert-configuration/alert-configuration.component';
import { ConfirmationService } from 'primeng/api';
import { PatternMatchingService } from '../../pattern-matching/service/pattern-matching.service';
import { AddReportSettingsComponent } from 'src/app/pages/my-library/reports/metrics/add-report-settings/add-report-settings.component';


@Component({
  selector: 'app-derived-metric-indices',
  templateUrl: './derived-metric-indices.component.html',
  styleUrls: ['./derived-metric-indices.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DerivedMetricIndicesComponent
  extends PageDialogComponent
  implements OnInit {
  dashboardComponent: DashboardComponent;
  groupName: any;
  groupList: any[];
  specificIndicesData: Table;
  testIndicesData: Table;
  data: MetricIndices;
  isEnabledColumnFilter: boolean = false;
  selectedValue: string = 'val1';
  tire: any;
  server: any;
  instance: any;
  pages: any;
  totalHierarchyList = [];
  hierarchy1: string;
  hierarchy2: string;
  hierarchy3: string;
  hierarchy4: string;
  patternlist = [];
  showTreeTableToggler;
  dataHierarchial: hierarchicalData;
  error: AppError;
  loading: boolean;
  empty: boolean;
  val1: boolean = true;
  val2: boolean;
  onFirstTimeLoad: boolean;
  totalData = [];
  prevTotalData = [];
  dropDownIndex: number;
  taggList = [];
  metadataName: string;
  metaDataNameFromHierarchy: string;
  selectedIndices: string[] = [];
  previousSpecifiedData : any = null;
  isSpecifiedCheckBox = false;
  selectedTestIndices: string[] = [];
  patternArray = [];
  str: any;
  finalArrayOfSelectedIndices = [];
  parentArr = [];
  expressionForAdvancedSelection: string = '';
  arrOfSelectedIndices = [];
  pattern: string = ''
  toEnterPattern: boolean = false;
  tempdata: any;
  tagListFromIndices = {};
  finalArr: string = '';
  @Input() derivedMetric: DerivedMetricComponent;
  @Input() alertConfigurationComponent: AlertConfigurationComponent;
  @Input() relatedmetricsComponent: RelatedmetricsComponent
  @Input() addReportSettingsComponent: AddReportSettingsComponent;
  ruleDuration: any;
  dialogVisible: boolean = false;
  dt22: any;
  @ViewChild('tt1') table: any;
  isBlockUI: boolean = false;
  constructor(private derivedService: derivedIndicesService, private derivedMetricService: DerivedMetricService, private sessionSessionService: SessionService, private ref: ChangeDetectorRef, public confirmation: ConfirmationService, private patternMatch: PatternMatchingService) {
    super();

  }

  openDerivedIndecesWindowForRule(duration: any, groupName: any, groupNameList: any[]) {
    const me = this;
    me.ruleDuration = duration;
    this.groupName = groupName;
    this.groupList = groupNameList;
    me.previousSpecifiedData = null;
    me.isSpecifiedCheckBox = false;
    this.show();
  }


  openDerivedIndecesWindowForRelated(duration: any, groupName: any, groupNameList: any[]) {
    const me = this;
    me.ruleDuration = duration;
    this.groupName = groupName;
    this.groupList = groupNameList;
    me.previousSpecifiedData = null;
    me.isSpecifiedCheckBox = false;
    this.show();
  }

  /**
   * This method is used for get the group name object from the group name list
   */
  getGroupNameObject(groupName) {
    try {

      if (this.groupList && this.groupList.length > 1) {
        for (let i = 0; i < this.groupList.length; i++) {
          if (this.groupName === this.groupList[i].value) {
            return this.groupList[i];

          }
        }
      }

    } catch (error) {
      console.error("Exception in getGroupNameObject method = ", error);
    }
  }

  /**
   * This method is used for open the derived indices window
   */
  openDerivedIndecesWindow(dashboardCom: DashboardComponent, groupName: string, groupNameList: any[] , previousSpecifiedData: any , isSpecified: boolean) {
    console.log("patternMatching----------->", this.patternMatch);
    if (this.patternMatch.flagPattern) {
      this.groupName = this.patternMatch.getGroupNameObject().groupName;
      this.groupList = this.patternMatch.groupData.group;
    }
    else {
      this.previousSpecifiedData = previousSpecifiedData;
      this.isSpecifiedCheckBox = isSpecified;
      this.dashboardComponent = dashboardCom;
      this.groupName = groupName;
      this.groupList = groupNameList;
    }
    this.show();
  }

  ngOnInit(): void {
    const me = this;
    me.data = METRIC_DROPDOWN_DATA;
  }

  /**
   * This method is used for make the request payload for heirarchical data
   */
  makePayloadForGettingHierarchy(taggs, level, glbMgId) {
    const payLoad =
    {
      "opType": "9",
      "tr": this.sessionSessionService.testRun.id,
      "cctx": this.sessionSessionService.session.cctx,
      "duration": this.getDuration(),
      "clientId": "Default",
      "appId": "Default",
      "glbMgId": glbMgId,
      "levels": level,
      "subject": {
        "tags": taggs
      }
    }
    return payLoad;
  }

  /**
   * This method is used for getting the tag list
   */
  gettingListOfTaggs(metaDataValue, metadata) {

    let mode = 1;
    if (this.onFirstTimeLoad)
      return [];
    else {
      if (metaDataValue == "ALL") {
        mode = 2;
      }
      this.taggList.push(
        {
          "key": metadata,
          "value": metaDataValue,
          "mode": mode
        }
      )
    }
    return this.taggList;

  }

  /**
   * This method is used for get the duration object from the dashboard component
   */
  getDuration() {
    try {

      if (this.ruleDuration)
        return this.ruleDuration;
      else {
        let duration = null;
        if (this.patternMatch.flagPattern ||this.patternMatch.globalCatalogue) {
          duration = this.patternMatch.duration;
        }
        else {
          const dashboardTime: DashboardTime = this.dashboardComponent.getTime(); // TODO: widget time instead of dashboard

          const startTime: number = _.get(
            dashboardTime,
            'time.frameStart.value',
            null
          );
          const endTime: number = _.get(dashboardTime, 'time.frameEnd.value', null);
          const graphTimeKey: string = _.get(dashboardTime, 'graphTimeKey', null);
          const viewBy: string = _.get(dashboardTime, 'viewBy', null);

          duration = {
            st: startTime,
            et: endTime,
            preset: graphTimeKey,
            viewBy,
          }
        }

        return duration;
      }

    } catch (error) {
      console.error("Error is coming while getting the duration object ", error);
      return null;
    }
  }

  /**
   * This method is used for do the rest call for get the test window data.
   */
  getTestWindowData(payload) {
    const me = this;
    this.derivedService.loadHierarcialData(payload).subscribe(
      (state: Store.State) => {
        if (state instanceof hierarchialDataCreatingState) {
          me.onLoading(state);
          return;
        }

        if (state instanceof hierarchialDataCreatedState) {
          me.onLoadedTestData(state);
          return;
        }
      },
      (state: hierarchialDataCreatingErrorState) => {
        me.onLoadingError(state);
      }
    );


  }

  /**
    * This method is used for do the rest call for get the Specified window data.
    */
  getSpecifiedData(payload) {
    const me = this;
    this.derivedService.loadHierarcialData(payload).subscribe(
      (state: Store.State) => {
        if (state instanceof hierarchialDataCreatingState) {
          me.onLoading(state);
          return;
        }

        if (state instanceof hierarchialDataCreatedState) {
          me.onLoadedSpecifiedData(state);
          return;
        }
      },
      (state: hierarchialDataCreatingErrorState) => {
        me.onLoadingError(state);
      }
    );


  }

  /**
   * This method is used for load the 1st level Hierarchy
   */
  getIndicesListOnComponentLoad(payload) {
    const me = this;
    this.derivedService.loadHierarcialData(payload).subscribe(
      (state: Store.State) => {
        if (state instanceof hierarchialDataCreatingState) {
          me.onLoading(state);
          return;
        }

        if (state instanceof hierarchialDataCreatedState) {
          me.onLoaded(state);
          return;
        }
      },
      (state: hierarchialDataCreatingErrorState) => {
        me.onLoadingError(state);
      }
    );


  }
  private onLoading(state: hierarchialDataCreatingState) {
    const me = this;
    me.error = null;
    me.loading = true;
    me.isBlockUI = true;
  }

  private onLoadingError(state: hierarchialDataCreatingErrorState) {
    const me = this;
    me.data = null;
    me.error = state.error;
    me.loading = false;
    me.isBlockUI = false;
  }


  /**
   * This method is used for fill the test window data
   */
  private onLoadedTestData(state: hierarchialDataCreatedState) {
    const me = this;
    me.error = null;
    me.loading = false;
    me.isBlockUI = false;
    this.makeDataForTest(state.data);
  }

  /**
   * This is used for fill the specified window data
   */
  private onLoadedSpecifiedData(state: hierarchialDataCreatedState) {
    const me = this;
    me.error = null;
    me.loading = false;
    me.isBlockUI = false;
    this.makeData(state.data);

  }

  /**
   * This method is used for make the data for the test window data
   */
  makeDataForTest(resData) {

    let heirarchy = resData.hierarchy;

    this.testIndicesData = {};

    if (heirarchy && heirarchy.length > 0) {

      let paginator = {
        first: 0,
        rows: 10,
        rowsPerPageOptions: [10, 20, 40, 80, 100],
      }

      let groupNameObj = this.getGroupNameObject(this.groupName);
      let headers = this.makeHeader(groupNameObj);
      let data = this.getTreeTableData(heirarchy, headers)
      let k = {};

      this.testIndicesData.paginator = { ...paginator };
      this.testIndicesData.headers = [...headers];
      this.testIndicesData.data = [...data];
      this.testIndicesData = { ...this.testIndicesData };
      this.ref.detectChanges();

    }else {
      this.alertMsg("Selected pattern does not exist in the selected group", "Error");
      return;
    }
  }

  /**
   * This method is used for make the data for the test window data on apply
   */
  makeDataForTestCheckOnApply(resData, selectedIndices) {

    let heirarchy = resData.hierarchy;

    if (heirarchy && heirarchy.length > 0) {

      this.expressionForAdvancedSelection = 'PATTERN#' + this.expressionForAdvancedSelection.substring(1, this.expressionForAdvancedSelection.length);

      if (this.patternMatch && this.patternMatch.flagPattern) {
        this.patternMatch.setTotalHierarchyList(this.totalHierarchyList);
        this.patternMatch.setExpressionForAdvancedSelection(this.expressionForAdvancedSelection);
        this.patternMatch.setSelectedTestIndices(selectedIndices);
      }

      if (this.derivedMetric) {
        this.derivedMetric.getDataFromIndices(this.expressionForAdvancedSelection, this.taggList , this.totalData);
      }
      if (this.alertConfigurationComponent) {
        this.alertConfigurationComponent.getDataFromIndices(this.expressionForAdvancedSelection, this.taggList);
      }
      if (this.relatedmetricsComponent) {
        this.relatedmetricsComponent.getDataFromIndices(this.expressionForAdvancedSelection, this.taggList);
      }
      if (this.addReportSettingsComponent) {
        this.addReportSettingsComponent.getDataFromIndices(this.expressionForAdvancedSelection, this.taggList);
      }
      super.hide();
      this.ref.detectChanges();

    }else {
      this.alertMsg("Selected pattern does not exist in the selected group", "Error");
      return;
    }
  }

  /**
   * This method id used for make the data of specified window
   */
  makeData(resData) {

    let heirarchy = resData.hierarchy;

    if (heirarchy && heirarchy.length > 0) {

      let paginator = {
        first: 0,
        rows: 10,
        rowsPerPageOptions: [10, 20, 40, 80, 100],
      }

      let groupNameObj = this.getGroupNameObject(this.groupName);
      let headers = this.makeHeader(groupNameObj);
      let data = this.getTreeTableData(heirarchy, headers);
      this.specificIndicesData.paginator = paginator;
      this.specificIndicesData.headers = headers;
      this.specificIndicesData.data = data;
      this.ref.detectChanges();
    }
  }

  /**
   * This method is used for make the header of the table.
   */
  makeHeader(groupNameObj) {
    try {
      let header = [];
      let headerJson = {};
      let colArr = [];

      if (groupNameObj) {
        let heirachy = groupNameObj.hierarchicalComponent;
        if (heirachy && heirachy !== "") {
          let heirachyArr = heirachy.split(">");
          if (heirachyArr && heirachyArr.length > 0) {
            for (let i = 0; i < heirachyArr.length; i++) {
              let json = {};
              json['label'] = heirachyArr[i];
              json['valueField'] = heirachyArr[i];
              json['classes'] = 'text-left';
              json['isSort'] = false;
              let filterJson = {};
              filterJson['isFilter'] = false;
              filterJson['type'] = 'contains';
              json['filter'] = filterJson;

              colArr.push(json);
            }

            headerJson['cols'] = colArr;
            header.push(headerJson);
          }
        }
      }
      return header;
    } catch (error) {
      return [];
    }


  }


  private onLoaded(state: hierarchialDataCreatedState) {
    const me = this;
    me.dataHierarchial = state.data;
    me.error = null;
    me.loading = false;
    me.isBlockUI = false;
    this.populateGroupData(me.dataHierarchial);
  }

  /**
   * This method id used for fill the drodown list of test window data
   */
  populateGroupData(dataToPopulate) {
    let json = dataToPopulate['hierarchy'];
    if (!json) {
      return;
    }
    for (let i = 0; i < json.length; i++) {
      let vList = [];
      this.metadataName = json[i]['metadata']
      let metadataPresent = false;
      let count = 0;
      for (let k = 0; k < this.totalHierarchyList.length; k++) {
        if (this.totalHierarchyList[k] === this.metadataName) {
          metadataPresent = true;
          count = k;
          break;
        }
      }

      if (metadataPresent) {
        vList.push({ label: 'ALL', value: 'ALL' })
        vList.push({ label: 'Select Pattern', value: 'Select Pattern' })
        for (let j = 0; j < json[i].vectorList.length; j++) {
          vList.push({ label: json[i].vectorList[j], value: json[i].vectorList[j] })
        }


        let k = this.totalData[count];
        let data = {
          metadata: k.metadata,
          vectorList: vList,
          isPatterBox: false,
          value: ""
        }

        this.totalData[count] = { ...data };
        this.ref.detectChanges();
      }
    }
  }

  /**
   * This method is called when user chnaged the radio button value
   */
  changedValue(value) {

    this.specificIndicesData = {};
    this.finalArr = '';
    this.selectedIndices = [];
    let graphNameObj = this.getGroupNameObject(this.groupName);
    let level = 1;
    this.dropDownIndex = 0;
    if (graphNameObj && graphNameObj.hierarchicalComponent) {
      let arrLevels = graphNameObj.hierarchicalComponent.split(">");
      level = arrLevels.length;
    }

    if (value == "val2") {
      let payLoad = this.makePayloadForGettingHierarchy([], level, graphNameObj.glbMgId);
      this.getSpecifiedData(payLoad);

    } else {
      this.testIndicesData = {};
      this.totalData = [];
      this.totalHierarchyList = graphNameObj.hierarchicalComponent.split(">")
      for (let i = 0; i < this.totalHierarchyList.length; i++) {
        let json = {};
        json['metadata'] = this.totalHierarchyList[i];
        json['vectorList'] = [];
        this.totalData.push(json);
      }
      const payload = this.makePayloadForGettingHierarchy([], 1, graphNameObj.glbMgId);
      this.getIndicesListOnComponentLoad(payload);
    }
  }

  /**
   * This method is called when user open the derived indices window.
   */
  public show() {
    super.show();
    this.isBlockUI = false;
    this.testIndicesData = {};
    const me = this;
    me.selectedValue = 'val1';
    if(me.isSpecifiedCheckBox) {
      me.selectedValue = 'val2';
    }

    if(me.previousSpecifiedData &&  me.selectedValue == 'val2') {
      me.selectedIndices = me.previousSpecifiedData;
    }
    else if(me.previousSpecifiedData &&  me.selectedValue == 'val1') {
       me.totalData = me.previousSpecifiedData;
    }

    if(!me.previousSpecifiedData && me.selectedValue == "val1") {
      this.totalData = []
      this.arrOfSelectedIndices = []
      this.expressionForAdvancedSelection = ''
      this.onFirstTimeLoad = true;
      this.finalArr = '';
      let graphNameObj = this.getGroupNameObject(this.groupName);
      this.totalHierarchyList = graphNameObj.hierarchicalComponent.split(">")

      for (let i = 0; i < this.totalHierarchyList.length; i++) {
        let json = {};
        json['metadata'] = this.totalHierarchyList[i];
        json['vectorList'] = [];
        json['isPatterBox'] = false;
        json['value'] = "";
        this.totalData.push(json);
      }

      const payload = this.makePayloadForGettingHierarchy([], 1, graphNameObj.glbMgId);
      me.getIndicesListOnComponentLoad(payload);
    }


  }

  /**
   * This method id used for make the data in the form of tree table
   */
  getTreeTableData(res , headers) {
    let finalOp = [];
    for (let index = 0; index < res.length; index++) {
      let obj1 = {};
      let data = {};
      let children = [];

      let op1 = res[index];
      let isMetaDataAvail = this.checkMetaDataAvailable(headers, op1);

      data[op1.metadata] = op1.vector;
      obj1['data'] = data;

      if (isMetaDataAvail && op1['subjects'] && op1['subjects'].length > 0) {
        this.recu(op1['subjects'], children, data);
        obj1['children'] = children;
        finalOp.push(obj1);
      }
    }

    return finalOp;

  }
  checkMetaDataAvailable(headers: any, op1: any) {
    let isMetaDataAvail = false;
    try {

      let metaData = op1.metadata;
      if(headers && headers.length > 0) {
        let colmnNameArr = headers[0].cols;
        if(colmnNameArr && colmnNameArr.length > 0) {
          for (let i = 0 ; i < colmnNameArr.length ; i++) {
            let colName = colmnNameArr[i];
            if(colName && (metaData == colName['label'])) {
              isMetaDataAvail = true;
              return true;
            }
          }
        }
      }
    } catch (error) {
      console.error("Exception is coming in method checkMetaDataAvailable" , error);
    }

    return isMetaDataAvail;
  }

  /**
   * This is the recusion funtion to make the data for the table
   */
  recu(subject: [], children, parentData) {

    for (let index = 0; index < subject.length; index++) {
      let element = subject[index];
      let data = {};
      let obj = {};
      let graphNameObj = this.getGroupNameObject(this.groupName);
      if (graphNameObj.hierarchicalComponent.indexOf(element['metadata']) == -1) {
        continue;
      }

      Object.keys(parentData).forEach(function (key) {
        data[key] = parentData[key];

      });

      data[element['metadata']] = element['vector'];


      obj['data'] = data;

      if (element['subjects']) {
        let children1 = [];
        this.recu(element['subjects'], children1, data);
        obj['children'] = children1;
      }
      children.push(obj);
    }
  }

  /**
   * This method is called when user changed the heirarchy from the drop down .
   */
  OnHierarchyChange(event, i, metadataName) {
    this.onFirstTimeLoad = false;

    if (this.dropDownIndex >= i) {
      this.taggList = this.taggList.slice(0, i);
      for (let k = i + 1; k < this.totalData.length; k++) {
        this.totalData[k].vectorList = [];
        this.totalData[k].isPatterBox = false;
        this.totalData[k].value = "";
      }
    }

    if (event.value == 'Select Pattern') {
      this.toEnterPattern = true;
      this.totalData[i]['isPatterBox'] = true;
      this.totalData[i].value = "";
      this.taggList = this.gettingListOfTaggs('ALL', metadataName);

    }
    else {
      this.totalData[i]['isPatterBox'] = false;
      this.totalData[i].value = event.value;
      //this.arrOfSelectedIndices.push(event.value)
      this.taggList = this.gettingListOfTaggs(event.value, metadataName)
    }
    this.metaDataNameFromHierarchy = metadataName
    let graphNameObj = this.getGroupNameObject(this.groupName);
    let payLoad = this.makePayloadForGettingHierarchy(this.taggList, 1, graphNameObj.glbMgId);
    this.getIndicesListOnComponentLoad(payLoad);
    this.dropDownIndex = i;
    this.pattern = '';


  }

  nodeSelect(event) {
    try {

      let data = event.node;
      let midLevelHierarchy = false;
      this.finalArrayOfSelectedIndices = [];
      this.str = Object.values(data.data)[0] + '>'
      let tempData: any;
      if (!data.parent && data.children && data.children.length > 0) {
        midLevelHierarchy = false;
        tempData = this.forGettingSelectedIndices(event.node.children, true);
      }
      else if (data.parent && data.children && data.children.length > 0) {
        midLevelHierarchy = true;
        this.finalArrayOfSelectedIndices = [];
        let childdata = this.forGettingSelectedIndices(data.children, false);
        this.xml(data);
        let hybridArr = [];
        let elementToRemove = childdata[0].split(">")[0];
        let indexOfStringToremove = this.finalArrayOfSelectedIndices[0].indexOf(elementToRemove);
        let stringToAdd = this.finalArrayOfSelectedIndices[0];
        if (elementToRemove !== "" && stringToAdd.endsWith(elementToRemove))
          stringToAdd = this.finalArrayOfSelectedIndices[0].substring(0, indexOfStringToremove);
        for (let i = 0; i < childdata.length; i++) {
          hybridArr[i] = stringToAdd + childdata[i];
        }
        this.finalArrayOfSelectedIndices = hybridArr;
        if (this.finalArr) {
          if (this.finalArr == "") {
            this.finalArr = '' + this.finalArrayOfSelectedIndices;
          } else {
            this.finalArr = this.finalArr + ',' + this.finalArrayOfSelectedIndices;
          }
        }
        else {
          this.finalArr = "" + this.finalArrayOfSelectedIndices;
        }
      }
      else {
        midLevelHierarchy = false;
        tempData = this.xml(data);
      }

      /*total arr calculation*/
      if (!midLevelHierarchy) {
        if (this.finalArr && this.finalArr != "")
          this.finalArr = this.finalArr + ',' + tempData;
        else this.finalArr = tempData;

      }

      if(this.finalArr && this.finalArr != "" && this.finalArr.indexOf(",") != -1) {
          let arr = this.finalArr.split(",");
          let uniqueChars = [...new Set(arr)];
          this.finalArr = "";
          this.finalArr = uniqueChars.toString();

      }
    }
    catch (e) {
      console.error("exception coming in select node ", e);

    }
  }

  removeNode(nodeData) {
    try {
      let data = nodeData.data;
      let nodeTobeDeleted = "";
      if (data && Object.keys(data).length > 0) {
        Object.keys(data).forEach(function (key) {
          let value = data[key];
          if (nodeTobeDeleted == "") {
            nodeTobeDeleted = value;
          } else {
            nodeTobeDeleted = nodeTobeDeleted + ">" + value;
          }
        });
      }

      // let nodeTobeDeleted: any = Object.values(data.data)[0];
      let tempArr = this.finalArr.toString().split(",");
      let i = 0;
      while (i < tempArr.length) {
        let value = tempArr[i];
        if (value.trim() == nodeTobeDeleted.trim()) {
          tempArr.splice(i, 1);
          i--;
        }
        i++;
      }
      this.finalArr = tempArr.toString();
    } catch (error) {
      console.error("Exception in method removeNode ", error);
    }

  }

  recursiveRemoveNode(nodeData) {
    try {
      if (nodeData.children && nodeData.children.length > 0) {
        for (let i = 0; i < nodeData.children.length; i++) {
          let childData = nodeData.children[i];
          this.recursiveRemoveNode(childData);
        }
      } else {
        this.removeNode(nodeData);
      }
    } catch (error) {
      console.error("Exception in method recursiveRemoveNode ", error);
    }
  }

  nodeUnselect(event) {
    try {
      let nodeData = event.node;
      if (nodeData.children && nodeData.children.length > 0) {
        this.recursiveRemoveNode(nodeData);
      } else {
        this.removeNode(nodeData);
      }
    } catch (error) {
      console.error("Exception in method nodeUnselect ", error);
    }

  }

  // nodeUnselect(event) {
  //   try {
  //     let data = event.node;
  //     let nodeTobeDeleted: any = Object.values(data.data)[0];
  //     let tempArr = this.finalArr.toString().split(",");
  //     let i = 0;
  //     while (i < tempArr.length) {
  //       let value = tempArr[i];
  //       if (value.includes(nodeTobeDeleted)) {
  //         tempArr.splice(i, 1);
  //         i--;
  //       }
  //       i++;
  //     }
  //     this.finalArr = tempArr.toString();

  //   } catch (e) {
  //     console.error('exception in nodeunselect method ===', e)
  //   }
  // }


  forGettingSelectedIndices(res, flag) {
    this.finalArrayOfSelectedIndices = [];
    for (let index = 0; index < res.length; index++) {

      let obj1 = {};
      let data = {};
      let children = [];
      this.str = this.str.split('>')[0];
      let newData = Object.values(res[index].data);
      if (flag) {
        this.str = this.str + '>' + newData[newData.length - 1];
      } else {
        this.str = '>' + newData[newData.length - 1];
      }

      let op1 = res[index];
      obj1['data'] = data;

      if (op1['children'] && op1['children'].length > 0) {
        this.recursiveOperation(op1['children']);
        obj1['children'] = children;
      } else this.finalArrayOfSelectedIndices.push(this.str)

    }
    return this.finalArrayOfSelectedIndices;

  }

  recursiveOperation(children: []) {
    for (let index = 0; index < children.length; index++) {
      this.str = this.str.split('>')[0] + '>' + this.str.split('>')[1]
      let element = children[index];
      let newData = Object.values(children[index]['data']);
      this.str = this.str + '>' + newData[newData.length - 1];
      let data = {};
      let obj = {};
      obj['data'] = data;
      if (element['children'] != null) {
        let children1 = [];
        this.recursiveOperation(element['children']);
        obj['children'] = children1;
      }

      this.finalArrayOfSelectedIndices.push(this.str)
    }
  }

  xml(data) {
    this.parentArr = []
    this.str = '';
    this.finalArrayOfSelectedIndices = []
    let element = data;
    if (element.parent !== null)
      this.getParent(element.parent)
    else {
      this.finalArrayOfSelectedIndices.push(Object.values(data.data)[0]);
    }
    for (let i = this.parentArr.length - 1; i >= 0; i--) {
      this.str = this.str + this.parentArr[i] + '>'
    }

    let newData = Object.values(data.data);
    this.str = this.str + newData[newData.length - 1];
    this.finalArrayOfSelectedIndices.push(this.str)
    return this.finalArrayOfSelectedIndices;

  }


  getParent(data) {
    let element = data
    let newData = Object.values(data.data);
    this.parentArr.push(newData[newData.length - 1]);
    if (element.parent)
      this.getParent(element.parent)
  }

  testAdvancedIndicesSelection() {

    if (this.totalData && this.totalData.length > 0) {
      for (let i = 0; i < this.totalData.length; i++) {
        let data = this.totalData[i];
        if (data && data.isPatterBox == false && data.value == "") {
          this.alertMsg("No " + data.metadata + " is selected, please select a valid " + data.metadata, "Error");
          return;
        }
        if (data && data.isPatterBox == true && data.value == "") {
          this.alertMsg("No pattern is specified for " + data.metadata + ", please specify a valid pattern.", "Error");
          return;
        }

        if (data.isPatterBox == true) {
          this.taggList[i].value = data.value;
          this.taggList[i].mode = 4;
        }

      }
    }
    let graphNameObj = this.getGroupNameObject(this.groupName);
    let payLoad = this.makePayloadForGettingHierarchy(this.taggList, 0, graphNameObj.glbMgId);
    this.getTestWindowData(payLoad);
  }

  closeDerivedWindow() {
    this.visible = false
  }

  public applyChanges() {
    this.tagListFromIndices = null;
    let selectedIndicesLabel = null;
    if (this.selectedValue == "val2") {
      selectedIndicesLabel = "Specified";
    }
    else {
      selectedIndicesLabel = "Advance";
    }
    if (this.selectedValue == "val2") {
      if (this.selectedIndices.length == 0) {
        this.alertMsg("Please select any row", "Error");
        return;
      }

      if (this.derivedMetric) {
        this.derivedMetric.getDataFromIndices(this.finalArr, [], this.selectedIndices);
      }
      if (this.patternMatch && this.patternMatch.flagPattern) {
        this.patternMatch.setFinalArrayOfSelectedIndices(this.finalArr);
        this.patternMatch.setTotalHierarchyList(this.totalHierarchyList);
        this.patternMatch.setSelectedTestIndices(selectedIndicesLabel);
      }

      if (this.alertConfigurationComponent) {
        this.alertConfigurationComponent.getDataFromIndices(this.finalArr, []);
      }
      if (this.relatedmetricsComponent) {
        this.relatedmetricsComponent.getDataFromIndices(this.finalArr, []);
      }
      if (this.addReportSettingsComponent) {
        this.addReportSettingsComponent.getDataFromIndices(this.finalArr, []);
      }
      this.selectedIndices = [];
      super.hide();
    } else {
      this.expressionForAdvancedSelection = "";


      for (let i = 0; i < this.totalData.length; i++) {
        let isPatternValue = this.totalData[i].value;
        let data = this.totalData[i];
        if (data && data.isPatterBox == false && data.value == "") {
          this.alertMsg("No " + data.metadata + " is selected, please select a valid " + data.metadata, "Error");
          return;
        }
        else if (data && data.isPatterBox == true && data.value == "") {
          this.alertMsg("No pattern is specified for " + data.metadata + ", please specify a valid pattern.", "Error");
          return;
        }
        if (isPatternValue == 'ALL')
          this.expressionForAdvancedSelection = this.expressionForAdvancedSelection + '>*';
        else
          this.expressionForAdvancedSelection = this.expressionForAdvancedSelection + '>' + isPatternValue;

        if (data.isPatterBox == true) {
          this.taggList[i].value = data.value;
          this.taggList[i].mode = 4;
        }
      }

      let graphNameObj = this.getGroupNameObject(this.groupName);
      let payLoad = this.makePayloadForGettingHierarchy(this.taggList, 0, graphNameObj.glbMgId);
      this.getTestWindowDataCheckOnApply(payLoad,selectedIndicesLabel);

    }

  }

  /* For checking error if user type invalid pattern in specifed indices window*/
  getTestWindowDataCheckOnApply(payload ,selectedIndices){
    const me = this;
    this.derivedService.loadHierarcialData(payload).subscribe(
      (state: Store.State) => {
        if (state instanceof hierarchialDataCreatingState) {
          me.onLoading(state);
          return;
        }

        if (state instanceof hierarchialDataCreatedState) {
          me.onLoadedTestDataCheckOnApply(state,selectedIndices);
          return;
        }
      },
      (state: hierarchialDataCreatingErrorState) => {
        me.onLoadingError(state);
      }
    );
  }

  onLoadedTestDataCheckOnApply(state ,selectedIndices){
    const me = this;
    me.error = null;
    me.loading = false;
    me.isBlockUI = false;
    this.makeDataForTestCheckOnApply(state.data, selectedIndices);
  };

  alertMsg(msg, header) {
    this.dialogVisible = true;
    this.confirmation.confirm({
      key: 'derivedMetricsIndices',
      message: msg,
      header: header,
      accept: () => { this.dialogVisible = false; },
      reject: () => { this.dialogVisible = false; },
      rejectVisible: false
    });

    this.ref.detectChanges();
  }
  changeInput() {
    if (this.dt22 == "") {
      console.log("in");
      setTimeout(() => {
        this.table.reset();
      }, 1000);

    }
    else {
      console.log("in filter");
      this.table.filterGlobal(this.dt22, "contains");
    }
    this.ref.detectChanges();
  }
}
