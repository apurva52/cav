import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { UtilityService } from 'src/app/pages/monitor-up-down-status/service/utility.service';
import { CmdData } from '../../containers/cmd-data';
import * as REMOTE_DROPDOWN from '../../constants/drop-down-constants';

@Component({
  selector: 'app-cmd-deployment',
  templateUrl: './cmd-deployment.component.html',
  styleUrls: ['./cmd-deployment.component.scss']
})
export class CmdDeploymentComponent implements OnInit {

  tierName: string = ""; // tierName from configuration screen.
  monName: string = '';
  monType: number;
  isFromEdit: Subscription;
  tierList: any[] = []; // tier list
  serverList: any[] = []; // server list
  remServerVal: string = '';
  rServerLabel: string = 'Remote Server';
  rServerPlaceHolder: string = 'Custom remote server IP';

  @Input()
  item: CmdData;
  @Input()
  showRmServer: boolean;
  @Input()
  showRmTier: boolean;

  constructor() { }

  ngOnInit(): void {
    this.tierList = UtilityService.createDropdown(REMOTE_DROPDOWN.TIERLIST);
    this.tierList.unshift({ label: 'Use Agent Tier', value: '_at' });
    if (!this.showRmTier && !this.showRmServer) // if -T and -S both are not present then do not show custom option in tierlist
    this.tierList = this.tierList.concat({ label: 'Custom', value: 'ct' });
  }

  ngOnChanges(changes: SimpleChanges) {
    // this.serverList = this.monConfServiceObj.getServerList();
    this.remServerVal = this.item['rS'];
  }

  getTierList() {
    let tierHeadersList: any[] = [];
    // tierHeadersList = this.monConfServiceObj.getTierHeaderList();
    let tierNameList = [];
    tierHeadersList.map(function (each) {
      if (each.id > -1) {
        tierNameList.push(each.name);
      }
    });
    this.tierList = UtilityService.createDropdown(tierNameList);
    this.tierList.unshift({ label: 'Use Agent Tier', value: '_at' });

    if (!this.showRmTier && !this.showRmServer) // if -T and -S both are not present then do not show custom option in tierlist
      this.tierList = this.tierList.concat({ label: 'Custom', value: 'ct' });
  }

  onTierChange(tier) {
    this.clearServerOptions();
    if (tier != 'ct') {
      if (tier == '_at')
        tier = this.tierName;

      // let tierInfo = _.find(this.monConfServiceObj.getTierHeaderList(), function (each) { return each['name'] == tier })
      // if (tierInfo != undefined) {
      //   this.getServerListData(tierInfo.id)
      // }
    }
    else {
      this.serverList = [];
      if (this.serverList.length == 0)
        this.serverList.push({ label: 'Custom', value: 'ct' })

      this.remServerVal = 'ct'
      this.item.rS = 'ct';
    }
  }

  getServerIP(selectedServer) {
    this.item['rSDpName'] = ''; //for clearing fields on change
    this.item['host'] = ''; //for clearing fields on change
    this.item['rS'] = ''; //for clearing fields on change
    if (selectedServer != 'ct') {
      // this.item['host'] = this.monConfServiceObj.getActualServerName(this.serverList, selectedServer)
      this.item['rS'] = selectedServer;
    }
    else {
      this.item['rS'] = 'ct';
    }

  }

  ngOnDestroy() {
    if (this.isFromEdit)
      this.isFromEdit.unsubscribe();
  }

  clearServerOptions() {
    this.item['rSDpName'] = ''; //for clearing fields on change
    this.item['host'] = ''; //for clearing fields on change
    this.item['rS'] = ''; //for clearing fields on change
    this.item['cT'] = '';
    this.remServerVal = '';
  }

}
