export class Processdomaindata {

  //domaindata : any;
  //calDomainData : any;
  constructor()
  {
    //this.domaindata = data;
  }
  
  processData(data)
  {
    let ddata = [];
    for(let i=0; i < data.length; i++)      
    {
      ddata[i] = {};
      ddata[i].domain = data[i].domain;
      ddata[i].domainid = data[i].domainid;
      ddata[i].duration_avg = parseFloat(data[i].duration_avg);
      ddata[i].duration_count = parseInt(data[i].duration_count);
      ddata[i].redirection_avg = parseFloat(data[i].redirection_avg);
      ddata[i].redirection_count = parseInt(data[i].redirection_count);
      ddata[i].dns_avg = parseFloat(data[i].dns_avg);
      ddata[i].dns_count = parseInt(data[i].dns_count);
      ddata[i].tcp_avg = parseFloat(data[i].tcp_avg);
      ddata[i].tcp_count = parseInt(data[i].tcp_count);
      ddata[i].ssl_avg = parseFloat(data[i].ssl_avg);
      ddata[i].ssl_count = parseInt(data[i].ssl_count);
      ddata[i].wait_avg = parseFloat(data[i].wait_avg);
      ddata[i].wait_count = parseInt(data[i].wait_count);
      ddata[i].response_avg = parseFloat(data[i].response_avg);
      ddata[i].response_count = parseInt(data[i].response_count);
    }
    return ddata;
  }

  // return data to draw column bar chart for avg duration and domain
  getAvgDurationData(pct,calDomainData)
  {
    // sorting data in desending order w.r.t duration_avg
    let durationwise = [];
    let durationsorted = [];
    durationsorted = this.sortObj("duration_avg",calDomainData);
    let totalCount = durationsorted.length;
    let zeroCount = 0;
    let ignCount = 0;
    for(let i =0; i < durationsorted.length; i++)
    {
       if( 0 >= durationsorted[i].duration_avg || "0.00" == (durationsorted[i].duration_avg/1000).toFixed(2))
       {
         zeroCount ++; 
         continue;
       }
       if(parseInt(durationsorted[i].reqpct) < pct)// reqpct more than 5%
       {
         ignCount++;
         continue;
       }
       let obj = {};
       obj["name"] = durationsorted[i].domain;
       obj["id"] = durationsorted[i].domainid;
       obj["y"] = (durationsorted[i].duration_avg/1000);
       durationwise.push(obj);
    }  
    console.log("DurationData- totalCount: ", totalCount, "zeroCount: ",zeroCount, " ignCount: ",ignCount);
    return durationwise;  
  }
   // return data to draw column bar chart for avg wait and domain
  getAvgWaitData(pct,calDomainData)
  {
    // sorting data in desending order w.r.t wait_avg
    let waitwise = [];
    let waitsorted = [];
    waitsorted = this.sortObj("wait_avg",calDomainData);
    let totalCount = waitsorted.length;
    let zeroCount = 0;
    let ignCount = 0;
    for(let i =0; i < waitsorted.length; i++)
    {
       if( 0 >= waitsorted[i].wait_avg || "0.00" == (waitsorted[i].wait_avg/1000).toFixed(2))
       {
         zeroCount++;
         continue;
       }
       if(parseInt(waitsorted[i].reqpct) < pct)// reqpct more than 5%
       {
         ignCount++;
         continue;
       }
       let obj = {};
       obj["name"] = waitsorted[i].domain;
       obj["id"] = waitsorted[i].domainid;
       obj["y"] = (waitsorted[i].wait_avg/1000);
       waitwise.push(obj);
    } 
    console.log("WaitData- totalCount: ", totalCount, "zeroCount: ",zeroCount, " ignCount: ",ignCount); 
    return waitwise;  
  }
  getAvgDownloadData(pct,calDomainData)
  {
    // sorting data in desending order w.r.t response_avg
    let downloadwise = [];
    let downloadsorted = [];
    downloadsorted = this.sortObj("response_avg",calDomainData);
    let totalCount = downloadsorted.length;
    let zeroCount = 0;
    let ignCount = 0;
    for(let i =0; i < downloadsorted.length; i++)
    {
       if( 0 >= downloadsorted[i].response_avg || "0.00" == (downloadsorted[i].response_avg/1000).toFixed(2))
       {
         zeroCount++;
         continue;
       }
       if(parseInt(downloadsorted[i].reqpct) < pct)// reqpct more than 5%
       {
         ignCount++
         continue;
       }
       let obj = {};
       obj["name"] = downloadsorted[i].domain;
       obj["id"] = downloadsorted[i].domainid;
       obj["y"] = (downloadsorted[i].response_avg/1000);
       downloadwise.push(obj);
    } 
    console.log("DownloadData- totalCount: ", totalCount, "zeroCount: ",zeroCount, " ignCount: ",ignCount); 
    return downloadwise;  
  }
  getRequestCountData(domaindata)
  {
    // sorting data in desending order w.r.t duration_count
    let reqcountwise = [];
    let reqcountsorted = [];
    reqcountsorted = this.sortObj("duration_count",domaindata);
    for(let i =0; i < reqcountsorted.length; i++)
    {
       let obj = {};
       obj["name"] = reqcountsorted[i].domain;
       obj["y"] = parseInt(reqcountsorted[i].duration_count);
       reqcountwise.push(obj);
    }  
    return reqcountwise;  
  }

// it will return array indexes
  sortObj(val,d)
  { 
     let grp = d;
     let sortedIndex = [];
     sortedIndex = Object.keys(grp).sort(function(a,b){ 
       return parseFloat(grp[b][val]) - parseFloat(grp[a][val])});
     let newData = [];
     for(let i =0; i< sortedIndex.length; i++)
     {
       newData.push(grp[sortedIndex[i]]); 
     }
     return newData;
  }
  
  // calculate request count percentage for each domain
  calcPerc(domaindata)
  {
      let duration_count_wise = [];
      duration_count_wise = this.sortObj("duration_count",domaindata);
      let max_duration_count = parseInt(duration_count_wise[0].duration_count);
      console.log("max_duration_count :",max_duration_count);
      let d = domaindata;
      console.log("calcPerc, d.length : ", d.length, " d: ", d);
      for(let i =0; i < d.length; i++)
      {
         d[i]["reqpct"] = ((parseInt(d[i].duration_count) * 100) / max_duration_count);
      }
      console.log("calcPerc : ", d);
      return d;      
  }
}
