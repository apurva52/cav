import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { FilterPipe } from 'src/app/shared/pipes/filter/filter.pipe';
import { MonitorupdownstatusService } from '../service/monitorupdownstatus.service';
import { APIData } from '../containers/api-data';
import * as  URL from '../constants/mon-rest-api-constants';
import { UtilityService } from '../../monitor-up-down-status/service/utility.service'
import { CustomMonitorService } from './add-custom-monitor/services/custom-monitor.service';

@Component({
  selector: 'app-configure-monitors',
  templateUrl: './configure-monitors.component.html',
  styleUrls: ['./configure-monitors.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [FilterPipe]
})
export class ConfigureMonitorsComponent implements OnInit {
  tierItems: any[] = [];
  showAdd = [];
  showLink = [];
  apiData: APIData
  configuredMonitorsData: any = {}
  otherMonitorData: any = {};
  availableTechnologyData: any = {};
  searchConfiguredMonitors: any = "";
  searchAvailableTech: any = "";
  loading: boolean; // Added for progress spinner at request api.
  tierList: any[] = [];
  tierHeadersList: any[];
  anyTierList: any[];   //for tierName tag
  kubernetesMonData: any = {};
  tierName:string = "";
  totalTechCount:number
  totalMonRunCount:number = 0;
  totalMonFailCount:number = 0;
  totalMonDisCount:number = 0;

  constructor(public router: Router, public monUpDownStatus: MonitorupdownstatusService,
    private custMonSevice: CustomMonitorService) { }

  ngOnInit(): void {
    const me = this;
    me.apiData = new APIData();
    if(this.monUpDownStatus.tier){
      if(this.monUpDownStatus.tier=="All Tiers"){
        this.apiData.tier = null
      }
      else{
      me.apiData.tier = this.monUpDownStatus.tier;
      }
      me.tierName = this.monUpDownStatus.tier;
    }
    me.loading = true;
    me.monUpDownStatus.getConfigureTechnology(me.apiData).subscribe(data => {
      // me.changeIconName(data._conf)
      me.configuredMonitorsData = data
      me.otherMonitorData = data
      me.totalTechCount = me.configuredMonitorsData._conf.length
      for(let i=0;i<me.configuredMonitorsData._conf.length;i++){
        me.totalMonRunCount += me.configuredMonitorsData._conf[i]['mon']['mrc']
        me.totalMonFailCount += me.configuredMonitorsData._conf[i]['mon']['mfc']
        me.totalMonDisCount += me.configuredMonitorsData._conf[i]['mon']['mdc']
      }
    },
      error => {
        me.loading = false;
      },
      () => {
        me.loading = false;
      })

    me.monUpDownStatus.getAvailableTech(me.apiData).subscribe(data => {
      // me.changeIconName(data._cloud)
      me.availableTechnologyData = data;
      me.kubernetesMonData = me.availableTechnologyData["_at"].filter(each => {
        return each.n.startsWith("kubernetes")
      })
      me.availableTechnologyData["_at"] = me.availableTechnologyData["_at"].filter(each => {
        return !each.n.startsWith("kubernetes")
      })
      me.custMonSevice.setAvailableTechList(me.availableTechnologyData);
    },
      error => {
        me.loading = false;
      },
      () => {
        me.loading = false;
      })

    //for tier list in home screen
    me.monUpDownStatus.getTierList().subscribe(res => {
      let id = [];
      let tName = [];
      let tierNameList = [];
      let anytierNameList = [];

      res.map(each => {
        id.push(each['id']);
        tName.push(each['tName']);
      })
      me.tierHeadersList = UtilityService.createListWithKeyValue(tName, id);
      this.custMonSevice.setTierHeaderList(me.tierHeadersList);
      me.tierList = UtilityService.createListWithKeyValue(tName, id);

      me.tierHeadersList.map(function (each) {
        tierNameList.push(each.label)
        if (each.value > -1) // for skipping tierGroups and All tiers
          anytierNameList.push(each.label)
      })
      me.tierList = UtilityService.createDropdown(tierNameList);
      if(!this.monUpDownStatus.tier)
        me.tierName = "All Tiers";
      me.anyTierList = UtilityService.createDropdown(anytierNameList);
    })
  }
  public navigateToMonitors(data, statusCount, monCount, status): void {
    let tierName;
    let serverName;
    // if (this.tierName == null || this.tierName === "All Tiers") {
    //   tierName = ""
    // }
    // else {
      tierName = this.tierName;
    //}
    if (this.apiData.server == null) {
      serverName = ""
    }
    else {
      serverName = this.apiData.server
    }
    this.monUpDownStatus.navTierFlag = false;
    this.monUpDownStatus.navServerFlag = false;
    this.monUpDownStatus.tier = tierName;
    this.monUpDownStatus.flag = true;
    if (statusCount != 0)
      this.router.navigate([URL.MONITORS, data.n, tierName, monCount, data.dn, data.tc, data.sc, data.ic, status]);
  }

  configureMonitor(techName, techDisplayName) {
    if (techName === URL.SNMP)
      this.router.navigate([URL.SNMP]);
    else if (techName === URL.HEALTH_CHECK)
      this.router.navigate([URL.HEALTH_CHECK_URL])
    else if (techName === URL.CLOUD_GCP_Ex)
      this.router.navigate([URL.GCP])
    else if (techName === URL.CLOUD_AWS)
      this.router.navigate([URL.AWS])
    else if (techName === URL.CLOUD_AZURE)
      this.router.navigate([URL.AZURE])
    else if (techName === URL.CLOUD_NEW_RELIC)
      this.router.navigate([URL.NEW_RELIC])
    else if (techName === URL.CLOUD_DYNATRACE)
      this.router.navigate([URL.DYNATRACE])
    else
      this.router.navigate([URL.ADD_MONITORS, techName, techDisplayName]);
  }

  openCloudMonComp(cloudMon) {
    if (cloudMon === URL.CLOUD_AWS) {
      this.router.navigate([URL.AWS]);
    }
    else if (cloudMon === URL.CLOUD_AZURE) {
      this.router.navigate([URL.AZURE]);
    }
    else if (cloudMon === URL.CLOUD_GCP_Ex) {
      this.router.navigate([URL.GCP]);
    }
    else if (cloudMon === URL.CLOUD_NEW_RELIC) {
      this.router.navigate([URL.NEW_RELIC]);
    }
    else if (cloudMon === URL.CLOUD_DYNATRACE) {
      this.router.navigate([URL.DYNATRACE]);
    }
  }
  openTier(data) {
    let tier = ""
    if (this.tierName == null) {
      tier = "All"
    }
    else {
      tier = this.tierName;
    }
    this.monUpDownStatus.tier = this.tierName
    if (data.tc != 0) {
      this.monUpDownStatus.navTierFlag = true;
      this.monUpDownStatus.navServerFlag = false;
      this.router.navigate(['/oracle-tier', data.n, tier, data.dn]);
    }
  }
  openServer(data) {
    if (this.tierName == null) {
      this.monUpDownStatus.tier = null
    }
    else {
      this.monUpDownStatus.tier = this.tierName
    }
    if (data.sc != 0) {
      this.monUpDownStatus.navTierFlag = false;
      this.monUpDownStatus.navServerFlag = true;
      this.router.navigate(['/oracle-server', data.n, data.dn,this.tierName]);
    }
  }
  onTierChange() {
    if (this.tierName == "All Tiers") {
      this.apiData.tier = null
    }
    else{
      this.apiData.tier = this.tierName
      this.monUpDownStatus.tier = this.tierName
    }
    const me = this;
    me.totalMonRunCount = 0
    me.totalMonFailCount= 0
    me.totalMonDisCount =0
    me.monUpDownStatus.getConfigureTechnology(me.apiData).subscribe(data => {
      me.configuredMonitorsData = data
      me.totalTechCount = me.configuredMonitorsData._conf.length
      for(let i=0;i<me.configuredMonitorsData._conf.length;i++){
        me.totalMonRunCount += me.configuredMonitorsData._conf[i]['mon']['mrc']
        me.totalMonFailCount += me.configuredMonitorsData._conf[i]['mon']['mfc']
        me.totalMonDisCount += me.configuredMonitorsData._conf[i]['mon']['mdc']
      }
    },
      error => {
        me.loading = false;
      },
      () => {
        me.loading = false;
      })
  }

  openOtherMon(monName) {
    if (monName === "Check Monitor" || monName === "Batch Jobs")
      this.router.navigate(['/check-monitor', monName])
    if (monName === "Log Monitor")
      this.router.navigate(['/log-monitor-common/log-pattern-monitor'])
    if (monName === "Server Signature")
      this.router.navigate(['/server-signature'])
  }

  changeIconName(data){
    for(let i = 0; i< data.length; i++ )
    {
      if(data[i].asset === 'accesslog.svg')
        data[i].asset = 'cav access-control'
     else if(data[i].asset === 'network.svg')
       data[i].asset = 'cav network-character'
    else if(data[i].asset === 'weblogic.svg')
       data[i].asset = 'icons8 icons8-globe'
    else if(data[i].asset === 'processandthread.svg')
       data[i].asset = 'cav thread-dump'
    else if(data[i].asset === 'system.svg')
       data[i].asset = 'cav System-Events'
    else if(data[i].asset === 'mysql.svg')
       data[i].asset = 'cav sql-monitoring'
    else if(data[i].asset === 'aws.svg')
       data[i].asset = 'las-aws'
    else if(data[i].asset === 'azure.svg')
       data[i].asset = 'las-accusoft'
    }
  }
}
