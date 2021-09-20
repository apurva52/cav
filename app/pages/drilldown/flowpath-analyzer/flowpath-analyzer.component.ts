import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef} from '@angular/core';
import { LazyLoadEvent, MenuItem } from 'primeng';
import { AppError } from 'src/app/core/error/error.model';
import { Store } from 'src/app/core/store/store';
import { TableHeaderColumn } from 'src/app/shared/table/table.model';
import { FlowpathAnalyzerData } from './service/flowpath-analyzer.model';
import { FlowpathAnalyzerService } from './service/flowpath-analyzer.service';
import { FlowpathAnalyzerLoadedState, FlowpathAnalyzerLoadingErrorState, FlowpathAnalyzerLoadingState, DownloadReportLoadingState, DownloadReportLoadedState, DownloadReportLoadingErrorState } from './service/flowpath-analyzer.state';
import { DdrPipe } from 'src/app/shared/pipes/ddr-pipes/ddr.pipe';
import { DatePipe } from '@angular/common'
import { ActivatedRoute, Router } from '@angular/router';
import { SessionService } from 'src/app/core/session/session.service';
import { BreadcrumbService } from 'src/app/core/breadcrumb/breadcrumb.service';

@Component({
  selector: 'app-flowpath-analyzer',
  templateUrl: './flowpath-analyzer.component.html',
  styleUrls: ['./flowpath-analyzer.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FlowpathAnalyzerComponent implements OnInit {
  data: FlowpathAnalyzerData;
  error: AppError;
  loading: boolean;
  empty: boolean;
  fpAvgTime:any;
  fpTotalCount:any;
  isShowSearch: boolean;
  cols: TableHeaderColumn[] = [];
  _selectedColumns: TableHeaderColumn[] = [];

  downloadOptionFlowSign: MenuItem[];
  downloadOptionPatternSum:MenuItem[];
  downloadOptionTopMethods:MenuItem[];
  FlowSignDownloadOption:boolean=false;
  PtSummaryDownloadOption:boolean=false;
  TopMethodsDownloadOption:boolean=false;
  // breadcrumb: MenuItem[];
  selectedFilterr:any;

  flowpathData = [];
  totalRecords = 0;
  stateID: string;

  isEnabledColumnFilter: boolean = false;
  filterTitle: string = 'Enable Filters';
  paginatorTitle: string = 'Show Pagination';

  @ViewChild("FPAnalyzer") flowpathAnalyzer: ElementRef;
  globalFilterFields: string[] = [];

  @ViewChild('searchInput', { read: ElementRef, static: false })
  searchInput: ElementRef;

  constructor(private flowpathAnalyzerService: FlowpathAnalyzerService,  private router: Router, 
    private route: ActivatedRoute, private sessionService: SessionService, private f_ddr:DdrPipe, 
    public datepipe: DatePipe, public breadcrumb: BreadcrumbService)
    { 
      this.route.queryParams.subscribe((params) => {
       this.stateID = params['state'];
      });
    }

  ngOnInit(): void {
    const me =this;
    this.breadcrumb.removeAll();
    this.breadcrumb.addNewBreadcrumb({label: 'Home', routerLink: '/home'} as MenuItem);
    me.breadcrumb.add({label: 'Flowpath Analyzer', routerLink: '/flowpath-analyzer',  queryParams: { state: this.stateID}});
    me.load();
    // me.breadcrumb = [
    //   { label: 'Home', routerLink: '/home/dashboard' },
    //   {label: 'Flowpath Analyzer'}
    // ]

    me.downloadOptionFlowSign = [
      {
        label : 'WORD', command:()=>{const me = this; this.CheckDownoadOption("downloadOptionFlowSign"); me.downloadShowDescReports("worddoc");}
      },
      {
        label : 'EXCEL', command:()=>{const me = this; this.CheckDownoadOption("downloadOptionFlowSign"); me.downloadShowDescReports("excel");}
      },
      {
        label : 'PDF', command:()=>{const me = this; this.CheckDownoadOption("downloadOptionFlowSign"); me.downloadShowDescReports("pdf");}
      }
    ]
    me.downloadOptionPatternSum = [
      {
        label : 'WORD', command:()=>{const me = this; this.CheckDownoadOption("downloadOptionPatternSum"); me.downloadShowDescReports("worddoc");}
      },
      {
        label : 'EXCEL', command:()=>{const me = this; this.CheckDownoadOption("downloadOptionPatternSum"); me.downloadShowDescReports("excel");}
      },
      {
        label : 'PDF', command:()=>{const me = this; this.CheckDownoadOption("downloadOptionPatternSum"); me.downloadShowDescReports("pdf");}
      }
    ]
    me.downloadOptionTopMethods = [
      {
        label : 'WORD', command:()=>{const me = this; this.CheckDownoadOption("downloadOptionTopMethods"); me.downloadShowDescReports("worddoc");}
      },
      {
        label : 'EXCEL', command:()=>{const me = this; this.CheckDownoadOption("downloadOptionTopMethods"); me.downloadShowDescReports("excel");}
      },
      {
        label : 'PDF', command:()=>{const me = this; this.CheckDownoadOption("downloadOptionTopMethods"); me.downloadShowDescReports("pdf");}
      }
    ]
  };
  sortField(rowA, rowB, field: string): number {
    if (rowA[field] == null) return 1;

    if (field === 'fpCount' || field === 'avg' || field === 'max' || field === 'min' || field === 'fpAvgTime' || field === 'time') {
      if (Number(rowA[field]) > Number(rowB[field])) return 1;
      else return -1;
    }
    else if (field === 'percentageFp' || field === 'countPerFlowpath' || field === 'dbCallouts' || field === 'numberMethods' || field === 'overallTime' || field === 'overallCount' || field.includes('pTime') || field.includes('pCount')) {
      if (parseFloat(rowA[field]) > parseFloat(rowB[field])) return 1;
      else return -1;
    }
    else {
      return rowA[field].localeCompare(rowB[field]);
    }
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

  load(numPatterns?: string) {
    const me = this;
    me.flowpathAnalyzerService.load(numPatterns).subscribe(
      (state: Store.State) => {
        if (state instanceof FlowpathAnalyzerLoadingState) {
          me.onLoading(state);
          return;
        }
        if (state instanceof FlowpathAnalyzerLoadedState) {
          me.onLoaded(state);
          return;
        }
      },
      (state: FlowpathAnalyzerLoadingErrorState) => {
        me.onLoadingError(state);
      }
    );
  }

  private onLoading(state: FlowpathAnalyzerLoadingState) {
    const me = this;
    me.error = null;
    me.loading = true;
  }

  private onLoadingError(state: FlowpathAnalyzerLoadingErrorState) {
    const me = this;
    me.data = null;
    me.error = state.error;
    me.loading = false;
  }

  /**
  * To apply custom number of pattern
  */
  applyPattern(numOfPatterns) {
    if (numOfPatterns) {
      this.load(`${numOfPatterns}`);
    }
  }

  openFpReport (columnName, rowdata ){
    //console.log("rowdata comess---", rowdata);
    const me = this;
    //condition to set flowpath id's from signature & pattern summary table.
    const flowpathIDs = (rowdata.fpinstances || rowdata.fpIds)?.toString();
    //console.log("fpIDs---", flowpathIDs);
    /*setting reportID for Flowpath Analzer in session service */
    me.sessionService.setSetting("reportID", "FPA");
    me.sessionService.setSetting("fpIDs", flowpathIDs);
    this.router.navigate(['/drilldown/flow-path'], { queryParams: {state: me.stateID}});
  }

  private onLoaded(state: FlowpathAnalyzerLoadedState) {
    const me = this;
    me.data = state.data;
    me.fpAvgTime = Number(this.data.panels[2].avgData[0].fpAvgTime).toLocaleString();
    console.log("fpAvgTime*********",me.fpAvgTime);
    me.fpTotalCount = Number(this.data.panels[2].avgData[0].fpCount).toLocaleString();
    console.log("fpCount*********",me.fpTotalCount);
    me.error = null;
    me.loading = false;
    var date= new Date(me.flowpathAnalyzerService.startTime);
    var strTime = this.datepipe.transform(date, 'dd/MM/yy HH:MM:SS');
    var date1 = new Date(me.flowpathAnalyzerService.endTime);
    var edTime = this.datepipe.transform(date1, 'dd/MM/yy HH:MM:SS');
    console.log("starttime= " +strTime+ "endTime= " +edTime);
    this.selectedFilterr = "Tier=" + me.flowpathAnalyzerService.tierName + ", Server=" + me.flowpathAnalyzerService.serverName + 
    ", Instance=" + me.flowpathAnalyzerService.instanceName +  ", StartTime=" + strTime + ", EndTime=" + edTime + ", BT=" + me.flowpathAnalyzerService.btTransaction ;
    me.flowpathAnalyzerService.filterCriteriaVal = this.selectedFilterr;
    if(me.data.panels.length === 0){
      me.empty = true;
    }
    for (const c of me.data.panels[3].headers[1].cols) {
      me.globalFilterFields.push(c.valueField);
    }
  }
  loadPagination(event: LazyLoadEvent, index) {
    this.loading = true;
    setTimeout(() => {
      if (this.data.panels[index].data) {
        for (let i = 0; i <= this.flowpathData.length; i++) {
          if (index == i) {
            this.flowpathData[index] = this.data.panels[index].data.slice(event.first, (event.first + event.rows));
          }
        }
        this.flowpathData[index].sort(
          (a, b) => this.sortField(a, b, event.sortField) * event.sortOrder
        );

        this.loading = false;
      }
    }, 1000);
  }
  downloadShowDescReports(label) {
    const me = this;
    let tableData = me.data.panels;
    let header = [];
    let rowData:any []=[];
    let title="";

    if(this.FlowSignDownloadOption === true){
      title="FlowPath Analyzer Report(FlowSignature)";
      header.push("S No.");
      for (const c of tableData[1].headers[0].cols)
      header.push(c.label);
      for(let i =0;i<tableData[1].data.length;i++)
      {
      let rData:string []=[];
      let number;
      number=i+1;
      rData.push(number.toString());
      rData.push(tableData[1].data[i].signature);
      rData.push(tableData[1].data[i].fpCount);
      rData.push(tableData[1].data[i].avg);
      rData.push(tableData[1].data[i].max);
      rData.push(tableData[1].data[i].min);
      rowData.push(rData);
    }
  }

  if(this.PtSummaryDownloadOption === true){
    title="FlowPath Analyzer Report(PatternSummary)";
    header.push("S No.");
    for (const c of tableData[2].headers[0].cols)
    header.push(c.label);
    for(let i =0;i<tableData[2].data.length;i++)
    {
    let rData:string []=[];
    let number;
    number=i+1;
    rData.push(number.toString());
    rData.push(tableData[2].data[i].pattern);
    rData.push(tableData[2].data[i].fpAvgTime);
    rData.push(tableData[2].data[i].fpCount);
    rData.push(tableData[2].data[i].percentageFp);
    rData.push(tableData[2].data[i].topContributor);
    rData.push(tableData[2].data[i].time);
    rData.push(tableData[2].data[i].countPerFlowpath);
    rData.push(tableData[2].data[i].dbCallouts);
    rData.push(tableData[2].data[i].numberMethods);
    rowData.push(rData);
  }
}

if(this.TopMethodsDownloadOption === true){
  title="FlowPath Analyzer Report(TopMethods)";
  header.push("S No.");
  for (const c of tableData[3].headers[1].cols)
  header.push(c.label);
  for(let i =0;i<tableData[3].data.length;i++)
  {
  let rData:string []=[];
  let number;
  number=i+1;
  rData.push(number.toString());
  rData.push(tableData[3].data[i].packageName);
  rData.push(tableData[3].data[i].methodName);
  rData.push(tableData[3].data[i].overallTime);
  rData.push(tableData[3].data[i].overallCount);
  rData.push(tableData[3].data[i].pTime0);
  rData.push(tableData[3].data[i].pCount0);
  rData.push(tableData[3].data[i].pTime1);
  rData.push(tableData[3].data[i].pCount1);
  rData.push(tableData[3].data[i].pTime2);
  rData.push(tableData[3].data[i].pCount2);
  rData.push(tableData[3].data[i].pTime3);
  rData.push(tableData[3].data[i].pCount3);
  rData.push(tableData[3].data[i].pTime4);
  rData.push(tableData[3].data[i].pCount4);
  rowData.push(rData);
}
}

    try {
      me.flowpathAnalyzerService.downloadShowDescReports(label, rowData, header, title).subscribe(
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
      console.log("Exception in downloadShowDescReports method in Flowpath Analyzer report component :", err);
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
    if(optionValue === "downloadOptionFlowSign"){
      this.FlowSignDownloadOption = true;
      this.PtSummaryDownloadOption = false;
      this.TopMethodsDownloadOption = false;
    }
    if(optionValue === "downloadOptionPatternSum"){
      this.FlowSignDownloadOption = false;
      this.PtSummaryDownloadOption = true;
      this.TopMethodsDownloadOption = false;
    }
    if(optionValue === "downloadOptionTopMethods"){
      this.FlowSignDownloadOption = false;
      this.PtSummaryDownloadOption = false;
      this.TopMethodsDownloadOption = true;
    }
  }
}
