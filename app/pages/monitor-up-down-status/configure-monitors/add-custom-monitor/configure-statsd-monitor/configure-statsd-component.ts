import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
//import { MessageService } from '../../services/message.service';
//import { MonConfigurationService } from '../../services/mon-configuration.service';
//import { UtilityService } from '../../services/utility.service';
import { MessageService, SelectItem } from 'primeng/api';
import * as TABLEHEADER from '../../../../generic-gdf/constants/generic-gdf-tableheader';
import { MonitorupdownstatusService } from '../../../service/monitorupdownstatus.service';
import { APIData } from '../containers/api-data';

import { StatsDMonData } from '../containers/statsd-mon-data';
import { CustomMonitorService } from '../services/custom-monitor.service';
//import * as URL from '../../constants/mon-url-constants';
//import * as COMPONENT from '../../constants/mon-component-constants';
import * as COMPONENT from '../../add-monitor/constants/monitor-configuration-constants';

@Component({
  selector: 'app-configure-statsd-monitor',
  templateUrl: './configure-statsd-monitor.component.html',
  styleUrls: ['./configure-statsd-monitor.component.scss']
})
export class ConfigureStatsDMonitorComponent implements OnInit {

  //statsdMonData: StatsDMonData;
  apiData:APIData;
  cusCat: string = ""; // custom category name
  arrMetricConf: any[] = []; // array for sending columns index user wants to show in UI.
  arrMetricHier: any[] = []; // array for sending columns index user wants to show in UI.
  categoryList: any[] = [];//list of categories 
  noEdit: boolean = false;
  statsdMonDTO:StatsDMonData;
  loading:boolean

  constructor(
    private router: Router, 
    private customMonService:CustomMonitorService,
    private monUpDownStatus:MonitorupdownstatusService,
    private cd: ChangeDetectorRef,
    private msgService:MessageService
    ) { }

    ngOnInit() {
      this.apiData = new APIData();
      this.statsdMonDTO = new StatsDMonData();
  
      this.arrMetricHier = [
        { field: TABLEHEADER.METADATA, header: 'Metric Hierarchy Component', visible: false },
        { field: TABLEHEADER.KEY_INDEX, header: 'Column Key', visible: false },
      ]
  
      this.arrMetricConf = [
        { field: TABLEHEADER.METRIC_GROUP_NAME, header: 'Metric Name', visible: false, width: '200px' },
        { field: TABLEHEADER.DATA_TYPE, header: 'Data type', visible: false, width: '200px' },
        { field: TABLEHEADER.METRIC_TYPE, header: 'Metric Type', visible: true, width: '200px' },
        { field: TABLEHEADER.METRIC_KEY_INDEX, header: 'Metric Pattern', visible: false, width: '200px' },
        { field: TABLEHEADER.METRIC_DESC, header: 'Description', visible: false, width: '200px' },
  
      ]
      if (this.customMonService.isFromEdit) // check "ADD" or "EDIT"  mode
      {
        this.statsdMonDTO = Object.assign({}, this.customMonService.getStatsdEditData)
        if (this.statsdMonDTO .adv.interval == -1) {
          this.statsdMonDTO.adv.interval = null;
        }
        this.editKeyForHierarchy(this.statsdMonDTO .gdfInfo.depMHComp);   //used for showing key in UI in edit mode
        this.customMonService.outputLength = 0;
      }
      this.apiData['statsdMonDTO'] = this.statsdMonDTO;

      // this.monUpDownStatus.getAvailableTech(this.apiData).subscribe(data =>{
      //   console.log("technology data=====>",data._at)
      //   for(let i = 0; i<data._at.length; i++){
      //     this.categoryList.push({label: data._at[i].dn, value: data._at[i].n});
      //     console.log("category List====>",this.categoryList)
      // }
      // this.categoryList.push({label:'--Add New Technology--', value:'addNewTechnology'});
      // console.log("category List====>",this.categoryList)
      // })

     // let tempArr = this.monConfServiceObj.getCategoryList();
      ////this.categoryList = UtilityService.createDropdown(tempArr);
      //this.noEdit = this.cmsObj.editNotAllowed; //added for not allowing to save configuration if conf. already applied  in monitor json
    }
  

