import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { LazyLoadEvent, MenuItem } from 'primeng';
import { AppError } from 'src/app/core/error/error.model';
import { Store } from 'src/app/core/store/store';
import { TableHeaderColumn } from 'src/app/shared/table/table.model';
import { HttpReportData, HttpReportTableHeaderCols } from './service/http-report.model';
import { HttpReportService } from './service/http-report.service';
import { HttpReportLoadingState, HttpReportLoadedState, HttpReportLoadingErrorState, DownloadReportLoadingState, DownloadReportLoadingErrorState, DownloadReportLoadedState, } from './service/http-report.state';
import { FilterUtils } from 'primeng/utils';
import { DashboardServiceReqService } from '../service/dashboard-service-req.service';
import { Subscription } from 'rxjs';
import { DdrPipe } from 'src/app/shared/pipes/ddr-pipes/ddr.pipe';
import { SessionService } from 'src/app/core/session/session.service';
import { BreadcrumbService } from 'src/app/core/breadcrumb/breadcrumb.service';

@Component({
  selector: 'app-http-report',
  templateUrl: './http-report.component.html',
  styleUrls: ['./http-report.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HttpReportComponent implements OnInit {

  data: HttpReportData;
  error: AppError;
  loading: boolean;
  empty: boolean;
  emptyTable: boolean;
  downloadOptions: MenuItem[];
  httpUrl:any;
  reportID: any;
  downloadOptionReqHeader: MenuItem[];
  downloadOptionRespHeader: MenuItem[];
  downloadOptionCustomData: MenuItem[];
  downloadOptionSessionData: MenuItem[];
  downloadOptionConditionData: MenuItem[];
  HttpInfoDownloadOption:boolean=false;
  ReqHeaderDownloadOption:boolean=false;
  RespHeaderDownloadOption:boolean=false;
  CustomDataDownloadOption:boolean=false;
  SessionDataDownloadOption:boolean=false;
  ConditionDataDownloadOption:boolean=false;

  cols: HttpReportTableHeaderCols[];
  _selectedColumns: HttpReportTableHeaderCols[];

  isEnabledColumnFilter: boolean = false;
  filterTitle: string = 'Enable Filters';
  tooltipzindex = 100000;

  finalValue: any;

  isCheckbox: boolean;
  httpReportData = [];
  httpReportTemp = [];

  subscribeHttpReport:Subscription;
  breadcrumb: BreadcrumbService;

  constructor(private httpReportService: HttpReportService,
    private dashboardServiceReqService: DashboardServiceReqService,
    private f_ddr:DdrPipe,
    private sessionService: SessionService,
    breadcrumb: BreadcrumbService) { this.breadcrumb = breadcrumb;}

  ngOnInit() {
    const me = this;
    me.loadHttp();
    this.httpUrl = "URL= "+ this.httpReportService.RowData.url;

    this.subscribeHttpReport = this.dashboardServiceReqService.splitViewObservable$.subscribe((temp) => {
      me.breadcrumb['items'][me.breadcrumb['items'].length - 1].label = me.sessionService.getSetting("fpRowdata").flowpathInstance; //getting selected flowpath istance in breadcrumb
      me.loadHttp();
  });

    me.downloadOptions = [
      {
        label: 'WORD',
        command: () => {
          const me = this;
          this.CheckDownoadOption("downloadOptions");
          me.downloadShowDescReports("worddoc");
        }
      },
      {
        label: 'EXCEL',
        command: () => {
          const me = this;
          this.CheckDownoadOption("downloadOptions");
          me.downloadShowDescReports("excel");
        }
      },
      {
        label: 'PDF',
        command: () => {
          const me = this;
          this.CheckDownoadOption("downloadOptions");
          me.downloadShowDescReports("pdf");
        }
      }
    ]
    me.downloadOptionReqHeader = [
      {
        label: 'WORD',
        command: () => {
          const me = this;
          this.CheckDownoadOption("downloadOptionReqHeader");
          me.downloadShowDescReports("worddoc");
        }
      },
      {
        label: 'EXCEL',
        command: () => {
          const me = this;
          this.CheckDownoadOption("downloadOptionReqHeader");
          me.downloadShowDescReports("excel");
        }
      },
      {
        label: 'PDF',
        command: () => {
          const me = this;
          this.CheckDownoadOption("downloadOptionReqHeader");
          me.downloadShowDescReports("pdf");
        }
      }
    ]
    me.downloadOptionRespHeader = [
      {
        label: 'WORD',
        command: () => {
          const me = this;
          this.CheckDownoadOption("downloadOptionRespHeader");
          me.downloadShowDescReports("worddoc");
        }
      },
      {
        label: 'EXCEL',
        command: () => {
          const me = this;
          this.CheckDownoadOption("downloadOptionRespHeader");
          me.downloadShowDescReports("excel");
        }
      },
      {
        label: 'PDF',
        command: () => {
          const me = this;
          this.CheckDownoadOption("downloadOptionRespHeader");
          me.downloadShowDescReports("pdf");
        }
      }
    ]
    me.downloadOptionCustomData = [
      {
        label: 'WORD',
        command: () => {
          const me = this;
          this.CheckDownoadOption("downloadOptionCustomData");
          me.downloadShowDescReports("worddoc");
        }
      },
      {
        label: 'EXCEL',
        command: () => {
          const me = this;
          this.CheckDownoadOption("downloadOptionCustomData");
          me.downloadShowDescReports("excel");
        }
      },
      {
        label: 'PDF',
        command: () => {
          const me = this;
          this.CheckDownoadOption("downloadOptionCustomData");
          me.downloadShowDescReports("pdf");
        }
      }
    ]
    me.downloadOptionSessionData = [
      {
        label: 'WORD',
        command: () => {
          const me = this;
          this.CheckDownoadOption("downloadOptionSessionData");
          me.downloadShowDescReports("worddoc");
        }
      },
      {
        label: 'EXCEL',
        command: () => {
          const me = this;
          this.CheckDownoadOption("downloadOptionSessionData");
          me.downloadShowDescReports("excel");
        }
      },
      {
        label: 'PDF',
        command: () => {
          const me = this;
          this.CheckDownoadOption("downloadOptionSessionData");
          me.downloadShowDescReports("pdf");
        }
      }
    ]
    me.downloadOptionConditionData = [
      {
        label: 'WORD',
        command: () => {
          const me = this;
          this.CheckDownoadOption("downloadOptionConditionData");
          me.downloadShowDescReports("worddoc");
        }
      },
      {
        label: 'EXCEL',
        command: () => {
          const me = this;
          this.CheckDownoadOption("downloadOptionConditionData");
          me.downloadShowDescReports("excel");
        }
      },
      {
        label: 'PDF',
        command: () => {
          const me = this;
          this.CheckDownoadOption("downloadOptionConditionData");
          me.downloadShowDescReports("pdf");
        }
      }
    ]
  }

  loadHttp() {
    const me = this;
    me.reportID= me.sessionService.getSetting("reportID");
    if(me.reportID =="ATF"){
      me.httpReportService.loadFromTrxFlowmap().subscribe(
        (state: Store.State) => {
       if (state instanceof HttpReportLoadingState) {
         me.onLoading(state);
         return;
       }
       if (state instanceof HttpReportLoadedState) {
         me.onLoaded(state);
         me.sessionService.setSetting("reportID", "FP");
         return;
       }
     },
     (state: HttpReportLoadingErrorState) => {
       me.onLoadingError(state);
     }
   );
    }else{
        me.httpReportService.load().subscribe(
         (state: Store.State) => {
        if (state instanceof HttpReportLoadingState) {
          me.onLoading(state);
          return;
        }
        if (state instanceof HttpReportLoadedState) {
          me.onLoaded(state);
          return;
        }
      },
      (state: HttpReportLoadingErrorState) => {
        me.onLoadingError(state);
      }
    );
    }
  }

  private onLoading(state: HttpReportLoadingState) {
    const me = this;
    me.error = null;
    me.loading = true;
  }

  private onLoadingError(state: HttpReportLoadingErrorState) {
    const me = this;
    me.data = null;
    me.error = state.error;
    me.loading = false;
  }

  private onLoaded(state: HttpReportLoadedState) {
    const me = this;
    me.data = state.data;
    me.error = null;
    me.loading = false;
    if (me.data.panels.length === 0) {
      me.empty = true;
    }

    // need to check
    // if (me.data.panels) {
    //   me.empty = false;
    //   if(!me.data.panels[0].daata || me.data.panels[0].daata == null ||  me.data.panels[0].data.length == 0){
    //     me.emptyTable = true;
    //   }
    // } else {
    //   me.empty = true;
    // }


    for (const c of me.data.panels[0].headers[0].cols) {
      if (c.selected) {
        me.cols.push(c);
      }
    }
    me.cols = me.data.panels[0].headers[0].cols;
    me._selectedColumns = me.cols;
  }

  loadPagination(event: LazyLoadEvent, index) {
    this.loading = true;
    setTimeout(() => {
      if (this.data.panels[index].data) {
        this.httpReportTemp = this.data.panels[index].data.filter(row => this.filterField(row, event.filters));

        for (let i = 0; i <= this.httpReportData.length; i++) {
          if (index == i) {
            this.httpReportData[index] = this.httpReportTemp.slice(event.first, (event.first + event.rows));

          }
        }
        this.loading = false;
      }
    }, 1000);
  }

  filterField(row, filter) {
    let isInFilter = false;
    let noFilter = true;
    for (var columnName in filter) {
      if (row[columnName] == null) {
        return;
      }
      noFilter = false;
      let rowValue: String = row[columnName].toString().toLowerCase();
      let filterMatchMode: String = filter[columnName].matchMode;
      if (filterMatchMode.includes("contain") && rowValue.includes(filter[columnName].value.toLowerCase())) {
        isInFilter = true;
      } else if (filterMatchMode.includes("custom") && rowValue.includes(filter[columnName].value)) {
        isInFilter = true;
      }
    }
    if (noFilter) { isInFilter = true; }
    return isInFilter;
  }

  filter() {
    const me = this;
    FilterUtils['custom'] = (value, filter): boolean => {
      if (filter === undefined || filter === null || filter.trim() === '') {
        return true;
      }

      if (value === undefined || value === null) {
        return false;
      } else {
        let operator1 = filter.slice(0, 2);
        let operator2 = filter.slice(0, 1);

        // Filter if value >= ,<=, =
        if (
          operator1.length === 2 &&
          (operator1 === '>=' || operator1 === '<=' || operator1 === '==')
        ) {
          if (operator1 === '>=') {
            me.finalValue =
              value >= parseFloat(filter.slice(2, filter.length)).toFixed(3);
          } else if (operator1 === '<=') {
            me.finalValue =
              value <= parseFloat(filter.slice(2, filter.length)).toFixed(3);
          } else if (operator1 === '==') {
            me.finalValue =
              value == parseFloat(filter.slice(2, filter.length)).toFixed(3);
          }
        } else if (
          operator2.length === 1 &&
          (operator2 === '>' || operator2 === '<' || operator2 === '=')
        ) {
          if (operator2 === '>') {
            me.finalValue =
              value > parseFloat(filter.slice(1, filter.length)).toFixed(3);
          } else if (operator2 === '<') {
            me.finalValue =
              value < parseFloat(filter.slice(1, filter.length)).toFixed(3);
          } else if (operator2 === '=') {
            me.finalValue =
              parseFloat(filter.slice(1, filter.length)).toFixed(3) == value;
          }
        } else if (filter !== '' && filter.indexOf('-') >= 1) {
          const stIndex = filter.substr(0, filter.indexOf('-'));
          const enIndex = filter.substr(filter.indexOf('-') + 1, filter.length);

          if (
            parseFloat(stIndex) <= parseFloat(enIndex) &&
            enIndex.indexOf('-') == -1
          ) {
            if (
              parseFloat(stIndex) <= parseFloat(value) &&
              parseFloat(enIndex) >= parseFloat(value)
            ) {
              me.finalValue = true;
            } else {
              me.finalValue = false;
            }
          } else if (
            parseFloat(stIndex) >= parseFloat(enIndex) &&
            enIndex.indexOf('-') == -1
          ) {
            if (
              parseInt(stIndex, 0) >= parseInt(value, 0) &&
              parseInt(enIndex, 0) <= parseInt(value, 0)
            ) {
              me.finalValue = true;
            } else {
              me.finalValue = false;
            }
          } else {
            me.finalValue = false;
          }
        } else {
          me.finalValue = value >= parseFloat(filter).toFixed(3);
        }
      }
      return me.finalValue;
    };
  }

  @Input() get selectedColumns(): HttpReportTableHeaderCols[] {
    const me = this;
    return me._selectedColumns;
  }

  set selectedColumns(val: HttpReportTableHeaderCols[]) {
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
    let tableData = me.data.panels;
    let header = [];
    let rowData:any []=[];
    let title="";

    if(this.HttpInfoDownloadOption === true){
      title="Http Report(HttpInformation)";
      if(tableData[0].data.length === 0){
        header.push("S No.");
        header.push("Http Infromation");
        let rData:string []=[];
        let number=1;
        rData.push(number.toString());
        rData.push("No config found");
        rowData.push(rData);
      }else{
          header.push("S No.");
        for (const c of tableData[0].headers[0].cols)
          header.push(c.label);
        for(let i =0;i<tableData[0].data.length;i++)
        {
          let rData:string []=[];
          let number;
          number=i+1;
          rData.push(number.toString());
          rData.push(tableData[0].data[i].TierName);
          rData.push(tableData[0].data[i].ServerName);
          rData.push(tableData[0].data[i].AppName);
          rData.push(tableData[0].data[i].StatusCode);
          rowData.push(rData);
      }
    }
  }

 if(this.ReqHeaderDownloadOption === true){
    title="Http Report(ReqHeaders)";
    if(tableData[1].data.length === 0){
      header.push("S No.");
      header.push("Request Headers");
      let rData:string []=[];
      let number=1;
      rData.push(number.toString());
      rData.push("No config found");
      rowData.push(rData);
    }else{
        header.push("S No.");
        for (const c of tableData[1].headers[0].cols)
          header.push(c.label);
        for(let i =0;i<tableData[1].data.length;i++)
        {
          let rData:string []=[];
          let number;
          number=i+1;
          rData.push(number.toString());
          rData.push(tableData[1].data[i].key);
          //rData.push(tableData[1].data[i].value);
          let value = decodeURIComponent(tableData[1].data[i].value).replace(/\+/g, ' ');
          rData.push(value);
          rowData.push(rData);
    }
  }
}

if(this.RespHeaderDownloadOption === true){
  title="Http Report(RespHeaders)";
  if(tableData[2].data.length === 0){
    header.push("S No.");
    header.push("Response Headers");
    let rData:string []=[];
    let number=1;
    rData.push(number.toString());
    rData.push("No config found");
    rowData.push(rData);
  }else{
       header.push("S No.");
     for (const c of tableData[2].headers[0].cols)
       header.push(c.label);
     for(let i =0;i<tableData[2].data.length;i++)
     {
      let rData:string []=[];
      let number;
       number=i+1;
       rData.push(number.toString());
       rData.push(tableData[2].data[i].key);
       //rData.push(tableData[2].data[i].value);
       let value = decodeURIComponent(tableData[2].data[i].value).replace(/\+/g, ' ');
       rData.push(value);
       rowData.push(rData);
  }
}
}

if(this.CustomDataDownloadOption === true){
  title="Http Report(CustomData)";
  if(tableData[3].data.length === 0){
    header.push("S. No")
    header.push("Custom Data");
    let rData:string []=[];
    let number=1;
    rData.push(number.toString());
    rData.push("No config found")
    rowData.push(rData);
  }else{
      for (const c of tableData[3].headers[0].cols)
       header.push(c.label);
      for(let i =0;i<tableData[3].data.length;i++)
      {
       let rData:string []=[];
       let number;
       number=i+1;
       rData.push(number.toString());
       rData.push(tableData[3].data[i].key);
       //rData.push(tableData[3].data[i].value);
       let value = decodeURIComponent(tableData[3].data[i].value).replace(/\+/g, ' ');
       rData.push(value);
       rowData.push(rData);
  }
}
}

if(this.SessionDataDownloadOption === true){
  title="Http Report(SessionData)";

  if(tableData[4].data.length === 0){
    header.push("S. No");
    header.push("Session Data");
    let rData:string []=[];
    let number=1;
    rData.push(number.toString());
    rData.push("No config found");
    rowData.push(rData);
  }else{
       header.push("S. No");
     for (const c of tableData[4].headers[0].cols)
       header.push(c.label);
     for(let i =0;i<tableData[4].data.length;i++)
     {
       let rData:string []=[];
       let number;
       number=i+1;
       rData.push(number.toString());
       rData.push(tableData[4].data[i].key);
       //rData.push(tableData[4].data[i].value);
       let value = decodeURIComponent(tableData[4].data[i].value).replace(/\+/g, ' ');
       rData.push(value);
       rowData.push(rData);
  }
}
}

if(this.ConditionDataDownloadOption === true){
  title="Http Report(ConditionData)";


  if(tableData[5].data.length === 0){
    header.push("S No.");
    header.push("Session Data");
    let rData:string []=[];
    let number=1;
    rData.push(number.toString());
    rData.push("No config found");
    rowData.push(rData);
  }else{
      header.push("S No.");
     for (const c of tableData[5].headers[0].cols)
      header.push(c.label);
     for(let i =0;i<tableData[5].data.length;i++)
     {
      let rData:string []=[];
      let number;
      number = i+1;
      rData.push(number.toString());
      rData.push(tableData[5].data[i].key);
      //rData.push(tableData[5].data[i].value);
      let value = decodeURIComponent(tableData[5].data[i].value).replace(/\+/g, ' ');
       rData.push(value);
      rowData.push(rData);
    }
}
}

    try {
      me.httpReportService.downloadShowDescReports(label, rowData, header, title).subscribe(
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
      console.log("Exception in downloadShowDescReports method in Http report component :", err);
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
    let path = state.data.comment.trim();
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
  CheckDownoadOption(option){
    let optionValue = option;
    if(optionValue === "downloadOptions"){
      this.HttpInfoDownloadOption = true;
      this.ReqHeaderDownloadOption = false;
      this.RespHeaderDownloadOption = false;
      this.CustomDataDownloadOption = false;
      this.SessionDataDownloadOption = false;
      this.ConditionDataDownloadOption = false;
    }
    if(optionValue === "downloadOptionReqHeader"){
      this.HttpInfoDownloadOption = false;
      this.ReqHeaderDownloadOption = true;
      this.RespHeaderDownloadOption = false;
      this.CustomDataDownloadOption = false;
      this.SessionDataDownloadOption = false;
      this.ConditionDataDownloadOption = false;
    }
    if(optionValue === "downloadOptionRespHeader"){
      this.HttpInfoDownloadOption = false;
      this.ReqHeaderDownloadOption = false;
      this.RespHeaderDownloadOption = true;
      this.CustomDataDownloadOption = false;
      this.SessionDataDownloadOption = false;
      this.ConditionDataDownloadOption = false;
    }
    if(optionValue === "downloadOptionCustomData"){
      this.HttpInfoDownloadOption = false;
      this.ReqHeaderDownloadOption = false;
      this.RespHeaderDownloadOption = false;
      this.CustomDataDownloadOption = true;
      this.SessionDataDownloadOption = false;
      this.ConditionDataDownloadOption = false;
    }
    if(optionValue === "downloadOptionSessionData"){
      this.HttpInfoDownloadOption = false;
      this.ReqHeaderDownloadOption = false;
      this.RespHeaderDownloadOption = false;
      this.CustomDataDownloadOption = false;
      this.SessionDataDownloadOption = true;
      this.ConditionDataDownloadOption = false;
    }
    if(optionValue === "downloadOptionConditionData"){
      this.HttpInfoDownloadOption = false;
      this.ReqHeaderDownloadOption = false;
      this.RespHeaderDownloadOption = false;
      this.CustomDataDownloadOption = false;
      this.SessionDataDownloadOption = false;
      this.ConditionDataDownloadOption = true;
    }
  }

  ngOnDestroy() {
    this.subscribeHttpReport.unsubscribe();
  }

}
