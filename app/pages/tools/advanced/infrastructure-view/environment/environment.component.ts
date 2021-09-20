import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-environment',
  templateUrl: './environment.component.html',
  styleUrls: ['./environment.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class EnvironmentComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
