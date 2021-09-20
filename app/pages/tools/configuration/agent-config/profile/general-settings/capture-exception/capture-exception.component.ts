import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-capture-exception',
  templateUrl: './capture-exception.component.html',
  styleUrls: ['./capture-exception.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CaptureExceptionComponent implements OnInit {

  selectedValues: string = 'selectAll';

  constructor() { }

  ngOnInit(): void {
  }

}
