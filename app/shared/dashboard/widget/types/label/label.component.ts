import { Component, HostBinding, Input, ViewEncapsulation } from '@angular/core';
import { DashboardComponent } from '../../../dashboard.component';
import { DashboardWidgetComponent } from '../../dashboard-widget.component';

@Component({
  selector: 'app-label',
  templateUrl: './label.component.html',
  styleUrls: ['./label.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    { provide: DashboardWidgetComponent, useExisting: LabelComponent },
  ],
})
export class LabelComponent extends DashboardWidgetComponent {
  @HostBinding('class') class = 'widget-container';
  protected hasDataCall = false;
  @Input() visiblityMenu : any;
  get dashboard(): DashboardComponent {
    return this.layout.dashboardComponent;
  }
  render() {
    const me = this;
    console.log("i am here" + me.widget.settings.types.text.rotate);
    if(me.widget.settings.types.text.rotate == 'rotate(90deg)' || me.widget.settings.types.text.rotate == 'rotate(270deg)'){
    
    (<HTMLElement>document.getElementsByClassName("labelSpanClass_"+me.widget.widgetIndex)[0]).style.width = document.getElementsByClassName("labelClass_"+me.widget.widgetIndex)[0].clientHeight + 'px';
    }
    else{
      (<HTMLElement>document.getElementsByClassName("labelSpanClass_"+me.widget.widgetIndex)[0]).style.removeProperty('width');
    }
    (<HTMLElement>document.getElementsByClassName("labelSpanClass_"+me.widget.widgetIndex)[0]).style.transform = me.widget.settings.types.text.rotate;
    me.cd.detectChanges();
  }

  resize() {
    const me = this;
    console.log("logging" + me.widget.settings.types.text.rotate);
    if(document.getElementsByClassName("labelSpanClass_"+me.widget.widgetIndex)){
    (<HTMLElement>document.getElementsByClassName("labelSpanClass_"+me.widget.widgetIndex)[0]).style.transform = me.widget.settings.types.text.rotate;
    (<HTMLElement>document.getElementsByClassName("labelSpanClass_"+me.widget.widgetIndex)[0]).style.width = document.getElementsByClassName("labelClass")[0].clientHeight + 'px';
  //  document.getElementsByClassName("labelClass")[0].clientHeight
    }
  }

  changeRotationProperty(){
    const me = this;
    if(me.widget.settings.types.text.rotate == 'rotate(0deg)'){
      me.widget.settings.types.text.rotate = 'rotate(90deg)'
    }
   else if(me.widget.settings.types.text.rotate == 'rotate(90deg)'){
      me.widget.settings.types.text.rotate = 'rotate(180deg)'
    }
    else if(me.widget.settings.types.text.rotate == 'rotate(180deg)'){
      me.widget.settings.types.text.rotate = 'rotate(270deg)'
    }
    else if(me.widget.settings.types.text.rotate == 'rotate(270deg)'){
      me.widget.settings.types.text.rotate = 'rotate(0deg)'
    }

    if(me.widget.settings.types.text.rotate == 'rotate(90deg)' || me.widget.settings.types.text.rotate == 'rotate(270deg)'){
    
      (<HTMLElement>document.getElementsByClassName("labelSpanClass_"+me.widget.widgetIndex)[0]).style.width = document.getElementsByClassName("labelClass_"+me.widget.widgetIndex)[0].clientHeight + 'px';
      }
      else{
        (<HTMLElement>document.getElementsByClassName("labelSpanClass_"+me.widget.widgetIndex)[0]).style.removeProperty('width');
      }
      (<HTMLElement>document.getElementsByClassName("labelSpanClass_"+me.widget.widgetIndex)[0]).style.transform = me.widget.settings.types.text.rotate;
      me.cd.detectChanges();

  }
}
