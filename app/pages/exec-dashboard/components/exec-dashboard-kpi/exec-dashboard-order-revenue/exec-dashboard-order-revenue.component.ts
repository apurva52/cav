import { ExecDashboardCommonKPIDataservice } from './../../../services/exec-dashboard-common-kpi-data.service';
import { Component, OnInit, Input } from '@angular/core';
import { ExecDashboardUtil } from './../../../utils/exec-dashboard-util';
import { Meta } from '@angular/platform-browser';
@Component({
  selector: 'app-exec-dashboard-order-revenue',
  templateUrl: './exec-dashboard-order-revenue.component.html',
  styleUrls: ['./exec-dashboard-order-revenue.component.css']
})
export class ExecDashboardOrderRevenueComponent implements OnInit {

  @Input('multiDCView') multiDCView;

  selectedTimePeriod: String = '';
  ordersDataGridHeader: any = [];
  kpiTierName: string = "kpiTierName";
  kpiKohls: string = "kpiKohls";
  kpiWebstore: string = "kpiWebstore";
  kpiTotalMobile: string = "kpiTotalMobile";
  kpiMCom: string = "kpiMCom";
  kpiTablet: string = "kpiTablet";
  kpiIphone: string = "kpiIphone";
  kpiAndroid: string = "kpiAndroid";
  kpiKiosk: string = "kpiKiosk";
  kpiCSC: string = "kpiCSC";


  //css variables for table body

  tierNamecss: string = "tierNamecss";
  kohlscss: string = "kohlscss";
  webstorecss: string = "webstorecss";
  totalMobilecss: string = "totalMobilecss";
  mComcss: string = "mComcss";
  tabletcss: string = "tabletcss";
  iphonecss: string = "iphonecss";
  androidcss: string = "androidcss";
  kioskcss: string = "kioskcss";
  kpiCsccss: string = "kpiCsccss";

  ngOnInit() {
    this.meta.removeTag("name='viewport'");
    this.meta.addTag({ name: 'viewport', content:'width=device-width, height=device-height, user-scalable=no, initial-scale=0.1, ' });

    this.ordersDataGridHeader = [
      { "field": "updated2Min", "header": "Updated 2 Min", "icon": "fa fa-history", "class": "kpiTierName", "bodyStyles": "tierNamecss" },
      { "field": "totalKohls", "header": "Total", "icon": "kpicon kpi-total-kohls", "class": "kpiKohls", "bodyStyles": "kohlscss" },
      { "field": "webstore", "header": "WebStore", "icon": "kpicon kpi-webstore", "class": "kpiWebstore", "bodyStyles": "webstorecss" },
      { "field": "totalMobile", "header": "Total Mobile", "icon": "kpicon kpi-total-mobile", "class": "kpiTotalMobile", "bodyStyles": "totalMobilecss" },
      { "field": "mcom", "header": "m.com", "icon": "kpicon kpi-mcom", "class": "kpiMCom", "bodyStyles": "mComcss" },
      { "field": "tablet", "header": "Tablet", "icon": "kpicon kpi-tablet", "class": "kpiTablet", "bodyStyles": "tabletcss" },
      { "field": "iphone", "header": "IPhone", "icon": "kpicon kpi-iphone", "class": "kpiIphone", "bodyStyles": "iphonecss" },
      { "field": "android", "header": "Android", "icon": "kpicon kpi-android", "class": "kpiAndroid", "bodyStyles": "androidcss" },
      { "field": "kiosk", "header": "Kiosk", "icon": "kpicon kpi-kiosk", "class": "kpiKiosk", "bodyStyles": "kioskcss" },
      { "field": "csc", "header": "CSC", "icon": "kpicon kpi-csc", "class": "kpiCSC", "bodyStyles": "kpiCsccss" }
    ];
  }

  constructor(public execDashboardCommonKPIDataservice: ExecDashboardCommonKPIDataservice,  private meta : Meta) { }
}
