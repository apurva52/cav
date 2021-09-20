import { Component, OnInit } from '@angular/core';
import { BaseNodeComponent } from 'jsplumbtoolkit-angular';
import { CallbackDesignerService } from '../../service/callback-designer.service';

@Component({
  selector: 'app-question-node',
  templateUrl: './question-node.component.html',
  styleUrls: ['./question-node.component.scss'],
})

export class QuestionNodeComponent extends BaseNodeComponent implements OnInit {
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
