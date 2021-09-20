import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { MonitorResponse } from './service/monitor.model';
import { MonitorService } from './service/monitor.service';
import { Store } from 'src/app/core/store/store';
import { MonitorLoadingState, MonitorLoadedState, MonitorLoadingErrorState } from './service/monitor.state';
import { SchedulerService } from '../../scheduler/scheduler.service';
import { SessionService } from 'src/app/core/session/session.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-monitor-menu',
  templateUrl: './monitor-menu.component.html',
  styleUrls: ['./monitor-menu.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MonitorMenuComponent implements OnInit, OnDestroy {

  data: MonitorResponse;
  error: boolean;
  empty: boolean;
  loading: boolean;
  isDisabled: boolean = false;

  constructor(
    private monitorService: MonitorService,
    private schedulerService: SchedulerService,
    private sessionSerivce: SessionService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const me = this;
    me.load();
  }

  ngAfterViewInit() {
    const me = this;
    me.schedulerService.subscribe('monitor-menu', () => {
      me.load();
    });
  }

  ngOnDestroy() {
    const me = this;
    me.schedulerService.unsubscribe('monitor-menu');
  }
  navigateTo(){
    this.router.navigate(['/configure-monitors'])
  }

 
  

  load() {
    const me = this;

    if (!me.sessionSerivce.isActive()) {
      return;
    }

    // me.monitorService.load().subscribe(
    //   (state: Store.State) => {
    //     if (state instanceof MonitorLoadingState) {
    //       me.onLoading(state);
    //       return;
    //     }

    //     if (state instanceof MonitorLoadedState) {
    //       me.onLoaded(state);
    //       return;
    //     }
    //   },
    //   (state: MonitorLoadingErrorState) => {
    //     me.onLoadingError(state);
    //   }
    // );
  }

  private onLoading(state: MonitorLoadingState) {
    const me = this;
    me.data = null;
    me.empty = false;
    me.error = null;
    me.loading = true;
  }

  private onLoadingError(state: MonitorLoadingErrorState) {
    const me = this;
    me.data = null;
    me.empty = false;
    me.error = true;
    me.loading = true;
  }

  private onLoaded(state: MonitorLoadedState) {
    const me = this;
    me.data = state.data;
    me.empty = !me.data.count;
    me.error = false;
    me.loading = false;
  }


}
