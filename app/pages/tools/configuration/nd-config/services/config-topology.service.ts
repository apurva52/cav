import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ConfigRestApiService } from './config-rest-api.service';
import { TopologyInfo, TierGroupInfo, TierInfo, ServerInfo, InstanceInfo, AutoInstrSettings, AutoIntrDTO, DDAIInfo, AutoInstrSummaryData } from '../interfaces/topology-info';
import { TreeNode } from 'primeng/api';

import * as URL from '../constants/config-url-constant';
import { ConfigUtilityService } from './config-utility.service';
import { onErrorResumeNext } from 'rxjs';

@Injectable()
export class ConfigTopologyService {

  private _topoTreeData: Object;

  private _tableData: Object;


  public get tableData(): Object {
    return this._tableData;
  }

  public set tableData(value: Object) {
    this._tableData = value;
  }

  public get topoTreeData(): Object {
    return this._topoTreeData;
  }

  public set topoTreeData(value: Object) {
    this._topoTreeData = value;
  }



  constructor(private _restApi: ConfigRestApiService, private configUtilityService: ConfigUtilityService) { }

  getTopologyList(): Observable<TopologyInfo[]> {
    return this._restApi.getDataByGetReq(URL.FETCH_ALL_TOPODATA);
  }

  /** fetch topology table data*/
  getTopologyDetail(dcId: number): Observable<TopologyInfo[]> {
    return this._restApi.getDataByGetReq(`${URL.FETCH_TOPO_TABLE_URL}/${dcId}`);
  }

  getTierGroupDetail(topoId: number, entity: TopologyInfo): Observable<TopologyInfo[]> {
    return this._restApi.getDataByPostReq(`${URL.FETCH_TIER_GROUP_TABLE_URL}/${topoId}`, entity);
  }

  getTierDetail(tierGroupName: string, entity: TierGroupInfo, topologyName): Observable<TierInfo[]> {
    return this._restApi.getDataByPostReq(`${URL.FETCH_TIER_TABLE_URL}/${tierGroupName}/${topologyName}`, entity);
  }

  getServerDetail(tierId: number, entity: TierInfo, topologyName): Observable<ServerInfo[]> {
    return this._restApi.getDataByPostReq(`${URL.FETCH_SERVER_TABLE_URL}/${tierId}/${topologyName}`, entity);
  }

  getInstanceDetail(serverId: number, entity: ServerInfo,topologyName): Observable<InstanceInfo[]> {
    return this._restApi.getDataByPostReq(`${URL.FETCH_INSTANCE_TABLE_URL}/${serverId}/${topologyName}`, entity);
  }

  getTopologyTreeDetail(dcId: number): Observable<TreeNode[]> {
    return this._restApi.getDataByGetReq(`${URL.FETCH_TOPO_TREE_URL}/${dcId}`);
  }

  getTierTreeDetail(tierId: number, profileId: number): Observable<TreeNode[]> {
    return this._restApi.getDataByGetReq(`${URL.FETCH_TIER_TREE_URL}/${tierId}/${profileId}`);
  }

  getTierGroupTreeDetail(tierGroupName: string, tierGroupId): Observable<TreeNode[]> {
    return this._restApi.getDataByGetReq(`${URL.FETCH_TIER_GROUP_TREE_URL}/${tierGroupName}/${tierGroupId}`);
  }

  getServerTreeDetail(serverId: number, profileId: number): Observable<TreeNode[]> {
    return this._restApi.getDataByGetReq(`${URL.FETCH_SERVER_TREE_URL}/${serverId}/${profileId}`);
  }


  getTierTableData(tierId: number, profileId: number) {
    this._restApi.getDataByGetReq(`${URL.FETCH_TIER_TABLE_URL}/${tierId}/{profileId}`).subscribe(data => this._tableData = data)
  }

  /* Changing Profile To Topology */
  updateAttachedProfTopo(data, override, trSwitch, trNo): Observable<Object> {
    if(data.dcTopoId == 0)
        return this._restApi.getDataByGetReq(`${URL.ATTACH_PROFTO_TOPO_BY_TOPOID}/${data.topoId}/${data.profileId}/${override}`);
    else
        return this._restApi.getDataByGetReq(`${URL.ATTACH_PROFTO_TOPO}/${data.dcTopoId}/${data.profileId}/${override}/${trSwitch}/${trNo}`);
  }

