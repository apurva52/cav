import { data } from 'jquery';
import { SelectItem } from 'primeng';
import { TableHeader } from 'src/app/shared/table/table.model';
import { InfoData } from 'src/app/shared/dialogs/informative-dialog/service/info.model';
import { Cctx } from "../../my-library/alert/service/alert.model";

export interface SettingsTable {
  standerd: SelectItem[];
  domain: SelectItem[];
  headers?: TableHeader[];
  data: any;
}

export interface Credentials {
  oldPassword : string,
  newPassword : string
}

export const CONTENT: InfoData = {
  title: 'Error',
  information: 'Not a valid condition.',
  button: 'Ok'
}

export interface SecureConnOption
{
  label: string;
  value: string;
}

export interface StdCarrierOption
{
  label: string;
  value: string;
}

export interface StdCarrierGateway
{
  name: string;
  value: string;
}

export interface MailSMSConfig
{
  userName: string;
  host: string;
  port: number;
  secConn: string;
  authReq: boolean;
  secAuth: boolean;
  user: string;
  pwd: string;
  smsCType: number;
  sms: string[];
  sendTo: string;
}

export interface MailSMSConfigRequest{
  cctx: Cctx;
  status: Status;
  config: MailSMSConfig;
}

export interface MailSMSConfigResponse{
  cctx: Cctx;
  status: Status;
  config: MailSMSConfig;
}

export interface Status {
	code?: number;
	msg?: string;
	detailedMsg?: string;
}

