import { MenuItem } from 'primeng';

export interface GlobalDrillDownFilterData {

  filterSection?: GlobalDrillDownFilterSection[];
  health?: GlobalDrillDownFilterHealth[];
  errorsec?: GlobalDrillDownFilterOperator[];
  items?: MenuItem[];
}

export interface GlobalDrillDownFilterHealth {

  label: string;
  value: string;
}

export interface GlobalDrillDownFilterOperator {
  label: string;
  value: string;
}
export interface GlobalDrillDownFilterSection {
  name: string;
  data: GlobalDrillDownFilterArray[];

}
export interface GlobalDrillDownFilterArray {
  check: string;
  selectValues?: GlobalDrillDownFilterSelectValues[];
}
export interface GlobalDrillDownFilterSliderItems {
  label: string;
  items: GlobalDrillDownFilterItems[];

}
export interface GlobalDrillDownFilterSelectValues {

  label: string;
  value: string;
}
export interface GlobalDrillDownFilterItems {

  label: string;
  selected?: MenuItem;
  items?: GlobalDrillDownFilterSubItems[];
}
export interface GlobalDrillDownFilterSubItems {

  label: string;
  selected?: MenuItem;
}