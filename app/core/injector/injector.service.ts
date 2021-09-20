import { Injector, Type, InjectionToken, AbstractType, InjectFlags } from '@angular/core';

export class InjectorResolver {

    private static i: Injector;

    static construct(i: Injector) {
        if (i) {
            InjectorResolver.i = i;
        } else {
            throw new Error('Injector missing');
        }
    }

    static get<T>(token: Type<T> | InjectionToken<T> | AbstractType<T>, notFoundValue?: T, flags?: InjectFlags): T {
        if (InjectorResolver.i) {
            return InjectorResolver.i.get(token, notFoundValue, flags);
        } else {
            return notFoundValue;
        }
    }


}
