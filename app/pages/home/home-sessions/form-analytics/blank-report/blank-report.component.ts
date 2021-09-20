import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuItem } from 'primeng';
import { REVENUE_ANALYTICS_TABLE_DATA } from '../../revenue-analytics/service/revenue-analytics.dummy';
import { REPORT_TIME_TABLE_DATA } from './service/blank-report.dummy';
import { ReportTimeTable } from './service/blank-report.model';
import { OVERALL_REPORT_TABLE_DATA } from '../overall-report/service/overall-report.dummy';
import { overallReportTable } from '../overall-report/service/overall-report.model';
import { FormReportService } from '../overall-report/service/overall-report.service';
import { Store } from 'src/app/core/store/store';
import { AppError } from 'src/app/core/error/error.model';
import { OverAllReportLoadingState, OverAllReportLoadingErrorState, OverAllReportLoadedState } from '../overall-report/service/overall-report.state';

@Component({
  selector: 'app-blank-report',
  templateUrl: './blank-report.component.html',
  styleUrls: ['./blank-report.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class BlankReportComponent implements OnInit {
  datacommon: overallReportTable;
  reportformdata: any;
  totalUniqueFormSubmitt = 0.00;
  formfieldnameblank: any;
  error: AppError;
  loading: boolean;
  empty: boolean;
  data: ReportTimeTable;
  breadcrumb: MenuItem[];
  responsiveOptions;

  constructor(private FormReportService: FormReportService) { }

  ngOnInit(): void {
    const me = this;

    me.data = REPORT_TIME_TABLE_DATA;
    me.datacommon = OVERALL_REPORT_TABLE_DATA;
    console.log('me.datacommon : ', me.datacommon);

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