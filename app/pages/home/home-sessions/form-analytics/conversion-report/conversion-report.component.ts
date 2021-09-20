import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuItem } from 'primeng';
import { CONVERSION_REPORT_TABLE_DATA } from './service/conversion-report.dummy';
import { conversionReportTable, FunnelData } from './service/conversion-report.model';
import { OVERALL_REPORT_TABLE_DATA } from '../overall-report/service/overall-report.dummy';
import { overallReportTable } from '../overall-report/service/overall-report.model';
import { FormReportService } from '../overall-report/service/overall-report.service';
import { Store } from 'src/app/core/store/store';
import { AppError } from 'src/app/core/error/error.model';
import { OverAllReportLoadingState, OverAllReportLoadingErrorState, OverAllReportLoadedState } from '../overall-report/service/overall-report.state';


@Component({
  selector: 'app-conversion-report',
  templateUrl: './conversion-report.component.html',
  styleUrls: ['./conversion-report.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ConversionReportComponent implements OnInit {
  datacommon: overallReportTable;
  reportformdata: any;
  totalUniqueFormSubmitt = 0.00;
  formfieldnameconversion: any;
  error: AppError;
  loading: boolean;
  empty: boolean;
  data: conversionReportTable;
  breadcrumb: MenuItem[];
  responsiveOptions;
  pages: any[];


  rowWidth: number;


  constructor(private FormReportService: FormReportService) { }

  ngOnInit(): void {
    const me = this;
    console.log("convertion  ngonInt");
    me.data = CONVERSION_REPORT_TABLE_DATA;
    me.datacommon = OVERALL_REPORT_TABLE_DATA;
    console.log('me.datacommon : ', me.datacommon);

  }


  //     funnelCalculate(data: FunnelData[]) {
  //       const me = this;
  //       if (me.data && data) {
  //         const mx_width: number = 100;
  //         let min_width: number;
  //         const no_of_rows = data.length;
  //         min_width = mx_width / no_of_rows;
  //         let x: number = 0;
  //         let y: number = 0;
  //         for (let i = 0; i < no_of_rows; i++) {
  //           me.rowWidth = mx_width - min_width * (i + 1 - 1);
  //           x = 100 - me.rowWidth / 2 - 50;
  //           y = (i + 1 - 1) * 50;
  //           me.pages.push({
  //             width: me.rowWidth,
  //             x: x,
  //             y: y,
  //             pageName: data[i].pageName,
  //             totalEntries: data[i].totalEntries,
  //             entryPage: data[i].entryPage,
  //             exitPage: data[i].exitPage
  //           });
  //         }
  //   }
  //  }
}