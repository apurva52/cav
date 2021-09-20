import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { BaseNodeComponent } from 'jsplumbtoolkit-angular';
import { ConfirmationService } from 'primeng';
import { CallbackDesignerService } from '../../service/callback-designer.service';

@Component({
  selector: 'app-action-node',
  templateUrl: './action-node.component.html',
  styleUrls: ['./action-node.component.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class ActionNodeComponent extends BaseNodeComponent implements OnInit {
  overflow: boolean;
  constructor(private cbService: CallbackDesignerService) {
    super();
  }

  ngOnInit(): void {
    this.cbService.on('overflow').subscribe((val: boolean) => {
      this.overflow = val;
    });
  }

  editNode(obj): void {
    this.cbService.broadcast('editFlowchartNode', obj);
  }

  deleteNode(obj): void {
    this.cbService.broadcast('deleteFlowchartNode', obj);
  }

}
