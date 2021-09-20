import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { SelectItem } from 'primeng';
import * as DB_DROPDOWN from '../../constants/drop-down-constants';
import { UtilityService } from '../../../../service/utility.service';
import { Subscription } from 'rxjs';
import { DbData } from '../../containers/db-data';
import * as REMOTE_DROPDOWN from '../../constants/drop-down-constants';
import { MonitorupdownstatusService } from 'src/app/pages/monitor-up-down-status/service/monitorupdownstatus.service';

@Component({
  selector: 'app-db-deployment',
  templateUrl: './db-deployment.component.html',
  styleUrls: ['./db-deployment.component.scss']
})
export class DbDeploymentComponent implements OnInit {

  @Input()
  item: DbData;
  driverCls: string = '';
  showSid: boolean = false;
  labelForOracleAuth: string = "SID";
  sslTypeList: SelectItem[]; // contains SSL Type list
  tierName: string = ""; // tierName from configuration screen.
  monName: string = '';
  monType: number;
  authModeList: SelectItem[]; // contains Authentication Mode list

  isFromEdit: Subscription;
  tierList: any[] = []; // tier list
  serverList: any[] = []; // server list
  remServerVal: string = '';
  rServerLabel: string = 'Remote Server';
  rServerPlaceHolder: string = 'Custom remote server IP';
  @Input()
  showRmServer: boolean;
  @Input()
  showRmTier: boolean;

  constructor(private route: ActivatedRoute, private monitorupdownService: MonitorupdownstatusService) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.tierName = params['tierName'];
      this.monName = params['monName'];
      this.monType = params['monType'];
    });
    
    // this.monitorupdownService.$customData.subscribe(res=>{
    //   this.item = res;
    //   console.log("this is dbMonData----------->",this.item)
    // })

    this.tierList = UtilityService.createDropdown(REMOTE_DROPDOWN.TIERLIST);
    this.tierList.unshift({ label: 'Use Agent Tier', value: '_at' });
    if (!this.showRmTier && !this.showRmServer) // if -T and -S both are not present then do not show custom option in tierlist
    this.tierList = this.tierList.concat({ label: 'Custom', value: 'ct' });
    // this.monConfObj.getDefVal(this.monName, this.monType, this.monConfObj.getSysDef()).subscribe(data => {
    //   this.monConfObj.fillDefValInDBDeployment(data);
    //   setTimeout(() => {
    //     this.item['query'] = this.monConfObj.dbQuery;
    //     this.driverCls = this.monConfObj.driverCls;
    //     this.getPortVal(this.driverCls);
    //     this.showSid = this.monConfObj.showSID;
    //     if(!this.showSid && this.driverCls == 'oracle')
    //     {
    //       this.item['auth'] = "1";
    //       this.labelForOracleAuth = "Service Name";
    //     }
        
    //   });
    // })
    
    this.sslTypeList = UtilityService.createListWithKeyValue(DB_DROPDOWN.SSL_LABEL, DB_DROPDOWN.SSL_VALUE);
    // this.monConfObj.sslTypeList = this.sslTypeList;
    this.authModeList = UtilityService.createListWithKeyValue(DB_DROPDOWN.DB_AUTH_LABEL, DB_DROPDOWN.DB_AUTH_VALUE);
    
  }

  //to get default values of ports for databases
  getPortVal(driverCls){
    if(driverCls == "postgresql"){
      this.item['port'] = 5432;
    }
    else if(driverCls == "oracle"){
      this.item['port'] = 1521;
    }
    else if(driverCls == "ibmdb2app"){
      this.item['port'] = 50000
    }
    else if(driverCls == "mssql"){
      this.item['port'] = 1433
    }
    else if(driverCls == "mysql"){
      this.item['port'] = 3306
    }

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
