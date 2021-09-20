import { Store } from "src/app/core/store/store";

export class SaveTemplateLoadingState extends Store.AbstractLoadingState<any> { }
export class SaveTemplateLoadingErrorState extends Store.AbstractErrorState<any> { }
export class SaveTemplateLoadedState extends Store.AbstractIdealState<any> { }