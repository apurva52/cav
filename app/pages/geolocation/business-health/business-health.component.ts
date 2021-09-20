import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { filter } from 'lodash';
import { LazyLoadEvent, MenuItem } from 'primeng';
import { AppError } from 'src/app/core/error/error.model';
import { Store } from 'src/app/core/store/store';
import { TableHeaderColumn } from 'src/app/shared/table/table.model';
import {
  BusinessHealthTable,
  BusinessHealthTableHeaderCols,
  BusinessHealthTableLoadPayload,
  BusinessHealthFilter,
} from './service/business-health.model';
import { BusinessHealthService } from './service/business-health.service';
import {
  BusinessHealthLoadingState,
  BusinessHealthLoadedState,
  BusinessHealthLoadingErrorState,
} from './service/business-health.state';
import { ActivatedRoute, Router } from '@angular/router';
import { GeolocationService } from '../service/geolocation.service';
import { DownloadReportLoadedState, DownloadReportLoadingErrorState, DownloadReportLoadingState } from 'src/app/shared/dashboard/dialogs/metric-description/service/metric-description.state';

@Component({
  selector: 'app-business-health',
  templateUrl: './business-health.component.html',
  styleUrls: ['./business-health.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class BusinessHealthComponent implements OnInit {
  data: BusinessHealthTable;
  tempData: BusinessHealthTable;
  error: AppError;
  loading: boolean;
  empty: boolean;
  emptyTable: boolean = false;
  globalFilterFields : string[] = [];
  breadcrumb: MenuItem[] = [];
  downloadOptions: MenuItem[];
  businessHealthData = [];
  totalRecords: any =0;
  selectedFilterValue: string='Normal';
  selectedRow: any;
  isShowColumnFilter: boolean = false;

  isEnabledColumnFilter: boolean = false;
  filterTitle: string = 'Enable Filters';
  tooltipzindex = 100000;

  cols: TableHeaderColumn[];
  _selectedColumns: TableHeaderColumn[];
  selectedApp: string;

  constructor(private businessHealthService: BusinessHealthService, private route: ActivatedRoute, private geolocationService: GeolocationService, private router: Router) {
    const me = this;
    this.route.queryParams.subscribe(params => {
      this.selectedApp = params['selectedApp'];
      this.selectedFilterValue = params['point'];
      console.log('this.selectedApp===>',this.selectedApp)
    });
   }

  ngOnInit(): void {
    const me = this;
    me.load(me.selectedApp, me.geolocationService.getDuration());
    const duration = me.geolocationService.getDuration();

    me.breadcrumb = [
      { label: 'Home', routerLink: '/home/dashboard' },
      { label: 'System', routerLink: '/home/system' },
      {label:'Geo-location', 
      command: (event: any) => {
        me.router.navigate(['/geo-location', 'details', duration.preset, duration.st, duration.et]);
      },
      },
      {label:'Business-health'}
    ];

    me.downloadOptions = [
     
      {
      label: 'WORD',
      command: () => {
      const me = this;
      me.downloadShowDescReports("worddoc");
      }
      },
      {
      label: 'EXCEL',
      command: () => {
      const me = this;
      me.downloadShowDescReports("excel");
      }
      },
      {
      label: 'PDF',
      command: () => {
      const me = this;
      me.downloadShowDescReports("pdf");
      }
      }
      
    ]
  }


  load(selectedApp, duration) {
    const me = this;
    me.businessHealthService.load(selectedApp, duration).subscribe(
      (state: Store.State) => {
        if (state instanceof BusinessHealthLoadingState) {
          me.onLoading(state);
          return;
        }

        if (state instanceof BusinessHealthLoadedState) {
          me.onLoaded(state);
          return;
        }
      },
      (state: BusinessHealthLoadingErrorState) => {
        me.onLoadingError(state);
      }
    );
  }

  private onLoading(state: BusinessHealthLoadingState) {
    const me = this;
    me.error = null;
    me.loading = true;
  }

  private onLoadingError(state: BusinessHealthLoadingErrorState) {
    const me = this;
    me.data = null;
    me.error = state.error;
    me.loading = false;
    me.empty = false;

  }

  private onLoaded(state: BusinessHealthLoadedState) {
    const me = this;

    if(state.data)
    {
      //To round off the business trans table data.
      state.data.data.forEach(function (valueData, i) {
        state.data.headers[0].cols.forEach(function (value) {
        if(!isNaN(valueData[value.valueField])){
          state.data.data[i][value.valueField]  = Math.round(valueData[value.valueField]);
        }
      })
    });
    }

    // me.data = state.data;
    // me.tempData = {...state.data};
    //Filtering data based on Normal
    // me.data.data = me.data.data.filter(a => a.severity == 'Normal')
    // me.error = null;
    // me.loading = false;
    // let check = {}
    // this.totalRecords = this.data.data.length;
    // if (me.data) {
    //   me.empty = false;
    //   if (!me.data.data || me.data.data == null || me.data.data.length == 0) {
    //     me.emptyTable = true;
    //   }
    // } else {
    //   me.empty = true;
    // }

    
    //
    me.data = state.data;
    me.tempData = {...state.data};
    //Selection of buttons based on severity initially
    me.data.filters.forEach((value,index)=>{
      if(value.name === this.selectedFilterValue)
        me.data.filters[index].selected = true ;
      else
        me.data.filters[index].selected = false ;
      }); 
     //filtering data  based on selected severity
     me.data.data = me.data.data.filter(a => a.severity == this.selectedFilterValue)
     this.businessHealthData = me.data.data;
     this.totalRecords = this.data.data.length;
     if (me.data) {
       me.empty = false;
       if (!me.data.data || me.data.data == null || me.data.data.length == 0) {
         me.emptyTable = true;
       }
     } else {
       me.empty = true;
     }
    me.cols = me.data.headers[0].cols;
    me.globalFilterFields =  me.cols.map(e=>{return e.valueField});
    me._selectedColumns = me.cols;
  }

  // Filtering data based on buttons
  toggleFilter(filterToToggle: BusinessHealthFilter) {
    const me = this;
    for (const filter of me.data.filters) {
      if (filterToToggle.key === filter.key) {
        filter.selected = !filter.selected;
      } else {
        filter.selected = false;
      }
    }

    me.data = {...me.tempData};
    me.data.data = me.data.data.filter(a => a.severity == filterToToggle.name)
    this.businessHealthData = me.data.data;
    this.totalRecords = this.data.data.length;
    if (me.data) {
      me.empty = false;
      if (!me.data.data || me.data.data == null || me.data.data.length == 0) {
        me.emptyTable = true;
      }
    } else {
      me.empty = true;
    }
  }

  readField() { }

  @Input() get selectedColumns(): any[] {
    const me = this;
    return me._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    const me = this;
    me._selectedColumns = me.cols.filter((col) => val.includes(col));
  }

  toggleFilters() {
    const me = this;
    me.isEnabledColumnFilter = !me.isEnabledColumnFilter;
    if (me.isEnabledColumnFilter === true) {
      me.filterTitle = 'Disable Filters';
    } else {
      me.filterTitle = 'Enable Filters';
    }
  }
  downloadShowDescReports(label) {
    const me = this;
    let tableData = me.data.data;
    let header = ['S No.'];
    let headerValueField = [];
    let colWidth = [125, 125, 125, 125.125];
    
    for (const c of me._selectedColumns){
    header.push(c.label)
    headerValueField.push(c.valueField)
    }
    
    let rowData:any []=[];
    for(let i =0;i<tableData.length;i++){
    let rData:string []=[];
    rData.push((i+1).toString());
    for(let j=0; j<headerValueField.length; j++){
    if(headerValueField[j] === 'no')
    continue;
    else if(headerValueField[j] === 'storeName')
    rData.push(tableData[i].storeName);
    else if(headerValueField[j] === 'time')
    rData.push(tableData[i].time);
    else if(headerValueField[j] === 'pvs')
    rData.push(tableData[i].pvs);
    else if(headerValueField[j] === 'error')
    rData.push(tableData[i].error);
    }
    rowData.push(rData);
    }
    
    try {
    me.businessHealthService.downloadShowDescReports(label, rowData,header, colWidth).subscribe(
    (state: Store.State) => {
    if (state instanceof DownloadReportLoadingState) {
    me.onLoadingReport(state);
    
    return;
    }
    
    if (state instanceof DownloadReportLoadedState) {
    me.onLoadedReport(state);
    return;
    }
    },
    (state: DownloadReportLoadingErrorState) => {
    me.onLoadingReportError(state);
    
    }
    );
    } catch (err) {
    console.error("Exception in downloadShowDescReports method in metric description component :", err);
    }
    }
    private onLoadingReport(state: DownloadReportLoadingState) {
      const me = this;
      me.error = null;
      me.loading = true;
      }
      private onLoadedReport(state: DownloadReportLoadedState) {
      const me = this;
      me.error = null;
      me.loading = false;
      let path = state.data.path.trim();
      let url = window.location.protocol + '//' + window.location.host;
      path = url + "/common/" + path;
      window.open(path + "#page=1&zoom=85", "_blank");
      
      }
      private onLoadingReportError(state: DownloadReportLoadingErrorState) {
      const me = this;
      me.data = null;
      me.error = state.error;
      me.loading = false;
      }
}
