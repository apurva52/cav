import { Component, OnInit } from '@angular/core';
import { BaseNodeComponent } from 'jsplumbtoolkit-angular';

@Component({
  selector: 'app-end-node',
  templateUrl: './end-node.component.html',
  styleUrls: ['./end-node.component.scss']
})
export class EndNodeComponent extends BaseNodeComponent implements OnInit {

  constructor() {
    super();
  }

  ngOnInit(): void {
  }

}
