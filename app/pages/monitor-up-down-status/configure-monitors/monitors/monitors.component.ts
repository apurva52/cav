import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MenuItem, Table } from 'primeng';
import { AppError } from 'src/app/core/error/error.model';
import { MonitorupdownstatusService } from '../../service/monitorupdownstatus.service';
import { APIData } from '../../containers/api-data';
import { MonitorGroupHeaderCols, MonitorsHeaderCols } from './service/monitors.model';
import * as  URL from '../../constants/mon-rest-api-constants';
import { SessionService } from 'src/app/core/session/session.service';

@Component({
  selector: 'app-monitors',
  templateUrl: './monitors.component.html',
  styleUrls: ['./monitors.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MonitorsComponent implements OnInit {

  data: any = [];
  dataGroup: any = [];
  visibleSidebar1:boolean;
  error: AppError;
  loading: boolean;
  empty: boolean;
  emptyTable: boolean;
  totalRecords: number;
  cols: MonitorsHeaderCols[] = [];
  _selectedColumns: MonitorsHeaderCols[] = [];
  colsGroup: MonitorGroupHeaderCols[] = [];
  _selectedColumnsGroup: MonitorGroupHeaderCols[] = [];
  downloadOptions: MenuItem[];
  selectedRow: any;
  isCheckbox: boolean;
  isEnabledColumnFilter: boolean = false;
  filterTitle: string = 'Enable Filters';
  tooltipzindex = 100000;
  globalFilterFields: string[] = [];
  rowGroupMetadata: any;
  apiData: APIData = new APIData();
  @Input() techName: string;
  techDisplayName: string = '';
  reasonData:any = {};
  breadcrumb: MenuItem[] = [];
  statusData:any = [];
  tierName:string;
  severName: string = '';
  totalMonitor: number;
  tierCount:number;
  serverCount:number;
  instCount:number;
  monStatus: string
  navFlag:boolean;
  
  @ViewChild('monitors')
  private table: Table;
  resetTable: boolean = true;
  
  constructor(private router : Router,
    private route: ActivatedRoute, private monUpDownStatus: MonitorupdownstatusService,private sessionService: SessionService) {}

  ngOnInit(): void {
    this.createStatusData()
  }
  createStatusData(){
    const me = this;
    me.resetTable = false;
      setTimeout(() => {
        me.resetTable = true;
      });
    me.navFlag = this.monUpDownStatus.flag
    me.monUpDownStatus.routeFlag = this.monUpDownStatus.flag
    if(this.monUpDownStatus.flag){
    this.route.params.subscribe((params: Params) => {
      this.techName = params['techName'];
      this.tierName = params['tierName'];
      this.severName = params['serverName'];
      this.totalMonitor = params['monCount'];
      this.techDisplayName = params['techDispName'];
      this.tierCount = params['tierCount'];
      this.serverCount = params['serverCount'];
      this.instCount = params['instanceCount'];
      this.monStatus = params['status'];
    });
  }
  else{
    this.tierName = this.monUpDownStatus.statusDetail['tierName']
    this.monStatus = this.monUpDownStatus.statusDetail['status']
    this.tierCount = this.monUpDownStatus.statusDetail['tc'];
    this.serverCount = this.monUpDownStatus.statusDetail['sc'];
    this.instCount = this.monUpDownStatus.statusDetail['ic'];
    this.severName = this.monUpDownStatus.statusDetail['serverName'];
    this.totalMonitor = this.monUpDownStatus.statusDetail['mtc'];
    this.techDisplayName = this.monUpDownStatus.statusDetail['techDispName'];
  }
    if(this.monStatus === "All")
      me.apiData.monStatus = 7;
    else if(this.monStatus === "Running")  
      me.apiData.monStatus = 1;
    else if(this.monStatus === "Failed")  
      me.apiData.monStatus = 2;
    else
      me.apiData.monStatus = 4;

    me.loading = true;
    this.apiData.tName = this.techName;
    if(this.tierName && this.tierName != "All Tiers")
      this.apiData.tier = this.tierName;
    if(this.severName)
      this.apiData.server = this.severName;
    this.apiData.monName = null;
    me.monUpDownStatus.getMonitorStatus(me.apiData).subscribe(data => {
      this.statusData = data;
    },
    error => {
      me.loading = false;
    },
    () => {
      me.loading = false;
    })

    me.createTableData();
    me.loading = true;
    me.monUpDownStatus.getMonitorStatusInfo(me.apiData).subscribe(res => {
      res.map(each=>{
        this.getTimeStampByTimeZone(each);
      })
      this.data['data'] = res;
      let count = 0;
      this.data['data'].map(each=>{
        each['groupData'] = {
          "name": count
        }
        count ++;
      })
    },
    error => {
      me.loading = false;
    },
    () => {
      me.loading = false;
    })
    // if(me.monUpDownStatus.navTierFlag && me.monUpDownStatus.navServerFlag){
    //   me.breadcrumb = [
    //     { label: 'Home',url:'#/configure-monitors' },
    //     //{ label: this.techDisplayName + ', Tier(All)',url:'#/oracle-tier/' + this.techName + "/" + me.apiData.tier + "/" + me.techDisplayName},
    //     { label: this.techDisplayName + ', Tier'+ '(' + me.monUpDownStatus.navTierName + ')',url:'#/oracle-tier/' + this.techName + "/" + me.monUpDownStatus.navTierName + "/" + me.techDisplayName},
    //     //{ label:'Tier' + '(' + me.apiData.tier + ')' + ', Server(All)', url:'#/oracle-tier/' + this.techName + "/" + 'All' + "/" + me.techDisplayName},
    //     { label:'Tier' + '(' + me.apiData.tier + ')' + ', Server(All)', url:'#/oracle-server/' + this.techName + "/" + me.techDisplayName + "/" + me.apiData.tier},
    //     { label:'Server'+ '(' + me.apiData.server + ')' + ', Monitors' + '(' + me.monStatus + ')',url:''},
    //   ]
    // }
    // else if(me.monUpDownStatus.navTierFlag && !me.monUpDownStatus.navServerFlag){
    //   me.breadcrumb = [
    //     { label: 'Home',url:'#/configure-monitors' },
    //     //{ label: this.techDisplayName + ', Tier'+'(' + me.apiData.tier + ')',url:'#/oracle-tier/' + this.techName + "/" + 'All' + "/" + me.techDisplayName},
    //     { label: this.techDisplayName + ', Tier'+'(' + me.monUpDownStatus.navTierName + ')',url:'#/oracle-tier/' + this.techName + "/" + me.monUpDownStatus.navTierName + "/" + me.techDisplayName},
    //     { label:'Tier' + '(' + me.apiData.tier + ')' + ', Monitors' + '(' + me.monStatus + ')', url:'#/oracle-tier/' + this.techName + "/" + me.apiData.tier + "/" + me.techDisplayName},
    //   ]
    // } 
    // else if(!me.monUpDownStatus.navTierFlag && me.monUpDownStatus.navServerFlag){
    //   me.breadcrumb = [
    //     { label: 'Home',url:'#/configure-monitors' },
    //     { label: this.techDisplayName + ', Server(All)',url:'#/oracle-server/' + this.techName + "/" + me.techDisplayName+ "/" + me.apiData.tier },
    //     { label:'Tier'+ '(' + me.tierName + ')' +',Server'+ '(' + me.apiData.server + ')' + ', Monitors' + '(' + me.monStatus + ')',url:'#/oracle-server/' + this.techName + "/" + me.techDisplayName},
    //   ]
    // }
      me.breadcrumb = [
        { label: 'Monitor Home',url:'#/configure-monitors' },
        { label: this.techDisplayName + ' Monitors',url:'' },
      ]
    

    me.downloadOptions = [
      { label: 'WORD'},
      { label: 'PDF'},
      { label: 'EXCEL'}
    ]
    me.updateRowGroupMetaData();
    me.cols = me.data.headers[0].cols;
    for (const c of me.data.headers[0].cols) {
      me.globalFilterFields.push(c.valueField);
      if (c.selected) {
        me._selectedColumns.push(c);
      }
    }
    me.colsGroup = me.dataGroup.headers[0].cols;
    for (const c of me.dataGroup.headers[0].cols) {
      me.globalFilterFields.push(c.valueField);
      if (c.selected) {
        me._selectedColumnsGroup.push(c);
      }
    }
  }

  onSort() {
    this.updateRowGroupMetaData();
  }

  updateRowGroupMetaData() {
    this.rowGroupMetadata = [];
    if (this.data.data) {
      for (let i = 0; i < this.data.data.length; i++) {
        let rowData = this.data.data[i];
        let groupData = rowData.groupData.name;

        if (i == 0) {
          this.rowGroupMetadata[groupData] = { index: 0, size: 1 };
        } else {
          let previousRowData = this.data.data[i - 1];
          let previousRowGroup = previousRowData.groupData.name;         
          if (groupData === previousRowGroup)
            this.rowGroupMetadata[groupData].size++;
          else
            this.rowGroupMetadata[groupData] = { index: i, size: 1 };
        }
      }
    }
  }

    @Input() get selectedColumns(): MonitorsHeaderCols[] {
      const me = this;
      return me._selectedColumns;
    }
    set selectedColumns(val: MonitorsHeaderCols[]) {
      const me = this;
      me._selectedColumns = me.cols.filter((col) => val.includes(col));
    }

    @Input() get selectedColumnsGroup(): MonitorGroupHeaderCols[] {
      const me = this;
      return me._selectedColumnsGroup;
    }
    set selectedColumnsGroup(val: MonitorGroupHeaderCols[]) {
      const me = this;
      me._selectedColumnsGroup = me.cols.filter((col) => val.includes(col));
    }

    toggleFilters() {
      const me = this;
      me.table.reset();
      me.isEnabledColumnFilter = !me.isEnabledColumnFilter;
      if (me.isEnabledColumnFilter === true) {
        me.filterTitle = 'Disable Filters';
      } else {
        me.filterTitle = 'Enable Filters';
      }
    }

    navigateToRoute(item){
      // console.log(item)
    }

    onExpendTableRow(){
      this.monUpDownStatus.getMonitorStatus(this.apiData).subscribe(data => {
        this.dataGroup['data'] = data;
      })
    }

    createTableData(){
      this.data['headers'] = [
        {
          cols: [
            {
              label: 'Monitor(s)',
              valueField: 'monitorGroup',
              classes: 'text-left',
              selected: true,
              filter: {
                isFilter: true,
                type: 'contains',
              },
              isSort: true,
              
            },
            {
              label: 'Tier',
              valueField: 'tier',
              classes: 'text-left',
              selected: true,
              filter: {
                isFilter: true,
                type: 'contains',
              },
              isSort: true,          
            },
    
            {
              label: 'Status',
              valueField: 'status',
              classes: 'text-left',
              selected: true,
              filter: {
                isFilter: true,
                type: 'contains',
              },
              isSort: true,
              iconField: true,
              actionIcon: true
            }
            
          ],
        },
      ]

      this.data['data'] = [];

      this.data['paginator'] = {
        first: 10,
        rows: 10,
        rowsPerPageOptions: [10, 20, 30, 40, 50],
      }

      this.data.tableFilter = true;
      this.data.iconsField = 'icon';

    this.dataGroup['headers'] = [
        {
          cols: [
            {
              label: 'Server',
              valueField: 'server',
              classes: 'text-left',
              selected: true,
              filter: {
                isFilter: true,
                type: 'contains',
              },
              isSort: true,
            },
            {
              label: 'Instance',
              valueField: 'instance',
              classes: 'text-left',
              selected: true,
              filter: {
                isFilter: true,
                type: 'contains',
              },
              isSort: true,          
            },
            {
              label: 'Start Date Time',
              valueField: 'startTime',
              classes: 'text-left',
              selected: true,
              filter: {
                isFilter: true,
                type: 'contains',
              },
              isSort: true,
            },
            {
              label: 'Last Reconnect Time',
              valueField: 'reconnectTime',
              classes: 'text-left',
              selected: true,
              filter: {
                isFilter: true,
                type: 'contains',
              },
              isSort: true,
            },
            {
              label: 'Status',
              valueField: 'status',
              classes: 'text-left',
              selected: true,
              filter: {
                isFilter: true,
                type: 'contains',
              },
              isSort: true,
              iconField: true
            },
            {
              label: 'Reason',
              valueField: 'reason',
              classes: 'text-left',
              selected: true,
              filter: {
                isFilter: true,
                type: 'contains',
              },
              isSort: true,
            }
          ],
        }
    ]

    this.dataGroup['data'] = [];

    this.dataGroup['paginator'] = {
      first: 10,
      rows: 10,
      rowsPerPageOptions: [10, 20, 30, 40, 50],
    }
    this.dataGroup.tableFilter = true;
    this.dataGroup.iconsField = 'icon';
    }

    openSideMenu(data){
      if(data.errCode){
        this.visibleSidebar1 = true;
        this.monUpDownStatus.getErrorSteps(data.errCode).subscribe(res => {
          this.visibleSidebar1 = true;
        let errorStep = res['reason'].split("\\n");
        let erroMsg = []
        errorStep.map(step=>{
          let obj = {
            step
          }
          erroMsg.push(obj);
        })
        this.reasonData = {
    reasonDetails:[
      {
        title:'Monitor Group',
        description: data.monitorGroup
      },
      {
        title:'Tier',
        description: data.tier
      },
      {
        title:'Server',
        description: data.server
      },
      {
        title:'Instance',
        description: data.instance
      },
      {
        title:'Status',
        description: data.status
      },
      {
        title:'Start Date Time',
        description: data.startTime
      },
      {
        title:'Last Reconnect Time',
        description: data.reconnectTime
      },
      {
        title:'Reason',
        description: data.reason
      },
      {
        title:'Error Message',
        description: data.errMsg
      }

    ],
    errorSteps: erroMsg
  }
        
          },
          error => {
              // me.loading = false;
            },
            () => {
                // me.loading = false;
              })
            }
    }

    selectRow(data, expanded){
      if(!expanded){
        this.apiData.monName = data.inMonitorGroup;
        this.apiData.tier = data.tier;
        this.loading = true;
        this.monUpDownStatus.getMonitorStatusInfo(this.apiData).subscribe(res => {
          res.map(each=>{
            this.getTimeStampByTimeZone(each);
          })
          this.dataGroup['data'] = res;
        },
        error => {
          this.loading = false;
        },
        () => {
          this.loading = false;
        })
      }
    }

    public navigateToMonitors(status, id): void {
      let me = this;
      me.resetTable = false;
      setTimeout(() => {
        me.resetTable = true;
      });
      document.getElementById("all").style.borderWidth = "thin";
      document.getElementById("running").style.borderWidth = "thin";
      document.getElementById("failed").style.borderWidth = "thin";
      document.getElementById("disabled").style.borderWidth = "thin";
      document.getElementById(id).style.borderWidth = "initial";
      if(status === "All")
        me.apiData.monStatus = 7;
      else if(status === "Running")  
        me.apiData.monStatus = 1;
      else if(status === "Failed")  
        me.apiData.monStatus = 2;
      else
        me.apiData.monStatus = 4;
      
      me.apiData.monName = null;  
      if(this.tierName === "" || this.tierName == 'All Tiers')
        me.apiData.tier = null;
      else
        me.apiData.tier = this.tierName;
      if(this.severName === "")  
        me.apiData.server = null;
      else
        me.apiData.server = this.severName;  
      
      me.loading = true;
      me.monUpDownStatus.getMonitorStatusInfo(me.apiData).subscribe(res => {
        res.map(each=>{
          this.getTimeStampByTimeZone(each);
        })
        this.data['data'] = res;
        let count = 0;
        this.data['data'].map(each=>{
          each['groupData'] = {
            "name": count
          }
          count ++;
        })
      },
      error => {
        me.loading = false;
      },
      () => {
        me.loading = false;
      })
    }

  openConfUI(data) {
    this.monUpDownStatus.gMonId = data['gMonId'];
    if (this.techName == URL.HEALTH_CHECK) {
      this.router.navigate([URL.HEALTH_CHECK_URL])
    }
    else if (this.techName === URL.SNMP) {
      this.router.navigate([URL.SNMP]);
    }
    else if (this.techName === URL.CLOUD_GCP_Ex) {
      this.router.navigate([URL.GCP])
    }
    else if (this.techName === URL.CLOUD_AWS) {
      this.router.navigate([URL.AWS])
    }
    else if (this.techName === URL.CLOUD_AZURE) {
      this.router.navigate([URL.AZURE])
    }
    else if (this.techName === URL.CLOUD_NEW_RELIC) {
      this.router.navigate([URL.NEW_RELIC])
    }
    else if (this.techName === URL.CLOUD_DYNATRACE) {
      this.router.navigate([URL.DYNATRACE])
    }
    else {
      this.router.navigate([URL.ADD_MONITORS, this.techName, this.techDisplayName]);//Changes for bug 110942 from montor name to techName
    }
  }

    ngOnDestroy(){
      this.monUpDownStatus.navServerFlag = false;
      this.monUpDownStatus.flag = false;
      this.monUpDownStatus.statusDetail = {}
    }

    // Method added to convert millisecond time to selected time zone format for bug 111835
    getTimeStampByTimeZone(data){
      if(data['reconnectTime'] != '0')
        data['reconnectTime'] = this.sessionService.convertTimeToSelectedTimeZone(parseInt(data['reconnectTime']))
      else
        data['reconnectTime'] = "-";

        if(data['startTime'] != '0')  
          data['startTime'] = this.sessionService.convertTimeToSelectedTimeZone(parseInt(data['startTime']))
        else
          data['startTime'] = "-";
    }
}
