import { Injectable } from '@angular/core';
import { ExecDashboardPanelData } from '../interfaces/exec-dashboard-panel-data';

@Injectable()
export class ExecDashboardDataContainerService {

  private execDashbaordFavoriteData;
  private panelDataArr: ExecDashboardPanelData[] = [];
  private execDashboardLayoutData;
  private graphicalKPIDcInfo;
  private orderRevenuePanel: number[];
  private plannedPanel: number;
  private plannedOrderPanel: number;
  private dialChartArr: any = [];
  static criticalVisible: boolean=true;
  static majorVisible: boolean=true;
  static normalVisible: boolean=true;
  static inactiveVisible: boolean=false;
  timeZoneStr: any;
  appliedTimePeriod: string = `Last 1 Hour`;
  private orderRevDCs: string;
  appWindowData: Object = {};
  storeData: Object = {}; //new field to be comited
  storeAlertType: number = 0;
  storeAppliedTimePeriod: string = 'Last 1 Hour';
  tableArr: any[] = [];
  selectedGeoApp: any = 'All';
  updateGeoMap: boolean = true;
  selectedGeoMapFilter: any = '';
  geoFilterText: any
  frontEndTierArr: any[] = [];

  //For Multi DCs
  MultiDCsArr: any[] = [];
  isAllDCs: boolean = false;
  multiDCMode: boolean = false;
  DCsInfo;
  saveAppURL = "";
  selectStoreData;
  storeTransactionTableData;
  goodBadStore:any;
  selectedApp:any = {};
  enableDB: boolean = JSON.parse(sessionStorage.getItem('enableDB')) ? JSON.parse(sessionStorage.getItem('enableDB')): false;
  constructor() { }

  /**Setting Exec-Dashboard configuration data. */
  public getExecDashboardFavoriteData(): any {
    return this.execDashbaordFavoriteData;
  }

  /**Getting Exec-Dashboard configuration data. */
  public setExecDashboardFavoriteData(value: any) {
    this.execDashbaordFavoriteData = value;
  }

  /**Setting Exec-Dashboard configuration data. */
  public getExecDashbaordLayoutData(): any {
    return this.execDashboardLayoutData;
  }

  /**Getting Exec-Dashboard configuration data. */
  public setExecDashboardLayoutData(value: any) {
    this.execDashboardLayoutData = value;
  }

  /** setting panelDataArr */
  public setPanelDataArr(value: any): any {
    this.panelDataArr = value;
  }
  /**Getting Exec-Dashboard configuration data. */
  public getPanelDataArr() {
    return this.panelDataArr;
  }
  /**
  * Setter and getter for orderRevenue panel value
  */
  public getGraphicalKPIDcInfo(): any {
    return this.graphicalKPIDcInfo;
  }
  public setGraphicalKPIDcInfo(value: any) {
    this.graphicalKPIDcInfo = value;
  }

  /**
  * Setter and getter for orderRevenue panel value
  */
  public getOrderRevPanel(): number[] {
    return this.orderRevenuePanel;
  }
  public setOrderRevPanel(value: number[]) {
    this.orderRevenuePanel = value;
  }

  /**
   * setter and getter for Planned panel value
   */
  public getPlannedPanel(): number {
    return this.plannedPanel;
  }
  public setPlannedPanel(value: number) {
    this.plannedPanel = value;
  }
/**
   * setter and getter for Planned panel value
   */
  public getPlannedOrderPanel(): number {
    return this.plannedOrderPanel;
  }
  public setPlannedOrderPanel(value: number) {
    this.plannedOrderPanel = value;
  }

  private _ordRevMaxRows: number  = 1;
  public set $ordRevMaxRows(value: number) {
    this._ordRevMaxRows = value;
  }
  public get $ordRevMaxRows(): number {
    return this._ordRevMaxRows;
  }

  private _panelGraphData: any[]  = [];
  public set $panelGraphData(data: any[]) {
    this._panelGraphData = data;
  }
  public get $panelGraphData(): any[] {
    return this._panelGraphData;
  }

  /**
   * setter and getter for Dial chart array
   */
  public getdialChartArr(): any {
    return this.dialChartArr;
  }
  public setdialChartArr(value: any, isPush?: boolean) {
    if (isPush) {
      this.dialChartArr.push(value);
    } else {
    this.dialChartArr = value;
    }
  }

