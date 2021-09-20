import { Injectable } from '@angular/core';
import { TouchSequence } from 'selenium-webdriver';
import * as moment from 'moment';
import 'moment-timezone';

@Injectable()
export class TierStatusCommonDataHandlerService {
  flowMapName: string = 'default';
  nodeToHide: string = '';
  cordinatesData: any = (sessionStorage.getItem('cordinatesDetail') && sessionStorage.getItem('cordinatesDetail').length > 0) ? sessionStorage.getItem('cordinatesDetail') : {};
  changeCordinate: any = {};
  showBTDialog: boolean = false;

  /** Flowmap mode to get level
 * flowmap mode  = 0 Tier level
 * flowmap mode  = 2 Instance level
 */
  // for now keeping 0 as default
  flowMapMode = '0';

  private _reqVecName = '';
  private _returnTheseValues = '';
  private _filterOption1 = 'tps:false:<:';
  private _filterOption2 = 'res:false:<:';
  private _filterOption3 = 'cpu:false:<:';
  private _filterOption4 = false;
  private _valueType = 'average';
  private _dcName = '';
  private _applyFilterToIP = false;
  private _callsUnit = 'seconds';
  private _labelCharacters = 15;

  // all value of setValuesToSession 
  // will be contained in this list.
  hideTier: any[] = [];

  visibleTiers: any[] = [];
  hiddenTiers: any[] = [];

  _flowMapDir: any = '.flowmaps';


  _resolution: any = 'Auto';
  _serverType: any = '0';
  _nonZeroIP: boolean = true;
  _globalRenaming: boolean = true;
  _overrideFlow: any = 'false';
  _flowmapType: any = '0';
  _lastSampleTime: any;
  //To hold isFullPath
  _isFullFlowPath : boolean = false;

  constructor() { }

  public set $flowMapName(value: any) {
    this.flowMapName = value;
  }
  public get $flowMapName() {
    return this.flowMapName;
  }
  public set $nodeToHide(value: any) {
    this.nodeToHide = value;
  }
  public get $nodeToHide() {
    return this.nodeToHide;
  }

  public set $cordinatesData(value: any) {
    this.cordinatesData = value;
    sessionStorage.setItem('cordinatesDetail', value);
  }
  public get $cordinatesData() {
    return this.cordinatesData;
  }

  public set $showBTDialog(value: boolean) {
    this.showBTDialog = value;
  }
  public get $showBTDialog(): boolean {
    return this.showBTDialog;
  }
  // flowMapMode;
  public set $flowMapMode(value: any) {
    this.flowMapMode = value;
  }
  public get $flowMapMode() {
    return this.flowMapMode;
  }
  // _reqVecName
  public set reqVecName(value: any) {
    this._reqVecName = value;
  }
  public get reqVecName() {
    return this._reqVecName;
  }
  // _returnTheseValues
  public set returnTheseValues(value: any) {
    this._returnTheseValues = value;
  }
  public get returnTheseValues() {
    return this._returnTheseValues;
  }
  // _filterOption1
  public set filterOption1(value: any) {
    this._filterOption1 = value;
  }
  public get filterOption1() {
    return this._filterOption1;
  }
  // _filterOption2
  public set filterOption2(value: any) {
    this._filterOption2 = value;
  }
  public get filterOption2() {
    return this._filterOption2;
  }
  // _filterOption3
  public set filterOption3(value: any) {
    this._filterOption3 = value;
  }
  public get filterOption3() {
    return this._filterOption3;
  }
  // _filterOption4  this option is for "apply filter for IPs also"
  public set filterOption4(value: any) {
    this._filterOption4 = value;
  }
  public get filterOption4() {
    return this._filterOption4;
  }
  //_valueType
  public set valueType(value: any) {
    this._valueType = value;
  }
  public get valueType() {
    return this._valueType;
  }
  //_dcName
  public set dcName(value: any) {
    this._dcName = value;
  }
  public get dcName() {
    return this._dcName;
  }
  
  // _callsUnit
  public set callsUnit(value: any) {
    this._callsUnit = value;
  }
  public get callsUnit() {
    return this._callsUnit;
  }
  // _labelCharacters
  public set labelCharacters(value: any) {
    this._labelCharacters = value;
  }
  public get labelCharacters() {
    return this._labelCharacters;
  }

  public set $hideTier(value) {
    this.hideTier = value;
  }

  public get $hideTier() {
    return this.hideTier;
  }

