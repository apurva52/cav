import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuItem } from 'primeng';
import { VisualChart } from 'src/app/shared/visualization/visual-chart/service/visual-chart.model';
import { NAVIGATION_TIMING_CHART_DATA } from './service/navigation-timing.dummy';
import { ActivatedRoute, Router } from '@angular/router';
import { PageInformation } from 'src/app/pages/home/home-sessions/common/interfaces/pageinformation';
import { SessionStateService } from '../../session-state.service';

@Component({
  selector: 'app-navigation-timing',
  templateUrl: './navigation-timing.component.html',
  styleUrls: ['./navigation-timing.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NavigationTimingComponent implements OnInit {

  visualChart: VisualChart;
  orderList: MenuItem[];
  navigationData : PageInformation;

  constructor(private router: Router,private route: ActivatedRoute, private stateService: SessionStateService) { }

  ngOnInit(): void {
    const me = this;
    me.visualChart = NAVIGATION_TIMING_CHART_DATA;

    this.route.queryParams.subscribe(params => {
      console.log("params in sessions page : ", params);
    });

    me.stateService.onSessionPageChange().subscribe((idx: number) => {
      console.log('navigation-timing, page changes - ', idx);

      me.reload();
    });

    me.reload();
  }

  reload() {
    const me = this;
    me.navigationData = me.stateService.getSelectedSessionPage();
    me.visualChart.charts[0].highchart.series[0]['data'] = [me.navigationData['loadEventTime']];
    me.visualChart.charts[0].highchart.series[1]['data'] = [me.navigationData['domTime']];
    me.visualChart.charts[0].highchart.series[2]['data'] = [me.navigationData['responseTime']];
    me.visualChart.charts[0].highchart.series[3]['data'] = [me.navigationData['serverresponsetime']];
    me.visualChart.charts[0].highchart.series[4]['data'] = [me.navigationData['secureConnectionTime']];
    me.visualChart.charts[0].highchart.series[5]['data'] = [me.navigationData['connectionTime']];
    me.visualChart.charts[0].highchart.series[6]['data'] = [me.navigationData['dnsTime']];
    me.visualChart.charts[0].highchart.series[7]['data'] = [me.navigationData['cacheLookupTime']];
    me.visualChart.charts[0].highchart.series[8]['data'] = [me.navigationData['redirectionDuration']];
    me.orderList = [
     {
       label: 'DOM Time',
       title: me.navigationData['domTime'],
     },
     {
       label: 'Time to DOMContent Loaded (TTDL)',
       title: me.navigationData['timeToDOMComplete'],
     },
     {
       label: 'OnLoad',
       title: me.navigationData['timeToLoad'],
     },
     {
       label: 'DNS',
       title:  me.navigationData['dnsTime'],
     },
     {
       label: 'SSL',
       title: me.navigationData['secureConnectionTime'],
     },
     {
       label: 'Server Response Time',
       title: me.navigationData['serverresponsetime'],
     },
     {
       label: 'Load Event',
       title: me.navigationData['loadEventTime'],
     },
     {
       label: 'Download Time',
       title: me.navigationData['responseTime'],
     },
     {
       label: 'First Content Paint (FCP)',
       title: me.navigationData['firstcontentpaint'],
     },
     {
       label: 'First Input Delay(FID)',
       title: me.navigationData['firstinputdelay'],
     },
     {
       label: 'Time to First Byte(TTFB)',
       title: me.navigationData['firstByteTime'],
     },
     {
       label: 'Perceived Render Time (PRT)',
       title: me.navigationData['percievedRenderTime'],
     },
     {
       label: 'Time to DOM Interactive (TTDI)',
       title: me.navigationData['domInteractiveTime'],
     },
     {
       label: 'Connection',
       title: me.navigationData['connectionTime'],
     },
     {
       label: 'Redirection',
       title: me.navigationData['redirectionDuration'],
     },
     {
       label: 'Unload',
       title: me.navigationData['unloadTime'],
     },
     {
       label: 'Cache Lookup',
       title: me.navigationData['cacheLookupTime'],
     },
     {
       label: 'Redirection Count',
       title: me.navigationData['redirectionCount'],
     },
     {
       label: 'First Paint(FP)',
       title: me.navigationData['firstpaint'],
     },
     {
       label: 'Time to Interactive(TTI)',
       title: me.navigationData['timetointeractive'],
     },
   ];
  }

}
