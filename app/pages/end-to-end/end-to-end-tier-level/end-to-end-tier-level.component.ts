import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MenuItem, OverlayPanel } from 'primeng';
import { AppError } from 'src/app/core/error/error.model';
import { Store } from 'src/app/core/store/store';
import { EndToEnd} from '../service/end-to-end.model';
import { EndToEndService } from '../service/end-to-end.service';
import { EndToEndDataLoadingState, EndToEndDataLoadedState, EndToEndDataLoadingErrorState } from '../service/end-to-end.state';

@Component({
  selector: 'app-end-to-end-tier-level',
  templateUrl: './end-to-end-tier-level.component.html',
  styleUrls: ['./end-to-end-tier-level.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EndToEndTierLevelComponent implements OnInit {
  @ViewChild('op1') op1: OverlayPanel;

  toggleOverlay = ({ originalEvent }) => this.op1.toggle(originalEvent);
  showLegends: boolean = false;
  data: EndToEnd;
  error: AppError;
  loading: boolean;
  empty: boolean;
  items: MenuItem[];
  breadcrumb: MenuItem[];

  selectedNodes: any;
  filteredNodes: any[];
  
  constructor(
    private endtoendService: EndToEndService
  ) { }

  ngOnInit(): void {

    const me = this;
    me.load();
    me.breadcrumb = [
      { label: 'System' },
      { label: 'End To End Tier' },
    ]

    me.items = [
      {
        label: 'Save',
      },
      {
        label: 'Save As',
        command: this.toggleOverlay,
      }
    ];

  }

  filterNodes(event) {
    let filtered : any[] = [];
    let query = event.query;
    // for(let i = 0; i < this.data.options.nodesGroup.length; i++) {
    //     let nodesall = this.data.options.nodesGroup[i];
    //     if (nodesall.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
    //         filtered.push(nodesall);
    //     }
    // }
    
    this.filteredNodes = filtered;
  }

  load() {
    const me = this;
    // me.endtoendService.load().subscribe(
    //   (state: Store.State) => {
    //     if (state instanceof EndToEndDataLoadingState) {
    //       me.onLoading(state);
    //       return;
    //     }
    //     if (state instanceof EndToEndDataLoadedState) {
    //       me.onLoaded(state);
    //       return;
    //     }
    //   },
    //   (state: EndToEndDataLoadingErrorState) => {
    //     me.onLoadingError(state);
    //   }
    // );
  }

  private onLoading(state: EndToEndDataLoadingState) {
    const me = this;
    me.error = null;
    me.loading = true;
  }

  private onLoadingError(state: EndToEndDataLoadingErrorState) {
    const me = this;
    me.data = null;
    me.error = state.error;
    me.loading = false;
  }

  private onLoaded(state: EndToEndDataLoadedState) {
    const me = this;
    me.data = state.data;
    me.error = null;
    me.loading = false;

  }


}
