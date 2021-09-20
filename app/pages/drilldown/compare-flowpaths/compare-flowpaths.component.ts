import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { MenuItem } from 'primeng';
import { AppError } from 'src/app/core/error/error.model';
import { SessionService } from 'src/app/core/session/session.service';
import { Store } from 'src/app/core/store/store';
import { CompareFlowPathData } from './service/compare-flowpaths.model';
import { CompareFlowpathsService } from './service/compare-flowpaths.service';
import {
  CompareFlowPathLoadedState,
  CompareFlowPathLoadingErrorState,
  CompareFlowPathLoadingState,
} from './service/compare-flowpaths.state';
import {Location} from '@angular/common';
@Component({
  selector: 'app-compare-flowpaths',
  templateUrl: './compare-flowpaths.component.html',
  styleUrls: ['./compare-flowpaths.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CompareFlowpathsComponent implements OnInit {
  error: AppError;
  empty: boolean;
  loading: boolean;
  data: CompareFlowPathData;
  breadcrumb: MenuItem[] = [];
  width: number;

  @ViewChild('compareFlowPathCard', { read: ElementRef })
  compareFlowPathCard: ElementRef;
  selectedFilter =
    'Tier=RHEL,BT=/DashboardService/RestService,StartTime=06/26/20 16:40:00, EndTime=06/26/20 20:38:56, BT Type=All';

  constructor(private compareFlowpathsService: CompareFlowpathsService, private sessionService:SessionService, private _location: Location) {}

  ngOnInit(): void {
    const me = this;
    me.load();

    me.breadcrumb = [
      { label: 'Home', routerLink: '/home/dashboard' },
      { label: 'Drill Down Flow Paths Compare' },
    ];
  }
back(){
  this._location.back();
}
  load() {
    const me = this;
    me.compareFlowpathsService.load().subscribe(
      (state: Store.State) => {
        if (state instanceof CompareFlowPathLoadingState) {
          me.onLoading(state);
          return;
        }
        if (state instanceof CompareFlowPathLoadedState) {
          me.onLoaded(state);
          return;
        }
      },
      (state: CompareFlowPathLoadingErrorState) => {
        me.onLoadingError(state);
      }
    );
  }

  private onLoading(state: CompareFlowPathLoadingState) {
    const me = this;
    me.error = null;
    me.loading = true;
  }

  private onLoadingError(state: CompareFlowPathLoadingErrorState) {
    const me = this;
    me.data = null;
    me.error = state.error;
    me.loading = false;
  }

  private onLoaded(state: CompareFlowPathLoadedState) {
    const me = this;
    me.data = state.data;
    me.error = null;
    me.loading = false;
    if (me.data.comparefp.length === 0) {
      me.empty = true;
    }
  }

  getCustomWidth() {
    const me = this;
    let el;

    if (me.compareFlowPathCard) {
      el = me.compareFlowPathCard.nativeElement.querySelector('p-card .ui-card');
      el.setAttribute('style', 'width: 400px');
    }
  }

  removeMe(index: number) {
    const me = this;
    const el: Element = document.getElementById(
      'panel-' + index
    );
    el.remove();
  }
}
