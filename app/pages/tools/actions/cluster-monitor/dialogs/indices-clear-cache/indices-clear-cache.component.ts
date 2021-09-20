import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { PageDialogComponent } from 'src/app/shared/page-dialog/page-dialog.component';
import { NodeIndicesComponent } from '../../cluster-node-info/node-indices/node-indices.component';

@Component({
  selector: 'app-indices-clear-cache',
  templateUrl: './indices-clear-cache.component.html',
  styleUrls: ['./indices-clear-cache.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class IndicesClearCacheComponent
  extends PageDialogComponent
  implements OnInit {
  @Input() indices: NodeIndicesComponent;
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
  constructor() {
    super();
  }
  show() {
    super.show();
  }

  ngOnInit(): void {
    this.jsonView = {
      _shards: {
        total: 113,
        successful: 112,
        failed: 0,
      },
    };
  }

  public saveChanges() {
    super.hide();
  }
}
