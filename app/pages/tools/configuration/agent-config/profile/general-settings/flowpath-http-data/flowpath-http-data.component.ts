import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-flowpath-http-data',
  templateUrl: './flowpath-http-data.component.html',
  styleUrls: ['./flowpath-http-data.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FlowpathHttpDataComponent implements OnInit {

  selectedValues: string = 'selectAll';

  constructor() { }

  ngOnInit(): void {
  }

}
