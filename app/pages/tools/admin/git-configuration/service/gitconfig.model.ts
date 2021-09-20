import { Table } from "src/app/shared/table/table.model";
export interface GitConfigTable extends Table {
}

export interface GitConfig {
  protocol: GitConfifbutton[];
}

export interface GitConfifbutton {
  label: string;
  value: string;
}

export interface responseForGit {
  data: any;
  rsTime: any;
}