  /*
  *timeZone setter getter
  */
  public getTimeZone(): any[] {
    return this.timeZoneStr;
  }
  public setTimeZone(value: any[]) {
    this.timeZoneStr = value;
  }

  // appliedTimePeriod
  public getappliedTimePeriod(): string {
    return this.appliedTimePeriod;
  }
  public setappliedTimePeriod(value: string) {
    this.appliedTimePeriod = value;
  }

  // orderRevDCs
  public getOrderRevDCs(): string {
    return this.orderRevDCs;
  }
  public setOrderRevDCs(value: string) {
    this.orderRevDCs = value;
  }
  /**
   * store info setter and getters
   */
  public get $storeData() {
    return this.storeData;
  }
  public set $storeData(value: any) {
    this.storeData = value;
  }

  public get $appWindowData() {
    return this.appWindowData;
  }
  public set $appWindowData(value: any) {
    this.appWindowData = value;
  }

  public get $storeAlertType() {
    return this.storeAlertType;
  }
  public set $storeAlertType(value: any) {
    this.storeAlertType = value;
  }

  public get $storeAppliedTimePeriod() {
    return this.storeAppliedTimePeriod;
  }
  public set $storeAppliedTimePeriod(value: any) {
    this.storeAppliedTimePeriod = value;
  }
  /*array to hold app table data */
  public set $tableArr(value: any) {
    this.tableArr = value;
  }
  public get $tableArr() {
    return this.tableArr;
  }

  public set $selectedGeoApp(value: any) {
    this.selectedGeoApp = value;
  }
  public get $selectedGeoApp() {
    return this.selectedGeoApp;
  }

  public set $updateGeoMap(value: any) {
    this.updateGeoMap = value;
  }
  public get $updateGeoMap() {
    return this.updateGeoMap;
  }
  // selectedGeoMapFilter
  public set $selectedGeoMapFilter(value: any) {
    this.selectedGeoMapFilter = value;
  }
  public get $selectedGeoMapFilter() {
    return this.selectedGeoMapFilter;
  }
  // geoFilterText
  public set $geoFilterText(value: any) {
    this.geoFilterText = value;
  }
  public get $geoFilterText() {
    return this.geoFilterText;
  }

  public set $frontEndTierArr(value: any) {
    this.frontEndTierArr = value;
  }
  public get $frontEndTierArr() {
    return this.frontEndTierArr;
  }


  //MultiDCsArr 
  public set $MultiDCsArr(value: any) {
    this.MultiDCsArr = value;
    sessionStorage.setItem("MultiDCsArr", value.toString());
  }
  public get $MultiDCsArr() {
    return this.MultiDCsArr;
  }
  // isAllDCsSelected
  public set $isAllDCs(value: any) {
    this.isAllDCs = value;
  }
  public get $isAllDCs() {
    return this.isAllDCs;
  }
  // DCsInfo
  public set $DCsInfo(value: any) {
    this.DCsInfo = value;
  }
  public get $DCsInfo() {
    return this.DCsInfo;
  }
  // multiDCMode
  public set $multiDCMode(value: any) {
    this.multiDCMode = value;
  }
  public get $multiDCMode() {
    return this.multiDCMode;
  }
  // saveAppURL
  public set $saveAppURL(value: any) {
    this.saveAppURL = value;
  }
  public get $saveAppURL() {
    return this.saveAppURL;
  }
  // selectStoreData
  public set $selectStoreData(value: any) {
    this.selectStoreData = value;
  }
  public get $selectStoreData() {
    return this.selectStoreData;
  }
  //store transaction table data 
  public set $storeTransactionTableData(value:any) {
    this.storeTransactionTableData = value;
  }
  public get $storeTransactionTableData():any {
    return this.storeTransactionTableData;
  }

  public set $goodBadStore(value:string){
    this.goodBadStore = value;
  }
  public get $goodBadStore(){
    return this.goodBadStore;
  }
  public set $selectedApp(value:{}){
    this.selectedApp = value;
  }
  public get $selectedApp():{} {
    return this.selectedApp;
   }
   public set $enableDB(value:boolean){
     sessionStorage.setItem('enableDB', JSON.stringify(value));
     this.enableDB = value;
   }
   public get $enableDB():boolean {
     return this.enableDB;
   }
} // end of file.
