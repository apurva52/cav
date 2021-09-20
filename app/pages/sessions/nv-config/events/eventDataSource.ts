export class EventDataSource {
    description: any;
    id: any;
    name: any;
    StrugglingEvent: any;
    Icons: any;
    goal: any;
    constructor(description, name, StrugglingEvent, Icons, goal, id) {
        this.description = description;
        this.name = name;
        this.StrugglingEvent = StrugglingEvent;
        this.Icons = Icons;
        this.goal = goal;
        this.id = id;
    }
}
