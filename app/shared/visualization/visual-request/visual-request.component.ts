import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { VisualizationService } from 'src/app/pages/create-visualization/service/visualization.service';
import { NfLogsService } from 'src/app/pages/home/logstab/service/nf-logs.service';

@Component({
  selector: 'app-visual-request',
  templateUrl: './visual-request.component.html',
  styleUrls: ['./visual-request.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class VisualRequestComponent implements OnInit {

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


  constructor(private nf:NfLogsService,private vs:VisualizationService) { }

  ngOnInit(): void {
    this.jsonView = JSON.stringify(this.json,null,2);
  //  console.log(this.nf.requestpayload)
    if(this.nf.requestpayload!=undefined){
      this.jsonView = JSON.stringify(this.nf.requestpayload,null,2);
    }
    if(this.vs.requestpayload!=undefined){
      this.jsonView = JSON.stringify(this.vs.requestpayload,null,2);
    }
  }

}
