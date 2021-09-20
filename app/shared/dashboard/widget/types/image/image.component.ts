import { Component, HostBinding, Input, ViewEncapsulation } from '@angular/core';
import { SessionService } from 'src/app/core/session/session.service';
import { DashboardWidgetTypeImageConfig } from '../../../service/dashboard.model';
import { DashboardWidgetComponent } from '../../dashboard-widget.component';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    { provide: DashboardWidgetComponent, useExisting: ImageComponent },
  ],
})
export class ImageComponent extends DashboardWidgetComponent {
  @HostBinding('class') class = 'widget-container';

  imageOptions: DashboardWidgetTypeImageConfig;
  @Input() visiblityMenu : any;
  titleCopy: any = '';

  render() {
    const me = this;
    me.loading = false;
    me.imageOptions = JSON.parse(JSON.stringify(me.widget.settings.types.image));
    me.cd.detectChanges();
  }

  onSelectFile(event) {
    const me = this;
    if (event.target.files && event.target.files[0]) {
      me.imageOptions.imageTitle = event.target.files[0].name;
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event) => {
        me.imageOptions.imgPath = String(event.target.result);
      };
      me.cd.detectChanges();
    }
  }

  addFocus() {
    setTimeout(() => {
      document.getElementById("title").focus();
      this.titleCopy = {...this.imageOptions}
    })
    
  }

    onBlurMethod(){
    
        this.imageOptions.editCaption = false;
        this.imageOptions.imageTitle = this.titleCopy.imageTitle;
      }
    
}
