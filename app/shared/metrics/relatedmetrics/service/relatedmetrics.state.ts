import { Store } from 'src/app/core/store/store';
import { RelatedMetricsTable } from './relatedmetrics.model';
import {CatalougeResponseDTO } from './relatedmetrics.model';
import { CatalogueTableData, SaveCatalogue, SaveCatlogueResponse } from '../../../../shared/pattern-matching/catalogue-management/service/catalogue-management.model';

export class RelatedMetricsLoadingState extends Store.AbstractLoadingState<RelatedMetricsTable> {}
export class RelatedMetricsLoadingErrorState extends Store.AbstractErrorState<RelatedMetricsTable> {}
export class RelatedMetricsLoadedState extends Store.AbstractIdealState<RelatedMetricsTable> {}

export class  saveCatalogueLoadingState extends Store.AbstractLoadingState<SaveCatlogueResponse> { }
export class  saveCatalogueLoadingErrorState extends Store.AbstractErrorState<SaveCatlogueResponse> { }

export class  saveCatalogueLoadedState extends Store.AbstractIdealState<SaveCatlogueResponse> { }


export class getCatalogueLoadingState  extends Store.AbstractLoadingState<CatalougeResponseDTO> { } 
export class getCatalogueLoadedState  extends Store.AbstractLoadingState<CatalougeResponseDTO> { }
export class getCatalogueLoadingErrorState  extends Store.AbstractLoadingState<CatalougeResponseDTO> { } 
