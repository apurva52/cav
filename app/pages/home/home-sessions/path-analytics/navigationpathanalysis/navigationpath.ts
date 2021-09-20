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
 console.log("datain filling",datap);
 let datah = [];
 console.log('check',metadata);
 for(let i = 0;i<datap.data.Entries.length;i++)
 {
  let datak = {};
  datak["depth"] = 1;
  datak["source"] = metadata.pageNameMap.get(parseInt(datap.data.Entries[i].sourcePage)).name;
  datak["target"] = metadata.pageNameMap.get(parseInt(datap.data.Entries[i].targetPage)).name;
  datak["value"] = parseInt(datap.data.Entries[i].count);
  datah.push(datak);
  console.log(datak);
 }
 console.log(datah);
 for(var i = 0;i<datap.data.Exit.length;i++)
 {
  let datak = {};
  datak["depth"] = 2;
  datak["source"] = metadata.pageNameMap.get(parseInt(datap.data.Exit[i].sourcePage)).name;
  datak["target"] = metadata.pageNameMap.get(parseInt(datap.data.Exit[i].targetPage)).name;
  datak["value"] = parseInt(datap.data.Entries[i].count);
  datah.push(datak);
 }
return datah;
}

}

