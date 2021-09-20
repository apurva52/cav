import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuItem, SelectItem } from 'primeng';
import { PageSidebarComponent } from 'src/app/shared/page-sidebar/page-sidebar.component';

@Component({
  selector: 'app-current-session-filter',
  templateUrl: './current-session-filter.component.html',
  styleUrls: ['./current-session-filter.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CurrentSessionFilterComponent extends PageSidebarComponent
  implements OnInit {
  classes = 'current-session-page-sidebar';
  options: MenuItem[];

  panel: any;


  constructor() { super(); }

  ngOnInit(): void {
    const me = this;
    me.options = [
      { label: 'Last 4 Hours' },
      { label: 'Last 4 Hours' },
      { label: 'Last 4 Hours' },
      { label: 'Last 4 Hours' },
      { label: 'Last 4 Hours' },
      { label: 'Last 4 Hours' },
    ];


  }

  closeClick() {
    const me = this;
    me.hide();
  }

  open() {
    const me = this;
    me.show();
  }

}
