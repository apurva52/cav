import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { MenuItem } from 'primeng';
import { WidgetSubmenuService } from './service/widget-submenu.service';
import { WidgetDrillDownSubmenuLoadedState } from './service/widget-submenu.state';
import { Store } from 'src/app/core/store/store';
import { DashboardComponent } from '../../../dashboard.component';
import { ShowGraphInTreeComponent } from '../show-graph-in-tree.component';
import { MetricsSettingsService } from '../../../../../shared/metrics-settings/service/metrics-settings.service'
import { RelatedMetricsService } from '../../../../../shared/metrics/relatedmetrics/service/relatedmetrics.service';

@Component({
  selector: 'app-widget-submenu',
  templateUrl: './widget-submenu.component.html',
  styleUrls: ['./widget-submenu.component.scss'],
})
export class WidgetSubmenuComponent implements OnInit {
  @Input() dashboard: DashboardComponent;
  @Input() childShowGraphInTree: ShowGraphInTreeComponent;
  data: MenuItem[];
  empty: boolean;
  mergeArr = [];

  constructor(
    private widgetSubmenuService: WidgetSubmenuService,
    private cd: ChangeDetectorRef,
    private relatedMetricsService: RelatedMetricsService,
    private metricsSettingsService: MetricsSettingsService,
  ) { }

  ngOnInit(): void {
    const me = this;
    me.mergeArr = [
      { "id": 0, "value": "All", "label": "All" },
      { "id": 1, "value": "Non Zero", "label": "Non Zero" },
      { "id": 2, "value": "Zero", "label": "Zero" }
    ];
    let menuData = me.childShowGraphInTree.menuData[0].TreeMenu.GraphLevel;
    me.data = menuData;
    this.setActionCommandOnMenuItems(me.data)
    // menuData = {
    //   TreeMenu: {
    //     GroupLevel: [
    //       {
    //         label: 'Open',
    //         items: [
    //           {
    //             label: 'Group Metrics',
    //             items: [
    //               {
    //                 label: 'All'
    //               },
    //               {
    //                 label: 'Zero'
    //               },
    //               {
    //                 label: 'Non Zero'
    //               }
    //             ]
    //           },
    //           {
    //             label: 'All'
    //           },
    //           {
    //             label: 'Zero'
    //           },
    //           {
    //             label: 'Non Zero'
    //           }
    //         ]
    //       },
    //       {
    //         label: 'Merge',
    //         items: [
    //           {
    //             label: 'Group Metrics',
    //             items: [
    //               {
    //                 label: 'All'
    //               },
    //               {
    //                 label: 'Zero'
    //               },
    //               {
    //                 label: 'Non Zero'
    //               }
    //             ]
    //           },
    //           {
    //             label: 'All'
    //           },
    //           {
    //             label: 'Zero'
    //           },
    //           {
    //             label: 'Non Zero'
    //           }
    //         ]
    //       },
    //       {
    //         label: 'Compare Members',
    //         items: [
    //           {
    //             label: 'All'
    //           },
    //           {
    //             label: 'Zero'
    //           },
    //           {
    //             label: 'Non Zero'
    //           }
    //         ]
    //       },
    //       {
    //         label: 'Advance'
    //       },
    //       {
    //         label: 'Create Derived Metrics',
    //         items: [
    //           {
    //             label: 'Group By'
    //           },
    //           {
    //             label: 'Rollup By'
    //           },
    //           {
    //             label: 'Advance'
    //           }
    //         ]
    //       },
    //       {
    //         label: 'Show Description'
    //       }
    //     ],
    //     GraphLevel: [
    //       {
    //         label: 'Open',
    //         items: [
    //           {
    //             label: 'All'
    //           },
    //           {
    //             label: 'Zero'
    //           },
    //           {
    //             label: 'Non Zero'
    //           }
    //         ]
    //       },
    //       {
    //         label: 'Merge',
    //         items: [
    //           {
    //             label: 'With Selected Widget'
    //           },
    //           {
    //             label: 'All',
    //             command: () => {
    //               let hirerchyEvent = me.childShowGraphInTree.parentTreeHirerchyData;
    //               me.dashboard.openMergeMetrics(hirerchyEvent, me.mergeArr[0].value);
    //             }
    //           },
    //           {
    //             label: 'Zero',
    //             command: () => {
    //               let hirerchyEvent = me.childShowGraphInTree.parentTreeHirerchyData;
    //               me.dashboard.openMergeMetrics(hirerchyEvent, me.mergeArr[2].value);
    //             }
    //           },
    //           {
    //             label: 'Non Zero',
    //             command: () => {
    //               let hirerchyEvent = me.childShowGraphInTree.parentTreeHirerchyData;
    //               me.dashboard.openMergeMetrics(hirerchyEvent, me.mergeArr[1].value);
    //             }
    //           }
    //         ]
    //       },
    //       {
    //         label: 'Compare Members',
    //         items: [
    //           {
    //             label: 'All'
    //           },
    //           {
    //             label: 'Zero'
    //           },
    //           {
    //             label: 'Non Zero'
    //           }
    //         ]
    //       },
    //       {
    //         label: 'Advance'
    //       },
    //       {
    //         label: 'Create Derived Metrics',
    //         items: [
    //           {
    //             label: 'Group By',
    //             command: () => {
    //               me.dashboard.openGroupedDerivedMetricesDialog();
    //             }
    //           },
    //           {
    //             label: 'RollUp By',
    //             command: () => {
    //               me.dashboard.openAggregatedDerivedMetricesDialog();
    //             }
    //           },
    //           {
    //             label: 'Advance',
    //             command: () => {
    //               me.dashboard.openDerivedMetricDialog();
    //             }
    //           }
    //         ]
    //       },
    //       {
    //         label: 'Show Description',
    //         command: () => {
    //           me.dashboard.openMetricDesc();
    //         }
    //       }
    //     ]
    //   }
    // };

    // me.data = menuData.TreeMenu.GraphLevel;

  }


