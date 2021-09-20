import { Component, OnInit, Input } from '@angular/core';
import { SelectItem } from 'primeng/primeng';
import { ExecDashboardCommonKPIDataservice } from './../../../services/exec-dashboard-common-kpi-data.service';
import { MULTIZONE_GRID_HEADER, MULTIZONE_GRID_SUB_HEADER } from '../../../constants/exec-dashboard-kpi-header-const';
import { ExecDashboardConfigService } from './../../../services/exec-dashboard-config.service';
import { ExecDashboardUtil } from './../../../utils/exec-dashboard-util';
import { Meta } from '@angular/platform-browser';
@Component({
  selector: 'app-exec-dashboard-multizoned',
  templateUrl: './exec-dashboard-multizoned.component.html',
  styleUrls: ['./exec-dashboard-multizoned.component.css']
})

export class ExecDashboardMultizonedComponent implements OnInit {

  @Input('multiZoneView') multiZoneViewObj;
  expandTable: Boolean = true;

  subHeaders: any[] = MULTIZONE_GRID_SUB_HEADER;
  tabHeaders: any[] = MULTIZONE_GRID_HEADER;
  zoneArr: any[] = [];
  kpiMultiPvs: string =  'kpi_multi_pvs';
  kpiMultiRes:string = 'kpi_multi_res'
  kpiMultiCpu: String = 'kpi_multi_cpu';
  kpimultiPky:string = 'kpi_multi_pky';
  kpimultiScs:string = 'kpi_multi_scs';
  kpiTotal:string = 'kpi_total';
  kpiPvsPkyData:string = 'kpi_pvs_pky_data';
  kpiPvsScsData: string = 'kpi_pvs_scs_data';
  kpiPvsTotal:string = 'kpi_pvs_total'
  kpiResPkyData: string = 'kpi_res_pky_data';
  kpiResScsData: string = 'kpi_res_scs_data';
  kpiCpuPkyData: string = 'kpi_cpu_pky_data';
  kpiCpuScsData: string = 'kpi_cpu_scs_data';

  kpiTierName: string = 'kpi_tier_name';
  kpiUpdtMins: string = 'kpi_updated_mins';
  // To calculate tier name column's width
  tierNameWidth: any = window.orientation; 
  disableZone1:boolean = false;
  disableZone2:boolean = false;
  zones:string[] = [];
  // zones: SelectItem[] = [];
  loadedZone:string = 'blue';
  isLoaded:boolean = true;
  selectedZone: string = "all";
  constructor(private meta: Meta,public _commonKpi: ExecDashboardCommonKPIDataservice, public _config: ExecDashboardConfigService) {


    // Listen for orientation changes
    let that = this
    window.addEventListener("orientationchange", function () {

      //0 - Portrait mode and 90 - Landscape mode
      that.tierNameWidth  = window.orientation
    }, false);
  }

  ngOnInit() {
    this.loadedZone = this._commonKpi.kpiLoadedZone ? this._commonKpi.kpiLoadedZone:'';
    this.meta.removeTag("name='viewport'");
    this.meta.addTag({ name: 'viewport', content:'width=device-width, height=device-height, user-scalable=no, initial-scale=0.1, ' });
    let val = this.multiZoneViewObj.zone;
    // This will work for both MultiDC and MultiZone
    // this.zones.push({label:"All",value:"all"});
    this.zoneArr = (val.split(",") == 'NA') ? this.multiZoneViewObj["DCs"].split(',') : val.split(",");    
    /**
     * checking if table's zone shifted to a zone
     * if shifted, then hide the checkboxes to change the zone and provide the loaded zone to the table
     * else provide checkboxes, let user handle which table to hide and show
     */
    this.zones = this.zoneArr;
    this.selectedZone = sessionStorage.getItem(this.multiZoneViewObj.header + "_selectedZone")? sessionStorage.getItem(this.multiZoneViewObj.header + "_selectedZone") : 'all';
    if (sessionStorage.getItem(this.multiZoneViewObj.header + "_selectedZone")){
      let z = sessionStorage.getItem(this.multiZoneViewObj.header + "_selectedZone");
      if(z == "all"){
        this.selectedZone = 'all'
        this.disableZone1 = false;
        this.disableZone2 = false;
      }
      else if(z == this.zoneArr[0]){
        this.disableZone1 = true;
        this.selectedZone = z;
        this.zones = [z];
      }
      else if(z == this.zoneArr[1]){
        this.disableZone2 = true;
        this.selectedZone = z;
        this.zones = [z];
      }
    }
    else{
      if (this.loadedZone && this.loadedZone != "") {
        if (this.zoneArr[0] == this.loadedZone) {
          this.disableZone1 = true;
          this.selectedZone = this.loadedZone;
          this.zones = [this.loadedZone];
        }
        else if (this.zoneArr[1] == this.loadedZone) {
          this.disableZone2 = true;
          this.selectedZone = this.loadedZone;
          this.zones = [this.loadedZone];
        }
      }
      }
  }

  /**
   * responsible for hiding and showing column
   */
  toggleTable() {
    try {
      if (this.expandTable) {
        this.expandTable = false;
      }
      else {
        this.expandTable = true;
      }
    } catch (error) {
      console.error(error);
    }
  }


  seperateByComma(value){
    // console.log("seperateByComma -->  ", value , typeof value)
    // console.log( ExecDashboardUtil.numberToCommaSeperate(parseInt(value)) );
    if (typeof (value) === "string" && value.indexOf("/") !== -1) {
			let arr = value.split('/');
			let newValue = '';
			for (let index = 0; index < arr.length; index++) {
				const element = arr[index];
				if (element != null) {
					if (index === 0) {
						newValue = newValue + ExecDashboardUtil.numberToCommaSeperate(parseFloat(element), ) + '/';
					}
					else {
						newValue = newValue + ExecDashboardUtil.numberToCommaSeperate(parseFloat(element));
					}
				}
			}

			return newValue;
    }
    
    if(parseFloat(value) !== 0){
        if(parseFloat(value) < 1){
            // console.log("less than 1 -- ", value, typeof value);
            // tempObject[element] = Math.round(rowData[element] * 1000) / 1000;
            return Math.round(value * 1000) / 1000;
        }
        else {
            return ExecDashboardUtil.numberToCommaSeperate(Math.round(parseFloat(value) * 1000) / 1000);
        }
    }
    else {
        // console.log(" equals to zero -->  ", value , typeof value);
        if(value != null){
            return value.toString();
        }
        else {
            return '-';
        }
    }
    // return ExecDashboardUtil.numberToCommaSeperate(parseInt(value));

    // if(parseInt(value))
}
/*
* method to change zone on selection
* atleast one zone must be selected in the zone type table
*/
  showSelectedZone(){
    if (this.zones.length == 2){
      this.selectedZone = 'all'
      this.disableZone1 = false;
      this.disableZone2 = false;
    }
    else if (this.zoneArr[0] == this.zones[this.zones.length-1]){
      this.disableZone1 = true;
      this.selectedZone = this.zoneArr[0];
    }
    else if (this.zoneArr[1] == this.zones[this.zones.length - 1]){
      this.disableZone2 = true;
      this.selectedZone = this.zoneArr[1];
    }
    sessionStorage.setItem(this.multiZoneViewObj.header+"_selectedZone", this.selectedZone);
  }

}