  /* Changing Profile to TierGroup */
  updateAttachedProfTierGroup(data,topologyName, override, trSwitch, trNo) {
    return this._restApi.getDataByGetReq(`${URL.ATTACH_PROFTO_TIER_GROUP}/${data.tierGroupName}/${data.profileId}/${topologyName}/${override}/${trSwitch}/${trNo}`);
  }

  /* Changing Profile to Tier */
  updateAttachedProfTier(data,topologyName, override, trSwitch, trNo) {
    return this._restApi.getDataByGetReq(`${URL.ATTACH_PROFTO_TIER}/${data.tierId}/${data.profileId}/${topologyName}/${override}/${trSwitch}/${trNo}`);
  }

  /* Changing Profile to Server */
  updateAttachedProfServer(data,topologyName, override, trSwitch, trNo) {
    return this._restApi.getDataByGetReq(`${URL.ATTACH_PROFTO_SERVER}/${data.serverId}/${data.profileId}/${topologyName}/${override}/${trSwitch}/${trNo}`);
  }

  /* Changing Profile to Instance */
  updateAttachedProfInstance(data,topologyName, trSwitch, trNo) {
    return this._restApi.getDataByGetReq(`${URL.ATTACH_PROFTO_INSTANCE}/${data.instanceId}/${data.profileId}/${topologyName}/${trSwitch}/${trNo}`);
  }

  /**For disable Profile at instance level */
  disableProfInstance(instanceId, flag, profileID) {
    return this._restApi.getDataByPutReq(`${URL.TOGGLED_INSTANCE_STATE}/${instanceId}/${flag}/${profileID}`);
  }

  getTopologyStructure(topoId) {
    return this._restApi.getDataByGetReq(`${URL.TOPOLOGY_TREE_STRUCTURE}/${topoId}`);
  }

  getTopologyStructureTableData(topoId) {
    return this._restApi.getDataByGetReq(`${URL.TOPOLOGY_STRUCT_TABLEDATA}/${topoId}`);
  }

  getLazyFiles() {
    let data = {
      "data":
      [
        { "label": "Expenses.doc", "icon": "fa-file-word-o", "data": "Expenses Document" }, { "label": "Resume.doc", "icon": "fa-file-word-o", "data": "Resume Document" }
      ]
    };
    return data.data;
  }

  /**To apply auto-instrumentation  */
  applyAutoInstr(data): Observable<AutoIntrDTO> {
    return this._restApi.getDataByPostReq(`${URL.APPLY_AUTO_INSTR}`, data);
  }

  /**To apply DDAI */
  applyDDAI(data, instanceId): Observable<string> {
    return this._restApi.getDataByPostReqWithNoJSON(`${URL.START_DD_AI}/${instanceId}`, data);
  }

  /**To apply auto-instrumentation  */
  stopAutoInstr(instanceName): Observable<AutoIntrDTO[]> {
    let arr = [];
    arr.push(instanceName);
    return this._restApi.getDataByPostReq(`${URL.STOP_AUTO_INSTR}`, arr);
  }

  /**To get auto-instrumentation settings data to display in dialog */
  getAutoInstr(appName, instanceName, sessionName) {
    let arr = [];
    let instanceAndSession = instanceName + "#" + sessionName;
    arr.push(instanceAndSession);
    return this._restApi.getDataByPostReqWithNoJSON(`${URL.GET_AUTO_INSTR_DATA}/${appName}`, arr);
  }

  getServerDisplayName(instanceId: number, topoId: number): Observable<string> {
    return this._restApi.getDataByPostReqWithNoJSON(`${URL.GET_SERVER_DIS_NAME}/${instanceId}/${topoId}`);
  }

  getInstanceDesc(instanceId: number, topoId: number): Observable<string> {
    return this._restApi.getDataByPostReqWithNoJSON(`${URL.GET_INST_DESC}/${instanceId}/${topoId}`);
  }


  //Send RTC on AI(running mode)
  sendRTCAutoInstr(url, data, autoInstrDto, callback) {
    let success = ""
    let arr = [];
    arr.push(data)
    this._restApi.getDataByPostReq(url, arr).subscribe(data => {

      //When result=OK
      if (data[0].includes("result=OK") || data[0].includes("result=Ok")) {

        //Request to save in database if NDC sends OK
        this.applyAutoInstr(autoInstrDto).subscribe(data => {
          this.configUtilityService.infoMessage("Auto Instrumentation started");
          success = "success";
          callback(success)
        })
      }

      //When result=Error, then no RTC applied
      else {
        //Getting error if any and showing as toaster message
        let err = data[0].substring(data[0].lastIndexOf("=Error") + 7, data[0].length)
        if (data[1])
          this.configUtilityService.errorMessage("Could not start: " + data[1]);
        else
          this.configUtilityService.errorMessage("Could not start: " + err);

        success = "fail";
        callback(success)
      }
    });
  }