  public get $visibleTiers() {
    return this.visibleTiers;
  }

  public set $visibleTiers(value: any) {
    this.visibleTiers = value;
  }

  public get $hiddenTiers() {
    return this.hiddenTiers;
  }

  public set $hiddenTiers(value: any) {
    this.hiddenTiers = value;
  }

  public get flowMapDir() {
    return this._flowMapDir;
  }

  public set flowMapDir(value: any) {
    this._flowMapDir = value;
  }
  // resolution
  public set resolution(value: any) {
    this._resolution = value;
  }

  public get resolution() {
    return this._resolution;
  }
  // serverType
  public set serverType(value: any) {
    this._serverType = value;
  }

  public get serverType() {
    return this._serverType;
  }

  //nonZeroIP
  public set nonZeroIP(value: any) {
    this._nonZeroIP = value;
  }

  public get nonZeroIP() {
    return this._nonZeroIP;
  }

  //globalRenaming
  public set globalRenaming(value: any) {
    this._globalRenaming = value
  }

  public get globalRenaming() {
    return this._globalRenaming;
  }

  public set overrideFlow(value: any) {
    this._overrideFlow = value
  }

  public get overrideFlow() {
    return this._overrideFlow;
  }
  // _flowmapType
  public set flowmapType(value: any) {
    this._flowmapType = value;
  }

  public get flowmapType() {
    return this._flowmapType;
  }

  public get lastSampleTime() {
    this._lastSampleTime = parseInt(this._lastSampleTime);
    return moment.tz(this._lastSampleTime, sessionStorage.getItem('timeZoneId')).format('MM/DD/YYYY HH:mm:ss');
  }

  public set lastSampleTime(value: any) {
    this._lastSampleTime = value;
  }

  public get $applyFilterToIP(): boolean {
    return this._applyFilterToIP;
  }
  public set $applyFilterToIP(flag: boolean) {
    this._applyFilterToIP = flag;
  }

  /**
   * @param flowMapName = current flowmap name 
   * @param nodeInfo = tier and nodes list
   */
  fillArrayWithCordinates(flowMapName, nodeInfo) {
    console.log('node info-------', nodeInfo);
    console.log('flowmapName-------', flowMapName);
    // console.log(sessionStorage.getItem('cordinatesDetail').toString());

    let mapArr = [];
    let mapObj = {};
    if (nodeInfo && nodeInfo.length > 0)
      for (let indexValue of nodeInfo) {
        let map = {};
        map['name'] = indexValue['actualTierName'];
        map['cordinates'] = indexValue['tooltip']['cordinate'];
        mapArr.push(map);
      }
    mapObj['cordinatesData'] = mapArr;
    this.$cordinatesData = mapObj;
    console.log(this.$cordinatesData);

  }

  /**
   * filterData based on
   * showTierList;
   */
  filterData(callback, data, flowmapName) {
    try {
      console.log('filterData called ' + flowmapName);
      // console.log(this.hideTier);
      if(flowmapName != undefined && flowmapName == 'default'){
        return callback(data);
      }
      let arrTierList = this.$visibleTiers.split(',');
      let newData = { ...data };
      let a = data.callData.filter((e) => {
        if (arrTierList.indexOf(e['groupName']) > -1 || arrTierList.indexOf(e['actualTierName']) > -1) {
          return true;
        }
        else {
          return false;
        }
      })
      newData['callData'] = a;
      let b = data.nodeInfo.filter((e) => {
        if (e['entityType'] == '0') {
          if ((arrTierList.indexOf(e['groupName']) > -1 || arrTierList.indexOf(e['actualTierName']) > -1)) {
            return true;
          }
          else {
            return false;
          }
        }
        else {
          // here need to remove all the ips which are present in hideTiers list
          if(this.hideTier.indexOf(e['actualTierName']) > -1){
            return false;
          }
          else{
            return true;
          }
        }
      });
      newData['nodeInfo'] = b;
      callback(newData);
    } catch (error) {
      console.log('error in filter data ');
      console.log(error);
    }
  }

