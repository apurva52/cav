import { Component, OnInit, ViewEncapsulation, AfterViewInit, Host, ViewChildren, QueryList, ChangeDetectorRef, Input, OnDestroy, ElementRef, Inject } from '@angular/core';
import { DashboardFavCTX, DashboardLayoutMode, DashboardWidgetLayout } from '../service/dashboard.model';
import { DashboardComponent } from '../dashboard.component';
import { DashboardWidgetComponent } from '../widget/dashboard-widget.component';
import { SessionService } from 'src/app/core/session/session.service';
import { Subscription } from 'rxjs';
import * as _ from 'lodash';
import { LabelComponent } from '../widget/types/label/label.component';

@Component({
  selector: 'app-dashboard-layout',
  template: '',
  encapsulation: ViewEncapsulation.None
})
export class DashboardLayoutComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChildren(DashboardWidgetComponent) widgets: QueryList<DashboardWidgetComponent>;

  private subscriptionWidgetReloadData: Subscription;

  @Input() dashboardComponent: DashboardComponent;
  get dashboard(): DashboardFavCTX {
    return this.dashboardComponent ? this.dashboardComponent.data : null;
  }

  type: string = 'NA';

  constructor(
    @Inject('mode') public mode: DashboardLayoutMode,
    protected cd: ChangeDetectorRef,
    protected sessionService: SessionService,
    public el: ElementRef
  ) { }

  ngOnDestroy(): void {
    const me = this;

    if (me.subscriptionWidgetReloadData) {
      me.subscriptionWidgetReloadData.unsubscribe();
    }
  }

  ngOnInit(): void {
    const me = this;
    this.init();
  }

  ngAfterViewInit(): void {
    const me = this;
    me.render();
  }

  // Overridden in child
  init(): void {
  }

  // Overridden in child
  render(): void {
    setTimeout(()=>{
      this.cd.detectChanges(); 
    })
  }

  // Overridden in child
  toggleMode(mode?: DashboardLayoutMode , isNewDashboard? : boolean) {
  }

  // Overridden in child
  renderWidgets(force?: boolean, clearData?: boolean, widgetSettingChanged?: boolean,newWidget?:boolean) {
  }

  // Overridden in child
  onLayoutChange() {
  }

  //reset widget wise time if global time is applied
  resetWidgetWiseTime(){
    const me = this;
    for(const c of me.widgets){
      if(c.widget.widgetWiseInfo)
      c.widget.widgetWiseInfo = null;
    }
 }

  getCurrentLayoutConfig(): DashboardWidgetLayout[] {
    return null;
  }

}
