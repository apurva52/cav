import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { BaseNodeComponent } from 'jsplumbtoolkit-angular';
import { MenuItem } from 'primeng';
import { EllipsisPipe } from 'src/app/shared/pipes/ellipsis/ellipsis.pipe';
import { NodeInfo } from '../service/transaction-flowmap.model';
import { TransactionFlowpathDetailsComponent } from '../transaction-flowpath-details/transaction-flowpath-details.component';

@Component({
  selector: 'app-output-node-indices',
  templateUrl: './output-node-indices.component.html',
  styleUrls: ['./output-node-indices.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [EllipsisPipe],
})
export class OutputNodeIndicesComponent extends BaseNodeComponent {
  menuOptions1: MenuItem[];
  isShow: boolean;
  @Output() menuClick = new EventEmitter<boolean>();

  radius = 23;
  circumference = 2 * Math.PI * this.radius;
  dashoffsetCC: number;
  dashoffsetMc: number;

  @ViewChild('transactionFlowpathDetailsComponent', { read: TransactionFlowpathDetailsComponent })
  transactionFlowpathDetailsComponent: TransactionFlowpathDetailsComponent;

  ngOnInit(): void {
    const me = this;
    me.menuOptions1 = [
      {
        label: 'View Flowpath Details',
        command: (event: any) => {
          me.transactionFlowpathDetailsComponent.openDownloadFileDialog();
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
  showFlowpathDetails() {
    //this.isShow = true;
    //this.menuClick.emit(this.isShow);
  }
  searchSummaryHide($event) {
    this.isShow = $event;
  }
  showDetails($event) {
    this.isShow = $event;
  }
}
