export class CustomCorrelationData {
  constructor() { }
  processData(customdata) {
    let pieseries = [];
    let sessionCount = [];
    let pageviews = [];
    let ordertotal = [];
    let ordercount = [];
    let conversion = [];
    for (let i = 0; i < customdata.length; i++) {
      //data:[[],[],[]]
      let dd = [];
      dd.push(customdata[i].timestamp * 1000);
      dd.push(parseFloat(customdata[i].totalsession));
      sessionCount.push(dd);
      dd = [];
      dd.push(customdata[i].timestamp * 1000);
      dd.push(parseFloat(customdata[i].totalpages));
      pageviews.push(dd);
      dd = [];
      dd.push(customdata[i].timestamp * 1000);
      dd.push(parseFloat(customdata[i].ordertotal));
      ordertotal.push(dd);
      dd = [];
      dd.push(customdata[i].timestamp * 1000);
      dd.push(parseFloat(customdata[i].ordercount));
      ordercount.push(dd);
      dd = [];
      dd.push(customdata[i].timestamp * 1000);
      dd.push(parseFloat(customdata[i].conversionrate));
      conversion.push(dd);
    }
    sessionCount = sessionCount.sort((a, b) => (a[0] > b[0]) ? 1 : ((b[0] > a[0]) ? -1 : 0));
    pageviews = pageviews.sort((a, b) => (a[0] > b[0]) ? 1 : ((b[0] > a[0]) ? -1 : 0));
    ordertotal = ordertotal.sort((a, b) => (a[0] > b[0]) ? 1 : ((b[0] > a[0]) ? -1 : 0));
    ordercount = ordercount.sort((a, b) => (a[0] > b[0]) ? 1 : ((b[0] > a[0]) ? -1 : 0));
    conversion = conversion.sort((a, b) => (a[0] > b[0]) ? 1 : ((b[0] > a[0]) ? -1 : 0));
    let obj1 = {
      'name': 'Sessions',
      'type': 'spline',
      'yAxis': 0,
      'data': sessionCount,
    };
    let obj2 = {
      'name': 'Page views',
      'type': 'spline',
      'yAxis': 1,
      'data': pageviews,
    };
    let obj3 = {
      'name': 'Order Total',
      'type': 'spline',
      'yAxis': 2,
      'data': ordertotal,
    };
    let obj4 = {
      'name': 'Order Count',
      'type': 'spline',
      'yAxis': 3,
      'data': ordercount,
    };
    let obj5 = {
      'name': 'Conversion Rate',
      'type': 'spline',
      'yAxis': 4,
      'data': conversion,
    };
    pieseries.push(obj1, obj2, obj3, obj4, obj5);
    return pieseries;
  }
}
