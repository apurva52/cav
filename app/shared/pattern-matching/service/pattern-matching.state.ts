import { Store } from 'src/app/core/store/store';
import { SelectItem } from 'primeng';
import { graphData, groupData } from '../../derived-metric/service/derived-metric.model';
import { PatternMatchMetaDataResponseDTO } from '../pattern-matching.model';
import { SaveCatlogueResponse } from '../catalogue-management/service/catalogue-management.model';

export class CategoryLoadedState extends Store.AbstractIdealState<SelectItem[]> { }
export class patternMatchingGroupCreatingState extends Store.AbstractLoadingState<groupData> { }
export class patternMatchingGroupCreatingErrorState extends Store.AbstractErrorState<groupData> { }
export class patternMatchingGroupCreatedState extends Store.AbstractIdealState<groupData> { }

export class  patternMatchingGraphCreatingState extends Store.AbstractLoadingState<graphData> { }
export class  patternMatchingGraphCreatingErrorState extends Store.AbstractErrorState<graphData> { }

export class  patternMatchingGraphCreatedState extends Store.AbstractIdealState<graphData> { }

export class  matchPatternCreatingState extends Store.AbstractLoadingState<PatternMatchMetaDataResponseDTO> { }
export class  matchPatternCreatingErrorState extends Store.AbstractErrorState<PatternMatchMetaDataResponseDTO> { }

export class  matchPatternCreatedState extends Store.AbstractIdealState<PatternMatchMetaDataResponseDTO> { }

export class  saveCatalogueCreatingState extends Store.AbstractLoadingState<SaveCatlogueResponse> { }
export class  saveCatalogueCreatingErrorState extends Store.AbstractErrorState<SaveCatlogueResponse> { }

export class  saveCatalogueCreatedState extends Store.AbstractIdealState<SaveCatlogueResponse> { }


export class getCatalogueCreatingState  extends Store.AbstractLoadingState<SaveCatlogueResponse> { }
export class getCatalogueCreatedState  extends Store.AbstractLoadingState<SaveCatlogueResponse> { }
export class getCatalogueCreatingErrorState  extends Store.AbstractLoadingState<SaveCatlogueResponse> { }

export class updateCatalogueCreatingState  extends Store.AbstractLoadingState<SaveCatlogueResponse> { }
export class updateCatalogueCreatedState  extends Store.AbstractLoadingState<SaveCatlogueResponse> { }
export class updateCatalogueCreatingErrorState  extends Store.AbstractLoadingState<SaveCatlogueResponse> { }

export class deleteCatalogueCreatingState  extends Store.AbstractLoadingState<SaveCatlogueResponse> { }
export class deleteCatalogueCreatedState  extends Store.AbstractLoadingState<SaveCatlogueResponse> { }
export class deleteCatalogueCreatingErrorState  extends Store.AbstractLoadingState<SaveCatlogueResponse> { }


