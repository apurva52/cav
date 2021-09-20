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
import { TransactionFlowmapComponent } from '../transaction-flowmap.component';

@Component({
  selector: 'app-output-node-indices',
  templateUrl: './output-node-indices.component.html',
  styleUrls: ['./output-node-indices.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [EllipsisPipe],
})
export class OutputNodeIndicesComponent extends BaseNodeComponent {
  menuOptions: MenuItem[];
  menuOptions1: MenuItem[];
  isShow: boolean;
  @Output() menuClick = new EventEmitter<boolean>();

  radius = 23;
  circumference = 2 * Math.PI * this.radius;
  dashoffsetCC: number;
  dashoffsetMc: number;

  @ViewChild('transactionFlowpathDetailsComponent', { read: TransactionFlowpathDetailsComponent })
  transactionFlowpathDetailsComponent: TransactionFlowpathDetailsComponent;
constructor(private transactionFlowmapComponent: TransactionFlowmapComponent){
  super();
}
  ngOnInit(): void {
    const me = this;
    me.menuOptions = [
      {
        label: 'View Flowpath Details',
        command: (event: any) => {
          me.transactionFlowpathDetailsComponent.openDownloadFileDialog();
        },
      },
      {
        label: 'DB Request Report',
        command: (event: any) => {
          me.transactionFlowmapComponent.openDbReport();
        },
      },
      {
        label: 'Method Timing Report',
        command: (event: any) => {
          me.transactionFlowmapComponent.openMethodTimingReport();
        },
      },
      {
        label: 'Method Call Details',
        command: (event: any) => {
          me.transactionFlowmapComponent.openMCTReport();
        },
      },
      {
        label: 'HotSpot Thread Details',
        command: (event: any) => {
          me.transactionFlowmapComponent.openHotSpotReport();
        },
      },
      {
        label: 'Current Instance Log',
        command: (event: any) => {
          me.transactionFlowmapComponent.openNetForest(0);
        },
      },
      {
        label: 'All Instance Log',
        command: (event: any) => {
          me.transactionFlowmapComponent.openNetForest(1);
        },
      },
      {
        label: 'Show Related Graph',
      },
      {
        label: 'HTTP Report',
        command: (event: any) => {
          me.transactionFlowmapComponent.openHttpReport();
        },
      },
    ];
    me.menuOptions1 = [
      {
        label: 'View Query Details',
        command: (event: any) => {
          me.transactionFlowpathDetailsComponent.openDownloadFileDialog();
        }
      }
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
