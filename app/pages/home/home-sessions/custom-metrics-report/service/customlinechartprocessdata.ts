export class CustomLineChartProcessData {
  constructor()
  { }
  processData(customdata)
  {
     let pieseries = [];
     for(let i =0 ; i< customdata.length ; i++)
      {
           let ddd = [];
           let cusname = "";
           let  customarrindex = customdata[i]; 
           for(let k =0 ; k< customarrindex.length ; k++)
           {
           let s = [];
           cusname = customarrindex[k].value;
           let datetime = customarrindex[k].timestamp * 1000;
           s.push(datetime);
           s.push(parseFloat(customarrindex[k].count));
           ddd.push(s);
           }
           ddd = ddd.sort((a,b) => (a[0] > b[0]) ? 1 : ((b[0] > a[0]) ? -1 : 0));
           let obj1 = {
             'name' : ""+cusname,
             'data' : ddd,
           }
           pieseries.push(obj1);
           
      }     
     return pieseries;
  }
   
}
