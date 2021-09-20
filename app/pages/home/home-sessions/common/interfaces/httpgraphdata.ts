export class HttpScatterGraphData
{
  title = "";
  subtitle = "";
  xtype = "Start Time";
  ytype =  " (sec)";
  pointFormat = '<font style="font-size:10px;"><br>'
              + 'Domain : {point.domain}<br>'
              + 'URL : {point.url} <br>'
              + 'Start Time : {point.timestamp} <br>'
              + 'Method : {point.method} <br>'
              + 'Status Code : {point.statuscode} <br>'
              + 'Bytes Transferred : {point.bytestransferred} <br>'
              + 'HttpResponsetime : {point.httpResponsetime} sec<br>'
              + 'pageName: {point.pageName} <br>'
              + 'ConnectionType : {point.connectionType} <br>'
              + 'Location : {point.location} <br>'
              + 'CorrelationId : {point.correlationId} <br>'
              + 'Device Type : {point.devicetype} <br>'
              + 'Browser : {point.browser} <br>'
              + 'OS: {point.os}<br>'
              + 'Store Id: {point.storeid} <br>'
              + 'Terminal Id : {point.terminalid} </font>'
  series = [];
  data = [[]];
  outliers = 0;
  constructor(ytype,data,metric,outlier)
  {
    this.ytype = ytype +  this.ytype;
    //this.pointFormat = ytype + this.pointFormat;
    this.series.push({"name" : "Http Request", "data" : []});
    for(let i = 0; i < data.length; i++)
    {
         if((data[i]["httpResponsetime"]/1000) > outlier)
         {
           this.outliers++;
           continue;
         }
         let tmp = {};
         let URL = "";
         if(JSON.parse(decodeURIComponent(data[i]["data"])).url !== null && JSON.parse(decodeURIComponent(data[i]["data"])).url !== undefined)
         {
           var a = JSON.parse(decodeURIComponent(data[i]["data"])).url;
            var b = '';
            if(a.includes("//"))
             {
               b = a.split("//")[1];
             }
            else
             {
               b = a;
             }
            let completeResource  =  "/"+b.split(/\/(.+)/)[1];
      
            if(completeResource.length > 41)
             {
              URL = completeResource.substr(0, 40) + "...";
             }
            else
             {
              URL =  completeResource;
             }
        }
        else
         {
             URL = "";
         }
         tmp = {
                 x : ((parseInt(data[i]["sessionstarttime"])+1388534400) * 1000),
                 y : data[i]["httpResponsetime"]/1000,
                 domain: data[i]["domain"],
                 url : URL,
                 timestamp : data[i]["timestamp"],
                 method : data[i]["method"],
                 statuscode : ""+data[i]["statuscode"],
                 bytestransferred : ""+data[i]["bytestransferred"],
                 httpResponsetime : data[i]["httpResponsetime"]/1000,
                 pageName : data[i]["pageName"],
                 connectionType : data[i]["connectionType"],
                 location : data[i]["location"],
  		 correlationId : data[i]["correlationId"],
		 devicetype : data[i]["devicetype"],
		 browser : data[i]["browser"],
		 os : data[i]["os"],
		 storeid : (data[i]["storeid"] != -1 ? ""+data[i]["storeid"] : " -"),
                 terminalid : (data[i]["terminalid"] != -1 ? ""+data[i]["terminalid"] : " -")
              };
           this.series[0].data.push(tmp);
           this.data[0].push(data[i]);
    }
    console.log("this.series http scatter graphdata : ",this.series);
  }


}

