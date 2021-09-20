
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { EDIT_SEARCH_DATA } from './service/editsearch.dummy';
import { EditSearchData } from './service/editsearch.model';

@Component({
  selector: 'app-editsearch',
  templateUrl: './editsearch.component.html',
  styleUrls: ['./editsearch.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EditsearchComponent implements OnInit {
  data: EditSearchData;

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
  constructor() { }

  ngOnInit(): void {
    const me = this;
    this.jsonView = JSON.stringify(this.json,null,2);

    me.data = EDIT_SEARCH_DATA;
  }

  saveSearch(){
    
  }

}
