import { extend } from 'lodash';
import { Store } from 'src/app/core/store/store';
import { TemplateHeaderCols, TemplateTableHeader,TemplateTable, DeleteTemplate } from './template.model';

export class TemplateHeaderColsLoadingState extends Store.AbstractLoadingState<TemplateHeaderCols[]> { }
export class TemplateHeaderColsLoadingErrorState extends Store.AbstractErrorState<TemplateHeaderCols[]> { }
export class TemplateHeaderColsLoadedState extends Store.AbstractIdealState<TemplateHeaderCols[]> { }

export class TemplateTableHeaderLoadingState extends Store.AbstractLoadingState<TemplateTableHeader[]> { }
export class TemplateTableHeaderLoadingErrorState extends Store.AbstractErrorState<TemplateTableHeader[]> { }
export class TemplateTableHeaderLoadedState extends Store.AbstractIdealState<TemplateTableHeader[]> { }

export class TemplateTableLoadingState extends Store.AbstractLoadingState<TemplateTable[]> { }
export class TemplateTableLoadingErrorState extends Store.AbstractErrorState<TemplateTable[]> { }
export class TemplateTableLoadedState extends Store.AbstractIdealState<TemplateTable[]> { }

export class DeleteTemplateLoadingState extends Store.AbstractLoadingState<any>{ }
export class DeleteTemplateLoadingErrorState extends Store.AbstractErrorState<any> { }
export class DeleteTemplateLoadedState extends Store.AbstractIdealState<any>{ }

export class EditTemplateLoadingState extends Store.AbstractLoadingState<any>{ }
export class EditTemplateLoadingErrorState extends Store.AbstractErrorState<any> { }
export class EditTemplateLoadedState extends Store.AbstractIdealState<any>{ }

export class onDownloadLoadingState extends Store.AbstractLoadingState<any>{}
export class onDownloadLoadedState extends Store.AbstractLoadingState<any>{}
export class onDownloadLoadingErrorState extends Store.AbstractLoadingState<any>{}
