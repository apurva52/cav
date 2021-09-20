import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-visual-response',
  templateUrl: './visual-response.component.html',
  styleUrls: ['./visual-response.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class VisualResponseComponent implements OnInit {
  
  jsonView: any;
  json: any = {
    "$schema": 'http://json-schema.org/draft-07/schema#',
    "type": 'object',
    "title": 'Object',
    "additionalProperties": false,
    "properties": {
      "string": {
        "type": 'string',
        "title": 'String',
      },
    },
  }

  constructor() {}
  @Input() respdata;
  ngOnChanges() {
    // changes=this.nfdbresponse
    console.log(this.respdata.length)
  console.log
    if(this.respdata.length !== 0){
      console.log("valuee")
      this.ngOnInit()
    }
  }
  ngOnInit(): void {
    this.jsonView = JSON.stringify(this.json,null,2);
    if (this.respdata.length !== 0) {
      console.log("valuee")
     // console.log(this.respdata[0])
      this.jsonView = JSON.stringify(this.respdata,null,2);
     // console.log(this.jsonView)
    }
  }
}
