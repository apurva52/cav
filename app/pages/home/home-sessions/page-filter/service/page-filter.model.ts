import { ClientCTX } from 'src/app/core/session/session.model';
import {
  TableHeaderColumn,
  Table,
} from 'src/app/shared/table/table.model';

export interface PageFilterTableHeaderColumn extends TableHeaderColumn {
  iconField?: boolean;
  severityColorField?: boolean;
}

export interface PageFilterTableHeader {
  cols: PageFilterTableHeaderColumn[];
}

export interface PageFilterTable extends Table {
  headers?: PageFilterTableHeader[];
  data: any;
  severityBgColorField?: string;
  filtermode: any;
}

export class ScatteredPlotData {
  title = '';
  subtitle = '';
  xtype = 'Navigation Start Time';
  ytype = ' (sec)';
  pointFormat = '<font style="font-size:10px;"><br>'
    + '<b>{point.pageName}</b><br>'
    + 'Onload : {point.onload} sec<br>'
    + 'Time to DOM Interactive : {point.ttdi} sec<br>'
    + 'Time to Content Loaded : {point.ttdl} sec<br>'
    + 'DOM Complete : {point.dom} sec<br>'
    + 'Perceived Render Time : {point.prt} sec<br>'
    + 'Unload : {point.unload} sec<br>'
    + 'Redirection : {point.redirect} sec<br>'
    + 'Cache : {point.cache} sec<br>'
    + 'DNS : {point.dns} sec<br>'
    + 'TCP : {point.tcp} sec<br>'
    + 'SSL : {point.ssl} sec<br>'
    + 'Wait : {point.wait} sec<br>'
    + 'Base Page Download : {point.download} sec<br>'
    + 'First Byte : {point.ttfb} sec<br>'
    + 'First Paint : {point.fp} sec <br>'
    + 'First Content Paint : {point.fcp} sec <br>'
    + 'Time to Interactive : {point.tti} sec <br>'
    + 'First Input Delay : {point.fid} sec <br></font>'
    + '<font style="font-size:8px;">Click to open session</font>';
  series = [];
  data = [[], []];
  pageViews = 0;
  outliers = 0;

  constructor(ytype, data, metadata, metric, outlier) {
    this.ytype = ytype + this.ytype;
    // this.pointFormat = ytype + this.pointFormat;
    this.series.push({ name: 'Pages With Resource Timings', data: [] });
    this.series.push({ name: 'Pages Without Resource Timings', data: [] });
    for (const i of data) {
      this.pageViews++;
      if ((i[metric] / 1000) > outlier) {
        this.outliers++;
        continue;
      }
      let tmp = {};
      tmp = {
        x: ((parseInt(i[0]) + 1388534400) * 1000),
        y: i[metric] / 1000,
        onload: i[6] / 1000,
        ttdi: i[7] / 1000,
        ttdl: i[8] / 1000,
        dom: i[9] / 1000,
        prt: i[10] / 1000,
        unload: i[11] / 1000,
        redirect: i[12] / 1000,
        cache: i[13] / 1000,
        dns: i[14] / 1000,
        tcp: i[15] / 1000,
        ssl: i[16] / 1000,
        wait: i[17] / 1000,
        download: i[18] / 1000,
        pageName: i[19],
        ttfb: i[21] / 1000,
        fp: i[22] / 1000,
        fcp: i[23] / 1000,
        tti: i[24] / 1000,
        fid: i[25] / 1000
      };
      if (i[5] == 1 || i[5] == 3) {
        this.series[0].data.push(tmp);
        this.data[0].push(i);
      }
      else {
        this.series[1].data.push(tmp);
        this.data[1].push(i);
      }
    }
  }


}


export class PercentilePlot {
  percentile = [10, 20, 30, 40, 50, 60, 70, 75, 80, 90, 95, 99, 100];
  series = [];
  title = '';
  yType = '';
  constructor(ytype, data, metric) {
    this.title = 'Percentile Graph on ' + ytype;
    this.yType = ytype + '(sec)';
    // sort the data on the basis of selected perf. metric
    data.sort((a, b) => a[metric] - b[metric]);

    // identify records to percent contribution
    const percentileCoeff = (data.length / 100);

    // create series on percentile list.
    for (let i = 0; i < this.percentile.length; i++) {
      this.series.push({ x: this.percentile[i], y: Number(this.getPercentileValue(i, data, percentileCoeff, metric)) / 1000 });
    }
    console.log('series', this.series);
  }

  getPercentileValue(percentileIndex, data, percentileCoeff, metric) {
    try {
      if (this.percentile[percentileIndex] === 100) {
        return data[data.length - 1][metric];
      }
      const index = Math.floor(percentileCoeff * this.percentile[percentileIndex]);
      if (data[index] !== undefined) {
        return data[index][metric];
      }
      return 0;
    }
    catch (e) { return 0; }
  }
}
export interface AutoCompleteData {
  autocompleteData?: any;
}

