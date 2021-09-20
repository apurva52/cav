import {
  Component,
  OnInit,
  ViewChild,
  ViewContainerRef,
  ComponentFactoryResolver,
  ComponentRef,
  ViewEncapsulation,
  AfterViewInit,
  Input,
} from '@angular/core';
import { MenuItem } from 'primeng';
import { RevenueTableComponent } from './revenue-table/revenue-table.component';
import { KPIPre, KPIDurationConfig, KPIDataCenter } from '../service/kpi.model';
import { KPIService } from '../service/kpi.service';


@Component({
  selector: 'app-kpi-revenue',
  templateUrl: './kpi-revenue.component.html',
  styleUrls: ['./kpi-revenue.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class KpiRevenueComponent implements OnInit, AfterViewInit {
  emptyText: boolean;
  error: boolean;
  loading: boolean;

  data: KPIPre;
  dc: KPIDataCenter;

  durationOptions: MenuItem[];

  @ViewChild('revenueTableContainer', { read: ViewContainerRef })
  revenueTableContainer: ViewContainerRef;

  comparisonTableIndex: ComponentRef<RevenueTableComponent>[] = [];

  constructor(
    private CFR: ComponentFactoryResolver,
    private kpiService: KPIService
  ) { }


  ngOnInit(): void {
    const me = this;
    
  }

  ngAfterViewInit(): void {
    const me = this;
  }

  createComparisonTable(duration: string) {
    const me = this;
    if (me.revenueTableContainer) {
      const durationObject = me.data.orderRevenue.duration.list.find((d: KPIDurationConfig) => {
        return d.value === duration;
      });
      me.emptyText = false;
      const componentFactory = me.CFR.resolveComponentFactory(
        RevenueTableComponent
      );
      const childComponentRef: ComponentRef<RevenueTableComponent> = me.revenueTableContainer.createComponent(
        componentFactory
      );
      me.comparisonTableIndex.push(childComponentRef);
      childComponentRef.instance.parent = me;
      if (durationObject) {
        childComponentRef.instance.duration = durationObject.value;
        childComponentRef.instance.durationLabel = durationObject.label;
      }
    }
  }

  remove(key: string) {
    const me = this;
    if (me.revenueTableContainer.length < 1) {
      return;
    }

    const componentRef = this.comparisonTableIndex.filter(
      (x) => x.instance.uuid === key
    )[0];

    for (const ii in me.comparisonTableIndex) {
      if (me.comparisonTableIndex[ii]) {
        const i: number = (ii as unknown) as number;
        if (me.comparisonTableIndex[i].instance.uuid === key) {
          // Removing component from container
          me.revenueTableContainer.remove(
            me.comparisonTableIndex.indexOf(componentRef)
          );
          // Removing component from Comparison Table Index
          me.comparisonTableIndex.splice(i, 1);
          return;
        }
      }
    }

    if (this.revenueTableContainer.length === 0) {
      me.emptyText = true;
    }
  }

  public render(data: KPIPre) {
    const me = this;
    me.comparisonTableIndex = [];
    me.data = data;

    if (me.data) {
      me.error = false;
      me.loading = false;

      // me.revenueTableContainer.clear();

      // Add duration table on click menu Item
      const options: MenuItem[] = [];
      const optionList = me.data.orderRevenue.duration.list;

      for (const i in optionList) {
        if (optionList[i]) {
          const option = optionList[i];
          options.push({
            label: option.label,
            id: option.value,
            command: () => {
              me.createComparisonTable(option.value);
            }
          });
        }
      }
      me.durationOptions = options;

      if (me.data.orderRevenue.dc) {
        for (const dc of me.data.dcs) {
          if (dc.name === me.data.orderRevenue.dc) {
            me.dc = dc;
          }
        }
      }

      // Set timeout is required because view chield is not render
      setTimeout(() => {
        me.showSelectedOrderRevenueTable();
      });
    }
  }

  showSelectedOrderRevenueTable() {
    const me = this;
    if (me.data) {
      if (me.revenueTableContainer) {
        me.revenueTableContainer.clear();
      }
      for (const selectedDuration of me.data.orderRevenue.duration.selected) {
        me.createComparisonTable(selectedDuration);
      }
    }
  }
}
