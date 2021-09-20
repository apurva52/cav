export class NavigationPath
{

data: any;
metadata: any;

constructor(data,metadata)
{
 this.data = data;
 this.metadata = metadata;
}

static fillingdata(datap,metadata)
{
 let datah = [];
 let depth = 0;
 for(let i = 0;i<datap.data.Entries.length;i++)
 {
  let datak = {};
  datak["depth"] = 1;
  if(datap.data.Entries[i].sourcePage == -2)
  {
     datak["source"] = "(start)";
  }
  else
   datak["source"] = metadata.getPageName(parseInt(datap.data.Entries[i].sourcePage)).name;
  datak["target"] = metadata.getPageName(parseInt(datap.data.Entries[i].targetPage)).name;
  datak["value"] = parseInt(datap.data.Entries[i].count);
  datah.push(datak);
 }
 for(var i = 0;i<datap.data.Exit.length;i++)
 {
  let datak = {};
  if(datap.data.Entries.length == 0)
   datak["depth"] = 1;
  else
   datak["depth"] = 2;
  datak["source"] = metadata.getPageName(parseInt(datap.data.Exit[i].sourcePage)).name;
  datak["target"] = metadata.getPageName(parseInt(datap.data.Exit[i].targetPage)).name;
  datak["value"] = parseInt(datap.data.Exit[i].count);
  datah.push(datak);
 }
return datah;
}

}

