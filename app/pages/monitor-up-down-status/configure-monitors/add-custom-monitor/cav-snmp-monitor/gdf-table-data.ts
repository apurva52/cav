export class GdfTableData
{
 searchPattern:string;    //these are gdf fields for log pattern monitor
 graphName:string;
 unit:string = "PerSec";
 fieldType:string ="Field Number";        //these are gdf fields for log data monitor
 fieldNumber:string;
 pattern:string;
 dataType:string = "sample";
 formulaType:string = "None";
 formulaValue:string;
 /**
  * Added below field for custom Monitor(eg: SNMP Monitor)
  */
 oid:string;
 type:string = "cumulative";
 rel:string = "Yes"; 
 formulae:string="NA";   
 fVal:string = '';
 grN:string;
 grphDesc:string;
}

export class ImmutableArray {
    //to add data in table
        static push(arr, newEntry) {
            return [...arr, newEntry]
        }
    //to delete from table
        static delete(arr, index) {
            return arr.slice(0, index).concat(arr.slice(index + 1))
        }
    
        /**
         * arr = Main Data list
         * newEntry = For entry
         * index = For replace index
         */
    
    //to edit table data
        static replace(arr, newEntry, index){
             arr[index] = newEntry;
             return arr.slice();
        }
    
        static unshift(arr, newEntry) {
            return [newEntry, ...arr]
        }
    
        static splice(arr, start, deleteCount, ...items) {
            return [...arr.slice(0, start), ...items, ...arr.slice(start + deleteCount)]
        }
    
    
    }
