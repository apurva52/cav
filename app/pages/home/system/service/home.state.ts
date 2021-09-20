import { Store } from "src/app/core/store/store";
import { Status } from "src/app/pages/my-library/dashboards/service/dashboards.model";

export class HomeStateLoadingStatus extends Store.AbstractLoadingState<Status> {}
export class HomeStateLoadingErrorStatus extends Store.AbstractLoadingState<Status> {}
export class HomeStateLoadedStatus extends Store.AbstractIdealState<Status> {}