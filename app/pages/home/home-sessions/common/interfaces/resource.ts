export class ResourceName {
  id: number;
  name: string;
  // TODO: handle it properly.

  constructor(dbRecord: any) {
    this.id = dbRecord.id;
    this.name = dbRecord.name;
    // TODO: handle for other parameters.
  }
}

export class Resource {
  startTime: any;
  endTime: any;
  constructor(st, et) {
    this.startTime = st;
    this.endTime = et;
  }

}

