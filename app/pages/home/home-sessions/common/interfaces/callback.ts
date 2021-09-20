import { ActionApi } from './action-api';

export enum StateType {
  Start = 1,
  End,
  NORMAL
}

export enum FCNodeType {
  CONDITION = 0,
  ACTIONAPI
}

// It is just to remove node position and height/width.
export class JtkNodeParam {
  h: number;
  w: number;
  top?: number;
  left?: number;
}
/**
 *  type : state , w , h , left , top , text , id
    type: string = "state";
    w: number;
    h: number;
    left: number;
    top: number;
    text: string;
    id: string;
 */
export class State {

  constructor(
    public text: string,
    public type: number,
    public jData: JtkNodeParam,
    public id: string
  ) { }
}

export class Edges {
  constructor(
    public label: string,
    public title: string,
    public actionId: string,
    public triggerId: string
  ) { }
}

export class Trigger {
  constructor(
    public id: string,
    public name: string,
    public type: string,
    public stateId: string,
    public domSelector?: string,
    public urlPattern?: string,
    public timeOut?: number,
    public checkpoint?: any,
    public jData = new JtkNodeParam()
  ) { }
}

export class ConditionData {
  lhs: string;
  rhs: string;
  operator: string;
}

export class ConditionNode {
  constructor(
    public id: string,
    public text: string,
    public data: ConditionData,
    public dirty: boolean,
    public jData = new JtkNodeParam()
  ) { }
}

export class ActionApiData {
  // It will be actual api eg. CAVNV.utils.setCookie.
  // TODO: it is better to provide uniq id to each api and use it here.
  /*api: string;
  id: string;*/
  api: ActionApi;
  argument: Map<string, string>;
}

export class ActionNode {

  constructor(
    public id: string,
    public text: string,
    public data: ActionApiData,
    public dirty: boolean,
    public jData = new JtkNodeParam()
  ) { }
}

export class ActionEdge {
  source: string;
  target: string;
  data: Map<string, string>;
}

export class ActionData {
  // Condition node.
  cNodes: ConditionNode[] = [];
  // Action api node.
  aNOdes: ActionNode[] = [];
  edges: ActionEdge[] = [];
  startNodeJData: JtkNodeParam;
}

export class Action {

  constructor(
    public id: string,
    public name: string,
    public stateId: string,
    public triggerId: string,
    public dirty = false,
    public placeHolderNodes = 0,
    public data = new ActionData(),
    public jData = new JtkNodeParam()
  ) { }
}

export class DataPoint {
  attributeName: string;
  code: string;
  cookieName: string;
  cssSelector: string;
  elementStyle: string;
  index: string;
  name: string;
  pattern: string;
  patternIndex: string;
  property: string;
  source: string;
  urlProperty: string;
  value: string;
}

export class LocalVariable {
  name: string;
  // TODO:
  type?: number = 0;
}

/**This class is for storing callback's */
export class CallbackData {
  constructor(
    public name: string,
    public description: string,
    public type: number,
    public value: string,
    public pageid: string,
    public channel: number,
    public profilename: string,
    public jsondata: Callback,
    public callbackid?: number
  ) { }
}

export class Counter {
  constructor(
    public state: number,
    public trigger: number,
    public action: number,
    public condition: number,
    public api: number
  ) { }
}

export class Callback {
  dirty: boolean = false;
  counter: Counter = new Counter(1, 1, 1, 1, 1);
  states: State[] = [];
  edges: Edges[] = [];
  triggers: Trigger[] = [];
  actions: Action[] = [];
  // actionMap: Map<string, Map<string, string>> = new Map();
  dataPoints: DataPoint[] = [];
  localVariables: LocalVariable[] = [];

  constructor() {
    // Add start and end state.
    const startState = new State('start', StateType.Start, new JtkNodeParam(), 'start');
    const endState = new State('end', StateType.End, new JtkNodeParam(), 'end');

    this.states.push(startState);
    this.states.push(endState);
  }
}

export class AgentProfileData {
  constructor(
    public callbacks: ProfileCallback[]
  ) { };
}

export class ProfileCallback {
  constructor(
    public pi: string,
    public runAt: string,
    public callbackId: number,
    public data: Callback
  ) { }
}

