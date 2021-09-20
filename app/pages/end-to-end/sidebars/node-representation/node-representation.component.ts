import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { PageSidebarComponent } from 'src/app/shared/page-sidebar/page-sidebar.component';

@Component({
  selector: 'app-node-representation',
  templateUrl: './node-representation.component.html',
  styleUrls: ['./node-representation.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class NodeRepresentationComponent
  extends PageSidebarComponent
  implements OnInit {
  visible: boolean = false;
  constructor() {
    super();
  }
  nodes: any[];

  ngOnInit(): void {
    this.nodes = [
      {
        icon: 'icons8-java',
        label: 'java',
        selected: false,
      },
      {
        icon: 'icons8-php-logo',
        label: 'PHP',
        selected: false,
      },
      {
        icon: 'icons8-node-js',
        label: 'Node Js',
        selected: false,
      },
      {
        icon: 'icons8-database',
        label: 'Database',
        selected: false,
      },
      {
        icon: 'icons8-python',
        label: 'Python',
        selected: false,
      },

      {
        icon: 'icons8-genealogy',
        label: 'LDAP',
        selected: false,
      },
      {
        icon: 'icons8-computer',
        label: 'Machine',
        selected: false,
      },
      {
        icon: 'icons8-globe',
        label: 'HTTP',
        selected: false,
      },
      {
        icon: 'icons8-indeterminate-checkbox',
        label: 'Default',
        selected: false,
      },
    ];
  }
}
