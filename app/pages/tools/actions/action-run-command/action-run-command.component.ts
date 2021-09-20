import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuItem } from 'primeng';

@Component({
  selector: 'app-run-command',
  templateUrl: './action-run-command.component.html',
  styleUrls: ['./action-run-command.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ActionRunCommandComponent implements OnInit {
  tabs: MenuItem[];

  constructor() {}

  ngOnInit(): void {
    const me = this;
    me.tabs = [
      { label: 'New Command', routerLink: 'new-command' },
      { label: 'Command List', routerLink: 'command-list' },
      { label: 'Scheduled Command', routerLink: 'scheduled-command' },
    ];
  }
}
