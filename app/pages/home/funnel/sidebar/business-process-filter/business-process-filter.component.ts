import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { SelectItem } from 'primeng';
import { PageSidebarComponent } from 'src/app/shared/page-sidebar/page-sidebar.component';
import { FunnelComponent } from '../../funnel.component';

@Component({
  selector: 'app-business-process-filter',
  templateUrl: './business-process-filter.component.html',
  styleUrls: ['./business-process-filter.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class BusinessProcessFilterComponent extends PageSidebarComponent implements OnInit {
  classes = 'page-sidebar business-process-manager';

  @Input() Funnel: FunnelComponent;

  businessProcess: SelectItem[];
  timePeriod: SelectItem[];

  constructor() {
    super();
  }

  ngOnInit(): void {
    const me = this;

    me.businessProcess = [
      {
        label: 'business Process',
        value: 'businessProcess',
      },
      {
        label: 'business Process1',
        value: 'businessProcess1',
      },
    ];

    me.timePeriod = [
      { label: 'Last 1 Hour', value: 'last_1_hr' },
      { label: 'Last 4 Hour', value: 'last_4_hr' },
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

  AddNote() {

  }
}