  commonMenuClickActionHandler(event, label) {
    const me = this;
    //alert("hiiiii");
    console.log("event === ", event);
    console.log("label === ", label);
    if (label === "Open Related Metrics" && (event.item.label === "Advance...")) {
      let hierarchy = me.childShowGraphInTree.subjectsTags.reverse();
      me.relatedMetricsService.setOpenRelatedsubjectsTags(hierarchy);
      me.dashboard.openRelatedMetrics(me.dashboard);
    } else if (label === "Open Related Metrics" && (event.item.label === "All" || event.item.label === "Zero"
      || event.item.label === "Non Zero")) {
      ///
    }
    if (label === "Open/Merge/Compare Metrics" && (event.item.label === "Advance...")) {
      let hierarchy = me.childShowGraphInTree.subjectsTags.reverse();
      me.metricsSettingsService.setMetaDataInfo(hierarchy);
      me.dashboard.openMetricsSettings(me.dashboard);
    } else if (label === "Open/Merge/Compare Metrics" && (event.item.label === "All" || event.item.label === "Zero"
      || event.item.label === "Non Zero")) {
      ///
    }
    else if (event.item.label === "Parameterize") {
      console.log("event update Parameterized :", event);
      console.log("childShowGraphInTree :", me.childShowGraphInTree.parentTreeHirerchyData);
      me.dashboard.openParam(me.childShowGraphInTree.parentTreeHirerchyData, null);
    }
    // if(event.item.label === "") {

    // }
  }

  setActionCommandOnMenuItems(arrNavMenu) {
    console.log("arrNavMenu", arrNavMenu);
    for (let i = 0; i < arrNavMenu.length; i++) {
      const item = arrNavMenu[i].items;

      if (item && item.length > 0) {
        for (let j = 0; j < item.length; j++) {
          if (!item[j].items) {
            console.log("arrNavMenu item[j] :", item[j]);
            item[j]['command'] = (event) => {
              this.commonMenuClickActionHandler(event, arrNavMenu[i].label);
            };
          } else if (item[j].items && item[j].items.length > 0) {
            for (let k = 0; k < item[j].items.length; k++) {
              if (!item[j].items[k].items) {
                item[j].items[k]['command'] = (event) => {
                  this.commonMenuClickActionHandler(event, arrNavMenu[i].label);
                };
              } else if (item[j].items[k].items && item[j].items[k].items.length > 0) {
                for (let l = 0; l < item[j].items[k].items.length; l++) {
                  if (!item[j].items[k].items[l].items) {
                    item[j].items[k].items[l]['command'] = (event) => {
                      this.commonMenuClickActionHandler(event, arrNavMenu[i].label);
                    };
                  }
                }
              }
            }

          }

        }

      } else if (!arrNavMenu[i].items) {
        arrNavMenu[i]['command'] = (event) => {
          this.commonMenuClickActionHandler(event, arrNavMenu[i].label);
        };

      }
    }
  }




  load() {
    const me = this;

    me.widgetSubmenuService
      .loadDrillDownSubmenu()
      .subscribe((state: Store.State) => {
        if (state instanceof WidgetDrillDownSubmenuLoadedState) {
          me.onLoaded(state);
          return;
        }
      });
  }

  private onLoaded(state: WidgetDrillDownSubmenuLoadedState) {
    const me = this;
    me.data = state.data;
    me.empty = !me.data.length;
  }
}
