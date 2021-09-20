
export interface DrillDownFilterData {

  health?: DrillDownFilterHealth[];
  errorsec?: DrillDownFilterOperator[];
}

export interface DrillDownFilterHealth {

  label: string;
  value: string;
}

export interface DrillDownFilterOperator {

  label: string;
  value: string;
}