import { Component, OnInit } from '@angular/core';
import { BaseNodeComponent } from 'jsplumbtoolkit-angular';

@Component({
  selector: 'app-output-node',
  templateUrl: './output-node.component.html',
  styleUrls: ['./output-node.component.scss'],
})
export class OutputNodeComponent extends BaseNodeComponent {
  ngOnInit(): void {}
}
