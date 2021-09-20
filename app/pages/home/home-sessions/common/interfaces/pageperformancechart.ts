import { PageTrend } from './pageperformancedata';
import { Metadata } from './metadata';
import { ParsePagePerformanceFilters } from './parsepageperformancefilter';
//import { PageperformanceComponent } from '../components/pageperformance/pageperformance.component';
import * as moment from 'moment';
import 'moment-timezone';
import { Config } from "./config";
//import {AppComponent} from "./../app.component";
export class PagePerformanceChart
{
  title:string;
  subtitle:string;
  series: any = [];
  data: any; 
  trend: PageTrend;
  metadata: Metadata;
  constructor(title,subtitle,data)
  {
   this.identifyPeakBucket(data);
   this.title = title;
   this.subtitle = 'Product Page';
   this.data = data;
   this.series = [
                  {
                    yAxis: 1,
                    name: 'Page Views',
                    type: 'area',
                    data: this.setdata(PageTrend.pageview),
                    boostThreshold : 20
                  },
                  { type : 'spline',
                    yAxis: 0,
                    name: 'Onload',
                    data:  this.setdata(PageTrend.onload),
                    boostThreshold : 20
                  },
                  { type : 'spline',
                    yAxis: 0,
                    name: 'Time to DOM Interactive',
                    data: this.setdata(PageTrend.ttdi),
                    boostThreshold : 20
                  },
                  { type : 'spline',
                    yAxis: 0,
                    name: 'Dom Complete',
                    data: this.setdata(PageTrend.dom),
                    boostThreshold : 20
                  },
                  { type : 'spline',
                    yAxis: 0,
                    name: 'Perceived Render Time',
                    data: this.setdata(PageTrend.prt),
                    boostThreshold : 20
                  },
                  { type : 'spline',
                    yAxis: 0,
                    name: 'Redirection',
                    data: this.setdata(PageTrend.redirect),
                    boostThreshold : 20
                  },
                  { type : 'spline',
                    yAxis: 0,
                    name: 'Cache',
                    data: this.setdata(PageTrend.cache),
                    boostThreshold : 20
                  },
                  { type : 'spline',
                    yAxis: 0,
                    name: 'DNS',
                    data: this.setdata(PageTrend.dns),
                    boostThreshold : 20
                  },
                  { type : 'spline',
                    yAxis: 0,
                    name: 'TCP',
                    data: this.setdata(PageTrend.tcp),
                    boostThreshold : 20
                  },
                  { type : 'spline',
                    yAxis: 0,
                    name: 'Time To Content Load',
                    data: this.setdata(PageTrend.ttdl),
                    boostThreshold : 20
                  },
                  { type : 'spline',
                    yAxis: 0,
                    name: 'BasePage DownLoad',
                    data: this.setdata(PageTrend.download),
                    boostThreshold : 20
                  },
                  { type : 'spline',
                    yAxis: 0,
                    name: '1st Byte',
                    data: this.setdata(PageTrend.wait),
                    boostThreshold : 20
                  },
                  { type : 'spline',
                    yAxis: 0,
                    name: 'First Paint',
                    data: this.setdata(PageTrend.firstpaint),
                    boostThreshold : 20
                  },
		  { type : 'spline',
                    yAxis: 0,
                    name: 'First Content Paint',
                    data: this.setdata(PageTrend.firstcontentpaint),
                    boostThreshold : 20
                  },
		  { type : 'spline',
                    yAxis: 0,
                    name: 'Time to Interactive',
                    data: this.setdata(PageTrend.timetointeractive),
                    boostThreshold : 20
                  },
		  { type : 'spline',
                    yAxis: 0,
                    name: 'First Input Delay',
                    data: this.setdata(PageTrend.firstinputdelay),
                    boostThreshold : 20
                  },
                 ]

  }

  setdata(index)
  {
    let result = [];
    for(let a = 0; a < this.data.length; a++)
     {
       let datetime = this.data[a][0] * 1000;
       let datatemp = (parseFloat(this.data[a][index]) < 0) ? "0.00" : this.data[a][index];
       let data;
       if(index !== PageTrend.pageview)
           data = parseFloat((parseFloat(datatemp)/1000).toFixed(3));
        else
           data = parseInt(datatemp);
       result.push([datetime, data]);
     }
    return result;
  }

  peakBand = null;

  // pick the bucket having highest DOM Interactive time and then onload time
  identifyPeakBucket(data)
  {
    let peakBucket = null;
    // search for peak bucket in given time duration
    if(data !== null && data.length > 0)
    {
      peakBucket = data[0];
      for(let i = 1; i < data.length; i++)
      {

        /*
           3 : DOM Interactive
           1 : Onload
        */

        if(parseFloat(data[i][3]) > parseFloat(peakBucket[3]))
           peakBucket = data[i];

        // if DOM Interactive is equal compare onload time.
        else if(parseFloat(data[i][3]) === parseFloat(peakBucket[3]) && parseFloat(data[i][1]) > parseFloat(peakBucket[1]))
          peakBucket = data[i];

      }
    }
    
    // if(peakBucket != null) 
    // {
    //   let bucket = 3600;
    //   if(PageperformanceComponent.parsepagefilter !== undefined && PageperformanceComponent.parsepagefilter !== null && PageperformanceComponent.parsepagefilter.pagePerformanceFilters.bucket !== undefined && PageperformanceComponent.parsepagefilter.pagePerformanceFilters.bucket !== null)
    //   bucket = PageperformanceComponent.parsepagefilter.pagePerformanceFilters.bucket; 
    //   let timestart = new Date(moment.tz( parseInt(peakBucket[0])*1000,"").format('MM/DD/YYYY HH:mm:ss')).getTime()/1000;
    //   this.peakBand = { "from" : parseInt(peakBucket[0]) - bucket/2, "to" : (parseInt(peakBucket[0]) + bucket/2), "start" : timestart } ;
    //   console.log("peak band",this.peakBand);
    // }
  }

} 

