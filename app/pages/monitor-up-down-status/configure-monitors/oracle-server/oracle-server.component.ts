import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { APIData } from '../../containers/api-data';
import { MonitorupdownstatusService } from '../../service/monitorupdownstatus.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import * as  URL from '../../constants/mon-rest-api-constants';
import { FilterPipe } from 'src/app/shared/pipes/filter/filter.pipe';
import { MenuItem } from 'primeng';
import { MonitorsComponent } from '../monitors/monitors.component';


@Component({
  selector: 'app-oracle-server',
  templateUrl: './oracle-server.component.html',
  styleUrls: ['./oracle-server.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [FilterPipe]
})
export class OracleServerComponent implements OnInit {

  serverList: any[];
  tierList: any[];
  apiData:APIData
  configuredMonitorsData: any = {};
  searchConfiguredMonitors: any = "";
  breadcrumb: MenuItem[] = [];
  techName: any;
  serverName: string = "";
  display:boolean
  @ViewChild(MonitorsComponent) monInfoChild: MonitorsComponent;
  activeIndex:number = 0
  constructor(private monUpDownStatus:MonitorupdownstatusService,
    public router: Router,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.activeIndex = 0
    const me = this;
    me.apiData = new APIData()
    this.route.params.subscribe((params: Params) => {
      me.apiData.tName = params['tech'];
      me.apiData.tier = params['tierName']
      me.techName = params['techDispName']
    });
    me.apiData.server = "All"
    // if(me.monUpDownStatus.tier == "All Tiers"){
    //   me.apiData.tier = null
    // }
    // else{
    // me.apiData.tier = me.monUpDownStatus.tier
    // }
    if(me.apiData.tier == "All Tiers"){
      me.apiData.tier = null
    }
    this.serverName = me.apiData.server;
    me.monUpDownStatus.getConfigureTechnology(me.apiData).subscribe(data=>{
      me.configuredMonitorsData = data
      me.display = true
        this.monUpDownStatus.statusDetail = {
          "techDispName":me.techName,
          "tierName":this.configuredMonitorsData._conf[0]['tdn'],
          "status":"All",
          "serverName":this.configuredMonitorsData._conf[0]['sdn'],
          "sc":"1",
          "ic":this.configuredMonitorsData._conf[0]['ic'],
          "tc":"1",
          "mtc":this.configuredMonitorsData._conf[0]['mon']['mtc'],
        }      
      //me.monUpDownStatus.tier = null
    })
  if(me.monUpDownStatus.navTierFlag){
    me.breadcrumb = [
      { label: 'Monitor Home',url:'#/configure-monitors' },
      //{ label: me.techName + ', Tier(All)',url:'#/configure-monitors' },
      //{ label: me.techName + ', Tier(All)',url:'#/oracle-tier/' + me.apiData.tName + "/" + me.apiData.tier + "/" + me.techName},
      { label: me.techName + ', Tier'+ '(' + me.monUpDownStatus.navTierName + ')',url:'#/oracle-tier/' + me.apiData.tName + "/" + me.monUpDownStatus.navTierName + "/" + me.techName},
      // { label:'Tier' + '(' + me.apiData.tier + ')', url:'#/oracle-tier/' + me.apiData.tName + "/" + me.apiData.tier + "/" + me.techName},
      { label:'Tier' + '(' + me.apiData.tier + ')' + ', Server'+ '(' + me.apiData.server + ')',url:'#/oracle-server/'+  me.apiData.tName + "/" + me.techName}
    ]
  }
  else{
    me.monUpDownStatus.navTierFlag = false;
    me.breadcrumb = [
      { label: 'Monitor Home',url:'#/configure-monitors' },
      { label: me.techName + ', Server'+ '(' + me.apiData.server + ')',url:'#/oracle-server/'+  me.apiData.tName + "/" + me.techName },
      // { label:'Server'+ '(' + me.apiData.server + ')',url:'#/oracle-server/'+  me.apiData.tName + "/" + me.techName}
    ]
  }
  }
  public navigateToMonitors(data,statusCount,status,index): void {
    if(statusCount !=0){
      this.activeIndex = index
      this.monUpDownStatus.navServerFlag = true;
      this.monUpDownStatus.statusDetail = {
        "techDispName":this.techName,
        "tierName":data.tdn,
        "serverName":data.sdn,
        "status":status,
        "sc":"1",
        "ic":data.ic,
        "tc":"1",
        "mtc":data.mon.mtc
      }
      this.monInfoChild.selectedColumns = []
      this.monInfoChild.selectedColumnsGroup = []
      this.monInfoChild.createStatusData()
    }
  } 
  itemClicked(event) {
    if(this.monUpDownStatus.navTierFlag){
      this.router.navigate(['/oracle-tier',this.apiData.tName,this.monUpDownStatus.navTierName,this.techName])
    }
    else{
      this.router.navigate(['#/configure-monitors'])
    }
 }
}
