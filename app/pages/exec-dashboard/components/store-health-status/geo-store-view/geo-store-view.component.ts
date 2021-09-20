import { Component, OnInit, OnDestroy } from '@angular/core';
import { ExecDashboardChartProviderService } from '../../../services/exec-dashboard-chart-provider.service';
import { ExecDashboardDataContainerService } from './../../../services/exec-dashboard-data-container.service';
import { ExecDashboardGraphicalKpiService } from './../../../services/exec-dashboard-graphical-kpi.service';
import { ExecDashboardStoreTransactionHandlerService } from './../../../services/exec-dashboard-store-transaction-handler.service';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { OverlayPanel } from 'primeng/primeng';
import { ExecDashboardUtil } from './../../../utils/exec-dashboard-util';
import { CavTopPanelNavigationService } from 'src/app/pages/tools/configuration/nd-config/services/cav-top-panel-navigation.service';

const TOTALTRANCATIONS = 'Total Transactions';
const TOTAL10TRANSACTIONS = 'Top 10 Transactions';
const TOTALALERTS = 'Total Alerts';
const TOTALGOODSTORES = 'Total Good Stores';
const TOTALBADSTORES = 'Total Bad Stores';

@Component({
  selector: 'app-geo-store-view',
  templateUrl: './geo-store-view.component.html',
  styleUrls: ['./geo-store-view.component.css']
})
export class GeoStoreViewComponent implements OnInit, OnDestroy {
  options: object;
  piechartData: any = {};
  response: string = 'geomap_res';
  tableArr: any[] = [];
  table2Arr: any[] = [];
  topTransactionData: any[] = [];
  /*Data Subscriber of service.*/
  dataSubscription: Subscription;
  hiderightPanel: boolean = false;

  constructor(public _chartProvicer: ExecDashboardChartProviderService,
    public datacontainer: ExecDashboardDataContainerService,
    public _graphicalKpiService: ExecDashboardGraphicalKpiService,
    private router: Router,
    private _navService: CavTopPanelNavigationService,
    public _transHandler: ExecDashboardStoreTransactionHandlerService) { }

  ngOnInit() {
    // setTimeout(() => { this.hiderightPanel = false }, 3000);
    // setTimeout(()=>{this.hiderightPanel = true},6000);

    if (this.datacontainer.$tableArr) {
      this.tableArr = this.datacontainer.$tableArr;
      this.createBusinessHealthData();
    }
    this.options = this._chartProvicer.getGeoMap();

    this.dataSubscription = this._graphicalKpiService.gkpiProvider$.subscribe(
      action => {
        if (action === 'GeoMapUpdateAvailable') {
          this.options = null;
          this.options = this._chartProvicer.getGeoMap();
          this._graphicalKpiService.getFilteredData(this.datacontainer.selectedGeoApp);	// getting filtered data
          if (this.datacontainer.$tableArr) {
            this.tableArr = this.datacontainer.$tableArr;
          }
        }
        else if (action = "FilterTable") {
          if (this.datacontainer.$tableArr) {
            console.log(JSON.stringify(this.datacontainer.$tableArr));
            this.tableArr = this.datacontainer.$tableArr;
            this.createBusinessHealthData();
          }
        }
      },
      err => {
        console.log('Error while getting compare data from server', err);
        this.dataSubscription.unsubscribe();
      },
      () => {
        console.log('Dashboard Data Request completed successfully.');
        /*unsubscribe/releasing resources.*/
        this.dataSubscription.unsubscribe();
      }
    );




  }
  onclickOperation(event, row, overlaypanel: OverlayPanel) {
    console.log('onclickOperation called ------------ ');
    console.log(row);
    try {
      if (row.operationName == TOTALGOODSTORES || row.operationName == TOTALBADSTORES) {
        if (row.operationValue > 0) {
          this.datacontainer.$goodBadStore = row.operationName;
          sessionStorage.setItem("storeType",row.operationName); //for bug 87999
          this._navService.addNewNaviationLink('edTransaction Table');
	  //this.router.navigate(['/home/execDashboard/main/transactionTable/'+row.operationName]);
          this.router.navigate(['/home/execDashboard/main/transactionTable/']);//for bug 87999
        }
        else {
          this._graphicalKpiService.showMessageGrowl('error', 'Error Message', 'No store available');
        }
      }
      if (row.operationName == TOTAL10TRANSACTIONS) {
        this._transHandler.getTop10Transactions((tableData) => {
          this.topTransactionData = tableData;
          overlaypanel.toggle(event);
        });
      }
      if (row.operationName == TOTALTRANCATIONS) {
        this._transHandler.handleBTTrendWindow();
      }

    } catch (error) {
      console.error(error);
    }
  }

