import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuItem, SelectItem } from 'primeng';
import { NODE_MONITOR_DATA } from './service/node-diagnostics.dummy';
import { NodeDiagnostics } from './service/node-diagnostics.model';

@Component({
  selector: 'app-node-diagnostics',
  templateUrl: './node-diagnostics.component.html',
  styleUrls: ['./node-diagnostics.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class NodeDiagnosticsComponent implements OnInit {
  breadcrumb: MenuItem[];
  nodeInfo: SelectItem[];
  nodeData: NodeDiagnostics;
  displaySetting: boolean = false;
  constructor() {}

  ngOnInit(): void {
    const me = this;
    me.breadcrumb = [{ label: 'System' }, { label: 'Cluster Monitor' }];
    me.nodeInfo = [{ label: 'Cq22zz', value: 'cq22zz' }];
    me.nodeData = NODE_MONITOR_DATA;
  }

  editSettings() {
    const me = this;
    me.displaySetting = true;
  }

  saveChanges() {
    const me = this;
    me.displaySetting = false;
  }
}
