import { Component, Input, OnInit } from '@angular/core';
import { MenuItem } from 'primeng';
import { Store } from 'src/app/core/store/store';
import { DashboardComponent } from '../../../dashboard.component';
import { TreeSubmenuService } from '../tree-submenu/service/tree-submenu.service';
import {
  TreeSubMenuLoadingState,
  TreeSubMenuLoadedState,
  TreeSubMenuLoadingErrorState
} from './service/tree-submenu.state';
import { ShowGraphInTreeComponent } from '../show-graph-in-tree.component';
import {RelatedMetricsService } from '../../../../metrics/relatedmetrics/service/relatedmetrics.service';



@Component({
  selector: 'app-tree-submenu',
  templateUrl: './tree-submenu.component.html',
  styleUrls: ['./tree-submenu.component.scss']
})
export class TreeSubmenuComponent implements OnInit {

  data: MenuItem[];
  @Input() dashboard: DashboardComponent;
  @Input() childShowGraphInTree: ShowGraphInTreeComponent;
  empty: boolean;
  error: boolean;
  loading: boolean;

  constructor(private treeSubmenuService: TreeSubmenuService, private relatedMetricsService:RelatedMetricsService) { }

  ngOnInit(): void {
    const me = this;
    let menuArr = me.childShowGraphInTree.menuData[0].TreeMenu.NodeLevel;
    me.data = menuArr;
    me.setActionCommandOnMenuItems(me.data);
  }


  loadTreeSubMenu() {
    const me = this;
    me.treeSubmenuService.loadTreeSubMenu().subscribe(
      (state: Store.State) => {
        if (state instanceof TreeSubMenuLoadingState) {
          me.onLoading(state);
          return;
        }

        if (state instanceof TreeSubMenuLoadedState) {
          me.onLoaded(state);
          return;
        }
      },
      (state: TreeSubMenuLoadingErrorState) => {
        me.onLoadingError(state);
      }
    );
  }

  private onLoading(state: TreeSubMenuLoadingState) {
    const me = this;
    me.data = null;
    me.empty = false;
    me.error = null;
    me.loading = true;
  }

  private onLoaded(state: TreeSubMenuLoadedState) {
    const me = this;

    me.data = state.data;
    me.empty = !me.data.length;
    me.error = false;
    me.loading = false;
  }

  private onLoadingError(state: TreeSubMenuLoadingErrorState) {
    const me = this;
    me.data = null;
    me.empty = false;
    me.error = true;
    me.loading = true;
  }

  clicked(event){
    console.log("event clicked:",event);
  }

  commonMenuClickActionHandler(event,label) {
    const me = this;
    if(label === "Open Related Metrics" && (event.item.label === "Advance...")){
      let hierarchy = me.childShowGraphInTree.subjectsTags.reverse();
     me.relatedMetricsService.setOpenRelatedsubjectsTags(hierarchy);
      me.dashboard.openRelatedMetrics(me.dashboard);
    }else if(label === "Open Related Metrics" && (event.item.label === "All" || event.item.label === "Zero"
     || event.item.label === "Non Zero")){
     ///
     }
    else if(event.item.label === "Parameterize"){
          me.dashboard.openParam(me.childShowGraphInTree.parentTreeHirerchyData, null);
    }

  }

  setActionCommandOnMenuItems(arrNavMenu) {

    for (let i = 0; i < arrNavMenu.length; i++) {
      const item = arrNavMenu[i].items;



      if (item && item.length > 0) {
        for (let j = 0; j < item.length; j++) {
          if (!item[j].items) {

            item[j]['command'] = (event) => {
              this.commonMenuClickActionHandler(event,arrNavMenu[i].label);
            };
          } else if (item[j].items && item[j].items.length > 0) {
            for (let k = 0; k < item[j].items.length; k++) {
              if (!item[j].items[k].items) {
                item[j].items[k]['command'] = (event) => {
                  this.commonMenuClickActionHandler(event,arrNavMenu[i].label);
                };
              } else if (item[j].items[k].items && item[j].items[k].items.length > 0) {
                for (let l = 0; l < item[j].items[k].items.length; l++) {
                  if (!item[j].items[k].items[l].items) {
                    item[j].items[k].items[l]['command'] = (event) => {
                      this.commonMenuClickActionHandler(event,arrNavMenu[i].label);
                    };
                  }
                }
              }
            }

          }

        }

      } else if (!arrNavMenu[i].items) {
        arrNavMenu[i]['command'] = (event) => {
          this.commonMenuClickActionHandler(event,arrNavMenu[i].label);
        };

      }
    }
  }

}

