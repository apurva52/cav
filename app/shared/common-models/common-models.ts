import { Subscription } from 'rxjs';


export type Timeouts = {[key: string]: NodeJS.Timeout};
export type Subscriptions = {[key: string]: Subscription};