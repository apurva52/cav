import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng';
import { AppError } from 'src/app/core/error/error.model';
import { Store } from 'src/app/core/store/store';
import { StoreDataPayload, StoreDetailsData } from './service/store-details.model';
import { StoreDetailsService } from './service/store-details.service';
import { StoreDataLoadingState, StoreDataLoadedState, StoreDataLoadingErrorState } from './service/store.details.state';
import { GeolocationService } from '../service/geolocation.service';
import { DBMonitoringService } from '../../db-monitoring/services/db-monitoring.services';

@Component({
  selector: 'app-store-details',
  templateUrl: './store-details.component.html',
  styleUrls: ['./store-details.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class StoreDetailsComponent implements OnInit {

  data: StoreDetailsData;
  error: AppError;
  loading: boolean;
  empty: boolean;
  items: MenuItem[];
  breadcrumb: MenuItem[] = [];
  selectedAppName: string;
  selectedStoreName: string;
  tp : any;
  st : any;
  et : any;
  constructor(private router: Router, private storeService: StoreDetailsService, private geolocationService: GeolocationService,private dBMonitoringservice:DBMonitoringService) {
    const me = this;
    //getting app name
    me.selectedAppName = this.geolocationService.$selectedGeoApp;
    //getting store name
    me.selectedStoreName = this.geolocationService.$selectedStoreName;
    //Setting duration object
   }

  ngOnInit() {
    const me = this;

    me.load(me.selectedAppName, me.selectedStoreName, me.geolocationService.getDuration());
    me.items = [
      {
        label: 'Alerts',
        disabled: false,
        command: (event: any) => {
          me.router.navigate(['/my-library/alert']);
        }
      },
      {
        label: 'Dashboards',
        disabled: false,
        command: (event: any) => {
          me.router.navigate(['/home/dashboard']);
        }
      },
      {
        label: 'Tier Status',
        disabled: false,
        command: (event: any) => {
          me.router.navigate(['/end-to-end']); 
        }
      },
      {
        label: 'DB Status',
        disabled: false,
        command: (event: any) => {
          me.dBMonitoringservice.loadUI();
          me.dBMonitoringservice.getDbServerList();
          me.router.navigate(['/db-monitoring']);
        }
      },
    ];

    const duration = me.geolocationService.getDuration();
    me.tp = duration.preset;
    me.st = duration.st;
    me.et = duration.et;
    this.breadcrumb = [
      {label:'Home', routerLink: '/home/dashboard'},
      {label:'System', routerLink: '/home/system'},
      {label:'Geo-location', 
      command: (event: any) => {
        me.router.navigate(['/geo-location', 'details', duration.preset, duration.st, duration.et]);
      },
      }
    ]
  }


  load(selectedAppName, selectedStoreName, duration) {
    const me = this;
    me.storeService.load(selectedAppName, selectedStoreName, me.geolocationService.getDuration()).subscribe(
      (state: Store.State) => {
        if (state instanceof StoreDataLoadingState) {
          me.onLoading(state);
          return;
        }
        if (state instanceof StoreDataLoadedState) {
          me.onLoaded(state);
          return;
        }
      },
      (state: StoreDataLoadingErrorState) => {
        me.onLoadingError(state);
      }
    );
  }

  private onLoading(state: StoreDataLoadingState) {
    const me = this;
    me.error = null;
    me.loading = true;
  }

  private onLoadingError(state: StoreDataLoadingErrorState) {
    const me = this;
    me.data = null;
    me.error = state.error;
    me.loading = false;
  }

  private onLoaded(state: StoreDataLoadedState) {
    const me = this;
    me.data = state.data;
    if(me.data.data && me.data.data.length != 0)
    {
      //To round off the store details values.
      me.data.data.forEach(function (value, i) {
        me.data.data[i]['critical']  = Math.round(value['critical']);
        me.data.data[i]['error']  = Math.round(value['error']);
        me.data.data[i]['major']  = Math.round(value['major']);
        me.data.data[i]['orderPlacedPerMin']  = Math.round(value['orderPlacedPerMin']);
        me.data.data[i]['responseTime']  = Math.round(value['responseTime']);
        me.data.data[i]['scanPerMin']  = Math.round(value['scanPerMin']);
        me.data.data[i]['tps']  = Math.round(value['tps']);
      });
      me.breadcrumb.push({label:me.data.name});
    }
    me.error = null;
    me.loading = false;
    if(me.data.data.length === 0){
      me.empty = true;
    }
  }
}
