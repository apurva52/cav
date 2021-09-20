import { AppError } from 'src/app/core/error/error.model';

export interface MessageOptions {
    align?: 'topLeft' | 'topCenter' | 'topRight' | 'middleLeft' | 'middleCenter' | 'middleRight' | 'bottomLeft' | 'bottomCenter' | 'bottomRight';
    type?: 'error' | 'success' | 'info' | 'warning' | 'empty' | 'neutral';
    label?: string;
    error?: AppError;
    toast?: true | false;
    loader?: true | false;
    size?: 'small' | 'medium' | 'large';
    showLoaderText?: true | false;
    loaderText?: string;
}
