import { Injectable } from '@angular/core';
import { MenuItem, MessageService, TreeNode } from 'primeng';
import { Observable, Subject } from 'rxjs';
import { Store } from 'src/app/core/store/store';
import { SessionService } from 'src/app/core/session/session.service';
import { environment } from 'src/environments/environment';
import { DBMonitoringLoadedState, DBMonitoringLoadingErrorState, DBMonitoringLoadingState, DBMonitoringLoadingErrorStatus, DBMonitoringLoadedStatus, DBMonitoringLoadingStatus } from 'src/app/pages/db-monitoring/db-monitoring.state';
import { Config, DBMonCommonParam, DBMonReq, MonitorConfigJson } from '../services/request-payload.model';
import { Table, TableHeaderColumn } from '../../../shared/table/table.model';
import { DBMonTableHeader, DBMonTableHeaderCols } from './dbmon-table.model';
import { GlobalTimebarTimeLoadedState } from 'src/app/shared/time-bar/service/time-bar.state';
import { TimebarService } from 'src/app/shared/time-bar/service/time-bar.service';
import { GraphDataCTXSubject, MFrequencyTsDetails, TsdbCTXDuration } from 'src/app/shared/dashboard/service/dashboard.model';
@Injectable({
    providedIn: 'root'
})
export class DBMonitoringService extends Store.AbstractService {
    freq: number = 0;
    completeTreeData: TreeNode[] = [];
    parentfreq: number = 0;
    permission: boolean = true;
    userArray: any = [];
    private _dbMonitorUIJson = [];
    tabularData: Table = null;
    tableHeaders: TableHeaderColumn;
    isRewind = true;
    selectedPreset = 'LIVE3';
    isPresetChanged = false;
    selectedViewBy: any;
    isRefresh: Boolean;
    public dataSource: string = '';
    public sqlDbServerList: MonitorConfigJson;
    public options: MenuItem[];
    public orderList: MenuItem[];
    public dbmsList: any = [];
    selectedValue: string = 'preset';
     duration = {} as TsdbCTXDuration;
     loadingToBlockUI: boolean;
    isRequestFromDrillDown = false;
    isAnalysisMode = false;
    avgCount = 0;
    avgCounter = 0;
    DbServerList: {};
    isAggregate:boolean = true;
    isRealTimeAppled:boolean = false;
    databaseType = 0;
    dbType = 'MSSQL';
    isSelectedDB:any;
    public globalId = 0;
    public subject: GraphDataCTXSubject;
    isShowAnalysisToggle:boolean = false;
  isShowAggregateToggle:boolean = true;
  public isSystemSessions:boolean=false;
  titleForEnableAggregationToggle = 'Click to Disable Aggregate Mode';
  titleForDisableAggregationToggle = 'Click to Enable Aggregate Mode';
  titleForDisableRealTimeToggle = 'Click to Enable Realtime Mode';
  titleForEnableRealTimeToggle = 'Click to Disable Realtime Mode';
  isShowRealtimeToggle:boolean = false;
  titleForAnalysisToggle:any;
  selectedRTProgressInterval:string = '30';

     /**Observable used to send response from one component to another*/
  public sendBroadcaster = new Subject<any>();

  /*Service Observable for getting Tier name*/
 receiveProvider$ = this.sendBroadcaster.asObservable();
 public dbListAvailable = new Subject<boolean>();
	dbListAvailableObservable$ = this.dbListAvailable.asObservable();

    public scheduleDataRequest = new Subject<boolean>();
	scheduleDataRequestObservable$ = this.scheduleDataRequest.asObservable();

    constructor(private sessionService: SessionService,
        private timebarService: TimebarService,
        public messageService: MessageService) {
        super();
    }
    public get $dbMonitorUIJson(): any {
        return this._dbMonitorUIJson;
    }
    public set $dbMonitorUIJson(value: any) {
        this._dbMonitorUIJson = value;
    }
    public getSqlDbServerList(): MonitorConfigJson {
        this.logger.debug("value of getSqlDbServerList", this.sqlDbServerList);
        return this.sqlDbServerList;
    }
    public setSqlDbServerList(value: MonitorConfigJson) {
        this.sqlDbServerList = value;
        // this.dataAvail.next(value);
    }

