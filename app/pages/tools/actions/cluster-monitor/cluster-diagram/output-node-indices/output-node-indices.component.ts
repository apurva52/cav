import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { EllipsisPipe } from 'src/app/shared/pipes/ellipsis/ellipsis.pipe';

@Component({
  selector: 'app-output-node-indices',
  templateUrl: './output-node-indices.component.html',
  styleUrls: ['./output-node-indices.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [EllipsisPipe],
})
export class OutputNodeIndicesComponent implements OnInit {

  indicesName: string = 'netforest_monitoring-2020-11-20'
  constructor() { }

  ngOnInit(): void {
  }

}
