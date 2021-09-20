import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-ip-summary-open-box',
  templateUrl: './ip-summary-open-box.component.html',
  styleUrls: ['./ip-summary-open-box.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class IpSummaryOpenBoxComponent implements OnInit {

  showTabs : any;
  displayDetails: boolean;
  constructor() { }

  ngOnInit(): void {
    this.showTabs = {
      "one": true,
      "two": true,
    };
  }
  showInstrumentationDetails(){
    this.displayDetails = true;
  }
}
