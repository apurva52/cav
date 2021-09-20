import { Component, OnInit } from '@angular/core';
import { PageSidebarComponent } from 'src/app/shared/page-sidebar/page-sidebar.component';
import { DBMonitoringService } from '../../services/db-monitoring.services';

@Component({
  selector: 'app-common-stats-filter',
  templateUrl: './common-stats-filter.component.html',
  styleUrls: ['./common-stats-filter.component.scss']
})
export class CommonStatsFilterComponent extends PageSidebarComponent implements OnInit {
  classes = 'page-sidebar';
  
  constructor( ) {
    super();
  }

  ngOnInit(): void {
  }
  show() {
    super.show();
  }

  closeClick() {
    const me = this;
    me.visible = !me.visible;
  }
  
}
