
export class GoalDataSource {
    goalid: any;
    name: any;
    Type: any;
    mode: any;
    value1: any;
    value2: any;
    varid: any;
    pagelist: any;
    pagearray: any;

    constructor(goalid, name, Type, mode, value1, value2, varid, pagelist, pagearray) {
        this.goalid = goalid;
        this.name = name;
        this.Type = Type;
        this.mode = mode;
        this.value1 = 0;
        this.value2 = value2;
        this.varid = varid;
        this.pagelist = pagelist;
        this.pagearray = pagearray;
    }

}

