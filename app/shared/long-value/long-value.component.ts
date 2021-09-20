import { Component, OnInit } from '@angular/core';
import { DrilldownService } from '../../pages/drilldown/service/drilldown.service';
import { DashboardServiceReqService } from '../../pages/dashboard-service-req/service/dashboard-service-req.service';
import { FlowpathAnalyzerService } from '../../pages/drilldown/flowpath-analyzer/service/flowpath-analyzer.service';

@Component({
  selector: 'app-long-value',
  templateUrl: './long-value.component.html',
  styleUrls: ['./long-value.component.scss']
})
export class LongValueComponent implements OnInit {
  showModel: boolean = false;
  showModel1:boolean = false;
  showModel2:boolean = false;
   //selectedFilter = "Tier=Tier48, server=AppServer48, instance=Atg48, BT=ATGCartSummary, startTime=16/03/21 11:46:49, endTime=16/03/21 11:46:49, BT Type=All";
   selectedFilter: any;
   selectedFilter1: any;
   selectedFilterr: any;
  constructor(private drilldownService: DrilldownService, private dashboardServiceReqService: DashboardServiceReqService, private flowpathanalyzerService: FlowpathAnalyzerService) {
    }

  ngOnInit(): void {
  }

  open() {
      this.showModel = true;
      this.selectedFilter = this.drilldownService.filterCriteria;
    }
  open1(){
      this.showModel1 = true;
      this.selectedFilter1= this.dashboardServiceReqService.filterCriteria;
  }
  open2()
  {
    this.showModel2 = true;
      this.selectedFilterr= this.flowpathanalyzerService.filterCriteria;
  }
  close() {
    this.showModel = false;
    this.showModel1 = false;
    this.showModel2 = false;
  }
}
