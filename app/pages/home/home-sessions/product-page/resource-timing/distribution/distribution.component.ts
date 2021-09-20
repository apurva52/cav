import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-distribution',
  templateUrl: './distribution.component.html',
  styleUrls: ['./distribution.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DistributionComponent implements OnInit {
  @Input() resourceTimingData:any;
  @Input() hostData: any;
  @Input() hostRawData: any;
  @Input() page: any;
  @Input() contentData: any;
  @Input() contentPieData: any; 
  @Input() contentTableData: any;
  @Input() hostTableData: any;
  columns: any =[];
  tooltipzindex = 100000; 
  
  
  limit :any ;
  hostlimit:number ;
  limitInput:number ;
  pageLoadObj:any ;
  req :any;
  res:any ;
  plArray :any ;
  reqArray:any ;
  resArray:any ; 
  columns_c:any[];
  tableData:any[]; 
  hostchart:any;
  chart :any; 
  chartB :any; 
  chart_C:any; 
  chartCB:any;
  


  constructor() {  
    this.limit = 0;
    this.hostlimit = 0;
    this.limitInput = 10;

    this.pageLoadObj = {};
    this.req = {}
    this.res = {};
    this.plArray = "";
    this.reqArray= "";
    this.resArray= "";
     this.columns = [ 
       { field: 'hostName', header: 'Host' },
       { field: 'hostRequest', header: '#Request' },
       { field: 'hostRequestPct', header: '%Request' },
       { field: 'hostAvgResponse', header: 'AvgResponse(ms)' },
       { field: 'hostLoadDuration', header: '%loadDuration' }, 
       ]; 
    this.columns_c = [ 
       { field: 'ContentType', header: 'ContentType' },
       { field: 'Request', header: '#Request' },
       { field: 'RequestPct', header: '%Request' },
       { field: 'AvgResponse', header: 'AvgResponse(ms)' },
       { field: 'LoadDuration', header: '%loadDuration' }, 
        ]; 

  }
  

  ngOnInit(): void {
     const me = this;
     
     

  }  
  hostSelect()
  {
   
  } 
  ngOnChanges() {
    this.gethostTableData(); 
    this.getChartData(this.hostData); 
    this.getcontChartData(this.contentPieData); 
    this.getChartBData();
    
  } 
  onBlurMethod()
   {
     if(this.plArray.length == 0) 
       this.sortedHostData(this.hostRawData);
       this.hostData = this.getHostPieData(this.hostRawData,this.hostlimit); 
       this.getChartData(this.hostData); 
       this.getChartBData();
   } 
   //on change method for host sellect 
   onHostChange(value)
  {
    this.hostData = null;
    this.hostlimit = value;
    if(this.plArray.length == 0)
      this.sortedHostData(this.hostRawData);
    this.hostData = this.getHostPieData(this.hostRawData,value); 
    this.getChartData(this.hostData) 
     if (this.plArray.length == 0 && this.hostlimit == 2 ) 
    this.hostData = this.getHostPieData(this.hostRawData, value);
     this.getChartBData();
  }
  
  //on change method for content select
  onChange(graphValue) {  
   
     this.contentPieData = null; 
     this.limit = graphValue;  
     if (this.limit == 0 ){
         this.contentPieData = this.getContentPieData(this.contentData,graphValue); 
         this.getcontChartData(this.contentPieData)  
     }
    else if (this.limit == 1){
          this.contentPieData = this.getContentPieData(this.contentData,1); 
          this.getcontChartData(this.contentPieData) 
    } 
    else 
         this.contentPieData = this.getContentPieData(this.contentData,graphValue);  
         this.getconChartBData()
  } 
  
     // data for hosttable
     gethostTableData(): void {

       this.tableData = [];
  
      for (const d of this.hostTableData) {
        this.tableData.push({
          hostName: d.hostName,
           hostRequest: d.hostRequest,
           hostRequestPct: d.hostRequestPct,
           hostAvgResponse: d.hostAvgResponse,
           hostLoadDuration: d.hostLoadDuration,
          
         });
       }
     } 
    
getContentPieData(obj,value)
  {
    let sselect = "";
    let content = [];
    for(let i =0; i< obj.arrContentType.length; i++)
    {
       let c = {};
       if(value == 0)
         sselect = ((obj.arrContentResponse[obj.arrContentType[i]].time/obj.totalResponse)*100).toFixed(2);
       else if(value == 1)
          sselect = obj.arrRequestPct[i];
       else if(value == 2) 
         sselect = (obj.arrContentResponse[obj.arrContentType[i]].time/obj.arrContentResponse[obj.arrContentType[i]].count).toFixed(2);
       c["name"] = obj.arrContentType[i] ;
       c["y"] = parseFloat(sselect);
       content.push(c);
    }
    return content;
  }  
  sortedHostData(obj)
  {
    for(let i =0; i< obj.hostName.length; i++) 
    {
       this.pageLoadObj[obj.hostName[i]] = ((obj.hostObj[obj.hostName[i]].time/obj.totalResponse)*100).toFixed(2);
       this.req[obj.hostName[i]] =  obj.hostObj[obj.hostName[i]].count;
       this.res[obj.hostName[i]] = (obj.hostObj[obj.hostName[i]].time/obj.hostObj[obj.hostName[i]].count).toFixed(2);
    }
       this.plArray = this.sortGrp(this.pageLoadObj,false);
       this.reqArray =  this.sortGrp(this.req,false);
       this.resArray =  this.sortGrp(this.res,false);
  } 
   sortGrp(grp, flag)
   {
    let keysSorted = [];
     if(!flag)
       keysSorted = Object.keys(grp).sort(function(a,b){return grp[b]-grp[a]})
     else
       keysSorted = Object.keys(grp).sort(function(a,b){return (grp[b].time/grp[b].count)-(grp[a].time/grp[a].count)})
     return keysSorted;
  } 
   getHostPieData(obj,value)
   { 
    
     let sselect = "";
     let content = [];
     if(obj.hostName.length < this.limitInput)
      this.limitInput = obj.hostName.length;
     for(let i =0; i< this.limitInput; i++)
     {
        let c = {};
        if(value == 0)
        {
           c["name"] = this.plArray[i];
           c["y"] = parseFloat(this.pageLoadObj[this.plArray[i]]);
        }
         else if(value == 1)
         {
            c["name"] = this.reqArray[i];
            c["y"] = parseFloat(this.req[this.reqArray[i]]);
         }
        else if(value == 2) 
        
        {
           c["name"] = this.resArray[i];
           c["y"] = parseFloat(this.res[this.resArray[i]]);
        }
        content.push(c);
      }
    return content;
   }  

   //pie graph for hoststatic 
  getChartData(gphdata) {
    this.chart = { 
         title: 'Host Statistics',
       highchart: {
         credits: {
                   enabled: false
                },
          chart: {
                   plotBackgroundColor: null,
                    plotBorderWidth: null,
                     plotShadow: false,
                   type: 'pie',
                 },
                   title: {
                   text: '',
                 },
                  tooltip: {
                      pointFormat: '<b>{point.name}</b>: {point.y:.2f}' || ' <b>{point.y:.0f}</b>'
                       },
                   plotOptions: {
             pie: {
                   allowPointSelect: true,
                   cursor: 'pointer',
                   dataLabels: {
                               enabled: true,
                               formatter: function () {
                                         let a = '<b>' + this.point.name + '</b>'
                                           + ' : ' + (this.point.y).toLocaleString();
                                          return a;
                                         },
                                 style: {
                                 color: 'black'
                                         }
                                  }
                               }
                          },
                    series: [{
                            name: '',
                             size: '50%',
                             colorByPoint: true,
                              data: gphdata
                             }],
                    exporting: {
                              enabled: true,
                              sourceWidth: 1200,
                              sourceHeight: 500,
                    buttons: { contextButton: { align: 'left' } }
                                 }
        
                                }
        
                              };
                           }  
    //bar graph for hoststatic                       
  getChartBData(){ 
    console.log("getChartBData");   
    this.chartB={
      
        title : 'Host Statistics',
        highchart:{ 
          credits: {
            enabled: false
          },
        chart: {
            height:  400,
            width:  500,
            type: 'column'
        },
        title: {
            text:  'Domains By Duration'
        },
        subtitle: {
            text: ''
        },
        time: {
          timezone: sessionStorage.getItem('_nvtimezone')
         },
        xAxis: {
            type: 'category',
            labels: {
            rotation:  0,
            style: {
                fontSize: '11px',
                fontFamily: 'Verdana, sans-serif'
            }
         }
        },
        yAxis: {
            title: {
                text:  'Milliseconds'
            }

        },
        legend: {
            enabled: false
        },

         plotOptions: {
            series: {
                borderWidth: 0,
                dataLabels: {
                    enabled: true,
                    align: 'left',
                    crop : false,
                    rotation: 270,
                    x: 2,
                    y: -10,
                    allowOverlap: true,
                    //format: '{point.y:.2f}',
                     style: {
                       fontSize: "8px"
                   }
                }
            }
        },
        tooltip: {
            headerFormat: '<span style="font-size:11px"></span>',
            pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}</b>'
        },

        series: [{
            name: '',
            colorByPoint: true,
            pointWidth: 15,
            data: this.hostData
        } ]

      }
        }
      } 
      //pie graph for content type
      getcontChartData(gpdata) {
        this.chart_C = { 
          
          
            title: 'Content Type Statistics',
            highchart: {
               credits: {
                        enabled: false
                        },
               chart: {
                        plotBackgroundColor: null,
                        plotBorderWidth: null,
                        plotShadow: false,
                        type: 'pie',
                      },
               title: {
                        text: '',
                      },
            tooltip: {
                        pointFormat: '<b>{point.name}</b>: {point.y:.2f}' || ' <b>{point.y:.0f}</b>'
                     },
            plotOptions: {
                        pie: {
                            allowPointSelect: true,
                            cursor: 'pointer',
                            dataLabels: {
                                        enabled: true,
                                        //format: '<b>{point.name}</b>: {point.y:.'+this.decimaplaces+'f}',
                                        formatter: function () {
                                        let a = '<b>' + this.point.name + '</b>'
                                        + ' : ' + (this.point.y).toLocaleString();
                                        return a;
                                         },
                                 style: {
                                        color: 'black'
                                        }
                               }
                           }
                         },
            series: [{
                     name: '',
                     size: '50%',
                     colorByPoint: true,
                     data: gpdata //this.contentPieData
                    }],
            exporting: {
                     enabled: true,
                     sourceWidth: 1200,
                      sourceHeight: 500,
                      buttons: { contextButton: { align: 'left' } }
                      }
            
                }
            
        };
      }  
      //bar graph for content type
      getconChartBData(){  
        //console.log("@@@@priyanka@@@@@")
        this.chartCB={  
          title: 'Content Type Statistics',
          highchart: {  
            credits: {
              enabled: false
            },
         chart: {
             //height:  400,
            // width:  500,
             type: 'column'
         },
         title: {
             text:  'Domains By Duration'
         },
         subtitle: {
             text: ''
         },
         time: {
           timezone: sessionStorage.getItem('_nvtimezone')
          },
         xAxis: {
             type: 'category',
             labels: {
             rotation:  0,
             style: {
                 fontSize: '11px',
                 fontFamily: 'Verdana, sans-serif'
             }
          }
         },
         yAxis: {
             title: {
                 text:  'Milliseconds'
             }
 
         },
         legend: {
             enabled: false
         },
 
          plotOptions: {
             series: {
                 borderWidth: 0,
                 dataLabels: {
                     enabled: true,
                     align: 'left',
                     crop : false,
                     rotation: 270,
                     x: 2,
                     y: -10,
                     allowOverlap: true,
                    // format: '{point.y:.2f}',
                      style: {
                        fontSize: "8px"
                    }
                 }
             }
         },
         tooltip: {
             headerFormat: '<span style="font-size:11px"></span>',
             pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}</b>'
         },
 
         series: [{
             name: '',
             colorByPoint: true,
             pointWidth: 15,
             data: this.contentPieData
         } ]
 
     
          
            }
          } 
          
        }
}
