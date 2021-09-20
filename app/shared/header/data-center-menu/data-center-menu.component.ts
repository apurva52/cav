import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DataCenter } from './service/data-center.model';
import { DataCenterService } from './service/data-center.service';
import { Store } from 'src/app/core/store/store';
import {
  DataCenterLoadingState,
  DataCenterLoadedState,
  DataCenterLoadingErrorState,
} from './service/data-center.state';
import { SessionService } from 'src/app/core/session/session.service';
import { SchedulerService } from '../../scheduler/scheduler.service';

@Component({
  selector: 'app-data-center-menu',
  templateUrl: './data-center-menu.component.html',
  styleUrls: ['./data-center-menu.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DataCenterMenuComponent implements OnInit {
  selected: DataCenter;
  data: DataCenter[];
  error: boolean;
  empty: boolean;
  loading: boolean;
  selectedValue: string = 'Select DC';
  selectedDcIcon: string;
  isAnyNodeDown: boolean = false;


  constructor(
    private dataCenterService: DataCenterService,
    public sessionService: SessionService,
    private schedulerService: SchedulerService,
  ) {}

  ngOnInit(): void {
    const me = this;
    me.load();
  }

  ngAfterViewInit() {
    const me = this;
    me.schedulerService.subscribe('data-center-menu', () => {
      me.load();
    });
  }

  ngOnDestroy() {
    const me = this;
    me.schedulerService.unsubscribe('data-center-menu');
  }

  changeDataCenter(dc: DataCenter, silent: boolean = false) {
    const me = this;
    me.selected = dc;
    me.selectedValue = me.selected.name;
    me.selectedDcIcon = me.selected.icon;
    if (!silent) {
      me.sessionService.dataCenter = me.selected;
    }
  }

  confirmChangeDataCenter(dc: DataCenter) {
    const me = this;
    if (confirm('Are you sure you want to change Data Center?')) {
      me.changeDataCenter(dc);
      window.location.reload();
    }
  }

  showNodeHeathStatus() {
    const me = this;
    try {
      const data = this.sessionService._nodeHealthProvider$.subscribe(
        result => {
          me.data = result;
          me.checkAnyNodeDown(result);
        },
        error => {
          console.log('error in getting data ', error);
          data.unsubscribe();
        },
        () => {
          data.unsubscribe();

        }
      );
    } catch (error) {
      console.error('error in getting subscription');
    }
  }

  load() {
    const me = this;
    me.showNodeHeathStatus();

    me.dataCenterService.load().subscribe(
      (state: Store.State) => {
        if (state instanceof DataCenterLoadingState) {
          me.onLoading(state);
          return;
        }

        if (state instanceof DataCenterLoadedState) {
          me.onLoaded(state);
          return;
        }
      },
      (state: DataCenterLoadingErrorState) => {
        me.onLoadingError(state);
      }
    );
  }
  checkAnyNodeDown(data) {
    const me = this;
    for(let dc in data){
      if(data[dc]['status'] == 'DOWN'){
        me.isAnyNodeDown = true;
      }
      else
      me.isAnyNodeDown = false;
    }
  }

  private onLoading(state: DataCenterLoadingState) {
    const me = this;
    me.data = null;
    me.empty = false;
    me.error = null;
    me.loading = true;
  }

  private onLoadingError(state: DataCenterLoadingErrorState) {
    const me = this;
    me.data = null;
    me.empty = false;
    me.error = true;
    me.loading = true;
  }

  private onLoaded(state: DataCenterLoadedState) {
    const me = this;
    me.data = state.data;
    me.empty = !me.data.length;

    if (!me.empty) {
      me.changeDataCenter(me.sessionService.dataCenter, true);
    }

    me.error = false;
    me.loading = false;
  }
}
