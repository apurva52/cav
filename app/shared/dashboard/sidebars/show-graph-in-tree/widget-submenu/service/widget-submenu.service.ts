import { Injectable } from '@angular/core';
import { Store } from 'src/app/core/store/store';
import { Observable, Subject } from 'rxjs';
import { MenuItem } from 'primeng/api';
import { WidgetDrillDownSubmenuLoadedState } from './widget-submenu.state';

@Injectable({
  providedIn: 'root',
})
export class WidgetSubmenuService extends Store.AbstractService {
  loadDrillDownSubmenu(): Observable<Store.State> {
    const me = this;
    const output = new Subject<Store.State>();

    // setTimeout(() => {
    //   output.next(new WidgetDrillDownMenuLoadingState());
    // }, 0);

    /// DEV CODE ----------------->

    const optionsData: MenuItem[] = [
      { label: 'Merge with Selected Widget' },
      { label: 'Show Description' },
      { label: 'Add Derived Graph' },
      {
        label: 'Open Metrics',
        items: [
          {
            label: 'All Zero',
            items: [
              { label: 'All Tirers' },
              { label: 'All Server of Same Tire (cavisson)' },
              {
                label: 'Same Server (NDApplication)',
                items: [
                  {
                    label: 'All Tier',
                  },
                ],
              },
            ],
          },
          {
            label: 'Non Zero',
            items: [
              { label: 'All Tirers' },
              { label: 'All Server of Same Tire (cavisson)' },
              {
                label: 'Same Server (NDApplication)',
                items: [
                  {
                    label: 'All Tier',
                  },
                ],
              },
            ],
          },
          {
            label: 'Zero',
            items: [
              { label: 'All Tirers' },
              { label: 'All Server of Same Tire (cavisson)' },
              {
                label: 'Same Server (NDApplication)',
                items: [
                  {
                    label: 'All Tier',
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        label: 'Merge Metrics',
        items: [
          {
            label: 'All Zero',
            items: [
              { label: 'All Tirers' },
              { label: 'All Server of Same Tire (cavisson)' },
              {
                label: 'Same Server (NDApplication)',
                items: [
                  {
                    label: 'All Tier',
                  },
                ],
              },
            ],
          },
          {
            label: 'Non Zero',
            items: [
              { label: 'All Tirers' },
              { label: 'All Server of Same Tire (cavisson)' },
              {
                label: 'Same Server (NDApplication)',
                items: [
                  {
                    label: 'All Tier',
                  },
                ],
              },
            ],
          },
          {
            label: 'Zero',
            items: [
              { label: 'All Tirers' },
              { label: 'All Server of Same Tire (cavisson)' },
              {
                label: 'Same Server (NDApplication)',
                items: [
                  {
                    label: 'All Tier',
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        label: 'Advance Open/Merge',
        command: () => {
          console.log("it works")
        }
      },
      {
        label: 'Compare Group Member',
        items: [
          {
            label: 'Same Server (NDApplication)',
            items: [
              { label: 'Same Tier (cavisson)' },
              { label: 'All Tier' },
              { label: 'All (Seperate Panel) Tier' },
            ],
          },
          {
            label: 'All Server ',
            items: [
              { label: 'Same Tier (cavisson)' },
              { label: 'All Tier' },
              { label: 'All (Seperate Panel) Tier' },
            ],
          },
          {
            label: 'All (Seperate Panel) Server',
            items: [
              { label: 'Same Tier (cavisson)' },
              { label: 'All Tier' },
              { label: 'All (Seperate Panel) Tier' },
            ],
          },
        ],
      },
    ];

    setTimeout(() => {
      output.next(new WidgetDrillDownSubmenuLoadedState(optionsData));
    }, 2000);

    // <----------------- DEV CODE

    // const path = environment.api.widgetDrillDownSubmenu.load.endpoint;

    // me.controller.post(path).subscribe(
    //   (data: WidgetDrillDownMenu) => {
    //     output.next(new WidgetDrillDownSubmenuLoadedState(data));
    //     output.complete();
    //   },
    //   (e: any) => {
    //     output.error(new WidgetDrillDownSubmenuLoadingErrorState(e));
    //     output.complete();

    //     me.logger.error('Widget Drilldown Submenu loading failed', e);
    //   }
    // );

    return output;
  }
}
