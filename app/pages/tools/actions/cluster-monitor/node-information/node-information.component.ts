import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MenuItem, SelectItem } from 'primeng';
import { NodeSettingInformationComponent } from '../dialogs/node-setting-information/node-setting-information.component';

@Component({
  selector: 'app-node-information',
  templateUrl: './node-information.component.html',
  styleUrls: ['./node-information.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class NodeInformationComponent implements OnInit {
  breadcrumb: MenuItem[];
  nodeInfo: SelectItem[];
  tabs: MenuItem[];

  @ViewChild(NodeSettingInformationComponent, {
    read: NodeSettingInformationComponent,
  })
  private nodeSettingInformationComponent: NodeSettingInformationComponent;

  constructor() {}

  ngOnInit(): void {
    const me = this;
    me.breadcrumb = [
      { label: 'System' },
      { label: 'Cluster Monitor' },
      { label: 'Node Information' },
    ];
    me.nodeInfo = [{ label: 'Cq22zz', value: 'cq22zz' }];

    me.tabs = [
      { label: 'JVM', routerLink: 'jvm' },
      { label: 'INDICES', routerLink: 'indices' },
      { label: 'OPERATING SYSTEM', routerLink: 'operating-systems' },
      { label: 'PROCESS', routerLink: 'process' },
      { label: 'THREAD POOLS', routerLink: 'thread-pools' },
      { label: 'NETWORK', routerLink: 'network' },
      { label: 'FILE SYSTEM', routerLink: 'file-system' },
    ];
  }

  viewInfo() {}

  openNodeInfoSetting() {
    this.nodeSettingInformationComponent.show();    
  }
}