  /**
   * Filter based on filter options
   * 
   */
  filterDataBasedOnOptions(callback, jsonData, hideIntegrationTiersList?) {
    try {
      if (Object.keys(jsonData).length == 0) {
        callback({});
      }
      let tempData = { ...jsonData };
      let newData = { ...jsonData };
      let tempNodeInfo = tempData['nodeInfo'];
      let filterArray = [this.filterOption1, this.filterOption2, this.filterOption3];
      // Filtering out all tiers which satisfy the given conditions
      let filteredArr = tempNodeInfo;
      filterArray.forEach(element => {
        let elementArr = element.split(':');
        if (elementArr[1] == 'false') {
          return;
        }

        if (elementArr[2] == ">=") {
          if (this.filterOption4) { // if false, filter will be applied to tiers only
            filteredArr = filteredArr.filter(e => e[elementArr[0]] >= elementArr[3]);
          } else {
            filteredArr = filteredArr.filter(e => (e.entityType == "2") || e[elementArr[0]] >= elementArr[3])
          }
        } else {
          if (this.filterOption4) {
            filteredArr = filteredArr.filter(e => e[elementArr[0]] <= elementArr[3] );
          } else {
            filteredArr = filteredArr.filter(e => (e.entityType == "2") || e[elementArr[0]] <= elementArr[3])
          }
        }
      });
        tempNodeInfo = filteredArr;

      /**
       * need to add the code here 
       * get the list of all tier to
       * hide 
       */
      let _t = this.$hiddenTiers;
      // check for hidden integration points
      if (hideIntegrationTiersList != undefined) {
        let keys = Object.keys(hideIntegrationTiersList);
        keys.forEach(e=> {
          if (!e.endsWith("nodeInfo") && !e.endsWith("edgeInfo")) {
            _t = [..._t, ...hideIntegrationTiersList[e]];
          }
        })
      }
      if (_t.length) {
        tempNodeInfo = tempNodeInfo.filter((e) => !_t.includes(e.name));
      }
      newData['nodeInfo'] = tempNodeInfo;
      callback(newData);
    } catch (error) {
      console.log('error in filterDataBasedOnOptions ');
      console.log(error);
    }
  }

  /**
   * if flowmap is not default then service will be called and flowmap info 
   * will be saved in global parameters using this method.
   * @param data 
   */
  updateServiceParameters(data) {
   //Setting value of _isFullFlowPath coming from Server
    this.$_isFullFlowPath = data['isFullFlowPath'] == "true";
    this.filterOption1 = 'pvs:' + data['filterOption1'].replace(/<|<=|>|>=/g, (x)=>{return x + "="});
    this.filterOption2 = 'res:' + data['filterOption2'].replace(/<|<=|>|>=/g, (x)=>{return x + "="});
    this.filterOption3 = 'cpu:' + data['filterOption3'].replace(/<|<=|>|>=/g, (x)=>{return x + "="});
    this.filterOption4 = data['filterOption4'] == "true"; // flag to apply filters to IPs also
    this.flowMapMode = data['flowmapMode'];
    this.valueType = data['valueType'];
    this.globalRenaming = !(data['globalRenaming'] == "false");
    this.nonZeroIP = !(data['nonZeroIP'] == "false");
    this.callsUnit = data['callsUnit'] && data['callsUnit'].toString().trim().length?data['callsUnit']:'seconds';
    this.labelCharacters = data['labelCharacters'] && data['labelCharacters'].toString().trim().length?+data['labelCharacters']:15;
    this.$hiddenTiers = data['setValuesToSession'] && data['setValuesToSession'].toString().trim().length?data['setValuesToSession'].split(","):[];
    this.$visibleTiers = data['showTier'] && data['showTier'].toString().trim().length?data['showTier'].split(","):[];
    this.reqVecName = data['reqVecName'];
    if (this.reqVecName && this.reqVecName.split(">").length == 3) {
      this.$flowMapMode = 2;
    }
    this.returnTheseValues = data['returnTheseValues'];
    // this.dcName = data['dcName'];
  }

  cleanServiceParameters(){
    this.filterOption1 = 'pvs:false:<=:';
    this.filterOption2 = 'res:false:<=:';
    this.filterOption3 = 'cpu:false:<=:';
    this.filterOption4 = false;
    this.flowMapMode = '0';
    this.valueType = 'average';
    this.$_isFullFlowPath = false;
    this.globalRenaming = true;
    this.nonZeroIP = true;
     this.$hiddenTiers = [];
    this.$visibleTiers = [];
    this.callsUnit = 'seconds';
    this.labelCharacters = 15;
    this.reqVecName = '';
  }
  //Getter and Setter for _isFullFlowPath
  public get $_isFullFlowPath(): any {
    return this._isFullFlowPath;
  }
  public set $_isFullFlowPath(value: any) {
    this._isFullFlowPath = value;
  }

}// EOD 
