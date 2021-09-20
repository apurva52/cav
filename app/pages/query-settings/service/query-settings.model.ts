import { Table, TableHeader } from 'src/app/shared/table/table.model';

export interface QueryTable extends Table {
    headers: TableHeader[];
    data: any;
}