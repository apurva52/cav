import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuItem } from 'primeng';

@Component({
  selector: 'app-compare-setting',
  templateUrl: './compare-setting.component.html',
  styleUrls: ['./compare-setting.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CompareSettingComponent implements OnInit {

  visible: boolean;
  testRun: MenuItem[];
  selectedTestRun: MenuItem;
  showDashboardReport: string;
  showDashboardOptions: string;
  showDashboardByPhase: string;
  showDashboardDuration: string;
  showAdvancedSetting: string;
  showReportOptions: string;
  showByTemplate: string;
  showAllTransaction: string;
  showByPhase: string;
  showReportByTemplate: string;
  showTrendReport: string;
  duration: MenuItem[];
  selectDuration: MenuItem;
  summary: MenuItem[];
  selectSummary: MenuItem;

  constructor() { }

  ngOnInit(): void {
    const me =this;

    me.testRun = [
      { label: '11001'},
      { label: '11001'},
      { label: '11001'},
      { label: '11001'},
      { label: '11001'},
      { label: '11001'},
    ];

    me.duration = [
      {label: 'Duration'},
      {label: 'Duration'},
      {label: 'Duration'},
      {label: 'Duration'},
      {label: 'Duration'}
    ]
   
    me.summary = [
      {label: 'Summary Report Term'},
      {label: 'Summary Report Term'},
      {label: 'Summary Report Term'},
      {label: 'Summary Report Term'},
      {label: 'Summary Report Term'}
    ]
  }

  open(){
    this.visible = true;
  }
  closeDialog(){
    this.visible = false;
  }

}
