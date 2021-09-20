import {
  Component,
  ElementRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { DashboardWidget } from '../../service/dashboard.model';
import { DashboardWidgetComponent } from '../../widget/dashboard-widget.component';
import { DashboardLayoutComponent } from '../dashboard-layout.component';

@Component({
  selector: 'app-dashboard-layout-gallery',
  templateUrl: './dashboard-layout-gallery.component.html',
  styleUrls: ['./dashboard-layout-gallery.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: DashboardLayoutComponent,
      useExisting: DashboardLayoutGalleryComponent,
    },
  ],
})
export class DashboardLayoutGalleryComponent extends DashboardLayoutComponent {
  selectedWidgetWidget: DashboardWidget = null;

  type: string = 'GALLERY';
  firstTime : boolean;
  defaultThumbnailLayout = {
    x: null,
    y: null,
    cols: 3,
    rows: 2,
  };

  responsiveSettings = [
    // {
    //   breakpoint: '560px',
    //   numVisible: 1,
    //   numScroll: 1
    // },
    // {
    //   breakpoint: '560px',
    //   numVisible: 1,
    //   numScroll: 1
    // },
    // {
    //   breakpoint: '560px',
    //   numVisible: 1,
    //   numScroll: 1
    // }
  ];

  render() {
    const me = this;
    me.firstTime =true;
    if (me.dashboard.favDetailCtx.widgets[0]) {
      setTimeout(() => {
        me.openWidget(me.dashboard.favDetailCtx.widgets[0], true);
      }, 100);
    }
  }

  openWidget(widget: DashboardWidget , firstTime ?:boolean) {
    
    const me = this;    
    me.selectedWidgetWidget = widget;
    me.cd.detectChanges();
    setTimeout(() => {
      for (const c of me.widgets) {     
        if((c.widget.widgetIndex ==  me.selectedWidgetWidget.widgetIndex) || firstTime){  
        c.clear();
        }
        setTimeout(()=>{
          if((c.widget.widgetIndex ==  me.selectedWidgetWidget.widgetIndex) || firstTime){
          c.load();
          }
        },300)
      }
    });
  }
}
