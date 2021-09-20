import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-common-dialog',
  templateUrl: './common-dialog.component.html',
  styleUrls: ['./common-dialog.component.scss']
})
export class CommonDialogComponent implements OnInit {

  @Input('displayObject') displayObject;

  constructor() { 
    console.log("inside common dialog constructor ");
  }

  ngOnInit() {
    console.log("inside Common dialog ");
    console.log(this.displayObject);
  }

}
