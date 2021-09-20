import {
  Component,
  OnInit,
  Input,
  ViewEncapsulation,
  ElementRef,
  ViewChild,
  OnDestroy,
} from '@angular/core';
import { KpiRevenueComponent } from '../kpi-revenue.component';
import { IDGenerator } from 'src/app/shared/utility/IDGenerator';
import { Store } from 'src/app/core/store/store';
import { KPIOrderRevenueData } from '../../service/kpi.model';
import { KPIService } from '../../service/kpi.service';
import { KPIORDataLoadingState, KPIORDataLoadedState, KPIORDataLoadingErrorState } from '../../service/kpi.state';
import { SchedulerService } from 'src/app/shared/scheduler/scheduler.service';

@Component({
  selector: 'app-revenue-table.p-col-fixed',
  templateUrl: './revenue-table.component.html',
  styleUrls: ['./revenue-table.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class RevenueTableComponent implements OnInit, OnDestroy {
  error: boolean;
  empty: boolean;
  loading: boolean;
  data: KPIOrderRevenueData;
  width: number;

  public uuid: string = IDGenerator.newId();
  public parent: KpiRevenueComponent;

  @Input() duration: string;
  @Input() durationLabel: string;

  @ViewChild('revenueCard', { read: ElementRef }) revenueCard: ElementRef;

  constructor(private kpiService: KPIService, private schedulerService: SchedulerService) {}

  ngOnInit(): void {
    const me = this;

    me.schedulerService.subscribe('kpi-revenue-data-refresh-' + me.uuid, () => {
      me.refresh();
    });

    me.refresh();

  }

  ngOnDestroy() {
    const me = this;
    me.schedulerService.unsubscribe('kpi-revenue-data-refresh-' + me.uuid);
  }

  removeMe() {
    const me = this;
    me.schedulerService.unsubscribe('kpi-revenue-data-refresh-' + me.uuid);
    me.parent.remove(me.uuid);
  }

  refresh() {
    const me = this;

    me.kpiService.loadKPIOrderRevenueData(me.parent.dc, me.duration).subscribe(
      (state: Store.State) => {

        if (state instanceof KPIORDataLoadingState) {
          me.onLoading(state);
          return;
        }

        if (state instanceof KPIORDataLoadedState) {
          me.onLoaded(state);
          return;
        }
      },
      (state: KPIORDataLoadingErrorState) => {
        me.onLoadingError(state);
      }
    );
  }

  private onLoading(state: KPIORDataLoadingState) {
    const me = this;
    me.data = null;
    me.error = null;
    me.loading = true;
    me.empty = false;
  }

  private onLoadingError(state: KPIORDataLoadingState) {
    const me = this;
    me.data = null;
    me.error = true;
    me.loading = false;
  }

  private onLoaded(state: KPIORDataLoadedState) {
    const me = this;
    me.error = false;
    me.data = state.data;
    me.loading = false;
    if (!(me.data && me.data.headers && me.data.headers.length && me.data.data)) {
      me.empty = true;
    }
  }

  getCustomWidth(){
    const me = this;
    let el;

    if (me.revenueCard){
       el = me.revenueCard.nativeElement.querySelector('p-card .ui-card');
       if (me.data && me.data.headers  && me.data.data){
         me.width = me.data.headers[0].cols.length * 150;
         el.setAttribute('style', 'width:' + me.width + '' + 'px');
       } else {
         el.setAttribute('style', 'width: 300px');
       }
    }
  }
}
