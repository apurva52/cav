export class CustomPieChartProcessData {
  constructor()
  { }

  processData(customdata)
  {
     let pieseries = [];
     let reqcountsorted = [];
     reqcountsorted = this.sortObj("count",customdata);
    for(let i =0; i < reqcountsorted.length; i++)
    {  
       let obj = {}; 
       obj["name"] = ""+reqcountsorted[i].customdata;
       obj["y"] = parseInt(reqcountsorted[i].count);
       pieseries.push(obj);
    }  
   return pieseries;
  }
  sortObj(val,d)
   {
     let grp = d;
     let sortedIndex = [];
     sortedIndex = Object.keys(grp).sort(function(a,b){
       return parseInt(grp[b][val]) - parseInt(grp[a][val])});
     let newData = [];
     for(let i =0; i< sortedIndex.length; i++)
     {
       newData.push(grp[sortedIndex[i]]);
     }
     return newData;
  }

}
