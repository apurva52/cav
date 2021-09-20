import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import * as _ from 'lodash';
import { ConfirmationService, MessageService } from 'primeng';
import { MonitorupdownstatusService } from '../../service/monitorupdownstatus.service';
import { UtilityService } from '../../service/utility.service';
import * as COMPONENT from '../add-monitor/constants/monitor-configuration-constants';


@Component({
  selector: 'app-tier-server',
  templateUrl: './tier-server.component.html',
  styleUrls: ['./tier-server.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [ConfirmationService],
})

export class TierServerComponent implements OnInit {

  tierList: any[] = [];
  tierHeadersList: any[];
  serverOptionList: any[];
  serverList: any[] = [];
  selectedServers: string[] = [];
  serverFilter: any[] = [{}];
  // anyTierList: any[];   //for tierName tag
  exServerList: any[] = [];   //exclude serverList
  exTierList: any[];    //exclude tierList
  loading: boolean;
  constructor(private monServiceObj: MonitorupdownstatusService, private cd: ChangeDetectorRef,
    private messageService: MessageService) { }

  ngOnInit() {
    this.loading = true;
    this.monServiceObj.getTierList().subscribe(res => {
      this.loading = false;
      let id = [];
      let tName = [];
      let tierNameList = [];
      let anytierNameList = [];

      res.map(each => {
        id.push(each['id']);
        tName.push(each['tName']);
      })
      this.tierHeadersList = UtilityService.createListWithKeyValue(tName, id);
      this.tierHeadersList.map(function (each) {
        if (each.value !== -1) {
          tierNameList.push(each.label)
        }
        if (each.value > -1) // for skipping tierGroups and All tiers
          anytierNameList.push(each.label)
      })
      this.tierList = UtilityService.createDropdown(tierNameList);
      let data = {};
      data["label"] = "All Tiers";
      data["value"] = "ALLtier";
      this.tierList.unshift(data);
      this.cd.detectChanges();
    })

    this.serverOptionList = [
      {
        value: -1,
        label: 'All'
      },
      {
        value: -2,
        label: 'Any'
      },
      {
        value: 'specified',
        label: 'Specified Server'
      },
    ];

    this.serverFilter = [{
      id: 0,
      tier: "",
      actualServer: "",
      server: [],
      exServer: [],
      exTier: [],
      serverList: []
    }];

  }

  onTierChange(data) {
    let tier = data.tier;
    if (data.tier === "ALLtier")
      tier = "All Tiers";

    data.actualServer = "";
    data.exServer = [];
    data.server = [];
    data.exTier = [];
    let tierInfo = _.find(this.tierHeadersList, function (each) { return each['label'] == tier })
    this.loading = true;
    this.monServiceObj.getServerList(tierInfo.value).subscribe(res => {
      this.loading = false;
      this.cd.detectChanges();
      let dName = [];
      let sName = [];
      res.map(each => {
        if (each['id'] >= 0) {
          sName.push(each['sName']);
          dName.push(each['dName']);
        }
      })
      // for bug 110920 we have added serverList per row so that unique serverlist is maintained.
      data.serverList = UtilityService.createListWithKeyValue(dName, sName);
      if (data.serverList && data.serverList.length > 0)
        data['exServerList'] = [...data.serverList];
    })

    if (data.tier === "ALLtier") {
      this.exTierList = this.tierList.filter(val => {
        return val.value !== "ALLtier"
      })
    }
  }


  onServerChange(tierServerInfo) {
    // for bug 111175
    if (tierServerInfo.actualServer === -1)
      tierServerInfo['exServerList'] = tierServerInfo.serverList;
  }

  addServerFilter() {
    if (!this.validateTierServer(this.serverFilter)) { return false; }
    this.serverFilter.push({
      id: this.serverFilter.length,
      tier: "",
      actualServer: "",
      server: [],
      exServer: [],
      exTier: [],
    });
  }

  getTierServerInfo() {
    let me = this;
    let tierServerInfo: any[] = [];
    let serverFlag = false;
    //used for filling tier/server and table data
    me.serverFilter.map(each => {
      let tSObj = {};
      let servers = "";
      let tierStr = "";
      if (each['tier'] == "" || each['tier'] == undefined) {
        this.messageService.add({ severity: COMPONENT.SEVERITY_ERROR, summary: COMPONENT.SUMMARY_ERROR, detail: "Please select tier." });
        return tierServerInfo;
      }
      tSObj['tier'] = each['tier'];
      if (each['tier'] == "ALLtier") {
        tSObj['server'] = "All";
        each['exTier'].map(tier => {
          tierStr = tierStr + tier + ",";
        })
        tierStr = tierStr.substring(0, tierStr.length - 1);
        if (tierStr === "")
          tSObj['exTier'] = null;
        else
          tSObj['exTier'] = tierStr;
      }
      else {
        if (each['actualServer'] == -1) {
          tSObj['server'] = "All";
          if (each['exServer']) {
            each['exServer'].map(server => {
              servers = servers + server + ",";
            })
          }
          servers = servers.substring(0, servers.length - 1);
          if (servers === "")
            tSObj['exServer'] = null;
          else
            tSObj['exServer'] = servers;
        }
        else if (each['actualServer'] == -2) {
          tSObj['server'] = "Any";
        }

        else {
          each['server'].map(function (eachServer) {
            servers = servers + eachServer + ",";
          })
          servers = servers.substring(0, servers.length - 1);
          tSObj['server'] = servers;
        }
      }
      tierServerInfo.push(tSObj);
    })

    tierServerInfo.map(each => {
      if (each.server == "" || each.server.length == 0)
        serverFlag = true;
    })
    if (serverFlag) {
      me.messageService.add({ severity: COMPONENT.SEVERITY_ERROR, summary: COMPONENT.SUMMARY_ERROR, detail: "Select Server to Add Monitor" });
      return;
    }
    return tierServerInfo;
  }

  fillTierDataAtEit(data) {
    this.serverFilter = [];
    let count = 0;
    this.exTierList = this.tierList.filter(val => {
      return val.value !== "ALLtier"
    })
    data.map(each => {
      let tierServerObj = {};
      let servers = [];
      let exTier = [];
      let exServer = []
      tierServerObj['tier'] = each['tier'];
      tierServerObj['id'] = count;
      if (each['exTier']) {
        if (each['exTier'].includes(","))
          exTier = each['exTier'].split(",");
        else
          exTier.push(each['exTier'])
      }
      if (each['server'] == "All") {
        tierServerObj['actualServer'] = -1;
        if (each['exServer']) {
          // if (each['exServer'].includes(","))
          //   servers = each['exServer'].split(",");
          // else
          //   servers.push(each['exTier'])

          //changes has been done for the bug id:-109471
          if (each['exServer'].includes(",")) {
            exServer = each['exServer'].split(",");
          }
          else {
            exServer.push(each['exServer'])
          }
        }
      }
      else if (each['server'] == "Any") {
        tierServerObj['actualServer'] = -2;
      }
      else {
        tierServerObj['actualServer'] = "specified";
        if (each['server'].includes(","))
          servers = each['server'].split(",");
        else
          servers.push(each['server']);
      }
      tierServerObj['exServer'] = exServer//for bug 109471
      tierServerObj['server'] = servers;
      tierServerObj['exTier'] = exTier;
      this.getServerListAtEdit(tierServerObj);
      this.onServerChange(tierServerObj);
      this.serverFilter.push(tierServerObj);
      count = count + 1;
    })
    this.cd.detectChanges();
  }

  clearTierServerData() {
    // this.serverFilter = [{}];
    // for Bug 110514
    for (let i = 0; i < this.serverFilter.length; i++) {
      this.serverFilter[i]['tier'] = "";
      this.serverFilter[i]['server'] = [];
      this.serverFilter[i]['id'] = 0;
      this.serverFilter[i]['actualServer'] = ""
      this.serverFilter[i]['exTier'] = [];
      this.serverFilter[i]['exServer'] = [];
      this.serverFilter[i]['serverList'] = [];
      this.serverFilter[i]['exServerList'] = [];
    }
    if (this.serverFilter.length > 1) {
      this.serverFilter = this.serverFilter.slice(0, 1);
    }
    this.cd.detectChanges();
  }

  //Method called at on row edit click to generate per row agent-server list.
  getServerListAtEdit(tierServerObj) {
    let me = this;
    this.loading = true;
    let tier = tierServerObj.tier;
    if (tierServerObj.tier === "ALLtier")
      tier = "All Tiers";
      
    let tierInfo = _.find(me.tierHeadersList, function (each) { return each['label'] == tier })
    if(!tierInfo) // for bug 112482
    {
      this.loading = false
      tierServerObj.tier = "";
      tierServerObj.actualServer = "";
      this.messageService.add({severity:COMPONENT.SEVERITY_ERROR, summary:COMPONENT.SUMMARY_ERROR, detail:tier + " is not present in topology."})
      return;
    }
    else
    {
      me.monServiceObj.getServerList(tierInfo.value).subscribe(res => {
        this.loading = false
        let dName = [];
        let sName = [];
        res.map(each => {
          if (each['id'] >= 0) 
          {
                sName.push(each['sName']);
                dName.push(each['dName']);
          }
        })

        if (tierServerObj.tier === "ALLtier") {
          me.exTierList = me.tierList.filter(val => {
            return val.value != "ALLtier"
          })
        }

        tierServerObj.serverList = UtilityService.createListWithKeyValue(dName, sName);
        if (tierServerObj.serverList && tierServerObj.serverList.length > 0)
          tierServerObj['exServerList'] = [...tierServerObj.serverList];

          let serverNotMatched="";
          tierServerObj['server'] = tierServerObj['server'].filter(function(obj) 
          { 
            if(sName.indexOf(obj) === -1)
            { 
              serverNotMatched = serverNotMatched + obj + ",";
            }
              return sName.indexOf(obj) != -1;
           });
           me.cd.detectChanges();
           if(serverNotMatched)
           {
             serverNotMatched = serverNotMatched.substring(0, serverNotMatched.length - 1);
             this.messageService.add({severity:COMPONENT.SEVERITY_ERROR, summary:COMPONENT.SUMMARY_ERROR, detail: serverNotMatched + " is not present for tier " + tierServerObj.tier + " in topology"})
             return;
           }
      })
    }
  }
  // For bug 110537 - Method to validate tier-server per row is selected or not.
  validateTierServer(tierServerInfos): boolean {
    let flag: boolean = true;
    tierServerInfos.map((tierServerInfo) => {
      if (tierServerInfo.tier != "ALLtier") {
        if (tierServerInfo.tier && tierServerInfo.actualServer) {
          if (tierServerInfo.tier != '' && tierServerInfo.actualServer === 'specified' && tierServerInfo.server.length == 0) {
            flag = false;
          }
        }
        else {
          flag = false
        }
      }
    })

    if (!flag)
      this.showErrorMsg(flag);

    return flag;
  }

  showErrorMsg(flag): boolean {
    if (!flag) {
      this.messageService.add({ severity: COMPONENT.SEVERITY_ERROR, summary: COMPONENT.SUMMARY_ERROR, detail: "Please fill agent tier-server to add next." })
      return flag;
    }
  }
}