  //Send RTC on AI(Stop mode)
  sendRTCTostopAutoInstr(url, data, instanceName, sessionName, callback) {
    let arr = [];
    arr.push(data);
    this._restApi.getDataByPostReq(url, arr).subscribe(data => {

      //When result=OK
      if (data[0].includes("result=OK") || data[0].includes("result=Ok")) {

        //Merging instane name and session name with &
        let ISName = instanceName + "&" + sessionName
        //Request to change the status of instance from "In progress to complete" if NDC sends OK
        this.stopAutoInstr(ISName).subscribe(data => {
          this.configUtilityService.infoMessage("Auto Instrumentation terminated");
          callback(data)
        })
      }

      //When result=Error, then no RTC applied
      else {
        //Getting error if any and showing as toaster message
        let err = data[0].substring(data[0].lastIndexOf("result=Error;") + 1)
        this.configUtilityService.errorMessage("Could not stop: " + err);
        callback(data);
      }
    });
  }

  //Get Auto Instrumentation Data to show  in table
  getAIData(): Observable<AutoIntrDTO[]> {
    return this._restApi.getDataByGetReq(`${URL.GET_AUTO_INSTR_TABLE_DATA}`);
  }

  //Update AI details when duration is completed
  updateAIDetails(): Observable<AutoIntrDTO[]> {
    return this._restApi.getDataByGetReq(`${URL.UPDATE_AI_DETAILS}`);
  }


  //Get Auto Instrumentation Data to show  in table
  getSessionFileExistOrNot(sessionFileName) {
    let arr = [];
    arr.push(sessionFileName);
    return this._restApi.getDataByPostReqWithNoJSON(`${URL.FILE_EXIST_OR_NOT}`, arr);
  }

  //Get status of the selected AI
  getAIStatus(instance,type) {
    let arr = [];
    arr.push(instance);
    return this._restApi.getDataByPostReqWithNoJSON(`${URL.GET_AI_STATUS}/${type}`, arr);
  }

  //Download File after AI
  downloadFile(data) {
    let arr = [];
    arr.push(data);
    return this._restApi.getDataByPostReqWithNoJSON(`${URL.DOWNLOAD_FILE}`, arr);
  }
  //Update AI enable in Instance table
  updateAIEnable(instanceId, strFlag, type, topoName) {
    return this._restApi.getDataByPostReqWithNoJSON(`${URL.UPDATE_AI_ENABLE}/${type}/${instanceId}/${topoName}/${strFlag}`);
  }

  //Update AI enable in Instance table and AI status from In progress to complete when duration for AI is completed
  durationCompletion() {
    return this._restApi.getDataByGetReqWithNoJson(`${URL.DURATION_OVER_UPDATION}`);
  }

  deleteTopology(ids: number[]): Observable<TopologyInfo[]> {
    return this._restApi.getDataByPostReq(`${URL.DELETE_TOPOLOGY}`, ids);
  }

  checkChildProfile(id, currentEntity, groupName, topologyName): Observable<string[]>{
    return this._restApi.getDataByGetReq(`${URL.CHECK_CHILD_PROFILE}/${currentEntity}/${id}/${groupName}/${topologyName}`)
  }

  deleteAI(data,instanceId): Observable<boolean> {
    let arr = [];
    arr.push(data);
    return this._restApi.getDataByPostReqWithNoJSON(`${URL.DELETE_AI}/${instanceId}`, arr);
  }

  getTopologyDCID(testRunNo){
    let arr = [];
    arr.push(testRunNo);
    return this._restApi.getDataByPostReqWithNoJSON(`${URL.GET_TOPOLOGY_DC_ID}`, arr);
  }

  getAutoInstrumentationData(data) {
    let arr = [];
    arr.push(data);
    return this._restApi.getDataByPostReq(`${URL.GET_AUTO_INSTR_DATA_SUMMARY}`, arr);
  }
downloadReports(data){
    return this._restApi.getDataByPostReqWithNoJSON(`${URL.DOWNLOAD_REPORTS}`, data)
}
}



