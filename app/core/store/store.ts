import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NGXLogger } from 'ngx-logger';
import { EventEmitter, Type } from '@angular/core';
import { InjectorResolver } from '../injector/injector.service';
import { AppError } from '../error/error.model';


// tslint:disable-next-line: no-namespace
export namespace Store {

    export type Path = (() => string) | string;

    export type APIConfig = {
        base?: Path;
        endpoint?: Path;
        defaultBase?: Path;
    };

    export type APIConfigGroup = { [key: string]: Store.APIConfig };

    export interface Config {
        api?: APIConfig;
    }

    export interface State {
        loading: boolean;
        error: Error | AppError;
    }

    export abstract class AbstractState<T> implements State {
        data: null | T;
        loading: boolean;
        error: Error | AppError;
        constructor(data?: T) {
            this.loading = false;
            this.error = null;
            this.data = data || null;
        }
    }

    export abstract class AbstractIdealState<T> extends AbstractState<T> {
        constructor(data?: T) {
            super(data);
        }
    }

    export abstract class AbstractErrorState<T> extends AbstractState<T> {
        constructor(error: Error | AppError, data?: T) {
            super(data);
            this.error = error;
        }
    }
    export abstract class AbstractLoadingState<T> extends AbstractState<T> {
        constructor(data?: T) {
            super(data);
            this.loading = true;
            this.error = null;
        }
    }

    export interface Service {
        config: Config;
    }

    export abstract class AbstractService implements Service {

        config: Store.Config;
        protected controller: Store.Controller;
        protected logger: NGXLogger;

        constructor() {
            this.logger = InjectorResolver.get(NGXLogger);
            this.controller = new Store.Controller(this);
        }

    }

    export class Controller {
        private http: HttpClient;

        constructor(
            protected service: Store.Service
        ) {
            this.http = InjectorResolver.get(HttpClient);
        }

        public get(path: Path, data?: any, base?: Path): Observable<any> {
            const options = this.getDefaultGetRequestHttpOptions();
            options.params = data;
            return this.http.get<any>(this.urlWithBase(path, base), options);
        }

        public put(path: Path, data: any, base?: Path): Observable<any> {
            return this.http.put<any>(this.urlWithBase(path, base), data);
        }

        public post(path: Path, data?: any, base?: Path, options?: any): Observable<any> {
            return this.http.post<any>(this.urlWithBase(path, base), data, options);
        }

        public postReceiveBlob(path: Path, data?: any, base?: Path): Observable<any> {
            return this.http.post(this.urlWithBase(path, base), data, { responseType: 'blob' });
        }

        public delete(path: Path, base?: Path): Observable<any> {
            return this.http.delete<any>(this.urlWithBase(path, base));
        }

        public urlWithBase(path: Path, base?: Path): string {
            return this.url(path, base);
        }

        public url(path: Path, base?: Path): string {
            const me = this;

            if (base) {
                base = me.resolvePath(base);
            } else if (me.service.config && me.service.config.api && me.service.config.api.base) {
                base = me.resolvePath(me.service.config.api.base);
            } else if (environment.api.core.base) {
                base = me.resolvePath(environment.api.core.base);
            }

            return base + me.sanitiseURL(me.resolvePath(path));
        }

        public getDefaultGetRequestHttpOptions() {
            return {
                headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
                params: null
            };
        }

        public replaceVariables(path: Path, variables: { [key: string]: string }) {
            const me = this;
            let newPath;

            newPath = me.resolvePath(path);

            Object.keys(variables).forEach((variable: string) => {
                newPath.replace('{' + variable + '}', variables[variable]);
            });

            return newPath;
        }

        private resolvePath(path: Path): string {
            const me = this;
            if (!path) {
                return undefined;
            }
            if (typeof path === 'function') {
                path = path.call(me);
            }
            return path as string;
        }

        private sanitiseURL(url: string): string {
            return url.replace(/\/+/gi, '/');
        }
    }
}
