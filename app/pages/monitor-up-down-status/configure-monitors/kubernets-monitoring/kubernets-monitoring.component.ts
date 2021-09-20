import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { KUBERNET_MONITOR_DATA } from './service/kubernets-monitoring.dummy';
import { KubernetMonitoring } from './service/kubernets-monitoring.model';

@Component({
  selector: 'app-kubernets-monitoring',
  templateUrl: './kubernets-monitoring.component.html',
  styleUrls: ['./kubernets-monitoring.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class KubernetsMonitoringComponent implements OnInit {

  kubernetMonitoringData: KubernetMonitoring;
  accountsItem:any[];

  constructor() { }

  ngOnInit(): void {
    const me = this;
    me.kubernetMonitoringData = KUBERNET_MONITOR_DATA;

    me.accountsItem = [{label:'Cluster', value:'Cluster'},{label:'Node', value:'Node'}]
  }

}
