import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { BaseNodeComponent } from 'jsplumbtoolkit-angular';

@Component({
  selector: 'app-output-node',
  templateUrl: './output-node.component.html',
  styleUrls: ['./output-node.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class OutputNodeComponent extends BaseNodeComponent {

  ngOnInit(): void {
  }

}
