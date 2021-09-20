import { Component, OnInit } from '@angular/core';
import { BaseNodeComponent } from 'jsplumbtoolkit-angular';

@Component({
  selector: 'app-action-node',
  templateUrl: './action-node.component.html',
  styleUrls: ['./action-node.component.scss']
})
export class ActionNodeComponent extends BaseNodeComponent {

  isNode(obj: any): obj is Node {
    return obj.objectType === 'Node';
  }

  ngOnInit(): void {
  }

}
