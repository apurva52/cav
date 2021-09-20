export class PageDataSource {
    pagename: any;
    pagenamemethod: any;
    pattern: any;
    variablename: any;
    pageid: any;
    completeurlflag: any;
    constructor(pagename, pagenamemethod, pattern, variablename, pageid, completeurlflag) {
        this.pagename = pagename;
        this.pagenamemethod = pagenamemethod;
        this.pattern = pattern;
        this.variablename = variablename;
        this.pageid = pageid;
        this.completeurlflag = completeurlflag;
    }
}
