export class UserSegmentDataSource
{
type : any;
arg1 : any;
arg2 : any;
description : any;
name : any;
icons : any;
pageidlist : any;
usersegmentid : any;
constructor(type,arg1,arg2,pageidlist,icons,name,description,usersegmentid)
{
this.icons = icons;
this.name = name;
this.description = description;
this.arg1 = arg1;
this.arg2 = arg2;
this.type = type;
this.pageidlist = pageidlist;
this.usersegmentid = usersegmentid;
}
}
