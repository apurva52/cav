import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-pattern-configuration',
  templateUrl: './pattern-configuration.component.html',
  styleUrls: ['./pattern-configuration.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PatternConfigurationComponent implements OnInit {
  settings:string;
  constructor() { }

  ngOnInit(): void {
  }

}
