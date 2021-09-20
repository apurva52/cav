import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuItem } from 'primeng';
import { REVENUE_ANALYTICS_TABLE_DATA } from '../../revenue-analytics/service/revenue-analytics.dummy';
import { REPORT_TIME_TABLE_DATA } from './service/time-report.dummy';
import { ReportTimeTable } from './service/time-report.model';
import { OVERALL_REPORT_TABLE_DATA } from '../overall-report/service/overall-report.dummy';
import { overallReportTable } from '../overall-report/service/overall-report.model';
import { FormReportService } from '../overall-report/service/overall-report.service';
import { Store } from 'src/app/core/store/store';
import { AppError } from 'src/app/core/error/error.model';
import { OverAllReportLoadingState, OverAllReportLoadingErrorState, OverAllReportLoadedState } from '../overall-report/service/overall-report.state';

@Component({
  selector: 'app-time-report',
  templateUrl: './time-report.component.html',
  styleUrls: ['./time-report.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TimeReportComponent implements OnInit {
  data: ReportTimeTable;
  datacommon: overallReportTable;
  breadcrumb: MenuItem[];
  responsiveOptions;
  reportformdata: any;
  totalUniqueFormSubmitt = 0.00;
  formfieldnametime: any;
  error: AppError;
  loading: boolean;
  empty: boolean;
  formnameforreport: any;//for form name
  constructor(private FormReportService: FormReportService) { }

  ngOnInit(): void {
    console.log("Time ngonInt");
    const me = this;
    me.data = REPORT_TIME_TABLE_DATA;
    me.datacommon = OVERALL_REPORT_TABLE_DATA;
    console.log('me.datacommon : ', me.datacommon);
    //this.reportformdata = me.datacommon.data;
  }

  breakWord(word) {
    let wrapped = "";
    while (word.length > 35) {
      wrapped = word.substr(0, 34) + " ";
      word = word.substr(34, word.length);
    }
    return wrapped + word;
  }

}