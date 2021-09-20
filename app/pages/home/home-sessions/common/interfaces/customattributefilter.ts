import { CustomData } from './customdata';

export class CustomAttributeFilter {
  count: number;
  filters: CustomData[];
  operator: string;

  constructor() {
    this.count = 0;
    this.filters = [];
    this.operator = ' ';
  }
}
