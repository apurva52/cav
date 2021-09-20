import { Component, OnInit, ViewEncapsulation, OnDestroy, ViewChild } from '@angular/core';
import { EventResponse } from './service/event.model';
import { EventGroupLoadingState, EventGroupLoadingErrorState, EventGroupLoadedState } from './service/event.state';
import { EventService } from './service/event.service';
import { Store } from 'src/app/core/store/store';
import { SessionService } from 'src/app/core/session/session.service';
import { SchedulerService } from '../../scheduler/scheduler.service';
import { Router } from '@angular/router';
import { OverlayPanel } from 'primeng';

@Component({
  selector: 'app-events-menu',
  templateUrl: './events-menu.component.html',
  styleUrls: ['./events-menu.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EventsMenuComponent implements OnInit, OnDestroy {

  data: EventResponse;
  error: boolean;
  empty: boolean;
  loading: boolean;
  isDisabled: boolean = true;
  @ViewChild("menu")
  menu : OverlayPanel;
  severities: any;

  constructor(
    private eventService: EventService,
    private sessionSerivce: SessionService,
    private schedulerService: SchedulerService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const me = this;

    me.severities = [
      {
        "name": "All",
        "key": "all",
        "color": "#6197c7",
        "selected": true,
        "showInLegend": false
      },
      {
        "name": "Critical",
        "key": "critical",
        "color": "#FF8484",
        "selected": false,
        "showInLegend": true
      },
      {
        "name": "Major",
        "key": "major",
        "color": "#FFB5B5",
        "selected": false,
        "showInLegend": true
      },
      {
        "name": "Minor",
        "key": "minor",
        "color": "#FFDBDB",
        "selected": false,
        "showInLegend": true
      }
    ];
    me.load();
  }

  ngAfterViewInit() {
    const me = this;
    me.schedulerService.subscribe('events-menu', () => {
      me.load();
    });
  }

  ngOnDestroy() {
    const me = this;
    me.schedulerService.unsubscribe('events-menu');
  }

  load() {
    const me = this;

    if (!me.sessionSerivce.isActive()) {
      return;
    }

    const tr = me.sessionSerivce.testRun.id;

    me.eventService.load(tr).subscribe(
      (state: Store.State) => {
        if (state instanceof EventGroupLoadingState) {
          me.onLoading(state);
          return;
        }

        if (state instanceof EventGroupLoadedState) {
          me.onLoaded(state);
          return;
        }
      },
      (state: EventGroupLoadingErrorState) => {
        me.onLoadingError(state);
      }
    );
  }

  private onLoading(state: EventGroupLoadingState) {
    const me = this;
    me.data = null;
    me.empty = false;
    me.error = null;
    me.loading = true;
  }

  private onLoadingError(state: EventGroupLoadingErrorState) {
    const me = this;
    me.data = null;
    me.empty = false;
    me.error = true;
    me.loading = true;
  }

  private onLoaded(state: EventGroupLoadedState) {
    const me = this;
    me.data = state.data;
    if (me.data) {
      me.empty = !me.data.items.length;
    }

    //for node health status
    if(me.data.dcData)
    me.sessionSerivce.preSession.dcData = me.data.dcData;

    setTimeout(() => {
     me.sessionSerivce._nodeHealth.next(me.data.dcData);
   }, 0);

    me.error = false;
    me.loading = false;
  }

  goToViewAllAlerts(){
    this.menu.hide();
    this.router.navigate(['/my-library/alert']);
  }

}
