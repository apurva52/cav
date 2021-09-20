import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuItem } from 'primeng';

@Component({
  selector: 'app-create-havoc',
  templateUrl: './create-havoc.component.html',
  styleUrls: ['./create-havoc.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CreateHavocComponent implements OnInit {
  tabs: MenuItem[];
  dropDownItems: any;

  constructor() {}

  ngOnInit(): void {
    const me = this;

    me.tabs = [
      { label: 'STARVE APPLICATION', routerLink: 'starve-application' },
      { label: 'STATE CHANGE' },
      { label: 'NETWORK ASSAULTS' },
    ];

    me.dropDownItems = [
      {
        label: "Linux",
        value: "Linux"
      },
      {
        label: "Kubernetes",
        value: "Kubernetes"
      },
      {
        label: "Docker",
        value: "Docker"
      }
    ]
  }
}
