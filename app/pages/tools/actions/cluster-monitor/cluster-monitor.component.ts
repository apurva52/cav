import { NullTemplateVisitor } from '@angular/compiler';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { stubTrue } from 'lodash/fp';
import * as moment from 'moment';
import { MenuItem, SelectItem } from 'primeng';
import { interval, Subject, Subscription, timer } from 'rxjs';
import * as Highcharts from 'highcharts';
import { BreadcrumbService } from 'src/app/core/breadcrumb/breadcrumb.service';
import { Store } from 'src/app/core/store/store';
import { TreeSubmenuComponent } from 'src/app/shared/dashboard/sidebars/show-graph-in-tree/tree-submenu/tree-submenu.component';
import { CLUSTER_MONITOR_DATA } from './service/cluster-monitor.dummy';
import {ClusterMonitor,VisualChart,} from './service/cluster-monitor.model';
import { ClusterMonitorService } from './service/cluster-monitor.service';
import { ClusterMonitorLoadedState, ClusterMonitorLoadingErrorState, ClusterMonitorLoadingState, ClusterMonitorStateLoadedState, ClusterMonitorStateLoadingErrorState, ClusterMonitorStateLoadingState, ClusterMonitorStatsLoadedState, ClusterMonitorStatsLoadingErrorState, ClusterMonitorStatsLoadingState, IndicesStatsLoadedState, IndicesStatsLoadingErrorState, IndicesStatsLoadingState } from './service/cluster-monitor.state';

