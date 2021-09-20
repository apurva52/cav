import {
  AfterContentChecked,
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  PipeTransform,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import * as Highcharts from 'highcharts';
import { MenuItem, OverlayPanel, SelectItem } from 'primeng';
import { AppError } from 'src/app/core/error/error.model';
import { Store } from 'src/app/core/store/store';
import { GeolocationData } from './service/geolocation.model';
import { GeolocationService } from './service/geolocation.service';
import {
  GeolocationDataLoadingState,
  GeolocationDataLoadedState,
  GeolocationDataLoadingErrorState,
} from './service/geolocation.state';

import MapModule from 'highcharts/modules/map';
import Drilldown from 'highcharts/modules/drilldown';

// import WorldMap from '@highcharts/map-collection/custom/world.geo.json';
import * as testWorldMap from 'src/assets/dummyData/geo-location-data/custom/world.geo.json';
import { MapConfig } from 'src/app/shared/map/service/map.model';
import * as _ from 'lodash';
import { ChartConfig } from 'src/app/shared/chart/service/chart.model';
import { Dec3Pipe } from 'src/app/shared/pipes/dec-3/dec-3.pipe';
import { PipeService } from 'src/app/shared/pipes/pipe.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { GeoLocationTimeFilterComponent } from 'src/app/shared/geo-location-time-filter/geo-location-time-filter.component';
import { TableHeaderColumn } from 'src/app/shared/table/table.model';
import { TopTransactionComponent } from './sidebars/top-transaction/top-transaction.component';
import { TimebarService } from './../../shared/time-bar/service/time-bar.service'
import { GlobalTimebarTimeLoadedState, GlobalTimebarTimeLoadingErrorState, GlobalTimebarTimeLoadingState } from 'src/app/shared/time-bar/service/time-bar.state';
import { DownloadReportLoadedState, DownloadReportLoadingErrorState, DownloadReportLoadingState } from 'src/app/shared/dashboard/dialogs/metric-description/service/metric-description.state';	
import {Message,MessageService} from 'primeng/api';
import { HttpClient } from '@angular/common/http';

Drilldown(Highcharts); 
MapModule(Highcharts);

@Component({
  selector: 'app-geolocation',
  templateUrl: './geolocation.component.html',
  styleUrls: ['./geolocation.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [Dec3Pipe],
})
export class GeolocationComponent implements OnInit, AfterViewInit {
  data: GeolocationData;
  error: AppError;
  loading: boolean;
  empty: boolean;
  emptyTable : boolean;
  selectedHealthStatus: any;
  selectedState: string;
  selectedApplication: string;
  breadcrumb: MenuItem[];

  map: MapConfig;
  worldMapData = Highcharts.geojson((testWorldMap as any).default);
  criticalSeries: any;
  majorSeries: any;
  normalSeries: any;
  inactiveSeries: any;

  viewStatistics: boolean;
  showTopTransactionJacket: boolean;
  chart: ChartConfig;

  autoUpdateTimer: any = -1;

  @ViewChild('mapContainer', { read: ElementRef, static: false })
  mapContainer: ElementRef;

  @ViewChild('topTransaction', { read: TopTransactionComponent })
  topTransaction: TopTransactionComponent;

  @ViewChild('storeDetails')
  overlayPanel: OverlayPanel;

  visibleStore: boolean = true;

  geoLocationTimeFilterChangeSubscription: Subscription;
  private timeperiod: string = null;

  isShowStatColumnFilter: boolean;
  statCols: TableHeaderColumn[] = [];
  _selectedStatColumns: TableHeaderColumn[] = [];
  downloadOptions: { label: string }[];
  selectedApp: string = 'All';
  isLoading: boolean;	
  //  msgs: Message[];
  test
  getchartdata: boolean = true;
  statTableData: any[];
  searchValue :any ;
  filterType : any ;
  ddCountryName ;
  constructor(
    private geolocationService: GeolocationService,
    private pipeService: PipeService,
    private route: ActivatedRoute,
    private router: Router,
    public timebarService: TimebarService,
    private messageService: MessageService,
    private httpClient: HttpClient
  ) {
  //  this.getScript('https://code.highcharts.com/mapdata/custom/world.js');
  }

  // Map Container height and width
  get containerDimensions(): { width: number; height: number } {
    return {
      width: this.mapContainer.nativeElement.offsetWidth,
      height: this.mapContainer.nativeElement.offsetHeight,
    };
  }

      getScript(url, cb?) {
        const script = document.createElement('script');
        script.src = url;
        script.onload = cb;
        document.head.appendChild(script);
    }

  ngOnInit(): void {
    const me = this;
    me.breadcrumb = [
      { label: 'Home', routerLink: '/home/dashboard' },
      { label: 'System', routerLink: '/home/system' },
      { label: 'Geo - location' },
    ];

    me.downloadOptions = [
      { label: 'WORD' },
      { label: 'PDF' },
      { label: 'EXCEL' },
    ];
    me.test = Highcharts.maps['custom/world']
    // console.log(WorldMap);
    console.log((testWorldMap as any).default);
    

  }
  ngAfterViewInit() {
    const me = this;
    GeoLocationTimeFilterComponent.getInstance().subscribe(
      (endToEndTimeFilterComponent: GeoLocationTimeFilterComponent) => {
        if (me.geoLocationTimeFilterChangeSubscription) {
          me.geoLocationTimeFilterChangeSubscription.unsubscribe();
        }

        me.geoLocationTimeFilterChangeSubscription = endToEndTimeFilterComponent.onChange.subscribe(
          (data) => {
            me.geolocationService.setDuration(me.geolocationService.createDuration(data.temporaryTimeFrame[1], data.temporaryTimeFrame[2], data.timePeriod.selected.id, +data.viewBy.selected.id))
            me.load(me.selectedApp, me.geolocationService.getDuration());
          }
        );
      }
    );
  }

  load(selectedApp, durationObj) {
    const me = this;
    this.isLoading = true;	
    setTimeout( () => this.isLoading = false, 2000 );
    // me.timeperiod = timeperiod;
    me.geolocationService.load(selectedApp, durationObj).subscribe(
      (state: Store.State) => {
        if (state instanceof GeolocationDataLoadingState) {
          me.onLoading(state);
          return;
        }
        if (state instanceof GeolocationDataLoadedState) {
          me.onLoaded(state);
          /* Check if auto update timer already running */
          clearInterval(this.autoUpdateTimer);	
          this.autoUpdateTimer = -1;	
           if (this.autoUpdateTimer == -1) {	
             console.log(" Data Refreshed automatically in every 1 min");
            this.autoUpdateTimer = setInterval(() => {
              this.autoUpdateEveryMinute();
            }, this.geolocationService.getAutoUpdateTimeInMs())

            let data = state.data.storeViewMapData;	
            let highchart = this.data.charts.highchart;	
        
            console.log("severityData",data);	
            if(data.length == 0){	
            for(let i = 0; i< highchart['series'][0]['data'].length;i++){	
              this.data.charts.highchart['series'][0]['data'][i]['y'] = 0;	
               console.log ("y data",this.data.charts.highchart['series'][0]['data'][i]['y']);	
               if(this.data.charts.highchart['series'][0]['data'][i]['y'] == 0) {
                this.getchartdata = false;
                } else {
                this.getchartdata = true;
                }

            }
            }
          
            //console.log("availble storeViewMapData data",state.data.storeViewMapData);	
            if (state.data.storeViewMapData.length == 0){ 	
              console.log("No Data availble",state.data.storeViewMapData);	
               let msg = 'Data is not available';	
          //  this.msgs = [];	
          me.messageService.add({ severity: 'error', summary: 'Error message', detail: msg});	
            return;	
        	
            }
          }

          return;
        }
      },
      (state: GeolocationDataLoadingErrorState) => {
        me.onLoadingError(state);
      }
    );
  }


  private autoUpdateEveryMinute() {
    this.timebarService
        .loadTime(this.geolocationService.getDuration().preset, null)
        .subscribe(
          (state: Store.State) => {
            if (state instanceof GlobalTimebarTimeLoadingState) {
              
              return;
            }

            if (state instanceof GlobalTimebarTimeLoadedState) {
              this.geolocationService.setDuration(this.geolocationService.createDuration(state.data[1], state.data[2], this.geolocationService.getDuration().preset, this.geolocationService.getDuration().viewBy));
              this.load(this.selectedApp, this.geolocationService.getDuration());
              return;
            }
          },
          (state: GlobalTimebarTimeLoadingErrorState) => {
            console.error("Error in auto update", state.error);
          }
        );
  }

  private onLoading(state: GeolocationDataLoadingState) {
    const me = this;
    me.error = null;
    me.loading = true;
  }

  private onLoadingError(state: GeolocationDataLoadingErrorState) {
    const me = this;
    me.data = null;
    me.error = state.error;
    me.loading = false;
    me.empty = false;
  }

  private onLoaded(state: GeolocationDataLoadedState) {
    const me = this;
    me.data = state.data;
    me.error = null;
    me.loading = false;
    me.geolocationService.setStoreViewData(me.data.storeViewMapData)
    me.chart = me.data.charts;

    // To hide highcharts.com hologram
    me.chart.highchart.credits ={
      enabled: false
    }

    // To hide default title of chart
    me.chart.highchart.title ={
      text : null
    }

    me.chart.highchart.plotOptions['series'] = {
      cursor: 'pointer',
      events: {
          click: function (event) {
            me.router.navigate(['/geo-location/business-health'], { queryParams: { selectedApp: me.selectedApp,point:event.point.name}});
          }
      },
  };

    if (me.data) {
      me.empty = false;
      me.GetMapData(me.data);
      //Round off the table values
      if (!me.data.appStats.data || me.data.appStats.data == null || me.data.appStats.data.length == 0) {	
        me.emptyTable = true;	
      }

      if (me.data.appStats) {
      //To round off the app stats table values.
      me.data.appStats.data.forEach(function (valueData, i) {
        me.data.appStats.headers[0].cols.forEach(function (value) {
          if(!isNaN(valueData[value.valueField])){
            me.data.appStats.data[i][value.valueField]  = Math.round(valueData[value.valueField]);
          }
        })
      });
      }
      me._selectedStatColumns = [];
      me.statCols = me.data.appStats.headers[0].cols;
      for (const c of me.data.appStats.headers[0].cols) {
        if (c.selected) {
          me._selectedStatColumns.push(c);
        }
      }
    }	
    else{	
      me.empty = true;
    }
    me.statTableData = me.data.appStats.data;
  }

  private GetMapData(data: GeolocationData) {
    const me = this;

    me.worldMapData.forEach((el: any, i) => {
      el['hc-key'] = el.properties['hc-key'];
      el.drilldown = el.properties['hc-key'];
      el.value = i;
    });
    me.map = {
      map: {
        chart: {
	  animation:false,
          backgroundColor: '#D7E4F0',
          borderWidth: 0,
          events: {
            drilldown(e) {
              const chart = this as any;

              
              
              let drillData:any;
              const mapKey =
                  'countries/' +
                  e.point.options.drilldown +
                  '/' +
                  e.point.options.drilldown +
                  '-all';

              me.httpClient.get('./assets/dummyData/geo-location-data/'+mapKey+'.geo.json').subscribe(geoDdata =>{
               
                drillData = geoDdata;
                // this.products = data;
                if (e.point && drillData) {
                  const mapKey =
                    'countries/' +
                    e.point.options.drilldown +
                    '/' +
                    e.point.options.drilldown +
                    '-all';
  
                    console.log(mapKey)
  
                 
  
                  
  
                  // Store country Name for generate Series Data
                  const countryName = e.point.name;
                  me.ddCountryName = countryName ;
                  const drillMapData = drillData;
  
                  // const drillMapData = require(`@highcharts/map-collection/${mapKey}.geo.json`);
  
                  const mapData = Highcharts.geojson(drillMapData);
  
                  mapData.forEach((el: any, i) => {
                    el['hc-key'] = el.properties['hc-key'];
                    el.value = i;
                  });
  
                  // Add series for drilldown country
                  chart.addSeriesAsDrilldown(e.point, {
                    name: e.point.name,
                    data: mapData,
                    mapData: drillMapData,
                    joinBy: 'hc-key',
                    dataLabels: {
                      enabled: true,
                      format: '{point.name}',
                      style: { fontSize: "11px", fontFamily: "'Roboto', sans-serif" , fontWeight: "500", fill: "#666666", textDecoration: "none"}
                    },
                    showInLegend: false,
                    borderWidth: 0.2,
                  });
  
                  // Add alert wise multiple series
                  me.criticalSeries = chart.addSeries({
                    id: 'critical',
                    type: 'mappoint',
                    name: 'Critical',
                    color: '#F04943',
                    marker: {
                      fillColor: '#F04943',
                      symbol: 'circle',
                    },
                    dataLabels: {
                      enabled: false,
                    },
                    stickyTracking: false,
                    data: me.getCriticalSeriesData(countryName, data),
                  });
                  me.majorSeries = chart.addSeries({
                    id: 'major',
                    type: 'mappoint',
                    name: 'Major',
                    color: '#fc7e28',
                    marker: {
                      fillColor: '#fc7e28',
                      symbol: 'cricle',
                    },
                    dataLabels: {
                      enabled: false,
                    },
                    stickyTracking: false,
                    data: me.getMajorSeriesData(countryName, data),
                  });
                  me.normalSeries = chart.addSeries({
                    id: 'normal',
                    type: 'mappoint',
                    name: 'Normal',
                    color: '#07b40c',
                    marker: {
                      fillColor: '#07b40c',
                      symbol: 'cricle',
                    },
                    dataLabels: {
                      enabled: false,
                    },
                    stickyTracking: false,
                    data: me.getNormalSeriesData(countryName, data),
                  });
                  me.inactiveSeries = chart.addSeries({
                    id: 'inactive',
                    type: 'mappoint',
                    name: 'Inactive',
                    color: '#91959c',
                    marker: {
                      fillColor: '#91959c',
                      lineColor: '#707070',
                      lineWidth: 1,
                      symbol: 'cricle',
                    },
                    visible: false,  //to hide initially
                    dataLabels: {
                      enabled: false,
                    },
                    stickyTracking: false,
                    data: me.getInactiveSeriesData(countryName, data),
                  });
  
                  chart.setTitle(null, { text: e.point.name });
  
                  // Open Statistics Sidebar
                  me.viewStatistics = true;
                  this.update({
                    chart: {
                      width: me.containerDimensions.width - 340,
                      height: me.containerDimensions.height - 150,
                    },
                  });
                }
              });


              

              // if (e.point && drillData) {
              //   const mapKey =
              //     'countries/' +
              //     e.point.options.drilldown +
              //     '/' +
              //     e.point.options.drilldown +
              //     '-all';

              //     console.log(mapKey)

               

                

              //   // Store country Name for generate Series Data
              //   const countryName = e.point.name;

              //   const drillMapData = drillData;

              //   // const drillMapData = require(`@highcharts/map-collection/${mapKey}.geo.json`);

              //   const mapData = Highcharts.geojson(drillMapData);

              //   mapData.forEach((el: any, i) => {
              //     el['hc-key'] = el.properties['hc-key'];
              //     el.value = i;
              //   });

              //   // Add series for drilldown country
              //   chart.addSeriesAsDrilldown(e.point, {
              //     name: e.point.name,
              //     data: mapData,
              //     mapData: drillMapData,
              //     joinBy: 'hc-key',
              //     dataLabels: {
              //       enabled: true,
              //       format: '{point.name}',
              //       style: { fontSize: "11px", fontFamily: "'Roboto', sans-serif" , fontWeight: "500", fill: "#666666", textDecoration: "none"}
              //     },
              //     showInLegend: false,
              //     borderWidth: 0.2,
              //   });

              //   // Add alert wise multiple series
              //   me.criticalSeries = chart.addSeries({
              //     id: 'critical',
              //     type: 'mappoint',
              //     name: 'Critical',
              //     color: '#F04943',
              //     marker: {
              //       fillColor: '#F04943',
              //       symbol: 'circle',
              //     },
              //     dataLabels: {
              //       enabled: false,
              //     },
              //     stickyTracking: false,
              //     data: me.getCriticalSeriesData(countryName, data),
              //   });
              //   me.majorSeries = chart.addSeries({
              //     id: 'major',
              //     type: 'mappoint',
              //     name: 'Major',
              //     color: '#fc7e28',
              //     marker: {
              //       fillColor: '#fc7e28',
              //       symbol: 'cricle',
              //     },
              //     dataLabels: {
              //       enabled: false,
              //     },
              //     stickyTracking: false,
              //     data: me.getMajorSeriesData(countryName, data),
              //   });
              //   me.normalSeries = chart.addSeries({
              //     id: 'normal',
              //     type: 'mappoint',
              //     name: 'Normal',
              //     color: '#07b40c',
              //     marker: {
              //       fillColor: '#07b40c',
              //       symbol: 'cricle',
              //     },
              //     dataLabels: {
              //       enabled: false,
              //     },
              //     stickyTracking: false,
              //     data: me.getNormalSeriesData(countryName, data),
              //   });
              //   me.inactiveSeries = chart.addSeries({
              //     id: 'inactive',
              //     type: 'mappoint',
              //     name: 'Inactive',
              //     color: '#91959c',
              //     marker: {
              //       fillColor: '#91959c',
              //       lineColor: '#707070',
              //       lineWidth: 1,
              //       symbol: 'cricle',
              //     },
              //     visible: false,  //to hide initially
              //     dataLabels: {
              //       enabled: false,
              //     },
              //     stickyTracking: false,
              //     data: me.getInactiveSeriesData(countryName, data),
              //   });

              //   chart.setTitle(null, { text: e.point.name });

              //   // Open Statistics Sidebar
              //   me.viewStatistics = true;
              //   this.update({
              //     chart: {
              //       width: me.containerDimensions.width - 340,
              //     },
              //   });
              // }
            },
            drillup(e) {
              const chart = this as any;
              me.criticalSeries.remove(true);
              me.majorSeries.remove(true);
              me.normalSeries.remove(true);
              me.inactiveSeries.remove(true);
              me.viewStatistics = false;
              me.showTopTransactionJacket = false;

              this.update({
                chart: {
                 animation:
                  {
                    duration:1
                  },
		       	width: me.containerDimensions.width + 379,
                  height: me.containerDimensions.height + 150, 
                },
              });
            },
          },
          width: me.containerDimensions.width,
          height: me.containerDimensions.height - 150,
        },
        title: {
          text: null,
        },

        mapNavigation: {
          enabled: true,
        },

        tooltip: {
          enabled: false,
          useHTML: true,
          formatter: function () {
            let t = me.formatTooltip(this.series, this.point, data);
            return t;
          },
          backgroundColor: '#FFFFFF',
          hideDelay: 1000,
          borderWidth: 0,
          borderRadius: 15,
          padding: 10,
          stickOnContact: true,
        },

        plotOptions: {
          map: {
            states: {
              hover: {
                color: '#ebeae8',
              },
            },
          },
          mappoint: {
            point: {
              stickyTracking: false,
              events: {
                click: function (e: Event) {},
                mouseOver: function (e: Event) {
                  this.series.chart.update({
                    tooltip: {
                      enabled: true,
                    },
                  });
                },
                mouseOut: function (e) {
                  this.series.chart.update({
                    tooltip: {
                      enabled: false,
                    },
                  });
                },
              },
            },
          },
        } as Highcharts.PlotOptions,

        series: [
          {
            data: me.worldMapData,
            mapData: (testWorldMap as any).default,
            joinBy: 'hc-key',
            dataLabels: {
              enabled: true,
              format: '{point.name}',
              style: {
                textDecoration: "none !important",
                fill: "#666666 !important"
              }
            },
            showInLegend: false,
            color: '#FFFFFF',
            borderWidth: 0.2,
          },
          {
            // Specify points using lat/lon
            type: 'mappoint',
            name: 'Major',
            color: '#fc7e28',
            marker: {
              fillColor: '#fc7e28',
              symbol: 'cricle',
            },
            dataLabels: {
              enabled: false,
            },
            stickyTracking: false,
            data: me.getMajorSeriesData(null, data),
          },
          {
            // Specify points using lat/lon
            type: 'mappoint',
            name: 'Normal',
            color: '#07b40c',
            marker: {
              fillColor: '#07b40c',
              symbol: 'circle',
            },
            dataLabels: {
              enabled: false,
            },
            stickyTracking: false,
            data: me.getNormalSeriesData(null, data),
            events: {
              mouseOver(data) {},
            },
          },
          {
            // Specify points using lat/lon
            type: 'mappoint',
            name: 'Critical',
            color: '#F04943',
            marker: {
              fillColor: '#F04943',
              symbol: 'cricle',
            },
            dataLabels: {
              enabled: false,
            },
            stickyTracking: false,
            data: me.getCriticalSeriesData(null, data),
          },
          {
            // Specify points using lat/lon
            type: 'mappoint',
            name: 'Inactive',
            color: '#91959c',
            marker: {
              fillColor: '#91959c',
              lineColor: '#707070',
              lineWidth: 1,
              symbol: 'cricle',
            },
            dataLabels: {
              enabled: false,
            },
            visible: false, // Hide Inactives initially
            stickyTracking: false,
            data: me.getInactiveSeriesData(null, data),
          },
        ] as Highcharts.SeriesOptionsType[],
        drilldown: {
          drillUpButton: {
            relativeTo: 'spacingBox',
            position: {
              align: 'left',
              verticalAlign: 'bottom',
              x: 5,
              y: -25,
            },
            theme: {
              fill: 'white',
              'stroke-width': 1,
              stroke: 'silver',
              r: 0,
              states: {
                hover: {
                  fill: '#a4edba',
                },
                select: {
                  stroke: '#039',
                  fill: '#a4edba',
                },
              },
            },
          },
        },
      },
    };
  }

  // Generate critical series data
  getCriticalSeriesData(country: string, data: GeolocationData): any[] {
    const me = this;
    const criticalData = [];
    for (const d of data.storeViewMapData) {
      if (country === d.country && d.color.toLowerCase() === 'r') {
        criticalData.push(d);
      } else if (!country && d.color.toLowerCase() === 'r') {
        criticalData.push(d);
      }
    }
    return criticalData;
  }

  // Generate major series data
  getMajorSeriesData(country: string, data: GeolocationData): any[] {
    const me = this;
    const majorData = [];
    for (const d of data.storeViewMapData) {
      if (country === d.country && d.color.toLowerCase() === 'y') {
        majorData.push(d);
      } else if (!country && d.color.toLowerCase() === 'y') {
        majorData.push(d);
      }
    }
    return majorData;
  }

  // Generate normal series data
  getNormalSeriesData(country: string, data: GeolocationData): any[] {
    const me = this;
    const normalData = [];
    for (const d of data.storeViewMapData) {
      if (country === d.country && d.color.toLowerCase() === 'g') {
        normalData.push(d);
      } else if (!country && d.color.toLowerCase() === 'g') {
        normalData.push(d);
      }
    }
    return normalData;
  }

  // Generate inactive series data
  getInactiveSeriesData(country: string, data: GeolocationData): any[] {
    const me = this;
    const inactiveData = [];
    country = 'United States of America';
    for (const store in data.storeViewMapData) {
      if (
        country === data.storeViewMapData[store].country &&
        data.storeViewMapData[store].color.toLowerCase() === 'gry'
      ) {
        inactiveData.push(data.storeViewMapData[store]);
      } else if (
        !country &&
        data.storeViewMapData[store].color.toLowerCase() === 'gry'
      ) {
        inactiveData.push(data.storeViewMapData[store]);
      }
    }
    return inactiveData.filter(a => a.stateName == 'Pennsylvania' || a.stateName == 'Indiana' || a.stateName == 'Texas')
    // return inactiveData;
  }
  updateDrilledSeriesData(country: string, data: GeolocationData, searchType :string, searchData:string) {
    const me = this;
    let normalData = [];
    let majorData = [];
    let criticalData = [];
    let inactiveData = [];
    searchType = (searchType=='storeCity') ? 'cityName' : searchType ;
    
    for (const d of data.storeViewMapData) {
    
    if (country === d.country && d.color.toLowerCase() === 'g' && d[searchType].toLowerCase().startsWith(searchData))
    normalData.push(d);
    
    if (country === d.country && d.color.toLowerCase() === 'y' && d[searchType].toLowerCase().startsWith(searchData))
    majorData.push(d);
    
    if (country === d.country && d.color.toLowerCase() === 'r' && d[searchType].toLowerCase().startsWith(searchData))
    criticalData.push(d);
    
    if (country === d.country && d.color.toLowerCase() === 'gry' && d[searchType].toLowerCase().startsWith(searchData))
    inactiveData.push(d);
    }
    
    //update the drilled series
    me.criticalSeries.update({data : criticalData});
    me.majorSeries.update({data : majorData});
    me.normalSeries.update({data:normalData});
    me.inactiveSeries.update({data : inactiveData.filter(a => a.stateName == 'Pennsylvania' || a.stateName == 'Indiana' || a.stateName == 'Texas')});
    }

  formatTooltip(series, point, data) {
    const me = this;
    let res, tps, eps;

    const formatter: PipeTransform = me.pipeService.getFormatter('dec_3');
    if (formatter) {
      res = formatter.transform(point.res);
      tps = formatter.transform(point.tps);
      eps = formatter.transform(point.eps);
    }

    let el = `
    <div class="store-overlay">
      <div class="p-col-12">
        <span>Store : <b>${point.storeName}</b></span>
      </div>
      <div class="p-col-12">
          <span>City : <b>${point.cityName}</b></span>
      </div>
      <div class="p-col-12">
          <span>Critical : <b>${point.critical}</b></span>
      </div>
      <div class="p-col-12">
          <span>Major : <b>${point.major}</b></span>
      </div>
      <div class="p-col-12">
          <span>TPS: <b>${tps}</b></span>
      </div>
      <div class="p-col-12">
          <span>Response Time : <b>${res} ms</b></span>
      </div>
      <div class="p-col-12">
          <span>Error % : <b>${eps}</b></span>
      </div>
      <div class="p-col-12 text-center">
      <a class="view-store-button" href="#/geo-location/store/${point.storeName}" target="_self" routerLink="/store" ${point.color == "GRY"?'disabled':''}>VIEW STORE</a>
      </div>
    </div>`;
    //Set application and store name, So we can use in Store details UI.
    this.geolocationService.$selectedGeoApp = this.selectedApp;
    this.geolocationService.$selectedStoreName = point.storeName;
    return el;
  }

  navigate() {
    console.log('w');
  }

  @Input() get selectedStatColumns(): TableHeaderColumn[] {
    const me = this;
    return me._selectedStatColumns;
  }

  set selectedStatColumns(val: TableHeaderColumn[]) {
    const me = this;
    me._selectedStatColumns = me.statCols.filter((col) => val.includes(col));
  }

  openTopTransactionJacket() {
    this.viewStatistics = false;
    this.showTopTransactionJacket = true;
  }

  onApplicationChanged()
  {
    const me = this;
    me.selectedApp = me.selectedApplication['value'];
    me.load(me.selectedApp, me.geolocationService.getDuration());
  }
  private searchVisibilityOptions: string[] = ["storeName", "storeCity", "stateName"];

  isShowSearch(selectedSearchType){
    return selectedSearchType != undefined && this.searchVisibilityOptions.includes(selectedSearchType.value);
  }
  /**
   * Method called on changing alert type from Business to Infrastructure or vice versa
   */
  onStoreAlertChanged(alertType: number) {
    /* Setting the storeAlertType of the payLoadData */
    if (this.geolocationService.payLoadData != null) {
      this.geolocationService.payLoadData.storeAlertType = alertType;
    }
    /* Send the main data fetch request */
    this.load(this.selectedApp, this.geolocationService.getDuration());
  }
  filterStatTable(data){
    let me = this;
    if(data == 'All'){
    me.statTableData = me.data.appStats.data;
    return;
    }
    me.statTableData = [] ;
    me.data.appStats.data.forEach((value,index)=>{
    if(value.appName === data){
    me.statTableData.push(me.data.appStats.data[index]);
    }
    });
    if(me.statTableData.length == 0){
    me.statTableData.push(
    {
    appName : data,
    tps : "NULL",
    res : "NULL",
    error : "NULL"
    }
    );
    }
    console.log(me.statTableData,"------->>>");
    
    }
    applyFilter(){
      const me = this;
      console.log(me.filterType);
      if(me.filterType.label == 'None' || me.filterType.label == 'Critical' || me.filterType.label == 'Major'){
      me.criticalSeries.update({data : (me.filterType.value == 'none' || me.filterType.value == 'critical') ? me.getCriticalSeriesData(me.ddCountryName , me.data) : [] });
      me.majorSeries.update({data : (me.filterType.value == 'none' || me.filterType.value == 'major') ? me.getMajorSeriesData(me.ddCountryName , me.data) : [] });
      me.normalSeries.update({data : (me.filterType.value == 'none') ? me.getNormalSeriesData(me.ddCountryName , me.data) : []});
      me.inactiveSeries.update({data : (me.filterType.value == 'none') ? me.getInactiveSeriesData(me.ddCountryName , me.data) : []});
      }
      else {
      console.log("searched value ------>", me.searchValue);
      if(me.searchValue)
      me.updateDrilledSeriesData(me.ddCountryName , me.data, me.filterType.value , me.searchValue.toLowerCase());
      }
      }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    clearInterval(this.autoUpdateTimer);
    this.autoUpdateTimer = -1;
  }

	downloadShowDescReports(label) {	
    const me = this;	
    let tableData = me.data.appStats.data;	
    let header = ['S No.'];	
    let headerValueField = [];	
    let colWidth = [125, 125, 125, 125, 125];	
      
    for (const c of me._selectedStatColumns){	
    header.push(c.label)	
    headerValueField.push(c.valueField)	
    }	
      
    let rowData:any []=[];	
    for(let i =0;i<tableData.length;i++){	
    let rData:string []=[];	
    rData.push((i+1).toString());	
    for(let j=0; j<headerValueField.length; j++){	
    if(headerValueField[j] === 'no')	
    continue;	
    else if(headerValueField[j] === 'appName')	
    rData.push(tableData[i].appName);	
    else if(headerValueField[j] === 'tps')	
    rData.push(tableData[i].tps);	
    else if(headerValueField[j] === 'res')	
    rData.push(tableData[i].res);	
    else if(headerValueField[j] === 'error')	
    rData.push(tableData[i].error);	
    }	
    rowData.push(rData);	
    }	
      
    try {	
    me.geolocationService.downloadShowDescReports(label, rowData,header, colWidth).subscribe(	
    (state: Store.State) => {	
    if (state instanceof DownloadReportLoadingState) {	
    me.onLoadingReport(state);	
      
    return;	
    }	
      
    if (state instanceof DownloadReportLoadedState) {	
    me.onLoadedReport(state);	
    return;	
    }	
    },	
    (state: DownloadReportLoadingErrorState) => {	
    me.onLoadingReportError(state);	
      
    }	
    );	
    } catch (err) {	
    console.error("Exception in downloadShowDescReports method in metric description component :", err);	
    }	
    }	
    private onLoadingReport(state: DownloadReportLoadingState) {	
      const me = this;	
      me.error = null;	
      me.loading = true;	
      }	
      private onLoadedReport(state: DownloadReportLoadedState) {	
      const me = this;	
      me.error = null;	
      me.loading = false;	
      let path = state.data.path.trim();	
      let url = window.location.protocol + '//' + window.location.host;	
      path = url + "/common/" + path;	
      window.open(path + "#page=1&zoom=85", "_blank");	
        
      }	
      private onLoadingReportError(state: DownloadReportLoadingErrorState) {	
      const me = this;	
      me.data = null;	
      me.error = state.error;	
      me.loading = false;	
      }

}