    public set $DataBaseType(val) {
		this.databaseType = val;
		if(val == 0){
			this.dbType = 'MSSQL';
		}else if(val == 1){
			this.dbType = 'POSTGRES';
		}else if(val == 2){
			this.dbType = 'MYSQL';
		}
		else if(val == 3){
			this.dbType = 'ORACLE';
		}
		else if(val == 4){
	    this.dbType = 'MONGODB';
        }
	}
    /**get a database type */
	public get $DataBaseType() {
		return this.databaseType;
	}
    /* */
    loadUI(): Observable<Store.State> {
        const me = this;
        const payload = {} as DBMonReq;
        const output = new Subject<Store.State>();
        setTimeout(() => {
            output.next(new DBMonitoringLoadingState());
        }, 0);
        const session = me.sessionService.session;
        if (session) {
            payload.cctx = session.cctx;
            payload.tr = session.testRun.id;

            const path = environment.api.dbMonitoring.loadUI.endpoint;
            me.controller.post(path, payload).subscribe(
                (result: any) => {
                    if (result != undefined) {
                        this.$dbMonitorUIJson = result;
                        this.sendBroadcaster.next();
                        me.logger.debug('Data recieved successfully for loadUI from server.', result);

                        me.logger.error('DB Monitoring loading failed', result);
                        return;
                    }
                },
                (e: any) => {
                    output.error(new DBMonitoringLoadingErrorStatus(e));
                    output.complete();

                    me.logger.error('DB Monitoring is not loaded successfully', e);
                }
            );
            return output;
        }
    }

    loadTableHeaders(menuName: string, subMenuName: string) {
        try {
            const me = this;
            let tableData = new Array();
            let arrColumns = new Array();

            let menuItems: any;
            let subMenuItems: any;
            let menuList = this.$dbMonitorUIJson[sessionStorage.getItem('dbMonDbmsType')]['menus'];
            if (menuList == undefined || menuList.length <= 0) {
                console.log('no menulist found for selected dbType ');
                return;
            }

            for (let j = 0; j < menuList.length; j++) {
                if (menuList[j]['mappingName'] == menuName) {
                    menuItems = menuList[j];
                    break;
                }
            }
            if (menuItems == undefined) {
                this.logger.error('menuItems not found for ' + menuName);
                return;
            }
            let subMenuList = menuItems['subMenus'];
            if (subMenuList == undefined || subMenuList.length <= 0) {
                me.logger.error('no subMenuList found for selected menu items ');
                return;
            }

            for (let k = 0; k < subMenuList.length; k++) {
                if (subMenuList[k]['mappingName'] == subMenuName) {
                    subMenuItems = subMenuList[k];
                    break;
                }
            }
            if (subMenuItems == undefined) {
                me.logger.error('subMenuItems not found for ' + subMenuName);
                return;
            }

            // this.tabularData.data = [];
            let jsonColumns = subMenuItems.columns;
            jsonColumns = subMenuItems.columns.filter(column=>column['hidden'] == false);
            // let lowerTableColumn: DBMonTableHeader;
            // lowerTableColumn.cols = jsonColumns;
            return jsonColumns;

        }
        catch (e) {
            this.logger.error('Error while generating table columns for updateGenericAllTable.', e);
        }
    }

    /* method to getSubMenu  */
    getSubMenuDetail(menuName: String, subMenuName: String) {
        try {
            let menuList = this.$dbMonitorUIJson[sessionStorage.getItem('dbMonDbmsType')]['menus'];
            for (let j = 0; j < menuList.length; j++) {
                if (menuList[j]['mappingName'] == menuName) {
                    for (let a = 0; a < menuList[j]['subMenus'].length; a++) {
                        if (menuList[j]['subMenus'][a]['mappingName'] == subMenuName) {
                            return menuList[j]['subMenus'][a];
                        }
                    }
                }
            }
        } catch (e) {
            console.error('Error while getSubMenuList', e);
        }
    }
    /*method to get menus list */
    getMenus() {
        try {
            let menuList = this.$dbMonitorUIJson[sessionStorage.getItem('dbMonDbmsType')]['menus'];
            menuList = menuList.filter(menu=>menu['enabled'] == true);
            let isAdmin = this.isAdmin();
            // if(this.sessionService.session.permissions.)
            for (var i = 0; i < menuList.length && !isAdmin; i++) {
                if (menuList[i].mappingName == 'CONFIG') {
                    menuList.splice(i, 1);
                break;
                }
            }
            return menuList;
        } catch (e) {
            console.error('Error while getSubMenuList', e);
        }
    }
/*method to get submenus list */
    getSubMenus(menuName: String) {
        try {
            let menuList = this.$dbMonitorUIJson[sessionStorage.getItem('dbMonDbmsType')]['menus'];
            menuList = menuList.filter(menu=>menu['enabled'] == true);
            for (let j = 0; j < menuList.length; j++) {
                if (menuList[j]['mappingName'] == menuName) {
                    let subMenuList = menuList[j]['subMenus'];

                            return subMenuList.filter(subMenu=>subMenu['enabled'] == true);
                    }
            }
        } catch (e) {
            this.logger.error('Error while getSubMenuList', e);
        }
    }

