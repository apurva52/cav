import { Component, OnInit } from '@angular/core';
import { PageSidebarComponent } from 'src/app/shared/page-sidebar/page-sidebar.component';

@Component({
  selector: 'app-test-run-report',
  templateUrl: './test-run-report.component.html',
  styleUrls: ['./test-run-report.component.scss']
})
export class TestRunReportComponent extends PageSidebarComponent implements OnInit {
  classes = 'test-run-page-sidebar';
  constructor() { super();}

  ngOnInit(): void {
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
