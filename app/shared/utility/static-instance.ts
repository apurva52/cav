import { Subject, Observable } from "rxjs";


export class StaticInstance<T> {
    instance: T;
    instanceOutput: Subject<T> = null;

    getInstance(): Observable<T> {
        const me = this;
        const output = me.instanceOutput || new Subject<T>();

        if (me.instance) {
            setTimeout(() => {
                output.next(me.instance);
                me.instanceOutput = null;
            });
        } else {
            me.instanceOutput = output;
        }

        return output;
    }

    commitInstance(instance: T) {
        const me = this;
        me.instance = instance;
        if (me.instanceOutput) {
            me.instanceOutput.next(this.instance);
            me.instanceOutput = null;
        }
    }

}