    /*method to updatetable colukn from json */
    getTableColumnFromJson(tabularData: Table, cols: DBMonTableHeaderCols[], menusName, subMenusName) {
        const me = this;
        if ((tabularData != undefined) && (cols == undefined || cols.length <= 0)) {
            let tableHeaders = this.loadTableHeaders(menusName, subMenusName);
            if (tableHeaders != undefined && tableHeaders.cols.length >= 0) {
                cols = tableHeaders.cols;
            }
        }
    }

    /**get a server list */
    getDbServerList() {
        const me = this;
        const payload = {} as DBMonReq;
        const session = me.sessionService.session;
        if (session) {
            payload.cctx = me.sessionService.session.cctx;
            payload.tr = me.sessionService.testRun.id;
        }
        const path = environment.api.dbMonitoring.loadDBSourceList.endpoint;
        const output = new Subject<Store.State>();
        me.controller.post(path, payload).subscribe(
            (result: MonitorConfigJson) => {
                if (result != undefined) {
                    // me.sqlDbServerList = {};

                    me.setSqlDbServerList(result);
                    if(window.location.href.includes('db-monitoring')){
                    let msg = {
                        severity: 'info',
                        summary: 'DB Source list refreshed sucessfully.',
                      };
                      me.messageService.add(msg);
                    }
                    let _sqlUserDefaultDS = localStorage.getItem(localStorage.getItem('userName') + '@sql');
                    if (_sqlUserDefaultDS) {
                        // me.dataSource = _sqlUserDefaultDS;
                        let dbServerConfig = me.sqlDbServerList.dbSourceList.filter(
                            (value: Config) => value.dataSource == _sqlUserDefaultDS
                        );
                        if (dbServerConfig && dbServerConfig.length > 0) {
                            me.setDefaultGlobalVariables(dbServerConfig[0]);
                        } else {
                            me.setDefaultGlobalVariables(me.sqlDbServerList.dbSourceList[0]);
                        }
                    } else if(me.isRequestFromDrillDown && me.dataSource != ''){
                        let dbServerConfig = me.sqlDbServerList.dbSourceList.filter(
                            (value: Config) => value.dataSource == me.dataSource
                        );
                        if (dbServerConfig && dbServerConfig.length > 0) {
                            me.setDefaultGlobalVariables(dbServerConfig[0]);
                        } else {
                            me.setDefaultGlobalVariables(me.sqlDbServerList.dbSourceList[0]);
                        }
                    } else {
                        if (result != undefined && result['ErrorCode'] == undefined) {
                            //  get key from list of value 
                            //    let dbMonDbmsType = Object.keys(result)[0];
                            if(me.isSelectedDB){
                                result = me.isSelectedDB;
                            }
                            else{
                                me.setDefaultGlobalVariables(me.sqlDbServerList.dbSourceList[0]);
                            }
                        } else {
                            me.dbListAvailable.next(false);
                            me.logger.error('DbSource list loading failed', result);
                            return;
                        }
                    }
                    
                    me.logger.debug('DbSource list loading sucessful', result);
                    me.dbListAvailable.next(true);
                    return output;
                }
                (e: any) => {
                    output.error(new DBMonitoringLoadingErrorStatus(e));
                    output.complete();
                    
                    me.logger.error('DbSource list not saved successfully', e);
                }
                return output;

            })
    }

    public setDefaultGlobalVariables(dbServerConfig: Config) {
        const me = this;
        if (dbServerConfig && dbServerConfig != null) {
            me.$DataBaseType = Number(dbServerConfig.dbmsId);
            sessionStorage.setItem('dbMonDbmsType', dbServerConfig.dbmsId);
            me.globalId = Number(dbServerConfig.globalId);
            me.dataSource = dbServerConfig.dataSource;
            me.subject = dbServerConfig.subject;
        }
    }

/* used for start & endTime */
    getPresetTime(): Observable<Store.State>{
        const me = this;
        const output = new Subject<Store.State>();
        me.timebarService.loadTime(me.selectedPreset, me.selectedViewBy).subscribe((state: Store.State) => {
        if (state instanceof GlobalTimebarTimeLoadedState) {
            me.duration = {
                st: state.data[1],
                et : state.data[2],
                viewBy : me.selectedViewBy,
                preset : me.selectedPreset
            }
  
          setTimeout(() => {
            output.next(state);
          });
        }
      },
        () => {
          setTimeout(() => {
            output.next();
          });
        });
        return output;
    }

