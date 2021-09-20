export class BusinessprocessDataSource {
    bpid: any;
    bpname: any;
    description: any;
    channel: any;
    usersegmentid: any;
    activech: any;
    checkoutfunnelflag: any;
    lastmodified: any;
    bppagelist: any;
    bppositionlist: any;

    constructor(bpid, bpname, description, channel, usersegmentid, activech, checkoutfunnelflag, bppagelist, bppositionlist) {
        this.bpid = bpid;
        this.bpname = bpname;
        this.description = description;
        this.channel = channel;
        this.usersegmentid = usersegmentid;
        this.activech = activech;
        this.checkoutfunnelflag = checkoutfunnelflag;
        //this.lastmodified = lastmodified;
        this.bppagelist = bppagelist;
        this.bppositionlist = bppositionlist;
    }
}

