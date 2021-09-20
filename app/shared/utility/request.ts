import { Subscription, Observable } from 'rxjs';

export namespace RequestUtility {

    const requestSubscriptionMap: {[key: string]: Subscription} = {};

    function getKey(payload: any, path: string): string {
        return JSON.stringify(payload) + path;
    }

    export function openRequest(payload: any, path: string, subscription: Subscription) {
        const key: string = getKey(payload, path);

        if(requestSubscriptionMap[key]) {
            requestSubscriptionMap[key].unsubscribe();
        }

        requestSubscriptionMap[key] = subscription;
    }

    export function closeRequest(payload: any, path: string) {
        const key: string = getKey(payload, path);

        if(requestSubscriptionMap[key]) {
            requestSubscriptionMap[key].unsubscribe();
        }
    }

    

}