import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuItem } from 'primeng';
import { OVERALL_REPORT_TABLE_DATA } from './service/overall-report.dummy';
import { overallReportTable } from './service/overall-report.model';
import { FormReportService } from './service/overall-report.service';
import { Store } from 'src/app/core/store/store';
import { AppError } from 'src/app/core/error/error.model';
import { OverAllReportLoadingState, OverAllReportLoadingErrorState, OverAllReportLoadedState } from './service/overall-report.state';
@Component({
  selector: 'app-overall-report',
  templateUrl: './overall-report.component.html',
  styleUrls: ['./overall-report.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class OverallReportComponent implements OnInit {
  error: AppError;
  loading: boolean;
  empty: boolean;
  data: overallReportTable;
  responsiveOptions;

  formfieldnameoverall: any;
  reportformdata: any;

  formfieldnamerefill: any;
  formfieldnameblank: any;
  formfieldnamedrop: any;
  formfieldnameconversion: any;
  formfieldnamehesitation: any;
  formfieldnametime: any;
  formnameforreport: any;//store form name
  pageviews = 0;
  forminteration = 0;
  successfullsubmit = 0;
  failedsubmit = 0;
  conversionrate = 0.00;
  totalUniqueFormSubmitt = 0.00;

  constructor(private FormReportService: FormReportService) { }

  ngOnInit(): void {
    console.log("overall ngonInt");
    const me = this;
    me.data = OVERALL_REPORT_TABLE_DATA;
    console.log('over all ngonint me.data : ', me.data);
    //this.reportformdata = me.data.data;
    //if (me.data.overallformfiltercriteria != null)
    //  this.applyFilter(me.data.overallformfiltercriteria);
    // this.reportformdata = { "totalPageView": 2, "totalUniqueFormInteraction": 1.0, "totalUniqueFormSubmit": 0.0, "totalFormSubmit": 0.0, "totalUniqueFailedSubmit": 0.0, "avgFillDuration": 0.0, "avgBlankField": 0.0, "avgRefilledField": 0.0, "fillDurationSampleCounts": 0.0, "blankFieldSampleCounts": 60, "refilledFieldSampleCounts": 60, "fields": [{ "name": "filtername", "totalInteraction": 1.0, "totalUniqueInteraction": 1.0, "avgFillDuration": 1.753, "avgHesitationDuration": 0.392, "totalLeftBlank": 0.0, "totalDropFromField": 0.0, "fillDurationSampleCounts": 1, "hesitationDurationSampleCounts": 1 }, { "name": "filterlname", "totalInteraction": 1.0, "totalUniqueInteraction": 1.0, "avgFillDuration": 2.16, "avgHesitationDuration": 0.054, "totalLeftBlank": 0.0, "totalDropFromField": 0.0, "fillDurationSampleCounts": 1, "hesitationDurationSampleCounts": 1 }, { "name": "street", "totalInteraction": 1.0, "totalUniqueInteraction": 1.0, "avgFillDuration": 2.147, "avgHesitationDuration": 0.038, "totalLeftBlank": 0.0, "totalDropFromField": 0.0, "fillDurationSampleCounts": 1, "hesitationDurationSampleCounts": 1 }, { "name": "zip", "totalInteraction": 1.0, "totalUniqueInteraction": 1.0, "avgFillDuration": 1.321, "avgHesitationDuration": 0.007, "totalLeftBlank": 0.0, "totalDropFromField": 0.0, "fillDurationSampleCounts": 1, "hesitationDurationSampleCounts": 1 }, { "name": "tel", "totalInteraction": 1.0, "totalUniqueInteraction": 1.0, "avgFillDuration": 1.314, "avgHesitationDuration": 0.035, "totalLeftBlank": 0.0, "totalDropFromField": 0.0, "fillDurationSampleCounts": 1, "hesitationDurationSampleCounts": 1 }, { "name": "filteremail", "totalInteraction": 1.0, "totalUniqueInteraction": 1.0, "avgFillDuration": 3.549, "avgHesitationDuration": 0.008, "totalLeftBlank": 0.0, "totalDropFromField": 0.0, "fillDurationSampleCounts": 1, "hesitationDurationSampleCounts": 1 }, { "name": "optradio", "totalInteraction": 0.0, "totalUniqueInteraction": 0.0, "avgFillDuration": 0.0, "avgHesitationDuration": 0.0, "totalLeftBlank": 0.0, "totalDropFromField": 0.0, "fillDurationSampleCounts": 0, "hesitationDurationSampleCounts": 0 }, { "name": "fname", "totalInteraction": 1.0, "totalUniqueInteraction": 1.0, "avgFillDuration": 1.309, "avgHesitationDuration": 0.114, "totalLeftBlank": 0.0, "totalDropFromField": 0.0, "fillDurationSampleCounts": 1, "hesitationDurationSampleCounts": 1 }, { "name": "lname", "totalInteraction": 1.0, "totalUniqueInteraction": 1.0, "avgFillDuration": 2.319, "avgHesitationDuration": 0.04, "totalLeftBlank": 0.0, "totalDropFromField": 0.0, "fillDurationSampleCounts": 1, "hesitationDurationSampleCounts": 1 }, { "name": "email", "totalInteraction": 1.0, "totalUniqueInteraction": 1.0, "avgFillDuration": 1.608, "avgHesitationDuration": 0.004, "totalLeftBlank": 0.0, "totalDropFromField": 0.0, "fillDurationSampleCounts": 1, "hesitationDurationSampleCounts": 1 }, { "name": "birthday", "totalInteraction": 1.0, "totalUniqueInteraction": 1.0, "avgFillDuration": 4.279, "avgHesitationDuration": 0.0, "totalLeftBlank": 0.0, "totalDropFromField": 1.0, "fillDurationSampleCounts": 1, "hesitationDurationSampleCounts": 0 }, { "name": "ocbtnfilter", "totalInteraction": 0.0, "totalUniqueInteraction": 0.0, "avgFillDuration": 0.0, "avgHesitationDuration": 0.0, "totalLeftBlank": 0.0, "totalDropFromField": 0.0, "fillDurationSampleCounts": 0, "hesitationDurationSampleCounts": 0 }] };
    // me.data.data = this.reportformdata;
    // console.log('me.data.data 2 : ', me.data.data);
    // //if (this.reportformdata != null)
    // // $(".rigntContent:first").show();
    // this.pageviews = this.reportformdata.totalPageView;
    // this.forminteration = this.reportformdata.totalUniqueFormInteraction;
    // this.successfullsubmit = this.reportformdata.totalUniqueFormSubmit - this.reportformdata.totalUniqueFailedSubmit;
    // this.failedsubmit = this.reportformdata.totalUniqueFailedSubmit;
    // this.conversionrate = (((this.reportformdata.totalUniqueFormSubmit - this.reportformdata.totalUniqueFailedSubmit) / this.reportformdata.totalPageView) * 100);
    // this.totalUniqueFormSubmitt = this.reportformdata.totalUniqueFormSubmit;
    // this.getOverallReport();
    // this.drowcanvas();

  }


  getOverallReport() {
    this.formfieldnameoverall = this.reportformdata.fields;
  }

  drowcanvas() {
    let data = this.calculateData();
    const canvas = <HTMLCanvasElement>document.getElementById('myCanvas');
    let ctx = canvas.getContext('2d');
    ctx.canvas.width = $('#' + 'tabela1').width();
    ctx.canvas.height = $('#' + 'tabela1').height();
    // getting width for columns
    let columnWidth = $('#' + 'tabela1' + ' td').outerWidth();
    let columns = $('#' + 'tabela1' + ' .trfirst td').length;
    let trfirstHeight = $('.trfirst').outerHeight();
    let trsecondHeight = $('.trsecond').outerHeight();
    let THeight = $('#tabela1').outerHeight();
    //begins funnel
    ctx.beginPath();
    //moves the path to the specified point
    ctx.moveTo(0, (((1 - (data[0] / 100)) * trsecondHeight) + trfirstHeight));
    // adds a new point from start point to end point for each entry in data 
    for (let cont = 1; cont < data.length; cont++) {
      ctx.lineTo((columnWidth * cont), (((1 - (data[cont] / 100)) * trsecondHeight) + trfirstHeight));
    }
    // maximum height and width, canvas can be drawn to 
    let maxHeight = $('.trfirst').height() + $('.trsecond').height();
    let maxWidth = columnWidth * columns;

    //  add point from maximum width to maximum height 
    ctx.lineTo(maxWidth, maxHeight);
    // adds a new point from start point to endPoint
    ctx.lineTo(0, maxHeight);
    ctx.fillStyle = '#72DDF7';
    ctx.fill();
    // boundary color for funnel
    ctx.strokeStyle = 'lightgray';
    // draw the path on the canvas.
    ctx.stroke();
  }

  calculateData() {
    var fdata = [];
    fdata.push(100);
    for (let i = 0; i < this.reportformdata.fields.length; i++) {
      fdata.push(((this.reportformdata.fields[i].totalUniqueInteraction / this.reportformdata.totalPageView) * 100).toFixed(2));
    }
    fdata.push(((this.reportformdata.totalUniqueFormSubmit / this.reportformdata.totalPageView) * 100).toFixed(2));
    fdata.push((((this.reportformdata.totalUniqueFormSubmit - this.reportformdata.totalUniqueFailedSubmit) / this.reportformdata.totalPageView) * 100).toFixed(2));
    return fdata;
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
