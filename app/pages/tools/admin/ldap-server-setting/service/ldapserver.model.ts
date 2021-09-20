import { Table } from "src/app/shared/table/table.model";
export interface LdapServerSettingTable extends Table {
}

export interface LdapServerSetting {
  LDAPDomainName: string;
  LDAPHostName: string;
  LDAPBindPwd: string;
  LDAPBindDName: string;
  LDAPBindUserId: string;
}

export interface LDAPRequest {
  cctx: Cctx;
  LDAPDomainName: string;
  LDAPHostName: string;
  LDAPBindPwd: string;
  LDAPBindDName: string;
  LDAPBindUserId: string;
}

export interface Cctx {
  cck?: string,
  pk?: string,
  u?: string,
  prodType?: string,

}

export interface GitConfifbutton {
  label: string;
  value: string;
}

export interface responseForGit {
  data: any;
  rsTime: any;
}