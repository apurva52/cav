import {
  Component,
  Input,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { SelectItem } from 'primeng';
import { PageSidebarComponent } from 'src/app/shared/page-sidebar/page-sidebar.component';
import { NodeIndicesComponent } from '../../cluster-node-info/node-indices/node-indices.component';
import { IndicesClearCacheComponent } from '../../dialogs/indices-clear-cache/indices-clear-cache.component';
import { IndicesFlushComponent } from '../../dialogs/indices-flush/indices-flush.component';
import { IndicesOptimizeComponent } from '../../dialogs/indices-optimize/indices-optimize.component';
import { IndicesRefreshComponent } from '../../dialogs/indices-refresh/indices-refresh.component';

@Component({
  selector: 'app-indices-filter',
  templateUrl: './indices-filter.component.html',
  styleUrls: ['./indices-filter.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class IndicesFilterComponent
  extends PageSidebarComponent
  implements OnInit {
  @Input() indices: NodeIndicesComponent;
  classes = 'page-sidebar';
  inStatus: SelectItem[];
  constructor() {
    super();
  }

  show() {
    super.show();
  }
  ngOnInit(): void {
    const me = this;
    me.inStatus = [
      {
        label: 'All',
        value: 'all',
      },
      {
        label: 'Status',
        value: 'status',
      },
    ];
  }
}
