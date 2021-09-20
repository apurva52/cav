import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-hotspot',
  templateUrl: './hotspot.component.html',
  styleUrls: ['./hotspot.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HotspotComponent implements OnInit {

  selectedValues: string = 'select';

  constructor() { }

  ngOnInit(): void {
  }

}
