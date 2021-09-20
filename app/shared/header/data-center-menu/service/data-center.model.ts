import { TestRun } from 'src/app/core/session/session.model';

export interface DataCenter {
  name: string;
  url: string;
  status: string;
  icon: string;
  testRun: TestRun;
  master: boolean;
  session: boolean;
}
