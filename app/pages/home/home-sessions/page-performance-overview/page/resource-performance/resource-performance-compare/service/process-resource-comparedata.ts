import { Extension } from './extension';
export class ProcessResourceCompareData {

  rdata: any;
  formattedData: any;
  totalCount: number;
  constructor(data) {
    this.rdata = this.processData(data);
    this.totalCount = this.getTotalCount();
    this.formattedData = this.getFormattedData();
  }

  processData(data) {
    let rdata = [];
    for (let i = 0; i < data.length; i++) {
      rdata[i] = {};
      rdata[i]["resourceName"] = this.getFileNameForTiming(data[i].resource);
      rdata[i]["resource"] = data[i].resource;
      rdata[i]["resourceid"] = data[i].resourceId;
      rdata[i]["domain"] = data[i].domain;
      rdata[i]["domainid"] = data[i].domainId;
      rdata[i]["duration"] = parseFloat(data[i].duration.avg);
      rdata[i]["download"] = parseFloat(data[i].download.avg);
      rdata[i]["count"] = parseInt(data[i].count);
      rdata[i]["wait"] = parseFloat(data[i].wait.avg);
      rdata[i]["redirection"] = parseFloat(data[i].redirection.avg);
      rdata[i]["dns"] = parseFloat(data[i].dns.avg);
      rdata[i]["connection"] = parseFloat(data[i].connection.avg);
    }
    return rdata;
  }

  getFileNameForTiming(url1) {
    let aa = document.createElement('a');
    aa.href = url1;
    let finalurl = aa.pathname;

    if (finalurl.indexOf(";") > -1)
      finalurl = finalurl.substring(0, finalurl.indexOf(";"));

    let fields = finalurl.split("/");
    let l = fields.length - 1;
    while (l) {
      if (fields[l] != "" && fields[l] != "*")
        return fields[l];
      l--;
    }
    return finalurl;
  }


  getTotalCount() {
    let tc = 0;
    for (let i = 0; i < this.rdata.length; i++) {
      tc += parseInt(this.rdata[i].count);
    }
    return tc;
  }

  /* format : [
                 {
                   contentType : "",
                   count : 0,
                   countPct : 10,
                   avgDuration : 12
                 },
                 ...
              ]
  */
  getFormattedData() {
    if (this.rdata == null)
      return;
    let ext = new Extension();
    let obj = {};
    for (let i = 0; i < this.rdata.length; i++) {
      let contentType = ext.getExtension(this.rdata[i].resource, "null");
      if (!obj.hasOwnProperty(contentType)) {
        obj[contentType] = {};
        obj[contentType]["sum"] = parseFloat(this.rdata[i].duration);
        obj[contentType]["total"] = 1;
        obj[contentType]["count"] = parseInt(this.rdata[i].count);
        obj[contentType]["countpct"] = ((parseInt(this.rdata[i].count) * 100) / this.totalCount).toFixed(2);
        obj[contentType]["duration"] = parseFloat(this.rdata[i].duration);
        obj[contentType]["avgDuration"] = obj[contentType]["sum"] / obj[contentType]["total"];
      }
      else {
        obj[contentType]["sum"] = parseFloat(obj[contentType]["sum"]) + parseFloat(this.rdata[i].duration);
        obj[contentType].total++;
        obj[contentType]["count"] = parseInt(this.rdata[i].count) + parseInt(obj[contentType]["count"]);
        obj[contentType]["countpct"] = ((obj[contentType]["count"] * 100) / this.totalCount).toFixed(2);
        obj[contentType]["avgDuration"] = (obj[contentType]["sum"] / obj[contentType]["total"]).toFixed();
      }
    }
    return obj;
  }
  getPieTableData() {
    let tdata = [];
    for (let i = 0; i < Object.keys(this.formattedData).length; i++) {
      let obj = {};
      obj["contentType"] = Object.keys(this.formattedData)[i];
      obj["count"] = parseInt(this.formattedData[Object.keys(this.formattedData)[i]].count);
      obj["countpct"] = parseFloat(this.formattedData[Object.keys(this.formattedData)[i]].countpct);
      obj["avgDuration"] = parseFloat(this.formattedData[Object.keys(this.formattedData)[i]].avgDuration);
      tdata.push(obj);
    }
    return tdata;
  }
  getPieData() {
    let pdata = [];
    for (let i = 0; i < Object.keys(this.formattedData).length; i++) {
      let obj = {};
      obj["name"] = Object.keys(this.formattedData)[i];
      obj["y"] = this.formattedData[Object.keys(this.formattedData)[i]].count;
      obj["duration"] = "duration 1";
      pdata.push(obj);
    }
    return pdata;
  }
  getPieData2() {
    let pdata = [];
    for (let i = 0; i < Object.keys(this.formattedData).length; i++) {
      let obj = {};
      obj["duration"] = "duration 2";
      obj["name"] = Object.keys(this.formattedData)[i];
      obj["y"] = this.formattedData[Object.keys(this.formattedData)[i]].count;
      pdata.push(obj);
    }
    return pdata;
  }
}