@Component({
  selector: 'app-cluster-monitor',
  templateUrl: './cluster-monitor.component.html',
  styleUrls: ['./cluster-monitor.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ClusterMonitorComponent implements OnInit, OnDestroy {
  visualChart: VisualChart
  // getNodes: Subject<any> = new Subject<any>();
//  static readonly ROUTE_DATA_BREADCRUMB = 'breadcrumb';
 // breadcrumb: MenuItem[];
  nodeInfo: SelectItem[];
  clusterMonitorData: ClusterMonitor;
  subscription: Subscription;
  isEnabledColumnFilter: boolean = false;
  filterTitle: string = 'Enable Filters';
  tooltipzindex = 100000;
  empty: boolean;
  error: any;
  loading: boolean;
  Indices: any;
  clusterhealth:any
  XaxisData;
  YaxisData;
  cpuYaxisData=[];
  memYaxisData=[];
  docValYaxisData=[];
  initial=0
  clusterStatisticColArr=[];
  prevDocCcount: any=[];
  cpuChart;
  memChart;
  docChart;
  nodeList;
  constructor(private router: Router, private cm:ClusterMonitorService,public breadcrumb: BreadcrumbService) {}
 

  ngOnInit(): void {
  
    const me = this;
   // this.clusterMonitorData.clusterStats=[]
   this.breadcrumb.removeAll()
   this.breadcrumb.addNewBreadcrumb({ label: 'Cluster-Monitor', routerLink: ['/cluster-monitor'] });
    this.clusterStatisticColArr = [{
      label: 'Number of nodes',
      value: 'numberOfNodes'
    }, {
      label: 'Documents',
      value: 'documents'
    }, {
      label: 'Total Shards',
      value: 'totalShards'
    }, {
      label: 'Successfull Shards',
      value: 'successfulShards'
    }, {
      label: 'Indices',
      value: 'indices'
    }, {
      label: 'Size',
      value: 'size'
    }];
  //  me.breadcrumb = [{ label: 'System' }, { label: 'Cluster Monitor' }];
    me.nodeInfo = [{ label: 'Cq22zz', value: 'cq22zz' }];
    me.clusterMonitorData = CLUSTER_MONITOR_DATA;
    //console.log("in oninit") 
    // this.getNodes.subscribe((data)=>{
    //   console.log(data)
    // })
    this.cpuChart = Highcharts.chart({
      chart: {
        renderTo: 'cpuchart',
        type: 'spline',
        height: '280px',
        width: 430
      },
      credits: {
        enabled: false
        },
        exporting: {
          enabled: false
        },
      title: {
        text: 'CPU',
      },
      legend: {
        enabled: false,
      },
      xAxis: {
        type: 'datetime'
        // categories:this.XaxisData,

      },
      yAxis: {
        title: {
          text: null,
        },
      },
      tooltip: {
        pointFormat:
          '{series.name}<br> <b>{point.y:,.0f} %</b>',
      },
      plotOptions: {
        spline: {

          marker: {
            enabled: true,
            symbol: 'circle',
            radius: 2,
            states: {
              hover: {
                enabled: true,
              },
            },
          },
        },
      },
      series: [] as Highcharts.SeriesOptionsType[]
  });
  this.memChart = Highcharts.chart({
      chart: {
        renderTo: 'memchart',
        type: 'spline',
        height: '280px',
        width: 430
      },
      credits: {
        enabled: false
        },
        exporting: {
          enabled: false
        },
      title: {
        text: 'Memory',
      },
      legend: {
        enabled: false,
      },
      xAxis: {
        type: 'datetime'
        // categories:this.XaxisData,

      },
      yAxis: {
        title: {
          text: null,
        },
      },
      tooltip: {
        pointFormat:
          '{series.name} <br> <b>{point.y:,.0f} %</b>',
      },
      plotOptions: {
        spline: {

          marker: {
            enabled: true,
            symbol: 'circle',
            radius: 2,
            states: {
              hover: {
                enabled: true,
              },
            },
          },
        },
      },
      series: [] as Highcharts.SeriesOptionsType[]
  })
    this.docChart = Highcharts.chart({
      chart: {
        renderTo: 'docchart',
        type: 'spline',
        height: '280px',
        width: 430
      },
      credits: {
        enabled: false
      },
      exporting: {
        enabled: false
      },
      title: {
        text: 'Docs/sec',
      },
      legend: {
        enabled: false,
      },
      xAxis: {
        type: 'datetime'
        //  categories:this.XaxisData
      },
      yAxis: {
        title: {
          text: null,
        },
      },
      tooltip: {
        pointFormat:
          '{series.name}<br> <b>{point.y:,.0f} %</b>',
      },
      plotOptions: {
        spline: {

          marker: {
            enabled: true,
            symbol: 'circle',
            radius: 2,
            states: {
              hover: {
                enabled: true,
              },
            },
          },
        },
      },
      series: [] as Highcharts.SeriesOptionsType[]
    })
//  this.makeChart(null,null)
    
 this.subscription=timer(0,10000).subscribe(x=>{
  this. clusterdata()
 })
 

  }

clusterdata(){
 
 
    this.clusterhealth={}
    
  

this.cm.ClusterState().subscribe((state: Store.State) => {
  if (state instanceof ClusterMonitorStateLoadingState) {
    this.ClusterStateLoading(state);
    return;
  }

  if (state instanceof ClusterMonitorStateLoadedState) {
    this.ClusterStateLoaded(state);
    return;
  }
},
(state: ClusterMonitorStateLoadingErrorState) => {
  this.ClusterStateLoadingError(state);
}
);

this.cm.ClusterStats().subscribe((state: Store.State) => {
if (state instanceof ClusterMonitorStatsLoadingState) {
  this.ClusterStatsLoading(state);
  return;
}

if (state instanceof ClusterMonitorStatsLoadedState) {
  this.ClusterStatsLoaded(state);
  return;
}
},
(state: ClusterMonitorStatsLoadingErrorState) => {
this.ClusterStatsLoadingError(state);
}
);



this.cm.IndicesStats().subscribe((state: Store.State) => {
if (state instanceof IndicesStatsLoadingState) {
  this.IndicesDataLoading(state);
  return;
}

if (state instanceof IndicesStatsLoadedState) {
  this.IndicesDataLoaded(state);
  return;
}
},
(state: IndicesStatsLoadingErrorState) => {
this.IndicesDataLoadingError(state);
}
);

this.cm.clusterHealth().subscribe((state: Store.State) => {
  if (state instanceof ClusterMonitorLoadingState) {
    this.ClusterDataLoading(state);
    return;
  }

  if (state instanceof ClusterMonitorLoadedState) {
    this.ClusterDataLoaded(state);
    return;
  }
},
(state: ClusterMonitorLoadingErrorState) => {
  this.ClusterDataLoadingError(state);
}
);

}



  ClusterDataLoadingError(state:ClusterMonitorLoadingErrorState){
    const me = this;
    me.empty = false;
    me.error = state.error;
    me.loading = true;
  }
  ClusterDataLoading(state:ClusterMonitorLoadingState){
    const me = this;
  
    me.empty = false;
    me.error = null;
    me.loading = true;
  }
  ClusterDataLoaded(state:ClusterMonitorLoadedState){
    //console.log(state)
    this.clusterMonitorData.clusterHealth.data=(state.data)
    this.clusterhealth.numberOfNodes = state.data[3].value;


  }

  ClusterStatsLoading(state:ClusterMonitorStatsLoadingState){
    const me = this;
  
    me.empty = false;
    me.error = null;
    me.loading = true;
  }

  ClusterStatsLoaded(state:ClusterMonitorStatsLoadedState){
    //console.log(state.data)
    //console.log(Object.values(state.data['nodes'])[0]['indices'].docs.count)
    this.clusterhealth.documents = Object.values(state.data['nodes'])[0]['indices'].docs.count
    this.nodeList = Object.keys(state.data['nodes'])
    this.makeChart(state.data['nodes'])

  }
  ClusterStatsLoadingError(state:ClusterMonitorStatsLoadingErrorState){
    const me = this;
    me.empty = false;
    me.error = state.error;
    me.loading = true;

  }
  ClusterStateLoading(state:ClusterMonitorStateLoadingState){
    const me = this;
  
    me.empty = false;
    me.error = null;
    me.loading = true;
  }

  ClusterStateLoaded(state:ClusterMonitorStateLoadedState){
    //console.log(state.data['metadata'].indices)
    // this.getNodes.next(Object.keys(state.data['nodes']));
    // this.nodeList = Object.keys(state.data['nodes']);
    this.Indices = state.data['metadata'].indices;

  }
  ClusterStateLoadingError(state:ClusterMonitorStateLoadingErrorState){
    const me = this;
    me.empty = false;
    me.error = state.error;
    me.loading = true;

  }

IndicesDataLoadingError(state:IndicesStatsLoadingErrorState){
  const me = this;
  me.empty = false;
  me.error = state.error;
  me.loading = true;
}

IndicesDataLoading(state:IndicesStatsLoadingState){
  const me = this;

  me.empty = false;
  me.error = null;
  me.loading = true;
}
IndicesDataLoaded(state:IndicesStatsLoadedState){
  console.log(state)
 let indicesArray=[]
 //console.log( state.data['_shards'].total)
 console.log('=======indicesss=========',Object.keys(state.data['indices']))
 Object.keys(state.data['indices']).forEach(element => {
   let doc_rate = 0;
   var now = new Date().getTime();
  //  console.log(this.prevDocCcount)
   if (this.prevDocCcount[element])
     doc_rate = 1000 * (state.data['indices'][element].primaries.docs.count - this.prevDocCcount[element][1]) / (now - this.prevDocCcount[element][0]);
   else {
     doc_rate = 0;
   }
   this.prevDocCcount[element] = [now, state.data['indices'][element].primaries.docs.count];

   indicesArray.push({
    index: element,
    docs: state.data['indices'][element].primaries.docs.count,
    doc_sec: doc_rate,
    primarySize: state.data['indices'][element].primaries.store.size_in_bytes,
    shards: this.Indices[element].settings.index.number_of_shards,
    replicas: this.Indices[element].settings.index.number_of_replicas,
    status: this.Indices[element].state,
  })
  //console.log(indicesArray)
  this.clusterMonitorData.clusterIndices.data=indicesArray

   
 });
  
  // this.clusterhealth.push({label:"Total Shards",value:state.data['_shards'].total},
  // {label:"Successful Shards",value:state.data['_shards'].successful},
  // {label:"indices",value:Object.keys(state.data['indices']).length},
  // {label:"size",value:state.data['_all'].total.store.size_in_bytes})
  this.clusterhealth.totalShards = state.data['_shards'].total;
  this.clusterhealth.successfulShards = state.data['_shards'].successful;
  this.clusterhealth.indices = Object.keys(state.data['indices']).length;
  this.clusterhealth.size = state.data['_all'].total.store.size_in_bytes;

  this.clusterMonitorData.clusterStats=this.clusterhealth
  //console.log(this.clusterMonitorData.clusterStats)

}








  nodeChanged(event) {
    const me = this;
    //console.log(event);
    me.router.navigate(['/node-info']);
  }

  toggleFilters() {
    const me = this;
    me.isEnabledColumnFilter = !me.isEnabledColumnFilter;
    if (me.isEnabledColumnFilter === true) {
      me.filterTitle = 'Disable Filters';
    } else {
      me.filterTitle = 'Enable Filters';
    }
  }

 
  makeChart(nodesVal){
    console.log('node value is::', nodesVal)
   
   let finalval;
 
  //  this.cpuYaxisData = cpuval;
  //  this.memYaxisData = memval;
   this.XaxisData = moment(new Date().getTime()).valueOf();
   console.log(this.XaxisData);
  //  if(docval!=undefined){
  //  finalval=0
  //  }
  //  else{
  //   finalval=(docval-this.initial)/10
  //  }
   //console.log(finalval)
   if(this.cpuChart.series.length == 0){
     this.nodeList.forEach((element) => {
     const obj = {
      name: element,
      data: []
     };
     this.cpuChart.addSeries(obj);
     this.memChart.addSeries(obj);
     this.docChart.addSeries(obj);
     });
    }

    this.nodeList.forEach((node,i)=>{

      this.cpuYaxisData = nodesVal[node]['os'].cpu.percent;
      this.memYaxisData = nodesVal[node]['os'].mem.used_percent;
      let docval = nodesVal[node]['indices'].docs.count;
      if(docval!=undefined){
      finalval=0
      }
      else{
       finalval=(docval-this.initial)/10
      }
   console.log( this.cpuChart)
   this. initial=docval
   this.docValYaxisData = finalval;
   let cpuSeries = this.cpuChart.series[i];
   let memSeries = this.memChart.series[i];
   let docSeries = this.docChart.series[i];

   cpuSeries.addPoint([this.XaxisData,this.cpuYaxisData], true, (cpuSeries.data.length > 9));
   memSeries.addPoint([this.XaxisData,this.memYaxisData], true, (memSeries.data.length > 9));
   docSeries.addPoint([this.XaxisData,this.docValYaxisData], true, (docSeries.data.length > 9));
  //  for(let i=0;i<=this.docValYaxisData.length;i++){
  //   initialdata.push((this.docValYaxisData[i+1]-this.docValYaxisData[i])/10);
  //  }
   //console.log(this.docValYaxisData)
  
   //console.log(this.cpuYaxisData)
  })
  }
  ngOnDestroy() {
    this.subscription.unsubscribe()
}
 
}
