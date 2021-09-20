import { NvhttpService } from './../../common/service/nvhttp.service';
import { DataRequestParams } from './../../common/datamanager/datarequestparams';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataManager } from '../../common/datamanager/datamanager';
import { DataHarRequestParams } from '../../common/datamanager/dataharrequestparams';
import { Domainactivity } from '../../common/interfaces/domainactivity';
import { SessionStateService } from '../../session-state.service';
import { AppError } from 'src/app/core/error/error.model';


@Component({
  selector: 'app-resource-timing',
  templateUrl: './resource-timing.component.html',
  styleUrls: ['./resource-timing.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class ResourceTimingComponent implements OnInit {

  selectedValue: string = 'bottleneck';
  page: any;
  session: any;
  userTimingNonAgg: any;
  resourceTimingData: any;
  userTimingData: any;
  pages: any[] = [];
  pageInstance: number = 0;
  domainActivityData: any;
  seriesInfo: any;
  domainNames: any;
  hostData: any;
  hostRawData: any;
  contentData: any;
  contentPieData: any;
  contentTableData: any[];
  hostTableData: any[];
  loading = false;
  empty = false;
  error: AppError = null;

  constructor(private route: ActivatedRoute, private http: NvhttpService, private stateService: SessionStateService) { }

  ngOnInit(): void {

    // read the queryParam Page from the url
    this.route.queryParams.subscribe(param => {
      console.log('Resource Timing --- Param : ', param);
    });

    this.stateService.onSessionPageChange().subscribe((idx: number) => {
      console.log('resource-timing, page changes - ', idx);

      this.reload();
    });

    this.reload();
  }

  reload() {
    this.page = this.stateService.getSelectedSessionPage();
    this.session = this.stateService.getSelectedSession();

    this.pages[0] = this.page;
    this.getResourceTiming();
  }

  getResourceTiming() {
    const pageInfo = this.page;
    console.log('pageInfo', pageInfo);
    this.getUserTimingForWaterfall();
    // to save from floating point precision error
    const request = new DataHarRequestParams(this.page.sid, this.page.pageInstance, DataManager.RESOURCE_TIMINGS, this.session.startTime, this.session.endTime, pageInfo.pageName.name, Math.round(pageInfo.timeToLoad * 1000), Math.round(pageInfo.timeToDOMComplete * 1000), pageInfo.navigationStartTime, pageInfo.showbandWidth);
    // DataManager.handleRequest(request, this);

    // set spinner. 
    this.dataLoading();

    DataManager.getResourceTimingData2(request, this).subscribe((response) => {
      this.dataLoaded(response);
    }, (error) => {
      this.dataError(error);
    });
  }

  dataLoading() {
    this.loading = true;
    this.resourceTimingData = null;
    this.empty = false;
    this.error = null;
  }

  dataLoaded(data) {
    this.loading = false;
    // If data is empty then show No Data. 

    if (!data || Object.keys(data).length == 0) {
      this.empty = true;
      return;
    }
    this.resourceTimingData = data;
  }

  dataError(error) {
    this.loading = false;
    this.error = {
      msg: ((error && error.error) ? error.error: 'Error in loading data of resource timing')
    };
  }

  getUserTimingForWaterfall() {
    const request = new DataRequestParams(this.page.sid, this.page.pageInstance, DataManager.USER_TIMINGS_NON_AGG, this.session.startTime, this.session.endTime);
    DataManager.handleRequest(request, this);
  }

  getDomainActivity() {
    const d = new Domainactivity(this.resourceTimingData);
    const actdata = d.getDomainActData();
    this.domainActivityData = actdata;
    this.seriesInfo = d.getSeriesData(actdata, this.page, this.resourceTimingData.entries[0]);
    this.domainNames = d.domains;

  }

  getDistributionData() {
    if (this.resourceTimingData != null) {
      this.hostData = this.resourceTimingData.hostdata.pieData;
      this.hostRawData = this.resourceTimingData.hostdata;
      this.hostTableData = this.resourceTimingData.hostdata.hostTableData;
      this.contentData = this.resourceTimingData.contentdata.contentData;
      this.contentPieData = this.resourceTimingData.contentdata.pieData;
      this.contentTableData = this.resourceTimingData.contentdata.contentTableData;
    }
  }

}
