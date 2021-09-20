import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { SelectItem } from 'primeng';
import { PageSidebarComponent } from 'src/app/shared/page-sidebar/page-sidebar.component';

@Component({
  selector: 'app-query-filter',
  templateUrl: './query-filter.component.html',
  styleUrls: ['./query-filter.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class QueryFilterComponent
  extends PageSidebarComponent
  implements OnInit {
  classes = 'page-sidebar';
  score: SelectItem[];
  order: SelectItem[];
  shortByType: SelectItem[];
  indices: any[];
  constructor() {
    super();
  }

  show() {
    super.show();
  }
  ngOnInit(): void {
    const me = this;
    me.score = [
      {
        label: '50',
        value: '50',
      },
      {
        label: '60',
        value: '60',
      },
    ];

    me.order = [
      {
        label: 'Ascending',
        value: 'ascending',
      },
      {
        label: '60',
        value: '60',
      },
    ];

    me.shortByType = [
      {
        label: '_score',
        value: '_score',
      },
      {
        label: '_scores',
        value: '_scores',
      },
    ];

    me.indices = [
      {
        label: 'netForest',
        value: 'netForest',
      },
      {
        label: 'netForest1',
        value: 'netForest1',
      },
    ];
  }
}
