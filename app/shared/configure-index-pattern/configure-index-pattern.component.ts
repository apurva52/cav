import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-configure-index-pattern',
  templateUrl: './configure-index-pattern.component.html',
  styleUrls: ['./configure-index-pattern.component.scss']
})
export class ConfigureIndexPatternComponent implements OnInit {

  selectedCities: string[] = [];
  checked: boolean = false;
  showConfigureIndexPatternModel: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  open() {
    this.showConfigureIndexPatternModel = true;
  }

  close() {
    this.showConfigureIndexPatternModel = false;
  }

}
