import { Component, OnInit } from '@angular/core';
import { PageSidebarComponent } from 'src/app/shared/page-sidebar/page-sidebar.component';

@Component({
  selector: 'app-command-execution',
  templateUrl: './command-execution.component.html',
  styleUrls: ['./command-execution.component.scss']
})
export class CommandExecutionComponent extends PageSidebarComponent implements OnInit {

  classes = 'command-execution-sidebar';
  constructor() {
    super();
  }

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
