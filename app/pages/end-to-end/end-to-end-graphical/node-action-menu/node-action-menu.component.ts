import { PlatformLocation } from '@angular/common';
import { ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import {
  Component,
  Input,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { MenuItem, TieredMenu } from 'primeng';
import { NodeActionSidebarComponent } from '../../sidebars/node-action-sidebar/node-action-sidebar.component';
import { EndToEndGraphicalComponent } from '../end-to-end-graphical.component';
import { EndToEndNode } from '../service/end-to-end-graphical.model';
// import { EventEmitter } from 'protractor';

@Component({
  selector: 'app-node-action-menu',
  templateUrl: './node-action-menu.component.html',
  styleUrls: ['./node-action-menu.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class NodeActionMenuComponent implements OnInit {
  items: MenuItem[];
  items3: MenuItem[];

  @Input() Graphical: EndToEndGraphicalComponent;
  @Input() solarNodeData: EndToEndNode;

  @ViewChild(TieredMenu, { read: TieredMenu }) tieredMenu: TieredMenu;

  @ViewChild(NodeActionSidebarComponent, { read: NodeActionSidebarComponent })
  private nodeActionSidebarComponent: NodeActionSidebarComponent;

  constructor(
    private platformLocation: PlatformLocation,
    private cd: ChangeDetectorRef
  ) {
    platformLocation.onPopState(() => (this.tieredMenu.popup = false));
  }

  ngOnInit(): void {
    const me = this;
    this.items = [
      {
        label: 'Drill Down',
        items: [
          {
            label: 'Flowpath By Response Time',
          },
          {
            label: 'Flowpath By callout error',
          },

          {
            label: 'DB Query',
            items: [
              {
                label: 'All DB',
                items: [
                  { label: 'Show DB call by Response time' },
                  { label: 'Top DB Call by count' },
                  { label: 'DB Call by Business Transaction' },
                  { label: 'Top DB Queries by error count' },
                ],
              },
            ],
          },
          {
            label: 'Hotspots',
          },
          {
            label: 'Method By Response time',
          },
          {
            label: 'Exception',
          },
          {
            label: 'BT IP Summary',
          },
        ],
      },
      {
        label: 'Top 10 Transaction By',
        items: [
          {
            label: 'Response Time',
            command(e) {
	     if (me.solarNodeData) {
                me.Graphical.openNodeTransactionSidebar(me.solarNodeData.nodeName);
              }
            },
          },
          {
            label: 'TPS',
            command(e) {
	     if (me.solarNodeData) {
                me.Graphical.openNodeTransactionSidebar(me.solarNodeData.nodeName);
              }
            },
          },
        ],
      },
      {
        label: 'Group',
        items: [
          {
            label: 'Group Tier',
            command: (event: any) => {
	   if (me.solarNodeData) {
                me.Graphical.openNewGroupDialog(me.solarNodeData.nodeName);
              }
            },
          },
        ],
      },
      {
        label: 'Show Dashboard',
        command(e) {
	  if (me.solarNodeData) {
	      me.Graphical.openNodeShowDashboardSidebar(me.solarNodeData);
	  }
        },
      },
      {
        label: 'Show Tier Information',
        command(e) {
          if(me.solarNodeData)
            me.Graphical.openTierInformation(me.solarNodeData.nodeName);
        },
      },
      {
        label: 'Show Flowmap for Selected Tier',
        items: [
          {
            label: 'Upto 1 level',
          },
          {
            label: 'Upto n level',
          },
        ],
      },
      {
        label: 'Hide Tier Integration',
      },
      {
        label: 'Change Icon',
        command(e) {
          me.Graphical.openNodeRepresentationSidebar();
        },
      },
      {
        label: 'Instance Recycle History',
      },
      {
        label: 'Search By',
        command(e) {
          me.Graphical.openNodeSearchSidebar();
        },
      },
    ];

    this.items3 = [
      {
        label: 'Drill Down',
        command: (event: any) => {
          // this.router.navigate(['/end-to-end/end-to-end-tier-level']);
        },
      },
      {
        label: 'Rename Integration Point',
        command: (event: any) => {
          //  me.displayRIPPopup = true;
        },
      },
      {
        label: 'Map Integration Point to Tier',
        command: (event: any) => {
          // me.displayMIPPopup = true;
        },
      },
      {
        label: 'Change Node Representation',
        command: (event: any) => {
          this.nodeActionSidebarComponent.nodeRepresentationVisible(true);
        },
      },
      {
        label: 'Hide Integration Point',
      },
      {
        label: 'Reset Integration Point Names',
        command: (event: any) => {
          // me.displayRIPNPopup = true;
        },
      },
      {
        label: 'Rename Multiple IP(s)',
        command: (event: any) => {
          // me.displayRMIPNPopup = true;
        },
      },
      {
        label: 'Call Details',
        command: (event: any) => {
          // me.displayCDPopup = true;
        },
      },
    ];
  }
}
