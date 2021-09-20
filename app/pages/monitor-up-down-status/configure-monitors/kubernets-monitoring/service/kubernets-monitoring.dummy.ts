import { KubernetMonitoring } from "./kubernets-monitoring.model";



export const KUBERNET_MONITOR_DATA: KubernetMonitoring = {
    charts: [
   
      {
      title: null,
      highchart: {
        chart: {
            type: 'pie',
            height:'200px'
        },
        title: {
            text: 'TOTAL PODS',
            align:'left',
            style:{
                'fontFamily':'"Product Sans", sans-serif',
                'fontSize':'14px',
                'fontWeight': '700'
            }
        },
        subtitle: {
            text:'<div style="text-align:center"><div style="font-size: 24px;color: #000;padding-bottom: 2px;">41k</div><div style="font-size: 10px;color: red;"><i class="icons8-down"></i>-100</div></div>',
            useHTML:true,
            align:'left',
            x: 5,
        y: 50,
       
            style:{
                'fontFamily':'"Product Sans", sans-serif',
                // 'fontSize':'16px',
                'fontWeight': '700',
                'width':120,
            }
        },
        credits:{
            enabled: false
        },
        plotOptions: {
            pie: {
                shadow: false,
                center: ['80%', '-40%'],
                showInLegend: true
            },
            
        },
        tooltip: {
            valueSuffix: '%'
        },
        series: [
            {
            name: 'Versions',
            data: [{
      color: "rgb(195,255,176)",
      name: "Chrome v65.0",
      y: 35.74
    }, {
      color: "rgb(118,118,123)",
      name: "Firefox v58.0",
      y: 20.57
    }, {
      color: "rgb(175,232,255)",
      name: "Internet Explorer v11.0",
      y: 27.23
    }],
            size: 110,
            innerSize: '70%',
            dataLabels: {
                enabled:false
            },
            id: 'versions'
        }
    ] as Highcharts.SeriesOptionsType[],

    legend: {
        enabled: true,
        align: 'left',
        verticalAlign: 'middle',
        // layout: 'horizontal',
        x: 0,
        y: 50,
        width:120,
        symbolPadding: 10,
        symbolHeight: 12,
        symbolWidth: 12,
        symbolRadius: 0,
        itemMarginTop: 5,
        itemMarginBottom: 5,
        itemStyle: {
          fontWeight: 'normal',
          textOverflow: 'ellipsis',
          fontFamily:'"Product Sans", sans-serif',
          fontSize:'10px'
        },
        labelFormat: '{name}',
        // backgroundColor: '#F4F8FB',
        itemCheckboxStyle: {
          width: 10,
          height: 10,
          textAlign: 'left',
          cursor: 'pointer',
        },
      },
        responsive: {
            rules: [{
                condition: {
                    maxWidth: 400
                },
                chartOptions: {
                    series: [{
                    }, {
                        id: 'versions',
                        dataLabels: {
                            enabled: false
                        }
                    }] as Highcharts.SeriesOptionsType[]
                }
            }]
        }
    }
},
{
    title: null,
    highchart: {
      chart: {
          type: 'pie',
          height:'200px',
         
      },
      title: {
          text: 'CONTAINERS',
          align:'left',
          style:{
              'fontFamily':'"Product Sans", sans-serif',
              'fontSize':'14px',
              'fontWeight': '700'
          }
      },
      subtitle: {
          text:null
      },
      credits:{
          enabled: false
      },
      plotOptions: {
          pie: {
              shadow: false,
              center: ['85%', '10%'],
              showInLegend: true
          },
          
      },
      tooltip: {
          valueSuffix: '%'
      },
      series: [
          {
          name: 'Versions',
          data: [{
    color: "rgb(195,255,176)",
    name: "Chrome v65.0",
    y: 35.74
  }, {
    color: "rgb(118,118,123)",
    name: "Firefox v58.0",
    y: 20.57
  }, {
    color: "rgb(175,232,255)",
    name: "Internet Explorer v11.0",
    y: 27.23
  }],
          size: '80%',
          innerSize: '70%',
          dataLabels: {
              enabled:false
          },
          id: 'versions'
      }
  ] as Highcharts.SeriesOptionsType[],

  legend: {
      enabled: true,
      align: 'left',
      verticalAlign: 'middle',
      // layout: 'horizontal',
      x: 0,
      y: 50,
      width:120,
      symbolPadding: 10,
      symbolHeight: 12,
      symbolWidth: 12,
      symbolRadius: 0,
      itemMarginTop: 5,
      itemMarginBottom: 5,
      itemStyle: {
        fontWeight: 'normal',
        textOverflow: 'ellipsis',
        fontFamily:'"Product Sans", sans-serif',
        fontSize:'10px'
      },
      labelFormat: '{name}',
      // backgroundColor: '#F4F8FB',
      itemCheckboxStyle: {
        width: 10,
        height: 10,
        textAlign: 'left',
        cursor: 'pointer',
      },
    },
      responsive: {
          rules: [{
              condition: {
                  maxWidth: 400
              },
              chartOptions: {
                  series: [{
                  }, {
                      id: 'versions',
                      dataLabels: {
                          enabled: false
                      }
                  }] as Highcharts.SeriesOptionsType[]
              }
          }]
      }
  }
},
{
    title: null,
    highchart: {
      chart: {
          type: 'pie',
          height:'200px'
      },
      title: {
          text: 'TOTAL WORKLOAD',
          align:'left',
          style:{
              'fontFamily':'"Product Sans", sans-serif',
              'fontSize':'14px',
              'fontWeight': '700'
          }
      },
      subtitle: {
          text:null
      },
      credits:{
          enabled: false
      },
      plotOptions: {
          pie: {
              shadow: false,
              center: ['75%', '10%'],
              showInLegend: true
          },
          
      },
      tooltip: {
          valueSuffix: '%'
      },
      series: [
          {
          name: 'Versions',
          data: [{
    color: "rgb(195,255,176)",
    name: "Chrome v65.0",
    y: 35.74
  }, {
    color: "rgb(118,118,123)",
    name: "Firefox v58.0",
    y: 20.57
  }, {
    color: "rgb(175,232,255)",
    name: "Internet Explorer v11.0",
    y: 27.23
  }],
          size: '80%',
          innerSize: '70%',
          dataLabels: {
              enabled:false
          },
          id: 'versions'
      }
  ] as Highcharts.SeriesOptionsType[],

  legend: {
      enabled: true,
      align: 'left',
      verticalAlign: 'middle',
      // layout: 'horizontal',
      x: 0,
      y: 50,
      width:120,
      symbolPadding: 10,
      symbolHeight: 12,
      symbolWidth: 12,
      symbolRadius: 0,
      itemMarginTop: 5,
      itemMarginBottom: 5,
      itemStyle: {
        fontWeight: 'normal',
        textOverflow: 'ellipsis',
        fontFamily:'"Product Sans", sans-serif',
        fontSize:'10px'
      },
      labelFormat: '{name}',
      // backgroundColor: '#F4F8FB',
      itemCheckboxStyle: {
        width: 10,
        height: 10,
        textAlign: 'left',
        cursor: 'pointer',
      },
    },
      responsive: {
          rules: [{
              condition: {
                  maxWidth: 400
              },
              chartOptions: {
                  series: [{
                  }, {
                      id: 'versions',
                      dataLabels: {
                          enabled: false
                      }
                  }] as Highcharts.SeriesOptionsType[]
              }
          }]
      }
  }
}


,


{
    title: null,
    highchart: {
      chart: {
          type: 'pie',
          height:'200px'
      },
      title: {
          text: 'TOTAL PODS',
          align:'left',
          style:{
              'fontFamily':'"Product Sans", sans-serif',
              'fontSize':'14px',
              'fontWeight': '700'
          }
      },
      subtitle: {
          text:null
      },
      credits:{
          enabled: false
      },
      plotOptions: {
          pie: {
              shadow: false,
              center: ['75%', '10%'],
              showInLegend: true
          },
          
      },
      tooltip: {
          valueSuffix: '%'
      },
      series: [
          {
          name: 'Versions',
          data: [{
    color: "rgb(195,255,176)",
    name: "Chrome v65.0",
    y: 35.74
  }, {
    color: "rgb(118,118,123)",
    name: "Firefox v58.0",
    y: 20.57
  }, {
    color: "rgb(175,232,255)",
    name: "Internet Explorer v11.0",
    y: 27.23
  }],
          size: '80%',
          innerSize: '70%',
          dataLabels: {
              enabled:false
          },
          id: 'versions'
      }
  ] as Highcharts.SeriesOptionsType[],

  legend: {
      enabled: true,
      align: 'left',
      verticalAlign: 'middle',
      // layout: 'horizontal',
      x: 0,
      y: 50,
      width:120,
      symbolPadding: 10,
      symbolHeight: 12,
      symbolWidth: 12,
      symbolRadius: 0,
      itemMarginTop: 5,
      itemMarginBottom: 5,
      itemStyle: {
        fontWeight: 'normal',
        textOverflow: 'ellipsis',
        fontFamily:'"Product Sans", sans-serif',
        fontSize:'10px'
      },
      labelFormat: '{name}',
      // backgroundColor: '#F4F8FB',
      itemCheckboxStyle: {
        width: 10,
        height: 10,
        textAlign: 'left',
        cursor: 'pointer',
      },
    },
      responsive: {
          rules: [{
              condition: {
                  maxWidth: 400
              },
              chartOptions: {
                  series: [{
                  }, {
                      id: 'versions',
                      dataLabels: {
                          enabled: false
                      }
                  }] as Highcharts.SeriesOptionsType[]
              }
          }]
      }
  }
},
{
  title: null,
  highchart: {
    chart: {
        type: 'pie',
        height:'200px'
    },
    title: {
        text: 'CONTAINERS',
        align:'left',
        style:{
            'fontFamily':'"Product Sans", sans-serif',
            'fontSize':'14px',
            'fontWeight': '700'
        }
    },
    subtitle: {
        text:null
    },
    credits:{
        enabled: false
    },
    plotOptions: {
        pie: {
            shadow: false,
            center: ['75%', '10%'],
            showInLegend: true
        },
        
    },
    tooltip: {
        valueSuffix: '%'
    },
    series: [
        {
        name: 'Versions',
        data: [{
  color: "rgb(195,255,176)",
  name: "Chrome v65.0",
  y: 35.74
}, {
  color: "rgb(118,118,123)",
  name: "Firefox v58.0",
  y: 20.57
}, {
  color: "rgb(175,232,255)",
  name: "Internet Explorer v11.0",
  y: 27.23
}],
        size: '80%',
        innerSize: '70%',
        dataLabels: {
            enabled:false
        },
        id: 'versions'
    }
] as Highcharts.SeriesOptionsType[],

legend: {
    enabled: true,
    align: 'left',
    verticalAlign: 'middle',
    // layout: 'horizontal',
    x: 0,
    y: 50,
    width:120,
    symbolPadding: 10,
    symbolHeight: 12,
    symbolWidth: 12,
    symbolRadius: 0,
    itemMarginTop: 5,
    itemMarginBottom: 5,
    itemStyle: {
      fontWeight: 'normal',
      textOverflow: 'ellipsis',
      fontFamily:'"Product Sans", sans-serif',
      fontSize:'10px'
    },
    labelFormat: '{name}',
    // backgroundColor: '#F4F8FB',
    itemCheckboxStyle: {
      width: 10,
      height: 10,
      textAlign: 'left',
      cursor: 'pointer',
    },
  },
    responsive: {
        rules: [{
            condition: {
                maxWidth: 400
            },
            chartOptions: {
                series: [{
                }, {
                    id: 'versions',
                    dataLabels: {
                        enabled: false
                    }
                }] as Highcharts.SeriesOptionsType[]
            }
        }]
    }
}
},
{
  title: null,
  highchart: {
    chart: {
        type: 'pie',
        height:'200px'
    },
    title: {
        text: 'TOTAL WORKLOAD',
        align:'left',
        style:{
            'fontFamily':'"Product Sans", sans-serif',
            'fontSize':'14px',
            'fontWeight': '700'
        }
    },
    subtitle: {
        text:null
    },
    credits:{
        enabled: false
    },
    plotOptions: {
        pie: {
            shadow: false,
            center: ['75%', '10%'],
            showInLegend: true
        },
        
    },
    tooltip: {
        valueSuffix: '%'
    },
    series: [
        {
        name: 'Versions',
        data: [{
  color: "rgb(195,255,176)",
  name: "Chrome v65.0",
  y: 35.74
}, {
  color: "rgb(118,118,123)",
  name: "Firefox v58.0",
  y: 20.57
}, {
  color: "rgb(175,232,255)",
  name: "Internet Explorer v11.0",
  y: 27.23
}],
        size: '80%',
        innerSize: '70%',
        dataLabels: {
            enabled:false
        },
        id: 'versions'
    }
] as Highcharts.SeriesOptionsType[],

legend: {
    enabled: true,
    align: 'left',
    verticalAlign: 'middle',
    // layout: 'horizontal',
    x: 0,
    y: 50,
    width:120,
    symbolPadding: 10,
    symbolHeight: 12,
    symbolWidth: 12,
    symbolRadius: 0,
    itemMarginTop: 5,
    itemMarginBottom: 5,
    itemStyle: {
      fontWeight: 'normal',
      textOverflow: 'ellipsis',
      fontFamily:'"Product Sans", sans-serif',
      fontSize:'10px'
    },
    labelFormat: '{name}',
    // backgroundColor: '#F4F8FB',
    itemCheckboxStyle: {
      width: 10,
      height: 10,
      textAlign: 'left',
      cursor: 'pointer',
    },
  },
    responsive: {
        rules: [{
            condition: {
                maxWidth: 400
            },
            chartOptions: {
                series: [{
                }, {
                    id: 'versions',
                    dataLabels: {
                        enabled: false
                    }
                }] as Highcharts.SeriesOptionsType[]
            }
        }]
    }
}
},



{
    title: null,
    highchart: {
        chart: {
            type: 'column',
            height:'250px'
        },
        title: {
            text: 'USAGE',
            align: 'left',
            style:{
                'fontFamily':'"Product Sans", sans-serif',
                'fontSize':'14px',
                'fontWeight': '700'
            }
        },
        xAxis: {
            categories: ['4 Feb', '5 Feb', '6 Feb', '7 Feb', '8 Feb', '9 Feb', '10 Feb']
        },
        yAxis: {
            min: 0,
            title: {
                text: null
            }
        },
        tooltip: {
            enabled: false
        },
        plotOptions: {
            column: {
                stacking: 'normal',
            }
        },
        series: [{
            name: 'John',
            data: [5, 3, 4, 7, 2, 7, 2]
        }, {
            name: 'Jane',
            data: [2, 2, 3, 2, 1, 7, 2]
        }, {
            name: 'Joe',
            data: [3, 4, 4, 2, 5, 7, 2]
        },
        {
            name: 'Joe',
            data: [3, 4, 4, 2, 5, 7, 2]
        },
        {
            name: 'Joe',
            data: [3, 4, 4, 2, 5, 7, 2]
        }] as Highcharts.SeriesOptionsType[],
        credits:{
            enabled: false
        },
        legend: {
            enabled: true,
            align: 'left',
            verticalAlign: 'middle',
            // layout: 'horizontal',
            x: 0,
            y: 50,
            width:120,
            symbolPadding: 10,
            symbolHeight: 12,
            symbolWidth: 12,
            symbolRadius: 0,
            itemMarginTop: 5,
            itemMarginBottom: 5,
            itemStyle: {
                fontWeight: 'normal',
                textOverflow: 'ellipsis',
                fontFamily:'"Product Sans", sans-serif',
                fontSize:'10px'
              },
            labelFormat: '{name}',
            // backgroundColor: '#F4F8FB',
            itemCheckboxStyle: {
              width: 10,
              height: 10,
              textAlign: 'left',
              cursor: 'pointer',
            },
          }
    },
    
  },
  {
    title: null,
    highchart: {
        chart: {
            type: 'column',
            height:'250px'
        },
        title: {
            text: 'USAGE',
            align: 'left',
            style:{
                'fontFamily':'"Product Sans", sans-serif',
                'fontSize':'14px',
                'fontWeight': '700'
            }
        },
        xAxis: {
            categories: ['4 Feb', '5 Feb', '6 Feb', '7 Feb', '8 Feb', '9 Feb', '10 Feb']
        },
        yAxis: {
            min: 0,
            title: {
                text: null
            }
        },
        tooltip: {
            enabled: false
        },
        plotOptions: {
            column: {
                stacking: 'normal',
            }
        },
        series: [{
            name: 'John',
            data: [5, 3, 4, 7, 2, 7, 2]
        }, {
            name: 'Jane',
            data: [2, 2, 3, 2, 1, 7, 2]
        }, {
            name: 'Joe',
            data: [3, 4, 4, 2, 5, 7, 2]
        },
        {
            name: 'Joe',
            data: [3, 4, 4, 2, 5, 7, 2]
        },
        {
            name: 'Joe',
            data: [3, 4, 4, 2, 5, 7, 2]
        }] as Highcharts.SeriesOptionsType[],
        credits:{
            enabled: false
        },
        legend: {
            enabled: true,
            align: 'left',
            verticalAlign: 'middle',
            // layout: 'horizontal',
            x: 0,
            y: 50,
            width:120,
            symbolPadding: 10,
            symbolHeight: 12,
            symbolWidth: 12,
            symbolRadius: 0,
            itemMarginTop: 5,
            itemMarginBottom: 5,
            itemStyle: {
                fontWeight: 'normal',
                textOverflow: 'ellipsis',
                fontFamily:'"Product Sans", sans-serif',
                fontSize:'10px'
              },
            labelFormat: '{name}',
            // backgroundColor: '#F4F8FB',
            itemCheckboxStyle: {
              width: 10,
              height: 10,
              textAlign: 'left',
              cursor: 'pointer',
            },
          }
    },
    
  },
  {
    title: null,
    highchart: {
        chart: {
            type: 'column',
            height:'250px'
        },
        title: {
            text: 'USAGE',
            align: 'left',
            style:{
                'fontFamily':'"Product Sans", sans-serif',
                'fontSize':'14px',
                'fontWeight': '700'
            }
        },
        subtitle: {
            text:'<div style="text-align:center"><div style="font-size: 24px;color: #000;padding-bottom: 2px;">41k</div><div style="font-size: 10px;color: red;"><i class="icons8-down"></i>-100</div></div>',
            useHTML:true,
            align:'left',
            x: 5,
        y: 50,
       
            style:{
                'fontFamily':'"Product Sans", sans-serif',
                // 'fontSize':'16px',
                'fontWeight': '700',
                'width':120,
            }
        },
        xAxis: {
            categories: ['4 Feb', '5 Feb', '6 Feb', '7 Feb', '8 Feb', '9 Feb', '10 Feb']
        },
        yAxis: {
            min: 0,
            title: {
                text: null
            }
        },
        tooltip: {
            enabled: false
        },
        plotOptions: {
            column: {
                stacking: 'normal',
            }
        },
        series: [{
            name: 'John',
            data: [5, 3, 4, 7, 2, 7, 2]
        }, {
            name: 'Jane',
            data: [2, 2, 3, 2, 1, 7, 2]
        }, {
            name: 'Joe',
            data: [3, 4, 4, 2, 5, 7, 2]
        },
        {
            name: 'Joe',
            data: [3, 4, 4, 2, 5, 7, 2]
        },
        {
            name: 'Joe',
            data: [3, 4, 4, 2, 5, 7, 2]
        }] as Highcharts.SeriesOptionsType[],
        credits:{
            enabled: false
        },
        legend: {
            enabled: true,
            align: 'left',
            verticalAlign: 'middle',
            // layout: 'horizontal',
            x: 0,
            y: 50,
            width:120,
            symbolPadding: 10,
            symbolHeight: 12,
            symbolWidth: 12,
            symbolRadius: 0,
            itemMarginTop: 5,
            itemMarginBottom: 5,
            itemStyle: {
                fontWeight: 'normal',
                textOverflow: 'ellipsis',
                fontFamily:'"Product Sans", sans-serif',
                fontSize:'10px'
              },
            labelFormat: '{name}',
            // backgroundColor: '#F4F8FB',
            itemCheckboxStyle: {
              width: 10,
              height: 10,
              textAlign: 'left',
              cursor: 'pointer',
            },
          }
    },
    
  }


      
    ],
}