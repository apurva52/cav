import { MenuItem } from "primeng";

export interface colorList extends MenuItem{
    orderList?: any;
    checkBoxList?: any;
    label?: string;
    color?: string;
    value?: string;
    pallets?: any;
}

// export interface pallets{
//     label?: string;
//     colorCode?: string[];
// }
