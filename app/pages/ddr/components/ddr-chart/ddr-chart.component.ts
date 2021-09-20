import { Component, OnInit, Input } from '@angular/core';
import { DdrDataModelService } from '../../../tools/actions/dumps/service/ddr-data-model.service';
import * as Highcharts from 'highcharts';
@Component({
  selector: 'app-ddr-chart',
  templateUrl: './ddr-chart.component.html',
  styleUrls: ['./ddr-chart.component.css']
})
export class DdrChartComponent implements OnInit {
  highcharts = Highcharts;
  @Input() chartData;
  options: Object;
  colorThemes: String[] = window['arrColorddr'] || ['#3A99D9', '#F1C330', '#7CB5EC', '#434348'];
  // bgColorThemes: String[] = window['bgColorddr'] || ['rgba(255,255,255,0.2)', 'rgba(0,0,0,0)'];
  constructor(    private _ddrData: DdrDataModelService ) { 

  }

  ngOnInit() {
    this._ddrData.ddrThemeChangeUIObservable$.subscribe(() => {
      console.log("inside ddr chart --");
      this.colorThemes = window['arrColorddr'] || ['#3A99D9', '#F1C330', '#7CB5EC', '#434348'];
      this.makeChart();
    });
    
   this.makeChart();
  
  }

  makeChart()
  {
    // console.log("bgColorThemes===",this.bgColorThemes);
    console.log("colorThemes==",this.colorThemes);
    this.options = {
      chart: {
        height: 30,
        width: 200,
        spacingLeft: .1,
        spacingRight: .1,
        spacingBottom: 1,
        spacingTop: .001,
        backgroundColor: 'transparent' ,

      },
      credits: {
        enabled: false
      },
      title: {
        text: null 
             },
      xAxis: {
        title: {
          text: null
        },
        visible: false
      },
      yAxis: {
        title: {
          text: null,
        },
        visible: false
      },
      legend: {
        enabled: false
      },
      exporting: {
        enabled: false
      },
      plotOptions: {
        series: {
          cursor: false,
          


          enableMouseTracking: false,
          marker: {
            enabled: false,
            states: {
              hover: {
                  enabled: false
              }
          }
          }
        },
      },
      enableMouseTracking:{
        enabled: false
      },
      series: [
        {
          type: 'area',
          data: this.chartData,
          color : this.colorThemes[0],
          // lineColor: 'red',
          lineWidth: .1,
        }
      ]

    };
  }
}
