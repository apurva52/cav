import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { PaneOptions } from 'highcharts';
import { VISUAL_CHART_DATA } from './service/visual-chart.dummy';
import { VisualChart } from './service/visual-chart.model';

@Component({
  selector: 'app-visual-chart',
  templateUrl: './visual-chart.component.html',
  styleUrls: ['./visual-chart.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class VisualChartComponent implements OnInit {

  visualChart: VisualChart;
  @Input() XaxisData; 
  @Input() YaxisData;
  @Input() ChartType
  @Input() XaxisTitle
  @Input() YaxisTitle
  @Input() legendArr;
  @Input() optionConf;
  @Output() zoomchanges: EventEmitter<any> = new EventEmitter()
  series_data: { name?: string, type: string; data: any; dataLabels?: any}[];
  pane: PaneOptions;
  height= '400px'
  gaugeStops = [];
    ngOnChanges() {
      // changes=this.nfdbresponse
      console.log(this.YaxisData)
      console.log(this.ChartType)
  
      if(this.XaxisData.length !== 0&&this.YaxisData.length!==0){
        console.log("valuee")
        this.ngOnInit()
      }
      else{
        // this.YaxisData= [5,25,50,120,150,200,426]
        // this.XaxisData=['1438367400000','1443637800000','1451586600000','1454265000000','1456770600000','1459449000000','1462041000000']
      this.ngOnInit()
      }
    }

  constructor() { }

  ngOnInit(): void {
    console.log(this.optionConf)
    const me = this;
    me.series_data=[]
    console.log(this.ChartType)
if(this.ChartType==undefined){
  this.height='200px'
  me.series_data=[
    {
      name: 'count',
      type: 'column',
      data: this.YaxisData,
    },
    {
      name: 'count',
      type: 'spline',
      data: this.YaxisData,
    },
  ]
  this.optionConf = {
    legendPosition: {
      label: 'right'
    },
    tooltipEnable: true
  }
}
else if(this.ChartType=="Area Chart"){
  for(let i=0;i<this.YaxisData.length;i++){
    me.series_data[i]={
      name: this.legendArr[i],
      type: 'area',
      data: this.YaxisData[i],
    }
  }
  // me.series_data=[{
     
  //   type: 'area',
  //   data: this.YaxisData,
  // }]
  console.log(me.series_data)
}
else if(this.ChartType=="Line Chart"){
  for(let i=0;i<this.YaxisData.length;i++){
    me.series_data[i]={
     name: this.legendArr[i],
      type: 'spline',
      data: this.YaxisData[i],
    }
  }
}
else if(this.ChartType=="Vertical Bar Chart"){
  for(let i=0;i<this.YaxisData.length;i++){
    me.series_data[i]={
      name: this.legendArr[i],
      type: 'column',
      data: this.YaxisData[i],
    }
  }
}
else if(this.ChartType=="Gauge"){
  this.pane= {
    center: ['50%', '85%'],
    size: '140%',
    startAngle: -90,
    endAngle: 90,
    background: [{
      innerRadius: '60%',
      outerRadius: '100%',
      shape: 'arc'
  }]
}
this.optionConf.gaugeLevelArr.forEach((value,index)=>{
  this.gaugeStops[index] = [value.levelValue,value.levelColor];
  })
  for(let i=0;i<this.YaxisData.length;i++){
    me.series_data[i]={
      name: this.legendArr[i],
      type: 'solidgauge',
      dataLabels: {
        format:
            '<div style="text-align:center">' +
            '<span style="font-size:20px">{y}</span><br/>'  +
            '</div>'
      },
      data: this.YaxisData[i],
    }
  }
}
else if(this.ChartType=="Pie Chart"){
   let pieSeries = [];
  for(let i=0;i<this.YaxisData.length;i++){
    pieSeries.push({
      type: 'pie',
      data: [],
    })
    for(let j=0;j<this.YaxisData[i].length;j++) {
      pieSeries[i].data.push({
        name: this.XaxisData[j],
        y: this.YaxisData[i][j]
      })
    }
  }
  me.series_data = pieSeries;
  console.log('==========series data=====', me.series_data)
}
    
  console.log(this.XaxisData)
  if(this.XaxisData.length==0&&this.YaxisData.length==0){
    this.makechart()
  }
   else if(this.XaxisData.length!=0&&this.YaxisData.length!=0){
    this.makechart()
    }
    else{
    
      this.makechart()
    }
  }
  zoomfun(zgte, zlte) {
    this.zoomchanges.emit({ gte: zgte, lte: zlte });
    console.log('zooming for logtable');
  }
  makechart(){
    const me = this;
    console.log(me.XaxisData)
    // me.visualChart.charts[0].highchart.xAxis['categories']=this.XaxisData
    // me.visualChart.charts[0].highchart.series[0]['data']=this.YaxisData
    // me.visualChart.charts[0].highchart.series[1]['data']=this.YaxisData
    me.visualChart = {
      charts: [
        {
          title: '',
          highchart: {
            chart: {
              zoomType: 'x',
              height:this.height
            },
            credits: {
              enabled: false
              },
            title: {
              text: null,
            },
            pane:this.pane,
            legend: {
              enabled: true,
              layout: this.optionConf.legendPosition.label == 'center' ? 'horizontal' : 'vertical',
              verticalAlign: this.optionConf.legendPosition.label == 'center' ? 'bottom' : 'top',
              align: this.optionConf.legendPosition.label,
              itemWidth: 120
            },
            xAxis: {
              allowDecimals: false,
              categories:this.XaxisData,
              title: {text:this.XaxisTitle},
              events: {
                setExtremes: (event) => {
                  if (event.trigger == 'zoom') {
                    let gte = Math.round(event.min);
                    let lte = Math.round(event.max)
                    gte = event['target']['categories'][gte]
                    lte = event['target']['categories'][lte]
                    console.log(gte);
                    console.log(lte);
                    let zoomgte = new Date(gte).getTime()
                    let zoomlte = new Date(lte).getTime()
                    this.zoomfun(zoomgte, zoomlte)


                  }
                }
              },
              // accessibility: {
              //   rangeDescription: 'Range: 1940 to 2017.',
              // },
            },
            yAxis: {
              stops: this.gaugeStops,
              title: {
                text: this.YaxisTitle,

              },
              min: this.ChartType == 'Gauge' ? this.optionConf.gaugeMinVal : 0,
              max: this.ChartType == 'Gauge' ? this.optionConf.gaugeMaxVal : undefined,
              labels: {
                y: 16
              }
            },
            tooltip: {
              enabled: this.optionConf.tooltipEnable,
              formatter: function() {
                if (this.x == undefined) {
                return '<b>' + this.y + '</b><br><b>' + this.point.name + '</b>';
                }
                return '<b>' + this.point.series.name + '</b><br><b>' + this.y + '</b><br><b>' + this.x + '</b>';
              },
            },
            plotOptions: {
              series: {
               // pointStart: 1940,
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
              pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>',
                },
                showInLegend: true
            },
            },
            series:this.series_data  as Highcharts.SeriesOptionsType[],
          },
        },  
      ],};

   
    console.log(me.visualChart.charts)
  
  
  }

}