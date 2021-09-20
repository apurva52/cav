import { Component, OnInit } from '@angular/core';
import { BaseNodeComponent } from 'jsplumbtoolkit-angular';
import { MenuItem } from 'primeng';
import { MenuService } from 'src/app/shared/dashboard/menu.service';
import { NodeInfo } from '../service/transaction-flowmap.model';

@Component({
  selector: 'app-last-level-node',
  templateUrl: './last-level-node.component.html',
  styleUrls: ['./last-level-node.component.scss'],
})
export class LastLevelNodeComponent extends BaseNodeComponent {
  menuOptions1: MenuItem[];
  isShow: boolean;

  radius = 23;
  circumference = 2 * Math.PI * this.radius;
  dashoffsetCC: number;
  dashoffsetMc: number;

  constructor(private menuService: MenuService) {
    super();
  }

  ngOnInit(): void {
    const me = this;
    me.menuOptions1 = [
      {
        label: 'View Flowpath Details',
        command: (event: any) => {
          me.menuService.openSidePanel(true, 'flowPathDetails');
        },
      },
      {
        label: 'DB Request Report',
      },
      {
        label: 'Method Timing Report',
      },
      {
        label: 'HotSpot Threat Details',
      },
      {
        label: 'Current Instance Log',
      },
      {
        label: 'All Instance Log',
      },
      {
        label: 'Show Related Graph',
      },
      {
        label: 'http Report',
      },
    ];
    me.calculateCriticalOffset(this.obj);
    me.calculateMajorOffset(this.obj);
  }

  isNode(obj: any): obj is Node {
    return obj.objectType === 'Node';
  }

  private calculateCriticalOffset(obj: NodeInfo) {
    const circum = obj.serverHealthCriticalCircum / 100;
    this.dashoffsetCC = this.circumference * (1 - circum);
  }

  private calculateMajorOffset(obj: NodeInfo) {
    const circum = obj.serverHealthMajorCircum / 100;
    this.dashoffsetMc = this.circumference * (1 - circum);
  }
}