  //Method called on "BACK" button click 
  // exitConfigurationStatsdMon() {
  //   this.cmsObj.exitConfiguration();
  // }

  //Method called on save click to save statsd monitor configuration 
  saveMonitorsConfigurationData() {
    this.customMonService.saveMonitorConfProvider(true);
    //adding custom category name to category tag in json backend
    if (this.statsdMonDTO.cat == 'addNewTechnology') {
      this.statsdMonDTO.cat = this.statsdMonDTO.cusCat;
    }
    if (this.statsdMonDTO.adv.interval == null) {
      this.statsdMonDTO.adv.interval = -1;
     }
    this.dataConversion(this.statsdMonDTO.gdfInfo.metricInfo);
    this.setKeyForHierarchy(this.statsdMonDTO.gdfInfo.depMHComp);

    if(!this.customMonService.validateConfigurationData(this.statsdMonDTO))
      return false;

    // this.cmsObj.saveMonConf(COMPONENT.STATSD_TYPE, this.statsdMonData).subscribe(res => {
    //   if (res) {
    //     this.msgServiceObj.successMessage("StatsD monitor saved successfully")
    //     this.statsdMonData = new StatsDMonData(); // for clearing fields of the form after save
    //     this.router.navigate([URL.MON_MNGT, this.cmsObj.monType]);
    //   }
    // })
    this.statsdMonDTO.monN = this.statsdMonDTO.gdfInfo.grpN
    this.apiData.objectId = this.customMonService.objectID;
     this.apiData['statsdMonDTO'] = this.statsdMonDTO;
     this.loading = true;
    this.customMonService.saveStatsd(this.apiData).subscribe(data=>{
      if(data['status']){
        this.msgService.add({severity:COMPONENT.SEVERITY_SUCCESS, summary: COMPONENT.SUMMARY_SUCCESS,detail:data['msg']})
        this.statsdMonDTO = new StatsDMonData(); // for clearing fields of the form after save
        this.loading = false
        setTimeout(() =>
        {
        this.router.navigate(["/custom-monitors/availCustMon/statsd"]);
        },500)
      }
      else{
        this.msgService.add({ severity: COMPONENT.SEVERITY_ERROR, summary: COMPONENT.SUMMARY_ERROR, detail: data['msg'] })
        this.loading = false;
        this.cd.detectChanges();
      }
    })
  }

  /**
   * 
   * @param metricConfData 
   * used for convert dataType for gdf i.e in UI it'll be showing as Gause/Timers but in gdf 
   * it'll be saved as sample/times
   */
  dataConversion(metricConfData) {
    metricConfData.map(function (each) {
      if (each.dT == "Timers")
        each.dT = "times";
      else
        each.dT = "sample";
    })
  }

  //key will saved between % symbol in backend
  setKeyForHierarchy(data)
  {
    data.map(function (each) {
        each._keyInd = "%"+ each._keyInd +"%";
    })
  }

  //used for showing key in UI in edit mode
  editKeyForHierarchy(data)
  {
    data.map(function (each) {
        each._keyInd = each._keyInd.substring(1, each._keyInd.length-1);  
    })
  }

  metricTableData(data) {
    if (data.depMHComp)
      this.statsdMonDTO.gdfInfo.depMHComp = data.depMHComp;

    this.statsdMonDTO.gdfInfo.mD = data.mD;
  }

  metricConfTableData(data) {
    this.statsdMonDTO.gdfInfo.metricInfo = data;
  }

ngOnDestroy() {
    this.customMonService.isFromEdit = false;
    this.customMonService.objectID = "-1";
    //this.noEdit = false;
    this.customMonService.statsdtype = '';
    //this.cmsObj.editNotAllowed = false;
  }  
}
