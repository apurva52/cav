import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { APIData } from '../../containers/api-data';
import { MonitorupdownstatusService } from '../../service/monitorupdownstatus.service';
import * as  URL from '../../constants/mon-rest-api-constants';
import { FilterPipe } from 'src/app/shared/pipes/filter/filter.pipe';
import { MenuItem } from 'primeng';
import { MonitorsComponent } from '../monitors/monitors.component';

@Component({
  selector: 'app-oracle-tier',
  templateUrl: './oracle-tier.component.html',
  styleUrls: ['./oracle-tier.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [FilterPipe]
})
export class OracleTierComponent implements OnInit {

  serverList: any[];
  tierList: any[];
  apiData:APIData
  configuredMonitorsData: any = {};
  searchConfiguredMonitors: any = "";
  breadcrumb: MenuItem[] = [];
  techName: any;
  tierName: string = "";
  display:boolean;
  @ViewChild(MonitorsComponent) monInfoChild: MonitorsComponent;
  activeIndex:number = 0

  constructor(private monUpDownStatus:MonitorupdownstatusService,
    public router: Router,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.activeIndex = 0
    const me = this;
    me.apiData = new APIData();
    this.route.params.subscribe((params: Params) => {
      me.apiData.tName = params['tech'];
      me.apiData.tier = params['tier']
      me.techName = params['techDispName']
    });
   if(this.apiData.tier == "All Tiers"){
     this.apiData.tier = "All"
   }
  //this.tierName = this.apiData.tier;
   me.monUpDownStatus.getConfigureTechnology(me.apiData).subscribe(data=>{
     me.configuredMonitorsData = data
     me.display = true;
     me.monUpDownStatus.statusDetail = {
       "techDispName":me.techName,
       "tierName": me.configuredMonitorsData._conf[0]['tdn'],
       "status":"All",
       "sc":me.configuredMonitorsData._conf[0]['sc'],
       "ic":me.configuredMonitorsData._conf[0]['ic'],
       "tc":"1",
       "mtc":me.configuredMonitorsData._conf[0]['mon']['mtc']
     }
   })
  me.breadcrumb = [
    { label: 'Monitor Home',url:'#/configure-monitors' },
    { label: me.techName + ',Tier'+'(' + me.apiData.tier + ')',url:'#/oracle-tier/' + me.apiData.tName + "/" + me.apiData.tier + "/" + me.techName },
    // { label:'Tier'+ '(' + me.apiData.tier + ')',url:'#/oracle-tier/' + me.apiData.tName + "/" + me.apiData.tier + "/" + me.techName}
  ]
  }
  openServer(tier,serverCount){
    const me = this
    //me.monUpDownStatus.tier = tier
    //me.apiData.tier = tier
    me.monUpDownStatus.navTierFlag = true;
    me.monUpDownStatus.navTierName = this.apiData.tier
    if(serverCount != 0)
    this.router.navigate(['/oracle-server',me.apiData.tName,me.techName,tier]);
  }
  public navigateToMonitors(statusCount,data, status,index): void {
    let serverName = ""
    if(statusCount != 0){
      this.activeIndex = index
      this.monUpDownStatus.navTierFlag = true;
      this.monUpDownStatus.navTierName = this.apiData.tier
      this.monUpDownStatus.statusDetail = {
        "techDispName":this.techName,
        "tierName":data.tdn,
        "status":status,
        "sc":data.sc,
        "ic":data.ic,
        "tc":"1",
        "mtc":data.mon.mtc
      }
      this.monInfoChild.selectedColumns = []
      this.monInfoChild.selectedColumnsGroup = []
      this.monInfoChild.createStatusData()
    }
   
  }
}
