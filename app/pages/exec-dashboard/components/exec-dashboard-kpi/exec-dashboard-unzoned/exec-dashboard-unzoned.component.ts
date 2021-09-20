import { Component, OnInit, Input } from '@angular/core';
import { ExecDashboardCommonKPIDataservice } from './../../../services/exec-dashboard-common-kpi-data.service';
import { UNZONED_GRID_HEADER, UNZONED_GRID_FIELDS, FIELD_COLS } from '../../../constants/exec-dashboard-kpi-header-const';
import { ExecDashboardConfigService } from './../../../services/exec-dashboard-config.service';
import { Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-exec-dashboard-unzoned',
  templateUrl: './exec-dashboard-unzoned.component.html',
  styleUrls: ['./exec-dashboard-unzoned.component.css']
})

export class ExecDashboardUnzonedComponent implements OnInit {

  @Input('singleDcView') unzoneViewObj;

  unzoneDataGrid: any[] = [];   //array for data table
  tabHeaders = UNZONED_GRID_HEADER;
  tableFields: any[] = [];
  expandTable: Boolean = true;
  kpiMultiPvs: string =  'kpi_multi_pvs';
  kpiMultiRes:string = 'kpi_multi_res';
  kpiMultiCpu: String = 'kpi_multi_cpu';
  kpiPvsPkyData:string = 'kpi_pvs_pky_data';
  kpiResScsData: string = 'kpi_res_scs_data';
  kpiCpuPkyData: string = 'kpi_cpu_pky_data';
  kpi_tier_name:string ='kpi_tier_name';
  kpiUpdtMins: string = 'kpi_updated_mins';

  constructor(public _commonKpi: ExecDashboardCommonKPIDataservice,
              public _config: ExecDashboardConfigService,  private meta : Meta) { }

  ngOnInit() {
    this.meta.removeTag("name='viewport'");
    this.meta.addTag({ name: 'viewport', content:'width=device-width, height=device-height, user-scalable=no, initial-scale=0.1, ' });

    this.tableFields = FIELD_COLS;
    this.unzoneDataGrid = this._commonKpi.$kpiDataObj["grid_" + this.unzoneViewObj.DCs];

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

}
