import { Component, OnInit } from '@angular/core';
import { BaseNodeComponent } from 'jsplumbtoolkit-angular';
import { CallbackDesignerService } from '../../service/callback-designer.service';

@Component({
  selector: 'app-state-node',
  templateUrl: './state-node.component.html',
  styleUrls: ['./state-node.component.scss']
})
export class StateNodeComponent extends BaseNodeComponent implements OnInit {

  constructor(private cbService: CallbackDesignerService) {
    super();
  }

  ngOnInit(): void {
  }

  editNode(obj): void {
    this.cbService.broadcast('editStateNode', obj);
  }

  deleteNode(obj): void {
    this.cbService.broadcast('deleteStateNode', obj);
  }

}
