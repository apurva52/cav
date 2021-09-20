import { Store } from "src/app/core/store/store";



export class visualLoadingState extends Store.AbstractLoadingState<any> {}
export class visualLoadingErrorState extends Store.AbstractErrorState<any> {}
export class visualLoadedState extends Store.AbstractIdealState<any> {}

export class mappingLoadingState extends Store.AbstractLoadingState<any> {}
export class mappingLoadingErrorState extends Store.AbstractErrorState<any> {}
export class mappingLoadedState extends Store.AbstractIdealState<any> {}