  createBusinessHealthData() {
    try {
      if (this.datacontainer.selectedGeoApp != "All") {
        for (let val of this.datacontainer.$tableArr) {
          if (val.appName == this.datacontainer.selectedGeoApp) {
            let totalTransaction = val.count ? ExecDashboardUtil.numberToCommaSeperate(val.count) : 0;
            let major = (val.major ? val.major : 0) + (val.minor ? val.minor:0);            
            let critical = val.critical ? val.critical : 0;
            let goodStores = val.goodStore ? val.goodStore : 0;
            let badStores = val.badStore ? val.badStore : 0;
            // this.table2Arr = [{ 'operationName': 'Total Transactions', 'operationValue': totalTransaction }, { 'operationName': 'Top 10 Transactions', 'operationValue': 'Show Top 10' }, { 'operationName': 'Total Alerts', 'operationValue': [critical, major] }, { 'operationName': 'Total Good Stores', 'operationValue': goodStores }, { 'operationName': 'Total Bad Stores', 'operationValue': badStores }];
			this.table2Arr = [{ 'operationName': TOTALTRANCATIONS, 'operationValue': totalTransaction }, { 'operationName': TOTAL10TRANSACTIONS, 'operationValue': 'Show Top 10' }, { 'operationName': TOTALALERTS, 'operationValue': [critical, major] }, { 'operationName': TOTALGOODSTORES, 'operationValue': goodStores }, { 'operationName': TOTALBADSTORES, 'operationValue': badStores }];
            this.piechartData = this._chartProvicer.getPieChart(goodStores, badStores);
          }
        }
      }
      //need to handle all case
      else if (this.datacontainer.selectedGeoApp == "All") {
        this.getAllAppsData();
      }

    } catch (error) {
      console.error(error);
    }
  }
  //method to show all apps data in business health table by adding all app fields into one
  getAllAppsData() {
    try {
      let val = this.datacontainer.$tableArr;
      let totalTransaction = 0;
      let major = 0;
      let critical = 0;
      let goodStores = 0;
      let badStores = 0;
      for (let i = 0; i < val.length; i++) {
        totalTransaction += val[i].count ? val[i].count : 0;
        major += (val[i].major ? val[i].major : 0) + (val[i].minor ? val[i].minor:0);        
        critical += val[i].critical ? val[i].critical : 0;
        goodStores += val[i].goodStore ? val[i].goodStore : 0;
        badStores += val[i].badStore ? val[i].badStore : 0;
      }
      // this.table2Arr = [{ 'operationName': 'Total Transactions', 'operationValue': ExecDashboardUtil.numberToCommaSeperate(+totalTransaction)}, { 'operationName': 'Top 10 Transactions', 'operationValue': 'Show Top 10' }, { 'operationName': 'Total Alerts', 'operationValue': [critical, major] }, { 'operationName': 'Total Good Stores', 'operationValue': goodStores }, { 'operationName': 'Total Bad Stores', 'operationValue': badStores }];
	  this.table2Arr = [{ 'operationName': TOTALTRANCATIONS, 'operationValue': ExecDashboardUtil.numberToCommaSeperate(+totalTransaction) }, { 'operationName': TOTAL10TRANSACTIONS, 'operationValue': 'Show Top 10' }, { 'operationName': TOTALALERTS, 'operationValue': [critical, major] }, { 'operationName': TOTALGOODSTORES, 'operationValue': goodStores }, { 'operationName': TOTALBADSTORES, 'operationValue': badStores }];
      this.piechartData = this._chartProvicer.getPieChart(goodStores, badStores);

    } catch (error) {
      console.error(error);
    }
  }

  public ngOnDestroy() {
    this.datacontainer.$updateGeoMap = false;
    if(this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }
}