    /* Get graph data array in format required by HighCharts */
    getTimedDataArray(timestampArray: Array<Number>, dataArray: Array<Number>){
        let timedDataArray = [];
        if(timestampArray && dataArray && dataArray.length > 0 && dataArray.length == timestampArray.length)
        for (let index = 0; index < dataArray.length; index++) {
          timedDataArray.push([
              timestampArray[index],
              dataArray[index]
          ]);
        }
        return timedDataArray;
      }

    /*Get highchart graph data array from tsdb data */
    getTimedDataArrayTSDB(dataArray: Array<Number>, tsDetail: MFrequencyTsDetails) {
        let timedDataArray = [];
        if (tsDetail && dataArray && dataArray.length > 0 && dataArray.length == tsDetail.count) {
            let st = tsDetail.st;
            for (let index = 0; index < tsDetail.count; index++) {
                timedDataArray.push([
                    st,
                    dataArray[index]
                ]);
                st += (tsDetail.frequency * 1000);
            }
        }
        return timedDataArray;
    }

    /*used to show Icon of top bar */
    populateToggleIcons(subMenu: any) {
        const me = this;
        try {
            if (subMenu['isShowAnalysisToggle'] != undefined)
                me.isShowAnalysisToggle = subMenu['isShowAnalysisToggle'];
            if (subMenu['isShowAggregateToggle'] != undefined)
                me.isShowAggregateToggle = subMenu['isShowAggregateToggle'];
            if (subMenu['titleForEnableAggregationToggle'] != undefined)
                me.titleForEnableAggregationToggle = subMenu['titleForEnableAggregationToggle'];
            if (subMenu['titleForDisableAggregationToggle'] != undefined)
                me.titleForDisableAggregationToggle = subMenu['titleForDisableAggregationToggle'];
            if (subMenu['isShowRealtimeToggle'] != undefined)
                me.isShowRealtimeToggle = subMenu['isShowRealtimeToggle'];


        } catch (e) {
            me.logger.error('Error while populateToggleIcons  ');
        }
    }

    /* uesd to get class name for status column */
	getClassForStatus(value)
	{
		if (typeof(value) != 'string'){
			return '';
		}
		switch(value.toLowerCase()){
			case 'sleeping':
			case 'idle':
			case 'inactive':
			case 'statistics': 
			case 'init':
			case 'cached': 
				return 'setSleep';
			case 'running': 
			case 'active': 
			case 'sending data': 
			case 'executing': 
			case 'preparing': 
				return 'setrunning';
			case 'blocking': 
			case 'idle in transaction': 
			case 'killed': 
			case 'sniped': 
				return 'setblocking';
			default:  {
				if(value.toLowerCase().includes(' lock'))
					return 'setblocking';
				else
				 	return '';
			}
		}
	}

    public isAdmin(): boolean {
        const me = this;
        if (me.sessionService.session) {
            const permissions = me.sessionService.session.permissions;
            for (let i = 0; i < permissions.length; i++) {
                if (permissions[i].key === 'WebDashboard') {
                    const featurePermissions = permissions[i].permissions;
                    for (let j = 0; j < featurePermissions.length; j++) {
                        if (featurePermissions[j]['feature'] === 'MS SQL Query' && featurePermissions[j].permission == 7) {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }

    loadDefaultCommonParam(payload: DBMonCommonParam) {
        const me = this;
        // const payload = {} as DBMonCommonParam;
            payload.dataSourceName = me.dataSource;
            payload.dbType = me.dbType;
            payload.duration = me.duration;
            payload.globalId = me.globalId;
            payload.isAggregrate = me.isAggregate;
            payload.isFirstCall = false;
            payload.isPresetChanged = true;
            payload.isRealTime = me.isRealTimeAppled;
            if(!me.isRealTimeAppled){
                payload.selectedRTProgressInterval = Number(me.selectedRTProgressInterval)* 1000;
            }
            payload.drillDownTime = ''
            if(me.sessionService.isMultiDC){
            payload.subject = me.subject;
            }
            return payload;

        }
}
