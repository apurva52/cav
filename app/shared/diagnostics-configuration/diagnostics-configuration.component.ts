import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-diagnostics-configuration',
  templateUrl: './diagnostics-configuration.component.html',
  styleUrls: ['./diagnostics-configuration.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DiagnosticsConfigurationComponent implements OnInit {
  showTabs;
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

  closeDialog(){
    this.displayDetails = false;
  }


}
