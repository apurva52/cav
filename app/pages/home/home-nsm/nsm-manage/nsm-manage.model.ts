
import { Table, TableHeaderColumn } from 'src/app/shared/table/table.model';

export interface CustomDataHeaderCols extends TableHeaderColumn { }

export interface CustomDataTableHeader {
    cols: CustomDataHeaderCols[];
}

export interface manageTable extends Table {
    headers?: CustomDataTableHeader[];
    data: any;


} 
export class addservermangedata{ 
   
   
    constructor(public name: string,
                public ip:any,
                public vendor:any,
                public location :any,
                public serverType:any,
                public state:any,
                public country:any,
                
        ){}
}  

export class editeservermagedata{
    constructor(
        public blade:string,
        public server: string,
        public allocation: string,
        public machineType: string,
        public securityGroup: string,
    ){}
}
export class deletservermagedata {
    constructor(
      
        public servername: string,
       
    ) { }
}
